import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useKpisDiretoria } from "@/hooks/use-diretoria";
import { Users, TrendingUp, TrendingDown, Landmark, Building2, Loader2 } from "lucide-react";

export function DiretoriaDashboardTab() {
  const { data: kpis, isLoading } = useKpisDiretoria();

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    if (status === 'Atrasada' || status.includes('Vencidos') || status === 'Vazio') return 'bg-red-100 text-red-700';
    if (status === 'Atenção') return 'bg-amber-100 text-amber-700';
    return 'bg-emerald-100 text-emerald-700';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Building2 className="size-4 text-blue-500" /> Obras Ativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kpis?.obrasAtivas || 0}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="size-4 text-purple-500" /> Efetivo Total (RH)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kpis?.totalFuncionarios || 0}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="size-4 text-emerald-500" /> A Receber (Geral)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {formatCurrency(kpis?.financeiro.aReceber || 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingDown className="size-4 text-red-500" /> A Pagar (Geral)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(kpis?.financeiro.aPagar || 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white/90">
              <Landmark className="size-5" /> Saldo Projetado (Receber - Pagar)
            </CardTitle>
            <CardDescription className="text-white/60">
              Visão consolidada da saúde financeira imediata
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`text-5xl font-black ${(kpis?.financeiro.saldoProjetado || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {formatCurrency(kpis?.financeiro.saldoProjetado || 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Painel Executivo</CardTitle>
            <CardDescription>Resumo dos Módulos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg flex justify-between items-center">
              <span className="font-medium text-sm">Status das Obras</span>
              <span className={`text-xs px-2 py-1 rounded-full font-semibold uppercase ${getStatusColor(kpis?.painel?.obras || 'Controlado')}`}>
                {kpis?.painel?.obras || 'Controlado'}
              </span>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg flex justify-between items-center">
              <span className="font-medium text-sm">Riscos (SESMT / RH)</span>
              <span className={`text-xs px-2 py-1 rounded-full font-semibold uppercase ${getStatusColor(kpis?.painel?.riscos || 'Controlado')}`}>
                {kpis?.painel?.riscos || 'Controlado'}
              </span>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg flex justify-between items-center">
              <span className="font-medium text-sm">Estoque / Suprimentos</span>
              <span className={`text-xs px-2 py-1 rounded-full font-semibold uppercase ${getStatusColor(kpis?.painel?.estoque || 'Controlado')}`}>
                {kpis?.painel?.estoque || 'Adequado'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
