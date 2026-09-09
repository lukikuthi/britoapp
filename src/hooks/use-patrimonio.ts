import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// ==========================
// EQUIPAMENTOS
// ==========================
export function useEquipamentos() {
  return useQuery({
    queryKey: ["patrimonio-equipamentos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cad_equipamentos")
        .select("*")
        .order("nome", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

export function useAdicionarEquipamento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (novo: any) => {
      const { data, error } = await supabase.from("cad_equipamentos").insert(novo).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Equipamento cadastrado com sucesso!");
      qc.invalidateQueries({ queryKey: ["patrimonio-equipamentos"] });
    },
    onError: (e: Error) => toast.error(`Erro: ${e.message}`)
  });
}

// ==========================
// MOVIMENTAÇÃO (Empréstimos)
// ==========================
export function useMovimentacoesAtivas() {
  return useQuery({
    queryKey: ["patrimonio-movimentacoes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("equipamentos_movimentacao")
        .select("*, equipamento:cad_equipamentos(nome, codigo_patrimonio), obra:obras(nome), responsavel:rh_funcionarios(nome)")
        .filter("data_devolucao", "is", null) // Pega apenas os que estão em uso
        .order("data_retirada", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useRegistrarRetirada() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (retirada: any) => {
      // 1. Grava a movimentacao
      const { data, error } = await supabase.from("equipamentos_movimentacao").insert(retirada).select().single();
      if (error) throw error;
      
      // 2. Muda status do equipamento para 'em_uso'
      await supabase.from("cad_equipamentos").update({ status: 'em_uso' }).eq("id", retirada.equipamento_id);
      
      return data;
    },
    onSuccess: () => {
      toast.success("Retirada registrada!");
      qc.invalidateQueries({ queryKey: ["patrimonio-equipamentos"] });
      qc.invalidateQueries({ queryKey: ["patrimonio-movimentacoes"] });
    },
    onError: (e: Error) => toast.error(`Erro: ${e.message}`)
  });
}

export function useRegistrarDevolucao() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ movimentacao_id, equipamento_id, condicao_devolucao }: any) => {
      const { data, error } = await supabase.from("equipamentos_movimentacao")
        .update({ data_devolucao: new Date().toISOString(), condicao_devolucao })
        .eq("id", movimentacao_id).select().single();
      if (error) throw error;
      
      // Volta pra 'disponivel' (ou manutencao se quebrou)
      const novoStatus = condicao_devolucao?.toLowerCase().includes('quebrad') ? 'manutencao' : 'disponivel';
      await supabase.from("cad_equipamentos").update({ status: novoStatus }).eq("id", equipamento_id);
      
      return data;
    },
    onSuccess: () => {
      toast.success("Devolução registrada!");
      qc.invalidateQueries({ queryKey: ["patrimonio-equipamentos"] });
      qc.invalidateQueries({ queryKey: ["patrimonio-movimentacoes"] });
    },
    onError: (e: Error) => toast.error(`Erro: ${e.message}`)
  });
}

// ==========================
// MANUTENÇÕES (Oficina)
// ==========================
export function useManutencoes() {
  return useQuery({
    queryKey: ["patrimonio-manutencoes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patrimonio_manutencoes")
        .select("*, equipamento:cad_equipamentos(nome, codigo_patrimonio, status)")
        .order("data_ida", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useEnviarOficina() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ equipamento_id, motivo }: { equipamento_id: string, motivo: string }) => {
      // 1. Cria a manutenção
      const { error: manError } = await supabase.from("patrimonio_manutencoes").insert({
        equipamento_id,
        motivo,
        status: 'na_oficina'
      });
      if (manError) throw manError;

      // 2. Muda status da máquina
      const { error: eqError } = await supabase.from("cad_equipamentos").update({
        status: 'manutencao'
      }).eq("id", equipamento_id);
      if (eqError) throw eqError;
    },
    onSuccess: () => {
      toast.success("Equipamento enviado para a oficina!");
      qc.invalidateQueries({ queryKey: ["patrimonio-manutencoes"] });
      qc.invalidateQueries({ queryKey: ["patrimonio-equipamentos"] });
    },
    onError: (e: Error) => toast.error(`Erro: ${e.message}`)
  });
}

export function useRetornarOficina() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, equipamento_id, custo_reparo, statusFinal }: { id: string, equipamento_id: string, custo_reparo: number, statusFinal: 'consertado' | 'sucata' }) => {
      // 1. Atualiza a manutenção
      const { error: manError } = await supabase.from("patrimonio_manutencoes").update({
        custo_reparo,
        status: statusFinal,
        data_retorno: new Date().toISOString()
      }).eq("id", id);
      if (manError) throw manError;

      // 2. Muda status da máquina
      const { error: eqError } = await supabase.from("cad_equipamentos").update({
        status: statusFinal === 'consertado' ? 'disponivel' : 'quebrado'
      }).eq("id", equipamento_id);
      if (eqError) throw eqError;
    },
    onSuccess: () => {
      toast.success("Retorno registrado com sucesso!");
      qc.invalidateQueries({ queryKey: ["patrimonio-manutencoes"] });
      qc.invalidateQueries({ queryKey: ["patrimonio-equipamentos"] });
    },
    onError: (e: Error) => toast.error(`Erro: ${e.message}`)
  });
}
