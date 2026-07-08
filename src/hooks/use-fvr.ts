import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Fvr {
  id: string;
  obra_id: string;
  item_id: string;
  nota_fiscal: string | null;
  quantidade_recebida: number;
  status_qualidade: "aprovado" | "rejeitado" | "aprovado_parcial";
  observacoes: string | null;
  created_at: string;
  updated_at: string;
  materiais_itens?: {
    descricao: string;
    unidade: string;
    quantidade: number;
  };
}

export function useFvrs(obraId: string) {
  return useQuery({
    queryKey: ["fvrs", obraId],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("materiais_fvr")
        .select(`
          *,
          materiais_itens:item_id (
            descricao,
            unidade,
            quantidade
          )
        `)
        .eq("obra_id", obraId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Fvr[];
    },
    enabled: !!obraId,
  });
}

export function useFvrItensDisponiveis(obraId: string) {
  return useQuery({
    queryKey: ["fvr-itens-disponiveis", obraId],
    queryFn: async () => {
      // Find requisicoes for this obra
      const { data: requisicoes, error: errReq } = await (supabase as any)
        .from("materiais_requisicoes")
        .select("id")
        .eq("obra_id", obraId);
        
      if (errReq) throw errReq;
      if (!requisicoes?.length) return [];
      
      const reqIds = requisicoes.map((r: any) => r.id);
      
      // Find itens that are 'comprado' or 'entregue'
      const { data: itens, error: errItens } = await (supabase as any)
        .from("materiais_itens")
        .select("*")
        .in("requisicao_id", reqIds)
        .in("status", ["comprado", "entregue"]);
        
      if (errItens) throw errItens;
      return itens as any[];
    },
    enabled: !!obraId,
  });
}

export function useCreateFvr() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      obra_id: string;
      item_id: string;
      nota_fiscal?: string;
      quantidade_recebida: number;
      status_qualidade: string;
      observacoes?: string;
    }) => {
      const { data, error } = await (supabase as any)
        .from("materiais_fvr")
        .insert({
          obra_id: payload.obra_id,
          item_id: payload.item_id,
          nota_fiscal: payload.nota_fiscal || null,
          quantidade_recebida: payload.quantidade_recebida,
          status_qualidade: payload.status_qualidade,
          observacoes: payload.observacoes || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["fvrs", variables.obra_id] });
    },
  });
}

export function useUpdateFvr() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, obraId, ...payload }: { id: string; obraId: string; [key: string]: any }) => {
      const { data, error } = await (supabase as any)
        .from("materiais_fvr")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["fvrs", variables.obraId] });
    },
  });
}

export function useDeleteFvr() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, obraId }: { id: string; obraId: string }) => {
      const { error } = await (supabase as any)
        .from("materiais_fvr")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return { id, obraId };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["fvrs", variables.obraId] });
    },
  });
}
