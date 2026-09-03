import { useState } from "react";
import { useContasBancarias, useAdicionarContaBancaria } from "@/hooks/use-financeiro";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Landmark, Loader2 } from "lucide-react";

export function FinanceiroBancosTab() {
  const { data: contas, isLoading } = useContasBancarias();
  const addConta = useAdicionarContaBancaria();
  
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    nome_banco: "",
    titular: "",
    agencia: "",
    conta: "",
    saldo_atual: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addConta.mutateAsync(form);
    setOpen(false);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Contas Bancárias e Saldos</h2>
          <p className="text-sm text-muted-foreground">Gestão de caixas e contas da construtora</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Nova Conta</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Adicionar Conta Bancária</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Instituição Financeira (Banco)</Label>
                <Input required placeholder="Ex: Itaú, Caixa, Bradesco" value={form.nome_banco} onChange={e => setForm({...form, nome_banco: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Titular / Razão Social</Label>
                <Input required value={form.titular} onChange={e => setForm({...form, titular: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Agência</Label>
                  <Input value={form.agencia} onChange={e => setForm({...form, agencia: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Conta</Label>
                  <Input value={form.conta} onChange={e => setForm({...form, conta: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Saldo Inicial (R$)</Label>
                <Input type="number" step="0.01" required value={form.saldo_atual} onChange={e => setForm({...form, saldo_atual: parseFloat(e.target.value)})} />
              </div>
              <Button type="submit" className="w-full" disabled={addConta.isPending}>
                {addConta.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Adicionar
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex justify-center p-12"><Loader2 className="size-8 animate-spin text-muted-foreground" /></div>
        ) : !contas?.length ? (
          <div className="col-span-full text-center p-12 text-muted-foreground border-2 border-dashed rounded-lg">
            Nenhuma conta bancária registrada.
          </div>
        ) : (
          contas.map(c => (
            <Card key={c.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="bg-muted/50 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center">
                      <Landmark className="size-5 mr-2 text-primary" /> {c.nome_banco}
                    </CardTitle>
                    <CardDescription className="mt-1">{c.titular}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="flex justify-between text-sm">
                  <div className="text-muted-foreground">Agência<br/><span className="text-foreground font-medium">{c.agencia || '-'}</span></div>
                  <div className="text-muted-foreground text-right">Conta<br/><span className="text-foreground font-medium">{c.conta || '-'}</span></div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-1">Saldo Atual</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-500">
                    {formatCurrency(Number(c.saldo_atual))}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
