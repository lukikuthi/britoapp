import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Receipt, UserSquare2 } from "lucide-react";
import { useFaturamentosObra, useCriarMedicaoCliente, useCriarMedicaoTerceiro } from "@/hooks/use-financeiro";
import { useTerceiros } from "@/hooks/use-rh";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ObraFaturamentoTab({ obraId }: { obraId: string }) {
  const { data, isLoading } = useFaturamentosObra(obraId);
  const { data: empreiteiras } = useTerceiros();
  const criarMedCliente = useCriarMedicaoCliente();
  const criarMedTerceiro = useCriarMedicaoTerceiro();

  const [openCliente, setOpenCliente] = useState(false);
  const [openTerceiro, setOpenTerceiro] = useState(false);

  const [formC, setFormC] = useState({ periodo: "", valor: "", descricao: "" });
  const [formT, setFormT] = useState({ empreiteira_id: "", periodo: "", valor: "", descricao: "" });

  const handleClienteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await criarMedCliente.mutateAsync({
      obra_id: obraId,
      periodo: formC.periodo,
      valor: parseFloat(formC.valor),
      descricao: formC.descricao
    });
    setOpenCliente(false);
    setFormC({ periodo: "", valor: "", descricao: "" });
  };

  const handleTerceiroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await criarMedTerceiro.mutateAsync({
      obra_id: obraId,
      empreiteira_id: formT.empreiteira_id,
      periodo: formT.periodo,
      valor: parseFloat(formT.valor),
      descricao: formT.descricao
    });
    setOpenTerceiro(false);
    setFormT({ empreiteira_id: "", periodo: "", valor: "", descricao: "" });
  };

  if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Receipt className="size-6 text-primary" />
            Faturamento & Medições
          </h2>
          <p className="text-muted-foreground">Boletins de Medição para Faturamento de Clientes e Pagamento de Empreiteiras.</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={openTerceiro} onOpenChange={setOpenTerceiro}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-amber-500 text-amber-600 hover:bg-amber-50">
                <UserSquare2 className="size-4 mr-2" /> Medição Terceiro
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Medição de Empreiteira</DialogTitle></DialogHeader>
              <form onSubmit={handleTerceiroSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Empreiteira</Label>
                  <Select value={formT.empreiteira_id} onValueChange={v => setFormT({...formT, empreiteira_id: v})} required>
                    <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>
                      {empreiteiras?.map(e => <SelectItem key={e.id} value={e.id}>{e.razao_social}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Período / Referência</Label>
                    <Input required placeholder="Ex: Mai/2026" value={formT.periodo} onChange={e => setFormT({...formT, periodo: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Valor (R$)</Label>
                    <Input type="number" step="0.01" required value={formT.valor} onChange={e => setFormT({...formT, valor: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Serviços Medidos / Descrição</Label>
                  <Input required value={formT.descricao} onChange={e => setFormT({...formT, descricao: e.target.value})} />
                </div>
                <Button type="submit" className="w-full" disabled={criarMedTerceiro.isPending}>Salvar e Enviar p/ Financeiro</Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={openCliente} onOpenChange={setOpenCliente}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Receipt className="size-4 mr-2" /> Medição Cliente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Faturamento Contra o Cliente</DialogTitle></DialogHeader>
              <form onSubmit={handleClienteSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Período / Referência</Label>
                    <Input required placeholder="Ex: Mai/2026" value={formC.periodo} onChange={e => setFormC({...formC, periodo: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Valor (R$)</Label>
                    <Input type="number" step="0.01" required value={formC.valor} onChange={e => setFormC({...formC, valor: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Avanço / Descrição</Label>
                  <Input required placeholder="Ex: 30% Fundação concluída" value={formC.descricao} onChange={e => setFormC({...formC, descricao: e.target.value})} />
                </div>
                <Button type="submit" className="w-full" disabled={criarMedCliente.isPending}>Salvar e Enviar p/ Financeiro</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="cliente" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="cliente">Cliente (A Receber)</TabsTrigger>
          <TabsTrigger value="terceiros">Terceiros (A Pagar)</TabsTrigger>
        </TabsList>
        <TabsContent value="cliente" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {data?.clientes?.map(c => (
                  <div key={c.id} className="p-4 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-lg">{c.periodo}</div>
                      <div className="text-sm text-muted-foreground">{c.descricao}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-600 text-lg">R$ {Number(c.valor).toLocaleString('pt-BR')}</div>
                      <Badge variant={c.status === 'faturado' ? 'default' : 'secondary'}>
                        {c.status === 'faturado' ? 'NF Emitida' : 'Aguardando Financeiro'}
                      </Badge>
                    </div>
                  </div>
                ))}
                {data?.clientes?.length === 0 && <div className="p-8 text-center text-muted-foreground">Nenhuma medição registrada.</div>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="terceiros" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {data?.terceiros?.map(t => (
                  <div key={t.id} className="p-4 flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{t.empreiteira?.razao_social}</div>
                      <div className="text-sm text-muted-foreground">{t.periodo} - {t.descricao}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-amber-600">R$ {Number(t.valor).toLocaleString('pt-BR')}</div>
                      <Badge variant={t.status === 'processado' ? 'default' : 'secondary'}>
                        {t.status === 'processado' ? 'Pago' : 'Aguardando Financeiro'}
                      </Badge>
                    </div>
                  </div>
                ))}
                {data?.terceiros?.length === 0 && <div className="p-8 text-center text-muted-foreground">Nenhuma medição de empreiteira registrada.</div>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
