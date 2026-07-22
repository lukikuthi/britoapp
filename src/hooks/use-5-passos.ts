import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { addDays, formatISO } from "date-fns";

// Tipagens
export interface Pavimento {
  id: string;
  torre_id: string;
  numero_andar: number;
  tipo_pavimento: string;
  created_at: string;
}

export interface Ambiente {
  id: string;
  pavimento_id: string;
  nome: string;
  numero_final: number | null;
  planta_storage_path: string | null;
  created_at: string;
}

export interface Pendencia {
  id: string;
  ambiente_id: string;
  codigo: string;
  localizacao: string;
  descricao: string;
  foto_path: string;
  pos_x: number | null;
  pos_y: number | null;
  status: 'aberta' | 'vencida' | 'resolvida';
  prazo: string;
  data_baixa: string | null;
  foto_baixa_path: string | null;
  autor_id: string | null;
  baixado_por_id: string | null;
  empreiteira: string | null;
  categoria_taxonomia: string | null;
  created_at: string;
}

// Helpers
function fromTable(table: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return supabase.from(table as any);
}

// Queries
export function usePavimentos(torreId: string) {
  return useQuery<Pavimento[]>({
    queryKey: ["pavimentos", torreId],
    enabled: !!torreId,
    queryFn: async () => {
      const { data, error } = await fromTable("obra_pavimentos")
        .select("*")
        .eq("torre_id", torreId);
      if (error) throw error;
      return data;
    },
  });
}


