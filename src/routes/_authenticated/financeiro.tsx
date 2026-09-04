import { createFileRoute } from "@tanstack/react-router";
import { DollarSign, LayoutDashboard, ArrowRightLeft, Landmark, MessageSquare } from "lucide-react";
import { requireModulo } from "@/lib/auth-guards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { FinanceiroDashboardTab } from "@/components/financeiro-dashboard-tab";
import { FinanceiroContasTab } from "@/components/financeiro-contas-tab";
import { FinanceiroBancosTab } from "@/components/financeiro-bancos-tab";
import { ChatSetor } from "@/components/chat-setor";

export const Route = createFileRoute("/_authenticated/financeiro")({
  head: () => ({ meta: [{ title: "Financeiro — BRITO ENGENHARIA" }] }),
  beforeLoad: async () => await requireModulo("financeiro"),
  component: FinanceiroDashboard,
});

function FinanceiroDashboard() {
  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500 max-w-7xl mx-auto w-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <DollarSign className="size-8 text-green-600" />
          Financeiro
        </h1>
        <p className="text-muted-foreground mt-1">Gestão de caixa, contas a pagar, contas a receber e conciliação bancária.</p>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 max-w-3xl h-auto p-1 bg-muted/50">
          <TabsTrigger value="dashboard" className="py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Fluxo de Caixa
          </TabsTrigger>
          <TabsTrigger value="transacoes" className="py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <ArrowRightLeft className="w-4 h-4 mr-2" />
            Pagar & Receber
          </TabsTrigger>
          <TabsTrigger value="bancos" className="py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Landmark className="w-4 h-4 mr-2" />
            Contas Bancárias
          </TabsTrigger>
          <TabsTrigger value="mensagens" className="py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <MessageSquare className="w-4 h-4 mr-2" />
            Mensagens
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="dashboard" className="m-0 focus-visible:outline-none">
            <FinanceiroDashboardTab />
          </TabsContent>
          
          <TabsContent value="transacoes" className="m-0 focus-visible:outline-none">
            <FinanceiroContasTab />
          </TabsContent>
          
          <TabsContent value="bancos" className="m-0 focus-visible:outline-none">
            <FinanceiroBancosTab />
          </TabsContent>

          <TabsContent value="mensagens" className="m-0 focus-visible:outline-none">
            <ChatSetor moduloAtual="financeiro" />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
