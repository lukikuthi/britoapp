import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-8Lt4JWZh.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { d as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { A as Map, C as Pen, G as FileDown, N as LoaderCircle, S as Plus, c as Upload, dt as ChevronDown, f as Trash2, ft as Check, g as ShieldCheck, i as User, j as MapPin, lt as ChevronRight, t as X, tt as ClipboardCheck, ut as ChevronLeft, y as Save, z as Image } from "../_libs/lucide-react.mjs";
import { i as format } from "../_libs/date-fns.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-BGAiVp67.mjs";
import { t as Button } from "./button-B5625LbR.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getImageDimensions, c as useClonePreviousRdo, d as useRdo, f as useRdoTable, h as useUpdateRdoTableItem, i as fitImageInBox, m as useUpdateRdo, n as addPdfBrandedHeader, o as getImageFormatFromDataUrl, r as fetchImageAsBase64, s as useAddRdoTableItem, t as addImageFitted, u as useDeleteRdoTableItem } from "./pdf-image-utils-DqHbO08v.mjs";
import { n as imageCompression } from "../_libs/browser-image-compression.mjs";
import { t as require_jspdf_node_min } from "../_libs/jspdf.mjs";
import { t as Route } from "./obras._obraId.rdos._rdoId-CkWTuRSh.mjs";
import { a as useObraTorres } from "./use-apontamentos-DB2imWYJ.mjs";
import { t as autoTable } from "../_libs/jspdf-autotable.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/obras._obraId.rdos._rdoId-kXwlxRpt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_jspdf_node_min = /* @__PURE__ */ __toESM(require_jspdf_node_min());
function RdoSection({ rdoId, tableName, title, FormComponent, renderRow, columns }) {
	const [isOpen, setIsOpen] = (0, import_react.useState)(false);
	const [isAdding, setIsAdding] = (0, import_react.useState)(false);
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const { data: items = [], isLoading } = useRdoTable(rdoId, tableName);
	const addMut = useAddRdoTableItem();
	const updateMut = useUpdateRdoTableItem();
	const deleteMut = useDeleteRdoTableItem();
	const handleSave = async (payload) => {
		try {
			if (editingId) {
				await updateMut.mutateAsync({
					table: tableName,
					rdoId,
					id: editingId,
					payload
				});
				setEditingId(null);
				toast.success("Atualizado com sucesso");
			} else {
				await addMut.mutateAsync({
					table: tableName,
					rdoId,
					payload
				});
				setIsAdding(false);
				toast.success("Adicionado com sucesso");
			}
		} catch (e) {
			toast.error("Erro: " + e.message);
		}
	};
	const handleDelete = async (id) => {
		if (!confirm("Deseja realmente remover este item?")) return;
		try {
			await deleteMut.mutateAsync({
				table: tableName,
				rdoId,
				id
			});
			toast.success("Removido com sucesso");
		} catch (e) {
			toast.error("Erro: " + e.message);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border rounded-lg bg-card overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: () => setIsOpen(!isOpen),
			className: "w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					isOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold",
						children: title
					}),
					items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium",
						children: items.length
					})
				]
			})
		}), isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "p-4 border-t space-y-4",
			children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-center p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-5 animate-spin" })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-muted/50",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [columns.map((col, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-2 font-medium",
								children: col
							}, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-2 w-20" })] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: items.map((item) => editingId === item.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
							className: "border-b",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: columns.length + 1,
								className: "p-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormComponent, {
									onSave: handleSave,
									onCancel: () => setEditingId(null),
									initialData: item
								})
							})
						}, item.id) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
							className: "border-b group hover:bg-muted/20",
							children: renderRow(item, () => setEditingId(item.id), () => handleDelete(item.id))
						}, item.id)) })]
					})
				}),
				items.length === 0 && !isAdding && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-center p-4 text-muted-foreground text-sm border border-dashed rounded",
					children: "Nenhum registro adicionado."
				}),
				isAdding ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 border rounded-md bg-muted/10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "font-medium text-sm mb-3",
						children: "Novo Registro"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormComponent, {
						onSave: handleSave,
						onCancel: () => setIsAdding(false)
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					onClick: () => setIsAdding(true),
					className: "w-full",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4 mr-2" }), "Adicionar"]
				})
			] })
		})]
	});
}
function MaoObraSection({ rdoId }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RdoSection, {
		rdoId,
		tableName: "rdo_mao_de_obra",
		title: "Mão de Obra",
		columns: [
			"Função",
			"Quantidade",
			"Tipo",
			"Obs"
		],
		FormComponent: ({ onSave, onCancel, initialData }) => {
			const [data, setData] = (0, import_react.useState)(initialData || {
				funcao: "",
				quantidade: 1,
				tipo: "proprio",
				observacao: ""
			});
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "lg:col-span-2",
						placeholder: "Função",
						value: data.funcao,
						onChange: (e) => setData({
							...data,
							funcao: e.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						min: 1,
						placeholder: "Qtd",
						value: data.quantidade,
						onChange: (e) => setData({
							...data,
							quantidade: parseInt(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: data.tipo,
						onValueChange: (v) => setData({
							...data,
							tipo: v
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "proprio",
							children: "Próprio"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "terceirizado",
							children: "Terceirizado"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "lg:col-span-1",
						placeholder: "Empresa (opcional)",
						value: data.empresa || "",
						onChange: (e) => setData({
							...data,
							empresa: e.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							onClick: () => onSave(data),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							onClick: onCancel,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
						})]
					})
				]
			});
		},
		renderRow: (item, onEdit, onDelete) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-2 font-medium",
				children: item.funcao
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-2",
				children: item.quantidade
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
				className: "px-4 py-2 capitalize",
				children: [
					item.tipo,
					" ",
					item.empresa ? `(${item.empresa})` : ""
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-2 text-muted-foreground truncate max-w-[100px]",
				children: item.observacao
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-2 text-right",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "ghost",
						className: "h-8 w-8",
						onClick: onEdit,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "size-3.5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "ghost",
						className: "h-8 w-8 text-destructive",
						onClick: onDelete,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
					})]
				})
			})
		] })
	});
}
function EquipamentosSection({ rdoId }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RdoSection, {
		rdoId,
		tableName: "rdo_equipamentos",
		title: "Equipamentos",
		columns: [
			"Nome",
			"Qtd",
			"Status",
			"Horímetro",
			"Parada/Obs"
		],
		FormComponent: ({ onSave, onCancel, initialData }) => {
			const [data, setData] = (0, import_react.useState)(initialData || {
				nome: "",
				quantidade: 1,
				status: "disponivel",
				observacao: "",
				horimetro_inicial: "",
				horimetro_final: "",
				motivo_parada: ""
			});
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "lg:col-span-2",
							placeholder: "Equipamento",
							value: data.nome,
							onChange: (e) => setData({
								...data,
								nome: e.target.value
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 1,
							placeholder: "Qtd",
							value: data.quantidade,
							onChange: (e) => setData({
								...data,
								quantidade: parseInt(e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: data.status,
							onValueChange: (v) => setData({
								...data,
								status: v
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "disponivel",
									children: "Disponível"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "em_uso",
									children: "Em Uso"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "manutencao",
									children: "Em Manutenção"
								})
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								onClick: () => onSave(data),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								onClick: onCancel,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 sm:grid-cols-3 gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							placeholder: "Horímetro Inicial (Opcional)",
							value: data.horimetro_inicial,
							onChange: (e) => setData({
								...data,
								horimetro_inicial: e.target.value ? parseFloat(e.target.value) : ""
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							placeholder: "Horímetro Final (Opcional)",
							value: data.horimetro_final,
							onChange: (e) => setData({
								...data,
								horimetro_final: e.target.value ? parseFloat(e.target.value) : ""
							})
						}),
						data.status === "manutencao" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Motivo da Parada",
							value: data.motivo_parada || "",
							onChange: (e) => setData({
								...data,
								motivo_parada: e.target.value
							})
						})
					]
				})]
			});
		},
		renderRow: (item, onEdit, onDelete) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-2 font-medium",
				children: item.nome
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-2",
				children: item.quantidade
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-2 capitalize",
				children: item.status.replace("_", " ")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-2 text-muted-foreground",
				children: item.horimetro_inicial || item.horimetro_final ? `${item.horimetro_inicial || "?"} -> ${item.horimetro_final || "?"}` : "-"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-2 text-muted-foreground truncate max-w-[100px]",
				children: item.status === "manutencao" ? item.motivo_parada : item.observacao
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-2 text-right",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-1 opacity-0 group-hover:opacity-100",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "ghost",
						className: "h-8 w-8",
						onClick: onEdit,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "size-3.5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "ghost",
						className: "h-8 w-8 text-destructive",
						onClick: onDelete,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
					})]
				})
			})
		] })
	});
}
function AtividadesSection({ rdoId, obraId }) {
	const { data: eapItems = [] } = useQuery({
		queryKey: ["obra-eap", obraId],
		enabled: !!obraId,
		queryFn: async () => {
			const { data } = await supabase.from("obra_eap").select("id, codigo, descricao").eq("obra_id", obraId);
			return data || [];
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RdoSection, {
		rdoId,
		tableName: "rdo_atividades",
		title: "Atividades e Serviços (Cronograma)",
		columns: [
			"Descrição / EAP",
			"Avanço",
			"Status",
			"Obs"
		],
		FormComponent: ({ onSave, onCancel, initialData }) => {
			const [data, setData] = (0, import_react.useState)(initialData || {
				descricao: "",
				eap_id: "none",
				avanco_informado: 0,
				status: "em_andamento",
				observacao: ""
			});
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: data.eap_id,
						onValueChange: (v) => setData({
							...data,
							eap_id: v
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "lg:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Vincular à EAP (Opcional)" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "none",
							children: "Atividade Avulsa"
						}), eapItems.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
							value: e.id,
							children: [
								e.codigo,
								" - ",
								e.descricao
							]
						}, e.id))] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "lg:col-span-1",
						placeholder: "Descrição Adicional",
						value: data.descricao,
						onChange: (e) => setData({
							...data,
							descricao: e.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						step: "0.01",
						min: 0,
						max: 100,
						placeholder: "Avanço %",
						value: data.avanco_informado,
						onChange: (e) => setData({
							...data,
							avanco_informado: parseFloat(e.target.value) || 0
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: data.status,
						onValueChange: (v) => setData({
							...data,
							status: v
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "nao_iniciada",
								children: "Não Iniciada"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "em_andamento",
								children: "Em Andamento"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "concluida",
								children: "Concluída"
							})
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							onClick: () => {
								const payload = { ...data };
								if (payload.eap_id === "none") payload.eap_id = null;
								onSave(payload);
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							onClick: onCancel,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
						})]
					})
				]
			});
		},
		renderRow: (item, onEdit, onDelete) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
				className: "px-4 py-2 font-medium",
				children: [item.eap_id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mr-2 px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] rounded border border-primary/20",
					children: "EAP"
				}) : null, item.descricao]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
				className: "px-4 py-2 font-bold text-green-700",
				children: [
					"+",
					item.avanco_informado || item.progresso_pct,
					"%"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-2 capitalize",
				children: item.status.replace("_", " ")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-2 text-muted-foreground truncate max-w-[100px]",
				children: item.observacao
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-2 text-right",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-1 opacity-0 group-hover:opacity-100",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "ghost",
						className: "h-8 w-8",
						onClick: onEdit,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "size-3.5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "ghost",
						className: "h-8 w-8 text-destructive",
						onClick: onDelete,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
					})]
				})
			})
		] })
	});
}
function OcorrenciasSection({ rdoId }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RdoSection, {
		rdoId,
		tableName: "rdo_ocorrencias",
		title: "Ocorrências / Anormalidades",
		columns: [
			"Descrição",
			"Gravidade",
			"Impacto Prazo",
			"Obs"
		],
		FormComponent: ({ onSave, onCancel, initialData }) => {
			const [data, setData] = (0, import_react.useState)(initialData || {
				descricao: "",
				gravidade: "baixa",
				resolvido: false,
				impacta_prazo: false
			});
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "lg:col-span-2",
							placeholder: "Descrição da Ocorrência",
							value: data.descricao,
							onChange: (e) => setData({
								...data,
								descricao: e.target.value
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: data.gravidade,
							onValueChange: (v) => setData({
								...data,
								gravidade: v
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "baixa",
									children: "Baixa"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "media",
									children: "Média"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "alta",
									children: "Alta"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "critica",
									children: "Crítica"
								})
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								onClick: () => onSave(data),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								onClick: onCancel,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm text-red-600 font-medium cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: data.impacta_prazo,
							onChange: (e) => setData({
								...data,
								impacta_prazo: e.target.checked
							}),
							className: "size-4 accent-red-600"
						}), "Esta ocorrência impacta o cronograma da obra (Claim)?"]
					})
				})]
			});
		},
		renderRow: (item, onEdit, onDelete) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-2 font-medium",
				children: item.descricao
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-2 capitalize",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("px-2 py-1 rounded-full text-[10px] font-semibold", item.gravidade === "critica" ? "bg-red-100 text-red-700" : item.gravidade === "alta" ? "bg-orange-100 text-orange-700" : item.gravidade === "media" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"),
					children: item.gravidade
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-2 font-medium",
				children: item.impacta_prazo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-red-600",
					children: "Sim"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground",
					children: "Não"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-2 text-right",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-1 opacity-0 group-hover:opacity-100 justify-end",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "ghost",
						className: "h-8 w-8",
						onClick: onEdit,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "size-3.5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "ghost",
						className: "h-8 w-8 text-destructive",
						onClick: onDelete,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
					})]
				})
			})
		] })
	});
}
function ClimaSection({ rdoId }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RdoSection, {
		rdoId,
		tableName: "rdo_clima",
		title: "Condições Climáticas",
		columns: [
			"Período",
			"Condição",
			"Impacto Prazo"
		],
		FormComponent: ({ onSave, onCancel, initialData }) => {
			const [data, setData] = (0, import_react.useState)(initialData || {
				periodo: "manha",
				condicao: "bom",
				praticavel: true,
				impacta_prazo: false
			});
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: data.periodo,
							onValueChange: (v) => setData({
								...data,
								periodo: v
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "manha",
									children: "Manhã"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "tarde",
									children: "Tarde"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "noite",
									children: "Noite"
								})
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: data.condicao,
							onValueChange: (v) => setData({
								...data,
								condicao: v
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "bom",
									children: "Bom"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "nublado",
									children: "Nublado"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "chuva_leve",
									children: "Chuva Leve"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "chuva_forte",
									children: "Chuva Forte"
								})
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								onClick: () => onSave(data),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								onClick: onCancel,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
							})]
						})
					]
				}), data.condicao.includes("chuva") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm font-medium cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							className: "size-4 rounded border-gray-300",
							checked: !data.praticavel,
							onChange: (e) => setData({
								...data,
								praticavel: !e.target.checked
							})
						}), "Condição Impraticável (Sem Condições de Trabalho)"]
					}), !data.praticavel && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm text-red-600 font-medium cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: data.impacta_prazo,
							onChange: (e) => setData({
								...data,
								impacta_prazo: e.target.checked
							}),
							className: "size-4 accent-red-600"
						}), "Impacta Prazo? (Claim)"]
					})]
				})]
			});
		},
		renderRow: (item, onEdit, onDelete) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-2 capitalize font-medium",
				children: item.periodo
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
				className: "px-4 py-2 capitalize flex items-center gap-2",
				children: [item.condicao.replace("_", " "), !item.praticavel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "px-2 py-0.5 bg-red-100 text-red-700 rounded text-[10px] font-bold",
					children: "IMPRATICÁVEL"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-2",
				children: item.impacta_prazo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-red-600 font-bold",
					children: "Sim"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground",
					children: "Não"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-2 text-right",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-1 opacity-0 group-hover:opacity-100 justify-end",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "ghost",
						className: "h-8 w-8",
						onClick: onEdit,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "size-3.5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "ghost",
						className: "h-8 w-8 text-destructive",
						onClick: onDelete,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
					})]
				})
			})
		] })
	});
}
function ComentariosSection({ rdoId }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RdoSection, {
		rdoId,
		tableName: "rdo_comentarios",
		title: "Comentários / Observações",
		columns: ["Comentário"],
		FormComponent: ({ onSave, onCancel, initialData }) => {
			const [data, setData] = (0, import_react.useState)(initialData || { texto: "" });
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "flex-1",
						placeholder: "Escreva o comentário...",
						value: data.texto,
						onChange: (e) => setData({
							...data,
							texto: e.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						onClick: () => onSave(data),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "ghost",
						onClick: onCancel,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
					})
				]
			});
		},
		renderRow: (item, onEdit, onDelete) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
			className: "px-4 py-2",
			colSpan: 4,
			children: item.texto
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
			className: "px-4 py-2 text-right",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-1 opacity-0 group-hover:opacity-100 justify-end",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "icon",
					variant: "ghost",
					className: "h-8 w-8",
					onClick: onEdit,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "size-3.5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "icon",
					variant: "ghost",
					className: "h-8 w-8 text-destructive",
					onClick: onDelete,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
				})]
			})
		})] })
	});
}
function SignatureCanvas({ onSave, onCancel, width = 400, height = 200 }) {
	const canvasRef = (0, import_react.useRef)(null);
	const [isDrawing, setIsDrawing] = (0, import_react.useState)(false);
	const [hasDrawing, setHasDrawing] = (0, import_react.useState)(false);
	const getCtx = (0, import_react.useCallback)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return null;
		const ctx = canvas.getContext("2d");
		if (!ctx) return null;
		return ctx;
	}, []);
	const getPos = (0, import_react.useCallback)((e) => {
		const canvas = canvasRef.current;
		if (!canvas) return {
			x: 0,
			y: 0
		};
		const rect = canvas.getBoundingClientRect();
		const scaleX = canvas.width / rect.width;
		const scaleY = canvas.height / rect.height;
		if ("touches" in e) {
			const touch = e.touches[0] || e.changedTouches[0];
			return {
				x: (touch.clientX - rect.left) * scaleX,
				y: (touch.clientY - rect.top) * scaleY
			};
		}
		return {
			x: (e.clientX - rect.left) * scaleX,
			y: (e.clientY - rect.top) * scaleY
		};
	}, []);
	const startDrawing = (0, import_react.useCallback)((e) => {
		e.preventDefault();
		const ctx = getCtx();
		if (!ctx) return;
		const pos = getPos(e);
		ctx.beginPath();
		ctx.moveTo(pos.x, pos.y);
		setIsDrawing(true);
		setHasDrawing(true);
	}, [getCtx, getPos]);
	const draw = (0, import_react.useCallback)((e) => {
		e.preventDefault();
		if (!isDrawing) return;
		const ctx = getCtx();
		if (!ctx) return;
		const pos = getPos(e);
		ctx.lineTo(pos.x, pos.y);
		ctx.stroke();
	}, [
		isDrawing,
		getCtx,
		getPos
	]);
	const stopDrawing = (0, import_react.useCallback)(() => {
		const ctx = getCtx();
		if (!ctx) return;
		ctx.closePath();
		setIsDrawing(false);
	}, [getCtx]);
	const clear = (0, import_react.useCallback)(() => {
		const canvas = canvasRef.current;
		const ctx = getCtx();
		if (!canvas || !ctx) return;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		setHasDrawing(false);
	}, [getCtx]);
	const handleSave = (0, import_react.useCallback)(() => {
		const canvas = canvasRef.current;
		if (!canvas || !hasDrawing) return;
		onSave(canvas.toDataURL("image/png"));
	}, [hasDrawing, onSave]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border rounded-md overflow-hidden bg-white touch-none",
			style: {
				width: "100%",
				maxWidth: width
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref: canvasRef,
				width,
				height,
				className: "w-full cursor-crosshair",
				style: { touchAction: "none" },
				onMouseDown: startDrawing,
				onMouseMove: draw,
				onMouseUp: stopDrawing,
				onMouseLeave: stopDrawing,
				onTouchStart: startDrawing,
				onTouchMove: draw,
				onTouchEnd: stopDrawing
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					size: "sm",
					variant: "outline",
					onClick: clear,
					children: "Limpar"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					size: "sm",
					variant: "ghost",
					onClick: onCancel,
					children: "Cancelar"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					size: "sm",
					onClick: handleSave,
					disabled: !hasDrawing,
					children: "Salvar assinatura"
				})
			]
		})]
	});
}
function RdoAssinaturaSection({ rdoId }) {
	const queryClient = useQueryClient();
	const [isSigning, setIsSigning] = (0, import_react.useState)(false);
	const { data: assinatura, isLoading } = useQuery({
		queryKey: ["rdo-assinatura", rdoId],
		queryFn: async () => {
			const { data, error } = await supabase.from("rdo_assinatura").select("*").eq("rdo_id", rdoId).limit(1).maybeSingle();
			if (error) throw error;
			return data || null;
		}
	});
	const saveSignature = useMutation({
		mutationFn: async (payload) => {
			const userId = (await supabase.auth.getUser()).data.user?.id;
			const { data: userData } = await supabase.from("usuarios").select("nome").eq("id", userId).single();
			const insertData = {
				rdo_id: rdoId,
				nome_assinante: userData?.nome || "Usuário",
				tipo: "responsavel_tecnico",
				assinatura_png: payload.base64,
				ip_address: payload.geo.ip || "Não coletado",
				user_agent: navigator.userAgent,
				latitude: payload.geo.lat || null,
				longitude: payload.geo.lng || null,
				timestamp_geo: (/* @__PURE__ */ new Date()).toISOString()
			};
			if (assinatura?.id) {
				const { error } = await supabase.from("rdo_assinatura").update(insertData).eq("id", assinatura.id);
				if (error) throw error;
			} else {
				const { error } = await supabase.from("rdo_assinatura").insert(insertData);
				if (error) throw error;
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["rdo-assinatura", rdoId] });
			setIsSigning(false);
			toast.success("Assinatura salva com validade jurídica!");
		},
		onError: (e) => {
			toast.error("Erro ao salvar assinatura: " + e.message);
		}
	});
	const handleSave = async (base64) => {
		toast.info("Capturando metadados de geolocalização...");
		let geo = {
			lat: null,
			lng: null,
			ip: "Local"
		};
		try {
			geo.ip = (await (await fetch("https://api.ipify.org?format=json")).json()).ip;
		} catch (e) {
			console.warn("Could not get IP", e);
		}
		if ("geolocation" in navigator) navigator.geolocation.getCurrentPosition((pos) => {
			geo.lat = pos.coords.latitude;
			geo.lng = pos.coords.longitude;
			saveSignature.mutate({
				base64,
				geo
			});
		}, (err) => {
			console.warn("Geolocalização negada/falhou", err);
			saveSignature.mutate({
				base64,
				geo
			});
		}, {
			enableHighAccuracy: true,
			timeout: 5e3
		});
		else saveSignature.mutate({
			base64,
			geo
		});
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Carregando..." });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-card border rounded-lg overflow-hidden shadow-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-4 py-3 border-b bg-muted/30 flex items-center justify-between",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
				className: "font-semibold flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4 text-primary" }), "Assinatura e Conformidade Legal"]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "p-4",
			children: assinatura ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col md:flex-row gap-6 items-start",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border rounded bg-white p-2 w-full md:w-[400px] flex justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: assinatura.assinatura_png,
						alt: "Assinatura",
						className: "max-h-[150px] object-contain"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 text-sm text-muted-foreground flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-center gap-2 text-foreground font-medium",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-4" }),
								" Assinado por: ",
								assinatura.nome_assinante,
								" (",
								assinatura.tipo === "responsavel_tecnico" ? "Engenheiro/Responsável" : "Cliente/Fiscal",
								")"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Data/Hora Oficial:" }),
							" ",
							assinatura.timestamp_geo ? format(new Date(assinatura.timestamp_geo), "dd/MM/yyyy HH:mm:ss") : "N/A"
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-center gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Geolocalização:" }),
								" ",
								assinatura.latitude && assinatura.longitude ? `${assinatura.latitude}, ${assinatura.longitude}` : "Não fornecida"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "IP:" }),
							" ",
							assinatura.ip_address || "Não rastreado"
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs max-w-md break-all",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Dispositivo:" }),
								" ",
								assinatura.user_agent
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							className: "mt-4",
							onClick: () => setIsSigning(true),
							children: "Refazer Assinatura"
						})
					]
				})]
			}) : isSigning ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignatureCanvas, {
				onSave: handleSave,
				onCancel: () => setIsSigning(false)
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center py-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground mb-4",
					children: "O RDO ainda não foi assinado. A assinatura digital coletará dados de geolocalização e IP para garantir validade jurídica."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => setIsSigning(true),
					children: "Assinar RDO Agora"
				})]
			})
		})]
	});
}
function FvsSection({ rdoId, obraId }) {
	const queryClient = useQueryClient();
	const [selectedTemplate, setSelectedTemplate] = (0, import_react.useState)("");
	const [activeFvsId, setActiveFvsId] = (0, import_react.useState)(null);
	const { data: templates = [] } = useQuery({
		queryKey: ["fvs-templates", obraId],
		queryFn: async () => {
			const { data, error } = await supabase.from("obra_fvs_templates").select("id, nome").eq("obra_id", obraId);
			if (error && error.code !== "PGRST116") throw error;
			return data || [];
		}
	});
	const { data: fvsList = [], isLoading } = useQuery({
		queryKey: ["rdo-fvs", rdoId],
		queryFn: async () => {
			const { data, error } = await supabase.from("rdo_fvs").select(`
          id, status, 
          template:obra_fvs_templates(nome)
        `).eq("rdo_id", rdoId);
			if (error && error.code !== "PGRST116") throw error;
			return data || [];
		}
	});
	const addFvsMut = useMutation({
		mutationFn: async (templateId) => {
			const { data: fvs, error: e1 } = await supabase.from("rdo_fvs").insert({
				rdo_id: rdoId,
				obra_id: obraId,
				template_id: templateId
			}).select("id").single();
			if (e1) throw e1;
			const { data: items, error: e2 } = await supabase.from("obra_fvs_template_itens").select("id").eq("template_id", templateId);
			if (e2) throw e2;
			if (items && items.length > 0) {
				const inserts = items.map((item) => ({
					fvs_id: fvs.id,
					item_id: item.id
				}));
				const { error: e3 } = await supabase.from("rdo_fvs_itens").insert(inserts);
				if (e3) throw e3;
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["rdo-fvs", rdoId] });
			toast.success("FVS adicionada ao RDO.");
			setSelectedTemplate("");
		},
		onError: (e) => toast.error("Erro: " + e.message)
	});
	const handleAdd = () => {
		if (!selectedTemplate) return;
		addFvsMut.mutate(selectedTemplate);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-card border rounded-lg overflow-hidden shadow-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-4 py-3 border-b bg-muted/30 flex items-center justify-between",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "font-semibold flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardCheck, { className: "size-4 text-primary" }), "Qualidade / FVS (Fichas de Verificação)"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-4 space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2 items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: selectedTemplate,
						onValueChange: setSelectedTemplate,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "max-w-md",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Selecione um template de Qualidade..." })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [templates.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: t.id,
							children: t.nome
						}, t.id)), templates.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "none",
							disabled: true,
							children: "Nenhum template cadastrado na obra"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: handleAdd,
						disabled: !selectedTemplate || selectedTemplate === "none" || addFvsMut.isPending,
						children: addFvsMut.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4 mr-2" }), " Adicionar FVS"] })
					})]
				}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-center p-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-6 animate-spin text-muted-foreground" })
				}) : fvsList.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground italic",
					children: "Nenhuma FVS anexada a este RDO."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
					children: fvsList.map((fvs) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border rounded p-3 flex justify-between items-center bg-muted/10 hover:bg-muted/30 transition-colors cursor-pointer",
						onClick: () => setActiveFvsId(fvs.id),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium text-sm",
							children: fvs.template?.nome || "FVS Sem Nome"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: cn("text-xs", fvs.status === "concluido" ? "text-green-600" : "text-amber-600"),
							children: fvs.status === "concluido" ? "Concluída" : "Rascunho / Pendente"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							className: "h-8 w-8 text-destructive",
							onClick: (e) => {
								e.stopPropagation();
								supabase.from("rdo_fvs").delete().eq("id", fvs.id).then(() => {
									queryClient.invalidateQueries({ queryKey: ["rdo-fvs", rdoId] });
								});
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
						})]
					}, fvs.id))
				})]
			}),
			activeFvsId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FvsModal, {
				fvsId: activeFvsId,
				onClose: () => setActiveFvsId(null),
				rdoId
			})
		]
	});
}
function FvsModal({ fvsId, onClose, rdoId }) {
	const queryClient = useQueryClient();
	const { data: itens = [], isLoading } = useQuery({
		queryKey: ["fvs-itens", fvsId],
		queryFn: async () => {
			const { data, error } = await supabase.from("rdo_fvs_itens").select(`
          id, conformidade, observacao,
          template_item:obra_fvs_template_itens(descricao, ordem)
        `).eq("fvs_id", fvsId);
			if (error) throw error;
			return (data || []).sort((a, b) => (a.template_item?.ordem || 0) - (b.template_item?.ordem || 0));
		}
	});
	const updateItemMut = useMutation({
		mutationFn: async ({ id, conformidade, observacao }) => {
			const payload = {};
			if (conformidade !== void 0) payload.conformidade = conformidade;
			if (observacao !== void 0) payload.observacao = observacao;
			const { error } = await supabase.from("rdo_fvs_itens").update(payload).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["fvs-itens", fvsId] });
		}
	});
	const finishMut = useMutation({
		mutationFn: async () => {
			const { error } = await supabase.from("rdo_fvs").update({ status: "concluido" }).eq("id", fvsId);
			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["rdo-fvs", rdoId] });
			toast.success("FVS marcada como Concluída.");
			onClose();
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: true,
		onOpenChange: (o) => !o && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-3xl max-h-[85vh] overflow-y-auto",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Preenchimento da FVS" }) }), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-center p-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-8 animate-spin" })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-md border divide-y",
					children: itens.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white hover:bg-muted/10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-medium flex-1",
							children: item.template_item?.descricao
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: item.conformidade === "C" ? "default" : "outline",
									className: item.conformidade === "C" ? "bg-green-600 hover:bg-green-700 text-white" : "",
									onClick: () => updateItemMut.mutate({
										id: item.id,
										conformidade: "C"
									}),
									children: "C"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: item.conformidade === "NC" ? "destructive" : "outline",
									onClick: () => updateItemMut.mutate({
										id: item.id,
										conformidade: "NC"
									}),
									children: "NC"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: item.conformidade === "NA" ? "secondary" : "outline",
									onClick: () => updateItemMut.mutate({
										id: item.id,
										conformidade: "NA"
									}),
									children: "NA"
								})
							]
						})]
					}, item.id))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-end gap-2 pt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: onClose,
						children: "Fechar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => finishMut.mutate(),
						disabled: finishMut.isPending || itens.some((i) => !i.conformidade),
						children: [finishMut.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin mr-2" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 mr-2" }), "Concluir FVS"]
					})]
				})]
			})]
		})
	});
}
function RdoPlantasSection({ rdoId, obraId }) {
	const [isOpen, setIsOpen] = (0, import_react.useState)(false);
	const { data: torres, isLoading: isLoadingTorres } = useObraTorres(obraId);
	const { data: selecionados = [], isLoading: isLoadingSel } = useRdoTable(rdoId, "rdo_andares_selecionados");
	const addMut = useAddRdoTableItem();
	const deleteMut = useDeleteRdoTableItem();
	const isLoading = isLoadingTorres || isLoadingSel;
	const selecionadosIds = new Set(selecionados.map((s) => s.andar_id));
	const handleToggleAndar = async (andarId) => {
		try {
			const existente = selecionados.find((s) => s.andar_id === andarId);
			if (existente) {
				await deleteMut.mutateAsync({
					table: "rdo_andares_selecionados",
					rdoId,
					id: existente.id
				});
				toast.success("Andar removido do relatório");
			} else {
				await addMut.mutateAsync({
					table: "rdo_andares_selecionados",
					rdoId,
					payload: { andar_id: andarId }
				});
				toast.success("Andar adicionado ao relatório");
			}
		} catch (e) {
			toast.error("Erro: " + e.message);
		}
	};
	const handleToggleTorre = async (torreId) => {
		const torre = torres?.find((t) => t.id === torreId);
		if (!torre) return;
		const andaresDaTorre = torre.andares.map((a) => a.id);
		const andaresNaoSelecionados = andaresDaTorre.filter((id) => !selecionadosIds.has(id));
		try {
			if (andaresNaoSelecionados.length > 0) {
				for (const andarId of andaresNaoSelecionados) await addMut.mutateAsync({
					table: "rdo_andares_selecionados",
					rdoId,
					payload: { andar_id: andarId }
				});
				toast.success("Torre inteira adicionada ao relatório");
			} else {
				for (const andarId of andaresDaTorre) {
					const existente = selecionados.find((s) => s.andar_id === andarId);
					if (existente) await deleteMut.mutateAsync({
						table: "rdo_andares_selecionados",
						rdoId,
						id: existente.id
					});
				}
				toast.success("Torre inteira removida do relatório");
			}
		} catch (e) {
			toast.error("Erro: " + e.message);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border rounded-lg bg-card overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: () => setIsOpen(!isOpen),
			className: "w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					isOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Map, { className: "size-4 text-primary" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold",
						children: "Plantas e Apontamentos"
					}),
					selecionados.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium",
						children: [selecionados.length, " anexados"]
					})
				]
			})
		}), isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "p-4 border-t",
			children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-center p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-5 animate-spin" })
			}) : !torres || torres.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-center p-4 text-muted-foreground text-sm border border-dashed rounded",
				children: "Nenhuma torre configurada nesta obra."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Selecione os andares que você deseja anexar ao RDO. A planta baixa do andar escolhido será gerada no PDF incluindo os apontamentos atuais."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 gap-4",
					children: torres.map((torre) => {
						const todosSelecionados = torre.andares.length > 0 && torre.andares.every((a) => selecionadosIds.has(a.id));
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border rounded-lg overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-muted/50 p-2 flex items-center justify-between border-b",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-sm px-2",
									children: torre.nome
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "sm",
									className: "h-7 text-xs",
									onClick: () => handleToggleTorre(torre.id),
									disabled: torre.andares.length === 0,
									children: todosSelecionados ? "Desmarcar Toda" : "Selecionar Toda"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-2 space-y-1 max-h-[300px] overflow-y-auto",
								children: [torre.andares.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground text-center p-2",
									children: "Sem andares"
								}), torre.andares.map((andar) => {
									const isSelected = selecionadosIds.has(andar.id);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => handleToggleAndar(andar.id),
										className: cn("w-full flex items-center justify-between p-2 rounded text-sm transition-colors", isSelected ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: andar.apelido || `Andar ${andar.numero_andar}` }), isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" })]
									}, andar.id);
								})]
							})]
						}, torre.id);
					})
				})]
			})
		})]
	});
}
function RdoFotografiasSection({ rdoId, obraId }) {
	const [isOpen, setIsOpen] = (0, import_react.useState)(false);
	const [isGalleryOpen, setIsGalleryOpen] = (0, import_react.useState)(false);
	const [galleryItems, setGalleryItems] = (0, import_react.useState)([]);
	const [loadingGallery, setLoadingGallery] = (0, import_react.useState)(false);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const { data: midias = [], isLoading } = useRdoTable(rdoId, "rdo_midias");
	const addMut = useAddRdoTableItem();
	const deleteMut = useDeleteRdoTableItem();
	const fileInputRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (isGalleryOpen) {
			setLoadingGallery(true);
			supabase.from("obra_fotografia_itens").select("*").eq("obra_id", obraId).order("ordem", { ascending: true }).then(({ data, error }) => {
				if (!error && data) setGalleryItems(data);
				setLoadingGallery(false);
			});
		}
	}, [isGalleryOpen, obraId]);
	const handleFileUpload = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		try {
			setUploading(true);
			toast.info("Comprimindo imagem...");
			const compressed = await imageCompression(file, {
				maxSizeMB: 1,
				maxWidthOrHeight: 1600
			});
			const fileName = `${obraId}/${rdoId}/${crypto.randomUUID()}.jpg`;
			toast.info("Fazendo upload...");
			const { error: uploadError } = await supabase.storage.from("rdo-midias").upload(fileName, compressed, { contentType: "image/jpeg" });
			if (uploadError) throw uploadError;
			await addMut.mutateAsync({
				table: "rdo_midias",
				rdoId,
				payload: {
					storage_path: fileName,
					tipo: "imagem"
				}
			});
			toast.success("Foto adicionada!");
		} catch (err) {
			toast.error("Erro no upload: " + err.message);
		} finally {
			setUploading(false);
			if (fileInputRef.current) fileInputRef.current.value = "";
		}
	};
	const handleSelectFromGallery = async (storagePath) => {
		try {
			if (midias.some((m) => m.storage_path === storagePath)) {
				toast.info("Essa foto já foi adicionada ao RDO.");
				return;
			}
			await addMut.mutateAsync({
				table: "rdo_midias",
				rdoId,
				payload: {
					storage_path: storagePath,
					tipo: "imagem"
				}
			});
			toast.success("Foto anexada do mural!");
			setIsGalleryOpen(false);
		} catch (e) {
			toast.error("Erro: " + e.message);
		}
	};
	const handleDelete = async (id, storagePath) => {
		if (!confirm("Deseja remover esta foto do RDO?")) return;
		try {
			await deleteMut.mutateAsync({
				table: "rdo_midias",
				rdoId,
				id
			});
			if (storagePath.includes(`/${rdoId}/`)) await supabase.storage.from("rdo-midias").remove([storagePath]);
			toast.success("Foto removida do RDO");
		} catch (e) {
			toast.error("Erro ao remover: " + e.message);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border rounded-lg bg-card overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setIsOpen(!isOpen),
				className: "w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						isOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "size-4 text-primary" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold",
							children: "Fotografias"
						}),
						midias.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium",
							children: midias.length
						})
					]
				})
			}),
			isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-4 border-t space-y-4",
				children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-center p-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-5 animate-spin" })
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [midias.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4",
					children: midias.map((midia) => {
						const { data } = supabase.storage.from("rdo-midias").getPublicUrl(midia.storage_path);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative group rounded-md overflow-hidden border aspect-square",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: data.publicUrl,
								alt: "Midia RDO",
								className: "w-full h-full object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									variant: "destructive",
									onClick: () => handleDelete(midia.id, midia.storage_path),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
								})
							})]
						}, midia.id);
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-center p-4 text-muted-foreground text-sm border border-dashed rounded",
					children: "Nenhuma fotografia adicionada a este relatório."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row gap-2 pt-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							accept: "image/*",
							className: "hidden",
							ref: fileInputRef,
							onChange: handleFileUpload,
							disabled: uploading
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: () => fileInputRef.current?.click(),
							disabled: uploading,
							className: "flex-1",
							children: [uploading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 mr-2 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4 mr-2" }), "Enviar do Dispositivo"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: () => setIsGalleryOpen(true),
							className: "flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "size-4 mr-2" }), "Escolher da Galeria da Obra"]
						})
					]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isGalleryOpen,
				onOpenChange: setIsGalleryOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-3xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Mural de Fotografias da Obra" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "max-h-[60vh] overflow-y-auto pr-2",
						children: loadingGallery ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-center p-8",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-6 animate-spin" })
						}) : galleryItems.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 sm:grid-cols-3 gap-4",
							children: galleryItems.map((item) => {
								const { data } = supabase.storage.from("rdo-midias").getPublicUrl(item.storage_path);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "group relative cursor-pointer border rounded-md overflow-hidden aspect-square hover:ring-2 hover:ring-primary transition-all",
									onClick: () => handleSelectFromGallery(item.storage_path),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: data.publicUrl,
											alt: item.titulo,
											className: "w-full h-full object-cover"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-white text-xs truncate",
											children: item.titulo
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-8 text-white drop-shadow-md" })
										})
									]
								}, item.id);
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-center p-8 text-muted-foreground",
							children: "Não há fotos na galeria desta obra."
						})
					})]
				})
			})
		]
	});
}
async function generateRdoPdf(rdo, sections, obraId) {
	const doc = new import_jspdf_node_min.default("p", "mm", "a4");
	const pageWidth = doc.internal.pageSize.width;
	const { data: obra } = await supabase.from("obras").select("nome, endereco").eq("id", obraId).single();
	const obraNome = obra?.nome || "Obra Não Encontrada";
	doc.setFillColor(41, 128, 185);
	doc.rect(0, 0, pageWidth, 25, "F");
	doc.setTextColor(255, 255, 255);
	doc.setFontSize(16);
	doc.text("Relatório Diário de Obra", 15, 16);
	doc.setFontSize(10);
	doc.text(`RDO #${rdo.numero_sequencial}`, pageWidth - 15, 16, { align: "right" });
	doc.setTextColor(0, 0, 0);
	doc.setFontSize(11);
	doc.text(`Data: ${format(new Date(rdo.data), "dd/MM/yyyy")}`, 15, 35);
	doc.text(`Status: ${rdo.status.toUpperCase()}`, 15, 42);
	if (sections.clima && sections.clima.length > 0) {
		doc.setFontSize(12);
		doc.text("Condições Climáticas", 15, currentY);
		autoTable(doc, {
			startY: currentY + 5,
			head: [[
				"Período",
				"Condição",
				"Praticável",
				"Impacta Prazo?"
			]],
			body: sections.clima.map((item) => [
				item.periodo.toUpperCase(),
				item.condicao.toUpperCase(),
				item.praticavel ? "Sim" : "Não",
				item.impacta_prazo ? "SIM" : "Não"
			]),
			theme: "grid",
			headStyles: { fillColor: [
				41,
				128,
				185
			] },
			didParseCell: function(data) {
				if (data.section === "body" && data.column.index === 3 && data.cell.raw === "SIM") {
					data.cell.styles.textColor = [
						220,
						53,
						53
					];
					data.cell.styles.fontStyle = "bold";
				}
			}
		});
		currentY = doc.lastAutoTable.finalY + 15;
	}
	if (sections.maoObra && sections.maoObra.length > 0) {
		doc.setFontSize(12);
		doc.text("Mão de Obra", 15, currentY);
		autoTable(doc, {
			startY: currentY + 5,
			head: [[
				"Função",
				"Quantidade",
				"Tipo",
				"Observação"
			]],
			body: sections.maoObra.map((item) => [
				item.funcao,
				item.quantidade.toString(),
				item.tipo,
				item.observacao || ""
			]),
			theme: "grid",
			headStyles: { fillColor: [
				41,
				128,
				185
			] }
		});
		currentY = doc.lastAutoTable.finalY + 15;
	}
	if (sections.equipamentos && sections.equipamentos.length > 0) {
		doc.setFontSize(12);
		doc.text("Equipamentos", 15, currentY);
		autoTable(doc, {
			startY: currentY + 5,
			head: [[
				"Equipamento",
				"Qtd",
				"Status",
				"Horímetro",
				"Motivo Parada",
				"Obs"
			]],
			body: sections.equipamentos.map((item) => [
				item.nome,
				item.quantidade.toString(),
				item.status,
				item.horimetro || "-",
				item.motivo_parada || "-",
				item.observacao || ""
			]),
			theme: "grid",
			headStyles: { fillColor: [
				41,
				128,
				185
			] }
		});
		currentY = doc.lastAutoTable.finalY + 15;
	}
	if (sections.atividades && sections.atividades.length > 0) {
		doc.setFontSize(12);
		doc.text("Atividades (Avanço Físico - EAP)", 15, currentY);
		autoTable(doc, {
			startY: currentY + 5,
			head: [[
				"Descrição",
				"Progresso",
				"Status",
				"Observação"
			]],
			body: sections.atividades.map((item) => [
				item.descricao,
				`${item.progresso_pct}%`,
				item.status,
				item.observacao || ""
			]),
			theme: "grid",
			headStyles: { fillColor: [
				41,
				128,
				185
			] }
		});
		currentY = doc.lastAutoTable.finalY + 15;
	}
	if (sections.ocorrencias && sections.ocorrencias.length > 0) {
		doc.setFontSize(12);
		doc.text("Ocorrências e Interferências", 15, currentY);
		autoTable(doc, {
			startY: currentY + 5,
			head: [[
				"Descrição",
				"Gravidade",
				"Resolvido?",
				"Impacta Prazo?"
			]],
			body: sections.ocorrencias.map((item) => [
				item.descricao,
				item.gravidade.toUpperCase(),
				item.resolvido ? "Sim" : "Não",
				item.impacta_prazo ? "SIM (CRÍTICO)" : "Não"
			]),
			theme: "grid",
			headStyles: { fillColor: [
				220,
				53,
				53
			] },
			didParseCell: function(data) {
				if (data.section === "body" && data.column.index === 3 && data.cell.raw === "SIM (CRÍTICO)") {
					data.cell.styles.textColor = [
						220,
						53,
						53
					];
					data.cell.styles.fontStyle = "bold";
				}
			}
		});
		currentY = doc.lastAutoTable.finalY + 15;
	}
	if (sections.fvs && sections.fvs.length > 0) {
		doc.setFontSize(12);
		doc.text("Checklists de Qualidade (FVS)", 15, currentY);
		autoTable(doc, {
			startY: currentY + 5,
			head: [["Ficha de Verificação", "Status"]],
			body: sections.fvs.map((item) => [item.template?.nome || "FVS", item.status === "concluido" ? "Concluída" : "Rascunho"]),
			theme: "grid",
			headStyles: { fillColor: [
				41,
				128,
				185
			] }
		});
		currentY = doc.lastAutoTable.finalY + 15;
	}
	if (sections.midias && sections.midias.length > 0) {
		const photoBoxW = 182;
		const photoBoxH = 120;
		let photosCount = 0;
		for (const midia of sections.midias) {
			if (midia.tipo !== "imagem") continue;
			doc.addPage("a4", "p");
			photosCount++;
			await addPdfBrandedHeader(doc, "Registro fotográfico do RDO");
			doc.setFontSize(11);
			doc.setFont("helvetica", "bold");
			doc.text(obraNome, 14, 35);
			doc.setFont("helvetica", "normal");
			doc.setFontSize(9);
			doc.text(`RDO #${rdo.numero_sequencial} — ${format(new Date(rdo.data), "dd/MM/yyyy")}`, 14, 41);
			doc.setFont("helvetica", "bold");
			doc.setFontSize(12);
			doc.text(midia.legenda || `Foto ${photosCount}`, 14, 58);
			let y = 64;
			try {
				const { data: urlData } = supabase.storage.from("rdo-midias").getPublicUrl(midia.storage_path);
				await addImageFitted(doc, await fetchImageAsBase64(urlData.publicUrl), 14, y, photoBoxW, photoBoxH);
			} catch {
				doc.setFont("helvetica", "italic");
				doc.setFontSize(9);
				doc.text("[Imagem não disponível]", 14, y);
			}
		}
	}
	if (sections.andaresSelecionados && sections.andaresSelecionados.length > 0) {
		const andarIds = sections.andaresSelecionados.map((s) => s.andar_id);
		const { data: andaresData } = await supabase.from("torre_andares").select(`
        id, numero_andar, apelido,
        obra_torres!inner ( nome ),
        torre_grupos_andar!inner ( planta_storage_path )
      `).in("id", andarIds);
		if (andaresData && andaresData.length > 0) {
			const { data: apontamentosData } = await supabase.from("apontamentos").select("*").in("andar_id", andarIds);
			const PAGE_W = 297;
			const PAGE_H = 210;
			const MARGIN = 14;
			const IMAGE_AREA_W = (PAGE_W - MARGIN * 2 - 8) * .6;
			const LEGEND_X = 178.6;
			for (const andar of andaresData) {
				doc.addPage("a4", "landscape");
				doc.setFillColor(0, 43, 91);
				doc.rect(0, 0, PAGE_W, 25, "F");
				doc.setTextColor(255, 255, 255);
				doc.setFontSize(16);
				doc.setFont("helvetica", "bold");
				doc.text("BRITO ENGENHARIA", MARGIN, 12);
				doc.setFontSize(10);
				doc.setFont("helvetica", "normal");
				doc.text("Apontamentos Visuais — Anexo RDO", MARGIN, 20);
				doc.setTextColor(0, 0, 0);
				doc.setFontSize(11);
				doc.setFont("helvetica", "bold");
				doc.text(obraNome, MARGIN, 32);
				const floorLabel = andar.apelido || `Andar ${andar.numero_andar}`;
				const torreNome = andar.obra_torres?.nome || "Torre";
				doc.setFontSize(10);
				doc.text(`${torreNome} — ${floorLabel}`, MARGIN, 40);
				const plantaPath = andar.torre_grupos_andar?.planta_storage_path;
				let imgX = MARGIN;
				let imgY = 44;
				let imgW = IMAGE_AREA_W;
				let imgH = PAGE_H - 10 - imgY;
				let imgDrawn = false;
				if (plantaPath) try {
					const { data: urlData } = await supabase.storage.from("plantas-baixa").createSignedUrl(plantaPath, 60);
					if (urlData?.signedUrl) {
						const imgData = await fetchImageAsBase64(urlData.signedUrl);
						const dims = await getImageDimensions(imgData);
						const fit = fitImageInBox(dims.width, dims.height, IMAGE_AREA_W, imgH);
						const fmt = getImageFormatFromDataUrl(imgData);
						imgX = MARGIN + fit.offsetX;
						imgY = 44 + fit.offsetY;
						imgW = fit.width;
						imgH = fit.height;
						doc.addImage(imgData, fmt, imgX, imgY, imgW, imgH);
						imgDrawn = true;
						doc.setDrawColor(200, 200, 200);
						doc.setLineWidth(.3);
						doc.rect(imgX, imgY, imgW, imgH, "S");
					}
				} catch (err) {
					doc.setFont("helvetica", "italic");
					doc.setFontSize(9);
					doc.text("[Erro ao carregar planta]", 18, 50);
				}
				else {
					doc.setFont("helvetica", "italic");
					doc.setFontSize(9);
					doc.text("[Sem planta cadastrada]", 18, 50);
				}
				const aptsAndar = (apontamentosData || []).filter((a) => a.andar_id === andar.id);
				if (imgDrawn) aptsAndar.forEach((ap, idx) => {
					const num = idx + 1;
					const mx = imgX + ap.pos_x * imgW;
					const my = imgY + ap.pos_y * imgH;
					if (ap.status === "resolvido") doc.setFillColor(34, 139, 34);
					else doc.setFillColor(220, 53, 53);
					doc.circle(mx, my, 3.5, "F");
					doc.setDrawColor(255, 255, 255);
					doc.setLineWidth(.5);
					doc.circle(mx, my, 3.5, "S");
					doc.setTextColor(255, 255, 255);
					doc.setFontSize(7);
					doc.setFont("helvetica", "bold");
					doc.text(String(num), mx, my + 1.2, { align: "center" });
					doc.setTextColor(0, 0, 0);
				});
				doc.setFontSize(9);
				doc.setFont("helvetica", "bold");
				doc.text("Legenda", LEGEND_X, 44);
				doc.setFontSize(7);
				doc.setFont("helvetica", "normal");
				doc.setFillColor(220, 53, 53);
				doc.circle(180.6, 49, 2, "F");
				doc.text("Aberto", 184.6, 50);
				doc.setFillColor(34, 139, 34);
				doc.circle(206.6, 49, 2, "F");
				doc.text("Resolvido", 210.6, 50);
				doc.setDrawColor(200, 200, 200);
				doc.line(LEGEND_X, 53, PAGE_W - MARGIN, 53);
				let legY = 58;
				aptsAndar.forEach((ap, idx) => {
					if (legY > PAGE_H - 15) return;
					const num = idx + 1;
					if (ap.status === "resolvido") doc.setFillColor(34, 139, 34);
					else doc.setFillColor(220, 53, 53);
					doc.circle(180.6, legY - 1, 2.5, "F");
					doc.setTextColor(255, 255, 255);
					doc.setFontSize(6);
					doc.setFont("helvetica", "bold");
					doc.text(String(num), 180.6, legY - .2, { align: "center" });
					doc.setTextColor(0, 0, 0);
					doc.setFontSize(8);
					doc.setFont("helvetica", "normal");
					const maxW = PAGE_W - MARGIN - LEGEND_X - 8;
					const textLines = doc.splitTextToSize(ap.descricao, maxW);
					doc.text(textLines, 184.6, legY);
					legY += 2 + textLines.length * 3.5;
				});
			}
		}
	}
	return doc.output("blob");
}
function RdoEditorPage() {
	const { obraId, rdoId } = Route.useParams();
	const navigate = useNavigate();
	useQueryClient();
	const { data: rdo, isLoading } = useRdo(rdoId);
	const updateMut = useUpdateRdo();
	const cloneMut = useClonePreviousRdo();
	const handleClone = async () => {
		if (!rdo) return;
		if (!confirm("Isso irá importar Mão de Obra e Equipamentos do último RDO. Deseja continuar?")) return;
		try {
			await cloneMut.mutateAsync({
				obraId,
				currentRdoId: rdoId,
				currentDate: rdo.data
			});
			toast.success("Dados copiados com sucesso!");
		} catch (e) {
			toast.error(e.message);
		}
	};
	const handleApprove = async () => {
		if (!confirm("Tem certeza que deseja aprovar este RDO? Ele não poderá ser editado depois.")) return;
		try {
			await updateMut.mutateAsync({
				id: rdoId,
				status: "aprovado"
			});
			toast.success("RDO aprovado com sucesso!");
		} catch (e) {
			toast.error(e.message);
		}
	};
	const handleExportPdf = async () => {
		if (!rdo) return;
		try {
			toast.info("Gerando PDF, aguarde...");
			const fetchTable = async (table) => {
				const { data } = await supabase.from(table).select("*").eq("rdo_id", rdoId);
				return data || [];
			};
			const maoObra = await fetchTable("rdo_mao_de_obra");
			const equipamentos = await fetchTable("rdo_equipamentos");
			const atividades = await fetchTable("rdo_atividades");
			const ocorrencias = await fetchTable("rdo_ocorrencias");
			const clima = await fetchTable("rdo_clima");
			const midias = await fetchTable("rdo_midias");
			const andaresSelecionados = await fetchTable("rdo_andares_selecionados");
			const { data: fvsData } = await supabase.from("rdo_fvs").select("id, status, template:obra_fvs_templates(nome)").eq("rdo_id", rdoId);
			const { data: fotosDoDia } = await supabase.from("obra_fotografia_itens").select("*").eq("obra_id", obraId).gte("created_at", `${rdo.data}T00:00:00Z`).lte("created_at", `${rdo.data}T23:59:59Z`);
			const combinedMidias = [...midias || []];
			if (fotosDoDia && fotosDoDia.length > 0) fotosDoDia.forEach((f) => {
				combinedMidias.push({
					tipo: "imagem",
					storage_path: f.storage_path,
					legenda: f.titulo + (f.descricao ? ` - ${f.descricao}` : "")
				});
			});
			const pdfBlob = await generateRdoPdf(rdo, {
				maoObra,
				equipamentos,
				atividades,
				ocorrencias,
				clima,
				fvs: fvsData,
				midias: combinedMidias,
				andaresSelecionados
			}, obraId);
			const fileName = `RDO-${rdo.numero_sequencial}-${rdo.data}.pdf`;
			if (navigator.share && navigator.canShare) {
				const file = new File([pdfBlob], fileName, { type: "application/pdf" });
				if (navigator.canShare({ files: [file] })) try {
					await navigator.share({
						title: `RDO ${rdo.numero_sequencial}`,
						text: `Segue o Relatório Diário de Obra (RDO) do dia ${new Date(rdo.data).toLocaleDateString("pt-BR")}.`,
						files: [file]
					});
					return;
				} catch (shareErr) {
					if (shareErr.name !== "AbortError") toast.error("Erro no compartilhamento nativo, baixando arquivo...");
					else return;
				}
			}
			const url = URL.createObjectURL(pdfBlob);
			const a = document.createElement("a");
			a.href = url;
			a.download = fileName;
			document.body.appendChild(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(url);
		} catch (e) {
			toast.error("Erro ao gerar PDF: " + e.message);
		}
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-8 flex justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-6 animate-spin" })
	});
	if (!rdo) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-8 text-center text-muted-foreground",
		children: "RDO não encontrado."
	});
	const isAprovado = rdo.status === "aprovado";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col h-full bg-muted/10 min-h-[100dvh] pb-20",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "sticky top-0 z-30 bg-card border-b px-4 py-3 shadow-sm flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					onClick: () => navigate({
						to: "/obras/$obraId",
						params: { obraId },
						search: { tab: "rdo" }
					}),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "font-semibold text-sm flex items-center gap-2",
					children: [
						"RDO #",
						rdo.numero_sequencial,
						rdo.tipo === "semanal" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "secondary",
							className: "bg-primary/10 text-primary scale-90",
							children: "SEMANAL"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: new Date(rdo.data).toLocaleDateString("pt-BR")
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [rdo.status !== "aprovado" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "outline",
					onClick: handleClone,
					disabled: cloneMut.isPending,
					children: cloneMut.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : "Copiar do Anterior"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "default",
					onClick: handleApprove,
					disabled: updateMut.isPending,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "size-4 mr-2" }), "Aprovar"]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "outline",
					onClick: handleExportPdf,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "size-4 mr-2" }), "PDF"]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "p-4 max-w-4xl mx-auto w-full space-y-4",
			children: [
				isAprovado && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bg-success/10 text-success border border-success/20 p-3 rounded-lg text-sm flex items-center gap-2",
					children: "Este RDO está aprovado e não pode mais ser editado."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClimaSection, { rdoId }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MaoObraSection, { rdoId }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EquipamentosSection, { rdoId }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AtividadesSection, { rdoId }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OcorrenciasSection, { rdoId }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RdoPlantasSection, {
					rdoId,
					obraId
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RdoFotografiasSection, {
					rdoId,
					obraId
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FvsSection, {
					rdoId,
					obraId
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComentariosSection, { rdoId }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RdoAssinaturaSection, { rdoId })
			]
		})]
	});
}
//#endregion
export { RdoEditorPage as component };
