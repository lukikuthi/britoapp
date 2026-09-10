import { useState, useMemo } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useFornecedores, usePedidosCompra, useCriarPedidoCompra, useAdicionarFornecedor } from "@/hooks/use-compras";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2, FileDown, PlusCircle, Trash2, Building2, AlertTriangle } from "lucide-react";
import { gerarPdfPedidoCompra } from "@/lib/pdf-pedido-compra";

// ============ PREVIEW CARD COMPONENT ============
function PreviewCard({ titulo, data }: { titulo: string; data: Record<string, string | null | undefined> }) {
  const hasData = Object.values(data).some(v => v);
  return (
    <div className={`border rounded-md p-3 text-xs ${hasData ? "bg-green-50/50 dark:bg-green-950/20 border-green-200" : "bg-yellow-50/50 dark:bg-yellow-950/20 border-yellow-300"}`}>
      <div className="font-semibold text-[11px] mb-1.5 flex items-center gap-1">
        {!hasData && <AlertTriangle className="h-3 w-3 text-yellow-500" />}
        {titulo}
      </div>
      {hasData ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-muted-foreground">
          {Object.entries(data).map(([k, v]) => v ? <div key={k}><span className="font-medium text-foreground">{k}:</span> {v}</div> : null)}
        </div>
      ) : (
        <p className="text-yellow-600 text-[10px]">Dados não cadastrados. Preencha na tela de Obras.</p>
      )}
    </div>
  );
}

