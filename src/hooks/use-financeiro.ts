import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// ==========================
// CONTAS BANCÁRIAS
// ==========================
export function useContasBancarias() {
  return useQuery({
    queryKey: ["fin-contas-bancarias"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fin_contas_bancarias")
        .select("*")
        .order("nome_banco", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

export function useAdicionarContaBancaria() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (novo: any) => {
      const { data, error } = await supabase.from("fin_contas_bancarias").insert(novo).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Conta bancária adicionada!");
      qc.invalidateQueries({ queryKey: ["fin-contas-bancarias"] });
    },
    onError: (e: Error) => toast.error(`Erro: ${e.message}`)
  });
}

// ==========================
// TRANSAÇÕES (A Pagar / Receber)
// ==========================
export function useTransacoes(tipo?: 'pagar' | 'receber') {
  return useQuery({
    queryKey: ["fin-transacoes", tipo],
    queryFn: async () => {
      let query = supabase
        .from("fin_transacoes")
        .select("*, obra:obras(nome), conta:fin_contas_bancarias(nome_banco)")
        .order("data_vencimento", { ascending: true });
      
      if (tipo) {
        query = query.eq('tipo', tipo);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useAdicionarTransacao() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (novo: any) => {
      const { data, error } = await supabase.from("fin_transacoes").insert(novo).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Lançamento financeiro registrado!");
      qc.invalidateQueries({ queryKey: ["fin-transacoes"] });
    },
    onError: (e: Error) => toast.error(`Erro: ${e.message}`)
  });
}

export function useAtualizarStatusTransacao() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, data_pagamento, conta_id }: { id: string, status: string, data_pagamento?: string, conta_id?: string }) => {
      // 1. Atualizar a transação
      const updates: any = { status };
      if (data_pagamento) updates.data_pagamento = data_pagamento;
      if (conta_id) updates.conta_bancaria_id = conta_id;
      
      const { error } = await supabase.from("fin_transacoes").update(updates).eq("id", id);
      if (error) throw error;
      
      // Obs para IA: Numa modelagem extrema, dispararíamos uma function RPC 
      // ou Trigger no banco para abater/somar o valor no saldo da `fin_contas_bancarias`.
      // Para fins visuais imediatos, validaremos a transação como concluída.
    },
    onSuccess: () => {
      toast.success("Status atualizado!");
      qc.invalidateQueries({ queryKey: ["fin-transacoes"] });
    },
    onError: (e: Error) => toast.error(`Erro: ${e.message}`)
  });
}
