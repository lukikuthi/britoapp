import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Tipos base para RDO
export interface Rdo {
  id: string;
  obra_id: string;
  data: string;
  numero_sequencial: number;
  status: "rascunho" | "enviado" | "aprovado";
  tipo: "diario" | "semanal";
  hora_inicio: string | null;
  hora_fim: string | null;
  total_horas: number | null;
  observacoes: string | null;
  created_at: string;
}

export function useRdo(rdoId: string) {
  return useQuery({
    queryKey: ["rdo", rdoId],
    enabled: !!rdoId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rdos" as any)
        .select("*")
        .eq("id", rdoId)
        .single();
      if (error) throw error;
      return data as Rdo;
    },
  });
}

export function useRdosDaObra(obraId: string) {
  return useQuery({
    queryKey: ["rdos", obraId],
    enabled: !!obraId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rdos" as any)
        .select("*")
        .eq("obra_id", obraId)
        .order("data", { ascending: false });
      if (error) throw error;
      return data as Rdo[];
    },
  });
}

export function useCreateRdo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ obra_id, data, tipo = "diario" }: { obra_id: string; data: string; tipo?: "diario" | "semanal" }) => {
      const { data: user } = await supabase.auth.getUser();
      const { data: rdo, error } = await supabase
        .from("rdos" as any)
        .insert({
          obra_id,
          data,
          tipo,
          autor_id: user.user?.id,
          status: "rascunho",
        })
        .select()
        .single();
      if (error) throw error;
      return rdo as Rdo;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["rdos", vars.obra_id] });
    },
  });
}

export function useUpdateRdo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<Rdo> & { id: string }) => {
      const { data, error } = await supabase
        .from("rdos" as any)
        .update(payload)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as Rdo;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["rdo", data.id] });
      queryClient.invalidateQueries({ queryKey: ["rdos", data.obra_id] });
    },
  });
}

// Hook para copiar dados do RDO anterior
export function useClonePreviousRdo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ obraId, currentRdoId, currentDate }: { obraId: string; currentRdoId: string; currentDate: string }) => {
      // Achar último RDO aprovado/enviado (ou rascunho mesmo)
      const { data: previousRdos, error: errRdo } = await supabase
        .from("rdos" as any)
        .select("id")
        .eq("obra_id", obraId)
        .lt("data", currentDate)
        .order("data", { ascending: false })
        .limit(1);

      if (errRdo) throw errRdo;
      if (!previousRdos || previousRdos.length === 0) {
        throw new Error("Nenhum RDO anterior encontrado para copiar.");
      }

      const prevId = previousRdos[0].id;

      // Buscar e inserir Mão de Obra
      const { data: maoObra } = await supabase.from("rdo_mao_de_obra" as any).select("*").eq("rdo_id", prevId);
      if (maoObra && maoObra.length > 0) {
        const payload = maoObra.map((item: any) => {
          const { id, rdo_id, created_at, ...rest } = item;
          return { ...rest, rdo_id: currentRdoId };
        });
        await supabase.from("rdo_mao_de_obra" as any).insert(payload);
      }

      // Buscar e inserir Equipamentos
      const { data: equipamentos } = await supabase.from("rdo_equipamentos" as any).select("*").eq("rdo_id", prevId);
      if (equipamentos && equipamentos.length > 0) {
        const payload = equipamentos.map((item: any) => {
          const { id, rdo_id, created_at, ...rest } = item;
          return { ...rest, rdo_id: currentRdoId };
        });
        await supabase.from("rdo_equipamentos" as any).insert(payload);
      }

      return true;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["rdo_table", vars.currentRdoId, "rdo_mao_de_obra"] });
      queryClient.invalidateQueries({ queryKey: ["rdo_table", vars.currentRdoId, "rdo_equipamentos"] });
    },
  });
}

// Hooks genéricos para tabelas filhas (rdo_mao_de_obra, rdo_equipamentos, etc.)
export function useRdoTable<T>(rdoId: string, table: string) {
  return useQuery({
    queryKey: ["rdo_table", rdoId, table],
    enabled: !!rdoId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from(table as any)
        .select("*")
        .eq("rdo_id", rdoId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as T[];
    },
  });
}

export function useAddRdoTableItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ table, rdoId, payload }: { table: string; rdoId: string; payload: any }) => {
      const { data, error } = await supabase
        .from(table as any)
        .insert({ rdo_id: rdoId, ...payload })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["rdo_table", vars.rdoId, vars.table] });
    },
  });
}

export function useUpdateRdoTableItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ table, rdoId, id, payload }: { table: string; rdoId: string; id: string; payload: any }) => {
      const { data, error } = await supabase
        .from(table as any)
        .update(payload)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["rdo_table", vars.rdoId, vars.table] });
    },
  });
}

export function useDeleteRdoTableItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ table, rdoId, id }: { table: string; rdoId: string; id: string }) => {
      const { error } = await supabase
        .from(table as any)
        .delete()
        .eq("id", id);
      if (error) throw error;
      return true;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["rdo_table", vars.rdoId, vars.table] });
    },
  });
}
