import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Plus, MapPin, AlertCircle, CheckCircle2, Upload, Trash2, Camera, Loader2, MousePointer2 } from "lucide-react";
import { useAmbientes, usePendencias, useCreateAmbiente, useDeleteAmbiente, useCreatePendencia, useResolvePendencia, Ambiente, useUploadPlantaAmbiente } from "@/hooks/use-5-passos";
import { PlantaBaixaViewer } from "@/components/apontamentos/planta-baixa-viewer";
import { ImageDrawCanvas } from "@/components/apontamentos/image-draw-canvas";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { useRole } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/obras/$obraId/torres/$torreId/pavimentos/$pavimentoId")({
  component: PavimentoAmbientesView,
});

function PavimentoAmbientesView() {
  const { obraId, torreId, pavimentoId } = Route.useParams();
  const [selectedAmbienteId, setSelectedAmbienteId] = useState<string | null>(null);

  const pav = useQuery({
    queryKey: ["pavimento", pavimentoId],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await supabase.from("obra_pavimentos" as any).select("*").eq("id", pavimentoId).single();
      if (error) throw error;
      return data;
    }
  });

  const ambientes = useAmbientes(pavimentoId);

  // Auto-select first ambiente if none selected
  if (ambientes.data && ambientes.data.length > 0 && !selectedAmbienteId) {
    setSelectedAmbienteId(ambientes.data[0].id);
  }

  const selectedAmbiente = ambientes.data?.find(a => a.id === selectedAmbienteId);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] pb-24 sm:pb-0 overflow-hidden bg-muted/10">
      {/* Header */}
      <div className="flex-none p-4 bg-background border-b flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild className="-ml-2">
            <Link to={`/obras/${obraId}/torres/${torreId}`}>
              <ChevronLeft className="size-4" /> Voltar
            </Link>
          </Button>
          <h1 className="text-lg font-bold">
            {pav.data ? `${pav.data.numero_andar}º Pavimento (${pav.data.tipo_pavimento})` : "Carregando..."}
          </h1>
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        {/* Left Col: Ambientes */}
        <div className="w-full md:w-64 lg:w-80 flex-none border-r bg-background flex flex-col h-1/3 md:h-full">
          <AmbientesSidebar pavimentoId={pavimentoId} ambientes={ambientes.data || []} selectedId={selectedAmbienteId} onSelect={setSelectedAmbienteId} />
        </div>

        {/* Right Col: Pendencias (Passo 5) */}
        <div className="flex-1 min-w-0 bg-muted/20 flex flex-col h-2/3 md:h-full relative overflow-y-auto">
          {selectedAmbiente ? (
            <AmbienteDetail ambiente={selectedAmbiente} obraId={obraId} />
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground p-6 text-center">
              <div>
                <MapPin className="size-12 mx-auto mb-4 opacity-20" />
                <p>Selecione ou crie um ambiente na lista ao lado.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Ambientes Sidebar (Passo 4)
// ----------------------------------------------------------------------

function AmbientesSidebar({ pavimentoId, ambientes, selectedId, onSelect }: { pavimentoId: string, ambientes: Ambiente[], selectedId: string | null, onSelect: (id: string) => void }) {
  const [openAdd, setOpenAdd] = useState(false);
  const [nome, setNome] = useState("");
  const [isApt, setIsApt] = useState(false);
  const [numeroFinal, setNumeroFinal] = useState("");
  const create = useCreateAmbiente();

  const handleCreate = async () => {
    if (!nome.trim()) return;
    try {
      const payload = {
        pavimento_id: pavimentoId,
        nome: nome.trim(),
        numero_final: isApt ? parseInt(numeroFinal) : null,
        planta_storage_path: null
      };
      await create.mutateAsync(payload);
      setOpenAdd(false);
      setNome("");
      setNumeroFinal("");
      setIsApt(false);
      toast.success("Ambiente criado.");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 flex items-center justify-between border-b">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase">Ambientes</h2>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setOpenAdd(true)}>
          <Plus className="size-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {ambientes.length === 0 ? (
          <div className="text-xs text-muted-foreground text-center py-4 italic">Nenhum ambiente cadastrado.</div>
        ) : (
          ambientes.map(a => (
            <button
              key={a.id}
              onClick={() => onSelect(a.id)}
              className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                selectedId === a.id ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted text-foreground"
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{a.nome} {a.numero_final ? `(Final ${a.numero_final})` : ""}</span>
              </div>
            </button>
          ))
        )}
      </div>

      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Ambiente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome do Ambiente</Label>
              <Input placeholder="Ex: Portaria, Hall, Apartamento..." value={nome} onChange={e => setNome(e.target.value)} />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" id="isApt" checked={isApt} onChange={e => setIsApt(e.target.checked)} />
              <Label htmlFor="isApt" className="cursor-pointer">Este ambiente é um Apartamento com número "Final"</Label>
            </div>
            {isApt && (
              <div className="space-y-2">
                <Label>Número do Final</Label>
                <Input type="number" placeholder="Ex: 1, 2, 3..." value={numeroFinal} onChange={e => setNumeroFinal(e.target.value)} />
              </div>
            )}
            <DialogFooter>
              <Button variant="ghost" onClick={() => setOpenAdd(false)}>Cancelar</Button>
              <Button onClick={handleCreate} disabled={!nome.trim() || create.isPending}>Salvar</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ----------------------------------------------------------------------
// Ambiente Detail (Passo 5 - Pendências)
// ----------------------------------------------------------------------

function AmbienteDetail({ ambiente, obraId }: { ambiente: Ambiente, obraId: string }) {
  const pends = usePendencias(ambiente.id);
  const [openPend, setOpenPend] = useState(false);
  const [isAddingPin, setIsAddingPin] = useState(false);
  const [pinCoords, setPinCoords] = useState<{x: number, y: number} | null>(null);
  const [selectedPinId, setSelectedPinId] = useState<string | undefined>();
  
  const upload = useUploadPlantaAmbiente();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    toast.loading("Enviando planta...", { id: "upload-planta" });
    try {
      await upload.mutateAsync({ id: ambiente.id, file });
      toast.success("Planta enviada com sucesso!", { id: "upload-planta" });
    } catch (err: any) {
      toast.error(err.message, { id: "upload-planta" });
    }
  };

  const handleCreatePin = (x: number, y: number) => {
    setIsAddingPin(false);
    setPinCoords({ x, y });
    setOpenPend(true);
  };
  
  const publicUrl = ambiente.planta_storage_path 
    ? supabase.storage.from("apontamentos").getPublicUrl(ambiente.planta_storage_path).data.publicUrl
    : null;

  const pins = pends.data?.map(p => ({
    id: p.id,
    pos_x: p.pos_x ?? 0.5,
    pos_y: p.pos_y ?? 0.5,
    status: p.status === 'resolvida' ? 'resolvido' : 'aberto',
    descricao: p.descricao
  })) as any[] ?? [];

  return (
    <div className="flex flex-col h-full w-full">
      <div className="p-4 border-b bg-background flex items-center justify-between shadow-sm z-10">
        <div>
          <h2 className="text-lg font-bold">{ambiente.nome} {ambiente.numero_final ? `(Final ${ambiente.numero_final})` : ""}</h2>
          <p className="text-xs text-muted-foreground mt-1">Planta e Pendências</p>
        </div>
        
        {publicUrl && (
          <Button 
            onClick={() => setIsAddingPin(!isAddingPin)} 
            variant={isAddingPin ? "secondary" : "default"}
          >
            {isAddingPin ? (
              <>Cancelar Marcação</>
            ) : (
              <><MousePointer2 className="size-4 mr-2" /> Nova Pendência</>
            )}
          </Button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
        {!publicUrl ? (
          <Card className="bg-background border-2 border-dashed flex-none">
            <CardContent className="p-12 flex flex-col items-center justify-center text-center text-muted-foreground">
              <MapPin className="size-10 mb-2 opacity-20" />
              <h3 className="font-medium text-foreground">Sem Planta Baixa</h3>
              <p className="text-sm mt-1 max-w-sm mb-4">Faça o upload da imagem da planta para poder marcar os pontos exatos de cada pendência.</p>
              
              <Label htmlFor={`upload-planta-${ambiente.id}`} className="cursor-pointer">
                <div className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 ${upload.isPending ? 'opacity-50' : ''}`}>
                  {upload.isPending ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Upload className="size-4 mr-2" />}
                  {upload.isPending ? "Enviando..." : "Upload da Imagem"}
                </div>
              </Label>
              <input 
                id={`upload-planta-${ambiente.id}`} 
                type="file" 
                accept="image/png, image/jpeg, image/webp" 
                className="hidden" 
                onChange={handleUpload}
                disabled={upload.isPending}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="relative w-full h-[400px] lg:h-[500px] border rounded-lg overflow-hidden bg-background flex-none shadow-inner">
            {isAddingPin && (
              <div className="absolute top-2 left-2 z-10 bg-primary/90 text-primary-foreground px-3 py-1.5 rounded-full text-xs font-medium animate-pulse shadow-md flex items-center gap-2">
                <MousePointer2 className="size-3" /> Clique no exato local do problema na planta
              </div>
            )}
            <PlantaBaixaViewer
              imageUrl={publicUrl}
              pins={pins}
              addingPin={isAddingPin}
              onCreatePin={handleCreatePin}
              selectedPinId={selectedPinId}
              onPinSelect={(id) => {
                setSelectedPinId(id);
                // Scroll to the card (simplified)
                document.getElementById(`pendencia-card-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
            />
          </div>
        )}

        <h3 className="font-semibold text-lg pt-2 flex-none">Lista de Pendências</h3>
        
        {pends.isLoading ? (
          <div className="flex justify-center py-6"><Loader2 className="size-6 animate-spin" /></div>
        ) : pends.data?.length === 0 ? (
          <div className="text-center py-10 bg-background rounded-lg border">
            <CheckCircle2 className="size-10 mx-auto text-muted-foreground opacity-20 mb-3" />
            <p className="text-muted-foreground text-sm">Nenhuma pendência registrada neste ambiente.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pends.data?.map(p => (
              <div key={p.id} id={`pendencia-card-${p.id}`} className={selectedPinId === p.id ? 'ring-2 ring-primary ring-offset-1 rounded-xl transition-all' : 'transition-all'}>
                <PendenciaCard pendencia={p} obraId={obraId} />
              </div>
            ))}
          </div>
        )}
      </div>

      <NovaPendenciaDialog 
        open={openPend} 
        setOpen={setOpenPend} 
        ambiente={ambiente} 
        initialCoords={pinCoords}
      />
    </div>
  );
}

function PendenciaCard({ pendencia, obraId }: { pendencia: any, obraId: string }) {
  const resolve = useResolvePendencia();
  const [openResolve, setOpenResolve] = useState(false);
  const isResolvida = pendencia.status === "resolvida";
  const isVencida = pendencia.status === "vencida";
  
  return (
    <>
      <Card className={`border-l-4 ${isResolvida ? 'border-l-success' : isVencida ? 'border-l-destructive' : 'border-l-warning'}`}>
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
          <div className="flex-none">
            {/* Foto thumbnail */}
            {pendencia.foto_path ? (
              <div className="w-24 h-24 bg-muted rounded-md overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${supabase.storage.from('apontamentos').getPublicUrl(pendencia.foto_path).data.publicUrl})` }} />
            ) : (
              <div className="w-24 h-24 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">Sem Foto</div>
            )}
          </div>
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex justify-between items-start gap-2">
              <div>
                <span className="text-xs font-mono font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">#{pendencia.codigo}</span>
                <span className={`ml-2 text-xs font-bold uppercase ${isResolvida ? 'text-success' : isVencida ? 'text-destructive' : 'text-warning'}`}>
                  {isResolvida ? "Resolvida" : isVencida ? "Vencida" : "Em Aberto"}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                Criada: {format(new Date(pendencia.created_at), "dd/MM/yyyy")}
              </div>
            </div>
            
            <p className="mt-2 text-sm text-foreground break-words">{pendencia.descricao}</p>
            
            <div className="mt-auto pt-4 flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Prazo: {format(new Date(pendencia.prazo), "dd/MM/yyyy")}</span>
              
              {!isResolvida && (
                <Button size="sm" variant="outline" className="h-8" onClick={() => setOpenResolve(true)}>
                  <CheckCircle2 className="size-3 mr-2" /> Dar Baixa
                </Button>
              )}
              {isResolvida && pendencia.foto_baixa_path && (
                <Button size="sm" variant="ghost" className="h-8 text-success hover:text-success hover:bg-success/10" disabled>
                  <CheckCircle2 className="size-3 mr-2" /> Resolvida em {format(new Date(pendencia.data_baixa), "dd/MM")}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={openResolve} onOpenChange={setOpenResolve}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dar Baixa na Pendência #{pendencia.codigo}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Para dar baixa, é **obrigatório** anexar uma foto comprovando a resolução.</p>
            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-muted/20">
              <Camera className="size-8 text-muted-foreground mb-2" />
              <input type="file" id={`baixa-${pendencia.id}`} accept="image/*" className="hidden" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  toast.loading("Enviando foto de resolução...", { id: "upload" });
                  const path = `${obraId}/baixas/${pendencia.id}_${Date.now()}.jpg`;
                  const { error } = await supabase.storage.from("apontamentos").upload(path, file);
                  if (error) throw error;
                  
                  const { data: user } = await supabase.auth.getUser();
                  await resolve.mutateAsync({
                    id: pendencia.id,
                    ambiente_id: pendencia.ambiente_id,
                    foto_baixa_path: path,
                    baixado_por_id: user.user?.id || ""
                  });
                  toast.success("Baixa realizada com sucesso!", { id: "upload" });
                  setOpenResolve(false);
                } catch (err: any) {
                  toast.error(err.message, { id: "upload" });
                }
              }} />
              <Button onClick={() => document.getElementById(`baixa-${pendencia.id}`)?.click()}>Tirar Foto de Resolução</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function NovaPendenciaDialog({ open, setOpen, ambiente, initialCoords }: { open: boolean, setOpen: (v: boolean) => void, ambiente: Ambiente, initialCoords?: { x: number, y: number } | null }) {
  const [desc, setDesc] = useState("");
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoRawFile, setFotoRawFile] = useState<File | null>(null);
  const [showCanvas, setShowCanvas] = useState(false);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [empreiteira, setEmpreiteira] = useState("");
  const [categoria, setCategoria] = useState("");
  const create = useCreatePendencia();
  const { obraId } = Route.useParams();

  const handleSave = async () => {
    if (!desc.trim()) { toast.error("A descrição é obrigatória."); return; }
    if (!fotoFile) { toast.error("A foto inicial é OBRIGATÓRIA."); return; }

    try {
      toast.loading("Salvando pendência...", { id: "save_pend" });
      const { data: user } = await supabase.auth.getUser();
      
      const codigo = `${Math.floor(Math.random() * 1000)},${Math.floor(Math.random() * 99)}`;
      const path = `${obraId}/criacao/${ambiente.id}_${Date.now()}.jpg`;
      
      const { error: upErr } = await supabase.storage.from("apontamentos").upload(path, fotoFile);
      if (upErr) throw upErr;

      await create.mutateAsync({
        ambiente_id: ambiente.id,
        codigo,
        localizacao: `Ambiente: ${ambiente.nome}`,
        descricao: desc,
        foto_path: path,
        pos_x: initialCoords?.x || null,
        pos_y: initialCoords?.y || null,
        autor_id: user.user?.id || null,
        empreiteira: empreiteira.trim() || null,
        categoria_taxonomia: categoria.trim() || null
      });

      toast.success("Pendência criada!", { id: "save_pend" });
      setDesc("");
      setFotoFile(null);
      setFotoPreview(null);
      setOpen(false);
    } catch(e: any) {
      toast.error(e.message, { id: "save_pend" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Pendência em {ambiente.nome}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label>Descrição do Problema *</Label>
            <Textarea placeholder="Descreva o que precisa ser consertado..." rows={3} value={desc} onChange={e => setDesc(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Categoria / Taxonomia</Label>
              <Input placeholder="Ex: Elétrica / Fiação" value={categoria} onChange={e => setCategoria(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Empreiteira (Con:)</Label>
              <Input placeholder="Ex: MCJ ELÉTRICA" value={empreiteira} onChange={e => setEmpreiteira(e.target.value)} />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center gap-1">Foto Inicial <span className="text-destructive">* (Obrigatória)</span></Label>
            {showCanvas && fotoRawFile ? (
              <ImageDrawCanvas 
                imageFile={fotoRawFile} 
                onSave={(file) => {
                  setFotoFile(file);
                  setFotoPreview(URL.createObjectURL(file));
                  setShowCanvas(false);
                }}
                onCancel={() => {
                  setFotoRawFile(null);
                  setShowCanvas(false);
                }}
              />
            ) : fotoPreview ? (
              <div className="relative w-full h-40 bg-muted rounded-md overflow-hidden">
                <img src={fotoPreview} className="object-cover w-full h-full" alt="Preview" />
                <Button variant="destructive" size="icon" className="absolute top-2 right-2 size-7" onClick={() => { setFotoFile(null); setFotoPreview(null); setFotoRawFile(null); }}>
                  <Trash2 className="size-3" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-muted/10">
                <Camera className="size-8 text-muted-foreground mb-2" />
                <input type="file" id="foto-nova" accept="image/*" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFotoRawFile(file);
                    setShowCanvas(true);
                  }
                }} />
                <Button variant="outline" onClick={() => document.getElementById('foto-nova')?.click()}>
                  Anexar Foto
                </Button>
              </div>
            )}
          </div>
          
          <DialogFooter className="pt-4">
            <Button variant="ghost" onClick={() => {
              setOpen(false);
              setFotoFile(null);
              setFotoRawFile(null);
              setFotoPreview(null);
              setShowCanvas(false);
              setDesc("");
              setCategoria("");
              setEmpreiteira("");
            }}>Cancelar</Button>
            <Button onClick={handleSave} disabled={create.isPending || !desc.trim() || !fotoFile || showCanvas}>Salvar Apontamento</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
