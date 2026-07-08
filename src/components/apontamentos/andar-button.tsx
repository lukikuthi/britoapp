import { cn } from "@/lib/utils";

interface AndarButtonProps {
  numero: number;
  apelido?: string;
  tipoAndar: string;
  apontamentosAbertos: number;
  onClick: () => void;
}

const bgByTipo: Record<string, string> = {
  garagem: "bg-muted hover:bg-muted/80",
  terreo: "bg-accent/10 hover:bg-accent/20",
  tipo: "bg-card hover:bg-muted/50",
  cobertura: "bg-primary/5 hover:bg-primary/10",
  comercial: "bg-warning/5 hover:bg-warning/10",
};

export function AndarButton({
  numero,
  apelido,
  tipoAndar,
  apontamentosAbertos,
  onClick,
}: AndarButtonProps) {
  const bgClass = bgByTipo[tipoAndar] ?? bgByTipo.tipo;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative w-full h-12 rounded-md border text-sm font-medium",
        "flex items-center justify-center",
        "transition-all duration-150 ease-in-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        "active:scale-[0.98]",
        bgClass,
      )}
    >
      <span className="truncate px-2">
        {apelido ?? `${numero}º`}
      </span>

      {apontamentosAbertos > 0 && (
        <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold leading-none shadow-sm">
          {apontamentosAbertos > 99 ? "99+" : apontamentosAbertos}
        </span>
      )}
    </button>
  );
}
