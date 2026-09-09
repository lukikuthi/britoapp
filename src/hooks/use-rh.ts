import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Funcionario {
  id: string;
  nome: string;
  cpf: string | null;
  cargo: string;
  obra_id: string | null;
  status: "ativo" | "inativo" | "ferias" | "afastado";
  salario: number | null;
  data_admissao: string;
  data_demissao: string | null;
}

export function useFuncionarios() {
  return useQuery({
    queryKey: ["rh-funcionarios"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rh_funcionarios")
        .select("*, obra:obras(nome)")
        .order("nome");
      if (error) throw error;
      return data;
    },
  });
}

export function useAlertasRH() {
  return useQuery({
    queryKey: ["rh-alertas"],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const dateLimit = new Date();
      dateLimit.setDate(dateLimit.getDate() + 30);
      const isoLimit = dateLimit.toISOString().split('T')[0];

      const { data: exames, error: errEx } = await supabase
        .from("rh_exames")
        .select("*, funcionario:rh_funcionarios(nome)")
        .gte("data_vencimento", today)
        .lte("data_vencimento", isoLimit)
        .eq("status", "valido");

      const { data: nrs, error: errNr } = await supabase
        .from("rh_treinamentos_nr")
        .select("*, funcionario:rh_funcionarios(nome)")
        .gte("data_vencimento", today)
        .lte("data_vencimento", isoLimit);

      if (errEx) throw errEx;
      if (errNr) throw errNr;

      return {
        exames: exames || [],
        nrs: nrs || []
      };
    },
  });
}

export function useAdicionarFuncionario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (novo: Partial<Funcionario>) => {
      const { data, error } = await supabase
        .from("rh_funcionarios")
        .insert(novo)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Funcionário adicionado com sucesso!");
      qc.invalidateQueries({ queryKey: ["rh-funcionarios"] });
      qc.invalidateQueries({ queryKey: ["diretoria-kpis"] });
    },
    onError: (e: Error) => toast.error(`Erro: ${e.message}`)
  });
}

// ==========================
// EXAMES E NRs
// ==========================

export function useExames() {
  return useQuery({
    queryKey: ["rh-exames"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rh_exames")
        .select("*, funcionario:rh_funcionarios(nome)")
        .order("data_vencimento", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

export function useTreinamentosNR() {
  return useQuery({
    queryKey: ["rh-nrs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rh_treinamentos_nr")
        .select("*, funcionario:rh_funcionarios(nome)")
        .order("data_vencimento", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

export function useAdicionarExame() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (novo: any) => {
      const { data, error } = await supabase.from("rh_exames").insert(novo).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Exame registrado!");
      qc.invalidateQueries({ queryKey: ["rh-exames"] });
      qc.invalidateQueries({ queryKey: ["rh-alertas"] });
    },
    onError: (e: Error) => toast.error(`Erro: ${e.message}`)
  });
}

export function useAdicionarNR() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (novo: any) => {
      const { data, error } = await supabase.from("rh_treinamentos_nr").insert(novo).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Treinamento registrado!");
      qc.invalidateQueries({ queryKey: ["rh-nrs"] });
      qc.invalidateQueries({ queryKey: ["rh-alertas"] });
    },
    onError: (e: Error) => toast.error(`Erro: ${e.message}`)
  });
}

// ==========================
// FÉRIAS
// ==========================

export function useFerias() {
  return useQuery({
    queryKey: ["rh-ferias"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rh_ferias")
        .select("*, funcionario:rh_funcionarios(nome)")
        .order("data_inicio", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useAgendarFerias() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (novo: any) => {
      const { data, error } = await supabase.from("rh_ferias").insert(novo).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Férias agendadas com sucesso!");
      qc.invalidateQueries({ queryKey: ["rh-ferias"] });
    },
    onError: (e: Error) => toast.error(`Erro: ${e.message}`)
  });
}

// ==========================
// EMPREITEIROS / TERCEIRIZADOS (V4)
// ==========================
export function useTerceiros() {
  return useQuery({
    queryKey: ["rh-terceiros"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cad_terceiros")
        .select("*")
        .order("razao_social", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

export function useAdicionarTerceiro() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (novo: any) => {
      const { data, error } = await supabase.from("cad_terceiros").insert(novo).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Empreiteira cadastrada!");
      qc.invalidateQueries({ queryKey: ["rh-terceiros"] });
    },
    onError: (e: Error) => toast.error(`Erro: ${e.message}`)
  });
}
