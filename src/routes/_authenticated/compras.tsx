import { createFileRoute } from "@tanstack/react-router";
import { ShoppingCart, LayoutDashboard, PackageOpen, ShieldAlert, FileText, MessageSquare } from "lucide-react";
import { requireModulo } from "@/lib/auth-guards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ComprasDashboardTab } from "@/components/compras-dashboard-tab";
import { ComprasEstoqueTab } from "@/components/compras-estoque-tab";

import { ComprasCertificadosTab } from "@/components/compras-certificados-tab";
import { ComprasBoletosTab } from "@/components/compras-boletos-tab";
import { ComprasMensagensTab } from "@/components/compras-mensagens-tab";

export const Route = createFileRoute("/_authenticated/compras")({
  head: () => ({ meta: [{ title: "Compras — BRITO ENGENHARIA" }] }),
  beforeLoad: async () => await requireModulo("compras"),
  component: ComprasDashboard,
});

function ComprasDashboard() {
  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500 max-w-7xl mx-auto w-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <ShoppingCart className="size-8 text-amber-500" />
          Setor de Compras e Suprimentos
        </h1>
        <p className="text-muted-foreground mt-1">Gestão de estoque, certificados, emissão de boletos e requisições.</p>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 max-w-4xl h-auto p-1 bg-muted/50">
          <TabsTrigger value="dashboard" className="py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Painel Geral
          </TabsTrigger>
          <TabsTrigger value="estoque" className="py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <PackageOpen className="w-4 h-4 mr-2" />
            Estoque / EPIs
          </TabsTrigger>
          <TabsTrigger value="certificados" className="py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <ShieldAlert className="w-4 h-4 mr-2" />
            Certificados
          </TabsTrigger>
          <TabsTrigger value="boletos" className="py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <FileText className="w-4 h-4 mr-2" />
            Boletos & Notas
          </TabsTrigger>
          <TabsTrigger value="mensagens" className="py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <MessageSquare className="w-4 h-4 mr-2" />
            Requisições
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="dashboard" className="m-0 focus-visible:outline-none">
            <ComprasDashboardTab />
          </TabsContent>
          
          <TabsContent value="estoque" className="m-0 focus-visible:outline-none">
            <ComprasEstoqueTab />
          </TabsContent>
          
          <TabsContent value="certificados" className="m-0 focus-visible:outline-none">
            <ComprasCertificadosTab />
          </TabsContent>
          
          <TabsContent value="boletos" className="m-0 focus-visible:outline-none">
            <ComprasBoletosTab />
          </TabsContent>

          <TabsContent value="mensagens" className="m-0 focus-visible:outline-none">
            <ComprasMensagensTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
