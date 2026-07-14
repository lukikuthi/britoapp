import { cn } from "@/lib/utils";

interface ApontamentoPinProps {
  numero: number;
  posX: number;
  posY: number;
  status: "aberto" | "resolvido";
  selected?: boolean;
  onClick: () => void;
}

export function ApontamentoPin({
  numero,
  posX,
  posY,
  status,
  selected = false,
  onClick,
}: ApontamentoPinProps) {
  const isAberto = status === "aberto";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "absolute flex items-center justify-center",
        "rounded-full font-bold text-white text-xs leading-none",
        "transition-transform duration-150 ease-out",
        "animate-in fade-in zoom-in-75 slide-in-from-top-2 duration-300",
        "focus-visible:outline-none",
        "hover:scale-110",
        isAberto
          ? "bg-destructive shadow-[0_2px_8px_rgba(220,38,38,0.45)]"
          : "bg-success shadow-[0_2px_8px_rgba(34,197,94,0.45)]",
        selected && [
          "scale-115 z-20",
          isAberto
            ? "ring-2 ring-destructive/50 ring-offset-2 ring-offset-background"
            : "ring-2 ring-success/50 ring-offset-2 ring-offset-background",
        ],
        !selected && "z-10",
      )}
      style={{
        width: 28,
        height: 28,
        left: `${posX * 100}%`,
        top: `${posY * 100}%`,
        transform: selected
          ? "translate(-50%, -50%) scale(1.15)"
          : "translate(-50%, -50%)",
      }}
      aria-label={`Apontamento ${numero} — ${isAberto ? "Aberto" : "Resolvido"}`}
    >
      {numero}
    </button>
  );
}
