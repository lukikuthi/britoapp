import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Plus, FileText, Calendar, User, Save, ArrowLeft, BarChart3, CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";

import { useBoletins, useBoletimItens, useEapList, useCreateBoletim, useUpdateBoletimItens, BoletimMedicao } from "@/hooks/use-bm";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ObraBmTabProps {
  obraId: string;
}

export function ObraBmTab({ obraId }: ObraBmTabProps) {
  const { data: boletins, isLoading: loadingBoletins } = useBoletins(obraId);
  const [selectedBm, setSelectedBm] = useState<BoletimMedicao | null>(null);

  if (selectedBm) {
    return <BmDetailsView boletim={selectedBm} onBack={() => setSelectedBm(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Boletins de Medição
          </h2>
          <p className="text-muted-foreground">Gerencie as medições físicas da obra por período.</p>
        </div>
        <CreateBmDialog obraId={obraId} />
      </div>

      <Card className="border-slate-200/60 shadow-sm bg-white/50 backdrop-blur-xl">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Empreiteiro</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Data da Medição</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!loadingBoletins && boletins?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="w-8 h-8 text-slate-300" />
                      <p>Nenhum boletim encontrado.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {boletins?.map((bm) => (
                <TableRow key={bm.id} className="group hover:bg-slate-50/50 transition-colors">
                  <TableCell>
                    <StatusBadge status={bm.status} />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      {bm.empreiteiro}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(bm.periodo_inicio), "dd/MM/yyyy", { locale: ptBR })} - {format(new Date(bm.periodo_fim), "dd/MM/yyyy", { locale: ptBR })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-slate-600">
                      {format(new Date(bm.data_medicao), "dd/MM/yyyy", { locale: ptBR })}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedBm(bm)}>
                      Ver Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function CreateBmDialog({ obraId }: { obraId: string }) {
  const [open, setOpen] = useState(false);
  const createBm = useCreateBoletim();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await createBm.mutateAsync({
        obra_id: obraId,
        empreiteiro: formData.get("empreiteiro") as string,
        data_medicao: formData.get("data_medicao") as string,
        periodo_inicio: formData.get("periodo_inicio") as string,
        periodo_fim: formData.get("periodo_fim") as string,
      });
      toast.success("Boletim criado com sucesso!");
      setOpen(false);
    } catch (error) {
      toast.error("Erro ao criar boletim.");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Novo Boletim
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Boletim de Medição</DialogTitle>
          <DialogDescription>
            Insira os dados do novo boletim. Você poderá adicionar os avanços das atividades em seguida.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="empreiteiro">Empreiteiro / Fornecedor</Label>
            <Input id="empreiteiro" name="empreiteiro" placeholder="Ex: Construtora Alfa" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="data_medicao">Data da Medição</Label>
            <Input id="data_medicao" name="data_medicao" type="date" required defaultValue={new Date().toISOString().split('T')[0]} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="periodo_inicio">Período Início</Label>
              <Input id="periodo_inicio" name="periodo_inicio" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="periodo_fim">Período Fim</Label>
              <Input id="periodo_fim" name="periodo_fim" type="date" required />
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={createBm.isPending}>
              {createBm.isPending ? "Criando..." : "Criar Boletim"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function BmDetailsView({ boletim, onBack }: { boletim: BoletimMedicao; onBack: () => void }) {
  const { data: eapList, isLoading: loadingEap } = useEapList();
  const { data: bmItens, isLoading: loadingItens } = useBoletimItens(boletim.id);
  const updateItens = useUpdateBoletimItens();

  // Local state to handle input values before saving
  const [avancos, setAvancos] = useState<Record<string, number>>({});

  useEffect(() => {
    if (bmItens) {
      const initial: Record<string, number> = {};
      bmItens.forEach(item => {
        initial[item.eap_id] = item.avanco_medido_pct;
      });
      setAvancos(initial);
    }
  }, [bmItens]);

  const handleAvancoChange = (eapId: string, val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) return;
    setAvancos(prev => ({
      ...prev,
      [eapId]: Math.min(100, Math.max(0, num))
    }));
  };

  const handleSave = async () => {
    try {
      const itemsToSave = Object.entries(avancos).map(([eap_id, avanco_medido_pct]) => ({
        eap_id,
        avanco_medido_pct
      }));
      await updateItens.mutateAsync({
        boletim_id: boletim.id,
        items: itemsToSave
      });
      toast.success("Medições salvas com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar medições.");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight">Detalhes da Medição</h2>
            <StatusBadge status={boletim.status} />
          </div>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <User className="w-4 h-4" /> {boletim.empreiteiro} &bull; 
            <Calendar className="w-4 h-4" /> {format(new Date(boletim.periodo_inicio), "dd/MM")} a {format(new Date(boletim.periodo_fim), "dd/MM/yyyy")}
          </p>
        </div>
        <div className="ml-auto">
          <Button onClick={handleSave} disabled={updateItens.isPending} className="bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20">
            <Save className="w-4 h-4 mr-2" />
            {updateItens.isPending ? "Salvando..." : "Salvar Medições"}
          </Button>
        </div>
      </div>

      <Card className="border-slate-200/60 shadow-sm bg-white/50 backdrop-blur-xl overflow-hidden">
        <ScrollArea className="h-[600px] w-full">
          <Table>
            <TableHeader className="bg-slate-50/80 sticky top-0 backdrop-blur-md z-10">
              <TableRow>
                <TableHead className="w-[150px]">Código EAP</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-center w-[150px]">Progresso Atual</TableHead>
                <TableHead className="text-right w-[200px]">Nesta Medição (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingEap ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">Carregando pacotes...</TableCell>
                </TableRow>
              ) : (
                eapList?.map((eap) => (
                  <TableRow key={eap.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-mono text-sm font-medium text-slate-600">
                      {eap.codigo}
                    </TableCell>
                    <TableCell>
                      {eap.descricao}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                        {eap.progresso_pct || 0}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-2">
                        <Input 
                          type="number" 
                          min="0" 
                          max="100" 
                          step="0.01"
                          className="w-24 text-right font-medium" 
                          value={avancos[eap.id] !== undefined ? avancos[eap.id] : ""}
                          onChange={(e) => handleAvancoChange(eap.id, e.target.value)}
                          placeholder="0.00"
                        />
                        <span className="text-slate-400 text-sm">%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'emitido':
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200"><Clock className="w-3 h-3 mr-1" /> Emitido</Badge>;
    case 'aprovado':
      return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200"><CheckCircle2 className="w-3 h-3 mr-1" /> Aprovado</Badge>;
    default:
      return <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-100 border-slate-200"><BarChart3 className="w-3 h-3 mr-1" /> Rascunho</Badge>;
  }
}
