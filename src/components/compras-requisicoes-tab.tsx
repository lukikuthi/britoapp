import { useState } from "react";
import { useRequisicoes, useAtualizarStatusRequisicao } from "@/hooks/use-compras";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ClipboardList, CheckCircle2, XCircle, Truck, PackageOpen } from "lucide-react";

export function ComprasRequisicoesTab() {
  const { data: requisicoes, isLoading } = useRequisicoes();
  const atualizarStatus = useAtualizarStatusRequisicao();
  const [filtroStatus, setFiltroStatus] = useState("pendente");

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
                
                {/* Integração com módulo financeiro no futuro */}
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
    </div>
  );
}
