import { cn } from "@/lib/utils";

interface AndarButtonProps {
  numero: number;
  apelido?: string;
  tipoAndar: string;
  apontamentosAbertos: number;
  isTop?: boolean;
  isGroundLine?: boolean;
  onClick: () => void;
}

const variantStyles: Record<string, string> = {
  garagem: "bg-muted hover:bg-muted/80 text-muted-foreground",
  terreo: "bg-primary/10 hover:bg-primary/20 text-primary border-primary/20",
  tipo: "bg-card hover:bg-muted/50 border",
  cobertura: "bg-primary/5 hover:bg-primary/10 border border-primary/10",
  comercial: "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900",
  tecnica: "bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-300 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900",
  subestacao: "bg-red-100 hover:bg-red-200 text-red-800 border-red-300 font-bold dark:bg-red-950/30 dark:text-red-400 dark:border-red-900",
  mezanino: "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900",
};

export function AndarButton({
  numero,
  apelido,
  tipoAndar,
  apontamentosAbertos,
  isTop,
  isGroundLine,
  onClick,
}: AndarButtonProps) {
  const bgClass = variantStyles[tipoAndar] ?? variantStyles.tipo;
  const isSubestacao = tipoAndar === "subestacao";

  return (
    <div className="relative flex justify-center w-full group">
      {/* Structural left edge (Concrete column) */}
      <div className="w-2 md:w-4 shrink-0 bg-muted-foreground/20 border-l border-muted-foreground/30 shadow-[inset_-2px_0_4px_rgba(0,0,0,0.1)] z-10" 
           style={{ borderTopLeftRadius: isTop ? '8px' : '0' }} />
      
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "relative w-full h-12 border-y text-sm font-medium",
          "flex items-center justify-between px-3 md:px-6",
          "transition-all duration-150 ease-in-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
          "active:scale-[0.98] shadow-sm",
          bgClass,
          isTop && "rounded-t-lg border-t-2 border-t-muted-foreground/50",
          isGroundLine && "border-b-[4px] border-b-green-700/80 mb-1", // Grass/Street level
        )}
        style={{
          // Hazard stripes for Subestação
          backgroundImage: isSubestacao 
            ? "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 20px)" 
            : undefined
        }}
      >
        {/* Left Window Effect */}
        <div className="w-4 h-6 md:w-6 md:h-8 bg-background/60 border border-border shadow-inner rounded-sm" />

        <span className="truncate px-2 font-bold flex-1 text-center">
          {apelido ?? `${numero}º`}
        </span>

        {/* Right Window Effect */}
        <div className="w-4 h-6 md:w-6 md:h-8 bg-background/60 border border-border shadow-inner rounded-sm" />

        {apontamentosAbertos > 0 && (
          <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-[22px] h-[22px] px-1 rounded-full bg-destructive text-destructive-foreground text-[11px] font-bold leading-none shadow-md z-20 animate-pulse-soft">
            {apontamentosAbertos > 99 ? "99+" : apontamentosAbertos}
          </span>
        )}
      </button>

      {/* Structural right edge (Concrete column) */}
      <div className="w-2 md:w-4 shrink-0 bg-muted-foreground/20 border-r border-muted-foreground/30 shadow-[inset_2px_0_4px_rgba(0,0,0,0.1)] z-10"
           style={{ borderTopRightRadius: isTop ? '8px' : '0' }} />
    </div>
  );
}
