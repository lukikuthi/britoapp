import { createFileRoute } from "@tanstack/react-router";
import { DollarSign, FileText, Ruler, Activity, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/financeiro")({
  head: () => ({ meta: [{ title: "Financeiro — BRITO ENGENHARIA" }] }),
  component: FinanceiroDashboard,
});

function FinanceiroDashboard() {
  return (
    <div className="flex-1 flex flex-col p-6 animate-in fade-in duration-500 max-w-7xl mx-auto w-full space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <DollarSign className="size-8 text-green-600" />
          Setor Financeiro e Medições
        </h1>
        <p className="text-muted-foreground mt-1">Controle de faturamento, pagamentos, BMs (Boletins de Medição) e fluxo de caixa.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <Ruler className="size-8 text-blue-500 mb-2" />
            <CardTitle>Medições a Faturar</CardTitle>
            <CardDescription>Aguardando aprovação</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <FileText className="size-8 text-purple-500 mb-2" />
            <CardTitle>Boletins (BM)</CardTitle>
            <CardDescription>Emitidos este mês</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">18</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <DollarSign className="size-8 text-green-500 mb-2" />
            <CardTitle>Contas a Receber</CardTitle>
            <CardDescription>Próximos 15 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 142k</div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <Activity className="size-8 text-red-500 mb-2" />
            <CardTitle>Contas a Pagar</CardTitle>
            <CardDescription>Próximos 15 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 89k</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Últimos Boletins de Medição (BM)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                  <div>
                    <p className="font-medium">BM #00{i} - Empreiteira Silva</p>
                    <p className="text-xs text-muted-foreground">Obra: Residencial Vista Bella • Há {i} dias</p>
                  </div>
                  <Button variant="ghost" size="icon"><ArrowRight className="size-4" /></Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Mural do Setor</CardTitle>
            <CardDescription>Avisos importantes da diretoria para o Financeiro</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed rounded-lg bg-muted/10 h-[220px]">
              <DollarSign className="size-12 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground text-sm">
                Esta área será integrada ao módulo de obras para trazer os dados de faturamento em tempo real.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
