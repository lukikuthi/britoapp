import { t as supabase } from "./client-8Lt4JWZh.mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as CardContent, t as Card } from "./card-NkTA-G4u.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as OBRA_STATUS_LABEL } from "./labels-CvOYjy5J.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { H as HardHat, N as LoaderCircle, S as Plus, lt as ChevronRight, o as UserPlus } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-B5625LbR.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useRole } from "./use-auth-D2UOjB9-.mjs";
import { t as useTutorial } from "./use-tutorial-DOFDVu-o.mjs";
import { i as DropdownMenuTrigger, n as DropdownMenuContent, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-NQwLQ7z6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-DqpZX0KM.js
var import_jsx_runtime = require_jsx_runtime();
function DashboardFab({ isAdmin }) {
	if (!isAdmin) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			size: "icon",
			className: "tour-nova-obra fixed bottom-6 right-6 z-50 size-14 rounded-full shadow-lg",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-6" })
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuContent, {
		align: "end",
		side: "top",
		className: "w-52 mb-2",
		children: isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/obras",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HardHat, { className: "size-4" }), "Adicionar obra"]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/admin/usuarios",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "size-4" }), "Adicionar usuário"]
			})
		})] })
	})] });
}
function Dashboard() {
	const { data: role } = useRole();
	const isAdmin = role === "admin";
	const startTutorial = useTutorial((s) => s.startTutorial);
	const obrasQ = useQuery({
		queryKey: ["obras-dashboard"],
		queryFn: async () => {
			const { data, error } = await supabase.from("obras").select("id, nome, cidade, estado, status").order("created_at", { ascending: false });
			if (error) throw error;
			return data;
		}
	});
	const apontQ = useQuery({
		queryKey: ["apontamentos-dashboard", obrasQ.data?.map((o) => o.id).join(",")],
		enabled: !!obrasQ.data?.length,
		queryFn: async () => {
			const ids = obrasQ.data.map((o) => o.id);
			const { data: torres, error: e1 } = await supabase.from("obra_torres").select("id, obra_id").in("obra_id", ids);
			if (e1) throw e1;
			if (!torres?.length) return /* @__PURE__ */ new Map();
			const torreIds = torres.map((t) => t.id);
			const { data: andares, error: e2 } = await supabase.from("torre_andares").select("id, torre_id").in("torre_id", torreIds);
			if (e2) throw e2;
			if (!andares?.length) return /* @__PURE__ */ new Map();
			const andarIds = andares.map((a) => a.id);
			const { data: aponts, error: e3 } = await supabase.from("apontamentos").select("id, andar_id, status").in("andar_id", andarIds).eq("status", "aberto");
			if (e3) throw e3;
			const andarToTorre = new Map(andares.map((a) => [a.id, a.torre_id]));
			const torreToObra = new Map(torres.map((t) => [t.id, t.obra_id]));
			const map = /* @__PURE__ */ new Map();
			for (const ap of aponts ?? []) {
				const torreId = andarToTorre.get(ap.andar_id);
				const obraId = torreId ? torreToObra.get(torreId) : void 0;
				if (obraId) map.set(obraId, (map.get(obraId) ?? 0) + 1);
			}
			return map;
		}
	});
	const rdosQ = useQuery({
		queryKey: ["rdos-dashboard", obrasQ.data?.map((o) => o.id).join(",")],
		enabled: !!obrasQ.data?.length,
		queryFn: async () => {
			const ids = obrasQ.data.map((o) => o.id);
			const { data, error } = await supabase.from("rdos").select("id, obra_id, status").in("obra_id", ids).neq("status", "aprovado");
			if (error) throw error;
			const map = /* @__PURE__ */ new Map();
			for (const r of data ?? []) map.set(r.obra_id, (map.get(r.obra_id) ?? 0) + 1);
			return map;
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-4 sm:p-6 max-w-6xl mx-auto space-y-6 pb-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl sm:text-3xl font-bold tracking-tight",
					children: "Obras"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mt-1",
					children: "Selecione uma obra para ver o mapa e apontamentos."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					size: "sm",
					className: "tutorial-glow-wrapper",
					onClick: () => startTutorial((obrasQ.data?.length ?? 0) > 0),
					children: "Iniciar Tutorial"
				})]
			}),
			obrasQ.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-center py-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-6 animate-spin text-muted-foreground" })
			}) : !obrasQ.data?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "tour-lista-obras",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "py-12 text-center text-muted-foreground",
					children: isAdmin ? "Nenhuma obra cadastrada. Use o botão + para adicionar." : "Você ainda não foi vinculado a nenhuma obra. Fale com o administrador."
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 tour-lista-obras",
				children: obrasQ.data.map((o, idx) => {
					const abertos = apontQ.data?.get(o.id) ?? 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/obras/$obraId",
						params: { obraId: o.id },
						search: { tab: "visao" },
						className: "block animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both",
						style: { animationDelay: `${idx * 100}ms` },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "h-full hover:-translate-y-1 hover:shadow-lg hover:border-[var(--brand-gold)] transition-all duration-300",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "p-5 flex flex-col justify-between h-full gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-semibold text-lg line-clamp-2",
										children: o.nome
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-5 text-muted-foreground shrink-0 mt-1" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2 mt-auto",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: o.status === "em_andamento" ? "bg-primary/15 text-primary border-primary/30" : "",
											children: OBRA_STATUS_LABEL[o.status]
										}),
										abertos > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-destructive font-medium bg-destructive/10 px-2 py-0.5 rounded-full",
											children: [
												abertos,
												" apontamento",
												abertos !== 1 ? "s" : ""
											]
										}),
										(rdosQ.data?.get(o.id) ?? 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-amber-600 dark:text-amber-500 font-medium bg-amber-500/10 px-2 py-0.5 rounded-full",
											children: [
												rdosQ.data.get(o.id),
												" RDO",
												rdosQ.data.get(o.id) !== 1 ? "s" : ""
											]
										})
									]
								})]
							})
						})
					}, o.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardFab, { isAdmin })
		]
	});
}
//#endregion
export { Dashboard as component };
