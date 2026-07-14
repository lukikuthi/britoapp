import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-8Lt4JWZh.mjs";
import { d as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as CardHeader, n as CardContent, o as CardTitle, t as Card } from "./card-NkTA-G4u.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { C as Pen, N as LoaderCircle, S as Plus, f as Trash2, j as MapPin } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, s as DialogTrigger, t as Dialog } from "./dialog-BGAiVp67.mjs";
import { t as Button } from "./button-B5625LbR.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/obras.index-CihDGula.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ObrasPage() {
	const qc = useQueryClient();
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [open, setOpen] = (0, import_react.useState)(false);
	const obras = useQuery({
		queryKey: ["obras"],
		queryFn: async () => {
			const { data, error } = await supabase.from("obras").select("*").order("created_at", { ascending: false });
			if (error) throw error;
			return data;
		}
	});
	const del = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("obras").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Obra removida.");
			qc.invalidateQueries({ queryKey: ["obras"] });
			qc.invalidateQueries({ queryKey: ["obras-dashboard"] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-4 sm:p-6 max-w-6xl mx-auto space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-3 flex-wrap",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl sm:text-3xl font-bold tracking-tight",
				children: "Obras"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground mt-1",
				children: "Cadastre e gerencie todas as obras."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
				open,
				onOpenChange: (o) => {
					setOpen(o);
					if (!o) setEditing(null);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "tour-form-nova",
						onClick: () => setEditing(null),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Nova obra"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ObraDialog, {
					obra: editing,
					onClose: () => {
						setOpen(false);
						setEditing(null);
					}
				})]
			})]
		}), obras.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "py-12 flex justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-6 animate-spin text-muted-foreground" })
		}) : !obras.data?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "py-10 text-center text-muted-foreground",
			children: "Nenhuma obra ainda."
		}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
			children: obras.data.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
				className: "pb-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/obras/$obraId",
							params: { obraId: o.id },
							className: "hover:underline",
							children: o.nome
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "brito-status-dot",
						"data-status": o.status
					})]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-3",
				children: [(o.cidade || o.estado) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3.5" }), [o.cidade, o.estado].filter(Boolean).join(" — ")]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2 pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => {
							setEditing(o);
							setOpen(true);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "size-3.5" }), "Editar"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						className: "text-destructive hover:bg-destructive/10",
						onClick: () => {
							if (confirm(`Remover a obra "${o.nome}"? Esta ação não pode ser desfeita.`)) del.mutate(o.id);
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
					})]
				})]
			})] }, o.id))
		})]
	});
}
function ObraDialog({ obra, onClose }) {
	const qc = useQueryClient();
	const isEdit = !!obra;
	const [form, setForm] = (0, import_react.useState)({
		nome: obra?.nome ?? "",
		endereco: obra?.endereco ?? "",
		cidade: obra?.cidade ?? "",
		estado: obra?.estado ?? "",
		latitude: obra?.latitude?.toString() ?? "",
		longitude: obra?.longitude?.toString() ?? "",
		responsavel_tecnico: obra?.responsavel_tecnico ?? "",
		data_inicio: obra?.data_inicio ?? "",
		data_prevista_termino: obra?.data_prevista_termino ?? "",
		status: obra?.status ?? "em_andamento",
		tipo_escopo: obra?.tipo_escopo ?? "global",
		descricao: obra?.descricao ?? "",
		cliente_id: obra?.cliente_id ?? ""
	});
	const clientes = useQuery({
		queryKey: ["users-clientes"],
		queryFn: async () => {
			const { data: roles, error } = await supabase.from("user_roles").select("user_id").eq("role", "cliente");
			if (error) throw error;
			const ids = roles?.map((r) => r.user_id) ?? [];
			if (!ids.length) return [];
			const { data: profs, error: e2 } = await supabase.from("profiles").select("id, nome, email").in("id", ids);
			if (e2) throw e2;
			return profs ?? [];
		}
	});
	const navigate = useNavigate();
	const save = useMutation({
		mutationFn: async () => {
			const payload = {
				nome: form.nome.trim(),
				endereco: form.endereco || null,
				cidade: form.cidade || null,
				estado: form.estado || null,
				latitude: form.latitude ? Number(form.latitude) : null,
				longitude: form.longitude ? Number(form.longitude) : null,
				responsavel_tecnico: form.responsavel_tecnico || null,
				data_inicio: form.data_inicio || null,
				data_prevista_termino: form.data_prevista_termino || null,
				status: form.status,
				tipo_escopo: form.tipo_escopo,
				descricao: form.descricao || null,
				cliente_id: form.cliente_id || null
			};
			if (isEdit) {
				const { error } = await supabase.from("obras").update(payload).eq("id", obra.id);
				if (error) throw error;
				return obra.id;
			} else {
				const { data: u } = await supabase.auth.getUser();
				const { data, error } = await supabase.from("obras").insert({
					...payload,
					criado_por: u.user?.id
				}).select("id").single();
				if (error) throw error;
				return data.id;
			}
		},
		onSuccess: (newId) => {
			toast.success(isEdit ? "Obra atualizada." : "Obra criada.");
			qc.invalidateQueries({ queryKey: ["obras"] });
			qc.invalidateQueries({ queryKey: ["obras-dashboard"] });
			onClose();
			if (newId && !isEdit) navigate({
				to: "/obras/$obraId",
				params: { obraId: newId },
				search: { tab: "visao" }
			});
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: "max-w-2xl max-h-[90vh] overflow-y-auto",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: isEdit ? "Editar obra" : "Nova obra" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: (e) => {
				e.preventDefault();
				save.mutate();
			},
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 tour-form-nome",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nome *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						required: true,
						value: form.nome,
						onChange: (e) => setForm({
							...form,
							nome: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Endereço" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: form.endereco,
						onChange: (e) => setForm({
							...form,
							endereco: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Cidade" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.cidade,
							onChange: (e) => setForm({
								...form,
								cidade: e.target.value
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Estado (UF)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							maxLength: 2,
							value: form.estado,
							onChange: (e) => setForm({
								...form,
								estado: e.target.value.toUpperCase()
							})
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3 tour-form-latlng",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Latitude" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							step: "any",
							value: form.latitude,
							onChange: (e) => setForm({
								...form,
								latitude: e.target.value
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Longitude" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							step: "any",
							value: form.longitude,
							onChange: (e) => setForm({
								...form,
								longitude: e.target.value
							})
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground -mt-2",
					children: "Lat/Lng podem ser usados para localizar a obra no mapa."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Responsável técnico" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: form.responsavel_tecnico,
						onChange: (e) => setForm({
							...form,
							responsavel_tecnico: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Início" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: form.data_inicio,
							onChange: (e) => setForm({
								...form,
								data_inicio: e.target.value
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Previsão de término" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: form.data_prevista_termino,
							onChange: (e) => setForm({
								...form,
								data_prevista_termino: e.target.value
							})
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 tour-form-status",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: form.status,
						onValueChange: (v) => setForm({
							...form,
							status: v
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "em_andamento",
								children: "Em andamento"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "pausada",
								children: "Pausada"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "concluida",
								children: "Concluída"
							})
						] })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Escopo da Obra" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: form.tipo_escopo,
						onValueChange: (v) => setForm({
							...form,
							tipo_escopo: v
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
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Cliente" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: form.cliente_id || "none",
						onValueChange: (v) => setForm({
							...form,
							cliente_id: v === "none" ? "" : v
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Sem cliente vinculado" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "none",
							children: "Sem cliente vinculado"
						}), clientes.data?.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
							value: c.id,
							children: [
								c.nome,
								" (",
								c.email,
								")"
							]
						}, c.id))] })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Descrição" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						rows: 3,
						value: form.descricao,
						onChange: (e) => setForm({
							...form,
							descricao: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					onClick: onClose,
					children: "Cancelar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "tour-form-save",
					type: "submit",
					disabled: save.isPending,
					children: [save.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), "Salvar"]
				})] })
			]
		})]
	});
}
//#endregion
export { ObrasPage as component };
