import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface LaudoEnsaio {
  id: string;
  obra_id: string;
  disciplina: string;
  tipo_ensaio: string;
  arquivo_path: string;
  data_ensaio: string;
  status_aprovacao: "pendente" | "aprovado" | "reprovado";
  aprovado_por: string | null;
  observacoes: string | null;
  created_at: string;
  updated_at: string;
}

export function useLaudos(obraId: string) {
  return useQuery({
    queryKey: ["laudos-ensaios", obraId],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("laudos_ensaios")
        .select("*")
        .eq("obra_id", obraId)
        .order("data_ensaio", { ascending: false });

      if (error) throw error;
      return data as LaudoEnsaio[];
    },
  });
}

export function useCreateLaudo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      obra_id: string;
      disciplina: string;
      tipo_ensaio: string;
      data_ensaio: string;
      observacoes?: string;
      file: File;
    }) => {
      // 1. Upload File
      const fileExt = payload.file.name.split('.').pop();
      const fileName = `${payload.obra_id}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadErr } = await supabase.storage
        .from("laudos-ensaios")
        .upload(fileName, payload.file);

      if (uploadErr) throw uploadErr;

      // 2. Create DB Record
      const { data, error } = await (supabase as any)
        .from("laudos_ensaios")
        .insert({
          obra_id: payload.obra_id,
          disciplina: payload.disciplina,
          tipo_ensaio: payload.tipo_ensaio,
          data_ensaio: payload.data_ensaio,
          observacoes: payload.observacoes || null,
          arquivo_path: fileName,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["laudos-ensaios", variables.obra_id] });
    },
  });
}

export function useUpdateLaudoStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, obraId, status }: { id: string; obraId: string; status: string }) => {
      const { data, error } = await (supabase as any)
        .from("laudos_ensaios")
        .update({
          status_aprovacao: status,
          aprovado_por: status === "pendente" ? null : (await supabase.auth.getUser()).data.user?.id,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["laudos-ensaios", variables.obraId] });
    },
  });
}

export function useDeleteLaudo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, obraId, arquivoPath }: { id: string; obraId: string; arquivoPath: string }) => {
      const { error: storageErr } = await supabase.storage
        .from("laudos-ensaios")
        .remove([arquivoPath]);

      if (storageErr) throw storageErr;

      const { error } = await (supabase as any)
        .from("laudos_ensaios")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["laudos-ensaios", variables.obraId] });
    },
  });
}