export function ComprasPedidosTab() {
  const { data: fornecedores } = useFornecedores();
  const { data: pedidos, isLoading: loadPed } = usePedidosCompra();
  const criarPedido = useCriarPedidoCompra();
  const adicionarFornecedor = useAdicionarFornecedor();

  const { data: obras } = useQuery({
    queryKey: ["todas-obras"],
    queryFn: async () => {
      const { data } = await supabase.from("obras").select("*").order("nome");
      return data || [];
    }
  });

  const [open, setOpen] = useState(false);
  const [openForn, setOpenForn] = useState(false);

  const [form, setForm] = useState({
    obra_id: "",
    fornecedor_id: "",
    numero_pedido: "",
    numero_orcamento: "",
    data_pedido: new Date().toISOString().split("T")[0],
    valor_frete: 0,
    outras_despesas: 0,
    valor_seguro: 0,
    prazo_entrega: "imediato após aprovação",
    condicoes_pagamento: "28 DDL",
    autorizador: "DIALOGO ALVARO RAMOS",
  });

  const [fornForm, setFornForm] = useState({
    razao_social: "", cnpj: "", endereco: "", bairro: "", municipio: "", cep: "", telefone: "", contato: "", inscricao_estadual: ""
  });

  const [itens, setItens] = useState([{ descricao: "", quantidade: 1, unidade: "un", valor_unitario: 0 }]);

  // Obra e Fornecedor selecionados (para preview)
  const selectedObra = useMemo(() => obras?.find((o: any) => o.id === form.obra_id), [obras, form.obra_id]);
  const selectedForn = useMemo(() => fornecedores?.find((f: any) => f.id === form.fornecedor_id), [fornecedores, form.fornecedor_id]);

  const addItemRow = () => setItens([...itens, { descricao: "", quantidade: 1, unidade: "un", valor_unitario: 0 }]);
  const removeItemRow = (idx: number) => { if (itens.length > 1) setItens(itens.filter((_, i) => i !== idx)); };
  const updateItem = (idx: number, field: string, value: any) => { const n = [...itens]; n[idx] = { ...n[idx], [field]: value }; setItens(n); };

  const handleSaveFornecedor = async (e: React.FormEvent) => {
    e.preventDefault();
    await adicionarFornecedor.mutateAsync(fornForm);
    setOpenForn(false);
    setFornForm({ razao_social: "", cnpj: "", endereco: "", bairro: "", municipio: "", cep: "", telefone: "", contato: "", inscricao_estadual: "" });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const totalItens = itens.reduce((acc, curr) => acc + (curr.quantidade * curr.valor_unitario), 0);
    await criarPedido.mutateAsync({
      pedido: {
        obra_id: form.obra_id,
        fornecedor_id: form.fornecedor_id,
        numero_pedido: form.numero_pedido,
        numero_orcamento: form.numero_orcamento,
        data_pedido: form.data_pedido,
        valor_frete: form.valor_frete,
        outras_despesas: form.outras_despesas,
        valor_seguro: form.valor_seguro,
        prazo_entrega: form.prazo_entrega,
        condicoes_pagamento: form.condicoes_pagamento,
        autorizador: form.autorizador,
        valor_total: totalItens,
      },
      itens
    });
    setOpen(false);
    setForm({ obra_id: "", fornecedor_id: "", numero_pedido: "", numero_orcamento: "", data_pedido: new Date().toISOString().split("T")[0], valor_frete: 0, outras_despesas: 0, valor_seguro: 0, prazo_entrega: "imediato após aprovação", condicoes_pagamento: "28 DDL", autorizador: "DIALOGO ALVARO RAMOS" });
    setItens([{ descricao: "", quantidade: 1, unidade: "un", valor_unitario: 0 }]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Pedidos de Compra</h2>
        <div className="flex gap-2">
          {/* ========= CADASTRAR FORNECEDOR ========= */}
          <Dialog open={openForn} onOpenChange={setOpenForn}>
            <DialogTrigger asChild>
              <Button variant="outline"><Building2 className="mr-2 h-4 w-4" /> Cadastrar Fornecedor</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader><DialogTitle>Novo Fornecedor</DialogTitle></DialogHeader>
              <form onSubmit={handleSaveFornecedor} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Razão Social</Label><Input required value={fornForm.razao_social} onChange={e => setFornForm({...fornForm, razao_social: e.target.value})} /></div>
                  <div className="space-y-2"><Label>CNPJ</Label><Input required value={fornForm.cnpj} onChange={e => setFornForm({...fornForm, cnpj: e.target.value})} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Inscrição Estadual</Label><Input value={fornForm.inscricao_estadual} onChange={e => setFornForm({...fornForm, inscricao_estadual: e.target.value})} /></div>
                  <div className="space-y-2"><Label>Contato (Nome)</Label><Input required value={fornForm.contato} onChange={e => setFornForm({...fornForm, contato: e.target.value})} /></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2"><Label>Endereço</Label><Input required value={fornForm.endereco} onChange={e => setFornForm({...fornForm, endereco: e.target.value})} /></div>
                  <div className="space-y-2"><Label>Bairro</Label><Input required value={fornForm.bairro} onChange={e => setFornForm({...fornForm, bairro: e.target.value})} /></div>
                  <div className="space-y-2"><Label>Município</Label><Input required value={fornForm.municipio} onChange={e => setFornForm({...fornForm, municipio: e.target.value})} /></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2"><Label>CEP</Label><Input required value={fornForm.cep} onChange={e => setFornForm({...fornForm, cep: e.target.value})} /></div>
                  <div className="space-y-2"><Label>Telefone</Label><Input required value={fornForm.telefone} onChange={e => setFornForm({...fornForm, telefone: e.target.value})} /></div>
                </div>
                <Button type="submit" className="w-full" disabled={adicionarFornecedor.isPending}>
                  {adicionarFornecedor.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Salvar Fornecedor
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          {/* ========= NOVO PEDIDO ========= */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> Novo Pedido</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>Gerar Novo Pedido de Compra</DialogTitle></DialogHeader>
              <form onSubmit={handleSave} className="space-y-4">
                {/* Seleção de Obra e Fornecedor */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Obra de Destino</Label>
                    <Select required value={form.obra_id} onValueChange={v => setForm({...form, obra_id: v})}>
                      <SelectTrigger><SelectValue placeholder="Selecione a obra..." /></SelectTrigger>
                      <SelectContent>
                        {(obras as any[])?.map((o: any) => <SelectItem key={o.id} value={o.id}>{o.nome}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Fornecedor</Label>
                    <Select required value={form.fornecedor_id} onValueChange={v => setForm({...form, fornecedor_id: v})}>
                      <SelectTrigger><SelectValue placeholder="Selecione o fornecedor..." /></SelectTrigger>
                      <SelectContent>
                        {(fornecedores as any[])?.map((f: any) => <SelectItem key={f.id} value={f.id}>{f.razao_social}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Número Pedido, Orçamento, Data */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2"><Label>Número do Pedido</Label><Input required placeholder="Ex: 270/2026" value={form.numero_pedido} onChange={e => setForm({...form, numero_pedido: e.target.value})} /></div>
                  <div className="space-y-2"><Label>Número do Orçamento (Ref)</Label><Input placeholder="Ex: 12915-BBA301" value={form.numero_orcamento} onChange={e => setForm({...form, numero_orcamento: e.target.value})} /></div>
                  <div className="space-y-2"><Label>Data do Pedido</Label><Input type="date" required value={form.data_pedido} onChange={e => setForm({...form, data_pedido: e.target.value})} /></div>
                </div>

                {/* ========= PREVIEW DOS 5 BLOCOS ========= */}
                {(form.obra_id || form.fornecedor_id) && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm text-muted-foreground">Preview dos dados no PDF:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedForn && (
                        <PreviewCard titulo="DADOS FORNECEDOR" data={{
                          "Razão Social": selectedForn.razao_social, CNPJ: selectedForn.cnpj,
                          Endereço: selectedForn.endereco, Bairro: selectedForn.bairro,
                          Município: selectedForn.municipio, CEP: selectedForn.cep,
                          "I.E.": selectedForn.inscricao_estadual, Tel: selectedForn.telefone, Contato: selectedForn.contato,
                        }} />
                      )}
                      {selectedObra && (
                        <>
                          <PreviewCard titulo="DADOS PARA FATURAMENTO" data={{
                            "Razão Social": selectedObra.faturamento_razao_social, CNO: selectedObra.faturamento_cno,
                            CNPJ: selectedObra.faturamento_cnpj, Endereço: selectedObra.faturamento_endereco,
                            Município: selectedObra.faturamento_municipio, CEP: selectedObra.faturamento_cep,
                          }} />
                          <PreviewCard titulo="DADOS PARA COBRANÇA" data={{
                            "Razão Social": selectedObra.cobranca_razao_social, CNO: selectedObra.cobranca_cno,
                            CNPJ: selectedObra.cobranca_cnpj, Endereço: selectedObra.cobranca_endereco,
                          }} />
                          <PreviewCard titulo="DADOS PARA ENTREGA" data={{
                            Obra: selectedObra.nome, CNO: selectedObra.entrega_cno || selectedObra.faturamento_cno,
                            Endereço: selectedObra.endereco, Cidade: selectedObra.cidade,
                          }} />
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* ========= ITENS DO PEDIDO ========= */}
                <div className="border rounded-md p-4 space-y-4 bg-muted/20">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Itens do Pedido</h3>
                    <Button type="button" variant="outline" size="sm" onClick={addItemRow}><PlusCircle className="mr-1 h-4 w-4" /> Adicionar Linha</Button>
                  </div>
                  {itens.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-end">
                      <div className="w-16 space-y-1"><Label className="text-xs">Qtd</Label><Input type="number" min="0.1" step="0.1" required value={item.quantidade} onChange={e => updateItem(idx, 'quantidade', Number(e.target.value))} /></div>
                      <div className="w-16 space-y-1"><Label className="text-xs">Un</Label><Input required value={item.unidade} onChange={e => updateItem(idx, 'unidade', e.target.value)} /></div>
                      <div className="flex-1 space-y-1"><Label className="text-xs">Descrição</Label><Input required value={item.descricao} onChange={e => updateItem(idx, 'descricao', e.target.value)} /></div>
                      <div className="w-28 space-y-1"><Label className="text-xs">V. Unit. (R$)</Label><Input type="number" step="0.01" required value={item.valor_unitario} onChange={e => updateItem(idx, 'valor_unitario', Number(e.target.value))} /></div>
                      <Button type="button" variant="ghost" size="icon" className="text-destructive mb-0.5" onClick={() => removeItemRow(idx)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  ))}
                </div>

                {/* ========= CONDIÇÕES COMERCIAIS ========= */}
                <div className="border rounded-md p-4 space-y-3 bg-muted/20">
                  <h3 className="font-semibold text-sm">Condições Comerciais</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1"><Label className="text-xs">Vlr. Frete (R$)</Label><Input type="number" step="0.01" value={form.valor_frete} onChange={e => setForm({...form, valor_frete: Number(e.target.value)})} /></div>
                    <div className="space-y-1"><Label className="text-xs">Outras Despesas (R$)</Label><Input type="number" step="0.01" value={form.outras_despesas} onChange={e => setForm({...form, outras_despesas: Number(e.target.value)})} /></div>
                    <div className="space-y-1"><Label className="text-xs">Valor Seguro (R$)</Label><Input type="number" step="0.01" value={form.valor_seguro} onChange={e => setForm({...form, valor_seguro: Number(e.target.value)})} /></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1"><Label className="text-xs">Prazo de Entrega</Label><Input value={form.prazo_entrega} onChange={e => setForm({...form, prazo_entrega: e.target.value})} /></div>
                    <div className="space-y-1"><Label className="text-xs">Condições de Pagamento</Label><Input value={form.condicoes_pagamento} onChange={e => setForm({...form, condicoes_pagamento: e.target.value})} /></div>
                    <div className="space-y-1"><Label className="text-xs">Autorizador (Assinatura)</Label><Input value={form.autorizador} onChange={e => setForm({...form, autorizador: e.target.value})} /></div>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={criarPedido.isPending}>
                  {criarPedido.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Salvar e Gerar Pedido
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* ========= HISTÓRICO ========= */}
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
                  {(pedidos as any[]).map((p: any) => (
                    <tr key={p.id} className="hover:bg-muted/50 transition-colors">
                      <td className="p-3 font-bold">{p.numero_pedido}</td>
                      <td className="p-3">{format(new Date(p.data_pedido), "dd/MM/yyyy", { locale: ptBR })}</td>
                      <td className="p-3">{p.fornecedor?.razao_social || 'Fornecedor Excluído'}</td>
                      <td className="p-3">{p.obra?.nome || '-'}</td>
                      <td className="p-3 text-right font-medium">R$ {Number(p.valor_total).toFixed(2)}</td>
                      <td className="p-3 text-center">
                        <Button variant="outline" size="sm" onClick={() => gerarPdfPedidoCompra(p)}>
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
