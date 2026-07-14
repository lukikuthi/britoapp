import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-8Lt4JWZh.mjs";
import { d as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-auth-D2UOjB9-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AuthContext = (0, import_react.createContext)(null);
function defer(fn) {
	queueMicrotask(fn);
}
/**
* Provedor único de sessão Supabase. Deve envolver a árvore de rotas
* para evitar múltiplos listeners de auth e warnings do React 19.
*/
function AuthProvider({ children }) {
	const [session, setSession] = (0, import_react.useState)(null);
	const [user, setUser] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const queryClient = useQueryClient();
	(0, import_react.useEffect)(() => {
		let mounted = true;
		const applySession = (next) => {
			if (!mounted) return;
			setSession(next);
			setUser(next?.user ?? null);
			setLoading(false);
		};
		const { data: sub } = supabase.auth.onAuthStateChange((event, nextSession) => {
			defer(() => {
				if (!mounted) return;
				applySession(nextSession);
				if (event === "SIGNED_OUT") queryClient.clear();
			});
		});
		supabase.auth.getSession().then(({ data }) => {
			defer(() => {
				if (!mounted) return;
				applySession(data.session);
			});
		});
		return () => {
			mounted = false;
			sub.subscription.unsubscribe();
		};
	}, [queryClient]);
	const value = (0, import_react.useMemo)(() => ({
		session,
		user,
		loading
	}), [
		session,
		user,
		loading
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value,
		children
	});
}
/**
* Sessão do Supabase + role do usuário. Use em qualquer componente para
* checar se está logado e qual o papel dele.
*/
function useAuth() {
	const ctx = (0, import_react.useContext)(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
}
function useRole() {
	const { user } = useAuth();
	return useQuery({
		queryKey: ["user-role", user?.id],
		enabled: !!user?.id,
		queryFn: async () => {
			const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", user.id).order("role").limit(1).maybeSingle();
			if (error) throw error;
			return data?.role ?? null;
		}
	});
}
function useProfile() {
	const { user } = useAuth();
	return useQuery({
		queryKey: ["profile", user?.id],
		enabled: !!user?.id,
		queryFn: async () => {
			const { data, error } = await supabase.from("profiles").select("id, nome, email, telefone, ativo").eq("id", user.id).maybeSingle();
			if (error) throw error;
			return data;
		}
	});
}
//#endregion
export { useRole as i, useAuth as n, useProfile as r, AuthProvider as t };
