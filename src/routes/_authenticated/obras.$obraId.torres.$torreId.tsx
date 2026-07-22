import { createFileRoute, Link, useNavigate, Outlet, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Layers, Plus, Pencil } from "lucide-react";
import { usePavimentos, usePendenciasPavimentoCount, useCreatePavimento, useUpdatePavimento } from "@/hooks/use-5-passos";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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

function PavimentoCard({ obraId, torreId, p, onEdit }: { obraId: string, torreId: string, p: any, onEdit: (p: any) => void }) {
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
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => { e.stopPropagation(); onEdit(p); }}
          >
            <Pencil className="size-4 text-muted-foreground" />
          </Button>
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

function TorrePavimentosView() {
  const { obraId, torreId } = Route.useParams();
  const [formOpen, setFormOpen] = useState(false);
  const [editingPav, setEditingPav] = useState<any>(null);
  
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

  // Agrupar pavimentos por tipo
  const groups: Record<string, any[]> = {};
  if (pavs.data) {
    [...pavs.data]
      // sort by numero_andar DESCENDING (top to bottom)
      .sort((a, b) => (Number(b.numero_andar) || 0) - (Number(a.numero_andar) || 0))
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
        <Button size="sm" onClick={handleAddNew}>
          <Plus className="size-4 mr-2" /> Novo Pavimento
        </Button>
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
        ) : (
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
    </div>
  );
}
