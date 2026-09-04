import { useState } from "react";
import { useBoletos, useAdicionarBoleto } from "@/hooks/use-compras";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2, DollarSign } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const FORM_INITIAL = {
  obra_id: "matriz",
  fornecedor: "",
  valor: 0,
  data_emissao: new Date().toISOString().split('T')[0],
  data_vencimento: "",
  status: "pendente"
};

function formatDateBR(dateStr: string) {
  if (!dateStr) return "—";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

export function ComprasBoletosTab() {
  const { data: boletos, isLoading } = useBoletos();
  const addBoleto = useAdicionarBoleto();
  
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(FORM_INITIAL);

  const { data: obras } = useQuery({
    queryKey: ["todas-obras"],
    queryFn: async () => {
      const { data } = await supabase.from("obras").select("id, nome").order("nome");
      return data || [];
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valor = Math.max(0, form.valor);
    if (valor <= 0) return;
    await addBoleto.mutateAsync({
      ...form,
      valor,
      obra_id: form.obra_id === "matriz" ? null : form.obra_id
    });
    setOpen(false);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Boletos e Notas Fiscais</h2>
          <p className="text-sm text-muted-foreground">Envio de notas para o setor Financeiro e controle de vencimentos</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setForm(FORM_INITIAL); }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Novo Lançamento</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Lançar Boleto / Nota</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Fornecedor</Label>
                <Input required value={form.fornecedor} onChange={e => setForm({...form, fornecedor: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Valor Total (R$)</Label>
                  <Input type="number" step="0.01" min="0.01" required value={form.valor || ""} onChange={e => setForm({...form, valor: parseFloat(e.target.value) || 0})} />
                </div>
                <div className="space-y-2">
                  <Label>Alocação de Custo (Obra)</Label>
                  <Select value={form.obra_id} onValueChange={(v) => setForm({...form, obra_id: v})}>
                    <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="matriz">Despesa Administrativa (Matriz)</SelectItem>
                      {obras?.map(o => <SelectItem key={o.id} value={o.id}>{o.nome}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data de Emissão</Label>
                  <Input type="date" required value={form.data_emissao} onChange={e => setForm({...form, data_emissao: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Data de Vencimento</Label>
                  <Input type="date" required value={form.data_vencimento} onChange={e => setForm({...form, data_vencimento: e.target.value})} />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={addBoleto.isPending}>
                {addBoleto.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Cadastrar
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground" /></div>
          ) : !boletos?.length ? (
            <div className="text-center p-12 text-muted-foreground flex flex-col items-center">
              <DollarSign className="size-12 mb-3 opacity-20" />
              Nenhum boleto registrado no setor de compras.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground border-b">
                  <tr>
                    <th className="p-4 font-medium">Fornecedor</th>
                    <th className="p-4 font-medium">Obra</th>
                    <th className="p-4 font-medium">Vencimento</th>
                    <th className="p-4 font-medium text-right">Valor</th>
                    <th className="p-4 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {boletos.map(b => (
                    <tr key={b.id} className="hover:bg-muted/50 transition-colors">
                      <td className="p-4 font-medium">{b.fornecedor}</td>
                      <td className="p-4 text-muted-foreground">{b.obra?.nome || 'Matriz'}</td>
                      <td className="p-4">
                        {formatDateBR(b.data_vencimento)}
                        {b.data_vencimento < today && b.status === 'pendente' && (
                          <span className="ml-2 text-[10px] text-red-500 font-bold uppercase">Vencido</span>
                        )}
                      </td>
                      <td className="p-4 text-right font-medium">{formatCurrency(b.valor)}</td>
                      <td className="p-4 text-right">
                        <Badge variant={b.status === 'pago' ? "default" : b.status === 'pendente' ? "outline" : "destructive"}
                               className={b.status === 'pendente' ? "text-amber-600 border-amber-300 bg-amber-50" : b.status === 'pago' ? "bg-emerald-500" : ""}>
                          {b.status.toUpperCase()}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
