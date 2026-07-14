/**
 * Retorna o caminho correto para assets na pasta public/,
 * respeitando o base path configurado no Vite (ex: /britoapp/).
 */
export function assetUrl(path: string): string {
  const base = import.meta.env.BASE_URL || "/";
  // Remove barra duplicada: se base = "/britoapp/" e path = "/brito-logo.png"
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${base}${cleanPath}`;
}
