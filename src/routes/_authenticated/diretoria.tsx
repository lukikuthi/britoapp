import { createFileRoute } from "@tanstack/react-router";
import { Briefcase, LayoutDashboard, Inbox } from "lucide-react";
import { requireModulo } from "@/lib/auth-guards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { DiretoriaDashboardTab } from "@/components/diretoria-dashboard-tab";
import { DiretoriaAprovacoesTab } from "@/components/diretoria-aprovacoes-tab";

export const Route = createFileRoute("/_authenticated/diretoria")({
  head: () => ({ meta: [{ title: "Diretoria — BRITO ENGENHARIA" }] }),
  beforeLoad: async () => await requireModulo("diretoria"),
  component: DiretoriaLayout,
});

function DiretoriaLayout() {
  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500 max-w-7xl mx-auto w-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Briefcase className="size-8 text-[var(--brand-gold)]" />
          Painel da Diretoria
        </h1>
        <p className="text-muted-foreground mt-1">Visão panorâmica consolidada e aprovações executivas.</p>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md h-auto p-1 bg-muted/50">
          <TabsTrigger value="dashboard" className="py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Visão Geral 360º
          </TabsTrigger>
          <TabsTrigger value="inbox" className="py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Inbox className="w-4 h-4 mr-2" />
            Caixa de Decisão
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="dashboard" className="m-0 focus-visible:outline-none">
            <DiretoriaDashboardTab />
          </TabsContent>
          
          <TabsContent value="inbox" className="m-0 focus-visible:outline-none">
            <DiretoriaAprovacoesTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
