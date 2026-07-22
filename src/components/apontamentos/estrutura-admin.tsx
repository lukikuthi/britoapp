import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Loader2, Plus, Trash2, Layers, Settings2 } from "lucide-react";
import { toast } from "sonner";
import { AmbientesAdminDialog } from "./ambientes-admin-dialog";

const TIPOS_PAVIMENTO = [
  "Subsolo",
  "Garagem",
  "Térreo",
  "Mezanino",
  "Área Técnica",
  "Tipo",
  "Cobertura"
];

export function EstruturaObraDialog({ obraId, onClose }: { obraId: string; onClose: () => void }) {
  const qc = useQueryClient();
  const [torreNome, setTorreNome] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<{ id: string, type: 'torre' | 'pavimento', title: string } | null>(null);
  const [ambientePavimento, setAmbientePavimento] = useState<any>(null); // Controls the Ambientes Dialog

  const [pavForm, setPavForm] = useState<{
    torreId: string;
    inicio: string;
    fim: string;
    tipo: string;
  } | null>(null);

  const torres = useQuery({
    queryKey: ["obra-torres-estrutura-v2", obraId],
    queryFn: async () => {
      const { data, error } = await supabase.from("obra_torres" as any).select("id, nome, ordem").eq("obra_id", obraId).order("ordem");
      if (error) throw error;
      
      const res = [];
      for (const t of data ?? []) {
        const { data: pavs } = await supabase.from("obra_pavimentos" as any).select("*").eq("torre_id", t.id).order("numero_andar");
        res.push({ ...t, pavimentos: pavs ?? [] });
      }
      return res;
    }
  });

  const addTorre = useMutation({
    mutationFn: async () => {
      const ordem = (torres.data?.length ?? 0) + 1;
      const { error } = await supabase.from("obra_torres" as any).insert({ obra_id: obraId, nome: torreNome.trim(), ordem });
      if (error) throw error;
    },
    onSuccess: () => {
      setTorreNome("");
      toast.success("Torre adicionada.");
      qc.invalidateQueries({ queryKey: ["obra-torres-estrutura-v2", obraId] });
      qc.invalidateQueries({ queryKey: ["visao-geral", obraId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const addPavimentos = useMutation({
    mutationFn: async () => {
      if (!pavForm) return;
      const ini = parseInt(pavForm.inicio);
      const fim = pavForm.fim ? parseInt(pavForm.fim) : ini;
      
      if (isNaN(ini) || isNaN(fim) || ini > fim) throw new Error("Intervalo numérico inválido.");
      if (!pavForm.tipo.trim()) throw new Error("O tipo de pavimento é obrigatório.");

      const inserts = [];
      for (let n = ini; n <= fim; n++) {
        inserts.push({
          torre_id: pavForm.torreId,
          numero_andar: n,
          tipo_pavimento: pavForm.tipo.trim()
        });
      }
      const { error } = await supabase.from("obra_pavimentos" as any).insert(inserts);
      if (error) throw error;
    },
    onSuccess: () => {
      setPavForm(null);
      toast.success("Pavimento(s) adicionado(s).");
      qc.invalidateQueries({ queryKey: ["obra-torres-estrutura-v2", obraId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const delItem = useMutation({
    mutationFn: async ({ id, type }: { id: string, type: 'torre' | 'pavimento' }) => {
      const table = type === 'torre' ? "obra_torres" : "obra_pavimentos";
      const { error } = await supabase.from(table as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      setConfirmDelete(null);
      toast.success("Removido com sucesso.");
      qc.invalidateQueries({ queryKey: ["obra-torres-estrutura-v2", obraId] });
      qc.invalidateQueries({ queryKey: ["visao-geral", obraId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <>
      <Dialog open onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Estrutura da Obra (Os 5 Passos)</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="flex gap-2">
              <Input placeholder="Adicionar nova Torre (ex: Torre 1)" value={torreNome} onChange={(e) => setTorreNome(e.target.value)} />
              <Button onClick={() => addTorre.mutate()} disabled={!torreNome.trim() || addTorre.isPending}>
                <Plus className="size-4" />
              </Button>
            </div>

            <datalist id="tipos-pavimento">
              {TIPOS_PAVIMENTO.map(t => <option key={t} value={t} />)}
            </datalist>

            {torres.isLoading ? (
              <div className="flex justify-center py-6"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>
            ) : (
              <div className="space-y-4">
                {torres.data?.map((torre: any) => (
                  <Card key={torre.id}>
                    <CardHeader className="pb-3 border-b">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Layers className="size-4 text-primary" /> {torre.nome}
                        </CardTitle>
                        <Button variant="ghost" size="sm" className="text-destructive h-8" onClick={() => setConfirmDelete({ id: torre.id, type: 'torre', title: torre.nome })}>
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-3 space-y-3">
                      
                      {/* Add Form Moved to the Top */}
                      {pavForm?.torreId === torre.id ? (
                        <div className="p-3 border rounded-lg space-y-3 bg-muted/10 mb-4">
                          <h4 className="text-sm font-medium">Adicionar Pavimentos</h4>
                          <div className="grid grid-cols-2 gap-2">
                            <Input placeholder="Início (ex: 1)" type="number" value={pavForm.inicio} onChange={(e) => setPavForm({ ...pavForm, inicio: e.target.value })} />
                            <Input placeholder="Fim (opcional)" type="number" value={pavForm.fim} onChange={(e) => setPavForm({ ...pavForm, fim: e.target.value })} />
                          </div>
                          <Input 
                            placeholder="Tipo de Pavimento (Selecione ou digite)" 
                            list="tipos-pavimento"
                            value={pavForm.tipo}
                            onChange={(e) => setPavForm({ ...pavForm, tipo: e.target.value })} 
                          />
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setPavForm(null)}>Cancelar</Button>
                            <Button size="sm" onClick={() => addPavimentos.mutate()} disabled={addPavimentos.isPending}>Adicionar</Button>
                          </div>
                        </div>
                      ) : (
                        <Button variant="outline" size="sm" className="w-full text-xs border-dashed mb-4" onClick={() => setPavForm({ torreId: torre.id, inicio: "", fim: "", tipo: "" })}>
                          <Plus className="size-3 mr-1" /> Adicionar Pavimento(s)
                        </Button>
                      )}

                      {torre.pavimentos.length === 0 ? (
                        <div className="text-sm text-muted-foreground italic text-center py-2 border rounded border-dashed">Nenhum pavimento</div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {torre.pavimentos.map((p: any) => (
                            <div key={p.id} className="flex items-center justify-between border rounded pl-3 pr-2 py-2 text-sm bg-muted/20">
                              <div className="flex flex-col">
                                <span className="font-semibold">{p.numero_andar}º Pav.</span>
                                <span className="text-[0.65rem] uppercase text-muted-foreground">{p.tipo_pavimento}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-primary" onClick={() => setAmbientePavimento({ ...p, torreNome: torre.nome })}>
                                  <Settings2 className="size-3 mr-1" /> Ambientes
                                </Button>
                                <Button variant="ghost" size="icon" className="size-8 text-destructive opacity-50 hover:opacity-100" onClick={() => setConfirmDelete({ id: p.id, type: 'pavimento', title: `${p.numero_andar}º Pav. (${p.tipo_pavimento})` })}>
                                  <Trash2 className="size-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <AlertDialog open={!!confirmDelete} onOpenChange={(open) => !open && setConfirmDelete(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirma a exclusão?</AlertDialogTitle>
                <AlertDialogDescription>
                  Você está excluindo "{confirmDelete?.title}". Esta ação não pode ser desfeita e apagará todos os ambientes e pendências vinculados.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => confirmDelete && delItem.mutate({ id: confirmDelete.id, type: confirmDelete.type })}>
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DialogContent>
      </Dialog>

      {/* Sub-Dialog for Ambientes Admin */}
      {ambientePavimento && (
        <AmbientesAdminDialog
          pavimento={ambientePavimento}
          onClose={() => setAmbientePavimento(null)}
        />
      )}
    </>
  );
}
