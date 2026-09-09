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
        .select("*, obra:obras(nome), conta:fin_contas_bancarias(nome_banco), categoria:fin_categorias(nome, cor), rateios:fin_transacoes_rateio(*, obra:obras(nome))")
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
      // Regra de negócios: Despesas acima de 5000 precisam de aprovação da diretoria
      if (novo.tipo === 'pagar' && novo.valor >= 5000) {
        novo.status_aprovacao = 'pendente';
      } else {
        novo.status_aprovacao = 'nao_requerida';
      }
      
      // Separa rateios se existirem
      const rateios = novo.rateios;
      delete novo.rateios;

      const { data, error } = await supabase.from("fin_transacoes").insert(novo).select().single();
      if (error) throw error;
      
      // Insere os rateios se houver
      if (rateios && rateios.length > 0) {
        const insertRateios = rateios.map((r: any) => ({
          transacao_id: data.id,
          obra_id: r.obra_id,
          valor_rateado: r.valor_rateado,
          percentual: r.percentual
        }));
        const { error: ratErr } = await supabase.from("fin_transacoes_rateio").insert(insertRateios);
        if (ratErr) throw ratErr;
      }
      
      // Se precisar de aprovação, avisa a diretoria
      if (novo.status_aprovacao === 'pendente') {
        await supabase.from("mensagens_setor").insert({
          de_modulo: 'financeiro',
          para_modulo: 'diretoria',
          mensagem: `Solicitação automática de aprovação de pagamento: ${novo.fornecedor_cliente} (R$ ${novo.valor}). ID da Transação: ${data.id}`
        });
        
        await supabase.from("notificacoes").insert({
          modulo_alvo: 'diretoria',
          titulo: 'Aprovação Financeira Pendente',
          mensagem: `Nova despesa de R$ ${novo.valor} aguardando aprovação.`,
          link_url: '/diretoria?tab=aprovacoes'
        });
      }
      
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
    mutationFn: async ({ id, status, valor_pago, data_pagamento, conta_id, anexo_nf_url }: { id: string, status: string, valor_pago?: number, data_pagamento?: string, conta_id?: string, anexo_nf_url?: string }) => {
      const payload: any = { status };
      if (valor_pago !== undefined) payload.valor_pago = valor_pago;
      if (data_pagamento !== undefined) payload.data_pagamento = data_pagamento;
      if (conta_id !== undefined) payload.conta_bancaria_id = conta_id;
      if (anexo_nf_url !== undefined) payload.anexo_nf_url = anexo_nf_url;

      const { data, error } = await supabase.from("fin_transacoes").update(payload).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Pagamento/Status atualizado!");
      qc.invalidateQueries({ queryKey: ["fin-transacoes"] });
    },
    onError: (e: Error) => toast.error(`Erro: ${e.message}`)
  });
}

// ==========================
// CATEGORIAS (DRE)
// ==========================
export function useCategorias() {
  return useQuery({
    queryKey: ["fin-categorias"],
    queryFn: async () => {
      const { data, error } = await supabase.from("fin_categorias").select("*").order("nome");
      if (error) throw error;
      return data;
    },
  });
}

// ==========================
// LOGS / TIMELINE DA TRANSAÇÃO
// ==========================
export function useTransacaoLogs(transacaoId: string) {
  return useQuery({
    queryKey: ["fin-transacao-logs", transacaoId],
    enabled: !!transacaoId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fin_transacoes_logs")
        .select("*, autor:profiles(nome)")
        .eq("transacao_id", transacaoId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useAdicionarLogTransacao() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (novo: { transacao_id: string, mensagem: string }) => {
      const { data: userData } = await supabase.auth.getUser();
      const { data, error } = await supabase.from("fin_transacoes_logs").insert({
        ...novo,
        autor_id: userData.user?.id
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      toast.success("Anotação adicionada!");
      qc.invalidateQueries({ queryKey: ["fin-transacao-logs", variables.transacao_id] });
    },
    onError: (e: Error) => toast.error(`Erro ao adicionar anotação: ${e.message}`)
  });
}

// ==========================
// FATURAMENTO E MEDIÇÃO (V6)
// ==========================
export function useFaturamentosObra(obraId: string) {
  return useQuery({
    queryKey: ["fin-faturamento", obraId],
    queryFn: async () => {
      if (!obraId) return { clientes: [], terceiros: [] };

      const { data: clientes, error: errC } = await supabase
        .from("obras_medicoes_clientes")
        .select("*, transacao:fin_transacoes(status)")
        .eq("obra_id", obraId)
        .order("created_at", { ascending: false });
      if (errC) throw errC;

      const { data: terceiros, error: errT } = await supabase
        .from("obras_medicoes_terceiros")
        .select("*, empreiteira:cad_terceiros(razao_social), transacao:fin_transacoes(status)")
        .eq("obra_id", obraId)
        .order("created_at", { ascending: false });
      if (errT) throw errT;

      return { clientes, terceiros };
    },
    enabled: !!obraId
  });
}

export function useCriarMedicaoCliente() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (novo: { obra_id: string, periodo: string, valor: number, descricao: string }) => {
      const { data, error } = await supabase.from("obras_medicoes_clientes").insert(novo).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Medição de Cliente registrada! Aguardando Faturamento pelo financeiro.");
      qc.invalidateQueries({ queryKey: ["fin-faturamento"] });
    }
  });
}

export function useCriarMedicaoTerceiro() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (novo: { obra_id: string, empreiteira_id: string, periodo: string, valor: number, descricao: string }) => {
      const { data, error } = await supabase.from("obras_medicoes_terceiros").insert(novo).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Medição de Terceiro registrada! Aguardando Processamento de pagamento.");
      qc.invalidateQueries({ queryKey: ["fin-faturamento"] });
    }
  });
}
