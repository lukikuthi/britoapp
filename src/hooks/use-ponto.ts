import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "./use-auth";

export function useFuncionariosAlocados(obraId: string) {
  return useQuery({
    queryKey: ["funcionarios-alocados", obraId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rh_funcionarios")
        .select("id, nome, cargo, status")
        .eq("obra_id", obraId)
        .eq("status", "ativo")
        .order("nome");
      if (error) throw error;
      return data || [];
    },
    enabled: !!obraId,
  });
}

export function usePontoDiario(obraId: string, dataPonto: string) {
  return useQuery({
    queryKey: ["ponto-diario", obraId, dataPonto],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rh_ponto_diario")
        .select("*")
        .eq("obra_id", obraId)
        .eq("data_ponto", dataPonto);
      if (error) throw error;
      
      // Criar mapa para facilitar leitura O(1)
      const map = new Map<string, any>();
      for (const p of data || []) {
        map.set(p.funcionario_id, p);
      }
      return map;
    },
    enabled: !!obraId && !!dataPonto,
  });
}

export function useSalvarPonto() {
  const qc = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ obraId, dataPonto, registros }: { obraId: string, dataPonto: string, registros: any[] }) => {
      if (!user?.id) throw new Error("Usuário não autenticado");

      // Transforma para o formato do banco
      const upserts = registros.map(r => ({
        obra_id: obraId,
        data_ponto: dataPonto,
        funcionario_id: r.funcionario_id,
        apontador_id: user.id,
        presenca: r.presenca,
        horas_extras: r.horas_extras || 0,
        observacao: r.observacao || null
      }));

      // No supabase o on_conflict precisa ser no constraint UNIQUE(funcionario_id, data_ponto)
      const { error } = await supabase
        .from("rh_ponto_diario")
        .upsert(upserts, { onConflict: "funcionario_id,data_ponto" });
      
      if (error) throw error;
      return true;
    },
    onSuccess: (_, variables) => {
      toast.success("Apontamento diário salvo!");
      qc.invalidateQueries({ queryKey: ["ponto-diario", variables.obraId, variables.dataPonto] });
    },
    onError: (e: Error) => toast.error(`Erro ao salvar ponto: ${e.message}`)
  });
}
