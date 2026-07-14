import { t as supabase } from "./client-8Lt4JWZh.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pdf-image-utils-DqHbO08v.js
function useRdo(rdoId) {
	return useQuery({
		queryKey: ["rdo", rdoId],
		enabled: !!rdoId,
		queryFn: async () => {
			const { data, error } = await supabase.from("rdos").select("*").eq("id", rdoId).single();
			if (error) throw error;
			return data;
		}
	});
}
function useRdosDaObra(obraId) {
	return useQuery({
		queryKey: ["rdos", obraId],
		enabled: !!obraId,
		queryFn: async () => {
			const { data, error } = await supabase.from("rdos").select("*").eq("obra_id", obraId).order("data", { ascending: false });
			if (error) throw error;
			return data;
		}
	});
}
function useCreateRdo() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ obra_id, data, tipo = "diario" }) => {
			const { data: user } = await supabase.auth.getUser();
			const { data: rdo, error } = await supabase.from("rdos").insert({
				obra_id,
				data,
				tipo,
				autor_id: user.user?.id,
				status: "rascunho"
			}).select().single();
			if (error) throw error;
			return rdo;
		},
		onSuccess: (_, vars) => {
			queryClient.invalidateQueries({ queryKey: ["rdos", vars.obra_id] });
		}
	});
}
function useUpdateRdo() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, ...payload }) => {
			const { data, error } = await supabase.from("rdos").update(payload).eq("id", id).select().single();
			if (error) throw error;
			return data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["rdo", data.id] });
			queryClient.invalidateQueries({ queryKey: ["rdos", data.obra_id] });
		}
	});
}
function useClonePreviousRdo() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ obraId, currentRdoId, currentDate }) => {
			const { data: previousRdos, error: errRdo } = await supabase.from("rdos").select("id").eq("obra_id", obraId).lt("data", currentDate).order("data", { ascending: false }).limit(1);
			if (errRdo) throw errRdo;
			if (!previousRdos || previousRdos.length === 0) throw new Error("Nenhum RDO anterior encontrado para copiar.");
			const prevId = previousRdos[0].id;
			const { data: maoObra } = await supabase.from("rdo_mao_de_obra").select("*").eq("rdo_id", prevId);
			if (maoObra && maoObra.length > 0) {
				const payload = maoObra.map((item) => {
					const { id, rdo_id, created_at, ...rest } = item;
					return {
						...rest,
						rdo_id: currentRdoId
					};
				});
				await supabase.from("rdo_mao_de_obra").insert(payload);
			}
			const { data: equipamentos } = await supabase.from("rdo_equipamentos").select("*").eq("rdo_id", prevId);
			if (equipamentos && equipamentos.length > 0) {
				const payload = equipamentos.map((item) => {
					const { id, rdo_id, created_at, ...rest } = item;
					return {
						...rest,
						rdo_id: currentRdoId
					};
				});
				await supabase.from("rdo_equipamentos").insert(payload);
			}
			return true;
		},
		onSuccess: (_, vars) => {
			queryClient.invalidateQueries({ queryKey: [
				"rdo_table",
				vars.currentRdoId,
				"rdo_mao_de_obra"
			] });
			queryClient.invalidateQueries({ queryKey: [
				"rdo_table",
				vars.currentRdoId,
				"rdo_equipamentos"
			] });
		}
	});
}
function useRdoTable(rdoId, table) {
	return useQuery({
		queryKey: [
			"rdo_table",
			rdoId,
			table
		],
		enabled: !!rdoId,
		queryFn: async () => {
			const { data, error } = await supabase.from(table).select("*").eq("rdo_id", rdoId).order("created_at", { ascending: true });
			if (error) throw error;
			return data;
		}
	});
}
function useAddRdoTableItem() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ table, rdoId, payload }) => {
			const { data, error } = await supabase.from(table).insert({
				rdo_id: rdoId,
				...payload
			}).select().single();
			if (error) throw error;
			return data;
		},
		onSuccess: (_, vars) => {
			queryClient.invalidateQueries({ queryKey: [
				"rdo_table",
				vars.rdoId,
				vars.table
			] });
		}
	});
}
function useUpdateRdoTableItem() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ table, rdoId, id, payload }) => {
			const { data, error } = await supabase.from(table).update(payload).eq("id", id).select().single();
			if (error) throw error;
			return data;
		},
		onSuccess: (_, vars) => {
			queryClient.invalidateQueries({ queryKey: [
				"rdo_table",
				vars.rdoId,
				vars.table
			] });
		}
	});
}
function useDeleteRdoTableItem() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ table, rdoId, id }) => {
			const { error } = await supabase.from(table).delete().eq("id", id);
			if (error) throw error;
			return true;
		},
		onSuccess: (_, vars) => {
			queryClient.invalidateQueries({ queryKey: [
				"rdo_table",
				vars.rdoId,
				vars.table
			] });
		}
	});
}
/** Utilitários compartilhados para imagens em PDFs (proporção correta, logo, etc.) */
async function fetchImageAsBase64(url) {
	const blob = await (await fetch(url)).blob();
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result);
		reader.onerror = reject;
		reader.readAsDataURL(blob);
	});
}
function getImageFormatFromDataUrl(dataUrl) {
	if (dataUrl.startsWith("data:image/png")) return "PNG";
	if (dataUrl.startsWith("data:image/webp")) return "WEBP";
	return "JPEG";
}
function getImageDimensions(dataUrl) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve({
			width: img.naturalWidth,
			height: img.naturalHeight
		});
		img.onerror = reject;
		img.src = dataUrl;
	});
}
/** Calcula dimensões que cabem na caixa mantendo proporção (letterbox). */
function fitImageInBox(imgWidth, imgHeight, boxWidth, boxHeight) {
	if (imgWidth <= 0 || imgHeight <= 0) return {
		width: boxWidth,
		height: boxHeight,
		offsetX: 0,
		offsetY: 0
	};
	const scale = Math.min(boxWidth / imgWidth, boxHeight / imgHeight);
	const width = imgWidth * scale;
	const height = imgHeight * scale;
	return {
		width,
		height,
		offsetX: (boxWidth - width) / 2,
		offsetY: (boxHeight - height) / 2
	};
}
async function addImageFitted(doc, dataUrl, x, y, boxWidth, boxHeight) {
	const { width: imgW, height: imgH } = await getImageDimensions(dataUrl);
	const fit = fitImageInBox(imgW, imgH, boxWidth, boxHeight);
	const format = getImageFormatFromDataUrl(dataUrl);
	doc.addImage(dataUrl, format, x + fit.offsetX, y + fit.offsetY, fit.width, fit.height);
}
var logoBase64Cache = null;
async function getPdfLogoBase64() {
	if (logoBase64Cache) return logoBase64Cache;
	try {
		logoBase64Cache = await fetchImageAsBase64("/brito-logo.png");
		return logoBase64Cache;
	} catch {
		return null;
	}
}
async function addPdfBrandedHeader(doc, subtitle) {
	doc.setFillColor(0, 43, 91);
	doc.rect(0, 0, 210, 25, "F");
	const logo = await getPdfLogoBase64();
	if (logo) {
		const { width: imgW, height: imgH } = await getImageDimensions(logo);
		const fit = fitImageInBox(imgW, imgH, 58, 17);
		const logoY = (25 - fit.height) / 2;
		doc.addImage(logo, "PNG", 14, logoY, fit.width, fit.height);
		doc.setTextColor(255, 255, 255);
		doc.setFontSize(10);
		doc.setFont("helvetica", "normal");
		doc.text(subtitle, 78, 16);
	} else {
		doc.setTextColor(255, 255, 255);
		doc.setFontSize(16);
		doc.setFont("helvetica", "bold");
		doc.text("BRITO ENGENHARIA", 14, 12);
		doc.setFontSize(10);
		doc.setFont("helvetica", "normal");
		doc.text(subtitle, 14, 20);
	}
	doc.setTextColor(0, 0, 0);
}
//#endregion
export { getImageDimensions as a, useClonePreviousRdo as c, useRdo as d, useRdoTable as f, useUpdateRdoTableItem as h, fitImageInBox as i, useCreateRdo as l, useUpdateRdo as m, addPdfBrandedHeader as n, getImageFormatFromDataUrl as o, useRdosDaObra as p, fetchImageAsBase64 as r, useAddRdoTableItem as s, addImageFitted as t, useDeleteRdoTableItem as u };
