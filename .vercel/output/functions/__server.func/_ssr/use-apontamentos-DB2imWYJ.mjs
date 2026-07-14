import { t as supabase } from "./client-8Lt4JWZh.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-apontamentos-DB2imWYJ.js
function fromTable(table) {
	return supabase.from(table);
}
function useObraTorres(obraId) {
	return useQuery({
		queryKey: ["obra-torres", obraId],
		enabled: !!obraId,
		queryFn: async () => {
			const { data: torres, error: tErr } = await fromTable("obra_torres").select("id, nome, ordem").eq("obra_id", obraId).order("ordem", { ascending: true });
			if (tErr) throw tErr;
			if (!torres || torres.length === 0) return [];
			const torreIds = torres.map((t) => t.id);
			const { data: andares, error: aErr } = await fromTable("torre_andares").select("id, torre_id, grupo_id, numero_andar, apelido").in("torre_id", torreIds).order("numero_andar", { ascending: true });
			if (aErr) throw aErr;
			const { data: grupos, error: gErr } = await fromTable("torre_grupos_andar").select("id, torre_id, tipo_andar, planta_storage_path").in("torre_id", torreIds);
			if (gErr) throw gErr;
			const grupoMap = /* @__PURE__ */ new Map();
			for (const g of grupos ?? []) grupoMap.set(g.id, {
				tipo_andar: g.tipo_andar,
				planta_storage_path: g.planta_storage_path
			});
			const andaresWithGrupo = (andares ?? []).map((a) => {
				const grupo = a.grupo_id ? grupoMap.get(a.grupo_id) : null;
				return {
					id: a.id,
					numero_andar: a.numero_andar,
					apelido: a.apelido ?? null,
					tipo_andar: grupo?.tipo_andar ?? null,
					torre_id: a.torre_id,
					grupo_id: a.grupo_id ?? null,
					planta_storage_path: grupo?.planta_storage_path ?? null
				};
			});
			return torres.map((t) => ({
				id: t.id,
				nome: t.nome,
				ordem: t.ordem,
				andares: andaresWithGrupo.filter((a) => a.torre_id === t.id)
			}));
		}
	});
}
function useAndarApontamentos(andarId) {
	return useQuery({
		queryKey: ["apontamentos", andarId],
		enabled: !!andarId,
		queryFn: async () => {
			const { data, error } = await fromTable("apontamentos").select("id, pos_x, pos_y, descricao, status, autor_id, created_at, updated_at").eq("andar_id", andarId).order("created_at", { ascending: true });
			if (error) throw error;
			return data ?? [];
		}
	});
}
function useCreateApontamento() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input) => {
			const { data: { user } } = await supabase.auth.getUser();
			const { data, error } = await fromTable("apontamentos").insert({
				andar_id: input.andar_id,
				pos_x: input.pos_x,
				pos_y: input.pos_y,
				descricao: input.descricao,
				autor_id: user?.id ?? null
			}).select("id").single();
			if (error) throw error;
			return data;
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: ["apontamentos", variables.andar_id] });
			queryClient.invalidateQueries({ queryKey: ["apontamento-counts", variables.obraId] });
		}
	});
}
function useUpdateApontamento() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input) => {
			const payload = {};
			if (input.descricao !== void 0) payload.descricao = input.descricao;
			if (input.status !== void 0) payload.status = input.status;
			const { error } = await fromTable("apontamentos").update(payload).eq("id", input.id);
			if (error) throw error;
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: ["apontamentos", variables.andarId] });
			queryClient.invalidateQueries({ queryKey: ["apontamento-counts", variables.obraId] });
		}
	});
}
function useDeleteApontamento() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input) => {
			const { error } = await fromTable("apontamentos").delete().eq("id", input.id);
			if (error) throw error;
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: ["apontamentos", variables.andarId] });
			queryClient.invalidateQueries({ queryKey: ["apontamento-counts", variables.obraId] });
		}
	});
}
function usePlantaUrl(storagePath) {
	return useQuery({
		queryKey: ["planta-url", storagePath],
		enabled: !!storagePath,
		staleTime: 1800 * 1e3,
		queryFn: async () => {
			if (!storagePath) return null;
			const { data, error } = await supabase.storage.from("plantas-baixa").createSignedUrl(storagePath, 3600);
			if (error) throw error;
			return data.signedUrl;
		}
	});
}
function useAndarDetail(andarId) {
	return useQuery({
		queryKey: ["andar-detail", andarId],
		enabled: !!andarId,
		queryFn: async () => {
			const { data: andar, error: andarErr } = await fromTable("torre_andares").select("id, torre_id, grupo_id, numero_andar, apelido").eq("id", andarId).single();
			if (andarErr) throw andarErr;
			if (!andar) return null;
			const { data: torre, error: torreErr } = await fromTable("obra_torres").select("id, nome, obra_id").eq("id", andar.torre_id).single();
			if (torreErr) throw torreErr;
			let grupo = null;
			if (andar.grupo_id) {
				const { data: grupoData, error: grupoErr } = await fromTable("torre_grupos_andar").select("id, tipo_andar, planta_storage_path").eq("id", andar.grupo_id).single();
				if (grupoErr) throw grupoErr;
				grupo = grupoData ? {
					id: grupoData.id,
					tipo_andar: grupoData.tipo_andar,
					planta_storage_path: grupoData.planta_storage_path
				} : null;
			}
			return {
				id: andar.id,
				numero_andar: andar.numero_andar,
				apelido: andar.apelido ?? null,
				torre_id: andar.torre_id,
				grupo_id: andar.grupo_id ?? null,
				torre: {
					id: torre.id,
					nome: torre.nome,
					obra_id: torre.obra_id
				},
				grupo
			};
		}
	});
}
//#endregion
export { useObraTorres as a, useDeleteApontamento as i, useAndarDetail as n, usePlantaUrl as o, useCreateApontamento as r, useUpdateApontamento as s, useAndarApontamentos as t };
