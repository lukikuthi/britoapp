import { createFileRoute } from "@tanstack/react-router";
import { Users, LayoutDashboard, ShieldCheck, CalendarRange } from "lucide-react";
import { requireModulo } from "@/lib/auth-guards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RhDashboardTab } from "@/components/rh-dashboard-tab";
import { RhFuncionariosTab } from "@/components/rh-funcionarios-tab";

import { RhExamesTab } from "@/components/rh-exames-tab";
import { RhFeriasTab } from "@/components/rh-ferias-tab";

export const Route = createFileRoute("/_authenticated/rh")({
  head: () => ({ meta: [{ title: "RH — BRITO ENGENHARIA" }] }),
  beforeLoad: async () => await requireModulo("rh"),
  component: RhDashboard,
});

function RhDashboard() {
  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500 max-w-7xl mx-auto w-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Users className="size-8 text-purple-500" />
          Recursos Humanos e SESMT
        </h1>
        <p className="text-muted-foreground mt-1">Gestão de colaboradores, admissões, férias e segurança do trabalho (NRs e ASO).</p>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 max-w-3xl h-auto p-1 bg-muted/50">
          <TabsTrigger value="dashboard" className="py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="funcionarios" className="py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Users className="w-4 h-4 mr-2" />
            Funcionários
          </TabsTrigger>
          <TabsTrigger value="exames" className="py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <ShieldCheck className="w-4 h-4 mr-2" />
            Exames & NRs
          </TabsTrigger>
          <TabsTrigger value="ferias" className="py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <CalendarRange className="w-4 h-4 mr-2" />
            Férias
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="dashboard" className="m-0 focus-visible:outline-none">
            <RhDashboardTab />
          </TabsContent>
          
          <TabsContent value="funcionarios" className="m-0 focus-visible:outline-none">
            <RhFuncionariosTab />
          </TabsContent>
          
          <TabsContent value="exames" className="m-0 focus-visible:outline-none">
            <RhExamesTab />
          </TabsContent>
          
          <TabsContent value="ferias" className="m-0 focus-visible:outline-none">
            <RhFeriasTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
