import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRdo, useUpdateRdo, useClonePreviousRdo } from "@/hooks/use-rdo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, FileDown, Loader2, Save } from "lucide-react";
import { MaoObraSection, EquipamentosSection, AtividadesSection, ComentariosSection, OcorrenciasSection, ClimaSection } from "@/components/rdo-sections";
import { RdoAssinaturaSection } from "@/components/rdo-assinatura-section";
import { FvsSection } from "@/components/fvs-section";
import { generateRdoPdf } from "@/lib/pdf-generator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useConfirmStore } from "@/components/confirm-dialog";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/obras/$obraId/rdos/$rdoId")({
  head: () => ({ meta: [{ title: "Editar RDO — BRITO ENGENHARIA" }] }),
  component: RdoEditorPage,
});

function RdoEditorPage() {
  const { obraId, rdoId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: rdo, isLoading } = useRdo(rdoId);
  const updateMut = useUpdateRdo();
  const cloneMut = useClonePreviousRdo();

  const handleClone = async () => {
    if (!rdo) return;
    if (!(await useConfirmStore.getState().confirm("Isso irá importar Mão de Obra e Equipamentos do último RDO. Deseja continuar?", "Importar dados"))) return;
    try {
      await cloneMut.mutateAsync({ obraId, currentRdoId: rdoId, currentDate: rdo.data });
      toast.success("Dados copiados com sucesso!");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleApprove = async () => {
    if (!(await useConfirmStore.getState().confirm("Tem certeza que deseja aprovar este RDO? Ele não poderá ser editado depois.", "Aprovar RDO"))) return;
    try {
      await updateMut.mutateAsync({ id: rdoId, status: "aprovado" });
      toast.success("RDO aprovado com sucesso!");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleExportPdf = async () => {
    if (!rdo) return;
    try {
      toast.info("Gerando PDF, aguarde...");
      // Fetching all necessary data directly to avoid missing data if accordions were never opened
      const fetchTable = async (table: string) => {
        const { data } = await supabase.from(table as any).select("*").eq("rdo_id", rdoId);
        return data || [];
      };

      const maoObra = await fetchTable("rdo_mao_de_obra");
      const equipamentos = await fetchTable("rdo_equipamentos");
      const atividades = await fetchTable("rdo_atividades");
      const ocorrencias = await fetchTable("rdo_ocorrencias");
      const clima = await fetchTable("rdo_clima");
      const midias = await fetchTable("rdo_midias");
      const andaresSelecionados = await fetchTable("rdo_andares_selecionados");
      
      // FVS and EAP (if available)
      const { data: fvsData } = await supabase.from("rdo_fvs").select("id, status, template:obra_fvs_templates(nome)").eq("rdo_id", rdoId);

      // Fetch "Diário Fotográfico" from the same day
      const { data: fotosDoDia } = await supabase
        .from("obra_fotografia_itens")
        .select("*")
        .eq("obra_id", obraId)
        .gte("created_at", `${rdo.data}T00:00:00Z`)
        .lte("created_at", `${rdo.data}T23:59:59Z`);

      // Combine explicitly uploaded RDO medias with the Daily Photography Feed
      const combinedMidias = [...(midias || [])];
      if (fotosDoDia && fotosDoDia.length > 0) {
        fotosDoDia.forEach(f => {
          combinedMidias.push({
            tipo: "imagem",
            storage_path: f.storage_path,
            legenda: f.titulo + (f.descricao ? ` - ${f.descricao}` : ""),
          });
        });
      }
      
      const pdfBlob = await generateRdoPdf(rdo, {
        maoObra,
        equipamentos,
        atividades,
        ocorrencias,
        clima,
        fvs: fvsData,
        midias: combinedMidias,
        andaresSelecionados
      }, obraId);
      const fileName = `RDO-${rdo.numero_sequencial}-${rdo.data}.pdf`;
      
      // Feature 3: Web Share API
      if (navigator.share && navigator.canShare) {
        const file = new File([pdfBlob], fileName, { type: "application/pdf" });
        if (navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: `RDO ${rdo.numero_sequencial}`,
              text: `Segue o Relatório Diário de Obra (RDO) do dia ${new Date(rdo.data).toLocaleDateString('pt-BR')}.`,
              files: [file],
            });
            return; // Encerrar se o share nativo funcionou
          } catch (shareErr: any) {
            if (shareErr.name !== "AbortError") {
              toast.error("Erro no compartilhamento nativo, baixando arquivo...");
            } else {
              return; // Usuário cancelou
            }
          }
        }
      }

      // Fallback: Download tradicional
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      toast.error("Erro ao gerar PDF: " + e.message);
    }
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="size-6 animate-spin" /></div>;
  }

  if (!rdo) {
    return <div className="p-8 text-center text-muted-foreground">RDO não encontrado.</div>;
  }

  const isAprovado = rdo.status === "aprovado";

  return (
    <div className="flex flex-col h-full bg-muted/10 min-h-[100dvh] pb-20">
      <header className="sticky top-0 z-30 bg-card border-b px-4 py-3 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: "/obras/$obraId", params: { obraId }, search: { tab: "rdo" } })}>
            <ChevronLeft className="size-5" />
          </Button>
          <div>
            <h1 className="font-semibold text-sm flex items-center gap-2">
              RDO #{rdo.numero_sequencial}
              {rdo.tipo === "semanal" && (
                <Badge variant="secondary" className="bg-primary/10 text-primary scale-90">SEMANAL</Badge>
              )}
            </h1>
            <p className="text-xs text-muted-foreground">{new Date(rdo.data).toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {rdo.status !== "aprovado" && (
            <>
              <Button size="sm" variant="outline" onClick={handleClone} disabled={cloneMut.isPending}>
                {cloneMut.isPending ? <Loader2 className="size-4 animate-spin" /> : "Copiar do Anterior"}
              </Button>
              <Button size="sm" variant="default" onClick={handleApprove} disabled={updateMut.isPending}>
                <Save className="size-4 mr-2" />
                Aprovar
              </Button>
            </>
          )}
          <Button size="sm" variant="outline" onClick={handleExportPdf}>
            <FileDown className="size-4 mr-2" />
            PDF
          </Button>
        </div>
      </header>

      <main className="p-4 max-w-4xl mx-auto w-full space-y-4">
        {isAprovado && (
          <div className="bg-success/10 text-success border border-success/20 p-3 rounded-lg text-sm flex items-center gap-2">
            Este RDO está aprovado e não pode mais ser editado.
          </div>
        )}

        <ClimaSection rdoId={rdoId} />
        <MaoObraSection rdoId={rdoId} />
        <EquipamentosSection rdoId={rdoId} />
        <AtividadesSection rdoId={rdoId} />
        <OcorrenciasSection rdoId={rdoId} />
        <FvsSection rdoId={rdoId} obraId={obraId} />
        <ComentariosSection rdoId={rdoId} />
        <RdoAssinaturaSection rdoId={rdoId} />
      </main>
    </div>
  );
}
