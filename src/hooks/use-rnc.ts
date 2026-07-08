import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ObraRnc {
  id: string;
  obra_id: string;
  descricao: string;
  causa_raiz: string | null;
  acao_corretiva: string | null;
  prazo_resolucao: string | null;
  data_fechamento: string | null;
  status: 'aberta' | 'em_andamento' | 'fechada' | 'cancelada';
  observacoes: string | null;
  created_at: string;
  updated_at: string;
}

export type CreateObraRnc = Omit<ObraRnc, 'id' | 'created_at' | 'updated_at'>;
export type UpdateObraRnc = Partial<CreateObraRnc>;

export function useRncs(obraId: string) {
  return useQuery({
    queryKey: ["obra-rnc", obraId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("obra_rnc" as any)
        .select("*")
        .eq("obra_id", obraId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar RNCs:", error);
        throw error;
      }
      return data as ObraRnc[];
    },
    enabled: !!obraId,
  });
}

export function useCreateRnc() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (novaRnc: CreateObraRnc) => {
      const { data, error } = await supabase
        .from("obra_rnc" as any)
        .insert([novaRnc])
        .select()
        .single();

      if (error) {
        console.error("Erro ao criar RNC:", error);
        throw error;
      }
      return data as ObraRnc;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["obra-rnc", variables.obra_id] });
    },
  });
}

export function useUpdateRnc() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & UpdateObraRnc) => {
      const { data, error } = await supabase
        .from("obra_rnc" as any)
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Erro ao atualizar RNC:", error);
        throw error;
      }
      return data as ObraRnc;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["obra-rnc", data.obra_id] });
    },
  });
}

export function useDeleteRnc() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error, data } = await supabase
        .from("obra_rnc" as any)
        .delete()
        .eq("id", id)
        .select('obra_id')
        .single();

      if (error) {
        console.error("Erro ao deletar RNC:", error);
        throw error;
      }
      return data;
    },
    onSuccess: (data) => {
      if (data?.obra_id) {
        queryClient.invalidateQueries({ queryKey: ["obra-rnc", data.obra_id] });
      }
    },
  });
}
