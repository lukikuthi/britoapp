import { t as supabase } from "./client-8Lt4JWZh.mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as CardHeader, n as CardContent, o as CardTitle, t as Card } from "./card-NkTA-G4u.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { i as auditTabelaLabel, n as auditAcaoLabel, r as auditRegistroDescricao } from "./labels-CvOYjy5J.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { N as LoaderCircle } from "../_libs/lucide-react.mjs";
import { i as format, t as ptBR } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.audit-BuE6wve-.js
var import_jsx_runtime = require_jsx_runtime();
function AuditPage() {
	const logs = useQuery({
		queryKey: ["audit-log"],
		queryFn: async () => {
			const { data, error } = await supabase.from("audit_log").select("id, tabela, acao, diff, created_at, ator_id").order("created_at", { ascending: false }).limit(100);
			if (error) throw error;
			const atorIds = [...new Set((data ?? []).map((l) => l.ator_id).filter(Boolean))];
			let nomes = /* @__PURE__ */ new Map();
			if (atorIds.length) {
				const { data: profs } = await supabase.from("profiles").select("id, nome").in("id", atorIds);
				nomes = new Map((profs ?? []).map((p) => [p.id, p.nome]));
			}
			return (data ?? []).map((log) => ({
				...log,
				atorNome: log.ator_id ? nomes.get(log.ator_id) ?? null : null
			}));
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-4 sm:p-6 max-w-5xl mx-auto space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold tracking-tight",
			children: "Audit log"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground mt-1",
			children: "Histórico de alterações nos relatórios (últimos 100 eventos)."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
			className: "pb-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: "Eventos"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: logs.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-5 animate-spin mx-auto" }) : !logs.data?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Nenhum evento registrado."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "divide-y text-sm",
			children: logs.data.map((log) => {
				const descricao = auditRegistroDescricao(log.tabela, log.diff);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "py-3 space-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									children: auditAcaoLabel(log.acao)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: auditTabelaLabel(log.tabela)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: format(new Date(log.created_at), "dd/MM/yyyy HH:mm:ss", { locale: ptBR })
								})
							]
						}),
						descricao && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-foreground",
							children: descricao
						}),
						log.atorNome && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: ["Por: ", log.atorNome]
						})
					]
				}, log.id);
			})
		}) })] })]
	});
}
//#endregion
export { AuditPage as component };
