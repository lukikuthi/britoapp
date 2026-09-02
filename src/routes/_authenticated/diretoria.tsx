import { createFileRoute } from "@tanstack/react-router";
import { Briefcase, Activity, TrendingUp, AlertTriangle, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/diretoria")({
  head: () => ({ meta: [{ title: "Diretoria — BRITO ENGENHARIA" }] }),
  component: DiretoriaDashboard,
});

function DiretoriaDashboard() {
  return (
    <div className="flex-1 flex flex-col p-6 animate-in fade-in duration-500 max-w-7xl mx-auto w-full space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Briefcase className="size-8 text-[var(--brand-gold)]" />
          Painel Global da Diretoria
        </h1>
        <p className="text-muted-foreground mt-1">Visão estratégica consolidada, BI, indicadores chave e tomadas de decisão.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <Activity className="size-8 text-blue-500 mb-2" />
            <CardTitle>Avanço Físico Global</CardTitle>
            <CardDescription>Média de todas as obras</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">42.5%</div>
            <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="size-3" /> +2.1% este mês
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <Briefcase className="size-8 text-[var(--brand-gold)] mb-2" />
            <CardTitle>Faturamento Acumulado</CardTitle>
            <CardDescription>Receitas medidas (mês atual)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">R$ 1.2M</div>
            <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="size-3" /> +15% vs previsto
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <AlertTriangle className="size-8 text-red-500 mb-2" />
            <CardTitle>Alertas Críticos</CardTitle>
            <CardDescription>Riscos de custo e prazo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">2</div>
            <p className="text-sm text-muted-foreground mt-1">Atenção necessária</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Aprovações Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg bg-muted/20 border-l-4 border-l-[var(--brand-gold)]">
                  <div>
                    <p className="font-medium">Orçamento Extraordinário - Vista Bella</p>
                    <p className="text-xs text-muted-foreground">Solicitado por: Eng. Roberto • Valor: R$ 45.000</p>
                  </div>
                  <Button variant="outline" size="sm">Analisar</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Business Intelligence (BI)</CardTitle>
            <CardDescription>Integração com Power BI / Dashboards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed rounded-lg bg-muted/10 h-[220px]">
              <Activity className="size-12 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground text-sm">
                Os gráficos consolidados aparecerão aqui de acordo com o planejamento de indicadores da diretoria.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
