import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { ShieldAlert, Plus, RefreshCw, CheckCircle2, Wrench, Ban } from "lucide-react";
import { useManutencoes, useRetornarOficina } from "@/hooks/use-patrimonio";
import { toast } from "sonner";
import { useConfirmStore } from "./confirm-dialog";

export function PatrimonioManutencaoTab() {
  const { data: manutencoes, isLoading } = useManutencoes();
  const retornarMut = useRetornarOficina();
  const confirm = useConfirmStore(s => s.confirm);
  
  const [openRetorno, setOpenRetorno] = useState(false);
  const [selectedManutencao, setSelectedManutencao] = useState<any>(null);
  const [retornoForm, setRetornoForm] = useState({ custo: "", statusFinal: "consertado" });

  const handleOpenRetorno = (manutencao: any) => {
    setSelectedManutencao(manutencao);
    setRetornoForm({ custo: "", statusFinal: "consertado" });
    setOpenRetorno(true);
  };

  const handleRetornar = async () => {
    try {
      await retornarMut.mutateAsync({
        id: selectedManutencao.id,
        equipamento_id: selectedManutencao.equipamento_id,
        custo_reparo: parseFloat(retornoForm.custo) || 0,
        statusFinal: retornoForm.statusFinal as "consertado" | "sucata"
      });
      setOpenRetorno(false);
    } catch (e: any) {}
  };

  if (isLoading) return <div className="text-center p-12 text-muted-foreground animate-pulse">Carregando manutenções...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <ShieldAlert className="size-5 text-primary" />
          Central de Manutenção e Reparos
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {manutencoes?.length === 0 && (
          <div className="text-center py-12 text-muted-foreground bg-muted/20 border border-dashed rounded-lg">
            Nenhuma manutenção registrada.
          </div>
        )}
        
        {manutencoes?.map(m => (
          <Card key={m.id} className={m.status === 'na_oficina' ? 'border-l-4 border-l-amber-500' : ''}>
            <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{m.equipamento?.nome}</h3>
                  <Badge variant="outline" className="bg-muted">{m.equipamento?.codigo_patrimonio}</Badge>
                  {m.status === 'na_oficina' && <Badge variant="default" className="bg-amber-500 hover:bg-amber-600 text-white">Na Oficina</Badge>}
                  {m.status === 'consertado' && <Badge variant="outline" className="text-emerald-500 bg-emerald-50"><CheckCircle2 className="size-3 mr-1" /> Consertado</Badge>}
                  {m.status === 'sucata' && <Badge variant="destructive"><Ban className="size-3 mr-1" /> Sucata / Perda</Badge>}
                </div>
                <div className="text-sm text-muted-foreground">
                  <p><strong>Motivo / Defeito:</strong> {m.motivo}</p>
                  <p><strong>Enviado em:</strong> {format(new Date(m.data_ida), 'dd/MM/yyyy')}</p>
                  {m.data_retorno && (
                    <p><strong>Retorno em:</strong> {format(new Date(m.data_retorno), 'dd/MM/yyyy')} 
                    <span className="ml-4 font-medium text-destructive">Custo de Reparo: R$ {Number(m.custo_reparo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </p>
                  )}
                </div>
              </div>

              {m.status === 'na_oficina' && (
                <div className="flex items-center sm:items-start">
                  <Button variant="default" onClick={() => handleOpenRetorno(m)}>
                    <RefreshCw className="size-4 mr-2" />
                    Registrar Retorno
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={openRetorno} onOpenChange={setOpenRetorno}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Retorno da Oficina</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Custo Total do Reparo (R$)</Label>
              <Input type="number" step="0.01" min="0" placeholder="0.00" value={retornoForm.custo} onChange={e => setRetornoForm({...retornoForm, custo: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Status Final do Equipamento</Label>
              <Select value={retornoForm.statusFinal} onValueChange={v => setRetornoForm({...retornoForm, statusFinal: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="consertado">Consertado (Retorna ao Inventário)</SelectItem>
                  <SelectItem value="sucata">Perda Total / Sucata (Baixa Definitiva)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenRetorno(false)}>Cancelar</Button>
            <Button onClick={handleRetornar} disabled={retornarMut.isPending}>
              {retornarMut.isPending ? "Salvando..." : "Confirmar Retorno"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
