import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "./use-auth";

export function useFuncionariosAlocados(obraId: string) {
  return useQuery({
    queryKey: ["funcionarios-alocados", obraId],
    queryFn: async () => {
      // 1. Busca os funcionários da obra
      const { data: funcs, error } = await supabase
        .from("rh_funcionarios")
        .select("id, nome, cargo, status")
        .eq("obra_id", obraId)
        .eq("status", "ativo")
        .order("nome");
      if (error) throw error;
      if (!funcs || funcs.length === 0) return [];

      const funcIds = funcs.map((f: any) => f.id);

      // 2. Busca os ASOs (exames ocupacionais)
      const { data: exames } = await supabase
        .from("rh_exames")
        .select("funcionario_id, data_vencimento, status")
        .in("funcionario_id", funcIds)
        .in("status", ["valido", "vencido"]);

      // Cria um mapa do ASO mais recente para cada func
      const asoMap = new Map<string, any>();
      if (exames) {
        for (const ex of exames) {
          const atual = asoMap.get(ex.funcionario_id);
          // Substitui se não houver ou se a data de vencimento for mais recente
          if (!atual || new Date(ex.data_vencimento) > new Date(atual.data_vencimento)) {
            asoMap.set(ex.funcionario_id, ex);
          }
        }
      }

      const hoje = new Date().toISOString().split('T')[0];

      // Mapeia adicionando a flag de ASO válido
      return funcs.map((f: any) => {
        const aso = asoMap.get(f.id);
        const asoValido = aso && aso.data_vencimento >= hoje && aso.status !== 'vencido';
        return {
          ...f,
          asoValido: !!asoValido,
          asoVencimento: aso?.data_vencimento || null
        };
      });
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
