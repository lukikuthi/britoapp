import { useState } from "react";
import { useRequisicoes, useAdicionarRequisicao } from "@/hooks/use-compras";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Trash2, Send, Clock, CheckCircle2, Truck, XCircle } from "lucide-react";

export function ObraRequisicoesTab({ obraId }: { obraId: string }) {
  const { data: requisicoes, isLoading } = useRequisicoes(obraId);
  const enviarReq = useAdicionarRequisicao();

  const [itens, setItens] = useState([{ nome_item: "", quantidade: 1, unidade: "un" }]);
  const [observacao, setObservacao] = useState("");

  const handleAddItem = () => {
    setItens([...itens, { nome_item: "", quantidade: 1, unidade: "un" }]);
  };

  const handleRemoveItem = (idx: number) => {
    if (itens.length > 1) {
      setItens(itens.filter((_, i) => i !== idx));
    }
  };

  const handleItemChange = (idx: number, field: string, value: any) => {
    const newItens = [...itens];
    newItens[idx] = { ...newItens[idx], [field]: value };
    setItens(newItens);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validItens = itens.filter(i => i.nome_item.trim() !== "");
    if (validItens.length === 0) return;

    await enviarReq.mutateAsync({
      obra_id: obraId,
      observacao: observacao.trim(),
      itens: validItens
    });

    setItens([{ nome_item: "", quantidade: 1, unidade: "un" }]);
    setObservacao("");
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pendente': return <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50"><Clock className="mr-1 size-3" /> Pendente</Badge>;
      case 'cotacao': return <Badge variant="outline" className="text-blue-600 border-blue-300 bg-blue-50"><Loader2 className="mr-1 size-3 animate-spin" /> Em Cotação</Badge>;
      case 'aprovado': return <Badge variant="outline" className="text-emerald-600 border-emerald-300 bg-emerald-50"><CheckCircle2 className="mr-1 size-3" /> Aprovado</Badge>;
      case 'entregue': return <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700"><Truck className="mr-1 size-3" /> Entregue</Badge>;
      case 'recusado': return <Badge variant="destructive"><XCircle className="mr-1 size-3" /> Recusado</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
      
      <Card className="lg:col-span-1 h-fit">
        <CardHeader>
          <CardTitle className="text-lg">Nova Requisição</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <Label>Itens Necessários</Label>
              {itens.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <Input 
                    placeholder="Ex: Cimento CP II" 
                    value={item.nome_item}
                    onChange={(e) => handleItemChange(idx, "nome_item", e.target.value)}
                    required
                  />
                  <Input 
                    type="number"
                    min="0.1"
                    step="any"
                    className="w-20"
                    value={item.quantidade}
                    onChange={(e) => handleItemChange(idx, "quantidade", parseFloat(e.target.value) || 1)}
                    required
                  />
                  <select 
                    className="flex h-9 w-20 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                    value={item.unidade}
                    onChange={(e) => handleItemChange(idx, "unidade", e.target.value)}
                  >
                    <option value="un">un</option>
                    <option value="kg">kg</option>
                    <option value="m">m</option>
                    <option value="m2">m²</option>
                    <option value="m3">m³</option>
                    <option value="cx">cx</option>
                    <option value="sc">saco</option>
                    <option value="l">L</option>
                  </select>
                  <Button type="button" variant="ghost" size="icon" className="text-red-500 shrink-0" onClick={() => handleRemoveItem(idx)} disabled={itens.length === 1}>
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" className="w-full mt-2" onClick={handleAddItem}>
                <Plus className="size-4 mr-2" /> Adicionar Item
              </Button>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <Label>Observações para o Compras (Opcional)</Label>
              <Textarea 
                placeholder="Ex: Urgente para concretagem de sexta-feira..." 
                value={observacao}
                onChange={e => setObservacao(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={enviarReq.isPending || !itens[0].nome_item}>
              {enviarReq.isPending ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Send className="size-4 mr-2" />}
              Enviar Pedido
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 flex flex-col h-[600px]">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-lg">Histórico de Pedidos desta Obra</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 dark:bg-slate-900/20">
          {isLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="animate-spin text-muted-foreground" /></div>
          ) : !requisicoes?.length ? (
            <div className="text-center text-muted-foreground mt-10">Nenhum pedido realizado ainda.</div>
          ) : (
            <div className="space-y-4">
              {requisicoes.map((req: any) => (
                <div key={req.id} className="bg-white dark:bg-slate-800 rounded-lg p-4 border shadow-sm flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs text-muted-foreground">Pedido #{req.id.split('-')[0].toUpperCase()}</span>
                      <p className="text-xs text-muted-foreground">Enviado por {req.autor?.nome} em {new Date(req.created_at).toLocaleString()}</p>
                    </div>
                    {getStatusBadge(req.status)}
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {req.itens?.map((i: any) => (
                      <div key={i.id} className="text-sm bg-muted/50 px-2 py-1 rounded border flex justify-between">
                        <span className="truncate mr-2">{i.nome_item}</span>
                        <span className="font-semibold text-muted-foreground shrink-0">{i.quantidade} {i.unidade}</span>
                      </div>
                    ))}
                  </div>

                  {req.observacao && (
                    <div className="text-xs text-muted-foreground border-t pt-2 mt-1">
                      <span className="font-medium">Obs:</span> {req.observacao}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