export function useAmbientes(pavimentoId: string) {
  return useQuery<Ambiente[]>({
    queryKey: ["ambientes", pavimentoId],
    enabled: !!pavimentoId,
    queryFn: async () => {
      const { data, error } = await fromTable("obra_ambientes")
        .select("*")
        .eq("pavimento_id", pavimentoId)
        .order("nome", { ascending: true })
        .order("numero_final", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

export function usePendencias(ambienteId: string) {
  return useQuery<Pendencia[]>({
    queryKey: ["pendencias", ambienteId],
    enabled: !!ambienteId,
    queryFn: async () => {
      const { data, error } = await fromTable("obra_pendencias")
        .select("*")
        .eq("ambiente_id", ambienteId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      
      // Atualizar status 'vencida' on the fly se prazo expirou
      const now = new Date();
      return data.map((p: Pendencia) => {
        if (p.status === 'aberta' && new Date(p.prazo) < now) {
          return { ...p, status: 'vencida' };
        }
        return p;
      });
    },
  });
}

// Contagens de Pendências agregadas
export function usePendenciasTorreCount(torreId: string) {
  return useQuery({
    queryKey: ["pendencias-torre-count", torreId],
    enabled: !!torreId,
    queryFn: async () => {
      const { data: pavimentos } = await fromTable("obra_pavimentos").select("id").eq("torre_id", torreId);
      if (!pavimentos || pavimentos.length === 0) return { abertas: 0, resolvidas: 0 };
      const pavIds = pavimentos.map((p: any) => p.id);
      
      const { data: ambientes } = await fromTable("obra_ambientes").select("id").in("pavimento_id", pavIds);
      if (!ambientes || ambientes.length === 0) return { abertas: 0, resolvidas: 0 };
      const ambIds = ambientes.map((a: any) => a.id);
      
      const { data: pendencias } = await fromTable("obra_pendencias").select("status").in("ambiente_id", ambIds);
      let abertas = 0; let resolvidas = 0;
      for (const p of pendencias || []) {
        if (p.status === 'resolvida') resolvidas++;
        else abertas++;
      }
      return { abertas, resolvidas };
    }
  });
}

export function usePendenciasPavimentoCount(pavimentoId: string) {
  return useQuery({
    queryKey: ["pendencias-pavimento-count", pavimentoId],
    enabled: !!pavimentoId,
    queryFn: async () => {
      const { data: ambientes } = await fromTable("obra_ambientes").select("id").eq("pavimento_id", pavimentoId);
      if (!ambientes || ambientes.length === 0) return { abertas: 0, resolvidas: 0 };
      const ambIds = ambientes.map((a: any) => a.id);
      
      const { data: pendencias } = await fromTable("obra_pendencias").select("status").in("ambiente_id", ambIds);
      let abertas = 0; let resolvidas = 0;
      for (const p of pendencias || []) {
        if (p.status === 'resolvida') resolvidas++;
        else abertas++;
      }
      return { abertas, resolvidas };
}
  });
}

export function useVisaoGeralTorres(obraId: string) {
  return useQuery({
    queryKey: ["visao-geral-torres", obraId],
    enabled: !!obraId,
    queryFn: async () => {
      const { data: torres } = await fromTable("obra_torres").select("id, nome, ordem").eq("obra_id", obraId).order("ordem");
      if (!torres || torres.length === 0) return [];

      const torreIds = torres.map((t: any) => t.id);
      const { data: pavimentos } = await fromTable("obra_pavimentos").select("id, torre_id").in("torre_id", torreIds);
      const pavIds = (pavimentos || []).map((p: any) => p.id);

      let ambIds: string[] = [];
      if (pavIds.length > 0) {
        const { data: ambientes } = await fromTable("obra_ambientes").select("id, pavimento_id").in("pavimento_id", pavIds);
        ambIds = (ambientes || []).map((a: any) => a.id);
      }

      let pendencias: any[] = [];
      if (ambIds.length > 0) {
        const { data: pends } = await fromTable("obra_pendencias").select("status, ambiente_id").in("ambiente_id", ambIds);
        pendencias = pends || [];
      }

      // Map back to torres
      return torres.map((torre: any) => {
        const torrePavs = (pavimentos || []).filter((p: any) => p.torre_id === torre.id).map((p: any) => p.id);
        // We actually need the full hierarchy mapped to efficiently count
        // Let's do it simply by fetching pendencias directly matching the ambiences
        // For a scalable approach, maybe a SQL view is better, but this works for MVP.
        return {
          id: torre.id,
          nome: torre.nome,
          // We will fetch counts per torre by just using the existing `usePendenciasTorreCount` for each torre 
          // or we can calculate it here to save requests. Let's calculate it here.
          // Note: we'd need to map ambiente_id -> pavimento_id -> torre_id
        };
      });
    }
  });
}

export function useVisaoGeral(obraId: string) {
  return useQuery({
    queryKey: ["visao-geral", obraId],
    enabled: !!obraId,
    queryFn: async () => {
      const { data: torres } = await fromTable("obra_torres").select("id, nome, ordem").eq("obra_id", obraId).order("ordem");
      if (!torres || torres.length === 0) return { torres: [], totalAbertos: 0, totalResolvidos: 0 };

      const torreIds = torres.map((t: any) => t.id);
      const { data: pavimentos } = await fromTable("obra_pavimentos").select("id, torre_id").in("torre_id", torreIds);
      const pavIds = (pavimentos || []).map((p: any) => p.id);

      let ambientes: any[] = [];
      if (pavIds.length > 0) {
        const { data: ambs } = await fromTable("obra_ambientes").select("id, pavimento_id").in("pavimento_id", pavIds);
        ambientes = ambs || [];
      }
      const ambIds = ambientes.map((a: any) => a.id);

      let pendencias: any[] = [];
      if (ambIds.length > 0) {
        const { data: pends } = await fromTable("obra_pendencias").select("status, ambiente_id").in("ambiente_id", ambIds);
        pendencias = pends || [];
      }

      const ambToPav = new Map();
      ambientes.forEach((a: any) => ambToPav.set(a.id, a.pavimento_id));

      const pavToTorre = new Map();
      pavimentos?.forEach((p: any) => pavToTorre.set(p.id, p.torre_id));

      const countsByTorre = new Map();
      torres.forEach((t: any) => countsByTorre.set(t.id, { abertos: 0, resolvidos: 0 }));

      let totalAbertos = 0;
      let totalResolvidos = 0;

      pendencias.forEach((p: any) => {
        const pavId = ambToPav.get(p.ambiente_id);
        const torreId = pavToTorre.get(pavId);
        if (torreId && countsByTorre.has(torreId)) {
          const counts = countsByTorre.get(torreId);
          if (p.status === 'resolvida') {
            counts.resolvidos++;
            totalResolvidos++;
          } else {
            counts.abertos++;
            totalAbertos++;
          }
        }
      });

      const torresDetalhadas = torres.map((t: any) => ({
        id: t.id,
        nome: t.nome,
        abertos: countsByTorre.get(t.id).abertos,
        resolvidos: countsByTorre.get(t.id).resolvidos,
      }));

      return {
        torres: torresDetalhadas,
        totalAbertos,
        totalResolvidos,
      };
    }
  });
}

export function usePendenciasAmbienteCount(ambienteId: string) {
  return useQuery({
    queryKey: ["pendencias-ambiente-count", ambienteId],
    enabled: !!ambienteId,
    queryFn: async () => {
      const { data: pendencias } = await fromTable("obra_pendencias").select("status").eq("ambiente_id", ambienteId);
      let abertas = 0; let resolvidas = 0;
      for (const p of pendencias || []) {
        if (p.status === 'resolvida') resolvidas++;
        else abertas++;
      }
      return { abertas, resolvidas };
    }
  });
}

// Mutations
export function useCreatePavimento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<Pavimento, "id" | "created_at">) => {
      const { data, error } = await fromTable("obra_pavimentos").insert(payload).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["pavimentos", variables.torre_id] });
    },
  });
}

export function useUpdatePavimento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<Pavimento> & { id: string }) => {
      const { data, error } = await fromTable("obra_pavimentos").update(payload).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data) {
        qc.invalidateQueries({ queryKey: ["pavimentos", data.torre_id] });
        qc.invalidateQueries({ queryKey: ["pavimento", data.id] });
      }
    },
  });
}

