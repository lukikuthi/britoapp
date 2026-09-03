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
