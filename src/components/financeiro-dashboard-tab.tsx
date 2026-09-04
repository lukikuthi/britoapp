import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useContasBancarias, useTransacoes } from "@/hooks/use-financeiro";
import { ArrowUpRight, ArrowDownRight, Building, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function FinanceiroDashboardTab() {
  const { data: contas, isLoading: loadContas } = useContasBancarias();
  const { data: transacoes, isLoading: loadTransacoes } = useTransacoes();

  const saldoTotal = contas?.reduce((acc, curr) => acc + Number(curr.saldo_atual), 0) || 0;
  
  const contasAPagarPendentes = transacoes?.filter(t => t.tipo === 'pagar' && t.status === 'pendente') || [];
  const totalAPagar = contasAPagarPendentes.reduce((acc, curr) => acc + Number(curr.valor), 0);

  const contasAReceberPendentes = transacoes?.filter(t => t.tipo === 'receber' && t.status === 'pendente') || [];
  const totalAReceber = contasAReceberPendentes.reduce((acc, curr) => acc + Number(curr.valor), 0);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Saldo em Contas */}
        <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-400 flex items-center gap-2">
              <Building className="size-4" /> Saldo Consolidado (Bancos)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadContas ? <Skeleton className="h-8 w-24 bg-blue-200" /> : <div className="text-3xl font-bold text-blue-600 dark:text-blue-500">{formatCurrency(saldoTotal)}</div>}
          </CardContent>
        </Card>

        {/* Total a Receber */}
        <Card className="border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
              <ArrowUpRight className="size-4" /> A Receber (Pendente)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadTransacoes ? <Skeleton className="h-8 w-24 bg-emerald-200" /> : <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-500">{formatCurrency(totalAReceber)}</div>}
          </CardContent>
        </Card>

        {/* Total a Pagar */}
        <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/20 dark:border-red-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-400 flex items-center gap-2">
              <ArrowDownRight className="size-4" /> A Pagar (Pendente)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadTransacoes ? <Skeleton className="h-8 w-24 bg-red-200" /> : <div className="text-3xl font-bold text-red-600 dark:text-red-500">{formatCurrency(totalAPagar)}</div>}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Vencimentos Próximos (Pagar)</CardTitle>
          </CardHeader>
          <CardContent>
            {loadTransacoes ? (
              <div className="flex justify-center p-4"><Loader2 className="animate-spin text-muted-foreground" /></div>
            ) : contasAPagarPendentes.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma conta a pagar pendente.</p>
            ) : (
              <div className="space-y-3">
                {contasAPagarPendentes.slice(0, 5).map(conta => {
                  const isVencido = new Date(conta.data_vencimento) < new Date();
                  return (
                    <div key={conta.id} className="flex justify-between items-center p-3 border rounded-md">
                      <div>
                        <p className="font-medium text-sm">{conta.fornecedor_cliente}</p>
                        <p className="text-xs text-muted-foreground">{conta.descricao}</p>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <span className="font-semibold text-red-600">{formatCurrency(conta.valor)}</span>
                        <span className={`text-[10px] ${isVencido ? 'text-red-500 font-bold' : 'text-muted-foreground'}`}>
                          {isVencido ? 'VENCIDO' : `Vence: ${new Date(conta.data_vencimento).toLocaleDateString()}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recebimentos Esperados</CardTitle>
          </CardHeader>
          <CardContent>
            {loadTransacoes ? (
              <div className="flex justify-center p-4"><Loader2 className="animate-spin text-muted-foreground" /></div>
            ) : contasAReceberPendentes.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum recebimento pendente.</p>
            ) : (
              <div className="space-y-3">
                {contasAReceberPendentes.slice(0, 5).map(conta => (
                  <div key={conta.id} className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <p className="font-medium text-sm">{conta.fornecedor_cliente}</p>
                      <p className="text-xs text-muted-foreground">{conta.descricao}</p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <span className="font-semibold text-emerald-600">{formatCurrency(conta.valor)}</span>
                      <span className="text-[10px] text-muted-foreground">
                        Previsto: {new Date(conta.data_vencimento).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
