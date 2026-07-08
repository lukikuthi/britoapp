import { useState, useRef, useEffect } from "react";
import { useRdoTable, useAddRdoTableItem, useDeleteRdoTableItem } from "@/hooks/use-rdo";
import { ChevronDown, ChevronRight, Image as ImageIcon, Loader2, Upload, Trash2, Check, X } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import imageCompression from "browser-image-compression";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface RdoFotografiasProps {
  rdoId: string;
  obraId: string;
}

export function RdoFotografiasSection({ rdoId, obraId }: RdoFotografiasProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const { data: midias = [], isLoading } = useRdoTable<{ id: string; storage_path: string; legenda: string | null }>(rdoId, "rdo_midias");
  const addMut = useAddRdoTableItem();
  const deleteMut = useDeleteRdoTableItem();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load photos from ObraFotografia for the gallery picker
  useEffect(() => {
    if (isGalleryOpen) {
      setLoadingGallery(true);
      supabase
        .from("obra_fotografia_itens" as any)
        .select("*")
        .eq("obra_id", obraId)
        .order("ordem", { ascending: true })
        .then(({ data, error }) => {
          if (!error && data) setGalleryItems(data);
          setLoadingGallery(false);
        });
    }
  }, [isGalleryOpen, obraId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      toast.info("Comprimindo imagem...");
      const compressed = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1600 });
      
      const fileName = `${obraId}/${rdoId}/${crypto.randomUUID()}.jpg`;
      toast.info("Fazendo upload...");
      const { error: uploadError } = await supabase.storage
        .from("rdo-midias")
        .upload(fileName, compressed, { contentType: "image/jpeg" });
        
      if (uploadError) throw uploadError;

      await addMut.mutateAsync({
        table: "rdo_midias",
        rdoId,
        payload: { storage_path: fileName, tipo: "imagem" }
      });
      toast.success("Foto adicionada!");
    } catch (err: any) {
      toast.error("Erro no upload: " + err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSelectFromGallery = async (storagePath: string) => {
    try {
      // Instead of copying the file, we can just point to the same storage path 
      // since both share the 'rdo-midias' bucket and 'has_obra_access' policies.
      const isAlreadySelected = midias.some(m => m.storage_path === storagePath);
      if (isAlreadySelected) {
        toast.info("Essa foto já foi adicionada ao RDO.");
        return;
      }
      await addMut.mutateAsync({
        table: "rdo_midias",
        rdoId,
        payload: { storage_path: storagePath, tipo: "imagem" }
      });
      toast.success("Foto anexada do mural!");
      setIsGalleryOpen(false);
    } catch (e: any) {
      toast.error("Erro: " + e.message);
    }
  };

  const handleDelete = async (id: string, storagePath: string) => {
    if (!confirm("Deseja remover esta foto do RDO?")) return;
    try {
      await deleteMut.mutateAsync({ table: "rdo_midias", rdoId, id });
      // Only delete from storage if it belongs strictly to this RDO (starts with obraId/rdoId/)
      if (storagePath.includes(`/${rdoId}/`)) {
        await supabase.storage.from("rdo-midias").remove([storagePath]);
      }
      toast.success("Foto removida do RDO");
    } catch (e: any) {
      toast.error("Erro ao remover: " + e.message);
    }
  };

  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {isOpen ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
          <ImageIcon className="size-4 text-primary" />
          <span className="font-semibold">Fotografias</span>
          {midias.length > 0 && (
            <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">
              {midias.length}
            </span>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 border-t space-y-4">
          {isLoading ? (
            <div className="flex justify-center p-4"><Loader2 className="size-5 animate-spin" /></div>
          ) : (
            <>
              {midias.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {midias.map(midia => {
                    const { data } = supabase.storage.from("rdo-midias").getPublicUrl(midia.storage_path);
                    return (
                      <div key={midia.id} className="relative group rounded-md overflow-hidden border aspect-square">
                        <img src={data.publicUrl} alt="Midia RDO" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button size="icon" variant="destructive" onClick={() => handleDelete(midia.id, midia.storage_path)}>
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center p-4 text-muted-foreground text-sm border border-dashed rounded">
                  Nenhuma fotografia adicionada a este relatório.
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  disabled={uploading}
                />
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()} 
                  disabled={uploading}
                  className="flex-1"
                >
                  {uploading ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Upload className="size-4 mr-2" />}
                  Enviar do Dispositivo
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => setIsGalleryOpen(true)}
                  className="flex-1"
                >
                  <ImageIcon className="size-4 mr-2" />
                  Escolher da Galeria da Obra
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Modal Galeria da Obra */}
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Mural de Fotografias da Obra</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto pr-2">
            {loadingGallery ? (
              <div className="flex justify-center p-8"><Loader2 className="size-6 animate-spin" /></div>
            ) : galleryItems.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {galleryItems.map(item => {
                  const { data } = supabase.storage.from("rdo-midias").getPublicUrl(item.storage_path);
                  return (
                    <div 
                      key={item.id} 
                      className="group relative cursor-pointer border rounded-md overflow-hidden aspect-square hover:ring-2 hover:ring-primary transition-all"
                      onClick={() => handleSelectFromGallery(item.storage_path)}
                    >
                      <img src={data.publicUrl} alt={item.titulo} className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-white text-xs truncate">
                        {item.titulo}
                      </div>
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Check className="size-8 text-white drop-shadow-md" />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center p-8 text-muted-foreground">
                Não há fotos na galeria desta obra.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
