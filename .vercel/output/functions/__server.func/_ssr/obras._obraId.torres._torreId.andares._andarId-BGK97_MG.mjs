import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { d as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as CardContent, t as Card } from "./card-NkTA-G4u.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { N as LoaderCircle, O as Minus, P as ListChecks, S as Plus, at as CircleCheck, f as Trash2, nt as Circle, ut as ChevronLeft, x as RotateCcw } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-B5625LbR.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useRole } from "./use-auth-D2UOjB9-.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { i as useDeleteApontamento, n as useAndarDetail, o as usePlantaUrl, r as useCreateApontamento, s as useUpdateApontamento, t as useAndarApontamentos } from "./use-apontamentos-DB2imWYJ.mjs";
import { t as Route } from "./obras._obraId.torres._torreId.andares._andarId-D7ab6LSH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/obras._obraId.torres._torreId.andares._andarId-BGK97_MG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ApontamentoPin({ numero, posX, posY, status, selected = false, onClick }) {
	const isAberto = status === "aberto";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick: (e) => {
			e.stopPropagation();
			onClick();
		},
		className: cn("absolute flex items-center justify-center", "rounded-full font-bold text-white text-xs leading-none", "transition-transform duration-150 ease-out", "animate-in fade-in zoom-in-75 slide-in-from-top-2 duration-300", "focus-visible:outline-none", "hover:scale-110", isAberto ? "bg-destructive shadow-[0_2px_8px_rgba(220,38,38,0.45)]" : "bg-success shadow-[0_2px_8px_rgba(34,197,94,0.45)]", selected && ["scale-115 z-20", isAberto ? "ring-2 ring-destructive/50 ring-offset-2 ring-offset-background" : "ring-2 ring-success/50 ring-offset-2 ring-offset-background"], !selected && "z-10"),
		style: {
			width: 28,
			height: 28,
			left: `${posX * 100}%`,
			top: `${posY * 100}%`,
			transform: selected ? "translate(-50%, -50%) scale(1.15)" : "translate(-50%, -50%)"
		},
		"aria-label": `Apontamento ${numero} — ${isAberto ? "Aberto" : "Resolvido"}`,
		children: numero
	});
}
var MIN_SCALE = .5;
var MAX_SCALE = 5;
var ZOOM_STEP = .25;
var DOUBLE_TAP_SCALE = 2.5;
function clamp(val, min, max) {
	return Math.min(Math.max(val, min), max);
}
function PlantaBaixaViewer({ imageUrl, pins, selectedPinId, onPinSelect, onCreatePin, addingPin = false }) {
	const containerRef = (0, import_react.useRef)(null);
	const imageRef = (0, import_react.useRef)(null);
	const [scale, setScale] = (0, import_react.useState)(1);
	const [translate, setTranslate] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	const [isDragging, setIsDragging] = (0, import_react.useState)(false);
	const [imageLoaded, setImageLoaded] = (0, import_react.useState)(false);
	const dragStart = (0, import_react.useRef)({
		x: 0,
		y: 0
	});
	const translateStart = (0, import_react.useRef)({
		x: 0,
		y: 0
	});
	const hasMoved = (0, import_react.useRef)(false);
	const lastTouchDist = (0, import_react.useRef)(null);
	const lastTouchCenter = (0, import_react.useRef)({
		x: 0,
		y: 0
	});
	const zoomAroundPoint = (0, import_react.useCallback)((newScale, cx, cy) => {
		setScale((prev) => {
			const clamped = clamp(newScale, MIN_SCALE, MAX_SCALE);
			const ratio = clamped / prev;
			setTranslate((t) => ({
				x: cx - ratio * (cx - t.x),
				y: cy - ratio * (cy - t.y)
			}));
			return clamped;
		});
	}, []);
	const zoomIn = (0, import_react.useCallback)(() => {
		const container = containerRef.current;
		if (!container) return;
		const rect = container.getBoundingClientRect();
		const cx = rect.width / 2;
		const cy = rect.height / 2;
		zoomAroundPoint(scale + ZOOM_STEP, cx, cy);
	}, [scale, zoomAroundPoint]);
	const zoomOut = (0, import_react.useCallback)(() => {
		const container = containerRef.current;
		if (!container) return;
		const rect = container.getBoundingClientRect();
		const cx = rect.width / 2;
		const cy = rect.height / 2;
		zoomAroundPoint(scale - ZOOM_STEP, cx, cy);
	}, [scale, zoomAroundPoint]);
	const resetView = (0, import_react.useCallback)(() => {
		setScale(1);
		setTranslate({
			x: 0,
			y: 0
		});
	}, []);
	(0, import_react.useEffect)(() => {
		const container = containerRef.current;
		if (!container) return;
		function onWheel(e) {
			e.preventDefault();
			const rect = container.getBoundingClientRect();
			const cx = e.clientX - rect.left;
			const cy = e.clientY - rect.top;
			zoomAroundPoint(scale + (e.deltaY > 0 ? -.25 : ZOOM_STEP), cx, cy);
		}
		container.addEventListener("wheel", onWheel, { passive: false });
		return () => container.removeEventListener("wheel", onWheel);
	}, [scale, zoomAroundPoint]);
	function handlePointerDown(e) {
		if (e.button !== 0) return;
		if (e.pointerType === "touch" && lastTouchDist.current !== null) return;
		setIsDragging(true);
		hasMoved.current = false;
		dragStart.current = {
			x: e.clientX,
			y: e.clientY
		};
		translateStart.current = { ...translate };
		e.target.setPointerCapture?.(e.pointerId);
	}
	function handlePointerMove(e) {
		if (!isDragging) return;
		const dx = e.clientX - dragStart.current.x;
		const dy = e.clientY - dragStart.current.y;
		if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasMoved.current = true;
		setTranslate({
			x: translateStart.current.x + dx,
			y: translateStart.current.y + dy
		});
	}
	function handlePointerUp(e) {
		if (!isDragging) return;
		setIsDragging(false);
		if (!hasMoved.current && addingPin && onCreatePin) createPinAtEvent(e);
	}
	function getTouchDist(touches) {
		const [a, b] = [touches[0], touches[1]];
		return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
	}
	function getTouchCenter(touches) {
		const [a, b] = [touches[0], touches[1]];
		return {
			x: (a.clientX + b.clientX) / 2,
			y: (a.clientY + b.clientY) / 2
		};
	}
	function handleTouchStart(e) {
		if (e.touches.length === 2) {
			lastTouchDist.current = getTouchDist(e.touches);
			lastTouchCenter.current = getTouchCenter(e.touches);
		}
	}
	function handleTouchMove(e) {
		if (e.touches.length === 2 && lastTouchDist.current !== null) {
			e.preventDefault();
			const newDist = getTouchDist(e.touches);
			const center = getTouchCenter(e.touches);
			const container = containerRef.current;
			if (!container) return;
			const rect = container.getBoundingClientRect();
			const cx = center.x - rect.left;
			const cy = center.y - rect.top;
			zoomAroundPoint(scale * (newDist / lastTouchDist.current), cx, cy);
			lastTouchDist.current = newDist;
			lastTouchCenter.current = center;
		}
	}
	function handleTouchEnd(e) {
		if (e.touches.length < 2) lastTouchDist.current = null;
	}
	function handleDoubleClick(e) {
		const container = containerRef.current;
		if (!container) return;
		const rect = container.getBoundingClientRect();
		const cx = e.clientX - rect.left;
		const cy = e.clientY - rect.top;
		if (scale > 1.1) {
			setScale(1);
			setTranslate({
				x: 0,
				y: 0
			});
		} else zoomAroundPoint(DOUBLE_TAP_SCALE, cx, cy);
	}
	function createPinAtEvent(e) {
		const img = imageRef.current;
		if (!img) return;
		const imgRect = img.getBoundingClientRect();
		const clickX = e.clientX - imgRect.left;
		const clickY = e.clientY - imgRect.top;
		const posX = clickX / imgRect.width;
		const posY = clickY / imgRect.height;
		if (posX < 0 || posX > 1 || posY < 0 || posY > 1) return;
		onCreatePin?.(posX, posY);
	}
	const numberedPins = pins.map((pin, i) => ({
		...pin,
		numero: i + 1
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative w-full h-full min-h-[300px] select-none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: containerRef,
				className: cn("w-full h-full overflow-hidden relative rounded-lg border bg-muted/30", isDragging ? "cursor-grabbing" : addingPin ? "cursor-crosshair" : "cursor-grab"),
				onPointerDown: handlePointerDown,
				onPointerMove: handlePointerMove,
				onPointerUp: handlePointerUp,
				onPointerCancel: () => setIsDragging(false),
				onDoubleClick: handleDoubleClick,
				onTouchStart: handleTouchStart,
				onTouchMove: handleTouchMove,
				onTouchEnd: handleTouchEnd,
				style: { touchAction: "none" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
						transformOrigin: "0 0",
						willChange: "transform"
					},
					className: "relative inline-block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						ref: imageRef,
						src: imageUrl,
						alt: "Planta baixa",
						className: "block w-full h-auto pointer-events-none",
						draggable: false,
						onLoad: () => setImageLoaded(true)
					}), imageLoaded && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0",
						style: {
							transform: `scale(${1 / scale})`,
							transformOrigin: "0 0",
							width: `${scale * 100}%`,
							height: `${scale * 100}%`
						},
						children: numberedPins.map((pin) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApontamentoPin, {
							numero: pin.numero,
							posX: pin.pos_x,
							posY: pin.pos_y,
							status: pin.status,
							selected: pin.id === selectedPinId,
							onClick: () => onPinSelect(pin.id)
						}, pin.id))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute bottom-3 right-3 flex flex-col gap-1 z-30",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "secondary",
						size: "icon",
						className: "size-8 shadow-md",
						onClick: zoomIn,
						title: "Aumentar zoom",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "secondary",
						size: "icon",
						className: "size-8 shadow-md",
						onClick: zoomOut,
						title: "Diminuir zoom",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "secondary",
						size: "icon",
						className: "size-8 shadow-md",
						onClick: resetView,
						title: "Resetar visualização",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" })
					})
				]
			}),
			addingPin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute top-3 left-1/2 -translate-x-1/2 z-30 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium shadow-md animate-pulse",
				children: "Clique na planta para posicionar o apontamento"
			})
		]
	});
}
function ApontamentoForm({ onSave, onCancel, initialDescricao = "", saving = false }) {
	const [descricao, setDescricao] = (0, import_react.useState)(initialDescricao);
	const textareaRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const timer = setTimeout(() => {
			textareaRef.current?.focus();
		}, 50);
		return () => clearTimeout(timer);
	}, []);
	function handleSave() {
		const trimmed = descricao.trim();
		if (!trimmed) return;
		onSave(trimmed);
	}
	function handleKeyDown(e) {
		if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
			e.preventDefault();
			handleSave();
		}
		if (e.key === "Escape") {
			e.preventDefault();
			onCancel();
		}
	}
	const canSave = descricao.trim().length > 0 && !saving;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "shadow-lg border-primary/20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "p-3 space-y-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				ref: textareaRef,
				placeholder: "Descreva o apontamento...",
				rows: 3,
				value: descricao,
				onChange: (e) => setDescricao(e.target.value),
				onKeyDown: handleKeyDown,
				disabled: saving,
				className: "text-sm resize-none"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-end gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					size: "sm",
					onClick: onCancel,
					disabled: saving,
					children: "Cancelar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					size: "sm",
					onClick: handleSave,
					disabled: !canSave,
					children: [saving && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin" }), "Salvar"]
				})]
			})]
		})
	});
}
function formatDate(iso) {
	try {
		return new Intl.DateTimeFormat("pt-BR", {
			day: "2-digit",
			month: "2-digit",
			year: "2-digit",
			hour: "2-digit",
			minute: "2-digit"
		}).format(new Date(iso));
	} catch {
		return iso;
	}
}
function ApontamentoLegend({ apontamentos, selectedId, onSelect, onStatusChange, onDelete, editable = false }) {
	if (!apontamentos.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center py-8 text-muted-foreground gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListChecks, { className: "size-6" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm",
			children: "Nenhum apontamento neste andar."
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "max-h-[420px] overflow-y-auto space-y-1 pr-1",
		children: apontamentos.map((ap) => {
			const isAberto = ap.status === "aberto";
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => onSelect(ap.id),
				className: cn("w-full flex items-start gap-2.5 rounded-lg px-3 py-2 text-left", "transition-colors duration-100", "hover:bg-muted/60", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", ap.id === selectedId && "bg-accent/15 ring-1 ring-accent/30"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("shrink-0 flex items-center justify-center size-6 rounded-full text-[11px] font-bold text-white mt-0.5", isAberto ? "bg-destructive" : "bg-success"),
						children: ap.numero
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-0 space-y-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm leading-snug line-clamp-2",
							children: ap.descricao
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-[11px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: formatDate(ap.created_at)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("font-medium", isAberto ? "text-destructive" : "text-success"),
								children: isAberto ? "Aberto" : "Resolvido"
							})]
						})]
					}),
					editable && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "shrink-0 flex items-center gap-0.5 mt-0.5",
						children: [onStatusChange && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "ghost",
							size: "icon",
							className: "size-7 text-muted-foreground hover:text-foreground",
							onClick: (e) => {
								e.stopPropagation();
								onStatusChange(ap.id, isAberto ? "resolvido" : "aberto");
							},
							title: isAberto ? "Marcar como resolvido" : "Reabrir",
							children: isAberto ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "size-3.5" })
						}), onDelete && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "ghost",
							size: "icon",
							className: "size-7 text-muted-foreground hover:text-destructive",
							onClick: (e) => {
								e.stopPropagation();
								onDelete(ap.id);
							},
							title: "Excluir apontamento",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
						})]
					})
				]
			}, ap.id);
		})
	});
}
function AndarDetailPage() {
	const { obraId, torreId, andarId } = Route.useParams();
	const { data: role } = useRole();
	const canEdit = !(role === "cliente");
	const andar = useAndarDetail(andarId);
	const apontamentos = useAndarApontamentos(andarId);
	const plantaUrl = usePlantaUrl(andar.data?.grupo?.planta_storage_path);
	const createMut = useCreateApontamento();
	const updateMut = useUpdateApontamento();
	const deleteMut = useDeleteApontamento();
	const [selectedPinId, setSelectedPinId] = (0, import_react.useState)(null);
	const [addingPin, setAddingPin] = (0, import_react.useState)(false);
	const [pendingPos, setPendingPos] = (0, import_react.useState)(null);
	const handleCreatePin = (0, import_react.useCallback)((posX, posY) => {
		setPendingPos({
			x: posX,
			y: posY
		});
		setSelectedPinId(null);
	}, []);
	const handleSavePin = (0, import_react.useCallback)((descricao) => {
		if (!pendingPos) return;
		createMut.mutate({
			andar_id: andarId,
			pos_x: pendingPos.x,
			pos_y: pendingPos.y,
			descricao,
			obraId
		}, {
			onSuccess: () => {
				setPendingPos(null);
				setAddingPin(false);
				toast.success("Apontamento criado.");
			},
			onError: (e) => toast.error(e.message)
		});
	}, [
		pendingPos,
		andarId,
		obraId,
		createMut
	]);
	const handleStatusChange = (0, import_react.useCallback)((id, newStatus) => {
		updateMut.mutate({
			id,
			status: newStatus,
			andarId,
			obraId
		}, {
			onSuccess: () => toast.success(newStatus === "resolvido" ? "Marcado como resolvido." : "Reaberto."),
			onError: (e) => toast.error(e.message)
		});
	}, [
		andarId,
		obraId,
		updateMut
	]);
	const handleDelete = (0, import_react.useCallback)((id) => {
		if (!confirm("Excluir este apontamento?")) return;
		deleteMut.mutate({
			id,
			andarId,
			obraId
		}, {
			onSuccess: () => {
				setSelectedPinId(null);
				toast.success("Apontamento excluído.");
			},
			onError: (e) => toast.error(e.message)
		});
	}, [
		andarId,
		obraId,
		deleteMut
	]);
	if (andar.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-6 flex justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-6 animate-spin" })
	});
	if (!andar.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-6 text-center text-muted-foreground",
		children: "Andar não encontrado."
	});
	const title = andar.data.apelido || `Andar ${andar.data.numero_andar}`;
	const pins = (apontamentos.data ?? []).map((ap, i) => ({
		id: ap.id,
		pos_x: Number(ap.pos_x),
		pos_y: Number(ap.pos_y),
		status: ap.status,
		descricao: ap.descricao
	}));
	const legendItems = (apontamentos.data ?? []).map((ap, i) => ({
		id: ap.id,
		numero: i + 1,
		descricao: ap.descricao,
		status: ap.status,
		created_at: ap.created_at
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col h-[100dvh]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "border-b bg-card px-4 py-3 flex items-center gap-3 shrink-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					asChild: true,
					className: "-ml-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/obras/$obraId",
						params: { obraId },
						search: { tab: "mapa" },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 min-w-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "text-sm font-semibold truncate",
						children: [
							andar.data.torre.nome,
							" — ",
							title
						]
					})
				}),
				canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: addingPin ? "default" : "outline",
					onClick: () => {
						setAddingPin(!addingPin);
						setPendingPos(null);
						setSelectedPinId(null);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), addingPin ? "Cancelar" : "Novo"]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 flex flex-col md:flex-row overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 relative min-h-0",
				children: [plantaUrl.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-center h-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-6 animate-spin text-muted-foreground" })
				}) : !plantaUrl.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-center h-full text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center space-y-2 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm",
							children: "Nenhuma planta-baixa enviada para este andar."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs",
							children: "Envie uma planta pelo Menu → Estrutura da obra."
						})]
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlantaBaixaViewer, {
					imageUrl: plantaUrl.data,
					pins,
					selectedPinId: selectedPinId ?? void 0,
					onPinSelect: (id) => {
						setSelectedPinId(id);
						setPendingPos(null);
					},
					onCreatePin: canEdit && addingPin ? handleCreatePin : void 0,
					addingPin
				}), pendingPos && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute bottom-4 left-4 right-4 z-30 md:right-auto md:max-w-sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApontamentoForm, {
						onSave: handleSavePin,
						onCancel: () => setPendingPos(null),
						saving: createMut.isPending
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "md:w-80 lg:w-96 border-t md:border-t-0 md:border-l bg-card overflow-y-auto shrink-0 max-h-[35vh] md:max-h-none",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-3 border-b",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-semibold",
							children: "Apontamentos"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "outline",
							className: "text-xs",
							children: [
								legendItems.filter((a) => a.status === "aberto").length,
								" aberto",
								legendItems.filter((a) => a.status === "aberto").length !== 1 ? "s" : ""
							]
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApontamentoLegend, {
					apontamentos: legendItems,
					selectedId: selectedPinId ?? void 0,
					onSelect: (id) => setSelectedPinId(id),
					onStatusChange: canEdit ? handleStatusChange : void 0,
					onDelete: canEdit ? handleDelete : void 0,
					editable: canEdit
				})]
			})]
		})]
	});
}
//#endregion
export { AndarDetailPage as component };
