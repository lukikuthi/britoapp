import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BoletimMedicao {
  id: string;
  obra_id: string;
  empreiteiro: string;
  data_medicao: string;
  periodo_inicio: string;
  periodo_fim: string;
  status: 'rascunho' | 'emitido' | 'aprovado';
}

export interface BoletimItem {
  id: string;
  boletim_id: string;
  eap_id: string;
  avanco_medido_pct: number;
}

export interface EapItem {
  id: string;
  codigo: string;
  descricao: string;
  progresso_pct: number;
}

export function useBoletins(obraId: string) {
  return useQuery({
    queryKey: ["boletins", obraId],
    enabled: !!obraId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("obra_boletins_medicao" as any)
        .select("*")
        .eq("obra_id", obraId)
        .order("data_medicao", { ascending: false });
      if (error) throw error;
      return data as BoletimMedicao[];
    },
  });
}

export function useBoletimItens(boletimId: string) {
  return useQuery({
    queryKey: ["boletim_itens", boletimId],
    enabled: !!boletimId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("obra_boletins_itens" as any)
        .select("*")
        .eq("boletim_id", boletimId);
      if (error) throw error;
      return data as BoletimItem[];
    },
  });
}

export function useEapList() {
  return useQuery({
    queryKey: ["obra_eap"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("obra_eap" as any)
        .select("*")
        .order("codigo", { ascending: true });
      if (error) throw error;
      return data as EapItem[];
    },
  });
}

export function useCreateBoletim() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<BoletimMedicao, "id" | "status">) => {
      const { data, error } = await supabase
        .from("obra_boletins_medicao" as any)
        .insert({
          ...payload,
          status: 'rascunho',
        })
        .select()
        .single();
      if (error) throw error;
      return data as BoletimMedicao;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["boletins", vars.obra_id] });
    },
  });
}

export function useUpdateBoletimItens() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ boletim_id, items }: { boletim_id: string; items: { eap_id: string; avanco_medido_pct: number }[] }) => {
      const { error: deleteError } = await supabase
        .from("obra_boletins_itens" as any)
        .delete()
        .eq("boletim_id", boletim_id);
      if (deleteError) throw deleteError;

      if (items.length > 0) {
        const payload = items.map(item => ({
          boletim_id,
          eap_id: item.eap_id,
          avanco_medido_pct: item.avanco_medido_pct,
        }));
        const { error: insertError } = await supabase
          .from("obra_boletins_itens" as any)
          .insert(payload);
        if (insertError) throw insertError;
      }
      return true;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["boletim_itens", vars.boletim_id] });
    },
  });
}
