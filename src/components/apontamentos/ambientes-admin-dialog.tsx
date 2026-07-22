import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Trash2, Plus, Copy, AlertTriangle } from "lucide-react";
import { useAmbientes, useCreateAmbiente, useDeleteAmbiente, useReplicateAmbientes } from "@/hooks/use-5-passos";

export function AmbientesAdminDialog({ pavimento, onClose }: { pavimento: any, onClose: () => void }) {
  const [nome, setNome] = useState("");
  const [isApt, setIsApt] = useState(false);
  const [numeroFinal, setNumeroFinal] = useState("");

  const ambientes = useAmbientes(pavimento.id);
  const create = useCreateAmbiente();
  const delItem = useDeleteAmbiente();
  const replicate = useReplicateAmbientes();

  const handleCreate = async () => {
    if (!nome.trim()) return;
    try {
      const payload = {
        pavimento_id: pavimento.id,
        nome: nome.trim(),
        numero_final: isApt ? parseInt(numeroFinal) : null,
        planta_storage_path: null
      };
      await create.mutateAsync(payload);
      setNome("");
      setNumeroFinal("");
      setIsApt(false);
      toast.success("Ambiente criado.");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleReplicate = async () => {
    if (!confirm(`Deseja replicar todos os ${ambientes.data?.length} ambientes deste pavimento para os demais pavimentos "Tipo" da Torre ${pavimento.torreNome}? Ambientes vazios de destino serão sobrescritos.`)) return;
    try {
      toast.loading("Replicando ambientes...", { id: "replicate" });
      await replicate.mutateAsync({ origemPavId: pavimento.id, torreId: pavimento.torre_id });
      toast.success("Replicação concluída com sucesso!", { id: "replicate" });
      onClose(); // Fechar para atualizar a vista
    } catch (e: any) {
      toast.error(e.message, { id: "replicate" });
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">Ambientes - {pavimento.numero_andar}º Pav. ({pavimento.tipo_pavimento})</DialogTitle>
          <DialogDescription>Torre: {pavimento.torreNome}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {pavimento.tipo_pavimento.toLowerCase() === "tipo" && (
            <div className="bg-primary/10 border border-primary/20 p-3 rounded-md flex items-center justify-between">
              <div className="text-xs text-primary-foreground max-w-[200px]">
                Replique essa estrutura para todos os outros pavimentos "Tipo".
              </div>
              <Button size="sm" onClick={handleReplicate} disabled={replicate.isPending || !ambientes.data?.length}>
                <Copy className="size-3 mr-1" /> Replicar
              </Button>
            </div>
          )}

          <div className="space-y-2 p-3 bg-muted/20 border rounded-lg">
            <h4 className="text-sm font-semibold">Novo Ambiente</h4>
            <div className="space-y-2">
              <Label className="text-xs">Nome do Ambiente</Label>
              <Input size={1} className="h-8 text-sm" placeholder="Ex: Portaria, Loja 1, Quarto..." value={nome} onChange={e => setNome(e.target.value)} />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" id="isAptAdmin" checked={isApt} onChange={e => setIsApt(e.target.checked)} />
              <Label htmlFor="isAptAdmin" className="cursor-pointer text-xs">É um Apartamento com número "Final"</Label>
            </div>
            {isApt && (
              <div className="space-y-2 pt-1">
                <Label className="text-xs">Número do Final</Label>
                <Input type="number" size={1} className="h-8 text-sm" placeholder="Ex: 1, 2..." value={numeroFinal} onChange={e => setNumeroFinal(e.target.value)} />
              </div>
            )}
            <Button size="sm" className="w-full mt-2" onClick={handleCreate} disabled={!nome.trim() || create.isPending}>
              <Plus className="size-4 mr-1" /> Adicionar
            </Button>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Ambientes Cadastrados</h4>
            {ambientes.isLoading ? (
              <div className="text-center py-4 text-xs text-muted-foreground">Carregando...</div>
            ) : ambientes.data?.length === 0 ? (
              <div className="text-center py-4 text-xs text-muted-foreground border border-dashed rounded">Nenhum ambiente cadastrado.</div>
            ) : (
              <div className="space-y-1">
                {ambientes.data?.map(a => (
                  <div key={a.id} className="flex items-center justify-between bg-muted/30 p-2 rounded text-sm">
                    <span>{a.nome} {a.numero_final ? `(Final ${a.numero_final})` : ""}</span>
                    <Button variant="ghost" size="icon" className="size-6 text-destructive opacity-50 hover:opacity-100" onClick={() => delItem.mutate(a.id)}>
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}
