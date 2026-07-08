import { useRef, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import imageCompression from "browser-image-compression";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, FileDown, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { generateFotografiaPdf } from "@/lib/fotografia-pdf-generator";

interface ObraFotografiaTabProps {
  obraId: string;
  obraNome: string;
  obraEndereco?: string | null;
  editable: boolean;
}

type FotografiaItem = {
  id: string;
  obra_id: string;
  titulo: string;
  descricao: string | null;
  storage_path: string | null;
  ordem: number;
  url?: string;
};

function isImageFile(file: File): boolean {
  if (file.type.startsWith("image/")) return true;
  return /\.(jpe?g|png|gif|webp|heic|heif|bmp)$/i.test(file.name);
}

function FotografiaCard({
  item,
  obraId,
  editable,
  onChanged,
}: {
  item: FotografiaItem;
  obraId: string;
  editable: boolean;
  onChanged: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [titulo, setTitulo] = useState(item.titulo);
  const [descricao, setDescricao] = useState(item.descricao ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTitulo(item.titulo);
    setDescricao(item.descricao ?? "");
  }, [item.titulo, item.descricao]);

  async function saveText() {
    const t = titulo.trim();
    const d = descricao.trim();
    if (t === item.titulo && d === (item.descricao ?? "")) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("obra_fotografia_itens")
        .update({ titulo: t, descricao: d || null })
        .eq("id", item.id);
      if (error) throw error;
      onChanged();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  async function handlePhoto(file: File) {
    if (!isImageFile(file)) {
      toast.error("Selecione uma imagem válida.");
      return;
    }
    setUploading(true);
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 1.2,
        maxWidthOrHeight: 1600,
        useWebWorker: true,
      });
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${obraId}/fotografia/${crypto.randomUUID()}.${ext}`;

      if (item.storage_path) {
        await supabase.storage.from("rdo-midias").remove([item.storage_path]);
      }

      const { error: upErr } = await supabase.storage.from("rdo-midias").upload(path, compressed);
      if (upErr) throw upErr;

      const { error: dbErr } = await supabase
        .from("obra_fotografia_itens")
        .update({ storage_path: path })
        .eq("id", item.id);
      if (dbErr) {
        await supabase.storage.from("rdo-midias").remove([path]);
        throw dbErr;
      }
      onChanged();
      toast.success("Foto enviada.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao enviar foto.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleRemove() {
    if (!confirm("Remover este registro fotográfico?")) return;
    try {
      if (item.storage_path) {
        const { error: stErr } = await supabase.storage.from("rdo-midias").remove([item.storage_path]);
        if (stErr) throw stErr;
      }
      const { error } = await supabase.from("obra_fotografia_itens").delete().eq("id", item.id);
      if (error) throw error;
      onChanged();
      toast.success("Registro removido.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao remover.");
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-1.5">
            <Label className="text-xs text-muted-foreground">Título</Label>
            {editable ? (
              <Input
                placeholder="Título da foto"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                onBlur={() => void saveText()}
                disabled={saving}
                className="h-8 text-sm"
              />
            ) : (
              <p className="text-sm font-medium">{item.titulo || "Sem título"}</p>
            )}
          </div>
          {editable && (
            <Button size="icon" variant="ghost" className="size-7 shrink-0 text-muted-foreground hover:text-destructive" onClick={() => void handleRemove()}>
              <Trash2 className="size-3.5" />
            </Button>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Foto</Label>
          <div
            className="relative aspect-[4/3] rounded-md border overflow-hidden bg-muted cursor-pointer"
            onClick={() => editable && !uploading && inputRef.current?.click()}
            role={editable ? "button" : undefined}
            tabIndex={editable ? 0 : undefined}
            onKeyDown={(e) => {
              if (editable && (e.key === "Enter" || e.key === " ")) inputRef.current?.click();
            }}
          >
            {item.url ? (
              <img src={item.url} alt={titulo || "Foto"} className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-1">
                {uploading ? (
                  <Loader2 className="size-6 animate-spin" />
                ) : (
                  <>
                    <Camera className="size-6" />
                    <span className="text-xs">{editable ? "Toque para enviar" : "Sem foto"}</span>
                  </>
                )}
              </div>
            )}
            {uploading && item.url && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/60">
                <Loader2 className="size-6 animate-spin" />
              </div>
            )}
          </div>
          {editable && (
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handlePhoto(file);
              }}
            />
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Descrição</Label>
          {editable ? (
            <Textarea
              placeholder="Descrição (opcional)"
              rows={2}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              onBlur={() => void saveText()}
              disabled={saving}
              className="text-sm resize-none"
            />
          ) : (
            item.descricao && <p className="text-sm text-muted-foreground">{item.descricao}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function ObraFotografiaTab({ obraId, obraNome, obraEndereco, editable }: ObraFotografiaTabProps) {
  const qc = useQueryClient();
  const [exporting, setExporting] = useState(false);

  const itens = useQuery({
    queryKey: ["obra-fotografia", obraId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("obra_fotografia_itens")
        .select("*")
        .eq("obra_id", obraId)
        .order("ordem", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return Promise.all(
        (data ?? []).map(async (item) => {
          if (!item.storage_path) return { ...item, url: undefined };
          const { data: signed } = await supabase.storage.from("rdo-midias").createSignedUrl(item.storage_path, 3600);
          return { ...item, url: signed?.signedUrl };
        }),
      ) as FotografiaItem[];
    },
  });

  const addItem = useMutation({
    mutationFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      const ordem = itens.data?.length ?? 0;
      const { error } = await supabase.from("obra_fotografia_itens").insert({
        obra_id: obraId,
        titulo: "",
        ordem,
        enviado_por: u.user?.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["obra-fotografia", obraId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  async function handleExportPdf() {
    const rows = itens.data?.filter((i) => i.url) ?? [];
    if (!rows.length) {
      toast.error("Adicione pelo menos uma foto antes de exportar.");
      return;
    }
    setExporting(true);
    try {
      const blob = await generateFotografiaPdf({
        obraNome,
        endereco: obraEndereco,
        itens: rows.map((i) => ({
          titulo: i.titulo,
          descricao: i.descricao,
          url: i.url ?? null,
        })),
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Fotografia-${obraNome.replace(/\s+/g, "-").slice(0, 40)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("PDF exportado.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao gerar PDF.");
    } finally {
      setExporting(false);
    }
  }

  const comFoto = itens.data?.filter((i) => i.url).length ?? 0;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-base font-semibold">Registro fotográfico</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Seção independente do RDO. Organize fotos com título e descrição.
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={() => void handleExportPdf()} disabled={exporting || comFoto === 0}>
          {exporting ? <Loader2 className="size-4 animate-spin" /> : <FileDown className="size-4" />}
          Exportar PDF
        </Button>
      </div>

      {itens.isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="size-6 animate-spin" />
        </div>
      ) : !itens.data?.length ? (
        <Card>
          <CardContent className="py-10 text-center space-y-3">
            <Camera className="size-8 mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Nenhuma foto registrada ainda.</p>
            {editable && (
              <Button size="sm" onClick={() => addItem.mutate()} disabled={addItem.isPending}>
                {addItem.isPending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                Adicionar foto
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {itens.data.map((item) => (
              <FotografiaCard
                key={item.id}
                item={item}
                obraId={obraId}
                editable={editable}
                onChanged={() => qc.invalidateQueries({ queryKey: ["obra-fotografia", obraId] })}
              />
            ))}
          </div>
          {editable && (
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => addItem.mutate()} disabled={addItem.isPending}>
              {addItem.isPending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
              Adicionar mais foto
            </Button>
          )}
        </>
      )}
    </div>
  );
}
