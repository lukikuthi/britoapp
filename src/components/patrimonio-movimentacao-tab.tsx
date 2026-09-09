import { useState } from "react";
import { useMovimentacoesAtivas, useRegistrarRetirada, useRegistrarDevolucao, useEquipamentos } from "@/hooks/use-patrimonio";
import { useObras } from "@/hooks/use-obras";
import { useFuncionarios } from "@/hooks/use-rh";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowRightCircle, ArrowDownCircle, Building, User } from "lucide-react";
import { format } from "date-fns";

export function PatrimonioMovimentacaoTab() {
  const { data: movimentacoes, isLoading } = useMovimentacoesAtivas();
  const { data: equipamentos } = useEquipamentos();
  const { data: obras } = useObras();
  const { data: funcionarios } = useFuncionarios();
  
  const registrarRetirada = useRegistrarRetirada();
  const registrarDevolucao = useRegistrarDevolucao();

  const [openRet, setOpenRet] = useState(false);
  const [retForm, setRetForm] = useState({ equipamento_id: "", obra_id: "", responsavel_id: "", condicao_retirada: "" });

  const [openDev, setOpenDev] = useState(false);
  const [devActive, setDevActive] = useState<any>(null);
  const [condicaoDev, setCondicaoDev] = useState("");

  const disponiveis = equipamentos?.filter((e: any) => e.status === 'disponivel') || [];

  const handleRetirar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!retForm.equipamento_id || !retForm.obra_id || !retForm.responsavel_id) return;
    await registrarRetirada.mutateAsync(retForm);
    setOpenRet(false);
    setRetForm({ equipamento_id: "", obra_id: "", responsavel_id: "", condicao_retirada: "" });
  };

  const handleDevolver = async () => {
    if (!devActive) return;
    await registrarDevolucao.mutateAsync({
      movimentacao_id: devActive.id,
      equipamento_id: devActive.equipamento_id,
      condicao_devolucao: condicaoDev || "Devolvido em bom estado"
    });
    setOpenDev(false);
    setDevActive(null);
    setCondicaoDev("");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Equipamentos em Uso (Obras)</h2>
          <p className="text-sm text-muted-foreground">Onde estão as ferramentas neste exato momento.</p>
        </div>
        
        <Dialog open={openRet} onOpenChange={setOpenRet}>
          <DialogTrigger asChild>
            <Button className="bg-[var(--brand-gold)] hover:bg-yellow-600 text-black">
              <ArrowRightCircle className="size-4 mr-2" /> Despachar Equipamento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Transferir para Obra</DialogTitle></DialogHeader>
            <form onSubmit={handleRetirar} className="space-y-4">
              <div className="space-y-2">
                <Label>Equipamento (Somente Disponíveis)</Label>
                <Select value={retForm.equipamento_id} onValueChange={v => setRetForm({...retForm, equipamento_id: v})}>
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    {disponiveis.map((eq: any) => (
                      <SelectItem key={eq.id} value={eq.id}>{eq.codigo_patrimonio} - {eq.nome}</SelectItem>
                    ))}
                    {disponiveis.length === 0 && <SelectItem value="vazio" disabled>Nenhum disponível no momento.</SelectItem>}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Obra Destino</Label>
                <Select value={retForm.obra_id} onValueChange={v => setRetForm({...retForm, obra_id: v})}>
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    {obras?.map((o: any) => <SelectItem key={o.id} value={o.id}>{o.nome}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Responsável (Quem Retirou/Recebeu)</Label>
                <Select value={retForm.responsavel_id} onValueChange={v => setRetForm({...retForm, responsavel_id: v})}>
                  <SelectTrigger><SelectValue placeholder="Selecione o funcionário..." /></SelectTrigger>
                  <SelectContent>
                    {funcionarios?.map((f: any) => <SelectItem key={f.id} value={f.id}>{f.nome}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Condição na Retirada (Opcional)</Label>
                <Input value={retForm.condicao_retirada} onChange={e => setRetForm({...retForm, condicao_retirada: e.target.value})} placeholder="Ex: Riscos na lateral, mas funcionando ok." />
              </div>

              <Button type="submit" className="w-full" disabled={registrarRetirada.isPending || !retForm.equipamento_id || !retForm.obra_id}>
                {registrarRetirada.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : null} Confirmar Despacho
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={openDev} onOpenChange={setOpenDev}>
        <DialogContent>
          <DialogHeader><DialogTitle>Registrar Devolução</DialogTitle></DialogHeader>
          <div className="text-sm p-4 bg-muted rounded-md mb-4">
            <p><strong>Equipamento:</strong> {devActive?.equipamento?.codigo_patrimonio} - {devActive?.equipamento?.nome}</p>
            <p><strong>Retirado por:</strong> {devActive?.responsavel?.nome}</p>
            <p><strong>Data Saída:</strong> {devActive && format(new Date(devActive.data_retirada), 'dd/MM/yyyy HH:mm')}</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Condição da Devolução</Label>
              <Textarea 
                placeholder="Ex: Devolvido perfeito / Quebrado" 
                value={condicaoDev} 
                onChange={e => setCondicaoDev(e.target.value)} 
              />
              <p className="text-[10px] text-muted-foreground">Dica: Se incluir a palavra "quebrad" ou "quebrado", o equipamento irá para Manutenção.</p>
            </div>
            <Button onClick={handleDevolver} className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={registrarDevolucao.isPending}>
              {registrarDevolucao.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : <ArrowDownCircle className="size-4 mr-2" />} 
              Confirmar Recebimento no Galpão
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center p-12"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>
          ) : !movimentacoes?.length ? (
            <div className="text-center p-12 text-muted-foreground">Nenhuma ferramenta em uso no momento. Tudo está no galpão.</div>
          ) : (
            <div className="divide-y">
              {movimentacoes.map((mov: any) => (
                <div key={mov.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-muted/50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm font-bold bg-muted px-2 py-0.5 rounded">{mov.equipamento?.codigo_patrimonio}</span>
                      <span className="font-semibold">{mov.equipamento?.nome}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                      <span className="flex items-center gap-1"><Building className="size-3" /> {mov.obra?.nome}</span>
                      <span className="flex items-center gap-1"><User className="size-3" /> Retirado por: {mov.responsavel?.nome}</span>
                      <span>Saída: {format(new Date(mov.data_retirada), 'dd/MM/yyyy')}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => { setDevActive(mov); setOpenDev(true); }}>
                    <ArrowDownCircle className="size-4 mr-2" /> Receber de Volta
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
