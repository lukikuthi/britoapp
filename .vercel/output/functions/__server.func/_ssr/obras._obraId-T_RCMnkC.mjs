import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-8Lt4JWZh.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { d as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { D as Slot, F as require_jsx_runtime, a as Overlay2, c as Title2, i as Description2, n as Cancel, o as Portal2, r as Content2, s as Root2, t as Action } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as CardHeader, i as CardFooter, n as CardContent, o as CardTitle, r as CardDescription, t as Card } from "./card-NkTA-G4u.mjs";
import { t as Badge$1 } from "./badge-D1Dupn2y.mjs";
import { t as OBRA_STATUS_LABEL } from "./labels-CvOYjy5J.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { $ as CloudRain, E as PackageOpen, F as LayoutGrid, G as FileDown, H as HardHat, J as Eye, K as FileCheck, N as LoaderCircle, Q as CloudUpload, R as Info, S as Plus, T as Package, U as FileText, V as Hash, W as FileSpreadsheet, X as Download, Y as EllipsisVertical, Z as Compass, _ as ShieldAlert, _t as Building2, at as CircleCheck, b as Ruler, c as Upload, d as TrendingUp, dt as ChevronDown, et as Clock, f as Trash2, ft as Check, gt as CalendarRange, h as SquarePen, ht as Calendar, i as User, it as CirclePlus, j as MapPin, k as Menu, l as Truck, lt as ChevronRight, mt as Camera, ot as CircleCheckBig, p as Target, pt as ChartColumn, r as Users, rt as CircleX, st as CircleAlert, t as X, tt as ClipboardCheck, u as TriangleAlert, ut as ChevronLeft, v as Settings, vt as ArrowLeft, y as Save, yt as Activity } from "../_libs/lucide-react.mjs";
import { a as differenceInDays, c as startOfWeek, i as format, l as addDays, n as parseISO, o as min, r as subDays, s as max, t as ptBR } from "../_libs/date-fns.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, s as DialogTrigger, t as Dialog } from "./dialog-BGAiVp67.mjs";
import { n as buttonVariants, t as Button } from "./button-B5625LbR.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { n as CheckboxIndicator, t as Checkbox$1 } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as Link, p as Outlet, u as useRouterState, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useRole } from "./use-auth-D2UOjB9-.mjs";
import { t as useTutorial } from "./use-tutorial-DOFDVu-o.mjs";
import { i as DropdownMenuTrigger, n as DropdownMenuContent, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-NQwLQ7z6.mjs";
import { t as Route } from "./obras._obraId-CvUFqvMC.mjs";
import { a as getImageDimensions, i as fitImageInBox, l as useCreateRdo, n as addPdfBrandedHeader, o as getImageFormatFromDataUrl, p as useRdosDaObra, r as fetchImageAsBase64, t as addImageFitted } from "./pdf-image-utils-DqHbO08v.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { n as imageCompression } from "../_libs/browser-image-compression.mjs";
import { t as require_jspdf_node_min } from "../_libs/jspdf.mjs";
import { a as CartesianGrid, c as Legend, i as Area, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as AreaChart } from "../_libs/recharts+[...].mjs";
import { i as Trigger, n as List, r as Root2$1, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
import { a as useFormContext, i as useForm, n as Controller, r as FormProvider, t as u } from "../_libs/@hookform/resolvers+[...].mjs";
import { i as stringType, n as enumType, r as objectType, t as coerce } from "../_libs/zod.mjs";
import { a as Viewport, i as ScrollAreaThumb, n as Root, r as ScrollAreaScrollbar, t as Corner } from "../_libs/radix-ui__react-scroll-area.mjs";
import { n as utils, r as writeFileSync, t as readSync } from "../_libs/xlsx.mjs";
import { n as Root$1, t as Indicator } from "../_libs/radix-ui__react-progress.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/obras._obraId-T_RCMnkC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_jspdf_node_min = /* @__PURE__ */ __toESM(require_jspdf_node_min());
var AlertDialog = Root2;
var AlertDialogPortal = Portal2;
var AlertDialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay2, {
	className: cn("fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-300", className),
	...props,
	ref
}));
AlertDialogOverlay.displayName = Overlay2.displayName;
var AlertDialogContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-white/20 bg-background/90 backdrop-blur-2xl p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2),_inset_0_1px_0_rgba(255,255,255,0.4)] dark:border-white/10 dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4),_inset_0_1px_0_rgba(255,255,255,0.1)] duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-2xl", className),
	...props
})] }));
AlertDialogContent.displayName = Content2.displayName;
var AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
AlertDialogHeader.displayName = "AlertDialogHeader";
var AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
AlertDialogFooter.displayName = "AlertDialogFooter";
var AlertDialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title2, {
	ref,
	className: cn("text-lg font-semibold", className),
	...props
}));
AlertDialogTitle.displayName = Title2.displayName;
var AlertDialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description2, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
AlertDialogDescription.displayName = Description2.displayName;
var AlertDialogAction = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
	ref,
	className: cn(buttonVariants(), className),
	...props
}));
AlertDialogAction.displayName = Action.displayName;
var AlertDialogCancel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cancel, {
	ref,
	className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
	...props
}));
AlertDialogCancel.displayName = Cancel.displayName;
var Checkbox = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox$1, {
	ref,
	className: cn("grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckboxIndicator, {
		className: cn("grid place-content-center text-current"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" })
	})
}));
Checkbox.displayName = Checkbox$1.displayName;
var tabs = [
	{
		id: "visao",
		label: "Visão",
		icon: Activity,
		search: { tab: "visao" }
	},
	{
		id: "rdo",
		label: "RDO",
		icon: FileText,
		search: { tab: "rdo" }
	},
	{
		id: "mapa",
		label: "Plantas",
		icon: MapPin,
		search: { tab: "mapa" }
	},
	{
		id: "fotografia",
		label: "Fotos",
		icon: Camera,
		search: { tab: "fotografia" }
	},
	{
		id: "materiais",
		label: "Materiais",
		icon: Package,
		search: { tab: "materiais" }
	},
	{
		id: "laudos",
		label: "Laudos",
		icon: FileCheck,
		search: { tab: "laudos" }
	},
	{
		id: "sesmt",
		label: "SESMT",
		icon: HardHat,
		search: { tab: "sesmt" }
	},
	{
		id: "cronograma",
		label: "Gantt",
		icon: LayoutGrid,
		search: { tab: "cronograma" }
	},
	{
		id: "medicao",
		label: "Medição",
		icon: Ruler,
		search: { tab: "medicao" }
	},
	{
		id: "menu",
		label: "Menu",
		icon: Menu,
		search: { tab: "menu" }
	}
];
function ObraBottomNav({ obraId, active }) {
	const navigate = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "fixed bottom-0 left-0 right-0 z-40 border-t border-border/50 bg-background/80 backdrop-blur-lg md:left-64 shadow-[0_-4px_24px_rgb(0,0,0,0.02)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-background/80 to-transparent z-10 sm:hidden" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-background/80 to-transparent z-10 sm:hidden" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-w-6xl mx-auto flex overflow-x-auto scrollbar-hide",
					children: tabs.map((t) => {
						const Icon = t.icon;
						const isActive = active === t.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => navigate({
								to: "/obras/$obraId",
								params: { obraId },
								search: t.search,
								resetScroll: false,
								replace: true
							}),
							className: cn(`tour-tab-${t.id}`, "relative min-w-fit flex-1 flex flex-col items-center gap-1 py-3 px-3 text-[0.65rem] sm:text-xs font-medium whitespace-nowrap transition-all duration-300", isActive ? "text-primary scale-105" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"),
							children: [
								isActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-b-full bg-[var(--brand-gold)] shadow-[0_0_8px_var(--brand-gold)]" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: cn("size-5 transition-transform", isActive && "text-primary") }),
								t.label
							]
						}, t.id);
					})
				})
			]
		})
	});
}
function ObraAnalyticsTab({ obraId }) {
	const { data: analyticsData, isLoading } = useQuery({
		queryKey: ["obra-analytics", obraId],
		enabled: !!obraId,
		queryFn: async () => {
			const thirtyDaysAgo = subDays(/* @__PURE__ */ new Date(), 30).toISOString();
			const { data: rdos, error: errRdo } = await supabase.from("rdos").select("id, data, status").eq("obra_id", obraId).gte("data", thirtyDaysAgo).order("data", { ascending: true });
			if (errRdo) throw errRdo;
			if (!rdos || rdos.length === 0) return {
				rdos: [],
				chartData: [],
				stats: null
			};
			const rdoIds = rdos.map((r) => r.id);
			const { data: maoObra } = await supabase.from("rdo_mao_de_obra").select("rdo_id, quantidade, tipo, empresa").in("rdo_id", rdoIds);
			const { data: climas } = await supabase.from("rdo_clima").select("rdo_id, condicao, praticavel, impacta_prazo").in("rdo_id", rdoIds);
			const { data: ocorrencias } = await supabase.from("rdo_ocorrencias").select("rdo_id, impacta_prazo").in("rdo_id", rdoIds);
			const { data: eap } = await supabase.from("obra_eap").select("peso_percentual, avanco_realizado").eq("obra_id", obraId);
			const chartData = rdos.map((rdo) => {
				const mo = (maoObra || []).filter((m) => m.rdo_id === rdo.id);
				const totalProprio = mo.filter((m) => m.tipo === "proprio").reduce((acc, curr) => acc + (curr.quantidade || 0), 0);
				const totalTerceiro = mo.filter((m) => m.tipo === "terceirizado").reduce((acc, curr) => acc + (curr.quantidade || 0), 0);
				return {
					data: format(parseISO(rdo.data), "dd/MM", { locale: ptBR }),
					"Próprio": totalProprio,
					"Terceirizado": totalTerceiro,
					Total: totalProprio + totalTerceiro
				};
			});
			const totalRdos = rdos.length;
			const diasImpraticaveis = (climas || []).filter((c) => c.praticavel === false).length;
			const rdosAprovados = rdos.filter((r) => r.status === "aprovado").length;
			const avgEfetivo = chartData.reduce((acc, curr) => acc + curr.Total, 0) / (totalRdos || 1);
			const climasImpacto = (climas || []).filter((c) => c.impacta_prazo === true).length;
			const ocorrenciasImpacto = (ocorrencias || []).filter((o) => o.impacta_prazo === true).length;
			const empreiteirasMap = /* @__PURE__ */ new Map();
			(maoObra || []).forEach((m) => {
				if (m.tipo === "terceirizado" && m.empresa) {
					const emp = m.empresa.trim().toUpperCase();
					empreiteirasMap.set(emp, (empreiteirasMap.get(emp) || 0) + (m.quantidade || 0));
				}
			});
			const empreiteiras = Array.from(empreiteirasMap.entries()).map(([nome, total]) => ({
				nome,
				total
			})).sort((a, b) => b.total - a.total);
			const avancoGlobal = (eap || []).reduce((acc, item) => {
				return acc + (item.avanco_realizado || 0) * (item.peso_percentual || 0) / 100;
			}, 0);
			return {
				rdos,
				chartData,
				stats: {
					totalRdos,
					diasImpraticaveis: Math.floor(diasImpraticaveis / 3),
					rdosAprovados,
					avgEfetivo: Math.round(avgEfetivo),
					diasImpacto: Math.floor(climasImpacto / 3) + ocorrenciasImpacto,
					avancoGlobal: avancoGlobal.toFixed(2)
				},
				empreiteiras
			};
		}
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex justify-center py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-8 animate-spin text-muted-foreground" })
	});
	if (!analyticsData || analyticsData.rdos.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-center p-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed",
		children: "Não há dados de RDO suficientes nos últimos 30 dias para gerar gráficos."
	});
	const { chartData, stats, empreiteiras } = analyticsData;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 md:grid-cols-5 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "bg-primary text-primary-foreground border-primary/20",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
							className: "p-4 pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, {
								className: "flex items-center gap-2 text-primary-foreground/80",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "size-4" }), " Avanço Global"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
								className: "text-3xl font-bold",
								children: [stats?.avancoGlobal, "%"]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "p-4 pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "size-4 text-blue-500" }), " Efetivo Médio"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "text-2xl",
							children: [
								stats?.avgEfetivo,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-normal text-muted-foreground",
									children: "pessoas/dia"
								})
							]
						})]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "p-4 pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, {
							className: "flex items-center gap-2 text-red-500",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudRain, { className: "size-4" }), " Impacto de Prazo (Claim)"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "text-2xl text-red-600",
							children: [
								stats?.diasImpacto,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-normal text-muted-foreground",
									children: "eventos"
								})
							]
						})]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "p-4 pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "size-4 text-green-500" }), " RDOs Aprovados"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "text-2xl",
							children: [
								stats?.rdosAprovados,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-sm font-normal text-muted-foreground",
									children: ["/ ", stats?.totalRdos]
								})
							]
						})]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "p-4 pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4 text-amber-500" }), " Total RDOs"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "text-2xl",
							children: [
								stats?.totalRdos,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-normal text-muted-foreground",
									children: "dias"
								})
							]
						})]
					}) })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Curva de Mão de Obra (Últimos 30 dias)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Acompanhe o pico de efetivo e a evolução das contratações próprias e terceirizadas." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-[300px] w-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
						data: chartData,
						margin: {
							top: 10,
							right: 10,
							left: -20,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
								id: "colorProprio",
								x1: "0",
								y1: "0",
								x2: "0",
								y2: "1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "5%",
									stopColor: "#3b82f6",
									stopOpacity: .3
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "95%",
									stopColor: "#3b82f6",
									stopOpacity: 0
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
								id: "colorTerc",
								x1: "0",
								y1: "0",
								x2: "0",
								y2: "1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "5%",
									stopColor: "#f59e0b",
									stopOpacity: .3
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "95%",
									stopColor: "#f59e0b",
									stopOpacity: 0
								})]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								strokeDasharray: "3 3",
								vertical: false,
								opacity: .3
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "data",
								fontSize: 12,
								tickLine: false,
								axisLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								fontSize: 12,
								tickLine: false,
								axisLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
								borderRadius: "8px",
								border: "none",
								boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
								iconType: "circle",
								wrapperStyle: {
									fontSize: "12px",
									paddingTop: "10px"
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
								type: "monotone",
								dataKey: "Próprio",
								stroke: "#3b82f6",
								fillOpacity: 1,
								fill: "url(#colorProprio)",
								strokeWidth: 2
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
								type: "monotone",
								dataKey: "Terceirizado",
								stroke: "#f59e0b",
								fillOpacity: 1,
								fill: "url(#colorTerc)",
								strokeWidth: 2
							})
						]
					})
				})
			}) })] }),
			empreiteiras && empreiteiras.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Consolidado de Empreiteiros / Terceirizados" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Total de Homens-Dia agrupados por empresa nos últimos 30 dias (para validação de Medição)." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b bg-muted/20 text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-left font-medium",
							children: "Empresa / Terceirizada"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-right font-medium",
							children: "Total (Homens-Dia)"
						})]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: empreiteiras.map((emp) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b last:border-0 hover:bg-muted/10 transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 font-medium",
							children: emp.nome
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "bg-primary/10 text-primary font-bold px-2 py-1 rounded-md",
								children: [emp.total, " H.D"]
							})
						})]
					}, emp.nome)) })]
				})
			}) })] })
		]
	});
}
async function addHeader(doc, title) {
	await addPdfBrandedHeader(doc, title);
}
function addFooter$1(doc, pageNum, totalPages) {
	doc.setFontSize(8);
	doc.setTextColor(128, 128, 128);
	doc.text(`Página ${pageNum} de ${totalPages}`, 105, 287, { align: "center" });
	doc.text("BRITO ENGENHARIA — Registro fotográfico", 14, 287);
	doc.setTextColor(0, 0, 0);
}
async function generateFotografiaPdf(data) {
	const comFoto = data.itens.filter((i) => i.url);
	if (!comFoto.length) throw new Error("Nenhuma foto para exportar.");
	const doc = new import_jspdf_node_min.default({
		unit: "mm",
		format: "a4"
	});
	const totalPages = comFoto.length;
	const hoje = format(/* @__PURE__ */ new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
	const photoBoxW = 182;
	const photoBoxH = 120;
	for (let i = 0; i < comFoto.length; i++) {
		if (i > 0) doc.addPage();
		const item = comFoto[i];
		const pageNum = i + 1;
		await addHeader(doc, "Registro fotográfico da obra");
		doc.setFontSize(11);
		doc.setFont("helvetica", "bold");
		doc.text(data.obraNome, 14, 35);
		doc.setFont("helvetica", "normal");
		doc.setFontSize(9);
		doc.text(`Exportado em ${hoje}`, 14, 41);
		if (data.endereco) doc.text(data.endereco, 14, 47);
		const titulo = item.titulo.trim() || `Foto ${pageNum}`;
		doc.setFont("helvetica", "bold");
		doc.setFontSize(12);
		doc.text(titulo, 14, 58);
		let y = 64;
		if (item.url) try {
			await addImageFitted(doc, await fetchImageAsBase64(item.url), 14, y, photoBoxW, photoBoxH);
			y += 126;
		} catch {
			doc.setFont("helvetica", "italic");
			doc.setFontSize(9);
			doc.text("[Imagem não disponível]", 14, y);
			y += 10;
		}
		if (item.descricao?.trim()) {
			doc.setFont("helvetica", "bold");
			doc.setFontSize(10);
			doc.text("Descrição:", 14, y);
			y += 5;
			doc.setFont("helvetica", "normal");
			doc.setFontSize(9);
			const lines = doc.splitTextToSize(item.descricao.trim(), 182);
			doc.text(lines, 14, y);
		}
		addFooter$1(doc, pageNum, totalPages);
	}
	return doc.output("blob");
}
function isImageFile(file) {
	if (file.type.startsWith("image/")) return true;
	return /\.(jpe?g|png|gif|webp|heic|heif|bmp)$/i.test(file.name);
}
function FotografiaCard({ item, obraId, editable, onChanged }) {
	const inputRef = (0, import_react.useRef)(null);
	const [titulo, setTitulo] = (0, import_react.useState)(item.titulo);
	const [descricao, setDescricao] = (0, import_react.useState)(item.descricao ?? "");
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [saving, setSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setTitulo(item.titulo);
		setDescricao(item.descricao ?? "");
	}, [item.titulo, item.descricao]);
	async function saveText() {
		const t = titulo.trim();
		const d = descricao.trim();
		if (t === item.titulo && d === (item.descricao ?? "")) return;
		setSaving(true);
		try {
			const { error } = await supabase.from("obra_fotografia_itens").update({
				titulo: t,
				descricao: d || null
			}).eq("id", item.id);
			if (error) throw error;
			onChanged();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Erro ao salvar.");
		} finally {
			setSaving(false);
		}
	}
	async function handlePhoto(file) {
		if (!isImageFile(file)) {
			toast.error("Selecione uma imagem válida.");
			return;
		}
		setUploading(true);
		try {
			const compressed = await imageCompression(file, {
				maxSizeMB: 1.2,
				maxWidthOrHeight: 1600,
				useWebWorker: true
			});
			const ext = file.name.split(".").pop() || "jpg";
			const path = `${obraId}/fotografia/${crypto.randomUUID()}.${ext}`;
			if (item.storage_path) await supabase.storage.from("rdo-midias").remove([item.storage_path]);
			const { error: upErr } = await supabase.storage.from("rdo-midias").upload(path, compressed);
			if (upErr) throw upErr;
			const { error: dbErr } = await supabase.from("obra_fotografia_itens").update({ storage_path: path }).eq("id", item.id);
			if (dbErr) {
				await supabase.storage.from("rdo-midias").remove([path]);
				throw dbErr;
			}
			onChanged();
			toast.success("Foto enviada.");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Erro ao enviar foto.");
		} finally {
			setUploading(false);
			if (inputRef.current) inputRef.current.value = "";
		}
	}
	async function handleRemove() {
		if (!confirm("Remover este registro fotográfico?")) return;
		try {
			if (item.storage_path) {
				const { error: stErr } = await supabase.storage.from("rdo-midias").remove([item.storage_path]);
				if (stErr) throw stErr;
			}
			const { error } = await supabase.from("obra_fotografia_itens").delete().eq("id", item.id);
			if (error) throw error;
			onChanged();
			toast.success("Registro removido.");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Erro ao remover.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "p-3 space-y-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs text-muted-foreground",
							children: "Título"
						}), editable ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Título da foto",
							value: titulo,
							onChange: (e) => setTitulo(e.target.value),
							onBlur: () => void saveText(),
							disabled: saving,
							className: "h-8 text-sm"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: item.titulo || "Sem título"
						})]
					}), editable && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "ghost",
						className: "size-7 shrink-0 text-muted-foreground hover:text-destructive",
						onClick: () => void handleRemove(),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs text-muted-foreground",
							children: "Foto"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative aspect-[4/3] rounded-md border overflow-hidden bg-muted cursor-pointer",
							onClick: () => editable && !uploading && inputRef.current?.click(),
							role: editable ? "button" : void 0,
							tabIndex: editable ? 0 : void 0,
							onKeyDown: (e) => {
								if (editable && (e.key === "Enter" || e.key === " ")) inputRef.current?.click();
							},
							children: [item.url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: item.url,
								alt: titulo || "Foto",
								className: "w-full h-full object-cover"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-col items-center justify-center h-full text-muted-foreground gap-1",
								children: uploading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-6 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-6" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs",
									children: editable ? "Toque para enviar" : "Sem foto"
								})] })
							}), uploading && item.url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-0 flex items-center justify-center bg-background/60",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-6 animate-spin" })
							})]
						}),
						editable && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: inputRef,
							type: "file",
							accept: "image/*",
							className: "hidden",
							onChange: (e) => {
								const file = e.target.files?.[0];
								if (file) handlePhoto(file);
							}
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "text-xs text-muted-foreground",
						children: "Descrição"
					}), editable ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						placeholder: "Descrição (opcional)",
						rows: 2,
						value: descricao,
						onChange: (e) => setDescricao(e.target.value),
						onBlur: () => void saveText(),
						disabled: saving,
						className: "text-sm resize-none"
					}) : item.descricao && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: item.descricao
					})]
				})
			]
		})
	});
}
function ObraFotografiaTab({ obraId, obraNome, obraEndereco, editable }) {
	const qc = useQueryClient();
	const [exporting, setExporting] = (0, import_react.useState)(false);
	const itens = useQuery({
		queryKey: ["obra-fotografia", obraId],
		queryFn: async () => {
			const { data, error } = await supabase.from("obra_fotografia_itens").select("*").eq("obra_id", obraId).order("ordem", { ascending: true }).order("created_at", { ascending: true });
			if (error) throw error;
			return Promise.all((data ?? []).map(async (item) => {
				if (!item.storage_path) return {
					...item,
					url: void 0
				};
				const { data: signed } = await supabase.storage.from("rdo-midias").createSignedUrl(item.storage_path, 3600);
				return {
					...item,
					url: signed?.signedUrl
				};
			}));
		}
	});
	const addItem = useMutation({
		mutationFn: async () => {
			const { data: u } = await supabase.auth.getUser();
			const ordem = itens.data?.length ?? 0;
			const { error } = await supabase.from("obra_fotografia_itens").insert({
				obra_id: obraId,
				titulo: "",
				ordem,
				enviado_por: u.user?.id
			});
			if (error) throw error;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["obra-fotografia", obraId] });
		},
		onError: (e) => toast.error(e.message)
	});
	async function handleExportPdf() {
		const rows = itens.data?.filter((i) => i.url) ?? [];
		if (!rows.length) {
			toast.error("Adicione pelo menos uma foto antes de exportar.");
			return;
		}
		setExporting(true);
		try {
			const blob = await generateFotografiaPdf({
				obraNome,
				endereco: obraEndereco,
				itens: rows.map((i) => ({
					titulo: i.titulo,
					descricao: i.descricao,
					url: i.url ?? null
				}))
			});
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `Fotografia-${obraNome.replace(/\s+/g, "-").slice(0, 40)}.pdf`;
			a.click();
			URL.revokeObjectURL(url);
			toast.success("PDF exportado.");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Erro ao gerar PDF.");
		} finally {
			setExporting(false);
		}
	}
	const comFoto = itens.data?.filter((i) => i.url).length ?? 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-3 flex-wrap",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-base font-semibold",
				children: "Registro fotográfico"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground mt-0.5",
				children: "Seção independente do RDO. Organize fotos com título e descrição."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: "outline",
				onClick: () => void handleExportPdf(),
				disabled: exporting || comFoto === 0,
				children: [exporting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "size-4" }), "Exportar PDF"]
			})]
		}), itens.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex justify-center py-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-6 animate-spin" })
		}) : !itens.data?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "py-10 text-center space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-8 mx-auto text-muted-foreground" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Nenhuma foto registrada ainda."
				}),
				editable && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					onClick: () => addItem.mutate(),
					disabled: addItem.isPending,
					children: [addItem.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Adicionar foto"]
				})
			]
		}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
			children: itens.data.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FotografiaCard, {
				item,
				obraId,
				editable,
				onChanged: () => qc.invalidateQueries({ queryKey: ["obra-fotografia", obraId] })
			}, item.id))
		}), editable && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "outline",
			className: "w-full sm:w-auto",
			onClick: () => addItem.mutate(),
			disabled: addItem.isPending,
			children: [addItem.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Adicionar mais foto"]
		})] })]
	});
}
function ObraEapTab({ obraId }) {
	const queryClient = useQueryClient();
	const [novoCodigo, setNovoCodigo] = (0, import_react.useState)("");
	const [novaDescricao, setNovaDescricao] = (0, import_react.useState)("");
	const [novoPeso, setNovoPeso] = (0, import_react.useState)("");
	const [dataInicio, setDataInicio] = (0, import_react.useState)("");
	const [dataFim, setDataFim] = (0, import_react.useState)("");
	const { data: eapItems = [], isLoading } = useQuery({
		queryKey: ["obra-eap", obraId],
		queryFn: async () => {
			const { data, error } = await supabase.from("obra_eap").select("*").eq("obra_id", obraId).order("codigo", { ascending: true });
			if (error && error.code !== "PGRST116") throw error;
			return data || [];
		}
	});
	const addMut = useMutation({
		mutationFn: async () => {
			const { error } = await supabase.from("obra_eap").insert({
				obra_id: obraId,
				codigo: novoCodigo,
				descricao: novaDescricao,
				peso_percentual: parseFloat(novoPeso) || 0,
				data_inicio_planejada: dataInicio || null,
				data_fim_planejada: dataFim || null
			});
			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["obra-eap", obraId] });
			setNovoCodigo("");
			setNovaDescricao("");
			setNovoPeso("");
			setDataInicio("");
			setDataFim("");
			toast.success("Atividade da EAP adicionada!");
		},
		onError: (e) => toast.error("Erro: " + e.message)
	});
	const deleteMut = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("obra_eap").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["obra-eap", obraId] });
			toast.success("Atividade removida.");
		}
	});
	const avancoGeral = eapItems.reduce((acc, item) => acc + (item.avanco_realizado || 0) * (item.peso_percentual || 0) / 100, 0);
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex justify-center py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-8 animate-spin" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between items-end",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-2xl font-bold flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "size-6 text-primary" }), "Cronograma Físico (EAP)"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground mt-1",
					children: "Gerencie a Estrutura Analítica do Projeto e acompanhe o avanço da obra."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-primary/10 border-primary/20 border rounded-lg p-3 text-center min-w-[150px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium text-primary",
						children: "Avanço Físico Global"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-3xl font-bold text-primary",
						children: [avancoGeral.toFixed(2), "%"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Nova Tarefa na EAP" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Cadastre as tarefas com seus prazos e pesos percentuais no orçamento total." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-4 items-end",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "w-20",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-medium mb-1 block",
							children: "Cód."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "1.1",
							value: novoCodigo,
							onChange: (e) => setNovoCodigo(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-[200px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-medium mb-1 block",
							children: "Descrição da Tarefa"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Fundação Profunda...",
							value: novaDescricao,
							onChange: (e) => setNovaDescricao(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "w-24",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-medium mb-1 block",
							children: "Peso (%)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "15",
							type: "number",
							step: "0.01",
							value: novoPeso,
							onChange: (e) => setNovoPeso(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "w-36",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-medium mb-1 block",
							children: "Início Planejado"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: dataInicio,
							onChange: (e) => setDataInicio(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "w-36",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-medium mb-1 block",
							children: "Fim Planejado"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: dataFim,
							onChange: (e) => setDataFim(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => addMut.mutate(),
						disabled: !novoCodigo || !novaDescricao || addMut.isPending,
						children: [addMut.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4 mr-2" }), " Adicionar"]
					})
				]
			}) })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "p-0 overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b bg-muted/30",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left font-medium",
								children: "Cód."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left font-medium",
								children: "Descrição"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left font-medium",
								children: "Período Planejado"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-right font-medium",
								children: "Peso Global"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-right font-medium",
								children: "Avanço Realizado"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-right font-medium",
								children: "Ações"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
						className: "divide-y",
						children: [eapItems.map((item) => {
							const dateStr = item.data_inicio_planejada && item.data_fim_planejada ? `${new Date(item.data_inicio_planejada).toLocaleDateString("pt-BR")} até ${new Date(item.data_fim_planejada).toLocaleDateString("pt-BR")}` : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground/50 text-xs italic",
								children: "Não definido"
							});
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-muted/10 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 font-semibold",
										children: item.codigo
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: item.descricao
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-muted-foreground whitespace-nowrap",
										children: dateStr
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-3 text-right text-muted-foreground",
										children: [item.peso_percentual, "%"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "bg-green-100 text-green-800 font-bold px-2 py-1 rounded",
											children: [item.avanco_realizado || 0, "%"]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "icon",
											variant: "ghost",
											className: "h-8 w-8 text-destructive",
											onClick: () => deleteMut.mutate(item.id),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
										})
									})
								]
							}, item.id);
						}), eapItems.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 6,
							className: "p-8 text-center text-muted-foreground",
							children: "Nenhuma tarefa cadastrada na EAP. Adicione acima."
						}) })]
					})]
				})
			}) })
		]
	});
}
function ObraProjetosTab({ obraId }) {
	const qc = useQueryClient();
	const [nome, setNome] = (0, import_react.useState)("");
	const [disciplina, setDisciplina] = (0, import_react.useState)("Arquitetura");
	const [codigo, setCodigo] = (0, import_react.useState)("");
	const { data: projetos = [], isLoading } = useQuery({
		queryKey: ["obra-projetos", obraId],
		queryFn: async () => {
			const { data: projData, error: projErr } = await supabase.from("obra_projetos").select("*").eq("obra_id", obraId).order("disciplina");
			if (projErr) throw projErr;
			if (!projData || projData.length === 0) return [];
			const { data: revData, error: revErr } = await supabase.from("obra_projetos_revisoes").select("*").in("projeto_id", projData.map((p) => p.id));
			if (revErr) throw revErr;
			return projData.map((p) => ({
				...p,
				revisoes: revData.filter((r) => r.projeto_id === p.id).sort((a, b) => b.created_at.localeCompare(a.created_at))
			}));
		}
	});
	const addProjeto = useMutation({
		mutationFn: async () => {
			const { error } = await supabase.from("obra_projetos").insert({
				obra_id: obraId,
				disciplina,
				nome,
				codigo
			});
			if (error) throw error;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["obra-projetos", obraId] });
			setNome("");
			setCodigo("");
			toast.success("Projeto criado.");
		}
	});
	const uploadRevisao = async (projetoId, files) => {
		if (!files?.length) return;
		const file = files[0];
		const revisaoNome = prompt("Digite o nome da Revisão (Ex: R01, R02):", "R01");
		if (!revisaoNome) return;
		const path = `${obraId}/projetos/${crypto.randomUUID()}-${file.name}`;
		const { error: upErr } = await supabase.storage.from("projetos-cde").upload(path, file);
		if (upErr) return toast.error("Erro no upload: " + upErr.message);
		await supabase.from("obra_projetos_revisoes").update({ is_vigente: false }).eq("projeto_id", projetoId);
		const { error: dbErr } = await supabase.from("obra_projetos_revisoes").insert({
			projeto_id: projetoId,
			revisao: revisaoNome,
			storage_path: path,
			is_vigente: true
		});
		if (dbErr) return toast.error(dbErr.message);
		toast.success("Nova revisão cadastrada e definida como Vigente!");
		qc.invalidateQueries({ queryKey: ["obra-projetos", obraId] });
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-12 flex justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-8 animate-spin" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "text-2xl font-bold flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-6 text-primary" }), " Projetos e CDE (Common Data Environment)"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground mt-1",
				children: "Gerencie as pranchas da obra com controle rígido de revisões e obsolescência."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Cadastrar Novo Projeto" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Crie o container do projeto. As revisões (PDF) serão anexadas depois." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2 items-end",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "w-40",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-medium mb-1 block",
							children: "Disciplina"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
							value: disciplina,
							onChange: (e) => setDisciplina(e.target.value),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Arquitetura",
									children: "Arquitetura"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Elétrica",
									children: "Elétrica"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Hidráulica",
									children: "Hidráulica"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Estrutural",
									children: "Estrutural"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Climatização",
									children: "Climatização"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "w-32",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-medium mb-1 block",
							children: "Código"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "ARQ-01",
							value: codigo,
							onChange: (e) => setCodigo(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-[200px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-medium mb-1 block",
							children: "Nome do Projeto"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Prancha Térreo - Iluminação",
							value: nome,
							onChange: (e) => setNome(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => addProjeto.mutate(),
						disabled: !nome || addProjeto.isPending,
						children: [addProjeto.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4 mr-2" }), " Criar"]
					})
				]
			}) })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [projetos.map((proj) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "overflow-hidden border-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-muted/30 p-3 flex justify-between items-center border-b",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge$1, {
							variant: "outline",
							className: "mb-1",
							children: proj.disciplina
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-bold text-lg",
							children: [proj.codigo ? `${proj.codigo} - ` : "", proj.nome]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "file",
							id: `upload-${proj.id}`,
							className: "hidden",
							accept: ".pdf,image/*",
							onChange: (e) => uploadRevisao(proj.id, e.target.files)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: () => document.getElementById(`upload-${proj.id}`)?.click(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "size-4 mr-2" }), " Subir Revisão"]
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "p-0",
						children: proj.revisoes?.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-6 text-center text-muted-foreground text-sm",
							children: "Nenhuma revisão anexada. Suba o primeiro PDF deste projeto."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
							className: "w-full text-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y",
								children: proj.revisoes.map((rev) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: rev.is_vigente ? "bg-card" : "bg-red-50/50 dark:bg-red-950/20",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-4 py-3 font-medium",
											children: ["Rev: ", rev.revisao]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3",
											children: rev.is_vigente ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge$1, {
												className: "bg-green-600 hover:bg-green-700",
												children: "VIGENTE"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge$1, {
												variant: "destructive",
												className: "flex items-center gap-1 w-fit",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-3" }), " OBSOLETA"]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3 text-right",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												variant: rev.is_vigente ? "default" : "destructive",
												onClick: () => {
													const { data } = supabase.storage.from("projetos-cde").getPublicUrl(rev.storage_path);
													window.open(data.publicUrl, "_blank");
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4 mr-2" }), " Ver Arquivo"]
											})
										})
									]
								}, rev.id))
							})
						})
					})]
				}, proj.id)), projetos.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-center p-12 text-muted-foreground border border-dashed rounded-lg",
					children: "Nenhum projeto cadastrado no CDE."
				})]
			})
		]
	});
}
var variantStyles = {
	garagem: "bg-muted hover:bg-muted/80 text-muted-foreground",
	terreo: "bg-primary/10 hover:bg-primary/20 text-primary border-primary/20",
	tipo: "bg-card hover:bg-muted/50 border",
	cobertura: "bg-primary/5 hover:bg-primary/10 border border-primary/10",
	comercial: "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900",
	tecnica: "bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-300 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900",
	subestacao: "bg-red-100 hover:bg-red-200 text-red-800 border-red-300 font-bold dark:bg-red-950/30 dark:text-red-400 dark:border-red-900",
	mezanino: "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900"
};
function AndarButton({ numero, apelido, tipoAndar, apontamentosAbertos, isTop, isGroundLine, onClick }) {
	const bgClass = variantStyles[tipoAndar] ?? variantStyles.tipo;
	const isSubestacao = tipoAndar === "subestacao";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex justify-center w-full group",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-2 md:w-4 shrink-0 bg-muted-foreground/20 border-l border-muted-foreground/30 shadow-[inset_-2px_0_4px_rgba(0,0,0,0.1)] z-10",
				style: { borderTopLeftRadius: isTop ? "8px" : "0" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick,
				className: cn("relative w-full h-12 border-y text-sm font-medium", "flex items-center justify-between px-3 md:px-6", "transition-all duration-150 ease-in-out", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1", "active:scale-[0.98] shadow-sm", bgClass, isTop && "rounded-t-lg border-t-2 border-t-muted-foreground/50", isGroundLine && "border-b-[4px] border-b-green-700/80 mb-1"),
				style: { backgroundImage: isSubestacao ? "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 20px)" : void 0 },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-4 h-6 md:w-6 md:h-8 bg-background/60 border border-border shadow-inner rounded-sm" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate px-2 font-bold flex-1 text-center",
						children: apelido ?? `${numero}º`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-4 h-6 md:w-6 md:h-8 bg-background/60 border border-border shadow-inner rounded-sm" }),
					apontamentosAbertos > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute -top-2 -right-2 flex items-center justify-center min-w-[22px] h-[22px] px-1 rounded-full bg-destructive text-destructive-foreground text-[11px] font-bold leading-none shadow-md z-20 animate-pulse-soft",
						children: apontamentosAbertos > 99 ? "99+" : apontamentosAbertos
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-2 md:w-4 shrink-0 bg-muted-foreground/20 border-r border-muted-foreground/30 shadow-[inset_2px_0_4px_rgba(0,0,0,0.1)] z-10",
				style: { borderTopRightRadius: isTop ? "8px" : "0" }
			})
		]
	});
}
function TorreMapaView({ obraId, torres, apontamentoCounts }) {
	const navigate = useNavigate();
	if (!torres.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "py-12 text-center space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "size-8 mx-auto text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Nenhuma torre cadastrada. Configure a estrutura da obra no Menu."
		})]
	}) });
	const sortedTorres = [...torres].sort((a, b) => a.ordem - b.ordem);
	const getGroupTitle = (tipo) => {
		if (!tipo) return "ANDAR";
		switch (tipo) {
			case "cobertura": return "Cobertura";
			case "tecnica": return "⚡ Áreas Técnicas";
			case "subestacao": return "⚠️ Casa de Força / Subestação";
			case "comercial": return "Lojas / Comercial";
			case "tipo": return "Andares Tipo";
			case "mezanino": return "Mezanino / Pilotis";
			case "terreo": return "Térreo";
			case "garagem": return "Subsolos / Garagens";
			default: return tipo.toUpperCase();
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
		children: sortedTorres.map((torre) => {
			const sortedAndares = [...torre.andares].sort((a, b) => b.numero_andar - a.numero_andar);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "flex flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
						className: "pb-3 pt-4 px-4 bg-muted/30",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-sm text-center font-bold uppercase tracking-wider",
							children: torre.nome
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "px-3 pb-3 pt-2 flex-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-col gap-1.5",
							children: sortedAndares.map((andar, index) => {
								const isNewGroup = index === 0 || sortedAndares[index - 1].tipo_andar !== andar.tipo_andar;
								const isTop = index === 0;
								const isGroundLine = andar.tipo_andar === "garagem" && (index === 0 || sortedAndares[index - 1].tipo_andar !== "garagem");
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col",
									children: [isNewGroup && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: cn("text-[10px] font-bold mt-4 mb-2 uppercase tracking-widest text-center pb-1", andar.tipo_andar === "garagem" ? "text-amber-800/60 border-b-2 border-dashed border-amber-800/30" : "text-muted-foreground border-b border-muted"),
										children: getGroupTitle(andar.tipo_andar)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AndarButton, {
										numero: andar.numero_andar,
										apelido: andar.apelido,
										tipoAndar: andar.tipo_andar,
										apontamentosAbertos: apontamentoCounts.get(andar.id) ?? 0,
										isTop,
										isGroundLine,
										onClick: () => void navigate({
											to: "/obras/$obraId/torres/$torreId/andares/$andarId",
											params: {
												obraId,
												torreId: andar.torre_id,
												andarId: andar.id
											}
										})
									})]
								}, andar.id);
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 bg-muted/80 border-t-4 border-muted w-full mt-auto rounded-b-xl" })
				]
			}, torre.id);
		})
	});
}
function useMateriaisRequisicoes(obraId) {
	return useQuery({
		queryKey: ["materiais-requisicoes", obraId],
		queryFn: async () => {
			const { data: requisicoes, error: errReq } = await supabase.from("materiais_requisicoes").select("*").eq("obra_id", obraId).order("created_at", { ascending: false });
			if (errReq) throw errReq;
			if (!requisicoes?.length) return [];
			const reqIds = requisicoes.map((r) => r.id);
			const { data: itens, error: errItens } = await supabase.from("materiais_itens").select("*").in("requisicao_id", reqIds);
			if (errItens) throw errItens;
			return requisicoes.map((req) => ({
				...req,
				itens: (itens ?? []).filter((i) => i.requisicao_id === req.id)
			}));
		}
	});
}
function useCreateRequisicao() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (payload) => {
			const { data: reqData, error: reqErr } = await supabase.from("materiais_requisicoes").insert({
				obra_id: payload.obra_id,
				autor_id: (await supabase.auth.getUser()).data.user?.id,
				prioridade: payload.prioridade || "normal",
				data_necessidade: payload.data_necessidade || null,
				observacoes: payload.observacoes || null,
				status: "solicitado"
			}).select().single();
			if (reqErr) throw reqErr;
			if (payload.itens.length > 0) {
				const itensToInsert = payload.itens.map((item) => ({
					requisicao_id: reqData.id,
					descricao: item.descricao,
					quantidade: item.quantidade,
					unidade: item.unidade
				}));
				const { error: itemErr } = await supabase.from("materiais_itens").insert(itensToInsert);
				if (itemErr) throw itemErr;
			}
			return reqData;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["materiais-requisicoes", variables.obra_id] });
		}
	});
}
function useUpdateRequisicaoStatus() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, obraId, status }) => {
			const { data, error } = await supabase.from("materiais_requisicoes").update({ status }).eq("id", id).select().single();
			if (error) throw error;
			return data;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["materiais-requisicoes", variables.obraId] });
		}
	});
}
var PRIORIDADE_COLORS = {
	baixa: "bg-muted text-muted-foreground",
	normal: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
	alta: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
	urgente: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
};
var STATUS_ICONS = {
	rascunho: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-4 text-muted-foreground" }),
	solicitado: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-4 text-blue-500" }),
	aprovado: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4 text-emerald-500" }),
	comprado: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "size-4 text-purple-500" }),
	entregue: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "size-4 text-emerald-600" }),
	cancelado: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4 text-red-500" })
};
var STATUS_LABELS$1 = {
	rascunho: "Rascunho",
	solicitado: "Solicitado",
	aprovado: "Aprovado",
	comprado: "Comprado",
	entregue: "Entregue",
	cancelado: "Cancelado"
};
function ObraMateriaisTab({ obraId, isAdmin }) {
	const { data: requisicoes, isLoading } = useMateriaisRequisicoes(obraId);
	const createReq = useCreateRequisicao();
	const updateReq = useUpdateRequisicaoStatus();
	const [openNovaReq, setOpenNovaReq] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		prioridade: "normal",
		data_necessidade: "",
		observacoes: "",
		itens: [{
			descricao: "",
			quantidade: 1,
			unidade: "un"
		}]
	});
	const handleAddItem = () => {
		setForm({
			...form,
			itens: [...form.itens, {
				descricao: "",
				quantidade: 1,
				unidade: "un"
			}]
		});
	};
	const handleRemoveItem = (index) => {
		setForm({
			...form,
			itens: form.itens.filter((_, i) => i !== index)
		});
	};
	const handleItemChange = (index, field, value) => {
		const newItens = [...form.itens];
		newItens[index] = {
			...newItens[index],
			[field]: value
		};
		setForm({
			...form,
			itens: newItens
		});
	};
	const handleSave = async () => {
		const validItens = form.itens.filter((i) => i.descricao.trim() !== "");
		if (validItens.length === 0) {
			toast.error("Adicione pelo menos um item válido na requisição.");
			return;
		}
		try {
			await createReq.mutateAsync({
				obra_id: obraId,
				prioridade: form.prioridade,
				data_necessidade: form.data_necessidade || void 0,
				observacoes: form.observacoes || void 0,
				itens: validItens
			});
			toast.success("Requisição criada com sucesso!");
			setOpenNovaReq(false);
			setForm({
				prioridade: "normal",
				data_necessidade: "",
				observacoes: "",
				itens: [{
					descricao: "",
					quantidade: 1,
					unidade: "un"
				}]
			});
		} catch (e) {
			toast.error(e.message);
		}
	};
	const handleChangeStatus = async (id, status) => {
		try {
			await updateReq.mutateAsync({
				id,
				obraId,
				status
			});
			toast.success(`Status atualizado para ${STATUS_LABELS$1[status]}`);
		} catch (e) {
			toast.error(e.message);
		}
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-8 text-center text-muted-foreground animate-pulse",
		children: "Carregando suprimentos..."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-semibold tracking-tight",
				children: "Requisições de Materiais (RM)"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
				open: openNovaReq,
				onOpenChange: setOpenNovaReq,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4 mr-2" }), " Nova Requisição"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-2xl max-h-[90vh] overflow-y-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Nova Requisição de Materiais" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Crie um pedido de suprimentos para o canteiro de obras." })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 py-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Prioridade" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: form.prioridade,
											onValueChange: (v) => setForm({
												...form,
												prioridade: v
											}),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "baixa",
													children: "Baixa"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "normal",
													children: "Normal"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "alta",
													children: "Alta"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "urgente",
													children: "Urgente"
												})
											] })]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Data de Necessidade (Opcional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "date",
											value: form.data_necessidade,
											onChange: (e) => setForm({
												...form,
												data_necessidade: e.target.value
											})
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Itens Solicitados" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "button",
											variant: "outline",
											size: "sm",
											onClick: handleAddItem,
											children: "+ Adicionar Linha"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-2 border rounded-md p-2 bg-muted/20",
										children: form.itens.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-2 items-start",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex-1",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														placeholder: "Descrição do material...",
														value: item.descricao,
														onChange: (e) => handleItemChange(index, "descricao", e.target.value)
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "w-24",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														type: "number",
														min: "0.1",
														step: "0.1",
														value: item.quantidade,
														onChange: (e) => handleItemChange(index, "quantidade", parseFloat(e.target.value))
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "w-24",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
														value: item.unidade,
														onValueChange: (v) => handleItemChange(index, "unidade", v),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																value: "un",
																children: "un"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																value: "m",
																children: "m"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																value: "kg",
																children: "kg"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																value: "cx",
																children: "cx"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																value: "rolo",
																children: "rolo"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																value: "saco",
																children: "saco"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																value: "l",
																children: "L"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																value: "cj",
																children: "cj"
															})
														] })]
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "ghost",
													size: "icon",
													onClick: () => handleRemoveItem(index),
													className: "text-destructive",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
												})
											]
										}, index))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Observações de Aplicação (Onde será usado?)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										placeholder: "Ex: Para instalação no painel principal do térreo...",
										value: form.observacoes,
										onChange: (e) => setForm({
											...form,
											observacoes: e.target.value
										})
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setOpenNovaReq(false),
							children: "Cancelar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: handleSave,
							disabled: createReq.isPending,
							children: createReq.isPending ? "Salvando..." : "Enviar Requisição"
						})] })
					]
				})]
			})]
		}), !requisicoes?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "py-12 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "size-12 text-muted-foreground mx-auto mb-4 opacity-50" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-lg font-medium",
					children: "Nenhum pedido de material"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mt-1",
					children: "Crie requisições para acompanhar as compras da obra."
				})
			]
		}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
			children: requisicoes.map((req) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "flex flex-col relative overflow-hidden group",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute top-0 left-0 w-1 h-full ${req.status === "entregue" ? "bg-emerald-500" : req.status === "cancelado" ? "bg-red-500" : "bg-blue-500"}` }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
						className: "pb-3 pt-4 pl-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between items-start",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
									className: "text-base flex items-center gap-2",
									children: ["RM-", req.numero_sequencial?.toString().padStart(4, "0")]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, {
									className: "flex items-center gap-1.5 text-xs",
									children: [
										STATUS_ICONS[req.status],
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: STATUS_LABELS$1[req.status]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mx-1",
											children: "•"
										}),
										format(new Date(req.created_at), "dd/MM/yyyy", { locale: ptBR })
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									className: "-mt-1 -mr-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { className: "size-4 text-muted-foreground" })
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
								align: "end",
								children: [isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
										onClick: () => handleChangeStatus(req.id, "aprovado"),
										children: "Marcar como Aprovado"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
										onClick: () => handleChangeStatus(req.id, "comprado"),
										children: "Marcar como Comprado"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
										onClick: () => handleChangeStatus(req.id, "entregue"),
										children: "Marcar como Entregue"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
										onClick: () => handleChangeStatus(req.id, "cancelado"),
										className: "text-destructive",
										children: "Cancelar RM"
									})
								] }), !isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
									disabled: true,
									children: "Apenas Admins gerenciam status"
								})]
							})] })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "flex-1 pb-3 pl-5 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-3 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge$1, {
									variant: "secondary",
									className: PRIORIDADE_COLORS[req.prioridade],
									children: req.prioridade.toUpperCase()
								}), req.data_necessidade && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full",
									children: ["Para: ", format(new Date(req.data_necessidade), "dd/MM/yy")]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5 mt-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2",
									children: "Itens Solicitados"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "space-y-1.5",
									children: [req.itens?.slice(0, 3).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex justify-between border-b pb-1 last:border-0 border-dashed",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate pr-2",
											title: item.descricao,
											children: item.descricao
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-medium tabular-nums whitespace-nowrap",
											children: [
												item.quantidade,
												" ",
												item.unidade
											]
										})]
									}, item.id)), (req.itens?.length ?? 0) > 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "text-xs text-muted-foreground italic pt-1",
										children: [
											"+ ",
											(req.itens?.length ?? 0) - 3,
											" outros itens..."
										]
									})]
								})]
							}),
							req.observacoes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 pt-3 border-t text-xs text-muted-foreground italic line-clamp-2",
								children: [
									"\"",
									req.observacoes,
									"\""
								]
							})
						]
					})
				]
			}, req.id))
		})]
	});
}
function useLaudos(obraId) {
	return useQuery({
		queryKey: ["laudos-ensaios", obraId],
		queryFn: async () => {
			const { data, error } = await supabase.from("laudos_ensaios").select("*").eq("obra_id", obraId).order("data_ensaio", { ascending: false });
			if (error) throw error;
			return data;
		}
	});
}
function useCreateLaudo() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (payload) => {
			const fileExt = payload.file.name.split(".").pop();
			const fileName = `${payload.obra_id}/${crypto.randomUUID()}.${fileExt}`;
			const { error: uploadErr } = await supabase.storage.from("laudos-ensaios").upload(fileName, payload.file);
			if (uploadErr) throw uploadErr;
			const { data, error } = await supabase.from("laudos_ensaios").insert({
				obra_id: payload.obra_id,
				disciplina: payload.disciplina,
				tipo_ensaio: payload.tipo_ensaio,
				data_ensaio: payload.data_ensaio,
				observacoes: payload.observacoes || null,
				arquivo_path: fileName
			}).select().single();
			if (error) throw error;
			return data;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["laudos-ensaios", variables.obra_id] });
		}
	});
}
function useUpdateLaudoStatus() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, obraId, status }) => {
			const { data, error } = await supabase.from("laudos_ensaios").update({
				status_aprovacao: status,
				aprovado_por: status === "pendente" ? null : (await supabase.auth.getUser()).data.user?.id
			}).eq("id", id).select().single();
			if (error) throw error;
			return data;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["laudos-ensaios", variables.obraId] });
		}
	});
}
function useDeleteLaudo() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, obraId, arquivoPath }) => {
			const { error: storageErr } = await supabase.storage.from("laudos-ensaios").remove([arquivoPath]);
			if (storageErr) throw storageErr;
			const { error } = await supabase.from("laudos_ensaios").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["laudos-ensaios", variables.obraId] });
		}
	});
}
var STATUS_CONFIG = {
	pendente: {
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-4" }),
		label: "Pendente",
		color: "text-amber-500 bg-amber-500/10 border-amber-500/20"
	},
	aprovado: {
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4" }),
		label: "Aprovado",
		color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
	},
	reprovado: {
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "size-4" }),
		label: "Reprovado",
		color: "text-red-500 bg-red-500/10 border-red-500/20"
	}
};
function ObraComissionamentoTab({ obraId, isAdmin }) {
	const { data: laudos, isLoading } = useLaudos(obraId);
	const createLaudo = useCreateLaudo();
	const updateStatus = useUpdateLaudoStatus();
	const deleteLaudo = useDeleteLaudo();
	const [openNova, setOpenNova] = (0, import_react.useState)(false);
	const [file, setFile] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)({
		disciplina: "eletrica",
		tipo_ensaio: "",
		data_ensaio: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
		observacoes: ""
	});
	const fileInputRef = (0, import_react.useRef)(null);
	const handleSave = async () => {
		if (!file) {
			toast.error("Anexe o arquivo PDF do laudo.");
			return;
		}
		if (!form.tipo_ensaio.trim()) {
			toast.error("Informe o tipo de ensaio.");
			return;
		}
		try {
			await createLaudo.mutateAsync({
				obra_id: obraId,
				disciplina: form.disciplina,
				tipo_ensaio: form.tipo_ensaio,
				data_ensaio: form.data_ensaio,
				observacoes: form.observacoes || void 0,
				file
			});
			toast.success("Laudo enviado com sucesso!");
			setOpenNova(false);
			setFile(null);
			setForm({
				disciplina: "eletrica",
				tipo_ensaio: "",
				data_ensaio: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
				observacoes: ""
			});
		} catch (e) {
			toast.error("Erro ao enviar laudo: " + e.message);
		}
	};
	const handleViewFile = async (path) => {
		try {
			const { data } = await supabase.storage.from("laudos-ensaios").createSignedUrl(path, 3600);
			if (data?.signedUrl) window.open(data.signedUrl, "_blank");
		} catch (e) {
			toast.error("Erro ao abrir arquivo");
		}
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-8 text-center text-muted-foreground animate-pulse",
		children: "Carregando laudos..."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-semibold tracking-tight",
				children: "Laudos Técnicos e Ensaios"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
				open: openNova,
				onOpenChange: setOpenNova,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "size-4 mr-2" }), " Enviar Laudo"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Anexar Novo Laudo / Ensaio" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Faça o upload do certificado de calibração ou laudo técnico em PDF." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 py-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Disciplina" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: form.disciplina,
										onValueChange: (v) => setForm({
											...form,
											disciplina: v
										}),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "eletrica",
												children: "Elétrica"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "civil",
												children: "Civil"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "hidraulica",
												children: "Hidráulica"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "incendio",
												children: "Prevenção a Incêndio"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "climatizacao",
												children: "Climatização"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "outro",
												children: "Outro"
											})
										] })]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Data do Ensaio" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "date",
										value: form.data_ensaio,
										onChange: (e) => setForm({
											...form,
											data_ensaio: e.target.value
										})
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Tipo de Ensaio" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "Ex: Megômetro, Resistência de Aterramento...",
									value: form.tipo_ensaio,
									onChange: (e) => setForm({
										...form,
										tipo_ensaio: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Arquivo PDF" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "file",
										accept: ".pdf,image/*",
										ref: fileInputRef,
										className: "hidden",
										onChange: (e) => setFile(e.target.files?.[0] || null)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										className: "w-full",
										onClick: () => fileInputRef.current?.click(),
										children: file ? file.name : "Selecionar Arquivo"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Observações (Opcional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									placeholder: "Detalhes ou ressalvas sobre o laudo...",
									value: form.observacoes,
									onChange: (e) => setForm({
										...form,
										observacoes: e.target.value
									})
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setOpenNova(false),
						children: "Cancelar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: handleSave,
						disabled: createLaudo.isPending,
						children: createLaudo.isPending ? "Enviando..." : "Salvar Laudo"
					})] })
				] })]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "p-0",
			children: !laudos?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-12 text-center text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheck, { className: "size-10 mx-auto mb-3 opacity-50" }), "Nenhum laudo técnico anexado."]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted/50 text-muted-foreground uppercase text-xs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "Disciplina"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "Tipo de Ensaio"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "Data"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium text-right",
								children: "Ações"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y",
						children: laudos.map((laudo) => {
							const statusCfg = STATUS_CONFIG[laudo.status_aprovacao];
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-muted/30 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 capitalize font-medium",
										children: laudo.disciplina
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-4 text-primary/60" }), laudo.tipo_ensaio]
										}), laudo.observacoes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground mt-0.5 truncate max-w-[200px]",
											children: laudo.observacoes
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 whitespace-nowrap",
										children: format(new Date(laudo.data_ensaio), "dd/MM/yyyy", { locale: ptBR })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge$1, {
											variant: "outline",
											className: `gap-1 pr-2 ${statusCfg.color}`,
											children: [
												statusCfg.icon,
												" ",
												statusCfg.label
											]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-end gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												variant: "ghost",
												size: "sm",
												onClick: () => handleViewFile(laudo.arquivo_path),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4 mr-2" }), " Abrir"]
											}), isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
												asChild: true,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "ghost",
													size: "icon",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { className: "size-4" })
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
												align: "end",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
														onClick: () => updateStatus.mutate({
															id: laudo.id,
															obraId,
															status: "aprovado"
														}),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4 mr-2 text-emerald-500" }), " Aprovar"]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
														onClick: () => updateStatus.mutate({
															id: laudo.id,
															obraId,
															status: "reprovado"
														}),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "size-4 mr-2 text-red-500" }), " Reprovar"]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
														className: "text-destructive",
														onClick: () => {
															if (confirm("Deseja realmente excluir este laudo?")) deleteLaudo.mutate({
																id: laudo.id,
																obraId,
																arquivoPath: laudo.arquivo_path
															});
														},
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4 mr-2" }), " Excluir"]
													})
												]
											})] })]
										})
									})
								]
							}, laudo.id);
						})
					})]
				})
			})
		}) })]
	});
}
function useSesmtDds(obraId) {
	return useQuery({
		queryKey: ["sesmt-dds", obraId],
		queryFn: async () => {
			const { data, error } = await supabase.from("sesmt_dds").select("*").eq("obra_id", obraId).order("data", { ascending: false });
			if (error) throw error;
			return data;
		}
	});
}
function useCreateDds() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (payload) => {
			let arquivoPath = null;
			if (payload.file) {
				const fileExt = payload.file.name.split(".").pop();
				arquivoPath = `${payload.obra_id}/dds/${crypto.randomUUID()}.${fileExt}`;
				const { error: uploadErr } = await supabase.storage.from("sesmt-arquivos").upload(arquivoPath, payload.file);
				if (uploadErr) throw uploadErr;
			}
			const { data, error } = await supabase.from("sesmt_dds").insert({
				obra_id: payload.obra_id,
				data: payload.data,
				tema: payload.tema,
				instrutor: payload.instrutor,
				observacoes: payload.observacoes || null,
				arquivo_lista_presenca: arquivoPath
			}).select().single();
			if (error) throw error;
			return data;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["sesmt-dds", variables.obra_id] });
		}
	});
}
function useSesmtEpis(obraId) {
	return useQuery({
		queryKey: ["sesmt-epis", obraId],
		queryFn: async () => {
			const { data, error } = await supabase.from("sesmt_epis").select("*").eq("obra_id", obraId).order("data_entrega", { ascending: false });
			if (error) throw error;
			return data;
		}
	});
}
function useCreateEpi() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (payload) => {
			let arquivoPath = null;
			if (payload.file) {
				const fileExt = payload.file.name.split(".").pop();
				arquivoPath = `${payload.obra_id}/epis/${crypto.randomUUID()}.${fileExt}`;
				const { error: uploadErr } = await supabase.storage.from("sesmt-arquivos").upload(arquivoPath, payload.file);
				if (uploadErr) throw uploadErr;
			}
			const { data, error } = await supabase.from("sesmt_epis").insert({
				obra_id: payload.obra_id,
				funcionario: payload.funcionario,
				equipamento: payload.equipamento,
				ca_numero: payload.ca_numero || null,
				data_entrega: payload.data_entrega,
				termo_assinado_path: arquivoPath
			}).select().single();
			if (error) throw error;
			return data;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["sesmt-epis", variables.obra_id] });
		}
	});
}
var Tabs = Root2$1;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = List.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow", className),
	...props
}));
TabsTrigger.displayName = Trigger.displayName;
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
	ref,
	className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}));
TabsContent.displayName = Content.displayName;
function ObraSesmtTab({ obraId, isAdmin }) {
	const ddsQuery = useSesmtDds(obraId);
	const episQuery = useSesmtEpis(obraId);
	const createDds = useCreateDds();
	const createEpi = useCreateEpi();
	const [openDds, setOpenDds] = (0, import_react.useState)(false);
	const [openEpi, setOpenEpi] = (0, import_react.useState)(false);
	const [ddsForm, setDdsForm] = (0, import_react.useState)({
		data: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
		tema: "",
		instrutor: "",
		observacoes: ""
	});
	const [ddsFile, setDdsFile] = (0, import_react.useState)(null);
	const ddsFileRef = (0, import_react.useRef)(null);
	const [epiForm, setEpiForm] = (0, import_react.useState)({
		funcionario: "",
		equipamento: "",
		ca_numero: "",
		data_entrega: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
	});
	const [epiFile, setEpiFile] = (0, import_react.useState)(null);
	const epiFileRef = (0, import_react.useRef)(null);
	const handleSaveDds = async () => {
		if (!ddsForm.tema.trim() || !ddsForm.instrutor.trim()) {
			toast.error("Preencha tema e instrutor.");
			return;
		}
		try {
			await createDds.mutateAsync({
				obra_id: obraId,
				...ddsForm,
				file: ddsFile
			});
			toast.success("DDS registrado com sucesso!");
			setOpenDds(false);
			setDdsForm({
				data: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
				tema: "",
				instrutor: "",
				observacoes: ""
			});
			setDdsFile(null);
		} catch (e) {
			toast.error("Erro ao registrar DDS: " + e.message);
		}
	};
	const handleSaveEpi = async () => {
		if (!epiForm.funcionario.trim() || !epiForm.equipamento.trim()) {
			toast.error("Preencha funcionário e equipamento.");
			return;
		}
		try {
			await createEpi.mutateAsync({
				obra_id: obraId,
				...epiForm,
				file: epiFile
			});
			toast.success("EPI registrado com sucesso!");
			setOpenEpi(false);
			setEpiForm({
				funcionario: "",
				equipamento: "",
				ca_numero: "",
				data_entrega: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
			});
			setEpiFile(null);
		} catch (e) {
			toast.error("Erro ao registrar EPI: " + e.message);
		}
	};
	const handleViewFile = async (path) => {
		try {
			const { data } = await supabase.storage.from("sesmt-arquivos").createSignedUrl(path, 3600);
			if (data?.signedUrl) window.open(data.signedUrl, "_blank");
		} catch (e) {
			toast.error("Erro ao abrir arquivo");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center justify-between",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-semibold tracking-tight",
				children: "Segurança do Trabalho (SESMT)"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: "dds",
			className: "w-full",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
					className: "w-full sm:w-auto grid grid-cols-2 sm:inline-flex",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
						value: "dds",
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" }), " DDS"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
						value: "epis",
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HardHat, { className: "size-4" }), " Controle de EPIs"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "dds",
					className: "mt-4 space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
							open: openDds,
							onOpenChange: setOpenDds,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4 mr-2" }), " Registrar DDS"]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Diálogo Diário de Segurança (DDS)" }) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-4 py-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-2 gap-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Data" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "date",
													value: ddsForm.data,
													onChange: (e) => setDdsForm({
														...ddsForm,
														data: e.target.value
													})
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Instrutor / Técnico" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													placeholder: "Nome...",
													value: ddsForm.instrutor,
													onChange: (e) => setDdsForm({
														...ddsForm,
														instrutor: e.target.value
													})
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Tema Abordado" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												placeholder: "Ex: Uso de cinturão, Risco elétrico...",
												value: ddsForm.tema,
												onChange: (e) => setDdsForm({
													...ddsForm,
													tema: e.target.value
												})
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Lista de Presença Assinada (Opcional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "file",
													ref: ddsFileRef,
													className: "hidden",
													accept: ".pdf,image/*",
													onChange: (e) => setDdsFile(e.target.files?.[0] || null)
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "outline",
													className: "w-full",
													onClick: () => ddsFileRef.current?.click(),
													children: ddsFile ? ddsFile.name : "Anexar Arquivo"
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Observações" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
												value: ddsForm.observacoes,
												onChange: (e) => setDdsForm({
													...ddsForm,
													observacoes: e.target.value
												})
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									onClick: () => setOpenDds(false),
									children: "Cancelar"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: handleSaveDds,
									disabled: createDds.isPending,
									children: "Salvar DDS"
								})] })
							] })]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "p-0",
						children: !ddsQuery.data?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-12 text-center text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-10 mx-auto mb-3 opacity-50" }), "Nenhum DDS registrado."]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-sm text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "bg-muted/50 text-muted-foreground uppercase text-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3 font-medium",
											children: "Data"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3 font-medium",
											children: "Tema"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3 font-medium",
											children: "Instrutor"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3 font-medium text-right",
											children: "Presença"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
									className: "divide-y",
									children: ddsQuery.data.map((dds) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "hover:bg-muted/30",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3 whitespace-nowrap",
												children: format(new Date(dds.data), "dd/MM/yyyy", { locale: ptBR })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3 font-medium",
												children: dds.tema
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3",
												children: dds.instrutor
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3 text-right",
												children: dds.arquivo_lista_presenca ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													variant: "ghost",
													size: "sm",
													onClick: () => handleViewFile(dds.arquivo_lista_presenca),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4 mr-2" }), " Ver Lista"]
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground text-xs italic",
													children: "Sem anexo"
												})
											})
										]
									}, dds.id))
								})]
							})
						})
					}) })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "epis",
					className: "mt-4 space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
							open: openEpi,
							onOpenChange: setOpenEpi,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4 mr-2" }), " Entregar EPI"]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Registro de Entrega de EPI" }) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-4 py-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nome do Funcionário" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												placeholder: "Ex: José da Silva",
												value: epiForm.funcionario,
												onChange: (e) => setEpiForm({
													...epiForm,
													funcionario: e.target.value
												})
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-2 gap-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Equipamento (EPI)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													placeholder: "Ex: Capacete, Bota...",
													value: epiForm.equipamento,
													onChange: (e) => setEpiForm({
														...epiForm,
														equipamento: e.target.value
													})
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nº do C.A. (Certificado)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													placeholder: "Ex: 12345",
													value: epiForm.ca_numero,
													onChange: (e) => setEpiForm({
														...epiForm,
														ca_numero: e.target.value
													})
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-2 gap-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Data de Entrega" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "date",
													value: epiForm.data_entrega,
													onChange: (e) => setEpiForm({
														...epiForm,
														data_entrega: e.target.value
													})
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Ficha Assinada (Opcional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														type: "file",
														ref: epiFileRef,
														className: "hidden",
														accept: ".pdf,image/*",
														onChange: (e) => setEpiFile(e.target.files?.[0] || null)
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														variant: "outline",
														className: "w-full",
														onClick: () => epiFileRef.current?.click(),
														children: epiFile ? epiFile.name : "Anexar Ficha"
													})]
												})]
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									onClick: () => setOpenEpi(false),
									children: "Cancelar"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: handleSaveEpi,
									disabled: createEpi.isPending,
									children: "Salvar Entrega"
								})] })
							] })]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "p-0",
						children: !episQuery.data?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-12 text-center text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HardHat, { className: "size-10 mx-auto mb-3 opacity-50" }), "Nenhuma entrega de EPI registrada."]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-sm text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "bg-muted/50 text-muted-foreground uppercase text-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3 font-medium",
											children: "Funcionário"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3 font-medium",
											children: "Equipamento (C.A)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3 font-medium",
											children: "Data Entrega"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3 font-medium text-right",
											children: "Ficha"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
									className: "divide-y",
									children: episQuery.data.map((epi) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "hover:bg-muted/30",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3 font-medium",
												children: epi.funcionario
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2",
													children: [epi.equipamento, epi.ca_numero && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
														variant: "outline",
														className: "text-[10px]",
														children: ["C.A: ", epi.ca_numero]
													})]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3 whitespace-nowrap",
												children: format(new Date(epi.data_entrega), "dd/MM/yyyy", { locale: ptBR })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3 text-right",
												children: epi.termo_assinado_path ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													variant: "ghost",
													size: "sm",
													onClick: () => handleViewFile(epi.termo_assinado_path),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-4 mr-2" }), " Ficha"]
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground text-xs italic",
													children: "Sem anexo"
												})
											})
										]
									}, epi.id))
								})]
							})
						})
					}) })]
				})
			]
		})]
	});
}
function ObraCronogramaTab({ obraId }) {
	const { data: eapItems = [], isLoading } = useQuery({
		queryKey: ["obra-eap", obraId],
		queryFn: async () => {
			const { data, error } = await supabase.from("obra_eap").select("*").eq("obra_id", obraId).order("codigo", { ascending: true });
			if (error && error.code !== "PGRST116") throw error;
			return data || [];
		}
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex justify-center py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-8 animate-spin" })
	});
	const validItems = eapItems.filter((item) => item.data_inicio_planejada && item.data_fim_planejada);
	if (validItems.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
			className: "text-2xl font-bold flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarRange, { className: "size-6 text-primary" }), "Cronograma Visual (Gantt)"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "p-12 text-center text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Nenhuma tarefa da EAP possui datas de início e fim cadastradas." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm mt-2",
				children: "Vá até a aba \"EAP\" e cadastre os prazos para visualizar o Gantt."
			})]
		}) })]
	});
	const minDate = min(validItems.map((i) => new Date(i.data_inicio_planejada)));
	const maxDate = max(validItems.map((i) => new Date(i.data_fim_planejada)));
	const startGantt = startOfWeek(minDate, { weekStartsOn: 1 });
	const totalDays = differenceInDays(maxDate, startGantt) + 7;
	Array.from({ length: totalDays }, (_, i) => addDays(startGantt, i));
	const renderTaskBar = (start, end, progress = 0) => {
		const taskStart = new Date(start);
		const taskEnd = new Date(end);
		const leftOffset = differenceInDays(taskStart, startGantt) / totalDays * 100;
		const width = differenceInDays(taskEnd, taskStart) / totalDays * 100;
		const progressWidth = `${progress}%`;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative h-6 w-full bg-muted/20 rounded group",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute h-full rounded shadow-sm overflow-hidden flex items-center bg-primary/20",
				style: {
					left: `${Math.max(0, leftOffset)}%`,
					width: `${Math.max(1, width)}%`
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full bg-primary transition-all duration-500",
					style: { width: progressWidth }
				})
			})
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
			className: "text-2xl font-bold flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarRange, { className: "size-6 text-primary" }), "Cronograma Visual (Gantt)"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted-foreground mt-1",
			children: "Acompanhe o andamento físico da obra ao longo do tempo."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Linha do Tempo" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, { children: [
			"De ",
			format(minDate, "dd/MM/yyyy"),
			" a ",
			format(maxDate, "dd/MM/yyyy")
		] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "overflow-x-auto pb-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-[800px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex border-b border-border pb-2 mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-[30%] shrink-0 font-medium text-sm text-muted-foreground pl-2",
						children: "Tarefas da EAP"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 relative",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute left-0 text-xs text-muted-foreground -top-4",
								children: "Início Projeto"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute right-0 text-xs text-muted-foreground -top-4",
								children: "Fim Previsto"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-full h-full border-l border-r border-border/50 relative",
								children: (() => {
									const today = /* @__PURE__ */ new Date();
									if (today >= startGantt && today <= maxDate) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute h-full w-[1px] border-l-2 border-dashed border-red-500/50 z-10",
										style: { left: `${differenceInDays(today, startGantt) / totalDays * 100}%` },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "absolute -top-5 -left-3 text-[10px] text-red-500 font-bold bg-background px-1",
											children: "Hoje"
										})
									});
									return null;
								})()
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: validItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center group",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-[30%] shrink-0 pr-4 truncate",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold mr-2 text-primary",
									children: item.codigo
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm",
									title: item.descricao,
									children: item.descricao
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[10px] text-muted-foreground mt-0.5",
									children: [
										format(new Date(item.data_inicio_planejada), "dd/MMM", { locale: ptBR }),
										" - ",
										format(new Date(item.data_fim_planejada), "dd/MMM", { locale: ptBR }),
										" (",
										item.avanco_realizado || 0,
										"%)"
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 relative",
							children: renderTaskBar(item.data_inicio_planejada, item.data_fim_planejada, item.avanco_realizado || 0)
						})]
					}, item.id))
				})]
			})
		})] })]
	});
}
var Table = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: "relative w-full overflow-auto",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
		ref,
		className: cn("w-full caption-bottom text-sm", className),
		...props
	})
}));
Table.displayName = "Table";
var TableHeader = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
	ref,
	className: cn("[&_tr]:border-b", className),
	...props
}));
TableHeader.displayName = "TableHeader";
var TableBody = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
	ref,
	className: cn("[&_tr:last-child]:border-0", className),
	...props
}));
TableBody.displayName = "TableBody";
var TableFooter = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tfoot", {
	ref,
	className: cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className),
	...props
}));
TableFooter.displayName = "TableFooter";
var TableRow = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
	ref,
	className: cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className),
	...props
}));
TableRow.displayName = "TableRow";
var TableHead = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
	ref,
	className: cn("h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className),
	...props
}));
TableHead.displayName = "TableHead";
var TableCell = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
	ref,
	className: cn("p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className),
	...props
}));
TableCell.displayName = "TableCell";
var TableCaption = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("caption", {
	ref,
	className: cn("mt-4 text-sm text-muted-foreground", className),
	...props
}));
TableCaption.displayName = "TableCaption";
var Form = FormProvider;
var FormFieldContext = import_react.createContext(null);
var FormField = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormFieldContext.Provider, {
		value: { name: props.name },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Controller, { ...props })
	});
};
var useFormField = () => {
	const fieldContext = import_react.useContext(FormFieldContext);
	const itemContext = import_react.useContext(FormItemContext);
	const { getFieldState, formState } = useFormContext();
	if (!fieldContext) throw new Error("useFormField should be used within <FormField>");
	if (!itemContext) throw new Error("useFormField should be used within <FormItem>");
	const fieldState = getFieldState(fieldContext.name, formState);
	const { id } = itemContext;
	return {
		id,
		name: fieldContext.name,
		formItemId: `${id}-form-item`,
		formDescriptionId: `${id}-form-item-description`,
		formMessageId: `${id}-form-item-message`,
		...fieldState
	};
};
var FormItemContext = import_react.createContext(null);
var FormItem = import_react.forwardRef(({ className, ...props }, ref) => {
	const id = import_react.useId();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormItemContext.Provider, {
		value: { id },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref,
			className: cn("space-y-2", className),
			...props
		})
	});
});
FormItem.displayName = "FormItem";
var FormLabel = import_react.forwardRef(({ className, ...props }, ref) => {
	const { error, formItemId } = useFormField();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
		ref,
		className: cn(error && "text-destructive", className),
		htmlFor: formItemId,
		...props
	});
});
FormLabel.displayName = "FormLabel";
var FormControl = import_react.forwardRef(({ ...props }, ref) => {
	const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slot, {
		ref,
		id: formItemId,
		"aria-describedby": !error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`,
		"aria-invalid": !!error,
		...props
	});
});
FormControl.displayName = "FormControl";
var FormDescription = import_react.forwardRef(({ className, ...props }, ref) => {
	const { formDescriptionId } = useFormField();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		ref,
		id: formDescriptionId,
		className: cn("text-[0.8rem] text-muted-foreground", className),
		...props
	});
});
FormDescription.displayName = "FormDescription";
var FormMessage = import_react.forwardRef(({ className, children, ...props }, ref) => {
	const { error, formMessageId } = useFormField();
	const body = error ? String(error?.message ?? "") : children;
	if (!body) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		ref,
		id: formMessageId,
		className: cn("text-[0.8rem] font-medium text-destructive", className),
		...props,
		children: body
	});
});
FormMessage.displayName = "FormMessage";
function useConcretagens(obraId) {
	return useQuery({
		queryKey: ["concretagens", obraId],
		queryFn: async () => {
			if (!obraId) return [];
			const { data, error } = await supabase.from("obra_concretagem").select("*").eq("obra_id", obraId).order("data", { ascending: false });
			if (error) {
				console.error("Erro ao buscar concretagens:", error);
				throw error;
			}
			return data;
		},
		enabled: !!obraId
	});
}
function useCreateConcretagem() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (novaConcretagem) => {
			const { data, error } = await supabase.from("obra_concretagem").insert([novaConcretagem]).select().single();
			if (error) {
				console.error("Erro ao criar concretagem:", error);
				throw error;
			}
			return data;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["concretagens", variables.obra_id] });
		}
	});
}
function useUpdateConcretagem() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, ...updates }) => {
			const { data, error } = await supabase.from("obra_concretagem").update(updates).eq("id", id).select().single();
			if (error) {
				console.error("Erro ao atualizar concretagem:", error);
				throw error;
			}
			return data;
		},
		onSuccess: (data) => {
			if (data?.obra_id) queryClient.invalidateQueries({ queryKey: ["concretagens", data.obra_id] });
			else queryClient.invalidateQueries({ queryKey: ["concretagens"] });
		}
	});
}
function useDeleteConcretagem() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ id }) => {
			const { error } = await supabase.from("obra_concretagem").delete().eq("id", id);
			if (error) {
				console.error("Erro ao deletar concretagem:", error);
				throw error;
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["concretagens"] });
		}
	});
}
var concretagemSchema = objectType({
	data: stringType().min(1, "Data é obrigatória"),
	fornecedor: stringType().optional(),
	nota_fiscal: stringType().optional(),
	placa_caminhao: stringType().optional(),
	volume_m3: coerce.number().optional(),
	fck_projeto: coerce.number().optional(),
	slump_test: stringType().optional(),
	local_lancamento: stringType().optional(),
	status: enumType([
		"agendado",
		"em_andamento",
		"concluido",
		"cancelado"
	]),
	observacoes: stringType().optional()
});
function ObraConcretagemTab({ obraId }) {
	const { data: concretagens, isLoading } = useConcretagens(obraId);
	const createMutation = useCreateConcretagem();
	const updateMutation = useUpdateConcretagem();
	const deleteMutation = useDeleteConcretagem();
	const [isDialogOpen, setIsDialogOpen] = (0, import_react.useState)(false);
	const [editingConcretagem, setEditingConcretagem] = (0, import_react.useState)(null);
	const form = useForm({
		resolver: u(concretagemSchema),
		defaultValues: {
			data: (/* @__PURE__ */ new Date()).toISOString().slice(0, 16),
			fornecedor: "",
			nota_fiscal: "",
			placa_caminhao: "",
			volume_m3: void 0,
			fck_projeto: void 0,
			slump_test: "",
			local_lancamento: "",
			status: "agendado",
			observacoes: ""
		}
	});
	const onSubmit = async (values) => {
		try {
			if (editingConcretagem) {
				await updateMutation.mutateAsync({
					id: editingConcretagem.id,
					...values,
					fornecedor: values.fornecedor || null,
					nota_fiscal: values.nota_fiscal || null,
					placa_caminhao: values.placa_caminhao || null,
					volume_m3: values.volume_m3 || null,
					fck_projeto: values.fck_projeto || null,
					slump_test: values.slump_test || null,
					local_lancamento: values.local_lancamento || null,
					observacoes: values.observacoes || null
				});
				toast.success("Concretagem atualizada com sucesso");
			} else {
				await createMutation.mutateAsync({
					obra_id: obraId,
					...values,
					fornecedor: values.fornecedor || null,
					nota_fiscal: values.nota_fiscal || null,
					placa_caminhao: values.placa_caminhao || null,
					volume_m3: values.volume_m3 || null,
					fck_projeto: values.fck_projeto || null,
					slump_test: values.slump_test || null,
					local_lancamento: values.local_lancamento || null,
					observacoes: values.observacoes || null,
					rastreabilidade_corpos_prova: null
				});
				toast.success("Concretagem registrada com sucesso");
			}
			setIsDialogOpen(false);
			form.reset();
			setEditingConcretagem(null);
		} catch (error) {
			toast.error("Erro ao salvar concretagem");
		}
	};
	const handleEdit = (concretagem) => {
		setEditingConcretagem(concretagem);
		form.reset({
			data: new Date(concretagem.data).toISOString().slice(0, 16),
			fornecedor: concretagem.fornecedor || "",
			nota_fiscal: concretagem.nota_fiscal || "",
			placa_caminhao: concretagem.placa_caminhao || "",
			volume_m3: concretagem.volume_m3 || void 0,
			fck_projeto: concretagem.fck_projeto || void 0,
			slump_test: concretagem.slump_test || "",
			local_lancamento: concretagem.local_lancamento || "",
			status: concretagem.status,
			observacoes: concretagem.observacoes || ""
		});
		setIsDialogOpen(true);
	};
	const handleDelete = async (id) => {
		if (confirm("Tem certeza que deseja excluir este registro de concretagem?")) try {
			await deleteMutation.mutateAsync({ id });
			toast.success("Registro excluído com sucesso");
		} catch (error) {
			toast.error("Erro ao excluir registro");
		}
	};
	const openNewDialog = () => {
		setEditingConcretagem(null);
		form.reset({
			data: (/* @__PURE__ */ new Date()).toISOString().slice(0, 16),
			fornecedor: "",
			nota_fiscal: "",
			placa_caminhao: "",
			volume_m3: void 0,
			fck_projeto: void 0,
			slump_test: "",
			local_lancamento: "",
			status: "agendado",
			observacoes: ""
		});
		setIsDialogOpen(true);
	};
	const getStatusBadge = (status) => {
		switch (status) {
			case "agendado": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge$1, {
				variant: "outline",
				className: "bg-blue-50 text-blue-700 border-blue-200",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3 h-3 mr-1" }), " Agendado"]
			});
			case "em_andamento": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge$1, {
				variant: "outline",
				className: "bg-amber-50 text-amber-700 border-amber-200",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "w-3 h-3 mr-1" }), " Em Andamento"]
			});
			case "concluido": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge$1, {
				variant: "outline",
				className: "bg-emerald-50 text-emerald-700 border-emerald-200",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3 h-3 mr-1" }), " Concluído"]
			});
			case "cancelado": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge$1, {
				variant: "outline",
				className: "bg-red-50 text-red-700 border-red-200",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "w-3 h-3 mr-1" }), " Cancelado"]
			});
			default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge$1, {
				variant: "outline",
				children: status
			});
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex justify-between items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "text-2xl font-bold tracking-tight flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "w-6 h-6 text-primary" }), "Diário de Concretagem"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground",
				children: "Gerencie os lançamentos de concreto e rastreabilidade da obra."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
				open: isDialogOpen,
				onOpenChange: setIsDialogOpen,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: openNewDialog,
						className: "shadow-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4 mr-2" }), "Novo Lançamento"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-2xl max-h-[90vh] overflow-y-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editingConcretagem ? "Editar Lançamento" : "Novo Lançamento de Concreto" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Form, {
						...form,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: form.handleSubmit(onSubmit),
							className: "space-y-4 py-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 md:grid-cols-2 gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
										control: form.control,
										name: "data",
										render: ({ field }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, { children: "Data e Hora" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormControl, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "datetime-local",
												...field
											}) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormMessage, {})
										] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
										control: form.control,
										name: "status",
										render: ({ field }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, { children: "Status" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												onValueChange: field.onChange,
												value: field.value,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormControl, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Selecione o status" }) }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "agendado",
														children: "Agendado"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "em_andamento",
														children: "Em Andamento"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "concluido",
														children: "Concluído"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "cancelado",
														children: "Cancelado"
													})
												] })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormMessage, {})
										] })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 md:grid-cols-3 gap-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
											control: form.control,
											name: "fornecedor",
											render: ({ field }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, { children: "Fornecedor" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormControl, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													placeholder: "Concreteira XYZ",
													...field
												}) }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormMessage, {})
											] })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
											control: form.control,
											name: "nota_fiscal",
											render: ({ field }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, { children: "Nota Fiscal" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormControl, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													placeholder: "Nº da NF",
													...field
												}) }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormMessage, {})
											] })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
											control: form.control,
											name: "placa_caminhao",
											render: ({ field }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, { children: "Placa do Caminhão" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormControl, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													placeholder: "ABC-1234",
													...field
												}) }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormMessage, {})
											] })
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 md:grid-cols-3 gap-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
											control: form.control,
											name: "volume_m3",
											render: ({ field }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, { children: "Volume (m³)" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormControl, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "number",
													step: "0.1",
													placeholder: "8.0",
													...field,
													value: field.value ?? ""
												}) }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormMessage, {})
											] })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
											control: form.control,
											name: "fck_projeto",
											render: ({ field }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, { children: "Fck (MPa)" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormControl, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "number",
													placeholder: "30",
													...field,
													value: field.value ?? ""
												}) }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormMessage, {})
											] })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
											control: form.control,
											name: "slump_test",
											render: ({ field }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, { children: "Slump Test" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormControl, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													placeholder: "10 ± 2",
													...field
												}) }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormMessage, {})
											] })
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
									control: form.control,
									name: "local_lancamento",
									render: ({ field }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, { children: "Local de Lançamento" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormControl, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											placeholder: "Ex: Pilar P1 a P5, Laje Nível 1",
											...field
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormMessage, {})
									] })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
									control: form.control,
									name: "observacoes",
									render: ({ field }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, { children: "Observações" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormControl, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											placeholder: "Observações adicionais sobre o lançamento...",
											...field
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormMessage, {})
									] })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-end gap-2 pt-4 border-t",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "outline",
										onClick: () => setIsDialogOpen(false),
										children: "Cancelar"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										disabled: createMutation.isPending || updateMutation.isPending,
										children: createMutation.isPending || updateMutation.isPending ? "Salvando..." : "Salvar"
									})]
								})
							]
						})
					})]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "border-t-4 border-t-primary shadow-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
				className: "pb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-lg",
					children: "Histórico de Lançamentos"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Lista de todos os caminhões e volumes concretados nesta obra." })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "py-8 flex justify-center text-muted-foreground",
				children: "Carregando dados..."
			}) : concretagens && concretagens.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-md border overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
					className: "bg-slate-50/50",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Data" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Fornecedor/Placa" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Local" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-center",
							children: "Volume"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-center",
							children: "Fck / Slump"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-center",
							children: "Status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: "Ações"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: concretagens.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
					className: "hover:bg-slate-50/50 transition-colors",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: format(new Date(item.data), "dd/MM/yyyy", { locale: ptBR })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: format(new Date(item.data), "HH:mm", { locale: ptBR })
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium flex items-center gap-1",
							children: item.fornecedor || "-"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground flex items-center gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hash, { className: "w-3 h-3" }),
								" NF: ",
								item.nota_fiscal || "-",
								" | Placa: ",
								item.placa_caminhao || "-"
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "w-3 h-3 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate max-w-[200px]",
								title: item.local_lancamento || "",
								children: item.local_lancamento || "-"
							})]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-center font-semibold",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge$1, {
								variant: "secondary",
								className: "bg-slate-100",
								children: item.volume_m3 ? `${item.volume_m3} m³` : "-"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
							className: "text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm",
								children: item.fck_projeto ? `${item.fck_projeto} MPa` : "-"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: item.slump_test || "-"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-center",
							children: getStatusBadge(item.status)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-end gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									onClick: () => handleEdit(item),
									className: "h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "w-4 h-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									onClick: () => handleDelete(item.id),
									className: "h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
								})]
							})
						})
					]
				}, item.id)) })] })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-12 flex flex-col items-center justify-center text-center border rounded-lg border-dashed bg-slate-50/50",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-12 h-12 text-slate-300 mb-3" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-lg font-medium text-slate-900",
						children: "Nenhuma concretagem registrada"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-slate-500 mb-4 max-w-sm",
						children: "Você ainda não registrou nenhum lançamento de concreto nesta obra. Clique no botão acima para adicionar."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: openNewDialog,
						variant: "outline",
						className: "shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4 mr-2" }), "Registrar Primeira Concretagem"]
					})
				]
			}) })]
		})]
	});
}
function useFvrs(obraId) {
	return useQuery({
		queryKey: ["fvrs", obraId],
		queryFn: async () => {
			const { data, error } = await supabase.from("materiais_fvr").select(`
          *,
          materiais_itens:item_id (
            descricao,
            unidade,
            quantidade
          )
        `).eq("obra_id", obraId).order("created_at", { ascending: false });
			if (error) throw error;
			return data;
		},
		enabled: !!obraId
	});
}
function useFvrItensDisponiveis(obraId) {
	return useQuery({
		queryKey: ["fvr-itens-disponiveis", obraId],
		queryFn: async () => {
			const { data: requisicoes, error: errReq } = await supabase.from("materiais_requisicoes").select("id").eq("obra_id", obraId);
			if (errReq) throw errReq;
			if (!requisicoes?.length) return [];
			const reqIds = requisicoes.map((r) => r.id);
			const { data: itens, error: errItens } = await supabase.from("materiais_itens").select("*").in("requisicao_id", reqIds).in("status", ["comprado", "entregue"]);
			if (errItens) throw errItens;
			return itens;
		},
		enabled: !!obraId
	});
}
function useCreateFvr() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (payload) => {
			const { data, error } = await supabase.from("materiais_fvr").insert({
				obra_id: payload.obra_id,
				item_id: payload.item_id,
				nota_fiscal: payload.nota_fiscal || null,
				quantidade_recebida: payload.quantidade_recebida,
				status_qualidade: payload.status_qualidade,
				observacoes: payload.observacoes || null
			}).select().single();
			if (error) throw error;
			return data;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["fvrs", variables.obra_id] });
		}
	});
}
function useDeleteFvr() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, obraId }) => {
			const { error } = await supabase.from("materiais_fvr").delete().eq("id", id);
			if (error) throw error;
			return {
				id,
				obraId
			};
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["fvrs", variables.obraId] });
		}
	});
}
function ObraFvrTab({ obraId }) {
	const { data: fvrs, isLoading } = useFvrs(obraId);
	const { data: itensDisponiveis, isLoading: isLoadingItens } = useFvrItensDisponiveis(obraId);
	const createFvr = useCreateFvr();
	const deleteFvr = useDeleteFvr();
	const [isDialogOpen, setIsDialogOpen] = (0, import_react.useState)(false);
	const [selectedItem, setSelectedItem] = (0, import_react.useState)("");
	const [notaFiscal, setNotaFiscal] = (0, import_react.useState)("");
	const [quantidade, setQuantidade] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("aprovado");
	const [observacoes, setObservacoes] = (0, import_react.useState)("");
	const handleCreate = async () => {
		if (!selectedItem || !quantidade || !status) {
			toast.error("Preencha todos os campos obrigatórios");
			return;
		}
		try {
			await createFvr.mutateAsync({
				obra_id: obraId,
				item_id: selectedItem,
				nota_fiscal: notaFiscal,
				quantidade_recebida: Number(quantidade),
				status_qualidade: status,
				observacoes
			});
			toast.success("FVR registrada com sucesso!");
			setIsDialogOpen(false);
			setSelectedItem("");
			setNotaFiscal("");
			setQuantidade("");
			setStatus("aprovado");
			setObservacoes("");
		} catch (error) {
			toast.error("Erro ao registrar FVR: " + error.message);
		}
	};
	const handleDelete = async (id) => {
		if (!confirm("Tem certeza que deseja excluir esta FVR?")) return;
		try {
			await deleteFvr.mutateAsync({
				id,
				obraId
			});
			toast.success("FVR excluída com sucesso!");
		} catch (error) {
			toast.error("Erro ao excluir FVR: " + error.message);
		}
	};
	const getStatusBadge = (status) => {
		switch (status) {
			case "aprovado": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge$1, {
				className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3 h-3 mr-1" }), " Aprovado"]
			});
			case "rejeitado": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge$1, {
				variant: "destructive",
				className: "bg-red-500/10 text-red-500 border-red-500/20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "w-3 h-3 mr-1" }), " Rejeitado"]
			});
			case "aprovado_parcial": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge$1, {
				variant: "secondary",
				className: "bg-amber-500/10 text-amber-500 border-amber-500/20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageOpen, { className: "w-3 h-3 mr-1" }), " Aprovado Parcial"]
			});
			default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge$1, {
				variant: "outline",
				children: status
			});
		}
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center justify-center h-48",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-8 h-8 animate-spin text-primary" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-2xl font-semibold tracking-tight",
				children: "Ficha de Verificação de Recebimento"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground",
				children: "Registre o recebimento e inspeção de materiais"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
				open: isDialogOpen,
				onOpenChange: setIsDialogOpen,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "gap-2 w-full sm:w-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), "Nova FVR"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-[500px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Nova FVR" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Registre a chegada de um material e seu status de qualidade." })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 py-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Material da Requisição *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: selectedItem,
										onValueChange: setSelectedItem,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Selecione um item comprado/entregue" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: isLoadingItens ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex items-center justify-center p-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin text-muted-foreground" })
										}) : itensDisponiveis?.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "p-2 text-sm text-muted-foreground text-center",
											children: "Nenhum item disponível"
										}) : itensDisponiveis?.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
											value: item.id,
											children: [
												item.descricao,
												" (Qtd Pedida: ",
												item.quantidade,
												" ",
												item.unidade,
												")"
											]
										}, item.id)) })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Quantidade Recebida *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											step: "0.01",
											min: "0",
											placeholder: "Ex: 100",
											value: quantidade,
											onChange: (e) => setQuantidade(e.target.value)
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nota Fiscal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											placeholder: "Número da NF",
											value: notaFiscal,
											onChange: (e) => setNotaFiscal(e.target.value)
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Status de Qualidade *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: status,
										onValueChange: setStatus,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Selecione o status" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "aprovado",
												children: "Aprovado"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "aprovado_parcial",
												children: "Aprovado Parcial"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "rejeitado",
												children: "Rejeitado"
											})
										] })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Observações" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										placeholder: "Detalhes sobre avarias, devoluções, etc...",
										value: observacoes,
										onChange: (e) => setObservacoes(e.target.value)
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setIsDialogOpen(false),
							children: "Cancelar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: handleCreate,
							disabled: createFvr.isPending,
							children: [createFvr.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardCheck, { className: "w-4 h-4 mr-2" }), "Salvar FVR"]
						})] })
					]
				})]
			})]
		}), fvrs?.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "border-dashed shadow-none bg-muted/20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "flex flex-col items-center justify-center p-12 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardCheck, { className: "h-8 w-8 text-primary" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-xl font-semibold mb-2",
						children: "Nenhuma FVR Registrada"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground max-w-sm mb-6",
						children: "Comece a registrar o recebimento de materiais para ter controle de qualidade e notas fiscais."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => setIsDialogOpen(true),
						children: "Criar Primeira FVR"
					})
				]
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
			children: fvrs?.map((fvr) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "relative overflow-hidden group hover:shadow-md transition-all duration-200 border-border/50",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 left-0 w-1 h-full bg-primary/50 group-hover:bg-primary transition-colors" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
						className: "pb-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between items-start",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
									className: "text-base line-clamp-1",
									title: fvr.materiais_itens?.descricao || "Item Desconhecido",
									children: fvr.materiais_itens?.descricao || "Item Desconhecido"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, {
									className: "flex items-center gap-1.5 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-3 h-3" }),
										"NF: ",
										fvr.nota_fiscal || "N/A"
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity",
								onClick: () => handleDelete(fvr.id),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-center text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Recebido:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-medium",
									children: [
										fvr.quantidade_recebida,
										" ",
										fvr.materiais_itens?.unidade || ""
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-center text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Qualidade:"
								}), getStatusBadge(fvr.status_qualidade)]
							}),
							fvr.observacoes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-sm bg-muted/50 p-3 rounded-md mt-2 border border-border/50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-muted-foreground block mb-1",
									children: "Observações:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-foreground/80 leading-relaxed",
									children: fvr.observacoes
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pt-2 text-xs text-muted-foreground flex items-center justify-between border-t border-border/50",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: new Date(fvr.created_at).toLocaleDateString("pt-BR") })
							})
						]
					})
				]
			}, fvr.id))
		})]
	});
}
function useRncs(obraId) {
	return useQuery({
		queryKey: ["obra-rnc", obraId],
		queryFn: async () => {
			const { data, error } = await supabase.from("obra_rnc").select("*").eq("obra_id", obraId).order("created_at", { ascending: false });
			if (error) {
				console.error("Erro ao buscar RNCs:", error);
				throw error;
			}
			return data;
		},
		enabled: !!obraId
	});
}
function useCreateRnc() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (novaRnc) => {
			const { data, error } = await supabase.from("obra_rnc").insert([novaRnc]).select().single();
			if (error) {
				console.error("Erro ao criar RNC:", error);
				throw error;
			}
			return data;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["obra-rnc", variables.obra_id] });
		}
	});
}
function useUpdateRnc() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, ...updates }) => {
			const { data, error } = await supabase.from("obra_rnc").update(updates).eq("id", id).select().single();
			if (error) {
				console.error("Erro ao atualizar RNC:", error);
				throw error;
			}
			return data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["obra-rnc", data.obra_id] });
		}
	});
}
var STATUS_LABELS = {
	aberta: "Aberta",
	em_andamento: "Em Andamento",
	fechada: "Fechada",
	cancelada: "Cancelada"
};
function ObraRncTab({ obraId }) {
	const { data: rncs, isLoading } = useRncs(obraId);
	const createRnc = useCreateRnc();
	const updateRnc = useUpdateRnc();
	const [isDialogOpen, setIsDialogOpen] = (0, import_react.useState)(false);
	const [formData, setFormData] = (0, import_react.useState)({
		descricao: "",
		causa_raiz: "",
		acao_corretiva: "",
		prazo_resolucao: ""
	});
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.descricao) {
			toast.error("A descrição do problema é obrigatória.");
			return;
		}
		try {
			await createRnc.mutateAsync({
				obra_id: obraId,
				descricao: formData.descricao,
				causa_raiz: formData.causa_raiz || null,
				acao_corretiva: formData.acao_corretiva || null,
				prazo_resolucao: formData.prazo_resolucao || null,
				status: "aberta",
				data_fechamento: null,
				observacoes: null
			});
			toast.success("RNC registrada com sucesso!");
			setIsDialogOpen(false);
			setFormData({
				descricao: "",
				causa_raiz: "",
				acao_corretiva: "",
				prazo_resolucao: ""
			});
		} catch (error) {
			toast.error(error.message || "Erro ao registrar RNC.");
		}
	};
	const handleUpdateStatus = async (id, newStatus) => {
		try {
			const updates = { status: newStatus };
			if (newStatus === "fechada") updates.data_fechamento = (/* @__PURE__ */ new Date()).toISOString();
			else updates.data_fechamento = null;
			await updateRnc.mutateAsync({
				id,
				...updates
			});
			toast.success(`Status atualizado para ${STATUS_LABELS[newStatus]}`);
		} catch (error) {
			toast.error(error.message || "Erro ao atualizar status.");
		}
	};
	const getStatusBadge = (status) => {
		switch (status) {
			case "aberta": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge$1, {
				variant: "destructive",
				className: "flex items-center gap-1 w-fit",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-3 h-3" }), " Aberta"]
			});
			case "em_andamento": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge$1, {
				className: "bg-amber-500 hover:bg-amber-600 flex items-center gap-1 w-fit",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3 h-3" }), " Em Andamento"]
			});
			case "fechada": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge$1, {
				className: "bg-emerald-500 hover:bg-emerald-600 flex items-center gap-1 w-fit",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3 h-3" }), " Fechada"]
			});
			case "cancelada": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge$1, {
				variant: "secondary",
				className: "flex items-center gap-1 w-fit",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "w-3 h-3" }), " Cancelada"]
			});
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-2xl font-bold tracking-tight",
				children: "Relatório de Não Conformidade (RNC)"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground",
				children: "Gerencie problemas, identifique causas raízes e acompanhe ações corretivas."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
				open: isDialogOpen,
				onOpenChange: setIsDialogOpen,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "shrink-0 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlus, { className: "w-4 h-4" }), "Nova RNC"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					className: "sm:max-w-[600px]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSubmit,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Registrar Não Conformidade" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Preencha os detalhes do problema encontrado e as ações propostas." })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 py-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "descricao",
											children: "Descrição do Problema *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											id: "descricao",
											placeholder: "Descreva a não conformidade encontrada...",
											value: formData.descricao,
											onChange: (e) => setFormData({
												...formData,
												descricao: e.target.value
											}),
											required: true,
											className: "min-h-[100px]"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "causa",
											children: "Causa Raiz (Ex: 5 Porquês)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											id: "causa",
											placeholder: "Por que este problema ocorreu?",
											value: formData.causa_raiz || "",
											onChange: (e) => setFormData({
												...formData,
												causa_raiz: e.target.value
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "acao",
											children: "Ação Corretiva"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											id: "acao",
											placeholder: "O que será feito para corrigir e evitar reincidência?",
											value: formData.acao_corretiva || "",
											onChange: (e) => setFormData({
												...formData,
												acao_corretiva: e.target.value
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "prazo",
											children: "Prazo de Resolução"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "prazo",
											type: "date",
											value: formData.prazo_resolucao || "",
											onChange: (e) => setFormData({
												...formData,
												prazo_resolucao: e.target.value
											})
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => setIsDialogOpen(false),
								children: "Cancelar"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								disabled: createRnc.isPending,
								children: createRnc.isPending ? "Salvando..." : "Salvar RNC"
							})] })
						]
					})
				})]
			})]
		}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex justify-center items-center h-48",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground animate-pulse",
				children: "Carregando RNCs..."
			})
		}) : !rncs || rncs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "flex flex-col items-center justify-center h-48 border-dashed",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-12 h-12 text-muted-foreground mb-4 opacity-50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground",
				children: "Nenhuma RNC registrada para esta obra."
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6",
			children: rncs.map((rnc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "flex flex-col shadow-sm hover:shadow-md transition-shadow",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
						className: "pb-3 border-b",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between items-start gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
									className: "text-base leading-tight",
									children: rnc.descricao
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, {
									className: "flex items-center gap-2 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3 h-3" }), format(new Date(rnc.created_at), "dd 'de' MMM, yyyy", { locale: ptBR })]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									size: "icon",
									className: "h-8 w-8 shrink-0 -mr-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "sr-only",
										children: "Opções"
									})]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
								align: "end",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
										onClick: () => handleUpdateStatus(rnc.id, "aberta"),
										children: "Marcar como Aberta"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
										onClick: () => handleUpdateStatus(rnc.id, "em_andamento"),
										children: "Marcar como Em Andamento"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
										onClick: () => handleUpdateStatus(rnc.id, "fechada"),
										children: "Marcar como Fechada"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
										onClick: () => handleUpdateStatus(rnc.id, "cancelada"),
										children: "Marcar como Cancelada"
									})
								]
							})] })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "flex-1 pt-4 text-sm space-y-4",
						children: [
							rnc.causa_raiz && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-muted-foreground block text-xs uppercase tracking-wider mb-1",
								children: "Causa Raiz"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-foreground/90 whitespace-pre-wrap",
								children: rnc.causa_raiz
							})] }),
							rnc.acao_corretiva && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-muted-foreground block text-xs uppercase tracking-wider mb-1",
								children: "Ação Corretiva"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-foreground/90 whitespace-pre-wrap",
								children: rnc.acao_corretiva
							})] }),
							rnc.prazo_resolucao && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-muted/50 p-2 rounded-md flex items-center gap-2 mt-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-muted-foreground text-xs uppercase tracking-wider",
									children: "Prazo:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-foreground",
									children: format(new Date(rnc.prazo_resolucao), "dd/MM/yyyy")
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardFooter, {
						className: "pt-0 flex justify-between items-center px-6 py-3 bg-muted/20 border-t",
						children: [getStatusBadge(rnc.status), rnc.data_fechamento && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted-foreground font-medium",
							children: ["Fechada em ", format(new Date(rnc.data_fechamento), "dd/MM/yy")]
						})]
					})
				]
			}, rnc.id))
		})]
	});
}
function useBoletins(obraId) {
	return useQuery({
		queryKey: ["boletins", obraId],
		enabled: !!obraId,
		queryFn: async () => {
			const { data, error } = await supabase.from("obra_boletins_medicao").select("*").eq("obra_id", obraId).order("data_medicao", { ascending: false });
			if (error) throw error;
			return data;
		}
	});
}
function useBoletimItens(boletimId) {
	return useQuery({
		queryKey: ["boletim_itens", boletimId],
		enabled: !!boletimId,
		queryFn: async () => {
			const { data, error } = await supabase.from("obra_boletins_itens").select("*").eq("boletim_id", boletimId);
			if (error) throw error;
			return data;
		}
	});
}
function useEapList() {
	return useQuery({
		queryKey: ["obra_eap"],
		queryFn: async () => {
			const { data, error } = await supabase.from("obra_eap").select("*").order("codigo", { ascending: true });
			if (error) throw error;
			return data;
		}
	});
}
function useCreateBoletim() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (payload) => {
			const { data, error } = await supabase.from("obra_boletins_medicao").insert({
				...payload,
				status: "rascunho"
			}).select().single();
			if (error) throw error;
			return data;
		},
		onSuccess: (_, vars) => {
			queryClient.invalidateQueries({ queryKey: ["boletins", vars.obra_id] });
		}
	});
}
function useUpdateBoletimItens() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ boletim_id, items }) => {
			const { error: deleteError } = await supabase.from("obra_boletins_itens").delete().eq("boletim_id", boletim_id);
			if (deleteError) throw deleteError;
			if (items.length > 0) {
				const payload = items.map((item) => ({
					boletim_id,
					eap_id: item.eap_id,
					avanco_medido_pct: item.avanco_medido_pct
				}));
				const { error: insertError } = await supabase.from("obra_boletins_itens").insert(payload);
				if (insertError) throw insertError;
			}
			return true;
		},
		onSuccess: (_, vars) => {
			queryClient.invalidateQueries({ queryKey: ["boletim_itens", vars.boletim_id] });
		}
	});
}
var ScrollArea = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root, {
	ref,
	className: cn("relative overflow-hidden", className),
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Viewport, {
			className: "h-full w-full rounded-[inherit]",
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollBar, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Corner, {})
	]
}));
ScrollArea.displayName = Root.displayName;
var ScrollBar = import_react.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaScrollbar, {
	ref,
	orientation,
	className: cn("flex touch-none select-none transition-colors", orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]", orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" })
}));
ScrollBar.displayName = ScrollAreaScrollbar.displayName;
function ObraBmTab({ obraId }) {
	const { data: boletins, isLoading: loadingBoletins } = useBoletins(obraId);
	const [selectedBm, setSelectedBm] = (0, import_react.useState)(null);
	if (selectedBm) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BmDetailsView, {
		boletim: selectedBm,
		onBack: () => setSelectedBm(null)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent",
				children: "Boletins de Medição"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground",
				children: "Gerencie as medições físicas da obra por período."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreateBmDialog, { obraId })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "border-slate-200/60 shadow-sm bg-white/50 backdrop-blur-xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "p-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
					className: "bg-slate-50/50",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Empreiteiro" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Período" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Data da Medição" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: "Ações"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [!loadingBoletins && boletins?.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 5,
					className: "text-center py-10 text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-8 h-8 text-slate-300" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Nenhum boletim encontrado." })]
					})
				}) }), boletins?.map((bm) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
					className: "group hover:bg-slate-50/50 transition-colors",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: bm.status }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "font-medium",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "w-4 h-4 text-slate-400" }), bm.empreiteiro]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-sm text-slate-600",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-4 h-4" }),
								format(new Date(bm.periodo_inicio), "dd/MM/yyyy", { locale: ptBR }),
								" - ",
								format(new Date(bm.periodo_fim), "dd/MM/yyyy", { locale: ptBR })
							]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-slate-600",
							children: format(new Date(bm.data_medicao), "dd/MM/yyyy", { locale: ptBR })
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "sm",
								onClick: () => setSelectedBm(bm),
								children: "Ver Detalhes"
							})
						})
					]
				}, bm.id))] })] })
			})
		})]
	});
}
function CreateBmDialog({ obraId }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const createBm = useCreateBoletim();
	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		try {
			await createBm.mutateAsync({
				obra_id: obraId,
				empreiteiro: formData.get("empreiteiro"),
				data_medicao: formData.get("data_medicao"),
				periodo_inicio: formData.get("periodo_inicio"),
				periodo_fim: formData.get("periodo_fim")
			});
			toast.success("Boletim criado com sucesso!");
			setOpen(false);
		} catch (error) {
			toast.error("Erro ao criar boletim.");
			console.error(error);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				className: "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4 mr-2" }), "Novo Boletim"]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-[425px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Criar Boletim de Medição" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Insira os dados do novo boletim. Você poderá adicionar os avanços das atividades em seguida." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-4 py-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "empreiteiro",
							children: "Empreiteiro / Fornecedor"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "empreiteiro",
							name: "empreiteiro",
							placeholder: "Ex: Construtora Alfa",
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "data_medicao",
							children: "Data da Medição"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "data_medicao",
							name: "data_medicao",
							type: "date",
							required: true,
							defaultValue: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "periodo_inicio",
								children: "Período Início"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "periodo_inicio",
								name: "periodo_inicio",
								type: "date",
								required: true
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "periodo_fim",
								children: "Período Fim"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "periodo_fim",
								name: "periodo_fim",
								type: "date",
								required: true
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
						className: "pt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => setOpen(false),
							children: "Cancelar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: createBm.isPending,
							children: createBm.isPending ? "Criando..." : "Criar Boletim"
						})]
					})
				]
			})]
		})]
	});
}
function BmDetailsView({ boletim, onBack }) {
	const { data: eapList, isLoading: loadingEap } = useEapList();
	const { data: bmItens, isLoading: loadingItens } = useBoletimItens(boletim.id);
	const updateItens = useUpdateBoletimItens();
	const [avancos, setAvancos] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		if (bmItens) {
			const initial = {};
			bmItens.forEach((item) => {
				initial[item.eap_id] = item.avanco_medido_pct;
			});
			setAvancos(initial);
		}
	}, [bmItens]);
	const handleAvancoChange = (eapId, val) => {
		const num = parseFloat(val);
		if (isNaN(num)) return;
		setAvancos((prev) => ({
			...prev,
			[eapId]: Math.min(100, Math.max(0, num))
		}));
	};
	const handleSave = async () => {
		try {
			const itemsToSave = Object.entries(avancos).map(([eap_id, avanco_medido_pct]) => ({
				eap_id,
				avanco_medido_pct
			}));
			await updateItens.mutateAsync({
				boletim_id: boletim.id,
				items: itemsToSave
			});
			toast.success("Medições salvas com sucesso!");
		} catch (error) {
			toast.error("Erro ao salvar medições.");
			console.error(error);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					onClick: onBack,
					className: "rounded-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-5 h-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-bold tracking-tight",
						children: "Detalhes da Medição"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: boletim.status })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-muted-foreground flex items-center gap-2 mt-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "w-4 h-4" }),
						" ",
						boletim.empreiteiro,
						" •",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-4 h-4" }),
						" ",
						format(new Date(boletim.periodo_inicio), "dd/MM"),
						" a ",
						format(new Date(boletim.periodo_fim), "dd/MM/yyyy")
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "ml-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: handleSave,
						disabled: updateItens.isPending,
						className: "bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-4 h-4 mr-2" }), updateItens.isPending ? "Salvando..." : "Salvar Medições"]
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "border-slate-200/60 shadow-sm bg-white/50 backdrop-blur-xl overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
				className: "h-[600px] w-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
					className: "bg-slate-50/80 sticky top-0 backdrop-blur-md z-10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "w-[150px]",
							children: "Código EAP"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Descrição" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-center w-[150px]",
							children: "Progresso Atual"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right w-[200px]",
							children: "Nesta Medição (%)"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: loadingEap ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 4,
					className: "text-center py-8",
					children: "Carregando pacotes..."
				}) }) : eapList?.map((eap) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
					className: "hover:bg-slate-50/50",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "font-mono text-sm font-medium text-slate-600",
							children: eap.codigo
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: eap.descricao }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge$1, {
								variant: "secondary",
								className: "bg-blue-50 text-blue-700 hover:bg-blue-50",
								children: [eap.progresso_pct || 0, "%"]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-end items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: "0",
									max: "100",
									step: "0.01",
									className: "w-24 text-right font-medium",
									value: avancos[eap.id] !== void 0 ? avancos[eap.id] : "",
									onChange: (e) => handleAvancoChange(eap.id, e.target.value),
									placeholder: "0.00"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-400 text-sm",
									children: "%"
								})]
							})
						})
					]
				}, eap.id)) })] })
			})
		})]
	});
}
function StatusBadge({ status }) {
	switch (status) {
		case "emitido": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge$1, {
			className: "bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3 h-3 mr-1" }), " Emitido"]
		});
		case "aprovado": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge$1, {
			className: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3 h-3 mr-1" }), " Aprovado"]
		});
		default: return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge$1, {
			className: "bg-slate-100 text-slate-800 hover:bg-slate-100 border-slate-200",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "w-3 h-3 mr-1" }), " Rascunho"]
		});
	}
}
/**
* Busca todos os itens de medição de uma obra, com suas medições.
* Calcula total_executado, saldo e progresso no frontend.
*/
function useMedicaoItens(obraId) {
	return useQuery({
		queryKey: ["medicao-itens", obraId],
		enabled: !!obraId,
		queryFn: async () => {
			const { data: itens, error: itensErr } = await supabase.from("obra_medicao_itens").select("*").eq("obra_id", obraId).order("ordem", { ascending: true });
			if (itensErr) throw itensErr;
			if (!itens?.length) return [];
			const itemIds = itens.map((i) => i.id);
			const { data: medicoes, error: medErr } = await supabase.from("obra_medicoes").select("*").in("item_id", itemIds).order("numero_medicao", { ascending: true });
			if (medErr) throw medErr;
			const medMap = /* @__PURE__ */ new Map();
			for (const m of medicoes ?? []) {
				const arr = medMap.get(m.item_id) ?? [];
				arr.push(m);
				medMap.set(m.item_id, arr);
			}
			return itens.map((item) => {
				const meds = medMap.get(item.id) ?? [];
				const total_executado = meds.reduce((sum, m) => sum + Number(m.quantidade_executada), 0);
				const saldo = Number(item.quantidade_total) - total_executado;
				const progresso_pct = Number(item.quantidade_total) > 0 ? total_executado / Number(item.quantidade_total) * 100 : 0;
				return {
					...item,
					quantidade_total: Number(item.quantidade_total),
					medicoes: meds,
					total_executado,
					saldo,
					progresso_pct
				};
			});
		}
	});
}
/**
* Cria uma nova medição para um item.
*/
function useCreateMedicao() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (payload) => {
			const { data: { user } } = await supabase.auth.getUser();
			const { data, error } = await supabase.from("obra_medicoes").insert({
				item_id: payload.item_id,
				numero_medicao: payload.numero_medicao,
				data_referencia: payload.data_referencia,
				quantidade_executada: payload.quantidade_executada,
				criado_por: user?.id ?? null
			}).select().single();
			if (error) throw error;
			return data;
		},
		onSuccess: (_, vars) => {
			qc.invalidateQueries({ queryKey: ["medicao-itens", vars.obraId] });
		}
	});
}
/**
* Deleta uma medição.
*/
function useDeleteMedicao() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (payload) => {
			const { error } = await supabase.from("obra_medicoes").delete().eq("id", payload.id);
			if (error) throw error;
		},
		onSuccess: (_, vars) => {
			qc.invalidateQueries({ queryKey: ["medicao-itens", vars.obraId] });
		}
	});
}
/**
* Importa itens em lote (substitui todos os existentes da obra).
*/
function useImportItens() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (payload) => {
			const { error: delErr } = await supabase.from("obra_medicao_itens").delete().eq("obra_id", payload.obraId);
			if (delErr) throw delErr;
			if (payload.itens.length > 0) {
				const rows = payload.itens.map((it) => ({
					obra_id: payload.obraId,
					numero_item: it.numero_item,
					descricao: it.descricao,
					quantidade_total: it.quantidade_total,
					grupo: it.grupo,
					ordem: it.ordem
				}));
				const { error: insErr } = await supabase.from("obra_medicao_itens").insert(rows);
				if (insErr) throw insErr;
			}
		},
		onSuccess: (_, vars) => {
			qc.invalidateQueries({ queryKey: ["medicao-itens", vars.obraId] });
		}
	});
}
var Progress = import_react.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root$1, {
	ref,
	className: cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Indicator, {
		className: "h-full w-full flex-1 bg-primary transition-all",
		style: { transform: `translateX(-${100 - (value || 0)}%)` }
	})
}));
Progress.displayName = Root$1.displayName;
function ObraMedicaoTab({ obraId, isAdmin = false }) {
	const { data: itens, isLoading } = useMedicaoItens(obraId);
	const [selectedItem, setSelectedItem] = (0, import_react.useState)(null);
	const [showImport, setShowImport] = (0, import_react.useState)(false);
	const [collapsedGroups, setCollapsedGroups] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const groups = (0, import_react.useMemo)(() => {
		if (!itens?.length) return [];
		const map = /* @__PURE__ */ new Map();
		for (const item of itens) {
			const g = item.grupo || "Sem grupo";
			const arr = map.get(g) ?? [];
			arr.push(item);
			map.set(g, arr);
		}
		return Array.from(map.entries()).map(([nome, items]) => ({
			nome,
			items
		}));
	}, [itens]);
	const stats = (0, import_react.useMemo)(() => {
		if (!itens?.length) return {
			total: 0,
			completos: 0,
			progressoGeral: 0
		};
		const total = itens.length;
		const completos = itens.filter((i) => i.saldo <= 0).length;
		const somaTotal = itens.reduce((s, i) => s + Number(i.quantidade_total), 0);
		const somaExec = itens.reduce((s, i) => s + i.total_executado, 0);
		return {
			total,
			completos,
			progressoGeral: somaTotal > 0 ? somaExec / somaTotal * 100 : 0
		};
	}, [itens]);
	function toggleGroup(nome) {
		setCollapsedGroups((prev) => {
			const next = new Set(prev);
			if (next.has(nome)) next.delete(nome);
			else next.add(nome);
			return next;
		});
	}
	function handleExport() {
		if (!itens?.length) {
			toast.error("Nenhum item para exportar.");
			return;
		}
		const rows = itens.map((item) => ({
			Nome: item.descricao,
			Quantidade: Number(item.total_executado.toFixed(2)),
			Saldo: Number(item.saldo.toFixed(2))
		}));
		const ws = utils.json_to_sheet(rows);
		const wb = utils.book_new();
		utils.book_append_sheet(wb, ws, "Medição");
		ws["!cols"] = [
			{ wch: 50 },
			{ wch: 15 },
			{ wch: 15 }
		];
		writeFileSync(wb, `medicao_export_${format(/* @__PURE__ */ new Date(), "yyyy-MM-dd")}.xlsx`);
		toast.success("Planilha exportada com sucesso!");
	}
	const currentSelected = (0, import_react.useMemo)(() => {
		if (!selectedItem || !itens) return null;
		return itens.find((i) => i.id === selectedItem.id) ?? null;
	}, [selectedItem, itens]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-2xl font-bold tracking-tight flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ruler, { className: "size-6 text-primary" }), "Medição de Campo"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground text-sm mt-1",
					children: "Controle de quantidades executadas por item de serviço."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2 flex-wrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => setShowImport(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4 mr-1" }), "Importar Planilha"]
					}), isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: handleExport,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4 mr-1" }), "Exportar XLSX"]
					})]
				})]
			}),
			itens && itens.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-4 flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-2 rounded-full bg-primary/10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "size-5 text-primary" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-2xl font-bold",
							children: stats.total
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Itens de serviço"
						})] })]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-4 flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-2 rounded-full bg-success/10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-5 text-success" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-2xl font-bold",
							children: stats.completos
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Itens concluídos"
						})] })]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-4 flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-2 rounded-full bg-warning/10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "size-5 text-warning" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-2xl font-bold",
							children: [stats.progressoGeral.toFixed(1), "%"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Progresso geral"
						})] })]
					}) })
				]
			}),
			isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-center py-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-6 animate-spin text-muted-foreground" })
			}),
			!isLoading && (!itens || itens.length === 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "py-16 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "size-12 text-muted-foreground/40 mx-auto mb-4" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-lg font-semibold mb-2",
						children: "Nenhum item importado"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground text-sm mb-4",
						children: "Importe a planilha de medição do escritório para começar a registrar as quantidades executadas em campo."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => setShowImport(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4 mr-2" }), "Importar Planilha"]
					})
				]
			}) }),
			groups.map((group) => {
				const isCollapsed = collapsedGroups.has(group.nome);
				const groupExec = group.items.reduce((s, i) => s + i.total_executado, 0);
				const groupTotal = group.items.reduce((s, i) => s + Number(i.quantidade_total), 0);
				const groupPct = groupTotal > 0 ? groupExec / groupTotal * 100 : 0;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "cursor-pointer hover:bg-muted/30 transition-colors py-4 px-5",
					onClick: () => toggleGroup(group.nome),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								isCollapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-5 text-muted-foreground" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-5 text-muted-foreground" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
									className: "text-base",
									children: group.nome
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge$1, {
									variant: "outline",
									className: "text-xs font-normal",
									children: [
										group.items.length,
										" ",
										group.items.length === 1 ? "item" : "itens"
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-sm font-medium text-muted-foreground",
								children: [groupPct.toFixed(0), "%"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
								value: Math.min(groupPct, 100),
								className: "w-24 h-2"
							})]
						})]
					})
				}), !isCollapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
							className: "bg-muted/20",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "w-16",
									children: "#"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Descrição" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "w-24 text-right",
									children: "Total"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "w-24 text-right",
									children: "Executado"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "w-24 text-right",
									children: "Saldo"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "w-32 text-center",
									children: "Progresso"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: group.items.map((item) => {
							const overBudget = item.saldo < 0;
							const complete = item.saldo <= 0 && !overBudget;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
								className: "cursor-pointer hover:bg-muted/30 transition-colors",
								onClick: () => setSelectedItem(item),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "font-mono text-muted-foreground",
										children: item.numero_item
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "font-medium max-w-[300px] truncate",
										children: item.descricao
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "text-right tabular-nums",
										children: Number(item.quantidade_total).toFixed(0)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: `text-right tabular-nums font-medium ${overBudget ? "text-destructive" : ""}`,
										children: item.total_executado.toFixed(2)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: `text-right tabular-nums font-medium ${overBudget ? "text-destructive" : complete ? "text-success" : ""}`,
										children: item.saldo.toFixed(2)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 justify-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
											value: Math.min(item.progresso_pct, 100),
											className: `w-16 h-2 ${overBudget ? "[&>div]:bg-destructive" : item.progresso_pct >= 80 ? "[&>div]:bg-warning" : ""}`
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: `text-xs tabular-nums w-10 text-right ${overBudget ? "text-destructive font-bold" : ""}`,
											children: [item.progresso_pct.toFixed(0), "%"]
										})]
									}) })
								]
							}, item.id);
						}) })] })
					})
				})] }, group.nome);
			}),
			currentSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemDetailDialog, {
				item: currentSelected,
				obraId,
				onClose: () => setSelectedItem(null)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImportDialog, {
				open: showImport,
				onClose: () => setShowImport(false),
				obraId
			})
		]
	});
}
function ItemDetailDialog({ item, obraId, onClose }) {
	const createMedicao = useCreateMedicao();
	const deleteMedicao = useDeleteMedicao();
	const [qtd, setQtd] = (0, import_react.useState)("");
	const [ref, setRef] = (0, import_react.useState)(`MEDIÇÃO ${item.medicoes.length + 1}`);
	const [confirmOverflow, setConfirmOverflow] = (0, import_react.useState)(false);
	const [deleteTarget, setDeleteTarget] = (0, import_react.useState)(null);
	const nextNum = item.medicoes.length + 1;
	const canAddMore = nextNum <= 30;
	function handleSave(force = false) {
		const val = parseFloat(qtd.replace(",", "."));
		if (isNaN(val) || val <= 0) {
			toast.error("Informe uma quantidade válida maior que zero.");
			return;
		}
		if (item.total_executado + val > Number(item.quantidade_total) && !force) {
			setConfirmOverflow(true);
			return;
		}
		createMedicao.mutate({
			item_id: item.id,
			numero_medicao: nextNum,
			data_referencia: ref || `MEDIÇÃO ${nextNum}`,
			quantidade_executada: val,
			obraId
		}, {
			onSuccess: () => {
				toast.success(`Medição ${nextNum} registrada!`);
				setQtd("");
				setRef(`MEDIÇÃO ${nextNum + 1}`);
			},
			onError: (err) => {
				toast.error(err.message || "Erro ao salvar medição.");
			}
		});
	}
	function handleDelete(id) {
		deleteMedicao.mutate({
			id,
			obraId
		}, {
			onSuccess: () => {
				toast.success("Medição removida.");
				setDeleteTarget(null);
			},
			onError: (err) => toast.error(err.message || "Erro ao remover.")
		});
	}
	const overBudget = item.saldo < 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: true,
			onOpenChange: () => onClose(),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-lg max-h-[90vh] overflow-y-auto",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "text-lg flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted-foreground font-mono",
							children: ["#", item.numero_item]
						}), item.descricao]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
						className: "sr-only",
						children: "Detalhes do item de medição"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-3 gap-3 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-lg bg-muted/40",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Total contratado"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-lg font-bold",
									children: Number(item.quantidade_total).toFixed(0)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-lg bg-muted/40",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Executado"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `text-lg font-bold ${overBudget ? "text-destructive" : "text-primary"}`,
									children: item.total_executado.toFixed(2)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-lg bg-muted/40",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Saldo"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `text-lg font-bold ${overBudget ? "text-destructive" : item.saldo <= 0 ? "text-success" : ""}`,
									children: item.saldo.toFixed(2)
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
						value: Math.min(item.progresso_pct, 100),
						className: `h-3 ${overBudget ? "[&>div]:bg-destructive" : item.progresso_pct >= 80 ? "[&>div]:bg-warning" : ""}`
					}),
					overBudget && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-destructive text-sm bg-destructive/10 px-3 py-2 rounded-lg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-4 shrink-0" }), "Quantidade executada ultrapassa o total contratado!"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "font-semibold text-sm mb-2",
						children: "Histórico de Medições"
					}), item.medicoes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground py-4 text-center",
						children: "Nenhuma medição lançada ainda."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border rounded-lg overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
							className: "bg-muted/20",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "w-10",
									children: "#"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Referência" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "text-right",
									children: "Qtd."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { className: "w-10" })
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: item.medicoes.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "font-mono",
								children: m.numero_medicao
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-sm",
								children: m.data_referencia || `Medição ${m.numero_medicao}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-right tabular-nums font-medium",
								children: Number(m.quantidade_executada).toFixed(2)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "size-7 text-muted-foreground hover:text-destructive",
								onClick: () => setDeleteTarget(m.id),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
							}) })
						] }, m.id)) })] })
					})] }),
					canAddMore && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t pt-4 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
								className: "font-semibold text-sm flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }),
									"Lançar Medição ",
									nextNum
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Referência"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: ref,
										onChange: (e) => setRef(e.target.value),
										placeholder: "Ex: Jun/2026",
										className: "h-9"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Quantidade executada"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: qtd,
										onChange: (e) => setQtd(e.target.value),
										placeholder: "0,00",
										inputMode: "decimal",
										className: "h-9",
										autoFocus: true
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								className: "w-full",
								onClick: () => handleSave(),
								disabled: createMedicao.isPending,
								children: [createMedicao.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), "Salvar Medição"]
							})
						]
					}),
					!canAddMore && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-warning text-sm bg-warning/10 px-3 py-2 rounded-lg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "size-4 shrink-0" }), "Limite de 30 medições atingido para este item."]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
			open: confirmOverflow,
			onOpenChange: setConfirmOverflow,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogTitle, {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-5 text-destructive" }), "Quantidade ultrapassa o contrato"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
				"A quantidade total executada (",
				(item.total_executado + parseFloat((qtd || "0").replace(",", "."))).toFixed(2),
				") será maior que a quantidade contratada (",
				Number(item.quantidade_total).toFixed(0),
				"). Tem certeza que deseja confirmar esta medição?"
			] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancelar" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
				className: "bg-destructive hover:bg-destructive/90",
				onClick: () => {
					setConfirmOverflow(false);
					handleSave(true);
				},
				children: "Confirmar mesmo assim"
			})] })] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
			open: !!deleteTarget,
			onOpenChange: () => setDeleteTarget(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Remover medição?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "Essa ação não pode ser desfeita. A medição será permanentemente removida." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancelar" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
				className: "bg-destructive hover:bg-destructive/90",
				onClick: () => deleteTarget && handleDelete(deleteTarget),
				children: "Remover"
			})] })] })
		})
	] });
}
function ImportDialog({ open, onClose, obraId }) {
	const importMutation = useImportItens();
	const [preview, setPreview] = (0, import_react.useState)(null);
	const [fileName, setFileName] = (0, import_react.useState)("");
	const inputRef = (0, import_react.useRef)(null);
	function handleFile(e) {
		const file = e.target.files?.[0];
		if (!file) return;
		setFileName(file.name);
		const reader = new FileReader();
		reader.onload = (ev) => {
			try {
				const wb = readSync(new Uint8Array(ev.target.result), { type: "array" });
				const ws = wb.Sheets[wb.SheetNames[0]];
				const rows = utils.sheet_to_json(ws, {
					header: 1,
					defval: ""
				});
				const normalize = (str) => String(str || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
				let headerRowIndex = -1;
				let colItem = -1;
				let colDesc = -1;
				let colQtd = -1;
				console.log("--- INICIANDO LEITURA DO EXCEL ---");
				for (let i = 0; i < Math.min(rows.length, 50); i++) {
					const row = rows[i];
					console.log(`Linha ${i + 1}:`, row.map((c) => String(c).substring(0, 30)));
					let tempItem = -1, tempDesc = -1, tempQtd = -1;
					for (let j = 0; j < row.length; j++) {
						const cell = normalize(row[j]);
						if (!cell) continue;
						if (tempItem === -1 && (cell === "item" || cell.includes("item") || cell === "n" || cell === "no" || cell === "#")) tempItem = j;
						if (tempDesc === -1 && (cell.includes("descricao") || cell.includes("servico"))) tempDesc = j;
						if (tempQtd === -1 && (cell === "quant" || cell === "quant." || cell === "qtd" || cell.includes("quant") || cell === "pvto")) tempQtd = j;
					}
					if (tempDesc !== -1 && tempQtd !== -1) {
						headerRowIndex = i;
						colItem = tempItem;
						colDesc = tempDesc;
						colQtd = tempQtd;
						console.log(`=> Cabeçalho encontrado na linha ${i + 1}! Colunas: Item=${colItem}, Desc=${colDesc}, Qtd=${colQtd}`);
					}
				}
				if (headerRowIndex === -1) {
					toast.error("Cabeçalho não encontrado. A planilha precisa ter as colunas DESCRIÇÃO e QUANT/PVTO.");
					return;
				}
				if (colItem === -1 && colDesc > 0) colItem = colDesc - 1;
				const parsed = [];
				let currentGroup = null;
				let ordem = 0;
				const usedNumbers = /* @__PURE__ */ new Set();
				for (let i = headerRowIndex + 1; i < rows.length; i++) {
					const row = rows[i];
					if (!row || row.length <= colDesc) continue;
					const rawItem = colItem !== -1 ? row[colItem] : "";
					const rawDesc = row[colDesc];
					const rawQtd = row[colQtd];
					const descStr = String(rawDesc || "").trim();
					const hasItem = String(rawItem).trim().length > 0;
					const hasQtd = String(rawQtd).trim().length > 0 && parseFloat(String(rawQtd).replace(",", ".")) > 0;
					if (descStr.length > 0 && !hasItem && !hasQtd) {
						if (descStr.length < 100) {
							currentGroup = descStr;
							console.log(`[Grupo] ${currentGroup}`);
						}
						continue;
					}
					const num = parseInt(String(rawItem), 10);
					const qtd = parseFloat(String(rawQtd).replace(",", "."));
					let finalNum = -1;
					if (!isNaN(num) && descStr.length > 0 && !isNaN(qtd) && qtd > 0) finalNum = num;
					else if (descStr.length > 0 && !isNaN(qtd) && qtd > 0) finalNum = ordem + 1;
					if (finalNum !== -1) {
						while (usedNumbers.has(finalNum)) finalNum += 1e3;
						usedNumbers.add(finalNum);
						parsed.push({
							numero_item: finalNum,
							descricao: descStr,
							quantidade_total: qtd,
							grupo: currentGroup,
							ordem: ordem++
						});
						console.log(`[Item] #${finalNum} | ${descStr} | Qtd: ${qtd} | Grupo: ${currentGroup}`);
					}
				}
				if (parsed.length === 0) {
					toast.error("Nenhum item válido encontrado após o cabeçalho. Olhe o console (F12) para detalhes.");
					return;
				}
				setPreview(parsed);
			} catch (err) {
				toast.error("Erro ao ler o arquivo. Verifique se é um .xlsx válido.");
				console.error(err);
			}
		};
		reader.readAsArrayBuffer(file);
	}
	function handleConfirm() {
		if (!preview) return;
		importMutation.mutate({
			obraId,
			itens: preview
		}, {
			onSuccess: () => {
				toast.success(`${preview.length} itens importados com sucesso!`);
				setPreview(null);
				setFileName("");
				onClose();
			},
			onError: (err) => {
				toast.error(err.message || "Erro ao importar itens.");
			}
		});
	}
	function handleReset() {
		setPreview(null);
		setFileName("");
		if (inputRef.current) inputRef.current.value = "";
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: () => {
			handleReset();
			onClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-2xl max-h-[85vh] overflow-y-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "size-5 text-primary" }), "Importar Planilha de Medição"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Selecione o arquivo .xlsx da planilha de medição. O sistema lerá apenas as colunas ITEM, DESCRIÇÃO e QUANTIDADE (valores financeiros serão ignorados)." })] }),
				!preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:bg-muted/30 transition-colors",
						onClick: () => inputRef.current?.click(),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-10 text-muted-foreground/40 mx-auto mb-3" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: fileName || "Clique para selecionar ou arraste um arquivo .xlsx"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mt-1",
								children: "Formatos aceitos: .xlsx, .xls"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: inputRef,
						type: "file",
						accept: ".xlsx,.xls",
						className: "hidden",
						onChange: handleFile
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge$1, {
								variant: "outline",
								className: "text-sm",
								children: [preview.length, " itens encontrados"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "sm",
								onClick: handleReset,
								children: "Escolher outro arquivo"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "border rounded-lg overflow-hidden max-h-[40vh] overflow-y-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
								className: "bg-muted/20 sticky top-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "w-12",
										children: "#"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Descrição" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "w-20 text-right",
										children: "Qtd."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Grupo" })
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: preview.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "font-mono text-muted-foreground",
									children: item.numero_item
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-sm",
									children: item.descricao
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-right tabular-nums",
									children: item.quantidade_total
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-xs text-muted-foreground truncate max-w-[120px]",
									children: item.grupo || "—"
								})
							] }, idx)) })] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-warning text-sm bg-warning/10 px-3 py-2 rounded-lg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-4 shrink-0" }), "A importação substituirá todos os itens e medições atuais desta obra."]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => {
						handleReset();
						onClose();
					},
					children: "Cancelar"
				}), preview && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: handleConfirm,
					disabled: importMutation.isPending,
					children: [
						importMutation.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }),
						"Confirmar Importação (",
						preview.length,
						" itens)"
					]
				})] })
			]
		})
	});
}
var BRAND_NAVY = [
	0,
	43,
	91
];
var PAGE_W = 297;
var PAGE_H = 210;
var MARGIN = 14;
var HEADER_H = 25;
var FOOTER_H = 10;
var CONTENT_TOP = 35;
var CONTENT_BOTTOM = PAGE_H - FOOTER_H;
var CONTENT_H = CONTENT_BOTTOM - CONTENT_TOP;
var IMAGE_AREA_W = (PAGE_W - MARGIN * 2 - 8) * .6;
var LEGEND_AREA_W = (PAGE_W - MARGIN * 2 - 8) * .4;
var LEGEND_X = 178.6;
var MARKER_RADIUS = 3.5;
/** Branded header adapted for landscape A4 */
async function addLandscapeHeader(doc, subtitle) {
	doc.setFillColor(...BRAND_NAVY);
	doc.rect(0, 0, PAGE_W, HEADER_H, "F");
	let logo = null;
	try {
		logo = await fetchImageAsBase64("/brito-logo.png");
	} catch {}
	if (logo) {
		const { width: imgW, height: imgH } = await getImageDimensions(logo);
		const fit = fitImageInBox(imgW, imgH, 58, 17);
		const logoY = (HEADER_H - fit.height) / 2;
		doc.addImage(logo, "PNG", MARGIN, logoY, fit.width, fit.height);
		doc.setTextColor(255, 255, 255);
		doc.setFontSize(10);
		doc.setFont("helvetica", "normal");
		doc.text(subtitle, 78, 16);
	} else {
		doc.setTextColor(255, 255, 255);
		doc.setFontSize(16);
		doc.setFont("helvetica", "bold");
		doc.text("BRITO ENGENHARIA", MARGIN, 12);
		doc.setFontSize(10);
		doc.setFont("helvetica", "normal");
		doc.text(subtitle, MARGIN, 20);
	}
	doc.setTextColor(0, 0, 0);
}
function addFooter(doc, pageNum, totalPages) {
	doc.setFontSize(8);
	doc.setTextColor(128, 128, 128);
	doc.text(`Página ${pageNum} de ${totalPages}`, PAGE_W / 2, PAGE_H - 4, { align: "center" });
	doc.text("BRITO ENGENHARIA — Apontamentos Visuais", MARGIN, PAGE_H - 4);
	doc.setTextColor(0, 0, 0);
}
function drawMarker(doc, x, y, num, isResolvido) {
	if (isResolvido) doc.setFillColor(34, 139, 34);
	else doc.setFillColor(220, 53, 53);
	doc.circle(x, y, MARKER_RADIUS, "F");
	doc.setDrawColor(255, 255, 255);
	doc.setLineWidth(.5);
	doc.circle(x, y, MARKER_RADIUS, "S");
	doc.setTextColor(255, 255, 255);
	doc.setFontSize(7);
	doc.setFont("helvetica", "bold");
	const numStr = String(num);
	doc.text(numStr, x, y + 1.2, { align: "center" });
	doc.setDrawColor(0, 0, 0);
	doc.setTextColor(0, 0, 0);
}
async function generateApontamentosPdf(data) {
	const allAndares = [];
	for (const torre of data.torres) for (const andar of torre.andares) allAndares.push(andar);
	if (allAndares.length === 0) throw new Error("Nenhum andar com apontamentos para exportar.");
	const doc = new import_jspdf_node_min.default({
		unit: "mm",
		format: "a4",
		orientation: "landscape"
	});
	const totalPages = allAndares.length;
	const hoje = format(/* @__PURE__ */ new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
	for (let i = 0; i < allAndares.length; i++) {
		if (i > 0) doc.addPage("a4", "landscape");
		const andar = allAndares[i];
		const pageNum = i + 1;
		await addLandscapeHeader(doc, "Apontamentos Visuais");
		doc.setFontSize(11);
		doc.setFont("helvetica", "bold");
		doc.text(data.obraNome, MARGIN, CONTENT_TOP - 3);
		doc.setFont("helvetica", "normal");
		doc.setFontSize(8);
		const metaLine = [hoje, data.endereco].filter(Boolean).join(" — ");
		doc.text(metaLine, MARGIN, 36);
		const floorLabel = andar.apelido || `Andar ${andar.numero}`;
		const subHeader = `Torre ${andar.torreNome} — ${floorLabel}`;
		doc.setFontSize(10);
		doc.setFont("helvetica", "bold");
		doc.text(subHeader, MARGIN, 43);
		const imageTop = 47;
		const imageAreaH = CONTENT_H - 16;
		let imgDrawn = false;
		let imgX = MARGIN;
		let imgY = imageTop;
		let imgW = IMAGE_AREA_W;
		let imgH = imageAreaH;
		if (andar.plantaUrl) try {
			const imgData = await fetchImageAsBase64(andar.plantaUrl);
			const dims = await getImageDimensions(imgData);
			const fit = fitImageInBox(dims.width, dims.height, IMAGE_AREA_W, imageAreaH);
			const fmt = getImageFormatFromDataUrl(imgData);
			imgX = MARGIN + fit.offsetX;
			imgY = imageTop + fit.offsetY;
			imgW = fit.width;
			imgH = fit.height;
			doc.addImage(imgData, fmt, imgX, imgY, imgW, imgH);
			imgDrawn = true;
			doc.setDrawColor(200, 200, 200);
			doc.setLineWidth(.3);
			doc.rect(imgX, imgY, imgW, imgH, "S");
			doc.setDrawColor(0, 0, 0);
		} catch {
			doc.setFont("helvetica", "italic");
			doc.setFontSize(9);
			doc.text("[Planta não disponível]", 18, 67);
		}
		else {
			doc.setFont("helvetica", "italic");
			doc.setFontSize(9);
			doc.text("[Sem planta cadastrada]", 18, 67);
		}
		if (imgDrawn) for (const ap of andar.apontamentos) drawMarker(doc, imgX + ap.posX * imgW, imgY + ap.posY * imgH, ap.numero, ap.status === "resolvido");
		doc.setFontSize(9);
		doc.setFont("helvetica", "bold");
		doc.text("Legenda", LEGEND_X, imageTop);
		doc.setFontSize(7);
		doc.setFont("helvetica", "normal");
		doc.setFillColor(220, 53, 53);
		doc.circle(180.6, 52, 2, "F");
		doc.setTextColor(80, 80, 80);
		doc.text("Aberto", 184.6, 53);
		doc.setFillColor(34, 139, 34);
		doc.circle(206.6, 52, 2, "F");
		doc.text("Resolvido", 210.6, 53);
		doc.setTextColor(0, 0, 0);
		doc.setDrawColor(200, 200, 200);
		doc.setLineWidth(.2);
		doc.line(LEGEND_X, 56, 283, 56);
		doc.setDrawColor(0, 0, 0);
		let legendY = 61;
		const maxLegendY = CONTENT_BOTTOM - 4;
		const lineHeight = 4.5;
		const maxDescWidth = LEGEND_AREA_W - 12;
		for (const ap of andar.apontamentos) {
			if (legendY > maxLegendY) {
				doc.setFontSize(7);
				doc.setFont("helvetica", "italic");
				doc.setTextColor(128, 128, 128);
				doc.text("... (lista continua)", LEGEND_X, legendY);
				doc.setTextColor(0, 0, 0);
				break;
			}
			const statusColor = ap.status === "resolvido" ? [
				34,
				139,
				34
			] : [
				220,
				53,
				53
			];
			doc.setFillColor(...statusColor);
			doc.circle(181.6, legendY - 1, 2, "F");
			doc.setTextColor(255, 255, 255);
			doc.setFontSize(6);
			doc.setFont("helvetica", "bold");
			doc.text(String(ap.numero), 181.6, legendY - .2, { align: "center" });
			doc.setTextColor(0, 0, 0);
			doc.setFontSize(8);
			doc.setFont("helvetica", "normal");
			const linesToRender = doc.splitTextToSize(ap.descricao, maxDescWidth).slice(0, 3);
			doc.text(linesToRender, 186.6, legendY);
			legendY += linesToRender.length * lineHeight + 2;
		}
		addFooter(doc, pageNum, totalPages);
	}
	return doc.output("blob");
}
function ObraDetail() {
	const { obraId } = Route.useParams();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	if (pathname.includes(`/obras/${obraId}/torres/`) || pathname.includes(`/obras/${obraId}/rdos/`)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ObraDetailMain, { obraId });
}
function ObraDetailMain({ obraId }) {
	const { tab } = Route.useSearch();
	const { data: role } = useRole();
	const isAdmin = role === "admin";
	const isCliente = role === "cliente";
	const navigate = useNavigate();
	useQueryClient();
	const setStage = useTutorial((s) => s.setStage);
	const obra = useQuery({
		queryKey: ["obra", obraId],
		queryFn: async () => {
			const { data, error } = await supabase.from("obras").select("*").eq("id", obraId).maybeSingle();
			if (error) throw error;
			return data;
		}
	});
	const resumo = useQuery({
		queryKey: ["obra-resumo-apontamentos", obraId],
		queryFn: async () => {
			const { data: torres, error: e1 } = await supabase.from("obra_torres").select("id").eq("obra_id", obraId);
			if (e1) throw e1;
			if (!torres?.length) return {
				torres: 0,
				andares: 0,
				abertos: 0,
				resolvidos: 0
			};
			const torreIds = torres.map((t) => t.id);
			const { data: andares, error: e2 } = await supabase.from("torre_andares").select("id").in("torre_id", torreIds);
			if (e2) throw e2;
			if (!andares?.length) return {
				torres: torres.length,
				andares: 0,
				abertos: 0,
				resolvidos: 0
			};
			const andarIds = andares.map((a) => a.id);
			const { data: aponts, error: e3 } = await supabase.from("apontamentos").select("id, status").in("andar_id", andarIds);
			if (e3) throw e3;
			const all = aponts ?? [];
			return {
				torres: torres.length,
				andares: andares.length,
				abertos: all.filter((a) => a.status === "aberto").length,
				resolvidos: all.filter((a) => a.status === "resolvido").length
			};
		}
	});
	const recentes = useQuery({
		queryKey: ["apontamentos-recentes", obraId],
		queryFn: async () => {
			const { data: torres } = await supabase.from("obra_torres").select("id").eq("obra_id", obraId);
			if (!torres?.length) return [];
			const torreIds = torres.map((t) => t.id);
			const { data: andares } = await supabase.from("torre_andares").select("id, numero_andar, apelido, torre_id").in("torre_id", torreIds);
			if (!andares?.length) return [];
			const andarIds = andares.map((a) => a.id);
			const { data, error } = await supabase.from("apontamentos").select("id, descricao, status, created_at, andar_id").in("andar_id", andarIds).order("created_at", { ascending: false }).limit(5);
			if (error) throw error;
			const andarMap = new Map(andares.map((a) => [a.id, a]));
			return (data ?? []).map((ap) => {
				const andar = andarMap.get(ap.andar_id);
				return {
					...ap,
					andarLabel: andar?.apelido || `Andar ${andar?.numero_andar ?? "?"}`,
					torreId: andar?.torre_id
				};
			});
		}
	});
	if (obra.isPending && !obra.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-6 flex justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-6 animate-spin" })
	});
	if (!obra.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-6 text-center text-muted-foreground",
		children: "Obra não encontrada."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-24",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-4 sm:p-6 max-w-6xl mx-auto space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between items-center -ml-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/dashboard",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" }), " Voltar"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						size: "sm",
						className: "hidden sm:flex h-8 px-2 text-muted-foreground hover:text-foreground tutorial-glow-wrapper",
						onClick: () => {
							setStage("idle");
							setTimeout(() => {
								toast.info("Iniciando tutorial...");
								setStage("obra");
							}, 100);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "size-4 mr-1.5" }), "Tutorial da Obra"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-start justify-between gap-3 flex-wrap",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-xl sm:text-2xl font-bold tracking-tight",
						children: obra.data.nome
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge$1, {
						variant: "outline",
						className: "mt-1 bg-primary/10 text-primary border-primary/30",
						children: OBRA_STATUS_LABEL[obra.data.status]
					})] })
				}),
				tab === "visao" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 sm:grid-cols-4 gap-2",
							children: [
								[
									"Torres",
									resumo.data?.torres ?? 0,
									Building2
								],
								[
									"Andares",
									resumo.data?.andares ?? 0,
									Building2
								],
								[
									"Abertos",
									resumo.data?.abertos ?? 0,
									CircleAlert
								],
								[
									"Resolvidos",
									resumo.data?.resolvidos ?? 0,
									CircleCheck
								]
							].map(([label, n, Icon]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
								className: "text-center cursor-pointer hover:border-primary transition-colors",
								onClick: () => navigate({
									search: { tab: "mapa" },
									replace: true
								}),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
									className: "py-3 px-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `size-4 mx-auto mb-1 ${label === "Abertos" ? "text-destructive" : label === "Resolvidos" ? "text-success" : "text-muted-foreground"}` }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-2xl font-bold",
											children: n
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[0.65rem] sm:text-xs text-muted-foreground",
											children: label
										})
									]
								})
							}, label))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
							className: "pb-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-base",
								children: "Apontamentos recentes"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: !recentes.data?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground italic",
							children: "Nenhum apontamento ainda."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "divide-y",
							children: recentes.data.map((ap) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between py-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-medium truncate block",
										children: ap.descricao
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-muted-foreground",
										children: [
											ap.andarLabel,
											" · ",
											format(new Date(ap.created_at), "dd/MM/yyyy", { locale: ptBR })
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge$1, {
									variant: "outline",
									className: ap.status === "aberto" ? "bg-destructive/10 text-destructive border-destructive/30" : "bg-success/15 text-success-foreground border-success/30",
									children: ap.status === "aberto" ? "Aberto" : "Resolvido"
								})]
							}, ap.id))
						}) })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
							className: "pb-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-base",
								children: "Informações da obra"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "text-sm space-y-1 text-muted-foreground",
							children: [
								obra.data.endereco && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: obra.data.endereco }),
								(obra.data.cidade || obra.data.estado) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: [obra.data.cidade, obra.data.estado].filter(Boolean).join(" — ") }),
								obra.data.responsavel_tecnico && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["RT: ", obra.data.responsavel_tecnico] }),
								obra.data.descricao && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "pt-1",
									children: obra.data.descricao
								})
							]
						})] })
					]
				}),
				tab === "mapa" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapaTab, { obraId }),
				tab === "analytics" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ObraAnalyticsTab, { obraId }),
				tab === "rdo" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RdoTab, { obraId }),
				tab === "eap" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ObraEapTab, { obraId }),
				tab === "projetos" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ObraProjetosTab, { obraId }),
				tab === "cronograma" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ObraCronogramaTab, { obraId }),
				tab === "concretagem" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ObraConcretagemTab, { obraId }),
				tab === "fvr" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ObraFvrTab, { obraId }),
				tab === "rnc" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ObraRncTab, { obraId }),
				tab === "bm" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ObraBmTab, { obraId }),
				tab === "medicao" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ObraMedicaoTab, {
					obraId,
					isAdmin
				}),
				tab === "materiais" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ObraMateriaisTab, {
					obraId,
					isAdmin
				}),
				tab === "laudos" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ObraComissionamentoTab, {
					obraId,
					isAdmin
				}),
				tab === "sesmt" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ObraSesmtTab, {
					obraId,
					isAdmin
				}),
				tab === "menu" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ObraMenuTab, {
					obraId,
					obra: obra.data,
					isAdmin,
					isCliente
				}),
				tab === "fotografia" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ObraFotografiaTab, {
					obraId,
					obraNome: obra.data.nome,
					obraEndereco: obra.data.endereco,
					editable: !isCliente
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "tour-obra-tabs",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ObraBottomNav, {
				obraId,
				active: tab
			})
		})]
	});
}
function MapaTab({ obraId }) {
	const torresQ = useQuery({
		queryKey: ["obra-torres", obraId],
		queryFn: async () => {
			const { data: torres, error: e1 } = await supabase.from("obra_torres").select("id, nome, ordem, obra_id").eq("obra_id", obraId).order("ordem");
			if (e1) throw e1;
			if (!torres?.length) return [];
			const torreIds = torres.map((t) => t.id);
			const { data: andares, error: e2 } = await supabase.from("torre_andares").select("id, torre_id, grupo_id, numero_andar, apelido").in("torre_id", torreIds).order("numero_andar", { ascending: false });
			if (e2) throw e2;
			const grupoIds = [...new Set((andares ?? []).map((a) => a.grupo_id))];
			let grupoMap = /* @__PURE__ */ new Map();
			if (grupoIds.length) {
				const { data: grupos } = await supabase.from("torre_grupos_andar").select("id, tipo_andar, planta_storage_path").in("id", grupoIds);
				grupoMap = new Map((grupos ?? []).map((g) => [g.id, g]));
			}
			return torres.map((t) => ({
				...t,
				andares: (andares ?? []).filter((a) => a.torre_id === t.id).map((a) => {
					const grupo = grupoMap.get(a.grupo_id);
					return {
						...a,
						tipo_andar: grupo?.tipo_andar ?? "tipo",
						planta_storage_path: grupo?.planta_storage_path ?? null
					};
				})
			}));
		}
	});
	const countsQ = useQuery({
		queryKey: ["apontamento-counts", obraId],
		enabled: !!torresQ.data?.length,
		queryFn: async () => {
			const allAndarIds = (torresQ.data ?? []).flatMap((t) => t.andares.map((a) => a.id));
			if (!allAndarIds.length) return /* @__PURE__ */ new Map();
			const { data, error } = await supabase.from("apontamentos").select("id, andar_id").in("andar_id", allAndarIds).eq("status", "aberto");
			if (error) throw error;
			const map = /* @__PURE__ */ new Map();
			for (const ap of data ?? []) map.set(ap.andar_id, (map.get(ap.andar_id) ?? 0) + 1);
			return map;
		}
	});
	const navigate = useNavigate();
	const counts = countsQ.data ?? /* @__PURE__ */ new Map();
	if (torresQ.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex justify-center py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-6 animate-spin text-muted-foreground" })
	});
	if (!torresQ.data?.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "py-12 text-center space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-10 mx-auto text-muted-foreground" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground",
				children: "Nenhuma torre cadastrada."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground mb-4",
				children: "Configure a estrutura da obra no Menu."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				onClick: () => navigate({
					search: { tab: "menu" },
					replace: true
				}),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-4 mr-2" }), "Estrutura da Obra"]
			})
		]
	}) });
	const handleExportPdf = async () => {
		try {
			toast.info("Compilando dados das torres, aguarde...");
			const { data: obraData } = await supabase.from("obras").select("nome, endereco").eq("id", obraId).single();
			const allAndarIds = torresQ.data.flatMap((t) => t.andares.map((a) => a.id));
			const { data: apontamentos } = await supabase.from("apontamentos").select("id, andar_id, pos_x, pos_y, descricao, status").in("andar_id", allAndarIds).order("created_at", { ascending: true });
			const apontMap = /* @__PURE__ */ new Map();
			for (const ap of apontamentos ?? []) {
				if (!apontMap.has(ap.andar_id)) apontMap.set(ap.andar_id, []);
				apontMap.get(ap.andar_id).push({
					numero: apontMap.get(ap.andar_id).length + 1,
					descricao: ap.descricao,
					status: ap.status,
					posX: ap.pos_x,
					posY: ap.pos_y
				});
			}
			const torresData = [];
			for (const torre of torresQ.data) {
				const andaresData = [];
				for (const andar of torre.andares) {
					let plantaUrl = "";
					if (andar.planta_storage_path) {
						const { data: pUrl } = await supabase.storage.from("plantas-baixa").createSignedUrl(andar.planta_storage_path, 3600);
						plantaUrl = pUrl?.signedUrl || "";
					}
					andaresData.push({
						numero: andar.numero_andar,
						apelido: andar.apelido,
						tipoAndar: andar.tipo_andar,
						torreNome: torre.nome,
						plantaUrl,
						apontamentos: apontMap.get(andar.id) ?? []
					});
				}
				torresData.push({
					nome: torre.nome,
					andares: andaresData
				});
			}
			const pdfBlob = await generateApontamentosPdf({
				obraNome: obraData?.nome || "Obra",
				endereco: obraData?.endereco || void 0,
				torres: torresData
			});
			const url = URL.createObjectURL(pdfBlob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `Mapa-Torres-${obraData?.nome || obraId}.pdf`;
			document.body.appendChild(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(url);
		} catch (e) {
			toast.error(e.message);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-semibold tracking-tight",
				children: "Estrutura das Torres"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "outline",
					onClick: () => navigate({
						search: { tab: "menu" },
						replace: true
					}),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-4 mr-2 hidden sm:inline" }), "Estrutura"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "outline",
					onClick: handleExportPdf,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "size-4 mr-2 hidden sm:inline" }), "PDF"]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TorreMapaView, {
				obraId,
				torres: torresQ.data,
				apontamentoCounts: counts
			})
		})]
	});
}
function ObraMenuTab({ obraId, obra, isAdmin, isCliente }) {
	const navigate = useNavigate();
	useQueryClient();
	const [editOpen, setEditOpen] = (0, import_react.useState)(false);
	const [equipeOpen, setEquipeOpen] = (0, import_react.useState)(false);
	const [estruturaOpen, setEstruturaOpen] = (0, import_react.useState)(false);
	const [docsOpen, setDocsOpen] = (0, import_react.useState)(false);
	const [eapOpen, setEapOpen] = (0, import_react.useState)(false);
	const [projetosOpen, setProjetosOpen] = (0, import_react.useState)(false);
	const [confirmDeleteObra, setConfirmDeleteObra] = (0, import_react.useState)(false);
	const delObra = useMutation({
		mutationFn: async () => {
			const { error } = await supabase.from("obras").delete().eq("id", obraId);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Obra excluída.");
			navigate({ to: "/dashboard" });
		},
		onError: (e) => toast.error(e.message)
	});
	const items = [
		{
			label: "Cadastro da obra",
			onClick: () => setEditOpen(true),
			show: isAdmin
		},
		{
			label: "Estrutura da obra",
			onClick: () => setEstruturaOpen(true),
			show: !isCliente
		},
		{
			label: "Cronograma e EAP",
			onClick: () => setEapOpen(true),
			show: !isCliente
		},
		{
			label: "Projetos e Pranchas (CDE)",
			onClick: () => setProjetosOpen(true),
			show: true
		},
		{
			label: "Usuários com acesso",
			onClick: () => setEquipeOpen(true),
			show: isAdmin
		},
		{
			label: "Documentos da obra",
			onClick: () => setDocsOpen(true),
			show: !isCliente
		}
	].filter((i) => i.show);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "tour-obra-config",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "text-base flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-4" }), " Configurações"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y",
						children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: item.onClick,
							className: "w-full text-left px-4 py-3 text-sm hover:bg-muted/50",
							children: item.label
						}) }, item.label))
					})
				})]
			}),
			isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "destructive",
				className: "w-full",
				onClick: () => setConfirmDeleteObra(true),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4 mr-2" }), "Excluir obra"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: confirmDeleteObra,
				onOpenChange: setConfirmDeleteObra,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogTitle, { children: [
					"Excluir a obra \"",
					String(obra.nome),
					"\"?"
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "Todos os dados, relatórios e plantas associadas a esta obra serão permanentemente removidos. Esta ação não pode ser desfeita." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancelar" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					className: "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
					onClick: () => delObra.mutate(),
					children: "Excluir"
				})] })] })
			}),
			editOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: editOpen,
				onOpenChange: setEditOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ObraEditDialog, {
					obraId,
					onClose: () => setEditOpen(false)
				})
			}),
			equipeOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: equipeOpen,
				onOpenChange: setEquipeOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EquipeDialog, { obraId })
			}),
			estruturaOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: estruturaOpen,
				onOpenChange: setEstruturaOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstruturaObraDialog, {
					obraId,
					onClose: () => setEstruturaOpen(false)
				})
			}),
			docsOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: docsOpen,
				onOpenChange: setDocsOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ObraDocumentosDialog, { obraId })
			}),
			eapOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: eapOpen,
				onOpenChange: setEapOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					className: "max-w-4xl max-h-[90vh] overflow-y-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ObraEapTab, { obraId })
				})
			}),
			projetosOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: projetosOpen,
				onOpenChange: setProjetosOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					className: "max-w-4xl max-h-[90vh] overflow-y-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ObraProjetosTab, { obraId })
				})
			})
		]
	});
}
function ObraEditDialog({ obraId, onClose }) {
	const qc = useQueryClient();
	const obra = useQuery({
		queryKey: ["obra", obraId],
		queryFn: async () => {
			const { data } = await supabase.from("obras").select("*").eq("id", obraId).single();
			return data;
		}
	});
	const [form, setForm] = (0, import_react.useState)({});
	const save = useMutation({
		mutationFn: async () => {
			const f = {
				...obra.data,
				...form
			};
			const { error } = await supabase.from("obras").update({
				nome: f.nome,
				endereco: f.endereco || null,
				cidade: f.cidade || null,
				estado: f.estado || null,
				latitude: f.latitude ? Number(f.latitude) : null,
				longitude: f.longitude ? Number(f.longitude) : null,
				responsavel_tecnico: f.responsavel_tecnico || null,
				descricao: f.descricao || null,
				status: f.status,
				tipo_escopo: f.tipo_escopo || "global"
			}).eq("id", obraId);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Obra atualizada.");
			qc.invalidateQueries({ queryKey: ["obra", obraId] });
			onClose();
		},
		onError: (e) => toast.error(e.message)
	});
	if (!obra.data) return null;
	const v = (k) => form[k] ?? String(obra.data[k] ?? "");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: "max-h-[90vh] overflow-y-auto",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Cadastro da obra" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: (e) => {
				e.preventDefault();
				save.mutate();
			},
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nome" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: v("nome"),
						onChange: (e) => setForm({
							...form,
							nome: e.target.value
						}),
						required: true
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Endereço" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: v("endereco"),
						onChange: (e) => setForm({
							...form,
							endereco: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Latitude" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							step: "any",
							value: v("latitude"),
							onChange: (e) => setForm({
								...form,
								latitude: e.target.value
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Longitude" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							step: "any",
							value: v("longitude"),
							onChange: (e) => setForm({
								...form,
								longitude: e.target.value
							})
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Responsável técnico" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: v("responsavel_tecnico"),
						onChange: (e) => setForm({
							...form,
							responsavel_tecnico: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Escopo da Obra" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: v("tipo_escopo") || "global",
						onValueChange: (val) => setForm({
							...form,
							tipo_escopo: val
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "global",
							children: "Global (Completa)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "parcial",
							children: "Parcial"
						})] })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Descrição" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: v("descricao"),
						onChange: (e) => setForm({
							...form,
							descricao: e.target.value
						}),
						rows: 2
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					disabled: save.isPending,
					children: [save.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), "Salvar"]
				}) })
			]
		})]
	});
}
function EquipeDialog({ obraId }) {
	const qc = useQueryClient();
	const usuarios = useQuery({
		queryKey: ["usuarios-vinc", obraId],
		queryFn: async () => {
			const { data: profs, error } = await supabase.from("profiles").select("id, nome, email").eq("ativo", true);
			if (error) throw error;
			const { data: roles } = await supabase.from("user_roles").select("user_id, role");
			const { data: vinc } = await supabase.from("obra_usuarios").select("user_id").eq("obra_id", obraId);
			const vinculados = new Set(vinc?.map((v) => v.user_id));
			const roleMap = new Map(roles?.map((r) => [r.user_id, r.role]));
			return (profs ?? []).map((p) => ({
				...p,
				role: roleMap.get(p.id),
				vinc: vinculados.has(p.id)
			})).filter((p) => p.role && p.role !== "admin");
		}
	});
	const toggle = useMutation({
		mutationFn: async ({ userId, on }) => {
			if (on) {
				const { error } = await supabase.from("obra_usuarios").insert({
					obra_id: obraId,
					user_id: userId
				});
				if (error) throw error;
			} else {
				const { error } = await supabase.from("obra_usuarios").delete().eq("obra_id", obraId).eq("user_id", userId);
				if (error) throw error;
			}
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["usuarios-vinc", obraId] }),
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Usuários com acesso" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-2 max-h-[60vh] overflow-y-auto",
		children: usuarios.data?.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "flex items-center gap-3 p-2 rounded hover:bg-muted/50 cursor-pointer",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
				checked: u.vinc,
				onCheckedChange: (c) => toggle.mutate({
					userId: u.id,
					on: c === true
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-medium truncate",
					children: u.nome
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs text-muted-foreground",
					children: [
						u.email,
						" · ",
						u.role
					]
				})]
			})]
		}, u.id))
	})] });
}
function EstruturaObraDialog({ obraId, onClose }) {
	const qc = useQueryClient();
	const [torreNome, setTorreNome] = (0, import_react.useState)("");
	const [grupoForm, setGrupoForm] = (0, import_react.useState)(null);
	const [confirmTorreDelete, setConfirmTorreDelete] = (0, import_react.useState)(null);
	const [confirmPlantaDelete, setConfirmPlantaDelete] = (0, import_react.useState)(null);
	const torres = useQuery({
		queryKey: ["obra-torres-estrutura", obraId],
		queryFn: async () => {
			const { data, error } = await supabase.from("obra_torres").select("id, nome, ordem").eq("obra_id", obraId).order("ordem");
			if (error) throw error;
			const result = [];
			for (const torre of data ?? []) {
				const { data: grupos } = await supabase.from("torre_grupos_andar").select("id, nome_grupo, andar_inicial, andar_final, tipo_andar, planta_storage_path").eq("torre_id", torre.id).order("andar_inicial");
				result.push({
					...torre,
					grupos: grupos ?? []
				});
			}
			return result;
		}
	});
	const addTorre = useMutation({
		mutationFn: async () => {
			const ordem = (torres.data?.length ?? 0) + 1;
			const { error } = await supabase.from("obra_torres").insert({
				obra_id: obraId,
				nome: torreNome.trim(),
				ordem
			});
			if (error) throw error;
		},
		onSuccess: () => {
			setTorreNome("");
			toast.success("Torre adicionada.");
			qc.invalidateQueries({ queryKey: ["obra-torres-estrutura", obraId] });
			qc.invalidateQueries({ queryKey: ["obra-torres", obraId] });
		},
		onError: (e) => toast.error(e.message)
	});
	const addGrupo = useMutation({
		mutationFn: async () => {
			if (!grupoForm) return;
			const { torreId, nomeGrupo, andarInicial, andarFinal, tipoAndar } = grupoForm;
			const ini = parseInt(andarInicial);
			const fim = parseInt(andarFinal);
			if (isNaN(ini) || isNaN(fim) || ini > fim) throw new Error("Intervalo de andares inválido.");
			const { data: grupo, error: gErr } = await supabase.from("torre_grupos_andar").insert({
				torre_id: torreId,
				nome_grupo: nomeGrupo.trim() || tipoAndar,
				andar_inicial: ini,
				andar_final: fim,
				tipo_andar: tipoAndar
			}).select("id").single();
			if (gErr) throw gErr;
			const andares = [];
			for (let n = ini; n <= fim; n++) andares.push({
				torre_id: torreId,
				grupo_id: grupo.id,
				numero_andar: n,
				apelido: n === 0 ? "Térreo" : null
			});
			const { error: aErr } = await supabase.from("torre_andares").insert(andares);
			if (aErr) throw aErr;
		},
		onSuccess: () => {
			setGrupoForm(null);
			toast.success("Andares adicionados.");
			qc.invalidateQueries({ queryKey: ["obra-torres-estrutura", obraId] });
			qc.invalidateQueries({ queryKey: ["obra-torres", obraId] });
		},
		onError: (e) => toast.error(e.message)
	});
	const delTorre = useMutation({
		mutationFn: async (torreId) => {
			const { error } = await supabase.from("obra_torres").delete().eq("id", torreId);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Torre removida.");
			qc.invalidateQueries({ queryKey: ["obra-torres-estrutura", obraId] });
			qc.invalidateQueries({ queryKey: ["obra-torres", obraId] });
		},
		onError: (e) => toast.error(e.message)
	});
	const handleRemovePlanta = async (grupoId) => {
		try {
			const { error: dbErr } = await supabase.from("torre_grupos_andar").update({ planta_storage_path: null }).eq("id", grupoId);
			if (dbErr) throw dbErr;
			toast.success("Planta removida.");
			qc.invalidateQueries({ queryKey: ["obra-torres-estrutura", obraId] });
			qc.invalidateQueries({ queryKey: ["obra-torres", obraId] });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Erro ao remover planta.");
		}
	};
	const handlePlantaUpload = async (grupoId, torreId, file) => {
		try {
			const imageCompression = (await import("../_libs/browser-image-compression.mjs").then((n) => n.t)).default;
			const compressed = await imageCompression(file, {
				maxSizeMB: 1.2,
				maxWidthOrHeight: 2400,
				useWebWorker: true
			});
			const path = `${obraId}/${torreId}/${grupoId}.${file.name.split(".").pop()}`;
			const { error: upErr } = await supabase.storage.from("plantas-baixa").upload(path, compressed, { upsert: true });
			if (upErr) throw upErr;
			const { error: dbErr } = await supabase.from("torre_grupos_andar").update({ planta_storage_path: path }).eq("id", grupoId);
			if (dbErr) throw dbErr;
			toast.success("Planta enviada.");
			qc.invalidateQueries({ queryKey: ["obra-torres-estrutura", obraId] });
			qc.invalidateQueries({ queryKey: ["obra-torres", obraId] });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Erro ao enviar planta.");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: "max-w-lg max-h-[90vh] overflow-y-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Estrutura da obra" }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Nome da torre (ex: Torre 1)",
						value: torreNome,
						onChange: (e) => setTorreNome(e.target.value),
						className: "flex-1"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						onClick: () => addTorre.mutate(),
						disabled: !torreNome.trim() || addTorre.isPending,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
					})]
				}), torres.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-5 animate-spin mx-auto" }) : torres.data?.map((torre) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-sm",
							children: torre.nome
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							className: "text-destructive h-7",
							onClick: () => setConfirmTorreDelete({
								id: torre.id,
								nome: torre.nome
							}),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-2",
					children: [torre.grupos.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs border rounded p-2 space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: g.nome_grupo
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge$1, {
									variant: "outline",
									className: "text-[0.6rem]",
									children: g.tipo_andar
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-muted-foreground",
								children: [
									"Andares ",
									g.andar_inicial,
									" a ",
									g.andar_final
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-2",
								children: g.planta_storage_path ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-success text-[0.65rem] flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3" }), "Planta enviada"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "file",
											accept: "image/*",
											className: "hidden",
											id: `planta-replace-${g.id}`,
											onChange: (e) => {
												const file = e.target.files?.[0];
												if (file) handlePlantaUpload(g.id, torre.id, file);
											}
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											className: "size-5 hover:text-primary",
											onClick: () => document.getElementById(`planta-replace-${g.id}`)?.click(),
											title: "Substituir planta",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-3" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											className: "size-5 text-destructive hover:bg-destructive/10",
											onClick: () => setConfirmPlantaDelete(g.id),
											title: "Remover planta",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3" })
										})
									]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									accept: "image/*",
									className: "hidden",
									id: `planta-${g.id}`,
									onChange: (e) => {
										const file = e.target.files?.[0];
										if (file) handlePlantaUpload(g.id, torre.id, file);
									}
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "sm",
									className: "h-6 text-[0.65rem]",
									onClick: () => document.getElementById(`planta-${g.id}`)?.click(),
									children: "Enviar planta"
								})] })
							})
						]
					}, g.id)), grupoForm?.torreId === torre.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border rounded p-3 bg-muted/20 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground pb-2 mb-2 border-b",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Dica:" }),
									" Um \"Grupo\" representa andares que compartilham a ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "mesma planta-baixa" }),
									". Se a torre tem uma planta diferente por andar, crie um grupo para cada andar (ex: 1 a 1)."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Nome do grupo (ex: Pavimentos Tipo)",
								value: grupoForm.nomeGrupo,
								onChange: (e) => setGrupoForm({
									...grupoForm,
									nomeGrupo: e.target.value
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									placeholder: "Andar inicial",
									value: grupoForm.andarInicial,
									onChange: (e) => setGrupoForm({
										...grupoForm,
										andarInicial: e.target.value
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									placeholder: "Andar final",
									value: grupoForm.andarFinal,
									onChange: (e) => setGrupoForm({
										...grupoForm,
										andarFinal: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: grupoForm.tipoAndar,
								onValueChange: (v) => setGrupoForm({
									...grupoForm,
									tipoAndar: v
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "garagem",
										children: "Garagem / Subsolo"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "terreo",
										children: "Térreo / Externo"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "mezanino",
										children: "Mezanino / Pilotis / Comum"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "tipo",
										children: "Andar Tipo"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "comercial",
										children: "Comercial / Loja"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "tecnica",
										children: "Área Técnica / Barrilete"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "subestacao",
										children: "Subestação / Casa de Força"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "cobertura",
										children: "Cobertura"
									})
								] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "tour-obra-config flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "sm",
									onClick: () => setGrupoForm(null),
									children: "Cancelar"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									onClick: () => addGrupo.mutate(),
									disabled: addGrupo.isPending,
									children: "Salvar"
								})]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						className: "w-full",
						onClick: () => setGrupoForm({
							torreId: torre.id,
							nomeGrupo: "",
							andarInicial: "",
							andarFinal: "",
							tipoAndar: "tipo"
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), " Adicionar andares"]
					})]
				})] }, torre.id))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: !!confirmTorreDelete,
				onOpenChange: (open) => !open && setConfirmTorreDelete(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Remover torre?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
					"Você está prestes a remover a ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: confirmTorreDelete?.nome }),
					". Todos os andares vinculados a ela serão perdidos. Esta ação não pode ser desfeita."
				] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancelar" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					className: "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
					onClick: () => {
						if (confirmTorreDelete) delTorre.mutate(confirmTorreDelete.id);
						setConfirmTorreDelete(null);
					},
					children: "Remover"
				})] })] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: !!confirmPlantaDelete,
				onOpenChange: (open) => !open && setConfirmPlantaDelete(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Remover planta do andar?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "Tem certeza que deseja remover a imagem da planta-baixa deste andar?" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancelar" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					className: "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
					onClick: () => {
						if (confirmPlantaDelete) handleRemovePlanta(confirmPlantaDelete);
						setConfirmPlantaDelete(null);
					},
					children: "Remover"
				})] })] })
			})
		]
	});
}
function ObraDocumentosDialog({ obraId }) {
	const qc = useQueryClient();
	const docs = useQuery({
		queryKey: ["obra-docs", obraId],
		queryFn: async () => {
			const { data, error } = await supabase.from("obra_documentos").select("*").eq("obra_id", obraId).order("created_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	const upload = async (files) => {
		if (!files?.length) return;
		const { data: u } = await supabase.auth.getUser();
		let uploaded = 0;
		for (const file of Array.from(files)) {
			const path = `${obraId}/documentos/${crypto.randomUUID()}-${file.name}`;
			const { error: upErr } = await supabase.storage.from("rdo-anexos").upload(path, file);
			if (upErr) {
				toast.error(upErr.message);
				continue;
			}
			const { error: dbErr } = await supabase.from("obra_documentos").insert({
				obra_id: obraId,
				storage_path: path,
				nome_arquivo: file.name,
				mime_type: file.type || null,
				enviado_por: u.user?.id
			});
			if (dbErr) {
				await supabase.storage.from("rdo-anexos").remove([path]);
				toast.error(dbErr.message);
				continue;
			}
			uploaded++;
		}
		if (uploaded > 0) {
			qc.invalidateQueries({ queryKey: ["obra-docs", obraId] });
			toast.success(uploaded === 1 ? "Documento enviado." : `${uploaded} documentos enviados.`);
		}
		const input = document.getElementById("obra-docs-input");
		if (input) input.value = "";
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Documentos da obra" }) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "file",
			multiple: true,
			className: "hidden",
			id: "obra-docs-input",
			onChange: (e) => void upload(e.target.files)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "outline",
			onClick: () => document.getElementById("obra-docs-input")?.click(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4 mr-2" }), " Enviar documento"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "text-sm divide-y mt-2 max-h-48 overflow-y-auto",
			children: docs.data?.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "py-2 truncate",
				children: d.nome_arquivo
			}, d.id))
		})
	] });
}
function RdoTab({ obraId }) {
	const { data: rdos, isLoading } = useRdosDaObra(obraId);
	const createMut = useCreateRdo();
	const navigate = useNavigate();
	const handleCreate = async () => {
		try {
			const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
			const rdoExistente = rdos?.find((r) => r.data === today && (!r.tipo || r.tipo === "diario"));
			if (rdoExistente) {
				toast.info("Você já possui um RDO Diário para a data de hoje. Abrindo RDO existente...");
				navigate({
					to: "/obras/$obraId/rdos/$rdoId",
					params: {
						obraId,
						rdoId: rdoExistente.id
					}
				});
				return;
			}
			const rdo = await createMut.mutateAsync({
				obra_id: obraId,
				data: today,
				tipo: "diario"
			});
			try {
				const { data: obraData } = await supabase.from("obras").select("latitude, longitude").eq("id", obraId).single();
				if (obraData && obraData.latitude && obraData.longitude) {
					const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${obraData.latitude}&longitude=${obraData.longitude}&daily=weathercode&timezone=America/Sao_Paulo`);
					if (res.ok) {
						const code = (await res.json())?.daily?.weathercode?.[0];
						let climaStr = "Ensolarado";
						if (code !== void 0) {
							if (code >= 1 && code <= 3) climaStr = "Nublado";
							if (code >= 51 && code <= 99) climaStr = "Chuvoso";
						}
						await supabase.from("rdos").update({
							condicao_tempo_manha: climaStr,
							condicao_tempo_tarde: climaStr
						}).eq("id", rdo.id);
						toast.success(`Clima automático detectado: ${climaStr}`);
					}
				}
			} catch (weatherErr) {
				console.error("Falha ao buscar clima automático:", weatherErr);
			}
			navigate({
				to: "/obras/$obraId/rdos/$rdoId",
				params: {
					obraId,
					rdoId: rdo.id
				}
			});
		} catch (e) {
			toast.error("Erro ao criar RDO: " + e.message);
		}
	};
	const handleCreateSemanal = async () => {
		try {
			const today = /* @__PURE__ */ new Date();
			const day = today.getDay();
			const monday = new Date(today);
			monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1));
			const requiredDays = [];
			for (let i = 0; i < 5; i++) {
				const d = new Date(monday);
				d.setDate(monday.getDate() + i);
				requiredDays.push(d.toISOString().split("T")[0]);
			}
			const missing = requiredDays.filter((date) => !rdos?.find((r) => r.data === date && (!r.tipo || r.tipo === "diario")));
			if (missing.length > 0) {
				toast.error(`Para gerar o RDO Semanal, você precisa preencher os RDOs diários de todos os dias úteis. Faltam: ${missing.map((d) => format(/* @__PURE__ */ new Date(d + "T12:00:00"), "dd/MM")).join(", ")}`);
				return;
			}
			const friday = requiredDays[4];
			const rdoSemanalExistente = rdos?.find((r) => r.data === friday && r.tipo === "semanal");
			if (rdoSemanalExistente) {
				toast.info("Você já possui um RDO Semanal para esta semana. Abrindo...");
				navigate({
					to: "/obras/$obraId/rdos/$rdoId",
					params: {
						obraId,
						rdoId: rdoSemanalExistente.id
					}
				});
				return;
			}
			navigate({
				to: "/obras/$obraId/rdos/$rdoId",
				params: {
					obraId,
					rdoId: (await createMut.mutateAsync({
						obra_id: obraId,
						data: friday,
						tipo: "semanal"
					})).id
				}
			});
		} catch (e) {
			toast.error("Erro ao criar RDO Semanal: " + e.message);
		}
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex justify-center py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-6 animate-spin text-muted-foreground" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
		className: "flex flex-row items-center justify-between pb-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
			className: "text-base flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-4 text-primary" }), "Relatórios Diários de Obra"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "outline",
				onClick: handleCreateSemanal,
				disabled: createMut.isPending,
				children: "Novo RDO Semanal"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				onClick: handleCreate,
				disabled: createMut.isPending,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4 mr-2" }), " Novo RDO"]
			})]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: !rdos?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground italic py-4 text-center",
		children: "Nenhum RDO criado."
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "divide-y",
		children: rdos.map((rdo) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "py-3 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "font-medium text-sm flex items-center gap-2",
				children: [
					"RDO #",
					rdo.numero_sequencial,
					rdo.tipo === "semanal" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge$1, {
						variant: "secondary",
						className: "bg-primary/10 text-primary",
						children: "SEMANAL"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge$1, {
						variant: "outline",
						className: rdo.status === "aprovado" ? "text-success border-success" : "",
						children: rdo.status.toUpperCase()
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-muted-foreground mt-0.5",
				children: format(new Date(rdo.data), "dd/MM/yyyy")
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "sm",
				onClick: () => navigate({
					to: "/obras/$obraId/rdos/$rdoId",
					params: {
						obraId,
						rdoId: rdo.id
					}
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4 rotate-180" })
			})]
		}, rdo.id))
	}) })] });
}
//#endregion
export { ObraDetail as component };
