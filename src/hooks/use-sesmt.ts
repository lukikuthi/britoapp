import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SesmtDds {
  id: string;
  obra_id: string;
  data: string;
  tema: string;
  instrutor: string;
  arquivo_lista_presenca: string | null;
  observacoes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SesmtEpi {
  id: string;
  obra_id: string;
  funcionario: string;
  equipamento: string;
  ca_numero: string | null;
  data_entrega: string;
  data_devolucao: string | null;
  termo_assinado_path: string | null;
  created_at: string;
  updated_at: string;
}

export function useSesmtDds(obraId: string) {
  return useQuery({
    queryKey: ["sesmt-dds", obraId],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("sesmt_dds")
        .select("*")
        .eq("obra_id", obraId)
        .order("data", { ascending: false });

      if (error) throw error;
      return data as SesmtDds[];
    },
  });
}

export function useCreateDds() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      obra_id: string;
      data: string;
      tema: string;
      instrutor: string;
      observacoes?: string;
      file?: File | null;
    }) => {
      let arquivoPath = null;
      
      if (payload.file) {
        const fileExt = payload.file.name.split('.').pop();
        arquivoPath = `${payload.obra_id}/dds/${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadErr } = await supabase.storage
          .from("sesmt-arquivos")
          .upload(arquivoPath, payload.file);

        if (uploadErr) throw uploadErr;
      }

      const { data, error } = await (supabase as any)
        .from("sesmt_dds")
        .insert({
          obra_id: payload.obra_id,
          data: payload.data,
          tema: payload.tema,
          instrutor: payload.instrutor,
          observacoes: payload.observacoes || null,
          arquivo_lista_presenca: arquivoPath,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["sesmt-dds", variables.obra_id] });
    },
  });
}

export function useSesmtEpis(obraId: string) {
  return useQuery({
    queryKey: ["sesmt-epis", obraId],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("sesmt_epis")
        .select("*")
        .eq("obra_id", obraId)
        .order("data_entrega", { ascending: false });

      if (error) throw error;
      return data as SesmtEpi[];
    },
  });
}

export function useCreateEpi() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      obra_id: string;
      funcionario: string;
      equipamento: string;
      ca_numero?: string;
      data_entrega: string;
      file?: File | null;
    }) => {
      let arquivoPath = null;
      
      if (payload.file) {
        const fileExt = payload.file.name.split('.').pop();
        arquivoPath = `${payload.obra_id}/epis/${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadErr } = await supabase.storage
          .from("sesmt-arquivos")
          .upload(arquivoPath, payload.file);

        if (uploadErr) throw uploadErr;
      }

      const { data, error } = await (supabase as any)
        .from("sesmt_epis")
        .insert({
          obra_id: payload.obra_id,
          funcionario: payload.funcionario,
          equipamento: payload.equipamento,
          ca_numero: payload.ca_numero || null,
          data_entrega: payload.data_entrega,
          termo_assinado_path: arquivoPath,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["sesmt-epis", variables.obra_id] });
    },
  });
}
