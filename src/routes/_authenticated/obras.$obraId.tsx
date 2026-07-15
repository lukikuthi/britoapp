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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ObraBottomNav, type ObraTab } from "@/components/obra-bottom-nav";
import { ObraAnalyticsTab } from "@/components/obra-analytics-tab";
import { ObraFotografiaTab } from "@/components/obra-fotografia-tab";
import { ObraEapTab } from "@/components/obra-eap-tab";
import { ObraProjetosTab } from "@/components/obra-projetos-tab";
import { TorreMapaView } from "@/components/apontamentos/torre-mapa-view";
import { ObraMateriaisTab } from "@/components/obra-materiais-tab";
import { ObraComissionamentoTab } from "@/components/obra-comissionamento-tab";
import { ObraSesmtTab } from "@/components/obra-sesmt-tab";
import { ObraCronogramaTab } from "@/components/obra-cronograma-tab";
import { ObraConcretagemTab } from "@/components/obra-concretagem-tab";
import { ObraFvrTab } from "@/components/obra-fvr-tab";
import { ObraRncTab } from "@/components/obra-rnc-tab";
import { ObraBmTab } from "@/components/obra-bm-tab";
import { ObraMedicaoTab } from "@/components/obra-medicao-tab";
import { useTutorial } from "@/hooks/use-tutorial";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Loader2,
  Plus,
  ChevronLeft,
  Trash2,
  Upload,
  Settings,
  FileDown,
  MapPin,
  Building2,
  CheckCircle2,
  FileText,
  Compass,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { OBRA_STATUS_LABEL } from "@/lib/labels";

export const Route = createFileRoute("/_authenticated/obras/$obraId")({
  head: () => ({ meta: [{ title: "Obra — BRITO ENGENHARIA" }] }),
  validateSearch: (s: Record<string, unknown>): { tab: ObraTab } => ({
    tab: (["visao", "analytics", "mapa", "rdo", "fotografia", "menu", "materiais", "laudos", "sesmt", "cronograma", "concretagem", "fvr", "rnc", "bm", "medicao"].includes(String(s.tab)) ? s.tab : "visao") as ObraTab,
  }),
  component: ObraDetail,
});

