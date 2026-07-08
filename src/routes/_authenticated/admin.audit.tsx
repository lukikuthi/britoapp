import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { auditAcaoLabel, auditRegistroDescricao, auditTabelaLabel } from "@/lib/labels";

export const Route = createFileRoute("/_authenticated/admin/audit")({
  head: () => ({ meta: [{ title: "Audit Log — BRITO ENGENHARIA" }] }),
  component: AuditPage,
});

function AuditPage() {
  const logs = useQuery({
    queryKey: ["audit-log"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_log")
        .select("id, tabela, acao, diff, created_at, ator_id")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;

      const atorIds = [...new Set((data ?? []).map((l) => l.ator_id).filter(Boolean))] as string[];
      let nomes = new Map<string, string>();
      if (atorIds.length) {
        const { data: profs } = await supabase.from("profiles").select("id, nome").in("id", atorIds);
        nomes = new Map((profs ?? []).map((p) => [p.id, p.nome]));
      }

      return (data ?? []).map((log) => ({
        ...log,
        atorNome: log.ator_id ? nomes.get(log.ator_id) ?? null : null,
      }));
    },
  });

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Audit log</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Histórico de alterações nos relatórios (últimos 100 eventos).
        </p>
      </div>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Eventos</CardTitle>
        </CardHeader>
        <CardContent>
          {logs.isLoading ? (
            <Loader2 className="size-5 animate-spin mx-auto" />
          ) : !logs.data?.length ? (
            <p className="text-sm text-muted-foreground">Nenhum evento registrado.</p>
          ) : (
            <ul className="divide-y text-sm">
              {logs.data.map((log) => {
                const descricao = auditRegistroDescricao(log.tabela, log.diff as Record<string, unknown> | null);
                return (
                  <li key={log.id} className="py-3 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{auditAcaoLabel(log.acao)}</Badge>
                      <span className="font-medium">{auditTabelaLabel(log.tabela)}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(log.created_at), "dd/MM/yyyy HH:mm:ss", { locale: ptBR })}
                      </span>
                    </div>
                    {descricao && (
                      <div className="text-sm text-foreground">{descricao}</div>
                    )}
                    {log.atorNome && (
                      <div className="text-xs text-muted-foreground">Por: {log.atorNome}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
