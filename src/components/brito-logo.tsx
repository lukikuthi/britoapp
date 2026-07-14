import { cn } from "@/lib/utils";
import { assetUrl } from "@/lib/asset-url";

interface BritoLogoProps {
  className?: string;
  /** Tamanho compacto para header/sidebar. */
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  /** Mantido por compatibilidade — a logo é sempre a imagem da marca. */
  variant?: "light" | "dark";
}

const sizeClass = {
  sm: "h-10",
  md: "h-12",
  lg: "h-16",
  xl: "h-24",
} as const;

/** Logo da marca (PNG transparente) para header e sidebar. */
export function BritoLogo({ className, size = "md", showText = true }: BritoLogoProps) {
  if (!showText) return null;

  return (
    <img
      src={assetUrl("/brito-logo.png")}
      alt="Brito Engenharia e Instalações"
      className={cn("w-auto object-contain shrink-0", sizeClass[size], className)}
    />
  );
}
