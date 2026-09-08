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
