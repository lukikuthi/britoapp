import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, ClipboardCheck, Loader2, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FvsSectionProps {
  rdoId: string;
  obraId: string;
}

export function FvsSection({ rdoId, obraId }: FvsSectionProps) {
  const queryClient = useQueryClient();
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [activeFvsId, setActiveFvsId] = useState<string | null>(null);

  // Load Templates
  const { data: templates = [] } = useQuery({
    queryKey: ["fvs-templates", obraId],
    queryFn: async () => {
      const { data, error } = await supabase.from("obra_fvs_templates").select("id, nome").eq("obra_id", obraId);
      if (error && error.code !== 'PGRST116') throw error;
      return data || [];
    }
  });

  // Load FVS already attached to this RDO
  const { data: fvsList = [], isLoading } = useQuery({
    queryKey: ["rdo-fvs", rdoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rdo_fvs")
        .select(`
          id, status, 
          template:obra_fvs_templates(nome)
        `)
        .eq("rdo_id", rdoId);
      if (error && error.code !== 'PGRST116') throw error;
      return data || [];
    }
  });

  const addFvsMut = useMutation({
    mutationFn: async (templateId: string) => {
      // 1. Create RDO FVS
      const { data: fvs, error: e1 } = await supabase
        .from("rdo_fvs")
        .insert({ rdo_id: rdoId, obra_id: obraId, template_id: templateId })
        .select("id").single();
      if (e1) throw e1;

      // 2. Fetch template items
      const { data: items, error: e2 } = await supabase
        .from("obra_fvs_template_itens")
        .select("id")
        .eq("template_id", templateId);
      if (e2) throw e2;

      // 3. Insert empty items
      if (items && items.length > 0) {
        const inserts = items.map(item => ({
          fvs_id: fvs.id,
          item_id: item.id
        }));
        const { error: e3 } = await supabase.from("rdo_fvs_itens").insert(inserts);
        if (e3) throw e3;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rdo-fvs", rdoId] });
      toast.success("FVS adicionada ao RDO.");
      setSelectedTemplate("");
    },
    onError: (e: any) => toast.error("Erro: " + e.message)
  });

  const handleAdd = () => {
    if (!selectedTemplate) return;
    addFvsMut.mutate(selectedTemplate);
  };

  return (
    <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
      <div className="px-4 py-3 border-b bg-muted/30 flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <ClipboardCheck className="size-4 text-primary" />
          Qualidade / FVS (Fichas de Verificação)
        </h3>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex gap-2 items-center">
          <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
            <SelectTrigger className="max-w-md">
              <SelectValue placeholder="Selecione um template de Qualidade..." />
            </SelectTrigger>
            <SelectContent>
              {templates.map(t => (
                <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>
              ))}
              {templates.length === 0 && <SelectItem value="none" disabled>Nenhum template cadastrado na obra</SelectItem>}
            </SelectContent>
          </Select>
          <Button onClick={handleAdd} disabled={!selectedTemplate || selectedTemplate === "none" || addFvsMut.isPending}>
            {addFvsMut.isPending ? <Loader2 className="size-4 animate-spin" /> : <><Plus className="size-4 mr-2" /> Adicionar FVS</>}
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-4"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>
        ) : fvsList.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">Nenhuma FVS anexada a este RDO.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {fvsList.map((fvs: any) => (
              <div key={fvs.id} className="border rounded p-3 flex justify-between items-center bg-muted/10 hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => setActiveFvsId(fvs.id)}>
                <div>
                  <p className="font-medium text-sm">{fvs.template?.nome || "FVS Sem Nome"}</p>
                  <p className={cn("text-xs", fvs.status === 'concluido' ? "text-green-600" : "text-amber-600")}>
                    {fvs.status === 'concluido' ? 'Concluída' : 'Rascunho / Pendente'}
                  </p>
                </div>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={(e) => {
                  e.stopPropagation();
                  supabase.from("rdo_fvs").delete().eq("id", fvs.id).then(() => {
                    queryClient.invalidateQueries({ queryKey: ["rdo-fvs", rdoId] });
                  });
                }}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {activeFvsId && <FvsModal fvsId={activeFvsId} onClose={() => setActiveFvsId(null)} rdoId={rdoId} />}
    </div>
  );
}

function FvsModal({ fvsId, onClose, rdoId }: { fvsId: string, onClose: () => void, rdoId: string }) {
  const queryClient = useQueryClient();

  const { data: itens = [], isLoading } = useQuery({
    queryKey: ["fvs-itens", fvsId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rdo_fvs_itens")
        .select(`
          id, conformidade, observacao,
          template_item:obra_fvs_template_itens(descricao, ordem)
        `)
        .eq("fvs_id", fvsId);
      if (error) throw error;
      return (data || []).sort((a: any, b: any) => (a.template_item?.ordem || 0) - (b.template_item?.ordem || 0));
    }
  });

  const updateItemMut = useMutation({
    mutationFn: async ({ id, conformidade, observacao }: { id: string, conformidade?: string, observacao?: string }) => {
      const payload: any = {};
      if (conformidade !== undefined) payload.conformidade = conformidade;
      if (observacao !== undefined) payload.observacao = observacao;
      const { error } = await supabase.from("rdo_fvs_itens").update(payload).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fvs-itens", fvsId] });
    }
  });

  const finishMut = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("rdo_fvs").update({ status: 'concluido' }).eq("id", fvsId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rdo-fvs", rdoId] });
      toast.success("FVS marcada como Concluída.");
      onClose();
    }
  });

  return (
    <Dialog open={true} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Preenchimento da FVS</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center p-8"><Loader2 className="size-8 animate-spin" /></div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-md border divide-y">
              {itens.map((item: any) => (
                <div key={item.id} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white hover:bg-muted/10">
                  <span className="text-sm font-medium flex-1">{item.template_item?.descricao}</span>
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant={item.conformidade === 'C' ? 'default' : 'outline'} className={item.conformidade === 'C' ? "bg-green-600 hover:bg-green-700 text-white" : ""} onClick={() => updateItemMut.mutate({ id: item.id, conformidade: 'C' })}>C</Button>
                    <Button size="sm" variant={item.conformidade === 'NC' ? 'destructive' : 'outline'} onClick={() => updateItemMut.mutate({ id: item.id, conformidade: 'NC' })}>NC</Button>
                    <Button size="sm" variant={item.conformidade === 'NA' ? 'secondary' : 'outline'} onClick={() => updateItemMut.mutate({ id: item.id, conformidade: 'NA' })}>NA</Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="ghost" onClick={onClose}>Fechar</Button>
              <Button onClick={() => finishMut.mutate()} disabled={finishMut.isPending || itens.some((i: any) => !i.conformidade)}>
                {finishMut.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : <Check className="size-4 mr-2" />}
                Concluir FVS
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
