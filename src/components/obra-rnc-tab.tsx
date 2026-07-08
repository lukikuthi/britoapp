import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  PlusCircle, 
  AlertTriangle, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  XCircle,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import { useRncs, useCreateRnc, useUpdateRnc, ObraRnc, CreateObraRnc } from "@/hooks/use-rnc";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface ObraRncTabProps {
  obraId: string;
}

const STATUS_LABELS: Record<ObraRnc["status"], string> = {
  aberta: "Aberta",
  em_andamento: "Em Andamento",
  fechada: "Fechada",
  cancelada: "Cancelada",
};

export function ObraRncTab({ obraId }: ObraRncTabProps) {
  const { data: rncs, isLoading } = useRncs(obraId);
  const createRnc = useCreateRnc();
  const updateRnc = useUpdateRnc();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<CreateObraRnc>>({
    descricao: "",
    causa_raiz: "",
    acao_corretiva: "",
    prazo_resolucao: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.descricao) {
      toast.error("A descrição do problema é obrigatória.");
      return;
    }

    try {
      await createRnc.mutateAsync({
        obra_id: obraId,
        descricao: formData.descricao,
        causa_raiz: formData.causa_raiz || null,
        acao_corretiva: formData.acao_corretiva || null,
        prazo_resolucao: formData.prazo_resolucao || null,
        status: "aberta",
        data_fechamento: null,
        observacoes: null,
      });
      toast.success("RNC registrada com sucesso!");
      setIsDialogOpen(false);
      setFormData({
        descricao: "",
        causa_raiz: "",
        acao_corretiva: "",
        prazo_resolucao: "",
      });
    } catch (error: any) {
      toast.error(error.message || "Erro ao registrar RNC.");
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: ObraRnc["status"]) => {
    try {
      const updates: any = { status: newStatus };
      if (newStatus === "fechada") {
        updates.data_fechamento = new Date().toISOString();
      } else {
        updates.data_fechamento = null;
      }
      await updateRnc.mutateAsync({ id, ...updates });
      toast.success(`Status atualizado para ${STATUS_LABELS[newStatus]}`);
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar status.");
    }
  };

  const getStatusBadge = (status: ObraRnc["status"]) => {
    switch (status) {
      case "aberta":
        return <Badge variant="destructive" className="flex items-center gap-1 w-fit"><AlertTriangle className="w-3 h-3" /> Aberta</Badge>;
      case "em_andamento":
        return <Badge className="bg-amber-500 hover:bg-amber-600 flex items-center gap-1 w-fit"><Clock className="w-3 h-3" /> Em Andamento</Badge>;
      case "fechada":
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 flex items-center gap-1 w-fit"><CheckCircle2 className="w-3 h-3" /> Fechada</Badge>;
      case "cancelada":
        return <Badge variant="secondary" className="flex items-center gap-1 w-fit"><XCircle className="w-3 h-3" /> Cancelada</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Relatório de Não Conformidade (RNC)</h2>
          <p className="text-muted-foreground">
            Gerencie problemas, identifique causas raízes e acompanhe ações corretivas.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="shrink-0 gap-2">
              <PlusCircle className="w-4 h-4" />
              Nova RNC
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Registrar Não Conformidade</DialogTitle>
                <DialogDescription>
                  Preencha os detalhes do problema encontrado e as ações propostas.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição do Problema *</Label>
                  <Textarea
                    id="descricao"
                    placeholder="Descreva a não conformidade encontrada..."
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    required
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="causa">Causa Raiz (Ex: 5 Porquês)</Label>
                  <Textarea
                    id="causa"
                    placeholder="Por que este problema ocorreu?"
                    value={formData.causa_raiz || ""}
                    onChange={(e) => setFormData({ ...formData, causa_raiz: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="acao">Ação Corretiva</Label>
                  <Textarea
                    id="acao"
                    placeholder="O que será feito para corrigir e evitar reincidência?"
                    value={formData.acao_corretiva || ""}
                    onChange={(e) => setFormData({ ...formData, acao_corretiva: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prazo">Prazo de Resolução</Label>
                  <Input
                    id="prazo"
                    type="date"
                    value={formData.prazo_resolucao || ""}
                    onChange={(e) => setFormData({ ...formData, prazo_resolucao: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createRnc.isPending}>
                  {createRnc.isPending ? "Salvando..." : "Salvar RNC"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <p className="text-muted-foreground animate-pulse">Carregando RNCs...</p>
        </div>
      ) : !rncs || rncs.length === 0 ? (
        <Card className="flex flex-col items-center justify-center h-48 border-dashed">
          <FileText className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
          <p className="text-muted-foreground">Nenhuma RNC registrada para esta obra.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {rncs.map((rnc) => (
            <Card key={rnc.id} className="flex flex-col shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3 border-b">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1.5 flex-1">
                    <CardTitle className="text-base leading-tight">
                      {rnc.descricao}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 text-xs">
                      <Clock className="w-3 h-3" />
                      {format(new Date(rnc.created_at), "dd 'de' MMM, yyyy", { locale: ptBR })}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 -mr-2">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Opções</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleUpdateStatus(rnc.id, "aberta")}>
                        Marcar como Aberta
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateStatus(rnc.id, "em_andamento")}>
                        Marcar como Em Andamento
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateStatus(rnc.id, "fechada")}>
                        Marcar como Fechada
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateStatus(rnc.id, "cancelada")}>
                        Marcar como Cancelada
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="flex-1 pt-4 text-sm space-y-4">
                {rnc.causa_raiz && (
                  <div>
                    <span className="font-medium text-muted-foreground block text-xs uppercase tracking-wider mb-1">Causa Raiz</span>
                    <p className="text-foreground/90 whitespace-pre-wrap">{rnc.causa_raiz}</p>
                  </div>
                )}
                {rnc.acao_corretiva && (
                  <div>
                    <span className="font-medium text-muted-foreground block text-xs uppercase tracking-wider mb-1">Ação Corretiva</span>
                    <p className="text-foreground/90 whitespace-pre-wrap">{rnc.acao_corretiva}</p>
                  </div>
                )}
                {rnc.prazo_resolucao && (
                  <div className="bg-muted/50 p-2 rounded-md flex items-center gap-2 mt-4">
                    <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">Prazo:</span>
                    <span className="font-medium text-foreground">
                      {format(new Date(rnc.prazo_resolucao), "dd/MM/yyyy")}
                    </span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-0 flex justify-between items-center px-6 py-3 bg-muted/20 border-t">
                {getStatusBadge(rnc.status)}
                {rnc.data_fechamento && (
                  <span className="text-xs text-muted-foreground font-medium">
                    Fechada em {format(new Date(rnc.data_fechamento), "dd/MM/yy")}
                  </span>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
