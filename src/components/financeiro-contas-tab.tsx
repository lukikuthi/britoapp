import { useState } from "react";
import { useTransacoes, useAdicionarTransacao, useAtualizarStatusTransacao, useContasBancarias } from "@/hooks/use-financeiro";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, CheckCircle, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function FinanceiroContasTab() {
  const { data: transacoes, isLoading } = useTransacoes();
  const { data: bancos } = useContasBancarias();
  const addTransacao = useAdicionarTransacao();
  const atualizarStatus = useAtualizarStatusTransacao();
  
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    tipo: "pagar",
    descricao: "",
    fornecedor_cliente: "",
    valor: 0,
    data_vencimento: "",
    obra_id: "matriz",
    status: "pendente"
  });

  const { data: obras } = useQuery({
    queryKey: ["todas-obras"],
    queryFn: async () => {
      const { data } = await supabase.from("obras").select("id, nome").order("nome");
      return data || [];
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addTransacao.mutateAsync({
      ...form,
      obra_id: form.obra_id === "matriz" ? null : form.obra_id
    });
    setOpen(false);
  };

  const handlePagar = async (id: string, conta_id: string | null) => {
    const data_pagamento = new Date().toISOString().split('T')[0];
    await atualizarStatus.mutateAsync({ 
      id, 
      status: 'pago', 
      data_pagamento, 
      conta_id: conta_id || undefined 
    });
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Lançamentos (Pagar & Receber)</h2>
          <p className="text-sm text-muted-foreground">Gestão de faturas e recebimentos</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Novo Lançamento</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Criar Lançamento Financeiro</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select value={form.tipo} onValueChange={(v) => setForm({...form, tipo: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pagar">A Pagar (Despesa)</SelectItem>
                      <SelectItem value="receber">A Receber (Receita)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Valor (R$)</Label>
                  <Input type="number" step="0.01" required value={form.valor} onChange={e => setForm({...form, valor: parseFloat(e.target.value)})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Fornecedor / Cliente</Label>
                <Input required value={form.fornecedor_cliente} onChange={e => setForm({...form, fornecedor_cliente: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Input required value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Centro de Custo</Label>
                  <Select required onValueChange={(v) => setForm({...form, obra_id: v})}>
                    <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="matriz">Despesa Geral / Matriz</SelectItem>
                      {obras?.map(o => <SelectItem key={o.id} value={o.id}>{o.nome}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Vencimento</Label>
                  <Input type="date" required value={form.data_vencimento} onChange={e => setForm({...form, data_vencimento: e.target.value})} />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={addTransacao.isPending}>
                {addTransacao.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Salvar
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="todas" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="pagar">A Pagar</TabsTrigger>
          <TabsTrigger value="receber">A Receber</TabsTrigger>
        </TabsList>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground" /></div>
            ) : !transacoes?.length ? (
              <div className="text-center p-12 text-muted-foreground">Nenhuma transação financeira registrada.</div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground border-b">
                  <tr>
                    <th className="p-4 font-medium">Data/Vencimento</th>
                    <th className="p-4 font-medium">Fornecedor / Cliente</th>
                    <th className="p-4 font-medium">Descrição</th>
                    <th className="p-4 font-medium text-right">Valor</th>
                    <th className="p-4 font-medium text-center">Status</th>
                    <th className="p-4 font-medium text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {transacoes.map(t => {
                    const isPagar = t.tipo === 'pagar';
                    const isVencido = t.status === 'pendente' && new Date(t.data_vencimento) < new Date();
                    return (
                      <tr key={t.id} className="hover:bg-muted/50 transition-colors">
                        <td className="p-4 text-muted-foreground">
                          {new Date(t.data_vencimento).toLocaleDateString()}
                          {isVencido && <span className="block text-[10px] text-red-500 font-bold uppercase">Atrasado</span>}
                        </td>
                        <td className="p-4 font-medium">
                          {t.fornecedor_cliente}
                          <span className="block text-xs text-muted-foreground font-normal">{t.obra?.nome || 'Matriz'}</span>
                        </td>
                        <td className="p-4 text-muted-foreground">{t.descricao}</td>
                        <td className={`p-4 text-right font-medium ${isPagar ? 'text-red-600' : 'text-emerald-600'}`}>
                          {isPagar ? '-' : '+'}{formatCurrency(t.valor)}
                        </td>
                        <td className="p-4 text-center">
                          <Badge variant={t.status === 'pago' ? "default" : t.status === 'pendente' ? "outline" : "destructive"}
                                 className={t.status === 'pago' ? "bg-emerald-500" : t.status === 'pendente' ? (isVencido ? "border-red-500 text-red-600" : "text-amber-600 border-amber-300") : ""}>
                            {t.status.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="p-4 text-right">
                          {t.status === 'pendente' && (
                            <Button 
                              size="sm" 
                              variant={isPagar ? "outline" : "default"} 
                              className={isPagar ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50" : "bg-emerald-600 hover:bg-emerald-700"}
                              onClick={() => {
                                // Para acelerar visualmente, vou pegar o primeiro banco da lista como default
                                const contaBase = bancos?.[0]?.id || null;
                                handlePagar(t.id, contaBase);
                              }}
                              disabled={atualizarStatus.isPending}
                            >
                              <CheckCircle className="size-4 mr-1" /> {isPagar ? 'Pagar' : 'Receber'}
                            </Button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
