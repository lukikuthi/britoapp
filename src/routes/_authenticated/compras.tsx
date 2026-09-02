import { createFileRoute } from "@tanstack/react-router";
import { ShoppingCart, PackageOpen, Truck, FileText, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/compras")({
  head: () => ({ meta: [{ title: "Compras — BRITO ENGENHARIA" }] }),
  component: ComprasDashboard,
});

function ComprasDashboard() {
  return (
    <div className="flex-1 flex flex-col p-6 animate-in fade-in duration-500 max-w-7xl mx-auto w-full space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <ShoppingCart className="size-8 text-amber-500" />
          Setor de Compras e Suprimentos
        </h1>
        <p className="text-muted-foreground mt-1">Gestão centralizada de cotações, pedidos e fornecedores de todas as obras.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <PackageOpen className="size-8 text-blue-500 mb-2" />
            <CardTitle>Requisições Pendentes</CardTitle>
            <CardDescription>Materiais solicitados pelos engenheiros no canteiro</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <p className="text-sm text-muted-foreground mt-1">Aguardando cotação</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <FileText className="size-8 text-amber-500 mb-2" />
            <CardTitle>Cotações em Andamento</CardTitle>
            <CardDescription>Análise de propostas de fornecedores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5</div>
            <p className="text-sm text-muted-foreground mt-1">Comparativos ativos</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <Truck className="size-8 text-green-500 mb-2" />
            <CardTitle>Pedidos Emitidos</CardTitle>
            <CardDescription>Acompanhamento de entregas nas obras</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
            <p className="text-sm text-muted-foreground mt-1">A caminho</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Últimas Solicitações das Obras</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                  <div>
                    <p className="font-medium">Cimento Portland CP-II (50 sacos)</p>
                    <p className="text-xs text-muted-foreground">Obra: Residencial Vista Bella • Há 2 horas</p>
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
            <CardDescription>Avisos importantes da diretoria para Compras</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed rounded-lg bg-muted/10 h-[220px]">
              <ShoppingCart className="size-12 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground text-sm">
                Esta área será alimentada com os dados reais de requisições enviadas a partir dos diários e apontamentos das obras.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
