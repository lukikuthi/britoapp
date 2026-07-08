import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Tipos para Materiais
export interface MaterialRequisicao {
  id: string;
  obra_id: string;
  autor_id: string;
  numero_sequencial: number;
  status: "rascunho" | "solicitado" | "aprovado" | "comprado" | "entregue" | "cancelado";
  prioridade: "baixa" | "normal" | "alta" | "urgente";
  data_necessidade: string | null;
  observacoes: string | null;
  created_at: string;
  updated_at: string;
}

export interface MaterialItem {
  id: string;
  requisicao_id: string;
  descricao: string;
  quantidade: number;
  unidade: string;
  status: "pendente" | "comprado" | "entregue" | "cancelado";
  created_at: string;
  updated_at: string;
}

export interface RequisicaoCompleta extends MaterialRequisicao {
  itens: MaterialItem[];
}

export function useMateriaisRequisicoes(obraId: string) {
  return useQuery({
    queryKey: ["materiais-requisicoes", obraId],
    queryFn: async () => {
      // 1. Buscar Requisições
      const { data: requisicoes, error: errReq } = await (supabase as any)
        .from("materiais_requisicoes")
        .select("*")
        .eq("obra_id", obraId)
        .order("created_at", { ascending: false });

      if (errReq) throw errReq;
      if (!requisicoes?.length) return [];

      const reqIds = requisicoes.map((r: any) => r.id);

      // 2. Buscar Itens
      const { data: itens, error: errItens } = await (supabase as any)
        .from("materiais_itens")
        .select("*")
        .in("requisicao_id", reqIds);

      if (errItens) throw errItens;

      // 3. Montar a árvore
      return requisicoes.map((req: any) => ({
        ...req,
        itens: (itens ?? []).filter((i: any) => i.requisicao_id === req.id),
      })) as RequisicaoCompleta[];
    },
  });
}

export function useCreateRequisicao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      obra_id: string;
      prioridade?: string;
      data_necessidade?: string;
      observacoes?: string;
      itens: Array<{ descricao: string; quantidade: number; unidade: string }>;
    }) => {
      // Create req
      const { data: reqData, error: reqErr } = await (supabase as any)
        .from("materiais_requisicoes")
        .insert({
          obra_id: payload.obra_id,
          autor_id: (await supabase.auth.getUser()).data.user?.id,
          prioridade: payload.prioridade || "normal",
          data_necessidade: payload.data_necessidade || null,
          observacoes: payload.observacoes || null,
          status: "solicitado"
        })
        .select()
        .single();

      if (reqErr) throw reqErr;

      if (payload.itens.length > 0) {
        const itensToInsert = payload.itens.map(item => ({
          requisicao_id: reqData.id,
          descricao: item.descricao,
          quantidade: item.quantidade,
          unidade: item.unidade,
        }));

        const { error: itemErr } = await (supabase as any)
          .from("materiais_itens")
          .insert(itensToInsert);

        if (itemErr) throw itemErr;
      }

      return reqData;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["materiais-requisicoes", variables.obra_id] });
    },
  });
}

export function useUpdateRequisicaoStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, obraId, status }: { id: string; obraId: string; status: string }) => {
      const { data, error } = await (supabase as any)
        .from("materiais_requisicoes")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["materiais-requisicoes", variables.obraId] });
    },
  });
}
