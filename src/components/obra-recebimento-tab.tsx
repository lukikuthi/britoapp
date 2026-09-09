import { useState } from "react";
import { format } from "date-fns";
import { useRequisicoes, useReceberRequisicao } from "@/hooks/use-compras";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PackageOpen, Check, Truck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useConfirmStore } from "./confirm-dialog";

export function ObraRecebimentoTab({ obraId }: { obraId: string }) {
  const { data: requisicoes, isLoading } = useRequisicoes(obraId);
  const receberMut = useReceberRequisicao();
  const confirm = useConfirmStore(s => s.confirm);

  // Apenas as compradas/aprovadas que ainda não foram totalmente recebidas
  const pendentes = requisicoes?.filter(r => (r.status === 'aprovado' || r.status === 'comprado') && r.status_recebimento !== 'recebido') || [];
  const recebidas = requisicoes?.filter(r => r.status_recebimento === 'recebido') || [];

  const handleReceber = async (req: any) => {
    if (!(await confirm("Confirmar Recebimento", `Deseja registrar o recebimento dos materiais do Pedido #${req.id.split('-')[0]}? Isso dará entrada física no Estoque da Obra.`))) return;
    
    try {
      await receberMut.mutateAsync({
        requisicaoId: req.id,
        items: req.itens // lista de {item_id, quantidade, etc}
      });
      toast.success("Materiais recebidos com sucesso! Estoque atualizado.");
    } catch (e: any) {
      toast.error("Erro ao receber materiais: " + e.message);
    }
  };

  if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="size-5 text-primary" />
            Aguardando Chegada na Obra
          </CardTitle>
          <CardDescription>
            Pedidos aprovados pelo setor de Compras que estão a caminho do canteiro. Confirme o recebimento para dar baixa e atualizar o estoque real.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendentes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
              Nenhuma entrega pendente para esta obra.
            </div>
          ) : (
            <div className="space-y-4">
              {pendentes.map(req => (
                <div key={req.id} className="p-4 border rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">Pedido #{req.id.split('-')[0].toUpperCase()}</span>
                      <Badge variant="outline" className="bg-amber-50 text-amber-600">{req.status}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Aprovado em: {format(new Date(req.updated_at), 'dd/MM/yyyy HH:mm')}
                    </div>
                    <ul className="text-sm space-y-1">
                      {req.itens?.map((item: any) => (
                        <li key={item.id} className="flex gap-2">
                          <span className="font-medium">{item.quantidade}x</span>
                          <span className="text-muted-foreground">Item ID: {item.item_id.substring(0,8)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button onClick={() => handleReceber(req)} disabled={receberMut.isPending} className="shrink-0 bg-primary/10 text-primary hover:bg-primary/20">
                    <PackageOpen className="size-4 mr-2" />
                    Dar Entrada no Estoque
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Check className="size-5 text-emerald-500" />
            Histórico de Recebimentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recebidas.map(req => (
              <div key={req.id} className="text-sm p-3 border rounded-lg flex justify-between items-center bg-muted/5">
                <div>
                  <span className="font-medium mr-2">#{req.id.split('-')[0].toUpperCase()}</span>
                  <span className="text-muted-foreground">{req.itens?.length} itens</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Recebido em {req.data_recebimento ? format(new Date(req.data_recebimento), 'dd/MM/yyyy HH:mm') : format(new Date(req.updated_at), 'dd/MM/yyyy')}
                </div>
              </div>
            ))}
            {recebidas.length === 0 && <div className="text-sm text-muted-foreground text-center py-4">Nenhum histórico.</div>}
          </div>
        </CardContent>
      </Card>

      {/* NOVO: Retirada de Estoque */}
      <Card className="border-amber-200 bg-amber-50/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-700">
            <PackageOpen className="size-5" />
            Retirada de Material (Consumo)
          </CardTitle>
          <CardDescription>
            Registre a saída de materiais do almoxarifado para uso na obra. Isso deduzirá o saldo do estoque central.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RetiradaEstoqueForm obraId={obraId} />
        </CardContent>
      </Card>
    </div>
  );
}

// Subcomponente para o formulário de retirada
import { useEstoque } from "@/hooks/use-compras";
import { useConsumirEstoque } from "@/hooks/use-compras";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function RetiradaEstoqueForm({ obraId }: { obraId: string }) {
  const { data: estoque, isLoading } = useEstoque();
  const consumirMut = useConsumirEstoque();
  const [itemId, setItemId] = useState("");
  const [qtd, setQtd] = useState("");
  const [obs, setObs] = useState("");

  // Filtra o estoque para mostrar apenas itens que têm saldo > 0
  const itensDisponiveis = estoque?.filter(i => (i.quantidade_atual || 0) > 0) || [];
  const itemSelecionado = itensDisponiveis.find(i => i.id === itemId);

  const handleRetirar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemId || !qtd) return;
    
    try {
      await consumirMut.mutateAsync({
        item_id: itemId,
        obra_id: obraId,
        quantidade: Number(qtd),
        observacao: obs
      });
      setItemId("");
      setQtd("");
      setObs("");
    } catch (err) {}
  };

  if (isLoading) return <div className="animate-pulse h-12 bg-muted rounded-md" />;

  return (
    <form onSubmit={handleRetirar} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Material</Label>
          <Select value={itemId} onValueChange={setItemId} required>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Selecione o material" />
            </SelectTrigger>
            <SelectContent>
              {itensDisponiveis.map(item => (
                <SelectItem key={item.id} value={item.id}>
                  {item.nome} (Saldo: {item.quantidade_atual})
                </SelectItem>
              ))}
              {itensDisponiveis.length === 0 && (
                <SelectItem value="none" disabled>Nenhum material com saldo no almoxarifado</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Quantidade a Retirar</Label>
          <Input 
            type="number" 
            min="1" 
            max={itemSelecionado?.quantidade_atual || 1} 
            required 
            value={qtd} 
            onChange={e => setQtd(e.target.value)} 
            placeholder="Ex: 5"
            className="bg-background"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Observação / Destino (Opcional)</Label>
          <Input 
            value={obs} 
            onChange={e => setObs(e.target.value)} 
            placeholder="Ex: Usado na concretagem do pilar P12"
            className="bg-background"
          />
        </div>
      </div>
      <Button type="submit" disabled={consumirMut.isPending || !itemId} className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white">
        {consumirMut.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : <PackageOpen className="size-4 mr-2" />}
        Confirmar Retirada
      </Button>
    </form>
  );
}
