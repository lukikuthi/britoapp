import { useState, useRef } from "react";
import { useConfirmStore } from "@/components/confirm-dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  FileCheck, 
  UploadCloud, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MoreVertical,
  Trash2,
  Eye,
  FileText
} from "lucide-react";
import { useLaudos, useCreateLaudo, useUpdateLaudoStatus, useDeleteLaudo } from "@/hooks/use-comissionamento";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const STATUS_CONFIG: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  pendente: { icon: <Clock className="size-4" />, label: "Pendente", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
  aprovado: { icon: <CheckCircle2 className="size-4" />, label: "Aprovado", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
  reprovado: { icon: <XCircle className="size-4" />, label: "Reprovado", color: "text-red-500 bg-red-500/10 border-red-500/20" },
};

export function ObraComissionamentoTab({ obraId, isAdmin }: { obraId: string; isAdmin: boolean }) {
  const { data: laudos, isLoading } = useLaudos(obraId);
  const createLaudo = useCreateLaudo();
  const updateStatus = useUpdateLaudoStatus();
  const deleteLaudo = useDeleteLaudo();

  const [openNova, setOpenNova] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    disciplina: "eletrica",
    tipo_ensaio: "",
    data_ensaio: new Date().toISOString().split("T")[0],
    observacoes: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    if (!file) {
      toast.error("Anexe o arquivo PDF do laudo.");
      return;
    }
    if (!form.tipo_ensaio.trim()) {
      toast.error("Informe o tipo de ensaio.");
      return;
    }

    try {
      await createLaudo.mutateAsync({
        obra_id: obraId,
        disciplina: form.disciplina,
        tipo_ensaio: form.tipo_ensaio,
        data_ensaio: form.data_ensaio,
        observacoes: form.observacoes || undefined,
        file,
      });
      toast.success("Laudo enviado com sucesso!");
      setOpenNova(false);
      setFile(null);
      setForm({
        disciplina: "eletrica",
        tipo_ensaio: "",
        data_ensaio: new Date().toISOString().split("T")[0],
        observacoes: "",
      });
    } catch (e: any) {
      toast.error("Erro ao enviar laudo: " + e.message);
    }
  };

  const handleViewFile = async (path: string) => {
    try {
      const { data } = await supabase.storage.from("laudos-ensaios").createSignedUrl(path, 3600);
      if (data?.signedUrl) {
        window.open(data.signedUrl, "_blank");
      }
    } catch (e) {
      toast.error("Erro ao abrir arquivo");
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Carregando laudos...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">Laudos Técnicos e Ensaios</h2>
        
        <Dialog open={openNova} onOpenChange={setOpenNova}>
          <DialogTrigger asChild>
            <Button size="sm">
              <UploadCloud className="size-4 mr-2" /> Enviar Laudo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Anexar Novo Laudo / Ensaio</DialogTitle>
              <DialogDescription>
                Faça o upload do certificado de calibração ou laudo técnico em PDF.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Disciplina</Label>
                  <Select value={form.disciplina} onValueChange={(v) => setForm({...form, disciplina: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eletrica">Elétrica</SelectItem>
                      <SelectItem value="civil">Civil</SelectItem>
                      <SelectItem value="hidraulica">Hidráulica</SelectItem>
                      <SelectItem value="incendio">Prevenção a Incêndio</SelectItem>
                      <SelectItem value="climatizacao">Climatização</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Data do Ensaio</Label>
                  <Input 
                    type="date" 
                    value={form.data_ensaio} 
                    onChange={(e) => setForm({...form, data_ensaio: e.target.value})} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tipo de Ensaio</Label>
                <Input 
                  placeholder="Ex: Megômetro, Resistência de Aterramento..." 
                  value={form.tipo_ensaio}
                  onChange={(e) => setForm({...form, tipo_ensaio: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Arquivo PDF</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    type="file" 
                    accept=".pdf,image/*" 
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
                    {file ? file.name : "Selecionar Arquivo"}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Observações (Opcional)</Label>
                <Textarea 
                  placeholder="Detalhes ou ressalvas sobre o laudo..."
                  value={form.observacoes}
                  onChange={(e) => setForm({...form, observacoes: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenNova(false)}>Cancelar</Button>
              <Button onClick={handleSave} disabled={createLaudo.isPending}>
                {createLaudo.isPending ? "Enviando..." : "Salvar Laudo"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {!laudos?.length ? (
            <div className="py-12 text-center text-muted-foreground">
              <FileCheck className="size-10 mx-auto mb-3 opacity-50" />
              Nenhum laudo técnico anexado.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 font-medium">Disciplina</th>
                    <th className="px-4 py-3 font-medium">Tipo de Ensaio</th>
                    <th className="px-4 py-3 font-medium">Data</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {laudos.map((laudo) => {
                    const statusCfg = STATUS_CONFIG[laudo.status_aprovacao];
                    return (
                      <tr key={laudo.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 capitalize font-medium">{laudo.disciplina}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <FileText className="size-4 text-primary/60" />
                            {laudo.tipo_ensaio}
                          </div>
                          {laudo.observacoes && (
                            <div className="text-xs text-muted-foreground mt-0.5 truncate max-w-[200px]">
                              {laudo.observacoes}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {format(new Date(laudo.data_ensaio), "dd/MM/yyyy", { locale: ptBR })}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className={`gap-1 pr-2 ${statusCfg.color}`}>
                            {statusCfg.icon} {statusCfg.label}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleViewFile(laudo.arquivo_path)}>
                              <Eye className="size-4 mr-2" /> Abrir
                            </Button>
                            
                            {isAdmin && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="size-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => updateStatus.mutate({ id: laudo.id, obraId, status: "aprovado" })}>
                                    <CheckCircle2 className="size-4 mr-2 text-emerald-500" /> Aprovar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => updateStatus.mutate({ id: laudo.id, obraId, status: "reprovado" })}>
                                    <XCircle className="size-4 mr-2 text-red-500" /> Reprovar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-destructive"
                                    onClick={async () => {
                                      const ok = await useConfirmStore.getState().confirm("Deseja realmente excluir este laudo?", "Excluir laudo");
                                      if(ok) {
                                        deleteLaudo.mutate({ id: laudo.id, obraId, arquivoPath: laudo.arquivo_path });
                                      }
                                    }}
                                  >
                                    <Trash2 className="size-4 mr-2" /> Excluir
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
