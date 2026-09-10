import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useFornecedores, usePedidosCompra, useCriarPedidoCompra } from "@/hooks/use-compras";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Loader2, FileDown, PlusCircle, Trash2 } from "lucide-react";
import { generateApontamentosPdf } from "@/lib/pdf-apontamentos"; // We can reuse or create a custom PDF generator later
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export function ComprasPedidosTab() {
  const { data: fornecedores, isLoading: loadForn } = useFornecedores();
  const { data: pedidos, isLoading: loadPed } = usePedidosCompra();
  const criarPedido = useCriarPedidoCompra();
  
  const { data: obras } = useQuery({
    queryKey: ["todas-obras"],
    queryFn: async () => {
      const { data } = await supabase.from("obras").select("*").order("nome");
      return data || [];
    }
  });

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    obra_id: "",
    fornecedor_id: "",
    numero_pedido: "",
    numero_orcamento: "",
    data_pedido: new Date().toISOString().split("T")[0]
  });

  const [itens, setItens] = useState([{ descricao: "", quantidade: 1, unidade: "un", valor_unitario: 0 }]);

  const addItemRow = () => setItens([...itens, { descricao: "", quantidade: 1, unidade: "un", valor_unitario: 0 }]);
  
  const removeItemRow = (idx: number) => {
    if (itens.length > 1) {
      setItens(itens.filter((_, i) => i !== idx));
    }
  };

  const updateItem = (idx: number, field: string, value: any) => {
    const newItens = [...itens];
    newItens[idx] = { ...newItens[idx], [field]: value };
    setItens(newItens);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const total = itens.reduce((acc, curr) => acc + (curr.quantidade * curr.valor_unitario), 0);
    
    await criarPedido.mutateAsync({
      pedido: {
        ...form,
        valor_total: total
      },
      itens
    });
    
    setOpen(false);
    setForm({
      obra_id: "",
      fornecedor_id: "",
      numero_pedido: "",
      numero_orcamento: "",
      data_pedido: new Date().toISOString().split("T")[0]
    });
    setItens([{ descricao: "", quantidade: 1, unidade: "un", valor_unitario: 0 }]);
  };

  const exportPDF = (pedido: any) => {
    const doc = new (jsPDF as any)();
    
    doc.setFontSize(16);
    doc.text("PEDIDO DE COMPRA", 105, 20, { align: "center" });
    
    doc.setFontSize(10);
    doc.text(`Data: ${format(new Date(pedido.data_pedido), 'dd/MM/yyyy')}`, 150, 30);
    doc.text(`Pedido: ${pedido.numero_pedido}`, 150, 35);
    if (pedido.numero_orcamento) doc.text(`Orç.: ${pedido.numero_orcamento}`, 150, 40);
    
    doc.setFontSize(12);
    doc.text(`OBRA: ${pedido.obra?.nome?.toUpperCase()}`, 14, 30);
    
    // Dados Fornecedor
    doc.setFillColor(230, 230, 230);
    doc.rect(14, 45, 180, 6, "F");
    doc.text("DADOS FORNECEDOR", 16, 49.5);
    
    doc.setFontSize(9);
    const f = pedido.fornecedor;
    doc.text(`Razão Social: ${f?.razao_social || ''}`, 14, 57);
    doc.text(`CNPJ: ${f?.cnpj || ''}`, 14, 62);
    doc.text(`Contato: ${f?.contato || ''} - Tel: ${f?.telefone || ''}`, 14, 67);
    doc.text(`Endereço: ${f?.endereco || ''} - ${f?.bairro || ''} - ${f?.municipio || ''}`, 14, 72);
    
    // Itens
    doc.setFillColor(230, 230, 230);
    doc.rect(14, 80, 180, 6, "F");
    doc.setFontSize(12);
    doc.text("ITENS DO PEDIDO", 16, 84.5);
    
    const tableData = pedido.itens.map((i: any) => [
      i.quantidade.toString(),
      i.unidade,
      i.descricao,
      `R$ ${i.valor_unitario.toFixed(2)}`,
      `R$ ${(i.quantidade * i.valor_unitario).toFixed(2)}`
    ]);
    
    (doc as any).autoTable({
      startY: 90,
      head: [['Qtd', 'Un', 'Descrição', 'Valor Unit.', 'Total']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [66, 66, 66] }
    });
    
    // Total
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text(`VALOR TOTAL: R$ ${pedido.valor_total.toFixed(2)}`, 140, finalY);
    
    doc.save(`Pedido_Compra_${pedido.numero_pedido.replace('/', '-')}.pdf`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Pedidos de Compra</h2>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Novo Pedido</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Gerar Novo Pedido de Compra</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Obra de Destino</Label>
                  <Select required value={form.obra_id} onValueChange={v => setForm({...form, obra_id: v})}>
                    <SelectTrigger><SelectValue placeholder="Selecione..."/></SelectTrigger>
                    <SelectContent>
                      {obras?.map(o => <SelectItem key={o.id} value={o.id}>{o.nome}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Fornecedor</Label>
                  <Select required value={form.fornecedor_id} onValueChange={v => setForm({...form, fornecedor_id: v})}>
                    <SelectTrigger><SelectValue placeholder="Selecione..."/></SelectTrigger>
                    <SelectContent>
                      {fornecedores?.map(f => <SelectItem key={f.id} value={f.id}>{f.razao_social}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Número do Pedido</Label>
                  <Input required placeholder="Ex: 270/2026" value={form.numero_pedido} onChange={e => setForm({...form, numero_pedido: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Número do Orçamento (Ref)</Label>
                  <Input placeholder="Ex: 12915-BBA301" value={form.numero_orcamento} onChange={e => setForm({...form, numero_orcamento: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Data do Pedido</Label>
                  <Input type="date" required value={form.data_pedido} onChange={e => setForm({...form, data_pedido: e.target.value})} />
                </div>
              </div>
              
              <div className="border rounded-md p-4 space-y-4 bg-muted/20">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Itens do Pedido</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addItemRow}><PlusCircle className="mr-1 h-4 w-4"/> Adicionar Linha</Button>
                </div>
                {itens.map((item, idx) => (
                  <div key={idx} className="flex gap-2 items-end">
                    <div className="w-16 space-y-1">
                      <Label className="text-xs">Qtd</Label>
                      <Input type="number" min="0.1" step="0.1" required value={item.quantidade} onChange={e => updateItem(idx, 'quantidade', Number(e.target.value))} />
                    </div>
                    <div className="w-16 space-y-1">
                      <Label className="text-xs">Un</Label>
                      <Input required value={item.unidade} onChange={e => updateItem(idx, 'unidade', e.target.value)} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs">Descrição do Item</Label>
                      <Input required value={item.descricao} onChange={e => updateItem(idx, 'descricao', e.target.value)} />
                    </div>
                    <div className="w-28 space-y-1">
                      <Label className="text-xs">V. Unitário (R$)</Label>
                      <Input type="number" step="0.01" required value={item.valor_unitario} onChange={e => updateItem(idx, 'valor_unitario', Number(e.target.value))} />
                    </div>
                    <Button type="button" variant="ghost" size="icon" className="text-destructive mb-0.5" onClick={() => removeItemRow(idx)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
              </div>
              
              <Button type="submit" className="w-full" disabled={criarPedido.isPending}>
                {criarPedido.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Salvar e Gerar Pedido
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Histórico de Pedidos Emitidos</CardTitle>
          <CardDescription>Visualize ou exporte novamente pedidos antigos gerados no sistema.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loadPed ? (
            <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground" /></div>
          ) : !pedidos?.length ? (
            <div className="text-center p-12 text-muted-foreground">Nenhum pedido de compra emitido.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-t">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="p-3 font-medium">Pedido</th>
                    <th className="p-3 font-medium">Data</th>
                    <th className="p-3 font-medium">Fornecedor</th>
                    <th className="p-3 font-medium">Obra</th>
                    <th className="p-3 font-medium text-right">Valor Total</th>
                    <th className="p-3 font-medium text-center">Exportar</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {pedidos.map(p => (
                    <tr key={p.id} className="hover:bg-muted/50 transition-colors">
                      <td className="p-3 font-bold">{p.numero_pedido}</td>
                      <td className="p-3">{format(new Date(p.data_pedido), "dd/MM/yyyy", { locale: ptBR })}</td>
                      <td className="p-3">{p.fornecedor?.razao_social || 'Fornecedor Excluído'}</td>
                      <td className="p-3">{p.obra?.nome || '-'}</td>
                      <td className="p-3 text-right font-medium">R$ {p.valor_total.toFixed(2)}</td>
                      <td className="p-3 text-center">
                        <Button variant="outline" size="sm" onClick={() => exportPDF(p)}>
                          <FileDown className="h-4 w-4 mr-2" /> PDF
                        </Button>
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
