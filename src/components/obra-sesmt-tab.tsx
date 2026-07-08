import { useState, useRef } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  ShieldAlert, 
  Users, 
  HardHat, 
  Plus, 
  Eye,
  FileText
} from "lucide-react";
import { useSesmtDds, useCreateDds, useSesmtEpis, useCreateEpi } from "@/hooks/use-sesmt";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export function ObraSesmtTab({ obraId, isAdmin }: { obraId: string; isAdmin: boolean }) {
  const ddsQuery = useSesmtDds(obraId);
  const episQuery = useSesmtEpis(obraId);
  const createDds = useCreateDds();
  const createEpi = useCreateEpi();

  const [openDds, setOpenDds] = useState(false);
  const [openEpi, setOpenEpi] = useState(false);
  
  const [ddsForm, setDdsForm] = useState({
    data: new Date().toISOString().split("T")[0],
    tema: "",
    instrutor: "",
    observacoes: "",
  });
  const [ddsFile, setDdsFile] = useState<File | null>(null);
  const ddsFileRef = useRef<HTMLInputElement>(null);

  const [epiForm, setEpiForm] = useState({
    funcionario: "",
    equipamento: "",
    ca_numero: "",
    data_entrega: new Date().toISOString().split("T")[0],
  });
  const [epiFile, setEpiFile] = useState<File | null>(null);
  const epiFileRef = useRef<HTMLInputElement>(null);

  const handleSaveDds = async () => {
    if (!ddsForm.tema.trim() || !ddsForm.instrutor.trim()) {
      toast.error("Preencha tema e instrutor.");
      return;
    }
    try {
      await createDds.mutateAsync({
        obra_id: obraId,
        ...ddsForm,
        file: ddsFile,
      });
      toast.success("DDS registrado com sucesso!");
      setOpenDds(false);
      setDdsForm({
        data: new Date().toISOString().split("T")[0],
        tema: "",
        instrutor: "",
        observacoes: "",
      });
      setDdsFile(null);
    } catch (e: any) {
      toast.error("Erro ao registrar DDS: " + e.message);
    }
  };

  const handleSaveEpi = async () => {
    if (!epiForm.funcionario.trim() || !epiForm.equipamento.trim()) {
      toast.error("Preencha funcionário e equipamento.");
      return;
    }
    try {
      await createEpi.mutateAsync({
        obra_id: obraId,
        ...epiForm,
        file: epiFile,
      });
      toast.success("EPI registrado com sucesso!");
      setOpenEpi(false);
      setEpiForm({
        funcionario: "",
        equipamento: "",
        ca_numero: "",
        data_entrega: new Date().toISOString().split("T")[0],
      });
      setEpiFile(null);
    } catch (e: any) {
      toast.error("Erro ao registrar EPI: " + e.message);
    }
  };

  const handleViewFile = async (path: string) => {
    try {
      const { data } = await supabase.storage.from("sesmt-arquivos").createSignedUrl(path, 3600);
      if (data?.signedUrl) {
        window.open(data.signedUrl, "_blank");
      }
    } catch (e) {
      toast.error("Erro ao abrir arquivo");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">Segurança do Trabalho (SESMT)</h2>
      </div>

      <Tabs defaultValue="dds" className="w-full">
        <TabsList className="w-full sm:w-auto grid grid-cols-2 sm:inline-flex">
          <TabsTrigger value="dds" className="flex items-center gap-2">
            <Users className="size-4" /> DDS
          </TabsTrigger>
          <TabsTrigger value="epis" className="flex items-center gap-2">
            <HardHat className="size-4" /> Controle de EPIs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dds" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Dialog open={openDds} onOpenChange={setOpenDds}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="size-4 mr-2" /> Registrar DDS</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Diálogo Diário de Segurança (DDS)</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Data</Label>
                      <Input type="date" value={ddsForm.data} onChange={e => setDdsForm({...ddsForm, data: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Instrutor / Técnico</Label>
                      <Input placeholder="Nome..." value={ddsForm.instrutor} onChange={e => setDdsForm({...ddsForm, instrutor: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Tema Abordado</Label>
                    <Input placeholder="Ex: Uso de cinturão, Risco elétrico..." value={ddsForm.tema} onChange={e => setDdsForm({...ddsForm, tema: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Lista de Presença Assinada (Opcional)</Label>
                    <div className="flex gap-2">
                      <Input type="file" ref={ddsFileRef} className="hidden" accept=".pdf,image/*" onChange={e => setDdsFile(e.target.files?.[0] || null)} />
                      <Button variant="outline" className="w-full" onClick={() => ddsFileRef.current?.click()}>
                        {ddsFile ? ddsFile.name : "Anexar Arquivo"}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Observações</Label>
                    <Textarea value={ddsForm.observacoes} onChange={e => setDdsForm({...ddsForm, observacoes: e.target.value})} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpenDds(false)}>Cancelar</Button>
                  <Button onClick={handleSaveDds} disabled={createDds.isPending}>Salvar DDS</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              {!ddsQuery.data?.length ? (
                <div className="py-12 text-center text-muted-foreground">
                  <ShieldAlert className="size-10 mx-auto mb-3 opacity-50" />
                  Nenhum DDS registrado.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
                      <tr>
                        <th className="px-4 py-3 font-medium">Data</th>
                        <th className="px-4 py-3 font-medium">Tema</th>
                        <th className="px-4 py-3 font-medium">Instrutor</th>
                        <th className="px-4 py-3 font-medium text-right">Presença</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {ddsQuery.data.map((dds) => (
                        <tr key={dds.id} className="hover:bg-muted/30">
                          <td className="px-4 py-3 whitespace-nowrap">{format(new Date(dds.data), "dd/MM/yyyy", { locale: ptBR })}</td>
                          <td className="px-4 py-3 font-medium">{dds.tema}</td>
                          <td className="px-4 py-3">{dds.instrutor}</td>
                          <td className="px-4 py-3 text-right">
                            {dds.arquivo_lista_presenca ? (
                              <Button variant="ghost" size="sm" onClick={() => handleViewFile(dds.arquivo_lista_presenca!)}>
                                <Eye className="size-4 mr-2" /> Ver Lista
                              </Button>
                            ) : (
                              <span className="text-muted-foreground text-xs italic">Sem anexo</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="epis" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Dialog open={openEpi} onOpenChange={setOpenEpi}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="size-4 mr-2" /> Entregar EPI</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Registro de Entrega de EPI</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Nome do Funcionário</Label>
                    <Input placeholder="Ex: José da Silva" value={epiForm.funcionario} onChange={e => setEpiForm({...epiForm, funcionario: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Equipamento (EPI)</Label>
                      <Input placeholder="Ex: Capacete, Bota..." value={epiForm.equipamento} onChange={e => setEpiForm({...epiForm, equipamento: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Nº do C.A. (Certificado)</Label>
                      <Input placeholder="Ex: 12345" value={epiForm.ca_numero} onChange={e => setEpiForm({...epiForm, ca_numero: e.target.value})} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Data de Entrega</Label>
                      <Input type="date" value={epiForm.data_entrega} onChange={e => setEpiForm({...epiForm, data_entrega: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Ficha Assinada (Opcional)</Label>
                      <div className="flex gap-2">
                        <Input type="file" ref={epiFileRef} className="hidden" accept=".pdf,image/*" onChange={e => setEpiFile(e.target.files?.[0] || null)} />
                        <Button variant="outline" className="w-full" onClick={() => epiFileRef.current?.click()}>
                          {epiFile ? epiFile.name : "Anexar Ficha"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpenEpi(false)}>Cancelar</Button>
                  <Button onClick={handleSaveEpi} disabled={createEpi.isPending}>Salvar Entrega</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              {!episQuery.data?.length ? (
                <div className="py-12 text-center text-muted-foreground">
                  <HardHat className="size-10 mx-auto mb-3 opacity-50" />
                  Nenhuma entrega de EPI registrada.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
                      <tr>
                        <th className="px-4 py-3 font-medium">Funcionário</th>
                        <th className="px-4 py-3 font-medium">Equipamento (C.A)</th>
                        <th className="px-4 py-3 font-medium">Data Entrega</th>
                        <th className="px-4 py-3 font-medium text-right">Ficha</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {episQuery.data.map((epi) => (
                        <tr key={epi.id} className="hover:bg-muted/30">
                          <td className="px-4 py-3 font-medium">{epi.funcionario}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {epi.equipamento}
                              {epi.ca_numero && <Badge variant="outline" className="text-[10px]">C.A: {epi.ca_numero}</Badge>}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">{format(new Date(epi.data_entrega), "dd/MM/yyyy", { locale: ptBR })}</td>
                          <td className="px-4 py-3 text-right">
                            {epi.termo_assinado_path ? (
                              <Button variant="ghost" size="sm" onClick={() => handleViewFile(epi.termo_assinado_path!)}>
                                <FileText className="size-4 mr-2" /> Ficha
                              </Button>
                            ) : (
                              <span className="text-muted-foreground text-xs italic">Sem anexo</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
