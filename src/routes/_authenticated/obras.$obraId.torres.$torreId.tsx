import { createFileRoute, Link, useNavigate, Outlet, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Layers, Plus, Pencil, Trash2, List, LayoutGrid, Copy } from "lucide-react";
import { usePavimentos, usePendenciasPavimentoCount, useCreatePavimento, useUpdatePavimento, useDeletePavimento, useCopyAmbientesToPavimento } from "@/hooks/use-5-passos";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRole } from "@/hooks/use-auth";
import { useConfirmStore } from "@/components/confirm-dialog";

export const Route = createFileRoute("/_authenticated/obras/$obraId/torres/$torreId")({
  component: TorreWrapper,
});

function TorreWrapper() {
  const { obraId, torreId } = Route.useParams();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const childRouteActive = pathname.includes(`/obras/${obraId}/torres/${torreId}/pavimentos/`);

  if (childRouteActive) {
    return <Outlet />;
  }

  return <TorrePavimentosView />;
}

function PavimentoCard({ obraId, torreId, p, onEdit, onDelete, onCopy, isAdmin }: { obraId: string, torreId: string, p: any, onEdit: (p: any) => void, onDelete: (p: any) => void, onCopy: (p: any) => void, isAdmin: boolean }) {
  const counts = usePendenciasPavimentoCount(p.id);
  const navigate = useNavigate();
  
  return (
    <Card 
      className="cursor-pointer hover:border-primary transition-colors relative group"
      onClick={() => navigate({ to: `/obras/${obraId}/torres/${torreId}/pavimentos/${p.id}` })}
    >
      <CardContent className="py-4 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Layers className="size-5 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="font-semibold">{p.numero_andar}º Pavimento</span>
            <span className="text-[0.65rem] text-muted-foreground uppercase">{p.tipo_pavimento}</span>
          </div>
        </div>
        <div className="text-sm flex gap-4 items-center">
          <div className="flex flex-col items-center">
            <span className="text-destructive font-medium">{counts.data?.abertas ?? 0}</span>
            <span className="text-[0.65rem] text-muted-foreground">Abertos</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-success font-medium">{counts.data?.resolvidas ?? 0}</span>
            <span className="text-[0.65rem] text-muted-foreground">Resolv.</span>
          </div>
          
          <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {isAdmin && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                title="Clonar ambientes para outros pavimentos"
                onClick={(e) => { e.stopPropagation(); onCopy(p); }}
              >
                <Copy className="size-4 text-muted-foreground" />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={(e) => { e.stopPropagation(); onEdit(p); }}
            >
              <Pencil className="size-4 text-muted-foreground" />
            </Button>
            {isAdmin && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                onClick={(e) => { e.stopPropagation(); onDelete(p); }}
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PavimentoFormDialog({ 
  open, 
  onOpenChange, 
  torreId,
  pavimentoToEdit
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  torreId: string;
  pavimentoToEdit?: any;
}) {
  const createMut = useCreatePavimento();
  const updateMut = useUpdatePavimento();
  
  const [isLote, setIsLote] = useState(false);
  const [numero, setNumero] = useState(pavimentoToEdit?.numero_andar?.toString() || "");
  const [numeroFinal, setNumeroFinal] = useState("");
  const [tipo, setTipo] = useState(pavimentoToEdit?.tipo_pavimento || "tipo");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipo) return;
    
    try {
      if (pavimentoToEdit) {
        if (!numero) return;
        await updateMut.mutateAsync({ 
          id: pavimentoToEdit.id, 
          numero_andar: parseInt(numero), 
          tipo_pavimento: tipo 
        });
        toast.success("Pavimento atualizado!");
      } else {
        if (isLote) {
          if (!numero || !numeroFinal) return;
          const start = parseInt(numero);
          const end = parseInt(numeroFinal);
          if (start > end) {
            toast.error("O andar inicial deve ser menor ou igual ao final.");
            return;
          }
          
          toast.loading("Criando andares...", { id: "batch-create" });
          const promises = [];
          for (let i = start; i <= end; i++) {
            promises.push(createMut.mutateAsync({ 
              torre_id: torreId, 
              numero_andar: i, 
              tipo_pavimento: tipo 
            }));
          }
          await Promise.all(promises);
          toast.success(`${end - start + 1} andares criados!`, { id: "batch-create" });
        } else {
          if (!numero) return;
          await createMut.mutateAsync({ 
            torre_id: torreId, 
            numero_andar: parseInt(numero), 
            tipo_pavimento: tipo 
          });
          toast.success("Pavimento criado!");
        }
      }
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message, { id: "batch-create" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{pavimentoToEdit ? "Editar Pavimento" : "Adicionar Pavimento"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {!pavimentoToEdit && (
            <div className="flex items-center space-x-2 pb-2">
              <input 
                type="checkbox" 
                id="isLote" 
                checked={isLote} 
                onChange={e => setIsLote(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="isLote" className="text-sm font-medium">
                Criar múltiplos andares (em lote)?
              </Label>
            </div>
          )}

          {isLote ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Andar Inicial</Label>
                <Input type="number" value={numero} onChange={e => setNumero(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Andar Final</Label>
                <Input type="number" value={numeroFinal} onChange={e => setNumeroFinal(e.target.value)} required />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Número do Andar (Ex: 1 para 1º Pav, -1 para Subsolo)</Label>
              <Input type="number" value={numero} onChange={e => setNumero(e.target.value)} required />
            </div>
          )}

          <div className="space-y-2">
            <Label>Tipo de Pavimento</Label>
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="garagem">Subsolo / Garagem</SelectItem>
                <SelectItem value="terreo">Térreo</SelectItem>
                <SelectItem value="mezanino">Mezanino / Pilotis</SelectItem>
                <SelectItem value="tipo">Andar Tipo</SelectItem>
                <SelectItem value="cobertura">Cobertura</SelectItem>
                <SelectItem value="tecnica">Área Técnica</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={createMut.isPending || updateMut.isPending}>
              {pavimentoToEdit ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function CloneAmbientesDialog({
  open,
  onOpenChange,
  sourcePavimento,
  allPavimentos
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourcePavimento: any;
  allPavimentos: any[];
}) {
  const [selectedDestinosIds, setSelectedDestinosIds] = useState<string[]>([]);
  const copyMut = useCopyAmbientesToPavimento();

  const targetPavimentos = allPavimentos.filter(p => p.id !== sourcePavimento?.id);

  const handleToggleAll = () => {
    if (selectedDestinosIds.length === targetPavimentos.length) {
      setSelectedDestinosIds([]);
    } else {
      setSelectedDestinosIds(targetPavimentos.map(p => p.id));
    }
  };

  const handleToggle = (id: string) => {
    setSelectedDestinosIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleCopy = async () => {
    if (selectedDestinosIds.length === 0 || !sourcePavimento) return;
    try {
      const result = await copyMut.mutateAsync({
        origemPavId: sourcePavimento.id,
        destinosPavIds: selectedDestinosIds,
      });
      if (result.errors && result.errors.length > 0) {
        toast.warning(`${result.copiedCount} pavimentos copiados com ressalvas: ${result.errors[0]}`);
      } else {
        toast.success(`${result.copiedCount} pavimentos clonados com sucesso!`);
      }
      onOpenChange(false);
      setSelectedDestinosIds([]);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const allSelected = selectedDestinosIds.length > 0 && selectedDestinosIds.length === targetPavimentos.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            Clonar Ambientes do {sourcePavimento?.numero_andar}º Pavimento
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 flex-1 overflow-y-auto pr-2">
          <p className="text-sm text-muted-foreground">
            Selecione para quais pavimentos você deseja clonar os ambientes do <strong>{sourcePavimento?.numero_andar}º Pavimento ({sourcePavimento?.tipo_pavimento})</strong>.
          </p>
          
          <div className="flex items-center space-x-2 py-2">
            <Checkbox id="select-all" checked={allSelected} onCheckedChange={handleToggleAll} />
            <Label htmlFor="select-all" className="font-semibold cursor-pointer">
              Selecionar todos os {targetPavimentos.length} pavimentos
            </Label>
          </div>
          
          <div className="space-y-3 border rounded-md p-3 max-h-60 overflow-y-auto">
            {targetPavimentos.map(p => (
              <div key={p.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`target-${p.id}`} 
                  checked={selectedDestinosIds.includes(p.id)}
                  onCheckedChange={() => handleToggle(p.id)}
                />
                <Label htmlFor={`target-${p.id}`} className="cursor-pointer text-sm font-normal">
                  {p.numero_andar}º Pavimento — {p.tipo_pavimento}
                </Label>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md p-3 text-xs text-amber-800 dark:text-amber-200">
            ⚠️ Atenção: se o pavimento de destino já tiver ambientes <strong>sem pendências</strong>, eles serão substituídos. Pavimentos com ambientes que possuem pendências ativas serão ignorados por segurança.
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleCopy} disabled={selectedDestinosIds.length === 0 || copyMut.isPending}>
            {copyMut.isPending ? "Clonando..." : `Clonar para ${selectedDestinosIds.length} destino(s)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TorrePavimentosView() {
  const { obraId, torreId } = Route.useParams();
  const { data: role } = useRole();
  const isAdmin = role === "admin";
  const [formOpen, setFormOpen] = useState(false);
  const [editingPav, setEditingPav] = useState<any>(null);
  const [copyOpen, setCopyOpen] = useState(false);
  const [copySourcePav, setCopySourcePav] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"lista" | "categorias">("categorias");
  const deleteMut = useDeletePavimento();
  
  const torre = useQuery({
    queryKey: ["torre", torreId],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await supabase.from("obra_torres" as any).select("nome").eq("id", torreId).single();
      if (error) throw error;
      return data;
    }
  });

  const pavs = usePavimentos(torreId);

  const handleEdit = (p: any) => {
    setEditingPav(p);
    setFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingPav(null);
    setFormOpen(true);
  };

  const handleDelete = async (p: any) => {
    if (await useConfirmStore.getState().confirm(
      `Remover o ${p.numero_andar}º Pavimento (${p.tipo_pavimento})? Todos os ambientes e pendências serão removidos. Esta ação não pode ser desfeita.`,
      "Remover pavimento"
    )) {
      try {
        await deleteMut.mutateAsync(p.id);
        toast.success("Pavimento removido.");
      } catch (err: any) {
        toast.error(err.message);
      }
    }
  };

  const handleCopy = (pav: any) => {
    setCopySourcePav(pav);
    setCopyOpen(true);
  };

  // Agrupar pavimentos por tipo (para vista de categorias)
  const groups: Record<string, any[]> = {};
  if (pavs.data) {
    [...pavs.data]
      // sort by numero_andar DESCENDING (top to bottom) — already sorted from query
      .forEach(p => {
        let t = (p.tipo_pavimento || "outros").toLowerCase().trim();
        // Mapear valores legados
        if (t === "subsolo" || t === "garagem") t = "garagem";
        else if (t === "térreo" || t === "terreo") t = "terreo";
        else if (t === "mezanino" || t === "pilotis") t = "mezanino";
        else if (t === "área técnica" || t === "area tecnica" || t === "tecnica") t = "tecnica";
        else if (t === "cobertura") t = "cobertura";
        else if (t === "tipo" || t === "andar tipo") t = "tipo";
        else t = "outros";
        
        if (!groups[t]) groups[t] = [];
        groups[t].push(p);
      });
  }

  // Define order of groups (top to bottom)
  const groupOrder = ["cobertura", "tecnica", "tipo", "mezanino", "terreo", "garagem", "outros"];
  
  const getGroupTitle = (tipo: string) => {
    switch(tipo) {
      case "cobertura": return "Cobertura";
      case "tecnica": return "Áreas Técnicas";
      case "tipo": return "Pavimentos Tipo";
      case "mezanino": return "Mezanino / Pilotis";
      case "terreo": return "Térreo";
      case "garagem": return "Subsolos / Garagens";
      default: return "Outros";
    }
  };

  return (
    <div className="pb-24 p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild className="-ml-2">
            <Link to={`/obras/${obraId}`} search={{ tab: "visao" } as any}>
              <ChevronLeft className="size-4" /> Voltar
            </Link>
          </Button>
          <h1 className="text-xl font-bold">{torre.data?.nome ?? "Carregando Torre..."}</h1>
        </div>
        <div className="flex items-center gap-2">
          {/* Toggle vista */}
          <div className="flex items-center border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === "lista" ? "default" : "ghost"}
              size="sm"
              className="rounded-none h-8 px-3"
              onClick={() => setViewMode("lista")}
              title="Lista numérica"
            >
              <List className="size-4" />
            </Button>
            <Button
              variant={viewMode === "categorias" ? "default" : "ghost"}
              size="sm"
              className="rounded-none h-8 px-3"
              onClick={() => setViewMode("categorias")}
              title="Agrupar por categoria"
            >
              <LayoutGrid className="size-4" />
            </Button>
          </div>
          <Button size="sm" onClick={handleAddNew}>
            <Plus className="size-4 mr-2" /> Novo Pavimento
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {pavs.isError ? (
          <div className="text-center py-6 text-destructive border rounded-lg border-destructive/20 bg-destructive/10">
            Erro ao carregar pavimentos: {pavs.error?.message}
          </div>
        ) : pavs.isLoading ? (
          <div className="text-center py-6 text-muted-foreground animate-pulse">Carregando pavimentos...</div>
        ) : pavs.data?.length === 0 ? (
          <div className="text-center py-6 text-sm text-muted-foreground border rounded-lg border-dashed">
            Nenhum pavimento cadastrado para esta torre. Clique em Novo Pavimento.
          </div>
        ) : viewMode === "lista" ? (
          /* ===== VISTA LISTA NUMÉRICA ===== */
          <div className="flex flex-col gap-3">
            {pavs.data?.map(p => (
              <PavimentoCard 
                key={p.id} 
                obraId={obraId} 
                torreId={torreId} 
                p={p} 
                onEdit={handleEdit}
                onDelete={handleDelete}
                onCopy={handleCopy}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        ) : (
          /* ===== VISTA CATEGORIAS ===== */
          <div className="flex flex-col gap-6">
            {groupOrder.map(tipo => {
              const pavList = groups[tipo];
              if (!pavList || pavList.length === 0) return null;
              
              return (
                <div key={tipo} className="space-y-3">
                  <h2 className={cn(
                    "text-xs font-bold uppercase tracking-widest border-b pb-1",
                    tipo === "garagem" ? "text-amber-800/70 border-amber-800/20" : "text-muted-foreground border-border"
                  )}>
                    {getGroupTitle(tipo)}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {pavList.map(p => (
                      <PavimentoCard 
                        key={p.id} 
                        obraId={obraId} 
                        torreId={torreId} 
                        p={p} 
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onCopy={handleCopy}
                        isAdmin={isAdmin}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {formOpen && (
        <PavimentoFormDialog 
          open={formOpen} 
          onOpenChange={setFormOpen} 
          torreId={torreId} 
          pavimentoToEdit={editingPav} 
        />
      )}

      {copyOpen && copySourcePav && (
        <CloneAmbientesDialog 
          open={copyOpen}
          onOpenChange={setCopyOpen}
          sourcePavimento={copySourcePav}
          allPavimentos={pavs.data || []}
        />
      )}
    </div>
  );
}