function ObraDetail() {
  const { obraId } = Route.useParams();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const childRouteActive = pathname.includes(`/obras/${obraId}/torres/`) || pathname.includes(`/obras/${obraId}/rdos/`);

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
  const setStage = useTutorial((s) => s.setStage);

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
        <div className="flex justify-between items-center -ml-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard">
              <ChevronLeft className="size-4" /> Voltar
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:flex h-8 px-2 text-muted-foreground hover:text-foreground tutorial-glow-wrapper"
            onClick={() => {
              setStage("idle");
              setTimeout(() => {
                toast.info("Iniciando tutorial...");
                setStage("obra");
              }, 100);
            }}
          >
            <Compass className="size-4 mr-1.5" />
            Tutorial da Obra
          </Button>
        </div>

        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{obra.data.nome}</h1>
            <div className="mt-1 text-sm font-medium text-primary">
              {OBRA_STATUS_LABEL[obra.data.status]}
            </div>
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
                <Card 
                  key={label} 
                  className="text-center cursor-pointer hover:border-primary transition-colors"
                  onClick={() => navigate({ search: { tab: "mapa" } as any, replace: true })}
                >
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
                        <span
                          className={`text-sm font-medium ${
                            ap.status === "aberto" ? "text-destructive" : "text-success"
                          }`}
                        >
                          {ap.status === "aberto" ? "Aberto" : "Resolvido"}
                        </span>
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

        {tab === "analytics" && (
          <ObraAnalyticsTab obraId={obraId} />
        )}

        {tab === "rdo" && (
          <RdoTab obraId={obraId} />
        )}

        {tab === "eap" && (
          <ObraEapTab obraId={obraId} />
        )}

        {tab === "projetos" && (
          <ObraProjetosTab obraId={obraId} />
        )}


        {tab === "cronograma" && (
          <ObraCronogramaTab obraId={obraId} />
        )}
        {tab === "concretagem" && (
          <ObraConcretagemTab obraId={obraId} />
        )}
        {tab === "fvr" && (
          <ObraFvrTab obraId={obraId} />
        )}
        {tab === "rnc" && (
          <ObraRncTab obraId={obraId} />
        )}
        {tab === "bm" && (
          <ObraBmTab obraId={obraId} />
        )}
        {tab === "medicao" && (
          <ObraMedicaoTab obraId={obraId} isAdmin={isAdmin} />
        )}

        {tab === "materiais" && (
          <ObraMateriaisTab obraId={obraId} isAdmin={isAdmin} />
        )}

        {tab === "laudos" && (
          <ObraComissionamentoTab obraId={obraId} isAdmin={isAdmin} />
        )}

        {tab === "sesmt" && (
          <ObraSesmtTab obraId={obraId} isAdmin={isAdmin} />
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

      <div className="tour-obra-tabs">
        <ObraBottomNav obraId={obraId} active={tab} />
      </div>
    </div>
  );
}

/* ───────── Tab Mapa (lazy-loads TorreMapaView) ───────── */

import { generateApontamentosPdf } from "@/lib/apontamentos-pdf-generator";

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

  const navigate = useNavigate();
  const counts = countsQ.data ?? new Map<string, number>();

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
          <p className="text-sm text-muted-foreground mb-4">Configure a estrutura da obra no Menu.</p>
          <Button variant="outline" onClick={() => navigate({ search: { tab: "menu" } as any, replace: true })}>
            <Settings className="size-4 mr-2" />
            Estrutura da Obra
          </Button>
        </CardContent>
      </Card>
    );
  }

  const handleExportPdf = async () => {
    try {
      toast.info("Compilando dados das torres, aguarde...");
      const { data: obraData } = await supabase.from("obras").select("nome, endereco").eq("id", obraId).single();
      
      const allAndarIds = torresQ.data.flatMap((t: any) => t.andares.map((a: any) => a.id));
      const { data: apontamentos } = await (supabase as any)
        .from("apontamentos")
        .select("id, andar_id, pos_x, pos_y, descricao, status")
        .in("andar_id", allAndarIds)
        .order("created_at", { ascending: true });

      const apontMap = new Map<string, any[]>();
      for (const ap of apontamentos ?? []) {
        if (!apontMap.has(ap.andar_id)) apontMap.set(ap.andar_id, []);
        apontMap.get(ap.andar_id)!.push({
          numero: apontMap.get(ap.andar_id)!.length + 1,
          descricao: ap.descricao,
          status: ap.status,
          posX: ap.pos_x,
          posY: ap.pos_y,
        });
      }

      const torresData = [];
      for (const torre of torresQ.data) {
        const andaresData = [];
        for (const andar of torre.andares) {
          let plantaUrl = "";
          if (andar.planta_storage_path) {
            const { data: pUrl } = await supabase.storage.from("plantas-baixa").createSignedUrl(andar.planta_storage_path, 3600);
            plantaUrl = pUrl?.signedUrl || "";
          }
          andaresData.push({
            numero: andar.numero_andar,
            apelido: andar.apelido,
            tipoAndar: andar.tipo_andar,
            torreNome: torre.nome,
            plantaUrl,
            apontamentos: apontMap.get(andar.id) ?? [],
          });
        }
        torresData.push({ nome: torre.nome, andares: andaresData });
      }

      const pdfBlob = await generateApontamentosPdf({
        obraNome: obraData?.nome || "Obra",
        endereco: obraData?.endereco || undefined,
        torres: torresData,
      });

      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Mapa-Torres-${obraData?.nome || obraId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">Estrutura das Torres</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => navigate({ search: { tab: "menu" } as any, replace: true })}>
            <Settings className="size-4 mr-2 hidden sm:inline" />
            Estrutura
          </Button>
          <Button size="sm" variant="outline" onClick={handleExportPdf}>
            <FileDown className="size-4 mr-2 hidden sm:inline" />
            PDF
          </Button>
        </div>
      </div>
      <div className="mt-4">
        <TorreMapaView obraId={obraId} torres={torresQ.data} apontamentoCounts={counts} />
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
  const [eapOpen, setEapOpen] = useState(false);
  const [projetosOpen, setProjetosOpen] = useState(false);
  const [confirmDeleteObra, setConfirmDeleteObra] = useState(false);

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
    { label: "Cronograma e EAP", onClick: () => setEapOpen(true), show: !isCliente },
    { label: "Projetos e Pranchas (CDE)", onClick: () => setProjetosOpen(true), show: true },
    { label: "Usuários com acesso", onClick: () => setEquipeOpen(true), show: isAdmin },
    { label: "Documentos da obra", onClick: () => setDocsOpen(true), show: !isCliente },
  ].filter((i) => i.show);

  return (
    <div className="space-y-4">
      <Card className="tour-obra-config">
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
          onClick={() => setConfirmDeleteObra(true)}
        >
          <Trash2 className="size-4 mr-2" />
          Excluir obra
        </Button>
      )}

      <AlertDialog open={confirmDeleteObra} onOpenChange={setConfirmDeleteObra}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir a obra "{String(obra.nome)}"?</AlertDialogTitle>
            <AlertDialogDescription>
              Todos os dados, relatórios e plantas associadas a esta obra serão permanentemente removidos. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              onClick={() => delObra.mutate()}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
      {eapOpen && (
        <Dialog open={eapOpen} onOpenChange={setEapOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <ObraEapTab obraId={obraId} />
          </DialogContent>
        </Dialog>
      )}
      {projetosOpen && (
        <Dialog open={projetosOpen} onOpenChange={setProjetosOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <ObraProjetosTab obraId={obraId} />
          </DialogContent>
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
          tipo_escopo: f.tipo_escopo || "global",
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
          <Label>Escopo da Obra</Label>
          <Select value={v("tipo_escopo") || "global"} onValueChange={(val: any) => setForm({ ...form, tipo_escopo: val })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="global">Global (Completa)</SelectItem>
              <SelectItem value="parcial">Parcial</SelectItem>
            </SelectContent>
          </Select>
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
  
  const [confirmTorreDelete, setConfirmTorreDelete] = useState<{ id: string; nome: string } | null>(null);
  const [confirmPlantaDelete, setConfirmPlantaDelete] = useState<string | null>(null);

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

  const handleRemovePlanta = async (grupoId: string) => {
    try {
      const { error: dbErr } = await (supabase as any)
        .from("torre_grupos_andar")
        .update({ planta_storage_path: null })
        .eq("id", grupoId);
      if (dbErr) throw dbErr;

      toast.success("Planta removida.");
      qc.invalidateQueries({ queryKey: ["obra-torres-estrutura", obraId] });
      qc.invalidateQueries({ queryKey: ["obra-torres", obraId] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao remover planta.");
    }
  };

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
                    onClick={() => setConfirmTorreDelete({ id: torre.id, nome: torre.nome })}
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
                      <span className="text-[0.65rem] font-medium text-muted-foreground uppercase">{g.tipo_andar}</span>
                    </div>
                    <div className="text-muted-foreground">
                      Andares {g.andar_inicial} a {g.andar_final}
                    </div>
                    <div className="flex items-center gap-2">
                      {g.planta_storage_path ? (
                        <div className="flex items-center gap-2">
                          <span className="text-success text-[0.65rem] flex items-center gap-1">
                            <CheckCircle2 className="size-3" />
                            Planta enviada
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id={`planta-replace-${g.id}`}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) void handlePlantaUpload(g.id, torre.id, file);
                            }}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-5 hover:text-primary"
                            onClick={() => document.getElementById(`planta-replace-${g.id}`)?.click()}
                            title="Substituir planta"
                          >
                            <Upload className="size-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-5 text-destructive hover:bg-destructive/10"
                            onClick={() => setConfirmPlantaDelete(g.id)}
                            title="Remover planta"
                          >
                            <Trash2 className="size-3" />
                          </Button>
                        </div>
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
                  <div className="border rounded p-3 bg-muted/20 space-y-3">
                    <div className="text-xs text-muted-foreground pb-2 mb-2 border-b">
                      <strong>Dica:</strong> Um "Grupo" representa andares que compartilham a <b>mesma planta-baixa</b>.
                      Se a torre tem uma planta diferente por andar, crie um grupo para cada andar (ex: 1 a 1).
                    </div>
                    <Input
                      placeholder="Nome do grupo (ex: Pavimentos Tipo)"
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
                        <SelectItem value="garagem">Garagem / Subsolo</SelectItem>
                        <SelectItem value="terreo">Térreo / Externo</SelectItem>
                        <SelectItem value="mezanino">Mezanino / Pilotis / Comum</SelectItem>
                        <SelectItem value="tipo">Andar Tipo</SelectItem>
                        <SelectItem value="comercial">Comercial / Loja</SelectItem>
                        <SelectItem value="tecnica">Área Técnica / Barrilete</SelectItem>
                        <SelectItem value="subestacao">Subestação / Casa de Força</SelectItem>
                        <SelectItem value="cobertura">Cobertura</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="tour-obra-config flex gap-2">
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

      <AlertDialog open={!!confirmTorreDelete} onOpenChange={(open) => !open && setConfirmTorreDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover torre?</AlertDialogTitle>
            <AlertDialogDescription>
              Você está prestes a remover a <strong>{confirmTorreDelete?.nome}</strong>. Todos os andares vinculados a ela serão perdidos. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              onClick={() => {
                if (confirmTorreDelete) delTorre.mutate(confirmTorreDelete.id);
                setConfirmTorreDelete(null);
              }}
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!confirmPlantaDelete} onOpenChange={(open) => !open && setConfirmPlantaDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover planta do andar?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover a imagem da planta-baixa deste andar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              onClick={() => {
                if (confirmPlantaDelete) handleRemovePlanta(confirmPlantaDelete);
                setConfirmPlantaDelete(null);
              }}
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
        <Upload className="size-4 mr-2" /> Enviar documento
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

/* ───────── Tab RDO ───────── */

import { useRdosDaObra, useCreateRdo } from "@/hooks/use-rdo";

function RdoTab({ obraId }: { obraId: string }) {
  const { data: rdos, isLoading } = useRdosDaObra(obraId);
  const createMut = useCreateRdo();
  const navigate = useNavigate();

  const handleCreate = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const rdoExistente = rdos?.find((r) => r.data === today && (!r.tipo || r.tipo === "diario"));
      
      if (rdoExistente) {
        toast.info("Você já possui um RDO Diário para a data de hoje. Abrindo RDO existente...");
        navigate({ to: "/obras/$obraId/rdos/$rdoId", params: { obraId, rdoId: rdoExistente.id } });
        return;
      }
      
      const rdo = await createMut.mutateAsync({ obra_id: obraId, data: today, tipo: "diario" });

      // Fetch Weather automatically
      try {
        const { data: obraData } = await supabase.from("obras").select("latitude, longitude").eq("id", obraId).single();
        if (obraData && obraData.latitude && obraData.longitude) {
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${obraData.latitude}&longitude=${obraData.longitude}&daily=weathercode&timezone=America/Sao_Paulo`);
          if (res.ok) {
            const weatherData = await res.json();
            const code = weatherData?.daily?.weathercode?.[0];
            let climaStr = "Ensolarado";
            if (code !== undefined) {
              if (code >= 1 && code <= 3) climaStr = "Nublado";
              if (code >= 51 && code <= 99) climaStr = "Chuvoso";
            }
            await supabase.from("rdos").update({
              condicao_tempo_manha: climaStr,
              condicao_tempo_tarde: climaStr,
            }).eq("id", rdo.id);
            toast.success(`Clima automático detectado: ${climaStr}`);
          }
        }
      } catch (weatherErr) {
        console.error("Falha ao buscar clima automático:", weatherErr);
      }

      navigate({ to: "/obras/$obraId/rdos/$rdoId", params: { obraId, rdoId: rdo.id } });
    } catch (e: any) {
      toast.error("Erro ao criar RDO: " + e.message);
    }
  };

  const handleCreateSemanal = async () => {
    try {
      const today = new Date();
      // Adjust to consider last monday
      const day = today.getDay(); // 0=Sun, 1=Mon...
      const monday = new Date(today);
      monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1));
      
      const requiredDays = [];
      for (let i = 0; i < 5; i++) { // Seg a Sex
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        requiredDays.push(d.toISOString().split("T")[0]);
      }

      const missing = requiredDays.filter(date => !rdos?.find(r => r.data === date && (!r.tipo || r.tipo === 'diario')));

      if (missing.length > 0) {
        toast.error(`Para gerar o RDO Semanal, você precisa preencher os RDOs diários de todos os dias úteis. Faltam: ${missing.map(d => format(new Date(d + "T12:00:00"), "dd/MM")).join(", ")}`);
        return;
      }

      const friday = requiredDays[4];
      const rdoSemanalExistente = rdos?.find((r) => r.data === friday && r.tipo === 'semanal');
      if (rdoSemanalExistente) {
        toast.info("Você já possui um RDO Semanal para esta semana. Abrindo...");
        navigate({ to: "/obras/$obraId/rdos/$rdoId", params: { obraId, rdoId: rdoSemanalExistente.id } });
        return;
      }

      const rdo = await createMut.mutateAsync({ obra_id: obraId, data: friday, tipo: "semanal" });
      navigate({ to: "/obras/$obraId/rdos/$rdoId", params: { obraId, rdoId: rdo.id } });
    } catch (e: any) {
      toast.error("Erro ao criar RDO Semanal: " + e.message);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 gap-4">
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="size-4 text-primary shrink-0" />
          Relatórios Diários de Obra
        </CardTitle>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 scrollbar-hide snap-x">
          <Button size="sm" variant="outline" className="shrink-0" onClick={handleCreateSemanal} disabled={createMut.isPending}>
            Novo RDO Semanal
          </Button>
          <Button size="sm" className="shrink-0" onClick={handleCreate} disabled={createMut.isPending}>
            <Plus className="size-4 mr-2" /> Novo RDO
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!rdos?.length ? (
          <p className="text-sm text-muted-foreground italic py-4 text-center">Nenhum RDO criado.</p>
        ) : (
          <ul className="divide-y">
            {rdos.map((rdo) => (
              <li key={rdo.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm flex items-center gap-2">
                    RDO #{rdo.numero_sequencial}
                    <div className="flex items-center gap-3">
                      {rdo.tipo === "semanal" && (
                        <span className="text-xs font-semibold text-primary">SEMANAL</span>
                      )}
                      <span className={`text-sm font-medium ${rdo.status === "aprovado" ? "text-success" : "text-muted-foreground"}`}>
                        {rdo.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {format(new Date(rdo.data), "dd/MM/yyyy")}
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/obras/$obraId/rdos/$rdoId", params: { obraId, rdoId: rdo.id } })}>
                  <ChevronLeft className="size-4 rotate-180" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