export function useDeletePavimento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await fromTable("obra_pavimentos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pavimentos"] });
    },
  });
}

export function useCreateAmbiente() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<Ambiente, "id" | "created_at">) => {
      const { data, error } = await fromTable("obra_ambientes").insert(payload).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["ambientes", variables.pavimento_id] });
    },
  });
}

export function useDeleteAmbiente() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await fromTable("obra_ambientes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ambientes"] });
    },
  });
}

export function useUploadPlantaAmbiente() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, file }: { id: string, file: File }) => {
      const ext = file.name.split('.').pop();
      const path = `plantas/${id}_${Date.now()}.${ext}`;
      
      const { error: uploadError } = await supabase.storage
        .from('apontamentos')
        .upload(path, file, { upsert: true });
        
      if (uploadError) throw uploadError;
      
      const { error: updateError } = await fromTable("obra_ambientes")
        .update({ planta_storage_path: path })
        .eq("id", id);
        
      if (updateError) throw updateError;
      return path;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ambientes"] });
    }
  });
}

export function useCreatePendencia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<Pendencia, "id" | "created_at" | "status" | "prazo" | "data_baixa" | "foto_baixa_path" | "baixado_por_id">) => {
      const prazo = formatISO(addDays(new Date(), 5)); // regra de 5 dias
      const { data, error } = await fromTable("obra_pendencias").insert({
        ...payload,
        status: 'aberta',
        prazo
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["pendencias", variables.ambiente_id] });
      qc.invalidateQueries({ queryKey: ["pendencias-ambiente-count"] });
      qc.invalidateQueries({ queryKey: ["pendencias-pavimento-count"] });
      qc.invalidateQueries({ queryKey: ["pendencias-torre-count"] });
    },
  });
}

export function useResolvePendencia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: string, ambiente_id: string, foto_baixa_path: string, baixado_por_id: string }) => {
      const { error } = await fromTable("obra_pendencias").update({
        status: 'resolvida',
        data_baixa: formatISO(new Date()),
        foto_baixa_path: params.foto_baixa_path,
        baixado_por_id: params.baixado_por_id
      }).eq("id", params.id);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["pendencias", variables.ambiente_id] });
      qc.invalidateQueries({ queryKey: ["pendencias-ambiente-count"] });
      qc.invalidateQueries({ queryKey: ["pendencias-pavimento-count"] });
      qc.invalidateQueries({ queryKey: ["pendencias-torre-count"] });
    },
  });
}

export function useReplicateAmbientes() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ origemPavId, torreId }: { origemPavId: string, torreId: string }) => {
      // 1. Fetch origens
      const { data: ambientesOrigem, error: e1 } = await supabase.from("obra_ambientes" as any).select("*").eq("pavimento_id", origemPavId);
      if (e1) throw e1;
      if (!ambientesOrigem || ambientesOrigem.length === 0) throw new Error("O pavimento de origem não tem ambientes.");

      // 2. Fetch all 'Tipo' pavimentos in the torre, except the orig
      const { data: pavsDestino, error: e2 } = await supabase.from("obra_pavimentos" as any)
        .select("id")
        .eq("torre_id", torreId)
        .ilike("tipo_pavimento", "Tipo") // case insensitive
        .neq("id", origemPavId);
      if (e2) throw e2;
      
      const destIds = (pavsDestino || []).map((p: any) => p.id);
      if (destIds.length === 0) return; // Nothing to do

      // 3. For each dest, we delete existing ambientes. But first, check pendencias!
      const { data: existingAmbs } = await supabase.from("obra_ambientes" as any).select("id, pavimento_id").in("pavimento_id", destIds);
      const existingAmbIds = (existingAmbs || []).map((a: any) => a.id);
      
      if (existingAmbIds.length > 0) {
        const { data: pends } = await supabase.from("obra_pendencias" as any).select("id, ambiente_id").in("ambiente_id", existingAmbIds);
        if (pends && pends.length > 0) {
          throw new Error("Não é possível replicar: alguns pavimentos de destino já possuem pendências registradas em seus ambientes. Remova-as primeiro.");
        }
        // Safe to delete
        await supabase.from("obra_ambientes" as any).delete().in("id", existingAmbIds);
      }

      // 4. Replicate
      const inserts = [];
      for (const destId of destIds) {
        for (const amb of ambientesOrigem) {
          inserts.push({
            pavimento_id: destId,
            nome: amb.nome,
            numero_final: amb.numero_final,
            planta_storage_path: amb.planta_storage_path,
          });
        }
      }

      if (inserts.length > 0) {
        const { error: eIns } = await supabase.from("obra_ambientes" as any).insert(inserts);
        if (eIns) throw eIns;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ambientes"] });
    }
  });
}
