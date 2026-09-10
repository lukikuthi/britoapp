import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "./use-auth";

// ==========================
// ESTOQUE
// ==========================
export function useEstoque() {
  return useQuery({
    queryKey: ["compras-estoque"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("compras_itens")
        .select("*, obra:obras(nome)")
        .order("nome", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

export function useAdicionarItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (novo: any) => {
      const { data, error } = await supabase.from("compras_itens").insert(novo).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Item cadastrado no estoque!");
      qc.invalidateQueries({ queryKey: ["compras-estoque"] });
      qc.invalidateQueries({ queryKey: ["diretoria-kpis"] });
    },
    onError: (e: Error) => toast.error(`Erro: ${e.message}`)
  });
}

// ==========================
// CERTIFICADOS (10 dias alerta)
// ==========================
export function useCertificados() {
  return useQuery({
    queryKey: ["compras-certificados"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("compras_certificados")
        .select("*, item:compras_itens(nome, tipo)")
        .order("data_vencimento", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

export function useAdicionarCertificado() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (novo: any) => {
      const { data, error } = await supabase.from("compras_certificados").insert(novo).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Certificado adicionado!");
      qc.invalidateQueries({ queryKey: ["compras-certificados"] });
    },
    onError: (e: Error) => toast.error(`Erro: ${e.message}`)
  });
}

// ==========================
// BOLETOS
// ==========================
export function useBoletos() {
  return useQuery({
    queryKey: ["compras-boletos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("compras_boletos")
        .select("*, obra:obras(nome)")
        .order("data_vencimento", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

export function useAdicionarBoleto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (novo: any) => {
      const { data, error } = await supabase.from("compras_boletos").insert(novo).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Boleto/Nota lançado!");
      qc.invalidateQueries({ queryKey: ["compras-boletos"] });
      qc.invalidateQueries({ queryKey: ["diretoria-kpis"] });
    },
    onError: (e: Error) => toast.error(`Erro: ${e.message}`)
  });
}

// ==========================
// MENSAGENS (Cross-Module)
// ==========================
export function useMensagens(setor: string = 'compras') {
  return useQuery({
    queryKey: ["mensagens", setor],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mensagens_setor")
        .select("*, autor:profiles(nome)")
        .or(`de_modulo.eq.${setor},para_modulo.eq.${setor}`)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useEnviarMensagem() {
  const qc = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (novo: { para_modulo: string; mensagem: string; de_modulo: string }) => {
      if (!user?.id) throw new Error("Usuário não autenticado");
      const { data, error } = await supabase.from("mensagens_setor").insert({
        ...novo,
        autor_id: user.id
      }).select().single();
      if (error) throw error;

      // Disparar notificação para o módulo de destino
      await supabase.from("notificacoes").insert({
        modulo_alvo: novo.para_modulo,
        titulo: `Nova mensagem de ${novo.de_modulo.toUpperCase()}`,
        mensagem: novo.mensagem,
        link_url: novo.para_modulo === "obras" ? "/dashboard?tab=mensagens" : `/${novo.para_modulo}?tab=mensagens`
      });

      return data;
    },
    onSuccess: () => {
      toast.success("Mensagem enviada!");
      // Invalidar AMBOS os caches (compras e diretoria)
      qc.invalidateQueries({ queryKey: ["mensagens"] });
      qc.invalidateQueries({ queryKey: ["diretoria-mensagens"] });
    },
    onError: (e: Error) => toast.error(`Erro: ${e.message}`)
  });
}

// ==========================
// REQUISIÇÕES DE MATERIAL (OBRAS -> COMPRAS)
// ==========================
export function useRequisicoes(obraId?: string) {
  return useQuery({
    queryKey: ["compras-requisicoes", obraId],
    queryFn: async () => {
      let query = supabase
        .from("compras_requisicoes")
        .select("*, obra:obras(nome), autor:profiles(nome), itens:compras_requisicoes_itens(*)")
        .order("created_at", { ascending: false });
        
      if (obraId) {
        query = query.eq("obra_id", obraId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useAdicionarRequisicao() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ obra_id, observacao, itens }: { obra_id: string, observacao?: string, itens: any[] }) => {
      const { data: user } = await supabase.auth.getUser();
      
      // 1. Cria a requisição
      const { data: req, error: errReq } = await supabase.from("compras_requisicoes").insert({
        obra_id,
        observacao,
        autor_id: user.user?.id
      }).select().single();
      if (errReq) throw errReq;

      // 2. Insere os itens
      const itensToInsert = itens.map(i => ({
        requisicao_id: req.id,
        nome_item: i.nome_item,
        quantidade: i.quantidade,
        unidade: i.unidade
      }));
      
      const { error: errItens } = await supabase.from("compras_requisicoes_itens").insert(itensToInsert);
      if (errItens) throw errItens;
      
      // Notificar o compras
      await supabase.from("notificacoes").insert({
        modulo_alvo: "compras",
        titulo: "Novo Pedido de Material",
        mensagem: `A obra solicitou ${itens.length} itens.`,
        link_url: "/compras?tab=pedidos"
      });

      return req;
    },
    onSuccess: () => {
      toast.success("Pedido de material enviado ao setor de Compras!");
      qc.invalidateQueries({ queryKey: ["compras-requisicoes"] });
    },
    onError: (e: Error) => toast.error(`Erro ao criar pedido: ${e.message}`)
  });
}

export function useUpdateRequisicaoStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("compras_requisicoes").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compras-requisicoes"] });
    },
  });
}

export function useReceberRequisicao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ requisicaoId, items }: { requisicaoId: string, items: any[] }) => {
      // 1. Atualiza o status_recebimento da requisicao para 'recebido'
      const { error: reqErr } = await supabase.from("compras_requisicoes").update({
        status_recebimento: 'recebido',
        status: 'entregue',
        data_recebimento: new Date().toISOString()
      }).eq("id", requisicaoId);
      
      if (reqErr) throw reqErr;

      // 2. Para cada item recebido, incrementa o quantidade_atual em compras_itens
      for (const item of items) {
        // Obter o item atual
        const { data: catItem } = await supabase.from("compras_itens").select("quantidade_atual").eq("id", item.item_id).single();
        if (catItem) {
          await supabase.from("compras_itens").update({
            quantidade_atual: Number(catItem.quantidade_atual || 0) + Number(item.quantidade)
          }).eq("id", item.item_id);
        }
      }
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compras-requisicoes"] });
      queryClient.invalidateQueries({ queryKey: ["compras-itens"] });
    },
  });
}

