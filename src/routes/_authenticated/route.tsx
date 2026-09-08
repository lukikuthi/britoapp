import { createFileRoute, Outlet, Link, useNavigate, useLocation, useMatches } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useProfile, useRole, useModulos } from "@/hooks/use-auth";
import { BritoLogo } from "@/components/brito-logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { OfflineIndicator } from "@/components/offline-indicator";
import { NotificationsPopover } from "@/components/notifications-popover";
import { History, LayoutDashboard, HardHat, Users as UsersIcon, Menu, X, LogOut, Moon, Sun, Database, StickyNote, Calendar, ShoppingCart, DollarSign, Briefcase } from "lucide-react";

import { requireAuth } from "@/lib/auth-guards";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    return await requireAuth();
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("brito-theme") === "dark";
    }
    return false;
  });

  const matches = useMatches();
  const { data: modulos } = useModulos();

  useEffect(() => {
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
    navigate({ to: "/auth", replace: true });
  }

  if (loading || !user) {
    return null;
  }

  const isAdmin = role === "admin";
  const isCliente = role === "cliente";

  const isHub = matches.some(m => m.routeId === "/_authenticated/hub");

  const userModulos = modulos || [];

  let mainNav = [];
  
  // SEMPRE exibe o Hub no topo da sidebar
  mainNav.push({ to: "/hub", label: "Hub de Módulos", icon: LayoutDashboard, show: true });
  
  if (userModulos.includes("obras")) {
    mainNav.push({ to: "/dashboard", label: "Dashboard (Obras)", icon: LayoutDashboard, show: true });
    mainNav.push({ to: "/calendar", label: "Calendário", icon: Calendar, show: true });
    mainNav.push({ to: "/notes", label: "Anotações", icon: StickyNote, show: true });
    if (isAdmin) mainNav.push({ to: "/obras/", label: "Gerenciar obras", icon: HardHat, show: true });
  }

  if (userModulos.includes("compras")) {
    mainNav.push({ to: "/compras", label: "Compras e Suprimentos", icon: ShoppingCart, show: true });
  }

  if (userModulos.includes("financeiro")) {
    mainNav.push({ to: "/financeiro", label: "Financeiro e Medição", icon: DollarSign, show: true });
  }

  if (userModulos.includes("rh")) {
    mainNav.push({ to: "/rh", label: "RH e Segurança", icon: UsersIcon, show: true });
  }

  if (userModulos.includes("diretoria")) {
    mainNav.push({ to: "/diretoria", label: "Painel Diretoria", icon: Briefcase, show: true });
  }

  const bottomNav = [
    { to: "/admin/usuarios", label: "Usuários", icon: UsersIcon, show: isAdmin },
    { to: "/admin/audit", label: "Audit log", icon: History, show: isAdmin },
    { to: "/admin/backup", label: "Backup & Restauração", icon: Database, show: isAdmin },
    { to: "/settings/profile", label: "Meu Perfil", icon: UsersIcon, show: true },
  ].filter((i) => i.show);

  const nav = [...mainNav.filter(i => i.show), ...bottomNav];

  if (isHub) {
    return (
      <div className="min-h-screen bg-background flex flex-col transition-colors duration-300">
        <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card">
          <BritoLogo size="sm" className="h-8 w-auto" />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setDark(!dark)} title="Alternar tema">
              {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950" title="Sair">
              <LogOut className="size-5" />
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex bg-background transition-all duration-300" 
      style={{ "--sidebar-width": sidebarCollapsed ? "80px" : "256px" } as React.CSSProperties}
    >
      {/* Sidebar desktop */}
      <aside className={cn(
        "hidden md:flex flex-col bg-sidebar text-sidebar-foreground shrink-0 transition-all duration-300 overflow-hidden",
        sidebarCollapsed ? "w-20" : "w-64"
      )}>
        <div className={cn(
          "border-b border-sidebar-border bg-background flex flex-col items-center justify-center py-4 relative transition-all duration-300",
          sidebarCollapsed ? "px-2 h-[80px]" : "px-4 h-[100px]"
        )}>
          <div className="flex-1 flex items-center justify-center w-full select-none pointer-events-none">
            <BritoLogo 
              iconOnly={sidebarCollapsed} 
              size="xl" 
              className="h-full max-h-[50px] w-auto object-contain" 
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col border-r border-sidebar-border">
        <nav className="flex-1 p-3 space-y-1">
          {nav.map((item) => {
            const active = location.pathname === item.to || location.pathname.startsWith(item.to + "/");
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm transition-all duration-300",
                  sidebarCollapsed ? "justify-center" : "gap-3",
                  active
                    ? "bg-gradient-to-b from-sidebar-primary/95 to-sidebar-primary text-sidebar-primary-foreground shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),_0_2px_4px_rgba(0,0,0,0.2)]"
                    : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <item.icon className="size-5 shrink-0" />
                {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-sidebar-border space-y-2">
          {!sidebarCollapsed && (
            <div className="px-3 text-xs">
              <div className="font-medium truncate">{profile?.nome || user.email}</div>
              <div className="text-sidebar-foreground/60 uppercase tracking-wider text-[0.65rem]">
                {role ?? "—"}
              </div>
            </div>
          )}
          <div className={cn("flex", sidebarCollapsed ? "flex-col items-center gap-2" : "gap-2")}>
            <Button
              variant="ghost"
              size={sidebarCollapsed ? "icon" : "sm"}
              onClick={() => setDark((d) => !d)}
              className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex-none"
              title="Alternar tema"
            >
              {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </Button>
            <Button
              variant="ghost"
              size={sidebarCollapsed ? "icon" : "sm"}
              onClick={handleLogout}
              className={cn(
                "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                sidebarCollapsed ? "justify-center" : "flex-1 justify-start"
              )}
              title={sidebarCollapsed ? "Sair" : undefined}
            >
              <LogOut className={cn("size-5", !sidebarCollapsed && "mr-2")} />
              {!sidebarCollapsed && "Sair"}
            </Button>
          </div>
        </div>
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setOpen(false)}>
          <aside
            className="absolute left-0 top-0 bottom-0 w-72 bg-sidebar text-sidebar-foreground flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="py-2 px-6 border-b border-sidebar-border bg-white flex items-center justify-between h-[97px]">
              <BritoLogo size="xl" className="h-full max-h-[75px] w-auto object-contain" />
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="text-slate-900 hover:bg-slate-100">
                <X className="size-5" />
              </Button>
            </div>
            <nav className="flex-1 p-3 space-y-1">
              {nav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-300",
                    location.pathname === item.to || location.pathname.startsWith(item.to + "/")
                      ? "bg-gradient-to-b from-sidebar-primary/95 to-sidebar-primary text-sidebar-primary-foreground shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),_0_2px_4px_rgba(0,0,0,0.2)]"
                      : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
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
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDark((d) => !d)}
                  className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex-none"
                  title="Alternar tema"
                >
                  {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex-1 justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <LogOut className="size-4 mr-2" />
                  Sair
                </Button>
              </div>
            </div>
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 bg-background relative z-0">
        {/* Topbar desktop */}
        <header className="hidden md:flex items-center justify-between p-3 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} title="Alternar menu">
              <Menu className="size-5" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <NotificationsPopover />
            <Button variant="ghost" size="icon" onClick={() => setDark((d) => !d)} title="Alternar tema">
              {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </Button>
          </div>
        </header>

        {/* Topbar mobile */}
        <header className="md:hidden flex items-center justify-between p-3 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-30 shadow-sm">
          <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
            <Menu className="size-5" />
          </Button>
          <BritoLogo size="sm" />
          <div className="flex items-center gap-1">
            <NotificationsPopover />
            <Button variant="ghost" size="icon" onClick={() => setDark((d) => !d)} title="Alternar tema">
              {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </Button>
          </div>
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
