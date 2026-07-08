import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useRole } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ObraBottomNav, type ObraTab } from "@/components/obra-bottom-nav";
import { ObraFotografiaTab } from "@/components/obra-fotografia-tab";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Loader2,
  Plus,
  ChevronLeft,
  Trash2,
  Settings,
  FileDown,
  MapPin,
  Building2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { OBRA_STATUS_LABEL } from "@/lib/labels";

export const Route = createFileRoute("/_authenticated/obras/$obraId")({
  head: () => ({ meta: [{ title: "Obra — BRITO ENGENHARIA" }] }),
  validateSearch: (s: Record<string, unknown>): { tab: ObraTab } => ({
    tab: (["visao", "mapa", "fotografia", "menu"].includes(String(s.tab)) ? s.tab : "visao") as ObraTab,
  }),
  component: ObraDetail,
});

function ObraDetail() {
  const { obraId } = Route.useParams();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const childRouteActive = pathname.includes(`/obras/${obraId}/torres/`);

  if (childRouteActive) {
    return <Outlet />;
  }

  return <ObraDetailMain obraId={obraId} />;
}

function ObraDetailMain({ obraId }: { obraId: string }) {
  const { tab } = Route.useSearch();
  const { data: role } = useRole();
  const isAdmin = role === "admin";
  const isCliente = role === "cliente";
  const navigate = useNavigate();
  const qc = useQueryClient();

  const obra = useQuery({
    queryKey: ["obra", obraId],
    queryFn: async () => {
      const { data, error } = await supabase.from("obras").select("*").eq("id", obraId).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  /* Resumo de apontamentos */
  const resumo = useQuery({
    queryKey: ["obra-resumo-apontamentos", obraId],
    queryFn: async () => {
      const { data: torres, error: e1 } = await (supabase as any)
        .from("obra_torres")
        .select("id")
        .eq("obra_id", obraId);
      if (e1) throw e1;
      if (!torres?.length) return { torres: 0, andares: 0, abertos: 0, resolvidos: 0 };

      const torreIds = torres.map((t: any) => t.id);
      const { data: andares, error: e2 } = await (supabase as any)
        .from("torre_andares")
        .select("id")
        .in("torre_id", torreIds);
      if (e2) throw e2;
      if (!andares?.length) return { torres: torres.length, andares: 0, abertos: 0, resolvidos: 0 };

      const andarIds = andares.map((a: any) => a.id);
      const { data: aponts, error: e3 } = await (supabase as any)
        .from("apontamentos")
        .select("id, status")
        .in("andar_id", andarIds);
      if (e3) throw e3;

      const all = aponts ?? [];
      return {
        torres: torres.length,
        andares: andares.length,
        abertos: all.filter((a: any) => a.status === "aberto").length,
        resolvidos: all.filter((a: any) => a.status === "resolvido").length,
      };
    },
  });

  /* Apontamentos recentes (últimos 5 abertos) */
  const recentes = useQuery({
    queryKey: ["apontamentos-recentes", obraId],
    queryFn: async () => {
      const { data: torres } = await (supabase as any)
        .from("obra_torres")
        .select("id")
        .eq("obra_id", obraId);
      if (!torres?.length) return [];

      const torreIds = torres.map((t: any) => t.id);
      const { data: andares } = await (supabase as any)
        .from("torre_andares")
        .select("id, numero_andar, apelido, torre_id")
        .in("torre_id", torreIds);
      if (!andares?.length) return [];

      const andarIds = andares.map((a: any) => a.id);
      const { data, error } = await (supabase as any)
        .from("apontamentos")
        .select("id, descricao, status, created_at, andar_id")
        .in("andar_id", andarIds)
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;

      const andarMap = new Map(andares.map((a: any) => [a.id, a]));
      return (data ?? []).map((ap: any) => {
        const andar = andarMap.get(ap.andar_id);
        return {
          ...ap,
          andarLabel: andar?.apelido || `Andar ${andar?.numero_andar ?? "?"}`,
          torreId: andar?.torre_id,
        };
      });
    },
  });

  if (obra.isPending && !obra.data) {
    return (
      <div className="p-6 flex justify-center">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }
  if (!obra.data) {
    return <div className="p-6 text-center text-muted-foreground">Obra não encontrada.</div>;
  }

  return (
    <div className="pb-24">
      <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-4">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link to="/dashboard">
            <ChevronLeft className="size-4" /> Voltar
          </Link>
        </Button>

        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{obra.data.nome}</h1>
            <Badge variant="outline" className="mt-1 bg-primary/10 text-primary border-primary/30">
              {OBRA_STATUS_LABEL[obra.data.status]}
            </Badge>
          </div>
        </div>

        {tab === "visao" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(
                [
                  ["Torres", resumo.data?.torres ?? 0, Building2],
                  ["Andares", resumo.data?.andares ?? 0, Building2],
                  ["Abertos", resumo.data?.abertos ?? 0, AlertCircle],
                  ["Resolvidos", resumo.data?.resolvidos ?? 0, CheckCircle2],
                ] as const
              ).map(([label, n, Icon]) => (
                <Card key={label} className="text-center">
                  <CardContent className="py-3 px-2">
                    <Icon className={`size-4 mx-auto mb-1 ${label === "Abertos" ? "text-destructive" : label === "Resolvidos" ? "text-success" : "text-muted-foreground"}`} />
                    <div className="text-2xl font-bold">{n}</div>
                    <div className="text-[0.65rem] sm:text-xs text-muted-foreground">{label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Apontamentos recentes</CardTitle>
              </CardHeader>
              <CardContent>
                {!recentes.data?.length ? (
                  <p className="text-sm text-muted-foreground italic">Nenhum apontamento ainda.</p>
                ) : (
                  <ul className="divide-y">
                    {recentes.data.map((ap: any) => (
                      <li key={ap.id} className="flex items-center justify-between py-2.5">
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium truncate block">{ap.descricao}</span>
                          <span className="text-xs text-muted-foreground">
                            {ap.andarLabel} · {format(new Date(ap.created_at), "dd/MM/yyyy", { locale: ptBR })}
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className={ap.status === "aberto"
                            ? "bg-destructive/10 text-destructive border-destructive/30"
                            : "bg-success/15 text-success-foreground border-success/30"
                          }
                        >
                          {ap.status === "aberto" ? "Aberto" : "Resolvido"}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Informações da obra</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1 text-muted-foreground">
                {obra.data.endereco && <p>{obra.data.endereco}</p>}
                {(obra.data.cidade || obra.data.estado) && (
                  <p>{[obra.data.cidade, obra.data.estado].filter(Boolean).join(" — ")}</p>
                )}
                {obra.data.responsavel_tecnico && (
                  <p>RT: {obra.data.responsavel_tecnico}</p>
                )}
                {obra.data.descricao && <p className="pt-1">{obra.data.descricao}</p>}
              </CardContent>
            </Card>
          </div>
        )}

        {tab === "mapa" && (
          <MapaTab obraId={obraId} />
        )}

        {tab === "menu" && (
          <ObraMenuTab obraId={obraId} obra={obra.data} isAdmin={isAdmin} isCliente={isCliente} />
        )}

        {tab === "fotografia" && (
          <ObraFotografiaTab
            obraId={obraId}
            obraNome={obra.data.nome}
            obraEndereco={obra.data.endereco}
            editable={!isCliente}
          />
        )}
      </div>

      <ObraBottomNav obraId={obraId} active={tab} />
    </div>
  );
}

/* ───────── Tab Mapa (lazy-loads TorreMapaView) ───────── */

function MapaTab({ obraId }: { obraId: string }) {
  const torresQ = useQuery({
    queryKey: ["obra-torres", obraId],
    queryFn: async () => {
      const { data: torres, error: e1 } = await (supabase as any)
        .from("obra_torres")
        .select("id, nome, ordem, obra_id")
        .eq("obra_id", obraId)
        .order("ordem");
      if (e1) throw e1;
      if (!torres?.length) return [];

      const torreIds = torres.map((t: any) => t.id);

      // Fetch andares with grupo join for tipo_andar and planta path
      const { data: andares, error: e2 } = await (supabase as any)
        .from("torre_andares")
        .select("id, torre_id, grupo_id, numero_andar, apelido")
        .in("torre_id", torreIds)
        .order("numero_andar", { ascending: false });
      if (e2) throw e2;

      // Fetch grupos for tipo_andar
      const grupoIds = [...new Set((andares ?? []).map((a: any) => a.grupo_id))];
      let grupoMap = new Map<string, any>();
      if (grupoIds.length) {
        const { data: grupos } = await (supabase as any)
          .from("torre_grupos_andar")
          .select("id, tipo_andar, planta_storage_path")
          .in("id", grupoIds);
        grupoMap = new Map((grupos ?? []).map((g: any) => [g.id, g]));
      }

      return torres.map((t: any) => ({
        ...t,
        andares: (andares ?? [])
          .filter((a: any) => a.torre_id === t.id)
          .map((a: any) => {
            const grupo = grupoMap.get(a.grupo_id);
            return {
              ...a,
              tipo_andar: grupo?.tipo_andar ?? "tipo",
              planta_storage_path: grupo?.planta_storage_path ?? null,
            };
          }),
      }));
    },
  });

  // Apontamento counts for indicator badges
  const countsQ = useQuery({
    queryKey: ["apontamento-counts", obraId],
    enabled: !!torresQ.data?.length,
    queryFn: async () => {
      const allAndarIds = (torresQ.data ?? []).flatMap((t: any) => t.andares.map((a: any) => a.id));
      if (!allAndarIds.length) return new Map<string, number>();

      const { data, error } = await (supabase as any)
        .from("apontamentos")
        .select("id, andar_id")
        .in("andar_id", allAndarIds)
        .eq("status", "aberto");
      if (error) throw error;

      const map = new Map<string, number>();
      for (const ap of data ?? []) {
        map.set(ap.andar_id, (map.get(ap.andar_id) ?? 0) + 1);
      }
      return map;
    },
  });

  if (torresQ.isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!torresQ.data?.length) {
    return (
      <Card>
        <CardContent className="py-12 text-center space-y-3">
          <MapPin className="size-10 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">Nenhuma torre cadastrada.</p>
          <p className="text-sm text-muted-foreground">Configure a estrutura da obra no Menu.</p>
        </CardContent>
      </Card>
    );
  }

  const navigate = useNavigate();
  const counts = countsQ.data ?? new Map<string, number>();

  return (
    <div className="space-y-4">
      <div className={`grid gap-4 ${torresQ.data.length === 1 ? "" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
        {torresQ.data.map((torre: any) => (
          <Card key={torre.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="size-4 text-primary" />
                {torre.nome}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {torre.andares.map((andar: any) => {
                const abertos = counts.get(andar.id) ?? 0;
                const tipoColors: Record<string, string> = {
                  garagem: "bg-muted",
                  terreo: "bg-accent/10",
                  tipo: "bg-card",
                  cobertura: "bg-primary/5",
                  comercial: "bg-warning/5",
                };
                return (
                  <button
                    key={andar.id}
                    type="button"
                    onClick={() =>
                      navigate({
                        to: "/obras/$obraId/torres/$torreId/andares/$andarId",
                        params: { obraId, torreId: torre.id, andarId: andar.id },
                      })
                    }
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md border text-sm font-medium transition-colors hover:bg-muted/50 ${tipoColors[andar.tipo_andar] ?? ""}`}
                  >
                    <span>{andar.apelido || `Andar ${andar.numero_andar}`}</span>
                    {abertos > 0 && (
                      <Badge variant="destructive" className="text-[0.6rem] px-1.5 py-0 min-w-5 text-center">
                        {abertos}
                      </Badge>
                    )}
                  </button>
                );
              })}
              {!torre.andares.length && (
                <p className="text-xs text-muted-foreground italic py-2">Nenhum andar configurado.</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ───────── Tab Menu ───────── */

function ObraMenuTab({
  obraId,
  obra,
  isAdmin,
  isCliente,
}: {
  obraId: string;
  obra: Record<string, unknown>;
  isAdmin: boolean;
  isCliente: boolean;
}) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);
  const [equipeOpen, setEquipeOpen] = useState(false);
  const [estruturaOpen, setEstruturaOpen] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);

  const delObra = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("obras").delete().eq("id", obraId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Obra excluída.");
      navigate({ to: "/dashboard" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const items = [
    { label: "Cadastro da obra", onClick: () => setEditOpen(true), show: isAdmin },
    { label: "Estrutura da obra", onClick: () => setEstruturaOpen(true), show: !isCliente },
    { label: "Usuários com acesso", onClick: () => setEquipeOpen(true), show: isAdmin },
    { label: "Documentos da obra", onClick: () => setDocsOpen(true), show: !isCliente },
  ].filter((i) => i.show);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Settings className="size-4" /> Configurações
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y">
            {items.map((item) => (
              <li key={item.label}>
                <button
                  type="button"
                  onClick={item.onClick}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-muted/50"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {isAdmin && (
        <Button
          variant="destructive"
          className="w-full"
          onClick={() => {
            if (confirm(`Excluir a obra "${String(obra.nome)}"? Todos os dados serão removidos.`)) {
              delObra.mutate();
            }
          }}
        >
          <Trash2 className="size-4" />
          Excluir obra
        </Button>
      )}

      {editOpen && (
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <ObraEditDialog obraId={obraId} onClose={() => setEditOpen(false)} />
        </Dialog>
      )}
      {equipeOpen && (
        <Dialog open={equipeOpen} onOpenChange={setEquipeOpen}>
          <EquipeDialog obraId={obraId} />
        </Dialog>
      )}
      {estruturaOpen && (
        <Dialog open={estruturaOpen} onOpenChange={setEstruturaOpen}>
          <EstruturaObraDialog obraId={obraId} onClose={() => setEstruturaOpen(false)} />
        </Dialog>
      )}
      {docsOpen && (
        <Dialog open={docsOpen} onOpenChange={setDocsOpen}>
          <ObraDocumentosDialog obraId={obraId} />
        </Dialog>
      )}
    </div>
  );
}

/* ───────── Dialog: Editar Obra ───────── */

function ObraEditDialog({ obraId, onClose }: { obraId: string; onClose: () => void }) {
  const qc = useQueryClient();
  const obra = useQuery({
    queryKey: ["obra", obraId],
    queryFn: async () => {
      const { data } = await supabase.from("obras").select("*").eq("id", obraId).single();
      return data!;
    },
  });
  const [form, setForm] = useState<Record<string, string>>({});

  const save = useMutation({
    mutationFn: async () => {
      const f = { ...obra.data, ...form };
      const { error } = await supabase
        .from("obras")
        .update({
          nome: f.nome,
          endereco: f.endereco || null,
          cidade: f.cidade || null,
          estado: f.estado || null,
          latitude: f.latitude ? Number(f.latitude) : null,
          longitude: f.longitude ? Number(f.longitude) : null,
          responsavel_tecnico: f.responsavel_tecnico || null,
          descricao: f.descricao || null,
          status: f.status,
        })
        .eq("id", obraId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Obra atualizada.");
      qc.invalidateQueries({ queryKey: ["obra", obraId] });
      onClose();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!obra.data) return null;
  const v = (k: string) => form[k] ?? String(obra.data[k as keyof typeof obra.data] ?? "");

  return (
    <DialogContent className="max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Cadastro da obra</DialogTitle>
      </DialogHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
        className="space-y-3"
      >
        <div className="space-y-1.5">
          <Label>Nome</Label>
          <Input value={v("nome")} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
        </div>
        <div className="space-y-1.5">
          <Label>Endereço</Label>
          <Input value={v("endereco")} onChange={(e) => setForm({ ...form, endereco: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <Label>Latitude</Label>
            <Input type="number" step="any" value={v("latitude")} onChange={(e) => setForm({ ...form, latitude: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Longitude</Label>
            <Input type="number" step="any" value={v("longitude")} onChange={(e) => setForm({ ...form, longitude: e.target.value })} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Responsável técnico</Label>
          <Input value={v("responsavel_tecnico")} onChange={(e) => setForm({ ...form, responsavel_tecnico: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label>Descrição</Label>
          <Textarea value={v("descricao")} onChange={(e) => setForm({ ...form, descricao: e.target.value })} rows={2} />
        </div>
        <DialogFooter>
          <Button type="submit" disabled={save.isPending}>
            {save.isPending && <Loader2 className="size-4 animate-spin" />}
            Salvar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

/* ───────── Dialog: Equipe ───────── */

function EquipeDialog({ obraId }: { obraId: string }) {
  const qc = useQueryClient();
  const usuarios = useQuery({
    queryKey: ["usuarios-vinc", obraId],
    queryFn: async () => {
      const { data: profs, error } = await supabase.from("profiles").select("id, nome, email").eq("ativo", true);
      if (error) throw error;
      const { data: roles } = await supabase.from("user_roles").select("user_id, role");
      const { data: vinc } = await supabase.from("obra_usuarios").select("user_id").eq("obra_id", obraId);
      const vinculados = new Set(vinc?.map((v) => v.user_id));
      const roleMap = new Map(roles?.map((r) => [r.user_id, r.role]));
      return (profs ?? [])
        .map((p) => ({ ...p, role: roleMap.get(p.id), vinc: vinculados.has(p.id) }))
        .filter((p) => p.role && p.role !== "admin");
    },
  });

  const toggle = useMutation({
    mutationFn: async ({ userId, on }: { userId: string; on: boolean }) => {
      if (on) {
        const { error } = await supabase.from("obra_usuarios").insert({ obra_id: obraId, user_id: userId });
        if (error) throw error;
      } else {
        const { error } = await supabase.from("obra_usuarios").delete().eq("obra_id", obraId).eq("user_id", userId);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["usuarios-vinc", obraId] }),
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Usuários com acesso</DialogTitle>
      </DialogHeader>
      <div className="space-y-2 max-h-[60vh] overflow-y-auto">
        {usuarios.data?.map((u) => (
          <label key={u.id} className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 cursor-pointer">
            <Checkbox checked={u.vinc} onCheckedChange={(c) => toggle.mutate({ userId: u.id, on: c === true })} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{u.nome}</div>
              <div className="text-xs text-muted-foreground">{u.email} · {u.role}</div>
            </div>
          </label>
        ))}
      </div>
    </DialogContent>
  );
}

/* ───────── Dialog: Estrutura da Obra (Torres / Andares / Plantas) ───────── */

function EstruturaObraDialog({ obraId, onClose }: { obraId: string; onClose: () => void }) {
  const qc = useQueryClient();
  const [torreNome, setTorreNome] = useState("");
  const [grupoForm, setGrupoForm] = useState<{
    torreId: string;
    nomeGrupo: string;
    andarInicial: string;
    andarFinal: string;
    tipoAndar: string;
  } | null>(null);

  const torres = useQuery({
    queryKey: ["obra-torres-estrutura", obraId],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("obra_torres")
        .select("id, nome, ordem")
        .eq("obra_id", obraId)
        .order("ordem");
      if (error) throw error;

      const result = [];
      for (const torre of data ?? []) {
        const { data: grupos } = await (supabase as any)
          .from("torre_grupos_andar")
          .select("id, nome_grupo, andar_inicial, andar_final, tipo_andar, planta_storage_path")
          .eq("torre_id", torre.id)
          .order("andar_inicial");
        result.push({ ...torre, grupos: grupos ?? [] });
      }
      return result;
    },
  });

  const addTorre = useMutation({
    mutationFn: async () => {
      const ordem = (torres.data?.length ?? 0) + 1;
      const { error } = await (supabase as any)
        .from("obra_torres")
        .insert({ obra_id: obraId, nome: torreNome.trim(), ordem });
      if (error) throw error;
    },
    onSuccess: () => {
      setTorreNome("");
      toast.success("Torre adicionada.");
      qc.invalidateQueries({ queryKey: ["obra-torres-estrutura", obraId] });
      qc.invalidateQueries({ queryKey: ["obra-torres", obraId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const addGrupo = useMutation({
    mutationFn: async () => {
      if (!grupoForm) return;
      const { torreId, nomeGrupo, andarInicial, andarFinal, tipoAndar } = grupoForm;
      const ini = parseInt(andarInicial);
      const fim = parseInt(andarFinal);
      if (isNaN(ini) || isNaN(fim) || ini > fim) throw new Error("Intervalo de andares inválido.");

      // Create grupo
      const { data: grupo, error: gErr } = await (supabase as any)
        .from("torre_grupos_andar")
        .insert({
          torre_id: torreId,
          nome_grupo: nomeGrupo.trim() || tipoAndar,
          andar_inicial: ini,
          andar_final: fim,
          tipo_andar: tipoAndar,
        })
        .select("id")
        .single();
      if (gErr) throw gErr;

      // Create individual andares
      const andares = [];
      for (let n = ini; n <= fim; n++) {
        andares.push({
          torre_id: torreId,
          grupo_id: grupo.id,
          numero_andar: n,
          apelido: n === 0 ? "Térreo" : null,
        });
      }
      const { error: aErr } = await (supabase as any).from("torre_andares").insert(andares);
      if (aErr) throw aErr;
    },
    onSuccess: () => {
      setGrupoForm(null);
      toast.success("Andares adicionados.");
      qc.invalidateQueries({ queryKey: ["obra-torres-estrutura", obraId] });
      qc.invalidateQueries({ queryKey: ["obra-torres", obraId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const delTorre = useMutation({
    mutationFn: async (torreId: string) => {
      const { error } = await (supabase as any).from("obra_torres").delete().eq("id", torreId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Torre removida.");
      qc.invalidateQueries({ queryKey: ["obra-torres-estrutura", obraId] });
      qc.invalidateQueries({ queryKey: ["obra-torres", obraId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const handlePlantaUpload = async (grupoId: string, torreId: string, file: File) => {
    try {
      const imageCompression = (await import("browser-image-compression")).default;
      const compressed = await imageCompression(file, {
        maxSizeMB: 1.2,
        maxWidthOrHeight: 2400,
        useWebWorker: true,
      });
      const path = `${obraId}/${torreId}/${grupoId}.${file.name.split(".").pop()}`;
      const { error: upErr } = await supabase.storage.from("plantas-baixa").upload(path, compressed, { upsert: true });
      if (upErr) throw upErr;

      const { error: dbErr } = await (supabase as any)
        .from("torre_grupos_andar")
        .update({ planta_storage_path: path })
        .eq("id", grupoId);
      if (dbErr) throw dbErr;

      toast.success("Planta enviada.");
      qc.invalidateQueries({ queryKey: ["obra-torres-estrutura", obraId] });
      qc.invalidateQueries({ queryKey: ["obra-torres", obraId] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao enviar planta.");
    }
  };

  return (
    <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Estrutura da obra</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        {/* Add torre */}
        <div className="flex gap-2">
          <Input
            placeholder="Nome da torre (ex: Torre 1)"
            value={torreNome}
            onChange={(e) => setTorreNome(e.target.value)}
            className="flex-1"
          />
          <Button type="button" onClick={() => addTorre.mutate()} disabled={!torreNome.trim() || addTorre.isPending}>
            <Plus className="size-4" />
          </Button>
        </div>

        {/* Torres list */}
        {torres.isLoading ? (
          <Loader2 className="size-5 animate-spin mx-auto" />
        ) : (
          torres.data?.map((torre: any) => (
            <Card key={torre.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{torre.nome}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive h-7"
                    onClick={() => {
                      if (confirm(`Remover "${torre.nome}" e todos seus andares?`)) {
                        delTorre.mutate(torre.id);
                      }
                    }}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {torre.grupos.map((g: any) => (
                  <div key={g.id} className="text-xs border rounded p-2 space-y-1.5">
                    <div className="flex justify-between">
                      <span className="font-medium">{g.nome_grupo}</span>
                      <Badge variant="outline" className="text-[0.6rem]">{g.tipo_andar}</Badge>
                    </div>
                    <div className="text-muted-foreground">
                      Andares {g.andar_inicial} a {g.andar_final}
                    </div>
                    <div className="flex items-center gap-2">
                      {g.planta_storage_path ? (
                        <span className="text-success text-[0.65rem]">✓ Planta enviada</span>
                      ) : (
                        <>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id={`planta-${g.id}`}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) void handlePlantaUpload(g.id, torre.id, file);
                            }}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 text-[0.65rem]"
                            onClick={() => document.getElementById(`planta-${g.id}`)?.click()}
                          >
                            Enviar planta
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}

                {grupoForm?.torreId === torre.id ? (
                  <div className="border rounded p-2 space-y-2">
                    <Input
                      placeholder="Nome do grupo (ex: Tipo)"
                      value={grupoForm.nomeGrupo}
                      onChange={(e) => setGrupoForm({ ...grupoForm, nomeGrupo: e.target.value })}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder="Andar inicial"
                        value={grupoForm.andarInicial}
                        onChange={(e) => setGrupoForm({ ...grupoForm, andarInicial: e.target.value })}
                      />
                      <Input
                        type="number"
                        placeholder="Andar final"
                        value={grupoForm.andarFinal}
                        onChange={(e) => setGrupoForm({ ...grupoForm, andarFinal: e.target.value })}
                      />
                    </div>
                    <Select
                      value={grupoForm.tipoAndar}
                      onValueChange={(v) => setGrupoForm({ ...grupoForm, tipoAndar: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="garagem">Garagem</SelectItem>
                        <SelectItem value="terreo">Térreo</SelectItem>
                        <SelectItem value="tipo">Tipo</SelectItem>
                        <SelectItem value="cobertura">Cobertura</SelectItem>
                        <SelectItem value="comercial">Comercial</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setGrupoForm(null)}>
                        Cancelar
                      </Button>
                      <Button size="sm" onClick={() => addGrupo.mutate()} disabled={addGrupo.isPending}>
                        Salvar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() =>
                      setGrupoForm({
                        torreId: torre.id,
                        nomeGrupo: "",
                        andarInicial: "",
                        andarFinal: "",
                        tipoAndar: "tipo",
                      })
                    }
                  >
                    <Plus className="size-3.5" /> Adicionar andares
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </DialogContent>
  );
}

/* ───────── Dialog: Documentos da Obra ───────── */

function ObraDocumentosDialog({ obraId }: { obraId: string }) {
  const qc = useQueryClient();
  const docs = useQuery({
    queryKey: ["obra-docs", obraId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("obra_documentos")
        .select("*")
        .eq("obra_id", obraId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    const { data: u } = await supabase.auth.getUser();
    let uploaded = 0;
    for (const file of Array.from(files)) {
      const path = `${obraId}/documentos/${crypto.randomUUID()}-${file.name}`;
      const { error: upErr } = await supabase.storage.from("rdo-anexos").upload(path, file);
      if (upErr) {
        toast.error(upErr.message);
        continue;
      }
      const { error: dbErr } = await supabase.from("obra_documentos").insert({
        obra_id: obraId,
        storage_path: path,
        nome_arquivo: file.name,
        mime_type: file.type || null,
        enviado_por: u.user?.id,
      });
      if (dbErr) {
        await supabase.storage.from("rdo-anexos").remove([path]);
        toast.error(dbErr.message);
        continue;
      }
      uploaded++;
    }
    if (uploaded > 0) {
      qc.invalidateQueries({ queryKey: ["obra-docs", obraId] });
      toast.success(uploaded === 1 ? "Documento enviado." : `${uploaded} documentos enviados.`);
    }
    const input = document.getElementById("obra-docs-input") as HTMLInputElement | null;
    if (input) input.value = "";
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Documentos da obra</DialogTitle>
      </DialogHeader>
      <input
        type="file"
        multiple
        className="hidden"
        id="obra-docs-input"
        onChange={(e) => void upload(e.target.files)}
      />
      <Button variant="outline" onClick={() => document.getElementById("obra-docs-input")?.click()}>
        <FileDown className="size-4" /> Enviar documento
      </Button>
      <ul className="text-sm divide-y mt-2 max-h-48 overflow-y-auto">
        {docs.data?.map((d) => (
          <li key={d.id} className="py-2 truncate">
            {d.nome_arquivo}
          </li>
        ))}
      </ul>
    </DialogContent>
  );
}
