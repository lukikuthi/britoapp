import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "./use-auth";

export function useKpisDiretoria() {
  return useQuery({
    queryKey: ["diretoria-kpis"],
    queryFn: async () => {
      // Fazemos as requisições em paralelo para o dashboard ser rápido
      const [obrasRes, rhRes, finRes] = await Promise.all([
        supabase.from("obras").select("id, status", { count: "exact" }),
        supabase.from("rh_funcionarios").select("id", { count: "exact" }).eq("status", "ativo"),
        supabase.from("fin_transacoes").select("tipo, valor, status")
      ]);

      const obrasAtivas = obrasRes.data?.filter(o => o.status === 'em_andamento')?.length || 0;
      const totalFuncionarios = rhRes.count || 0;

      // Cálculo Financeiro Simples
      let aReceber = 0;
      let aPagar = 0;

      finRes.data?.forEach(t => {
        if (t.status === 'pendente') {
          if (t.tipo === 'receber') aReceber += Number(t.valor);
          if (t.tipo === 'pagar') aPagar += Number(t.valor);
        }
      });

      return {
        obrasAtivas,
        totalFuncionarios,
        financeiro: {
          aReceber,
          aPagar,
          saldoProjetado: aReceber - aPagar
        }
      };
    },
  });
}

// Reutilizamos a tabela mensagens_setor criada pelo Compras
export function useCaixaEntradaDiretoria() {
  return useQuery({
    queryKey: ["diretoria-mensagens"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mensagens_setor")
        .select("*, autor:profiles(nome)")
        .or('para_modulo.eq.diretoria,de_modulo.eq.diretoria')
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useResponderMensagem() {
  const qc = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (novo: { para_modulo: string; mensagem: string }) => {
      const { data, error } = await supabase.from("mensagens_setor").insert({
        de_modulo: 'diretoria',
        para_modulo: novo.para_modulo,
        mensagem: novo.mensagem,
        autor_id: user?.id
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Resposta enviada!");
      qc.invalidateQueries({ queryKey: ["diretoria-mensagens"] });
    },
  });
}
