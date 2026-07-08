import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "campo" | "cliente";

export interface BritoProfile {
  id: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  ativo: boolean;
}

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function defer(fn: () => void) {
  queueMicrotask(fn);
}

/**
 * Provedor único de sessão Supabase. Deve envolver a árvore de rotas
 * para evitar múltiplos listeners de auth e warnings do React 19.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    let mounted = true;

    const applySession = (next: Session | null) => {
      if (!mounted) return;
      setSession(next);
      setUser(next?.user ?? null);
      setLoading(false);
    };

    const { data: sub } = supabase.auth.onAuthStateChange((event, nextSession) => {
      defer(() => {
        if (!mounted) return;
        applySession(nextSession);
        if (event === "SIGNED_OUT") {
          queryClient.clear();
        }
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

  const value = useMemo(
    () => ({ session, user, loading }),
    [session, user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Sessão do Supabase + role do usuário. Use em qualquer componente para
 * checar se está logado e qual o papel dele.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

export function useRole() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["user-role", user?.id],
    enabled: !!user?.id,
    queryFn: async (): Promise<AppRole | null> => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user!.id)
        .order("role")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return (data?.role as AppRole | undefined) ?? null;
    },
  });
}

export function useProfile() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user?.id,
    queryFn: async (): Promise<BritoProfile | null> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, nome, email, telefone, ativo")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data as BritoProfile | null;
    },
  });
}
