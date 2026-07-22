import { createFileRoute, Link, useNavigate, Outlet, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Layers, AlertCircle, CheckCircle2 } from "lucide-react";
import { usePavimentos, usePendenciasPavimentoCount } from "@/hooks/use-5-passos";

export const Route = createFileRoute("/_authenticated/obras/$obraId/torres/$torreId")({
  component: TorreWrapper,
});

function TorreWrapper() {
  const { obraId, torreId } = Route.useParams();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const childRouteActive = pathname.includes(`/obras/${obraId}/torres/${torreId}/pavimentos/`);

  if (childRouteActive) {
    return <Outlet />;
  }

  return <TorrePavimentosView />;
}

function PavimentoCard({ obraId, torreId, p }: { obraId: string, torreId: string, p: any }) {
  const counts = usePendenciasPavimentoCount(p.id);
  const navigate = useNavigate();
  
  return (
    <Card 
      className="cursor-pointer hover:border-primary transition-colors"
      onClick={() => navigate({ to: `/obras/${obraId}/torres/${torreId}/pavimentos/${p.id}` })}
    >
      <CardContent className="py-4 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Layers className="size-5 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="font-semibold">{p.numero_andar}º Pavimento</span>
            <span className="text-[0.65rem] text-muted-foreground uppercase">{p.tipo_pavimento}</span>
          </div>
        </div>
        <div className="text-sm flex gap-4">
          <div className="flex flex-col items-center">
            <span className="text-destructive font-medium">{counts.data?.abertas ?? 0}</span>
            <span className="text-[0.65rem] text-muted-foreground">Abertos</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-success font-medium">{counts.data?.resolvidas ?? 0}</span>
            <span className="text-[0.65rem] text-muted-foreground">Resolv.</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TorrePavimentosView() {
  const { obraId, torreId } = Route.useParams();
  
  const torre = useQuery({
    queryKey: ["torre", torreId],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await supabase.from("obra_torres" as any).select("nome").eq("id", torreId).single();
      if (error) throw error;
      return data;
    }
  });

  const pavs = usePavimentos(torreId);

  return (
    <div className="pb-24 p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link to={`/obras/${obraId}`} search={{ tab: "visao" } as any}>
            <ChevronLeft className="size-4" /> Voltar
          </Link>
        </Button>
        <h1 className="text-xl font-bold">{torre.data?.nome ?? "Carregando Torre..."}</h1>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Pavimentos</h2>
        
        {pavs.isLoading ? (
          <div className="text-center py-6 text-muted-foreground animate-pulse">Carregando pavimentos...</div>
        ) : pavs.data?.length === 0 ? (
          <div className="text-center py-6 text-sm text-muted-foreground border rounded-lg border-dashed">
            Nenhum pavimento cadastrado para esta torre. Acesse Menu {">"} Estrutura da obra.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pavs.data?.map(p => (
              <PavimentoCard key={p.id} obraId={obraId} torreId={torreId} p={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
