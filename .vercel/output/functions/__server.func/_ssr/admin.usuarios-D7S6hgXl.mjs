import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-8Lt4JWZh.mjs";
import { d as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as CardHeader, n as CardContent, o as CardTitle, t as Card } from "./card-NkTA-G4u.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { L as KeyRound, N as LoaderCircle, S as Plus, a as UserX, s as UserCheck } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, s as DialogTrigger, t as Dialog } from "./dialog-BGAiVp67.mjs";
import { t as Button } from "./button-B5625LbR.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.usuarios-D7S6hgXl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function UsuariosPage() {
	const qc = useQueryClient();
	const [open, setOpen] = (0, import_react.useState)(false);
	const usuarios = useQuery({
		queryKey: ["usuarios-admin"],
		queryFn: async () => {
			const { data: profs, error } = await supabase.from("profiles").select("id, nome, email, telefone, ativo").order("nome");
			if (error) throw error;
			const { data: roles } = await supabase.from("user_roles").select("user_id, role");
			const map = new Map(roles?.map((r) => [r.user_id, r.role]));
			return (profs ?? []).map((p) => ({
				...p,
				role: map.get(p.id) ?? null
			}));
		}
	});
	const toggleAtivo = useMutation({
		mutationFn: async ({ id, ativo }) => {
			const { error } = await supabase.from("profiles").update({ ativo }).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["usuarios-admin"] }),
		onError: (e) => toast.error(e.message)
	});
	const changeRole = useMutation({
		mutationFn: async ({ id, role }) => {
			await supabase.from("user_roles").delete().eq("user_id", id);
			const { error } = await supabase.from("user_roles").insert({
				user_id: id,
				role
			});
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Papel atualizado.");
			qc.invalidateQueries({ queryKey: ["usuarios-admin"] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-4 sm:p-6 max-w-5xl mx-auto space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-3 flex-wrap",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl sm:text-3xl font-bold tracking-tight",
				children: "Usuários"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground mt-1",
				children: "Cadastre administradores, equipes de campo e clientes."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Novo usuário"] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NovoUsuarioDialog, { onClose: () => setOpen(false) })]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
			className: "pb-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: "Cadastrados"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: usuarios.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-5 animate-spin mx-auto" }) : !usuarios.data?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Nenhum usuário."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "divide-y",
			children: usuarios.data.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-3 flex flex-wrap items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-[200px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-medium text-sm flex items-center gap-2",
							children: [u.nome, !u.ativo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: "text-xs",
								children: "inativo"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: [
								u.email,
								" ",
								u.telefone && `· ${u.telefone}`
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: u.role ?? "",
						onValueChange: (v) => changeRole.mutate({
							id: u.id,
							role: v
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-32",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Papel" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "admin",
								children: "Admin"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "campo",
								children: "Campo"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "cliente",
								children: "Cliente"
							})
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						onClick: () => toggleAtivo.mutate({
							id: u.id,
							ativo: !u.ativo
						}),
						children: u.ativo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserX, { className: "size-4" }), " Desativar"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "size-4" }), " Ativar"] })
					})
				]
			}, u.id))
		}) })] })]
	});
}
function NovoUsuarioDialog({ onClose }) {
	const qc = useQueryClient();
	const [form, setForm] = (0, import_react.useState)({
		nome: "",
		email: "",
		senha: "",
		telefone: "",
		role: "campo"
	});
	const criar = useMutation({
		mutationFn: async () => {
			const { data: adminSess } = await supabase.auth.getSession();
			const { data, error } = await supabase.auth.signUp({
				email: form.email,
				password: form.senha,
				options: {
					data: {
						nome: form.nome,
						role: form.role
					},
					emailRedirectTo: window.location.origin
				}
			});
			if (error) throw error;
			const newId = data.user?.id;
			if (adminSess.session) await supabase.auth.setSession({
				access_token: adminSess.session.access_token,
				refresh_token: adminSess.session.refresh_token
			});
			if (newId) {
				await supabase.from("profiles").update({
					telefone: form.telefone || null,
					nome: form.nome
				}).eq("id", newId);
				await supabase.from("user_roles").delete().eq("user_id", newId);
				await supabase.from("user_roles").insert({
					user_id: newId,
					role: form.role
				});
			}
		},
		onSuccess: () => {
			toast.success("Usuário criado.");
			qc.invalidateQueries({ queryKey: ["usuarios-admin"] });
			onClose();
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Novo usuário" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: (e) => {
			e.preventDefault();
			criar.mutate();
		},
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
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
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "E-mail *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					required: true,
					type: "email",
					value: form.email,
					onChange: (e) => setForm({
						...form,
						email: e.target.value
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Senha inicial *" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						required: true,
						type: "text",
						minLength: 8,
						value: form.senha,
						onChange: (e) => setForm({
							...form,
							senha: e.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "size-3" }), "Compartilhe com o usuário — ele pode trocar depois."]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Telefone" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: form.telefone,
					onChange: (e) => setForm({
						...form,
						telefone: e.target.value
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Papel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: form.role,
					onValueChange: (v) => setForm({
						...form,
						role: v
					}),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "admin",
							children: "Admin — gerencia tudo"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "campo",
							children: "Campo — preenche RDOs"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "cliente",
							children: "Cliente — só visualiza"
						})
					] })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "ghost",
				onClick: onClose,
				children: "Cancelar"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "submit",
				disabled: criar.isPending,
				children: [criar.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), "Criar"]
			})] })
		]
	})] });
}
//#endregion
export { UsuariosPage as component };
