import { useNavigate } from "@tanstack/react-router";
import { LayoutGrid, MapPin, Menu, Camera, FileText, Activity, Package, FileCheck, HardHat, BarChart3, Ruler } from "lucide-react";
import { cn } from "@/lib/utils";

export type ObraTab = "visao" | "analytics" | "mapa" | "rdo" | "fotografia" | "menu" | "materiais" | "laudos" | "sesmt" | "cronograma" | "concretagem" | "fvr" | "rnc" | "bm" | "medicao";

interface ObraBottomNavProps {
  obraId: string;
  active: ObraTab;
}

const tabs: { id: ObraTab; label: string; icon: any; search: { tab: ObraTab } }[] = [
  { id: "visao", label: "Visão", icon: Activity, search: { tab: "visao" } },
  { id: "rdo", label: "RDO", icon: FileText, search: { tab: "rdo" } },
  { id: "materiais", label: "Materiais", icon: Package, search: { tab: "materiais" } },
  { id: "laudos", label: "Laudos", icon: FileCheck, search: { tab: "laudos" } },
  { id: "sesmt", label: "SESMT", icon: HardHat, search: { tab: "sesmt" } },
  { id: "cronograma", label: "Gantt", icon: LayoutGrid, search: { tab: "cronograma" } },
  { id: "medicao", label: "Medição", icon: Ruler, search: { tab: "medicao" } },
  { id: "menu", label: "Menu", icon: Menu, search: { tab: "menu" } },
];

export function ObraBottomNav({ obraId, active }: ObraBottomNavProps) {
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/50 bg-background/80 backdrop-blur-xl md:left-[var(--sidebar-width)] transition-all duration-300 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] pb-safe">
      <div className="relative">
        {/* Scroll fade indicators */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-background/80 to-transparent z-10 sm:hidden" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-background/80 to-transparent z-10 sm:hidden" />

        <div className="max-w-6xl mx-auto flex overflow-x-auto scrollbar-hide">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = active === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() =>
                  navigate({
                    to: "/obras/$obraId",
                    params: { obraId },
                    search: t.search,
                    resetScroll: false,
                    replace: true,
                  })
                }
                className={cn(
                  `tour-tab-${t.id}`,
                  "relative min-w-[72px] sm:min-w-fit flex-1 flex flex-col items-center gap-1.5 py-3.5 px-2 text-[10px] sm:text-xs font-medium whitespace-nowrap transition-all duration-300",
                  isActive ? "text-primary scale-105" : "text-muted-foreground hover:text-foreground hover:bg-muted/30",
                )}
              >
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-b-full bg-[var(--brand-gold)] shadow-[0_0_8px_var(--brand-gold)]" />
                )}
                <Icon className={cn("size-6 sm:size-5 transition-transform", isActive && "text-primary scale-110")} strokeWidth={isActive ? 2.5 : 2} />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
