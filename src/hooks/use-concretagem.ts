import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Concretagem {
  id: string;
  obra_id: string;
  data: string;
  fornecedor: string | null;
  nota_fiscal: string | null;
  placa_caminhao: string | null;
  volume_m3: number | null;
  fck_projeto: number | null;
  slump_test: string | null;
  local_lancamento: string | null;
  rastreabilidade_corpos_prova: any | null;
  status: 'agendado' | 'em_andamento' | 'concluido' | 'cancelado';
  observacoes: string | null;
  created_at?: string;
  updated_at?: string;
}

export type InsertConcretagem = Omit<Concretagem, "id" | "created_at" | "updated_at">;
export type UpdateConcretagem = Partial<InsertConcretagem>;

export function useConcretagens(obraId: string | undefined) {
  return useQuery({
    queryKey: ["concretagens", obraId],
    queryFn: async () => {
      if (!obraId) return [];

      const { data, error } = await supabase
        .from("obra_concretagem" as any)
        .select("*")
        .eq("obra_id", obraId)
        .order("data", { ascending: false });

      if (error) {
        console.error("Erro ao buscar concretagens:", error);
        throw error;
      }

      return data as Concretagem[];
    },
    enabled: !!obraId,
  });
}

export function useCreateConcretagem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (novaConcretagem: InsertConcretagem) => {
      const { data, error } = await supabase
        .from("obra_concretagem" as any)
        .insert([novaConcretagem])
        .select()
        .single();

      if (error) {
        console.error("Erro ao criar concretagem:", error);
        throw error;
      }

      return data as Concretagem;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["concretagens", variables.obra_id] });
    },
  });
}

export function useUpdateConcretagem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateConcretagem & { id: string }) => {
      const { data, error } = await supabase
        .from("obra_concretagem" as any)
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Erro ao atualizar concretagem:", error);
        throw error;
      }

      return data as Concretagem;
    },
    onSuccess: (data) => {
      if (data?.obra_id) {
        queryClient.invalidateQueries({ queryKey: ["concretagens", data.obra_id] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["concretagens"] });
      }
    },
  });
}

export function useDeleteConcretagem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const { error } = await supabase
        .from("obra_concretagem" as any)
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Erro ao deletar concretagem:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["concretagens"] });
    },
  });
}
