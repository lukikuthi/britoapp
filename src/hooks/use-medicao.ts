import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/* ─── Types ─── */

export interface MedicaoItem {
  id: string;
  obra_id: string;
  numero_item: number;
  descricao: string;
  quantidade_total: number;
  grupo: string | null;
  ordem: number;
  created_at: string;
  updated_at: string;
}

export interface Medicao {
  id: string;
  item_id: string;
  numero_medicao: number;
  data_referencia: string | null;
  quantidade_executada: number;
  criado_por: string | null;
  created_at: string;
}

export interface MedicaoItemWithMedicoes extends MedicaoItem {
  medicoes: Medicao[];
  total_executado: number;
  saldo: number;
  progresso_pct: number;
}

/* ─── Hooks ─── */

/**
 * Busca todos os itens de medição de uma obra, com suas medições.
 * Calcula total_executado, saldo e progresso no frontend.
 */
export function useMedicaoItens(obraId: string) {
  return useQuery({
    queryKey: ["medicao-itens", obraId],
    enabled: !!obraId,
    queryFn: async (): Promise<MedicaoItemWithMedicoes[]> => {
      // 1. Buscar itens
      const { data: itens, error: itensErr } = await supabase
        .from("obra_medicao_itens" as any)
        .select("*")
        .eq("obra_id", obraId)
        .order("ordem", { ascending: true });
      if (itensErr) throw itensErr;
      if (!itens?.length) return [];

      // 2. Buscar todas as medições desses itens
      const itemIds = itens.map((i: any) => i.id);
      const { data: medicoes, error: medErr } = await supabase
        .from("obra_medicoes" as any)
        .select("*")
        .in("item_id", itemIds)
        .order("numero_medicao", { ascending: true });
      if (medErr) throw medErr;

      // 3. Montar mapa de medições por item_id
      const medMap = new Map<string, Medicao[]>();
      for (const m of (medicoes ?? []) as Medicao[]) {
        const arr = medMap.get(m.item_id) ?? [];
        arr.push(m);
        medMap.set(m.item_id, arr);
      }

      // 4. Calcular campos derivados
      return (itens as MedicaoItem[]).map((item) => {
        const meds = medMap.get(item.id) ?? [];
        const total_executado = meds.reduce((sum, m) => sum + Number(m.quantidade_executada), 0);
        const saldo = Number(item.quantidade_total) - total_executado;
        const progresso_pct = Number(item.quantidade_total) > 0
          ? (total_executado / Number(item.quantidade_total)) * 100
          : 0;
        return {
          ...item,
          quantidade_total: Number(item.quantidade_total),
          medicoes: meds,
          total_executado,
          saldo,
          progresso_pct,
        };
      });
    },
  });
}

/**
 * Cria uma nova medição para um item.
 */
export function useCreateMedicao() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      item_id: string;
      numero_medicao: number;
      data_referencia: string;
      quantidade_executada: number;
      obraId: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("obra_medicoes" as any)
        .insert({
          item_id: payload.item_id,
          numero_medicao: payload.numero_medicao,
          data_referencia: payload.data_referencia,
          quantidade_executada: payload.quantidade_executada,
          criado_por: user?.id ?? null,
        })
        .select()
        .single();
      if (error) throw error;
      return data as Medicao;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["medicao-itens", vars.obraId] });
    },
  });
}

/**
 * Deleta uma medição.
 */
export function useDeleteMedicao() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string; obraId: string }) => {
      const { error } = await supabase
        .from("obra_medicoes" as any)
        .delete()
        .eq("id", payload.id);
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["medicao-itens", vars.obraId] });
    },
  });
}

/**
 * Importa itens em lote (substitui todos os existentes da obra).
 */
export function useImportItens() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      obraId: string;
      itens: Array<{
        numero_item: number;
        descricao: string;
        quantidade_total: number;
        grupo: string | null;
        ordem: number;
      }>;
    }) => {
      // 1. Deletar itens antigos (cascade deleta medições)
      const { error: delErr } = await supabase
        .from("obra_medicao_itens" as any)
        .delete()
        .eq("obra_id", payload.obraId);
      if (delErr) throw delErr;

      // 2. Inserir novos
      if (payload.itens.length > 0) {
        const rows = payload.itens.map((it) => ({
          obra_id: payload.obraId,
          numero_item: it.numero_item,
          descricao: it.descricao,
          quantidade_total: it.quantidade_total,
          grupo: it.grupo,
          ordem: it.ordem,
        }));
        const { error: insErr } = await supabase
          .from("obra_medicao_itens" as any)
          .insert(rows);
        if (insErr) throw insErr;
      }
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["medicao-itens", vars.obraId] });
    },
  });
}

/**
 * Limpa todos os itens e medições de uma obra.
 */
export function useClearMedicao() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (obraId: string) => {
      const { error } = await supabase
        .from("obra_medicao_itens" as any)
        .delete()
        .eq("obra_id", obraId);
      if (error) throw error;
    },
    onSuccess: (_, obraId) => {
      qc.invalidateQueries({ queryKey: ["medicao-itens", obraId] });
    },
  });
}