export function useConsumirEstoque() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async ({ item_id, obra_id, quantidade, observacao }: { item_id: string, obra_id: string, quantidade: number, observacao?: string }) => {
      // 1. Obtém o saldo atual
      const { data: item } = await supabase.from("compras_itens").select("quantidade_atual").eq("id", item_id).single();
      if (!item) throw new Error("Item não encontrado.");
      
      const qtdAtual = Number(item.quantidade_atual || 0);
      if (qtdAtual < quantidade) throw new Error("Estoque insuficiente para esta retirada.");

      // 2. Registra a movimentação
      const { error: movErr } = await supabase.from("compras_movimentacoes").insert({
        item_id,
        obra_id,
        quantidade,
        tipo: 'saida',
        registrado_por: user?.id,
        observacao
      });
      if (movErr) throw movErr;

      // 3. Subtrai o saldo
      const { error: updErr } = await supabase.from("compras_itens").update({
        quantidade_atual: qtdAtual - quantidade
      }).eq("id", item_id);
      
      if (updErr) throw updErr;
      return true;
    },
    onSuccess: () => {
      toast.success("Retirada registrada com sucesso!");
      qc.invalidateQueries({ queryKey: ["compras-itens"] });
      qc.invalidateQueries({ queryKey: ["compras-movimentacoes"] });
    },
    onError: (e: Error) => toast.error(`Erro na retirada: ${e.message}`)
  });
}

export function useAtualizarStatusRequisicao() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const { error } = await supabase.from("compras_requisicoes").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Status do pedido atualizado!");
      qc.invalidateQueries({ queryKey: ["compras-requisicoes"] });
    },
    onError: (e: Error) => toast.error(`Erro ao atualizar status: ${e.message}`)
  });
}

// ==========================
// COTAÇÕES (COMPRAS)
// ==========================
export function useCotacoes(requisicao_id: string) {
  return useQuery({
    queryKey: ["compras-cotacoes", requisicao_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("compras_cotacoes")
        .select("*")
        .eq("requisicao_id", requisicao_id)
        .order("valor_total", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!requisicao_id
  });
}

export function useAdicionarCotacao() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (novo: any) => {
      const { data, error } = await supabase.from("compras_cotacoes").insert(novo).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => {
      toast.success("Cotação adicionada!");
      qc.invalidateQueries({ queryKey: ["compras-cotacoes", vars.requisicao_id] });
    },
    onError: (e: Error) => toast.error(`Erro: ${e.message}`)
  });
}

