export function buildMediaFilename(opts: {
  storagePath: string;
  legenda?: string | null;
  tipo: "imagem" | "video";
}): string {
  const part = opts.storagePath.split("/").pop() ?? "arquivo";
  const ext = part.includes(".") ? part.split(".").pop()! : opts.tipo === "video" ? "mp4" : "jpg";
  const slug = opts.legenda?.trim()
    ? opts.legenda
        .trim()
        .slice(0, 40)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
    : opts.tipo === "imagem"
      ? "foto"
      : "video";
  const prefix = opts.tipo === "imagem" ? "foto" : "video";
  return `${prefix}-${slug}.${ext}`;
}

export async function downloadFromUrl(url: string, filename: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Não foi possível baixar o arquivo.");
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  try {
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = filename;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
