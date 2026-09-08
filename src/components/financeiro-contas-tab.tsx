import { useState } from "react";
import { useTransacoes, useAdicionarTransacao, useAtualizarStatusTransacao, useContasBancarias, useCategorias, useTransacaoLogs, useAdicionarLogTransacao } from "@/hooks/use-financeiro";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, CheckCircle, Loader2, MessageSquare, Paperclip, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { uploadFileToBucket, getPublicFileUrl } from "@/lib/storage-utils";

const FORM_INITIAL = {
  tipo: "pagar",
  descricao: "",
  fornecedor_cliente: "",
  valor: 0,
  data_vencimento: "",
  obra_id: "matriz",
  categoria_id: "",
  status: "pendente"
};

function formatDateBR(dateStr: string) {
  if (!dateStr) return "—";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
};

export function FinanceiroContasTab() {
  const { data: bancos } = useContasBancarias();
  const { data: categorias } = useCategorias();
  const addTransacao = useAdicionarTransacao();
  
  const [open, setOpen] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState<string>("todas");
  const [form, setForm] = useState(FORM_INITIAL);

  const [detalhesTransacao, setDetalhesTransacao] = useState<any>(null);

  const tipoQuery = filtroTipo === "todas" ? undefined : filtroTipo as 'pagar' | 'receber';
  const { data: transacoes, isLoading } = useTransacoes(tipoQuery);

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
    await addTransacao.mutateAsync({
      ...form,
      valor,
      obra_id: form.obra_id === "matriz" ? null : form.obra_id,
      categoria_id: form.categoria_id || null
    });
    setOpen(false);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Lançamentos (Pagar & Receber)</h2>
          <p className="text-sm text-muted-foreground">Gestão de faturas, categorias DRE e comprovantes</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setForm(FORM_INITIAL); }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Novo Lançamento</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
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
                  <Label>Valor Total (R$)</Label>
                  <Input type="number" step="0.01" min="0.01" required value={form.valor || ""} onChange={e => setForm({...form, valor: parseFloat(e.target.value) || 0})} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Categoria (DRE)</Label>
                <Select value={form.categoria_id} onValueChange={(v) => setForm({...form, categoria_id: v})}>
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    {categorias?.filter(c => form.tipo === 'pagar' ? c.tipo === 'despesa' : c.tipo === 'receita').map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  <Select value={form.obra_id} onValueChange={(v) => setForm({...form, obra_id: v})}>
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
                {addTransacao.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Salvar Lançamento
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={filtroTipo} onValueChange={setFiltroTipo} className="w-full">
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
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted text-muted-foreground border-b">
                    <tr>
                      <th className="p-4 font-medium">Data/Vencimento</th>
                      <th className="p-4 font-medium">Fornecedor / Cliente</th>
                      <th className="p-4 font-medium">Categoria</th>
                      <th className="p-4 font-medium text-right">Valor</th>
                      <th className="p-4 font-medium text-center">Status</th>
                      <th className="p-4 font-medium text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {transacoes.map(t => {
                      const isPagar = t.tipo === 'pagar';
                      const isVencido = t.status === 'pendente' && t.data_vencimento < today;
                      const faltante = t.valor - (t.valor_pago || 0);

                      return (
                        <tr key={t.id} className="hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setDetalhesTransacao(t)}>
                          <td className="p-4 text-muted-foreground">
                            {formatDateBR(t.data_vencimento)}
                            {isVencido && <span className="block text-[10px] text-red-500 font-bold uppercase">Atrasado</span>}
                          </td>
                          <td className="p-4 font-medium">
                            {t.fornecedor_cliente}
                            <span className="block text-xs text-muted-foreground font-normal truncate max-w-[200px]">{t.descricao}</span>
                          </td>
                          <td className="p-4">
                            {t.categoria ? (
                              <Badge variant="outline" className={t.categoria.cor}>{t.categoria.nome}</Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className={`p-4 text-right font-medium ${isPagar ? 'text-red-600' : 'text-emerald-600'}`}>
                            {isPagar ? '-' : '+'}{formatCurrency(t.valor)}
                            {t.valor_pago > 0 && t.status === 'pendente' && (
                              <span className="block text-[10px] text-muted-foreground font-normal">
                                Falta: {formatCurrency(faltante)}
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            <Badge variant={t.status === 'pago' ? "default" : t.status === 'pendente' ? "outline" : "destructive"}
                                   className={t.status === 'pago' ? "bg-emerald-500" : t.status === 'pendente' ? (isVencido ? "border-red-500 text-red-600" : "text-amber-600 border-amber-300") : ""}>
                              {t.status.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="p-4 text-right">
                            <Button size="sm" variant="ghost" className="text-muted-foreground">
                              Detalhes <ChevronRight className="size-4 ml-1" />
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </Tabs>

      {/* Modal de Detalhes da Transação com Timeline e Anexos */}
      {detalhesTransacao && (
        <TransacaoDetalhesDialog 
          t={detalhesTransacao} 
          bancos={bancos} 
          onClose={() => setDetalhesTransacao(null)} 
        />
      )}
    </div>
  );
}

// Componente para o Modal de Detalhes (criado no mesmo arquivo para agilidade)
function TransacaoDetalhesDialog({ t, bancos, onClose }: { t: any, bancos: any[], onClose: () => void }) {
  const atualizarStatus = useAtualizarStatusTransacao();
  const { data: logs, isLoading: loadingLogs } = useTransacaoLogs(t.id);
  const addLog = useAdicionarLogTransacao();
  
  const [novoLog, setNovoLog] = useState("");
  const [pagamentoForm, setPagamentoForm] = useState({ valor: t.valor - (t.valor_pago || 0), conta_id: bancos?.[0]?.id || "" });
  const [uploading, setUploading] = useState(false);

  const isPagar = t.tipo === "pagar";
  const faltante = t.valor - (t.valor_pago || 0);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const yearStr = t.data_vencimento ? t.data_vencimento.split('-')[0] : 'geral';
      const path = await uploadFileToBucket("financeiro-anexos", file, `nfs/${yearStr}`);
      
      // Update the transaction in database
      await atualizarStatus.mutateAsync({
        id: t.id,
        status: t.status, // keep existing
        anexo_nf_url: path
      });
      
      await addLog.mutateAsync({
        transacao_id: t.id,
        mensagem: `Anexou um novo comprovante/nota fiscal.`
      });
      
      toast.success("Anexo salvo com sucesso!");
    } catch (err: any) {
      toast.error(`Erro no upload: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handlePagar = async () => {
    if (pagamentoForm.valor <= 0) return;
    const soma = (t.valor_pago || 0) + pagamentoForm.valor;
    const statusNovo = soma >= t.valor ? 'pago' : 'pendente';
    
    await atualizarStatus.mutateAsync({
      id: t.id,
      status: statusNovo,
      valor_pago: soma,
      data_pagamento: statusNovo === 'pago' ? new Date().toISOString().split('T')[0] : undefined,
      conta_id: pagamentoForm.conta_id || undefined
    });
    
    await addLog.mutateAsync({
      transacao_id: t.id,
      mensagem: `Baixa de ${formatCurrency(pagamentoForm.valor)} realizada na conta.`
    });
  };

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoLog.trim()) return;
    await addLog.mutateAsync({ transacao_id: t.id, mensagem: novoLog });
    setNovoLog("");
  };

  return (
    <Dialog open={true} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col p-0 gap-0">
        <div className="p-6 border-b bg-muted/20">
          <DialogHeader className="mb-4">
            <div className="flex justify-between items-start">
              <div>
                <DialogTitle className="text-xl">{t.fornecedor_cliente}</DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">{t.descricao}</p>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${isPagar ? 'text-red-600' : 'text-emerald-600'}`}>
                  {formatCurrency(t.valor)}
                </div>
                <Badge variant={t.status === 'pago' ? "default" : "outline"} className="mt-1">
                  {t.status.toUpperCase()}
                </Badge>
              </div>
            </div>
          </DialogHeader>

          <div className="flex gap-2 flex-wrap mb-4">
            {t.categoria && <Badge variant="secondary" className={t.categoria.cor}>{t.categoria.nome}</Badge>}
            {t.obra && <Badge variant="outline">Obra: {t.obra.nome}</Badge>}
            <Badge variant="outline">Venc: {formatDateBR(t.data_vencimento)}</Badge>
          </div>

          {/* Upload de Anexo Real */}
          <div className="mt-4 border-t pt-4">
            <h4 className="text-sm font-semibold mb-2 flex items-center"><Paperclip className="size-4 mr-2" /> Comprovante / Nota Fiscal</h4>
            {t.anexo_nf_url ? (
              <div className="flex items-center gap-4">
                <a 
                  href={getPublicFileUrl("financeiro-anexos", t.anexo_nf_url)} 
                  target="_blank" rel="noreferrer"
                  className="text-sm text-blue-600 hover:underline font-medium"
                >
                  Visualizar Anexo Atual
                </a>
                <label className="text-xs text-muted-foreground hover:text-foreground cursor-pointer underline">
                  Substituir
                  <input type="file" className="hidden" accept=".pdf,image/*" onChange={handleFileUpload} />
                </label>
              </div>
            ) : (
              <label className="border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center text-sm text-muted-foreground hover:bg-muted/50 cursor-pointer transition-colors relative">
                {uploading ? (
                  <><Loader2 className="animate-spin size-5 mb-2 text-[var(--brand-gold)]" /> Enviando...</>
                ) : (
                  <>Clique para enviar PDF ou Imagem</>
                )}
                <input type="file" className="hidden" accept=".pdf,image/*" onChange={handleFileUpload} disabled={uploading} />
              </label>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x h-[400px]">
          {/* Timeline */}
          <div className="p-6 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/20">
            <h4 className="text-sm font-semibold mb-4 flex items-center"><MessageSquare className="size-4 mr-2" /> Timeline / Anotações</h4>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {loadingLogs ? (
                <div className="flex justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div>
              ) : !logs?.length ? (
                <p className="text-xs text-muted-foreground text-center mt-10">Nenhuma anotação registrada.</p>
              ) : (
                logs.map((l: any) => (
                  <div key={l.id} className="bg-white dark:bg-slate-800 p-3 rounded-lg border shadow-sm text-sm">
                    <p className="text-foreground">{l.mensagem}</p>
                    <p className="text-[10px] text-muted-foreground mt-2">
                      {l.autor?.nome} • {new Date(l.created_at).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
            <form onSubmit={handleAddLog} className="mt-4 flex gap-2">
              <Input placeholder="Escreva uma nota..." value={novoLog} onChange={e => setNovoLog(e.target.value)} className="text-sm" />
              <Button type="submit" size="sm" disabled={addLog.isPending || !novoLog.trim()}>Salvar</Button>
            </form>
          </div>

          {/* Baixa Financeira */}
          <div className="p-6 h-full">
            <h4 className="text-sm font-semibold mb-4">Ação Financeira</h4>
            {t.status === 'pago' ? (
              <div className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 p-4 rounded-md text-center border border-emerald-200">
                <CheckCircle className="size-8 mx-auto mb-2" />
                Esta transação já está totalmente liquidada.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-muted p-3 rounded-md text-sm">
                  <div className="flex justify-between text-muted-foreground mb-1"><span>Valor Total:</span> <span>{formatCurrency(t.valor)}</span></div>
                  <div className="flex justify-between text-muted-foreground mb-2"><span>Já Pago:</span> <span>{formatCurrency(t.valor_pago || 0)}</span></div>
                  <div className="flex justify-between font-bold border-t pt-2"><span>Restante:</span> <span>{formatCurrency(faltante)}</span></div>
                </div>

                <div className="space-y-2">
                  <Label>Valor do Pagamento</Label>
                  <Input type="number" step="0.01" max={faltante} value={pagamentoForm.valor} onChange={e => setPagamentoForm({...pagamentoForm, valor: parseFloat(e.target.value) || 0})} />
                  <p className="text-[10px] text-muted-foreground">Pode ser um pagamento parcial.</p>
                </div>
                
                <div className="space-y-2">
                  <Label>Conta Bancária</Label>
                  <Select value={pagamentoForm.conta_id} onValueChange={(v) => setPagamentoForm({...pagamentoForm, conta_id: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {bancos?.map(b => <SelectItem key={b.id} value={b.id}>{b.nome_banco}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {t.status_aprovacao === 'pendente' && isPagar ? (
                  <div className="bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 p-4 rounded-md text-center border border-amber-200 mt-4">
                    <Loader2 className="size-6 mx-auto mb-2 animate-spin" />
                    <p className="text-sm font-semibold">Aguardando Aprovação da Diretoria</p>
                    <p className="text-xs mt-1">O pagamento não pode ser liberado até a assinatura do diretor.</p>
                  </div>
                ) : t.status_aprovacao === 'recusada' && isPagar ? (
                  <div className="bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 p-4 rounded-md text-center border border-red-200 mt-4">
                    <p className="text-sm font-semibold">Pagamento Recusado pela Diretoria</p>
                  </div>
                ) : (
                  <Button className="w-full mt-4" onClick={handlePagar} disabled={atualizarStatus.isPending || pagamentoForm.valor <= 0 || pagamentoForm.valor > faltante}>
                    {atualizarStatus.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : <CheckCircle className="size-4 mr-2" />}
                    Registrar Pagamento
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
