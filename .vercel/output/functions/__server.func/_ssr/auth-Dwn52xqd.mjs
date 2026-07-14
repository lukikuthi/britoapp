import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-8Lt4JWZh.mjs";
import { d as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as CardHeader, n as CardContent, o as CardTitle, r as CardDescription, t as Card } from "./card-NkTA-G4u.mjs";
import { N as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-B5625LbR.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as BritoLogo } from "./brito-logo-DZQcPPvx.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-Dwn52xqd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthPage() {
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("");
	const [senha, setSenha] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let active = true;
		supabase.auth.getSession().then(({ data }) => {
			if (active && data.session) navigate({
				to: "/dashboard",
				replace: true
			});
		});
		return () => {
			active = false;
		};
	}, [navigate]);
	async function handleLogin(e) {
		e.preventDefault();
		setLoading(true);
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password: senha
		});
		setLoading(false);
		if (error) {
			toast.error(error.message === "Invalid login credentials" ? "E-mail ou senha incorretos." : error.message);
			return;
		}
		toast.success("Bem-vindo!");
		navigate({
			to: "/dashboard",
			replace: true
		});
	}
	async function handleResetPassword() {
		if (!email) {
			toast.error("Digite seu e-mail primeiro para redefinir a senha.");
			return;
		}
		setLoading(true);
		const { error } = await supabase.auth.resetPasswordForEmail(email);
		setLoading(false);
		if (error) toast.error(error.message);
		else toast.success("E-mail de redefinição enviado! Verifique sua caixa de entrada e spam.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen flex flex-col bg-secondary",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "p-6 pb-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BritoLogo, { size: "xl" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 flex items-center justify-center px-4 pb-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "w-full max-w-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-2xl",
						children: "Entrar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Acesso restrito. Use o e-mail e senha fornecidos pelo administrador." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleLogin,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "email",
									children: "E-mail"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "email",
									type: "email",
									autoComplete: "email",
									required: true,
									value: email,
									onChange: (e) => setEmail(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "senha",
										children: "Senha"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: handleResetPassword,
										className: "text-xs text-primary hover:underline font-medium",
										disabled: loading,
										children: "Esqueceu a senha?"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "senha",
									type: "password",
									autoComplete: "current-password",
									required: true,
									value: senha,
									onChange: (e) => setSenha(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "submit",
								className: "w-full",
								disabled: loading,
								children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), "Entrar"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground text-center",
								children: "Não tem cadastro? Solicite ao administrador da sua obra."
							})
						]
					}) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "text-center text-xs text-sidebar-foreground/60 pb-6",
				suppressHydrationWarning: true,
				children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" BRITO ENGENHARIA · PROJETO MATRIZ · Desenvolvido por Lucas Kikuthi"
				]
			})
		]
	});
}
//#endregion
export { AuthPage as component };
