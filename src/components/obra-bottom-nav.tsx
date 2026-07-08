import { useNavigate } from "@tanstack/react-router";
import { LayoutGrid, MapPin, Menu, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

export type ObraTab = "visao" | "mapa" | "fotografia" | "menu";

interface ObraBottomNavProps {
  obraId: string;
  active: ObraTab;
}

const tabs: { id: ObraTab; label: string; icon: typeof LayoutGrid; search: { tab: ObraTab } }[] = [
  { id: "visao", label: "Visão geral", icon: LayoutGrid, search: { tab: "visao" } },
  { id: "mapa", label: "Mapa", icon: MapPin, search: { tab: "mapa" } },
  { id: "fotografia", label: "Fotografia", icon: Camera, search: { tab: "fotografia" } },
  { id: "menu", label: "Menu", icon: Menu, search: { tab: "menu" } },
];

export function ObraBottomNav({ obraId, active }: ObraBottomNavProps) {
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-card md:left-64">
      <div className="max-w-6xl mx-auto flex">
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
                "flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[0.65rem] sm:text-xs font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className={cn("size-5", isActive && "text-primary")} />
              {t.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
