import { createFileRoute, Outlet, redirect, Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useProfile, useRole } from "@/hooks/use-auth";
import { BritoLogo } from "@/components/brito-logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { OfflineIndicator } from "@/components/offline-indicator";
import { History, LayoutDashboard, HardHat, Users as UsersIcon, Menu, X, LogOut } from "lucide-react";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { user, loading } = useAuth();
  const { data: profile } = useProfile();
  const { data: role } = useRole();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (loading || !user) {
    return null;
  }

  const isAdmin = role === "admin";
  const isCliente = role === "cliente";

  const nav = [
    { to: "/dashboard", label: "Obras", icon: LayoutDashboard, show: true },
    { to: "/obras", label: "Gerenciar obras", icon: HardHat, show: isAdmin },
    { to: "/admin/usuarios", label: "Usuários", icon: UsersIcon, show: isAdmin },
    { to: "/admin/audit", label: "Audit log", icon: History, show: isAdmin },
  ].filter((i) => i.show);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex md:w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
        <div className="p-4 border-b border-sidebar-border">
          <BritoLogo size="sm" />
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map((item) => {
            const active = location.pathname === item.to || location.pathname.startsWith(item.to + "/");
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "hover:bg-sidebar-accent",
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-sidebar-border space-y-2">
          <div className="px-3 text-xs">
            <div className="font-medium truncate">{profile?.nome || user.email}</div>
            <div className="text-sidebar-foreground/60 uppercase tracking-wider text-[0.65rem]">
              {role ?? "—"}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <LogOut className="size-4" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setOpen(false)}>
          <aside
            className="absolute left-0 top-0 bottom-0 w-72 bg-sidebar text-sidebar-foreground flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
              <BritoLogo size="sm" />
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="text-sidebar-foreground">
                <X className="size-5" />
              </Button>
            </div>
            <nav className="flex-1 p-3 space-y-1">
              {nav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-sidebar-accent"
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="p-3 border-t border-sidebar-border">
              <div className="px-3 mb-2 text-xs">
                <div className="font-medium truncate">{profile?.nome || user.email}</div>
                <div className="text-sidebar-foreground/60 uppercase tracking-wider text-[0.65rem]">
                  {role ?? "—"}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <LogOut className="size-4" />
                Sair
              </Button>
            </div>
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar mobile */}
        <header className="md:hidden flex items-center justify-between p-3 border-b bg-card">
          <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
            <Menu className="size-5" />
          </Button>
          <BritoLogo size="sm" />
          <div className="w-9" />
        </header>

        <main className="flex-1 overflow-y-auto">
          {isCliente && (
            <div className="bg-accent text-accent-foreground text-xs px-4 py-2 text-center">
              Visualização de cliente — somente leitura.
            </div>
          )}
          <Outlet />
        </main>
      </div>

      <OfflineIndicator />
    </div>
  );
}
