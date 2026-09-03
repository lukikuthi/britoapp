import { redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import type { AppModulo } from "@/hooks/use-auth";

export async function requireAuth() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw redirect({ to: "/auth" });
  return { user: data.user };
}

export async function requireModulo(modulo: AppModulo) {
  const { user } = await requireAuth();

  // 1. Verifica se é admin (tem acesso a tudo)
  const { data: roleData, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  // Se houver erro de rede, não expulsar — deixar passar e o RLS cuida
  if (roleError) {
    console.error("Erro ao verificar role:", roleError);
    return { user };
  }

  if (roleData?.role === "admin") {
    return { user };
  }

  // 2. Verifica se tem acesso explícito ao módulo
  const { data: modData, error: modError } = await supabase
    .from("user_modulos")
    .select("modulo")
    .eq("user_id", user.id)
    .eq("modulo", modulo)
    .maybeSingle();

  if (modError) {
    console.error("Erro ao verificar módulo:", modError);
    return { user };
  }

  if (!modData) {
    throw redirect({ to: "/hub" });
  }

  return { user };
}
