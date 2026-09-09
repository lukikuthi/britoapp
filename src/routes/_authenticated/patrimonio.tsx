import { createFileRoute } from "@tanstack/react-router";
import { Wrench, ArrowRightLeft, ShieldAlert } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { requireModuleAccess } from "@/lib/auth-guards";
import { PatrimonioInventarioTab } from "@/components/patrimonio-inventario-tab";
import { PatrimonioMovimentacaoTab } from "@/components/patrimonio-movimentacao-tab";
import { PatrimonioManutencaoTab } from "@/components/patrimonio-manutencao-tab";

export const Route = createFileRoute("/_authenticated/patrimonio")({
  beforeLoad: ({ context }) => requireModuleAccess(context, "suprimentos"),
  component: PatrimonioPage,
});

function PatrimonioPage() {
  const search = Route.useSearch() as { tab?: string };
  const tab = search.tab || "inventario";

  return (
    <div className="flex-1 space-y-6 p-4 pt-6 md:p-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Wrench className="size-8 text-primary" />
          Patrimônio & Equipamentos
        </h1>
        <p className="text-muted-foreground">
          Controle de ferramentas, maquinário, movimentação entre obras e manutenções.
        </p>
      </div>

      <Tabs defaultValue={tab} className="w-full">
        <TabsList className="mb-4 bg-muted/50 w-full sm:w-auto overflow-x-auto flex-nowrap border">
          <TabsTrigger value="inventario" className="data-[state=active]:bg-[var(--brand-gold)] data-[state=active]:text-black">
            <Wrench className="size-4 mr-2" /> Inventário Geral
          </TabsTrigger>
          <TabsTrigger value="movimentacao" className="data-[state=active]:bg-[var(--brand-gold)] data-[state=active]:text-black">
            <ArrowRightLeft className="size-4 mr-2" /> Empréstimos (Obras)
          </TabsTrigger>
          <TabsTrigger value="manutencao" className="data-[state=active]:bg-[var(--brand-gold)] data-[state=active]:text-black">
            <ShieldAlert className="size-4 mr-2" /> Manutenções
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inventario" className="m-0 focus-visible:outline-none">
          <PatrimonioInventarioTab />
        </TabsContent>
        
        <TabsContent value="movimentacao" className="m-0 focus-visible:outline-none">
          <PatrimonioMovimentacaoTab />
        </TabsContent>
        
        <TabsContent value="manutencao" className="m-0 focus-visible:outline-none">
          <PatrimonioManutencaoTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
