import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// ---------------------------------------------------------------------------
// Types (local, until the tables are in generated Supabase types)
// ---------------------------------------------------------------------------

export interface Torre {
  id: string;
  nome: string;
  ordem: number;
  andares: Andar[];
}

export interface Andar {
  id: string;
  numero_andar: number;
  apelido: string | null;
  tipo_andar: string | null;
  torre_id: string;
  grupo_id: string | null;
  planta_storage_path: string | null;
}

export interface Apontamento {
  id: string;
  pos_x: number;
  pos_y: number;
  descricao: string;
  status: "aberto" | "resolvido";
  autor_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface AndarDetail {
  id: string;
  numero_andar: number;
  apelido: string | null;
  torre_id: string;
  grupo_id: string | null;
  torre: {
    id: string;
    nome: string;
    obra_id: string;
  };
  grupo: {
    id: string;
    tipo_andar: string;
    planta_storage_path: string | null;
  } | null;
}

// ---------------------------------------------------------------------------
// Helpers – typed wrappers around `supabase.from()` for ungenerated tables
// ---------------------------------------------------------------------------

function fromTable(table: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return supabase.from(table as any);
}

// ---------------------------------------------------------------------------
// useObraTorres – fetch all torres + andares (with grupo info) for an obra
// ---------------------------------------------------------------------------

export function useObraTorres(obraId: string) {
  return useQuery<Torre[]>({
    queryKey: ["obra-torres", obraId],
    enabled: !!obraId,
    queryFn: async () => {
      // 1. Fetch torres for the obra
      const { data: torres, error: tErr } = await fromTable("obra_torres")
        .select("id, nome, ordem")
        .eq("obra_id", obraId)
        .order("ordem", { ascending: true });

      if (tErr) throw tErr;
      if (!torres || torres.length === 0) return [];

      const torreIds = torres.map((t: { id: string }) => t.id);

      // 2. Fetch andares for all torres
      const { data: andares, error: aErr } = await fromTable("torre_andares")
        .select("id, torre_id, grupo_id, numero_andar, apelido")
        .in("torre_id", torreIds)
        .order("numero_andar", { ascending: true });

      if (aErr) throw aErr;

      // 3. Fetch grupos to get tipo_andar + planta_storage_path
      const { data: grupos, error: gErr } = await fromTable("torre_grupos_andar")
        .select("id, torre_id, tipo_andar, planta_storage_path")
        .in("torre_id", torreIds);

      if (gErr) throw gErr;

      // Build grupo lookup
      const grupoMap = new Map<string, { tipo_andar: string; planta_storage_path: string | null }>();
      for (const g of grupos ?? []) {
        grupoMap.set(g.id, {
          tipo_andar: g.tipo_andar,
          planta_storage_path: g.planta_storage_path,
        });
      }

      // Merge andares with grupo info
      const andaresWithGrupo: Andar[] = (andares ?? []).map((a: Record<string, unknown>) => {
        const grupo = a.grupo_id ? grupoMap.get(a.grupo_id as string) : null;
        return {
          id: a.id as string,
          numero_andar: a.numero_andar as number,
          apelido: (a.apelido as string) ?? null,
          tipo_andar: grupo?.tipo_andar ?? null,
          torre_id: a.torre_id as string,
          grupo_id: (a.grupo_id as string) ?? null,
          planta_storage_path: grupo?.planta_storage_path ?? null,
        };
      });

      // Group andares by torre
      return torres.map((t: { id: string; nome: string; ordem: number }) => ({
        id: t.id,
        nome: t.nome,
        ordem: t.ordem,
        andares: andaresWithGrupo.filter((a) => a.torre_id === t.id),
      }));
    },
  });
}

// ---------------------------------------------------------------------------
// useAndarApontamentos – fetch apontamentos for a specific andar
// ---------------------------------------------------------------------------

export function useAndarApontamentos(andarId: string) {
  return useQuery<Apontamento[]>({
    queryKey: ["apontamentos", andarId],
    enabled: !!andarId,
    queryFn: async () => {
      const { data, error } = await fromTable("apontamentos")
        .select("id, pos_x, pos_y, descricao, status, autor_id, created_at, updated_at")
        .eq("andar_id", andarId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return (data ?? []) as Apontamento[];
    },
  });
}

// ---------------------------------------------------------------------------
// useApontamentoCounts – count open apontamentos per andar for an obra
// ---------------------------------------------------------------------------

export function useApontamentoCounts(obraId: string) {
  return useQuery<Map<string, number>>({
    queryKey: ["apontamento-counts", obraId],
    enabled: !!obraId,
    queryFn: async () => {
      // Get all torre IDs for this obra
      const { data: torres, error: tErr } = await fromTable("obra_torres")
        .select("id")
        .eq("obra_id", obraId);

      if (tErr) throw tErr;
      if (!torres || torres.length === 0) return new Map();

      const torreIds = torres.map((t: { id: string }) => t.id);

      // Get all andar IDs for these torres
      const { data: andares, error: aErr } = await fromTable("torre_andares")
        .select("id")
        .in("torre_id", torreIds);

      if (aErr) throw aErr;
      if (!andares || andares.length === 0) return new Map();

      const andarIds = andares.map((a: { id: string }) => a.id);

      // Get open apontamentos for these andares
      const { data: apontamentos, error: apErr } = await fromTable("apontamentos")
        .select("andar_id")
        .in("andar_id", andarIds)
        .eq("status", "aberto");

      if (apErr) throw apErr;

      // Count by andar_id
      const counts = new Map<string, number>();
      for (const ap of apontamentos ?? []) {
        const key = ap.andar_id as string;
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
      return counts;
    },
  });
}

// ---------------------------------------------------------------------------
// useCreateApontamento
// ---------------------------------------------------------------------------

interface CreateApontamentoInput {
  andar_id: string;
  pos_x: number;
  pos_y: number;
  descricao: string;
  /** Required for cache invalidation */
  obraId: string;
}

export function useCreateApontamento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateApontamentoInput) => {
      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await fromTable("apontamentos")
        .insert({
          andar_id: input.andar_id,
          pos_x: input.pos_x,
          pos_y: input.pos_y,
          descricao: input.descricao,
          autor_id: user?.id ?? null,
        })
        .select("id")
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["apontamentos", variables.andar_id] });
      queryClient.invalidateQueries({ queryKey: ["apontamento-counts", variables.obraId] });
    },
  });
}

