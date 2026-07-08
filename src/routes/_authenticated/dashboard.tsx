import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRole } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronRight } from "lucide-react";
import { DashboardFab } from "@/components/dashboard-fab";
import { OBRA_STATUS_LABEL } from "@/lib/labels";

import { useTutorial } from "@/hooks/use-tutorial";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Obras — BRITO ENGENHARIA" }] }),
  component: Dashboard,
});

interface ObraRow {
  id: string;
  nome: string;
  cidade: string | null;
  estado: string | null;
  status: "em_andamento" | "pausada" | "concluida";
}

function Dashboard() {
  const { data: role } = useRole();
  const isAdmin = role === "admin";
  const startTutorial = useTutorial((s) => s.startTutorial);

  const obrasQ = useQuery({
    queryKey: ["obras-dashboard"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("obras")
        .select("id, nome, cidade, estado, status")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as ObraRow[];
    },
  });

  /* Contagem de apontamentos abertos por obra */
  const apontQ = useQuery({
    queryKey: ["apontamentos-dashboard", obrasQ.data?.map((o) => o.id).join(",")],
    enabled: !!obrasQ.data?.length,
    queryFn: async () => {
      const ids = obrasQ.data!.map((o) => o.id);
      // obra_torres → torre_andares → apontamentos
      const { data: torres, error: e1 } = await (supabase as any)
        .from("obra_torres")
        .select("id, obra_id")
        .in("obra_id", ids);
      if (e1) throw e1;
      if (!torres?.length) return new Map<string, number>();

      const torreIds = torres.map((t: any) => t.id);
      const { data: andares, error: e2 } = await (supabase as any)
        .from("torre_andares")
        .select("id, torre_id")
        .in("torre_id", torreIds);
      if (e2) throw e2;
      if (!andares?.length) return new Map<string, number>();

      const andarIds = andares.map((a: any) => a.id);
      const { data: aponts, error: e3 } = await (supabase as any)
        .from("apontamentos")
        .select("id, andar_id, status")
        .in("andar_id", andarIds)
        .eq("status", "aberto");
      if (e3) throw e3;

      // Map andar → torre → obra
      const andarToTorre = new Map(andares.map((a: any) => [a.id, a.torre_id]));
      const torreToObra = new Map(torres.map((t: any) => [t.id, t.obra_id]));
      const map = new Map<string, number>();
      for (const ap of aponts ?? []) {
        const torreId = andarToTorre.get(ap.andar_id);
        const obraId = torreId ? torreToObra.get(torreId) : undefined;
        if (obraId) {
          map.set(obraId, (map.get(obraId) ?? 0) + 1);
        }
      }
      return map;
    },
  });

  const rdosQ = useQuery({
    queryKey: ["rdos-dashboard", obrasQ.data?.map((o) => o.id).join(",")],
    enabled: !!obrasQ.data?.length,
    queryFn: async () => {
      const ids = obrasQ.data!.map((o) => o.id);
      const { data, error } = await supabase
        .from("rdos" as any)
        .select("id, obra_id, status")
        .in("obra_id", ids)
        .neq("status", "aprovado");
      if (error) throw error;

      const map = new Map<string, number>();
      for (const r of data ?? []) {
        map.set(r.obra_id, (map.get(r.obra_id) ?? 0) + 1);
      }
      return map;
    },
  });

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Obras</h1>
          <p className="text-sm text-muted-foreground mt-1">Selecione uma obra para ver o mapa e apontamentos.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => startTutorial((obrasQ.data?.length ?? 0) > 0)}>
          Iniciar Tutorial
        </Button>
      </div>

      {obrasQ.isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : !obrasQ.data?.length ? (
        <Card className="tour-lista-obras">
          <CardContent className="py-12 text-center text-muted-foreground">
            {isAdmin
              ? "Nenhuma obra cadastrada. Use o botão + para adicionar."
              : "Você ainda não foi vinculado a nenhuma obra. Fale com o administrador."}
          </CardContent>
        </Card>
      ) : (
        <ul className="divide-y rounded-lg border bg-card tour-lista-obras">
          {obrasQ.data.map((o) => {
            const abertos = apontQ.data?.get(o.id) ?? 0;
            return (
              <li key={o.id}>
                <Link
                  to="/obras/$obraId"
                  params={{ obraId: o.id }}
                  search={{ tab: "visao" }}
                  className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{o.nome}</div>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <Badge
                        variant="outline"
                        className={
                          o.status === "em_andamento"
                            ? "bg-primary/15 text-primary border-primary/30"
                            : ""
                        }
                      >
                        {OBRA_STATUS_LABEL[o.status]}
                      </Badge>
                      {abertos > 0 && (
                        <span className="text-xs text-destructive font-medium">
                          {abertos} apontamento{abertos !== 1 ? "s" : ""} aberto{abertos !== 1 ? "s" : ""}
                        </span>
                      )}
                      {(rdosQ.data?.get(o.id) ?? 0) > 0 && (
                        <span className="text-xs text-amber-500 font-medium">
                          {rdosQ.data!.get(o.id)} RDO{rdosQ.data!.get(o.id)! !== 1 ? "s" : ""} pendente{rdosQ.data!.get(o.id)! !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-muted-foreground shrink-0" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <DashboardFab isAdmin={isAdmin} />
    </div>
  );
}
