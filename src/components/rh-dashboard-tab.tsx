import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useFuncionarios, useAlertasRH } from "@/hooks/use-rh";
import { Users, AlertTriangle, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export function RhDashboardTab() {
  const { data: funcionarios, isLoading: loadFunc } = useFuncionarios();
  const { data: alertas, isLoading: loadAlertas } = useAlertasRH();

  const ativos = funcionarios?.filter(f => f.status === 'ativo').length || 0;
  const emFerias = funcionarios?.filter(f => f.status === 'ferias').length || 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="size-4 text-blue-500" /> Total Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadFunc ? <Skeleton className="h-8 w-16" /> : <div className="text-3xl font-bold">{ativos}</div>}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-500" /> Em Férias
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadFunc ? <Skeleton className="h-8 w-16" /> : <div className="text-3xl font-bold">{emFerias}</div>}
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-400 flex items-center gap-2">
              <ShieldAlert className="size-4" /> Exames a Vencer (30d)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadAlertas ? <Skeleton className="h-8 w-16 bg-amber-200" /> : <div className="text-3xl font-bold text-amber-600 dark:text-amber-500">{alertas?.exames.length || 0}</div>}
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/20 dark:border-red-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-400 flex items-center gap-2">
              <AlertTriangle className="size-4" /> NRs Vencidas/Vencendo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadAlertas ? <Skeleton className="h-8 w-16 bg-red-200" /> : <div className="text-3xl font-bold text-red-600 dark:text-red-500">{alertas?.nrs.length || 0}</div>}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Alerta de Exames (ASO)</CardTitle>
            <CardDescription>Vencem nos próximos 30 dias ou já vencidos</CardDescription>
          </CardHeader>
          <CardContent>
            {!alertas?.exames.length ? (
              <p className="text-sm text-muted-foreground">Nenhum exame crítico no momento.</p>
            ) : (
              <div className="space-y-4">
                {alertas.exames.map((ex: any) => {
                  const isVencido = new Date(ex.data_vencimento) < new Date();
                  return (
                    <div key={ex.id} className={`flex items-center justify-between p-3 border rounded-lg ${isVencido ? 'border-red-300 bg-red-50 dark:bg-red-950/30' : 'bg-muted/20'}`}>
                      <div>
                        <p className="font-medium text-sm">{ex.funcionario?.nome || 'Desconhecido'}</p>
                        <p className="text-xs text-muted-foreground uppercase">{ex.tipo_exame}</p>
                      </div>
                      <Badge variant={isVencido ? "destructive" : "outline"} className={!isVencido ? "text-amber-600 border-amber-300" : ""}>
                        {isVencido ? "Vencido" : `Vence em ${new Date(ex.data_vencimento).toLocaleDateString()}`}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alerta de NRs e Treinamentos</CardTitle>
            <CardDescription>Necessitam reciclagem urgente</CardDescription>
          </CardHeader>
          <CardContent>
            {!alertas?.nrs.length ? (
              <p className="text-sm text-muted-foreground">Nenhuma NR vencendo no momento.</p>
            ) : (
              <div className="space-y-4">
                {alertas.nrs.map((nr: any) => {
                  const isVencido = new Date(nr.data_vencimento) < new Date();
                  return (
                    <div key={nr.id} className={`flex items-center justify-between p-3 border rounded-lg ${isVencido ? 'border-red-300 bg-red-50 dark:bg-red-950/30' : 'bg-muted/20'}`}>
                      <div>
                        <p className="font-medium text-sm">{nr.funcionario?.nome || 'Desconhecido'} <span className="font-bold text-primary">({nr.norma})</span></p>
                      </div>
                      <Badge variant={isVencido ? "destructive" : "outline"} className={!isVencido ? "text-amber-600 border-amber-300" : ""}>
                        {isVencido ? "Vencido" : `Vence em ${new Date(nr.data_vencimento).toLocaleDateString()}`}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
