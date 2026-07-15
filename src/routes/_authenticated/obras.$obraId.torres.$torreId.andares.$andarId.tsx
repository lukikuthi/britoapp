import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Plus, Loader2, Download } from "lucide-react";
import { toast } from "sonner";
import { useConfirmStore } from "@/components/confirm-dialog";
import {
  useAndarDetail,
  useAndarApontamentos,
  usePlantaUrl,
  useCreateApontamento,
  useUpdateApontamento,
  useDeleteApontamento,
} from "@/hooks/use-apontamentos";
import { PlantaBaixaViewer } from "@/components/apontamentos/planta-baixa-viewer";
import { ApontamentoForm } from "@/components/apontamentos/apontamento-form";
import { ApontamentoLegend } from "@/components/apontamentos/apontamento-legend";
import { useRole } from "@/hooks/use-auth";

export const Route = createFileRoute(
  "/_authenticated/obras/$obraId/torres/$torreId/andares/$andarId",
)({
  head: () => ({ meta: [{ title: "Planta — BRITO ENGENHARIA" }] }),
  component: AndarDetailPage,
});

function AndarDetailPage() {
  const { obraId, torreId, andarId } = Route.useParams();
  const { data: role } = useRole();
  const isCliente = role === "cliente";
  const canEdit = !isCliente;

  const andar = useAndarDetail(andarId);
  const apontamentos = useAndarApontamentos(andarId);
  const plantaUrl = usePlantaUrl(andar.data?.grupo?.planta_storage_path);

  const createMut = useCreateApontamento();
  const updateMut = useUpdateApontamento();
  const deleteMut = useDeleteApontamento();

  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
  const [addingPin, setAddingPin] = useState(false);
  const [pendingPos, setPendingPos] = useState<{ x: number; y: number } | null>(null);

  const handleCreatePin = useCallback(
    (posX: number, posY: number) => {
      setPendingPos({ x: posX, y: posY });
      setSelectedPinId(null);
    },
    [],
  );

  const handleSavePin = useCallback(
    (descricao: string) => {
      if (!pendingPos) return;
      createMut.mutate(
        {
          andar_id: andarId,
          pos_x: pendingPos.x,
          pos_y: pendingPos.y,
          descricao,
          obraId,
        },
        {
          onSuccess: () => {
            setPendingPos(null);
            setAddingPin(false);
            toast.success("Apontamento criado.");
          },
          onError: (e) => toast.error(e.message),
        },
      );
    },
    [pendingPos, andarId, obraId, createMut],
  );

  const handleStatusChange = useCallback(
    (id: string, newStatus: "aberto" | "resolvido") => {
      updateMut.mutate(
        { id, status: newStatus, andarId, obraId },
        {
          onSuccess: () => toast.success(newStatus === "resolvido" ? "Marcado como resolvido." : "Reaberto."),
          onError: (e) => toast.error(e.message),
        },
      );
    },
    [andarId, obraId, updateMut],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (!(await useConfirmStore.getState().confirm("Excluir este apontamento?", "Excluir apontamento"))) return;
      deleteMut.mutate(
        { id, andarId, obraId },
        {
          onSuccess: () => {
            setSelectedPinId(null);
            toast.success("Apontamento excluído.");
          },
          onError: (e) => toast.error(e.message),
        },
      );
    },
    [andarId, obraId, deleteMut],
  );

  if (andar.isLoading) {
    return (
      <div className="p-6 flex justify-center">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  if (!andar.data) {
    return <div className="p-6 text-center text-muted-foreground">Andar não encontrado.</div>;
  }

  const title = andar.data.apelido || `Andar ${andar.data.numero_andar}`;
  const pins = (apontamentos.data ?? []).map((ap, i) => ({
    id: ap.id,
    pos_x: Number(ap.pos_x),
    pos_y: Number(ap.pos_y),
    status: ap.status,
    descricao: ap.descricao,
  }));

  const legendItems = (apontamentos.data ?? []).map((ap, i) => ({
    id: ap.id,
    numero: i + 1,
    descricao: ap.descricao,
    status: ap.status,
    created_at: ap.created_at,
  }));

  return (
    <div className="flex flex-col h-[100dvh]">
      {/* Header */}
      <header className="border-b bg-card px-4 py-3 flex items-center gap-3 shrink-0">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link
            to="/obras/$obraId"
            params={{ obraId }}
            search={{ tab: "mapa" }}
          >
            <ChevronLeft className="size-4" />
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-semibold truncate">
            {andar.data.torre.nome} — {title}
          </h1>
        </div>
        {canEdit && (
          <Button
            size="sm"
            variant={addingPin ? "default" : "outline"}
            onClick={() => {
              setAddingPin(!addingPin);
              setPendingPos(null);
              setSelectedPinId(null);
            }}
          >
            <Plus className="size-4" />
            {addingPin ? "Cancelar" : "Novo"}
          </Button>
        )}
      </header>

      {/* Main content area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Floor plan viewer */}
        <div className="flex-1 relative min-h-0">
          {plantaUrl.isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : !plantaUrl.data ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center space-y-2 p-4">
                <p className="text-sm">Nenhuma planta-baixa enviada para este andar.</p>
                <p className="text-xs">Envie uma planta pelo Menu → Estrutura da obra.</p>
              </div>
            </div>
          ) : (
            <PlantaBaixaViewer
              imageUrl={plantaUrl.data}
              pins={pins}
              selectedPinId={selectedPinId ?? undefined}
              onPinSelect={(id) => {
                setSelectedPinId(id);
                setPendingPos(null);
              }}
              onCreatePin={canEdit && addingPin ? handleCreatePin : undefined}
              addingPin={addingPin}
            />
          )}

          {/* New pin form overlay */}
          {pendingPos && (
            <div className="absolute bottom-4 left-4 right-4 z-30 md:right-auto md:max-w-sm">
              <ApontamentoForm
                onSave={handleSavePin}
                onCancel={() => setPendingPos(null)}
                saving={createMut.isPending}
              />
            </div>
          )}
        </div>

        {/* Legend sidebar */}
        <div className="md:w-80 lg:w-96 border-t md:border-t-0 md:border-l bg-card overflow-y-auto shrink-0 max-h-[35vh] md:max-h-none">
          <div className="p-3 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Apontamentos</h2>
              <Badge variant="outline" className="text-xs">
                {legendItems.filter((a) => a.status === "aberto").length} aberto{legendItems.filter((a) => a.status === "aberto").length !== 1 ? "s" : ""}
              </Badge>
            </div>
          </div>
          <ApontamentoLegend
            apontamentos={legendItems}
            selectedId={selectedPinId ?? undefined}
            onSelect={(id) => setSelectedPinId(id)}
            onStatusChange={canEdit ? handleStatusChange : undefined}
            onDelete={canEdit ? handleDelete : undefined}
            editable={canEdit}
          />
        </div>
      </div>
    </div>
  );
}