export function useAprovarCotacao() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ requisicao_id, cotacao_id }: { requisicao_id: string, cotacao_id: string }) => {
      // 1. Zera todos
      await supabase.from("compras_cotacoes").update({ vencedora: false }).eq("requisicao_id", requisicao_id);
      // 2. Marca a vencedora
      await supabase.from("compras_cotacoes").update({ vencedora: true }).eq("id", cotacao_id);
      // 3. Muda a requisição para aprovada
      await supabase.from("compras_requisicoes").update({ status: 'aprovado' }).eq("id", requisicao_id);
      
      // 4. Busca os dados da cotação e requisição para gerar o contas a pagar
      const { data: cotacao } = await supabase.from("compras_cotacoes").select("*").eq("id", cotacao_id).single();
      const { data: req } = await supabase.from("compras_requisicoes").select("obra_id").eq("id", requisicao_id).single();
      
      if (cotacao && req) {
        // Insere a conta a pagar no financeiro
        await supabase.from("fin_transacoes").insert({
          obra_id: req.obra_id,
          tipo: 'despesa',
          categoria: 'Materiais',
          descricao: `Compra Ref: Pedido #${requisicao_id.split('-')[0].toUpperCase()} - ${cotacao.fornecedor}`,
          valor: cotacao.valor_total,
          fornecedor: cotacao.fornecedor,
          status: 'pendente', // Aguardando diretoria/financeiro
          data_vencimento: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // +15 dias placeholder
        });
      }
    },
    onSuccess: (_, vars) => {
      toast.success("Cotação aprovada e Conta a Pagar gerada no Financeiro!");
      qc.invalidateQueries({ queryKey: ["compras-cotacoes", vars.requisicao_id] });
      qc.invalidateQueries({ queryKey: ["compras-requisicoes"] });
    },
    onError: (e: Error) => toast.error(`Erro: ${e.message}`)
  });
}

// ==========================
// V8: FORNECEDORES E PEDIDOS DE COMPRA
// ==========================

export function useFornecedores() {
  return useQuery({
    queryKey: ["compras-fornecedores"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("compras_fornecedores" as any)
        .select("*")
        .order("razao_social", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

export function useAdicionarFornecedor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (novo: any) => {
      const { data, error } = await supabase.from("compras_fornecedores" as any).insert(novo).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Fornecedor cadastrado!");
      qc.invalidateQueries({ queryKey: ["compras-fornecedores"] });
    },
    onError: (e: Error) => toast.error(`Erro: ${e.message}`)
  });
}

export function usePedidosCompra() {
  return useQuery({
    queryKey: ["compras-pedidos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("compras_pedidos" as any)
        .select("*, fornecedor:compras_fornecedores(*), obra:obras(*), itens:compras_pedidos_itens(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useCriarPedidoCompra() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { pedido: any, itens: any[] }) => {
      const { data: pedidoData, error: pedidoError } = await supabase
        .from("compras_pedidos" as any)
        .insert(payload.pedido)
        .select()
        .single();
      
      if (pedidoError) throw pedidoError;

      if (payload.itens && payload.itens.length > 0) {
        const itensToInsert = payload.itens.map(i => ({
          pedido_id: pedidoData.id,
          descricao: i.descricao,
          quantidade: i.quantidade,
          unidade: i.unidade || 'un',
          valor_unitario: i.valor_unitario
        }));
        
        const { error: itensError } = await supabase
          .from("compras_pedidos_itens" as any)
          .insert(itensToInsert);
          
        if (itensError) throw itensError;
      }
      
      return pedidoData;
    },
    onSuccess: () => {
      toast.success("Pedido de compra gerado!");
      qc.invalidateQueries({ queryKey: ["compras-pedidos"] });
    },
    onError: (e: Error) => toast.error(`Erro: ${e.message}`)
  });
}

export function useImportarPlanilhaFerramentas() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (itens: any[]) => {
      const { data, error } = await supabase
        .from("compras_itens" as any)
        .insert(itens);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Planilha importada com sucesso! Legado salvo.");
      qc.invalidateQueries({ queryKey: ["compras-estoque"] });
    },
    onError: (e: Error) => toast.error(`Erro: ${e.message}`)
  });
}