// ---------------------------------------------------------------------------
// useUpdateApontamento
// ---------------------------------------------------------------------------

interface UpdateApontamentoInput {
  id: string;
  descricao?: string;
  status?: "aberto" | "resolvido";
  /** Required for cache invalidation */
  andarId: string;
  /** Required for cache invalidation */
  obraId: string;
}

export function useUpdateApontamento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateApontamentoInput) => {
      const payload: Record<string, unknown> = {};
      if (input.descricao !== undefined) payload.descricao = input.descricao;
      if (input.status !== undefined) payload.status = input.status;

      const { error } = await fromTable("apontamentos")
        .update(payload)
        .eq("id", input.id);

      if (error) throw error;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["apontamentos", variables.andarId] });
      queryClient.invalidateQueries({ queryKey: ["apontamento-counts", variables.obraId] });
    },
  });
}

// ---------------------------------------------------------------------------
// useDeleteApontamento
// ---------------------------------------------------------------------------

interface DeleteApontamentoInput {
  id: string;
  andarId: string;
  obraId: string;
}

export function useDeleteApontamento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: DeleteApontamentoInput) => {
      const { error } = await fromTable("apontamentos")
        .delete()
        .eq("id", input.id);

      if (error) throw error;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["apontamentos", variables.andarId] });
      queryClient.invalidateQueries({ queryKey: ["apontamento-counts", variables.obraId] });
    },
  });
}

// ---------------------------------------------------------------------------
// usePlantaUrl – get a signed URL for a floor plan image
// ---------------------------------------------------------------------------

export function usePlantaUrl(storagePath: string | null | undefined) {
  return useQuery<string | null>({
    queryKey: ["planta-url", storagePath],
    enabled: !!storagePath,
    staleTime: 30 * 60 * 1000, // 30 min – signed URLs are valid for 1h
    queryFn: async () => {
      if (!storagePath) return null;

      const { data, error } = await supabase.storage
        .from("plantas-baixa")
        .createSignedUrl(storagePath, 3600);

      if (error) throw error;
      return data.signedUrl;
    },
  });
}

// ---------------------------------------------------------------------------
// useAndarDetail – fetch a single andar with its torre and grupo
// ---------------------------------------------------------------------------

export function useAndarDetail(andarId: string) {
  return useQuery<AndarDetail | null>({
    queryKey: ["andar-detail", andarId],
    enabled: !!andarId,
    queryFn: async () => {
      // Fetch the andar record
      const { data: andar, error: andarErr } = await fromTable("torre_andares")
        .select("id, torre_id, grupo_id, numero_andar, apelido")
        .eq("id", andarId)
        .single();

      if (andarErr) throw andarErr;
      if (!andar) return null;

      // Fetch the torre
      const { data: torre, error: torreErr } = await fromTable("obra_torres")
        .select("id, nome, obra_id")
        .eq("id", andar.torre_id)
        .single();

      if (torreErr) throw torreErr;

      // Fetch the grupo (if exists)
      let grupo: { id: string; tipo_andar: string; planta_storage_path: string | null } | null = null;
      if (andar.grupo_id) {
        const { data: grupoData, error: grupoErr } = await fromTable("torre_grupos_andar")
          .select("id, tipo_andar, planta_storage_path")
          .eq("id", andar.grupo_id)
          .single();

        if (grupoErr) throw grupoErr;
        grupo = grupoData
          ? {
              id: grupoData.id,
              tipo_andar: grupoData.tipo_andar,
              planta_storage_path: grupoData.planta_storage_path,
            }
          : null;
      }

      return {
        id: andar.id as string,
        numero_andar: andar.numero_andar as number,
        apelido: (andar.apelido as string) ?? null,
        torre_id: andar.torre_id as string,
        grupo_id: (andar.grupo_id as string) ?? null,
        torre: {
          id: torre.id as string,
          nome: torre.nome as string,
          obra_id: torre.obra_id as string,
        },
        grupo,
      };
    },
  });
}
