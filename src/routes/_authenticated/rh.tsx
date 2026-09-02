import { createFileRoute } from "@tanstack/react-router";
import { Users, HardHat, FileBadge, ArrowRight, UserCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/rh")({
  head: () => ({ meta: [{ title: "RH — BRITO ENGENHARIA" }] }),
  component: RhDashboard,
});

function RhDashboard() {
  return (
    <div className="flex-1 flex flex-col p-6 animate-in fade-in duration-500 max-w-7xl mx-auto w-full space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Users className="size-8 text-purple-500" />
          Setor de Recursos Humanos e SESMT
        </h1>
        <p className="text-muted-foreground mt-1">Gestão de colaboradores, admissões, folha de ponto e segurança do trabalho.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <UserCheck className="size-8 text-blue-500 mb-2" />
            <CardTitle>Colaboradores Ativos</CardTitle>
            <CardDescription>Nas obras e escritório</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">114</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <HardHat className="size-8 text-amber-500 mb-2" />
            <CardTitle>Controle SESMT</CardTitle>
            <CardDescription>EPIs e Diálogos de Segurança</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
            <p className="text-sm text-muted-foreground mt-1">Alertas pendentes</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <FileBadge className="size-8 text-green-500 mb-2" />
            <CardTitle>Documentação</CardTitle>
            <CardDescription>ASO, Fichas e Treinamentos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">98%</div>
            <p className="text-sm text-muted-foreground mt-1">Conformidade geral</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Próximos Vencimentos (ASO / Treinamento)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg bg-muted/20 border-l-4 border-l-amber-500">
                  <div>
                    <p className="font-medium">João da Silva (Pedreiro)</p>
                    <p className="text-xs text-muted-foreground">ASO vence em {i * 5} dias • Obra: Vista Bella</p>
                  </div>
                  <Button variant="ghost" size="icon"><ArrowRight className="size-4" /></Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Integração com Ponto</CardTitle>
            <CardDescription>Folha de pagamento e faltas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed rounded-lg bg-muted/10 h-[220px]">
              <Users className="size-12 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground text-sm">
                As catracas e relógios de ponto das obras enviarão dados diretamente para esta área no futuro.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
