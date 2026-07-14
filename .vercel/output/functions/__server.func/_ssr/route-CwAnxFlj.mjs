import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-8Lt4JWZh.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { d as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { B as History, D as Moon, H as HardHat, I as LayoutDashboard, M as LogOut, k as Menu, m as Sun, n as WifiOff, r as Users, t as X } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-B5625LbR.mjs";
import { t as BritoLogo } from "./brito-logo-DZQcPPvx.mjs";
import { _ as Link, l as useLocation, p as Outlet, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useRole, n as useAuth, r as useProfile } from "./use-auth-D2UOjB9-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-CwAnxFlj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useOnlineStatus() {
	const [online, setOnline] = (0, import_react.useState)(typeof navigator !== "undefined" ? navigator.onLine : true);
	(0, import_react.useEffect)(() => {
		const on = () => setOnline(true);
		const off = () => setOnline(false);
		window.addEventListener("online", on);
		window.addEventListener("offline", off);
		return () => {
			window.removeEventListener("online", on);
			window.removeEventListener("offline", off);
		};
	}, []);
	return online;
}
function OfflineIndicator() {
	if (useOnlineStatus()) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow-lg bg-destructive text-destructive-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WifiOff, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Modo offline" })]
	});
}
function AuthenticatedLayout() {
	const { user, loading } = useAuth();
	const { data: profile } = useProfile();
	const { data: role } = useRole();
	const navigate = useNavigate();
	const location = useLocation();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [dark, setDark] = (0, import_react.useState)(() => {
		if (typeof window !== "undefined") return localStorage.getItem("brito-theme") === "dark";
		return false;
	});
	(0, import_react.useEffect)(() => {
		const root = document.documentElement;
		if (dark) {
			root.classList.add("dark");
			localStorage.setItem("brito-theme", "dark");
		} else {
			root.classList.remove("dark");
			localStorage.setItem("brito-theme", "light");
		}
	}, [dark]);
	async function handleLogout() {
		await supabase.auth.signOut();
		navigate({
			to: "/auth",
			replace: true
		});
	}
	if (loading || !user) return null;
	const isAdmin = role === "admin";
	const isCliente = role === "cliente";
	const nav = [
		{
			to: "/dashboard",
			label: "Obras",
			icon: LayoutDashboard,
			show: true
		},
		{
			to: "/obras",
			label: "Gerenciar obras",
			icon: HardHat,
			show: isAdmin
		},
		{
			to: "/admin/usuarios",
			label: "Usuários",
			icon: Users,
			show: isAdmin
		},
		{
			to: "/admin/audit",
			label: "Audit log",
			icon: History,
			show: isAdmin
		}
	].filter((i) => i.show);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen flex bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "hidden md:flex md:w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-4 border-b border-sidebar-border",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BritoLogo, { size: "sm" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex-1 p-3 space-y-1",
						children: nav.map((item) => {
							const active = location.pathname === item.to || location.pathname.startsWith(item.to + "/");
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								className: cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-300", active ? "bg-gradient-to-b from-sidebar-primary/95 to-sidebar-primary text-sidebar-primary-foreground shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),_0_2px_4px_rgba(0,0,0,0.2)]" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-4" }), item.label]
							}, item.to);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 border-t border-sidebar-border space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-3 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium truncate",
								children: profile?.nome || user.email
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sidebar-foreground/60 uppercase tracking-wider text-[0.65rem]",
								children: role ?? "—"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "sm",
								onClick: () => setDark((d) => !d),
								className: "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex-none",
								title: "Alternar tema",
								children: dark ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "size-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								size: "sm",
								onClick: handleLogout,
								className: "flex-1 justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4 mr-2" }), "Sair"]
							})]
						})]
					})
				]
			}),
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "md:hidden fixed inset-0 z-50 bg-black/50",
				onClick: () => setOpen(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "absolute left-0 top-0 bottom-0 w-72 bg-sidebar text-sidebar-foreground flex flex-col",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 border-b border-sidebar-border flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BritoLogo, { size: "sm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								onClick: () => setOpen(false),
								className: "text-sidebar-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "flex-1 p-3 space-y-1",
							children: nav.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								onClick: () => setOpen(false),
								className: cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-300", location.pathname === item.to || location.pathname.startsWith(item.to + "/") ? "bg-gradient-to-b from-sidebar-primary/95 to-sidebar-primary text-sidebar-primary-foreground shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),_0_2px_4px_rgba(0,0,0,0.2)]" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-4" }), item.label]
							}, item.to))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 border-t border-sidebar-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-3 mb-2 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium truncate",
									children: profile?.nome || user.email
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sidebar-foreground/60 uppercase tracking-wider text-[0.65rem]",
									children: role ?? "—"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "sm",
									onClick: () => setDark((d) => !d),
									className: "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex-none",
									title: "Alternar tema",
									children: dark ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "size-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									size: "sm",
									onClick: handleLogout,
									className: "flex-1 justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4 mr-2" }), "Sair"]
								})]
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 flex flex-col min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
						className: "hidden md:flex items-center justify-end p-3 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-30 shadow-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							onClick: () => setDark((d) => !d),
							title: "Alternar tema",
							children: dark ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "size-5" })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "md:hidden flex items-center justify-between p-3 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-30 shadow-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								onClick: () => setOpen(true),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BritoLogo, { size: "sm" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								onClick: () => setDark((d) => !d),
								title: "Alternar tema",
								children: dark ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "size-5" })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
						className: "flex-1 overflow-y-auto",
						children: [isCliente && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bg-accent text-accent-foreground text-xs px-4 py-2 text-center",
							children: "Visualização de cliente — somente leitura."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OfflineIndicator, {})
		]
	});
}
//#endregion
export { AuthenticatedLayout as component };
