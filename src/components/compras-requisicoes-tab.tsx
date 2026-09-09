import { useState } from "react";
import { useRequisicoes, useAtualizarStatusRequisicao, useCotacoes, useAdicionarCotacao, useAprovarCotacao } from "@/hooks/use-compras";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2, ClipboardList, CheckCircle2, XCircle, Truck, PackageOpen } from "lucide-react";

export function ComprasRequisicoesTab() {
  const { data: requisicoes, isLoading } = useRequisicoes();
  const atualizarStatus = useAtualizarStatusRequisicao();
  const [filtroStatus, setFiltroStatus] = useState("pendente");
  const [openCotacao, setOpenCotacao] = useState(false);
  const [reqAtiva, setReqAtiva] = useState<any>(null);

  const reqsFiltradas = requisicoes?.filter(r => r.status === filtroStatus) || [];

  const handleMudarStatus = async (id: string, status: string) => {
    await atualizarStatus.mutateAsync({ id, status });
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pendente': return <ClipboardList className="size-4 text-amber-500" />;
      case 'cotacao': return <PackageOpen className="size-4 text-blue-500" />;
      case 'aprovado': return <CheckCircle2 className="size-4 text-emerald-500" />;
      case 'recusado': return <XCircle className="size-4 text-red-500" />;
      case 'entregue': return <Truck className="size-4 text-purple-500" />;
      default: return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'pendente': return 'Aguardando Análise';
      case 'cotacao': return 'Em Cotação';
      case 'aprovado': return 'Aprovado / Comprado';
      case 'recusado': return 'Recusado';
      case 'entregue': return 'Entregue na Obra';
      default: return status;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Pedidos de Material das Obras</h2>
          <p className="text-sm text-muted-foreground">Analise as requisições, faça as cotações e aprove.</p>
        </div>
        
        <Select value={filtroStatus} onValueChange={setFiltroStatus}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pendente">Aguardando Análise</SelectItem>
            <SelectItem value="cotacao">Em Cotação</SelectItem>
            <SelectItem value="aprovado">Aprovado / Comprado</SelectItem>
            <SelectItem value="entregue">Entregue na Obra</SelectItem>
            <SelectItem value="recusado">Recusados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="size-8 animate-spin text-muted-foreground" /></div>
      ) : reqsFiltradas.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <ClipboardList className="size-12 mb-4 opacity-20" />
            <p>Nenhum pedido com este status.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {reqsFiltradas.map((r: any) => (
            <Card key={r.id} className="overflow-hidden">
              <div className="bg-muted/50 p-4 border-b flex justify-between items-start">
                <div>
                  <Badge variant="outline" className="mb-2 bg-background">Obra: {r.obra?.nome || 'Matriz'}</Badge>
                  <h3 className="font-semibold flex items-center gap-2">
                    {getStatusIcon(r.status)} Pedido #{r.id.split('-')[0].toUpperCase()}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Por {r.autor?.nome} em {new Date(r.created_at).toLocaleString()}
                  </p>
                </div>
                <Select value={r.status} onValueChange={(v) => handleMudarStatus(r.id, v)}>
                  <SelectTrigger className="w-[180px] h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="cotacao">Em Cotação</SelectItem>
                    <SelectItem value="aprovado">Aprovado/Comprado</SelectItem>
                    <SelectItem value="entregue">Entregue</SelectItem>
                    <SelectItem value="recusado">Recusado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <CardContent className="p-4">
                {r.observacao && (
                  <div className="mb-4 text-sm bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-200 p-3 rounded-md border border-amber-200 dark:border-amber-900">
                    <strong>Anotação da obra:</strong> {r.observacao}
                  </div>
                )}
                
                <h4 className="text-sm font-semibold mb-2">Itens Solicitados:</h4>
                <ul className="space-y-2">
                  {r.itens?.map((item: any) => (
                    <li key={item.id} className="flex justify-between items-center text-sm p-2 bg-muted/30 rounded-md border">
                      <span className="font-medium">{item.nome_item}</span>
                      <Badge variant="secondary">{item.quantidade} {item.unidade}</Badge>
                    </li>
                  ))}
                </ul>
                
                {/* Ações baseadas no status */}
                {r.status === 'cotacao' && (
                  <Button variant="outline" className="w-full mt-4 bg-[var(--brand-gold)] hover:bg-yellow-600 text-black border-0" onClick={() => { setReqAtiva(r); setOpenCotacao(true); }}>
                    <PackageOpen className="size-4 mr-2" /> Abrir Mapa de Cotação
                  </Button>
                )}

                {r.status === 'aprovado' && (
                  <Button variant="outline" className="w-full mt-4 text-xs" size="sm" onClick={() => alert('Em breve: Isso abrirá o modal de gerar boleto automático no Financeiro.')}>
                    Gerar Boleto no Financeiro (Em Breve)
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Mapa de Cotação */}
      <Dialog open={openCotacao} onOpenChange={setOpenCotacao}>
        <DialogContent className="max-w-4xl">
          <DialogHeader><DialogTitle>Mapa de Cotação - Pedido #{reqAtiva?.id.split('-')[0].toUpperCase()}</DialogTitle></DialogHeader>
          <MapaCotacao requisicao={reqAtiva} onClose={() => setOpenCotacao(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MapaCotacao({ requisicao, onClose }: { requisicao: any, onClose: () => void }) {
  const { data: cotacoes, isLoading } = useCotacoes(requisicao?.id);
  const addCotacao = useAdicionarCotacao();
  const aprovarCotacao = useAprovarCotacao();

  const [form, setForm] = useState({ fornecedor: "", valor_total: 0, prazo_entrega_dias: 0, condicao_pagamento: "" });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fornecedor || form.valor_total <= 0) return;
    await addCotacao.mutateAsync({ ...form, requisicao_id: requisicao.id });
    setForm({ fornecedor: "", valor_total: 0, prazo_entrega_dias: 0, condicao_pagamento: "" });
  };

  if (!requisicao) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold mb-4">Adicionar Fornecedor</h3>
          <form onSubmit={handleAdd} className="space-y-4 bg-muted/30 p-4 rounded-lg border">
            <div className="space-y-2">
              <label className="text-sm font-medium">Fornecedor</label>
              <Input required value={form.fornecedor} onChange={e => setForm({...form, fornecedor: e.target.value})} placeholder="Ex: Cimento Nacional SA" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Valor Total (R$)</label>
                <Input type="number" step="0.01" required value={form.valor_total} onChange={e => setForm({...form, valor_total: parseFloat(e.target.value) || 0})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Prazo (Dias)</label>
                <Input type="number" value={form.prazo_entrega_dias} onChange={e => setForm({...form, prazo_entrega_dias: parseInt(e.target.value) || 0})} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Condição Pagamento</label>
              <Input value={form.condicao_pagamento} onChange={e => setForm({...form, condicao_pagamento: e.target.value})} placeholder="Ex: 30/60/90 dias" />
            </div>
            <Button type="submit" className="w-full" disabled={addCotacao.isPending}>
              {addCotacao.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : null} Cadastrar Orçamento
            </Button>
          </form>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-4">Comparativo</h3>
          {isLoading ? (
            <div className="flex justify-center p-8"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>
          ) : !cotacoes?.length ? (
            <p className="text-sm text-muted-foreground p-8 text-center bg-muted/10 rounded-lg border">Nenhuma cotação cadastrada.</p>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {cotacoes.map((c: any, index: number) => (
                <div key={c.id} className={`p-4 rounded-lg border flex flex-col gap-2 relative ${index === 0 ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200' : 'bg-card'}`}>
                  {index === 0 && <Badge className="absolute -top-2 -right-2 bg-emerald-500">Mais Barato</Badge>}
                  
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-sm">{c.fornecedor}</span>
                    <span className="font-bold text-lg text-emerald-600">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(c.valor_total)}
                    </span>
                  </div>
                  
                  <div className="text-xs text-muted-foreground flex justify-between">
                    <span>Prazo: {c.prazo_entrega_dias} dias</span>
                    <span>Pgto: {c.condicao_pagamento}</span>
                  </div>
                  
                  <Button 
                    size="sm" 
                    className="w-full mt-2" 
                    variant={index === 0 ? 'default' : 'outline'}
                    disabled={aprovarCotacao.isPending}
                    onClick={() => {
                      aprovarCotacao.mutate({ requisicao_id: requisicao.id, cotacao_id: c.id }, {
                        onSuccess: onClose
                      });
                    }}
                  >
                    {aprovarCotacao.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : <CheckCircle2 className="size-4 mr-2" />}
                    Aprovar Este Fornecedor
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
