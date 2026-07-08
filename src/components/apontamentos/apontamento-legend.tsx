import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Trash2, ListChecks } from "lucide-react";

interface ApontamentoItem {
  id: string;
  numero: number;
  descricao: string;
  status: "aberto" | "resolvido";
  created_at: string;
}

interface ApontamentoLegendProps {
  apontamentos: ApontamentoItem[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onStatusChange?: (id: string, newStatus: "aberto" | "resolvido") => void;
  onDelete?: (id: string) => void;
  editable?: boolean;
}

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function ApontamentoLegend({
  apontamentos,
  selectedId,
  onSelect,
  onStatusChange,
  onDelete,
  editable = false,
}: ApontamentoLegendProps) {
  if (!apontamentos.length) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground gap-2">
        <ListChecks className="size-6" />
        <p className="text-sm">Nenhum apontamento neste andar.</p>
      </div>
    );
  }

  return (
    <div className="max-h-[420px] overflow-y-auto space-y-1 pr-1">
      {apontamentos.map((ap) => {
        const isAberto = ap.status === "aberto";
        const isSelected = ap.id === selectedId;

        return (
          <button
            key={ap.id}
            type="button"
            onClick={() => onSelect(ap.id)}
            className={cn(
              "w-full flex items-start gap-2.5 rounded-lg px-3 py-2 text-left",
              "transition-colors duration-100",
              "hover:bg-muted/60",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isSelected && "bg-accent/15 ring-1 ring-accent/30",
            )}
          >
            {/* Number badge */}
            <span
              className={cn(
                "shrink-0 flex items-center justify-center size-6 rounded-full text-[11px] font-bold text-white mt-0.5",
                isAberto ? "bg-destructive" : "bg-success",
              )}
            >
              {ap.numero}
            </span>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-0.5">
              <p className="text-sm leading-snug line-clamp-2">{ap.descricao}</p>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-muted-foreground">{formatDate(ap.created_at)}</span>
                <span
                  className={cn(
                    "font-medium",
                    isAberto ? "text-destructive" : "text-success",
                  )}
                >
                  {isAberto ? "Aberto" : "Resolvido"}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            {editable && (
              <div className="shrink-0 flex items-center gap-0.5 mt-0.5">
                {onStatusChange && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7 text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStatusChange(ap.id, isAberto ? "resolvido" : "aberto");
                    }}
                    title={isAberto ? "Marcar como resolvido" : "Reabrir"}
                  >
                    {isAberto ? (
                      <CheckCircle2 className="size-3.5" />
                    ) : (
                      <Circle className="size-3.5" />
                    )}
                  </Button>
                )}
                {onDelete && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7 text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(ap.id);
                    }}
                    title="Excluir apontamento"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                )}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
