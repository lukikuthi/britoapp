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
    </div>
  );
}
