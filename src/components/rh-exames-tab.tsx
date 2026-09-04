import { useState } from "react";
import { useFuncionarios, useExames, useTreinamentosNR, useAdicionarExame, useAdicionarNR } from "@/hooks/use-rh";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

const EXAME_INITIAL = { funcionario_id: "", tipo_exame: "periodico", data_realizacao: "", data_vencimento: "" };
const NR_INITIAL = { funcionario_id: "", norma: "", carga_horaria: 8, data_realizacao: "", data_vencimento: "" };

/** Corrige o bug de fuso horário: "2024-01-15" exibido como 14/01 no Brasil */
function formatDateBR(dateStr: string) {
  if (!dateStr) return "—";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

export function RhExamesTab() {
  const { data: exames, isLoading: loadExames } = useExames();
  const { data: nrs, isLoading: loadNRs } = useTreinamentosNR();
  const { data: funcionarios } = useFuncionarios();
  
  const addExame = useAdicionarExame();
  const addNR = useAdicionarNR();

  const [openExame, setOpenExame] = useState(false);
  const [openNR, setOpenNR] = useState(false);

  const [exameForm, setExameForm] = useState(EXAME_INITIAL);
  const [nrForm, setNrForm] = useState(NR_INITIAL);

  const handleAddExame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exameForm.funcionario_id) { toast.error("Selecione um funcionário"); return; }
    await addExame.mutateAsync(exameForm);
    setOpenExame(false);
  };

  const handleAddNR = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nrForm.funcionario_id) { toast.error("Selecione um funcionário"); return; }
    if (isNaN(nrForm.carga_horaria) || nrForm.carga_horaria <= 0) { toast.error("Carga horária inválida"); return; }
    await addNR.mutateAsync(nrForm);
    setOpenNR(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* EXAMES (ASO) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Exames Ocupacionais (ASO)</CardTitle>
              <CardDescription>Histórico e validade de exames</CardDescription>
            </div>
            <Dialog open={openExame} onOpenChange={(v) => { setOpenExame(v); if (!v) setExameForm(EXAME_INITIAL); }}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="size-4 mr-1" /> Registrar</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Registrar Exame (ASO)</DialogTitle></DialogHeader>
                <form onSubmit={handleAddExame} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Funcionário</Label>
                    <Select value={exameForm.funcionario_id || undefined} onValueChange={(v) => setExameForm({...exameForm, funcionario_id: v})}>
                      <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                      <SelectContent>
                        {funcionarios?.map(f => <SelectItem key={f.id} value={f.id}>{f.nome}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo de Exame</Label>
                    <Select value={exameForm.tipo_exame} onValueChange={(v) => setExameForm({...exameForm, tipo_exame: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admissional">Admissional</SelectItem>
                        <SelectItem value="periodico">Periódico</SelectItem>
                        <SelectItem value="demissional">Demissional</SelectItem>
                        <SelectItem value="retorno_trabalho">Retorno ao Trabalho</SelectItem>
                        <SelectItem value="mudanca_risco">Mudança de Risco</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Data Realização</Label>
                      <Input type="date" required value={exameForm.data_realizacao} onChange={e => setExameForm({...exameForm, data_realizacao: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Vencimento</Label>
                      <Input type="date" required value={exameForm.data_vencimento} onChange={e => setExameForm({...exameForm, data_vencimento: e.target.value})} />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={addExame.isPending}>Salvar</Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {loadExames ? <Loader2 className="size-5 animate-spin text-muted-foreground mx-auto my-4" /> : (
              <div className="space-y-3 mt-4">
                {!exames?.length && <p className="text-center text-muted-foreground text-sm py-4">Nenhum exame registrado.</p>}
                {exames?.map(ex => {
                  const isVencido = ex.data_vencimento < new Date().toISOString().split('T')[0];
                  return (
                    <div key={ex.id} className="flex justify-between items-center p-3 border rounded-md text-sm">
                      <div>
                        <p className="font-medium">{ex.funcionario?.nome}</p>
                        <p className="text-xs text-muted-foreground capitalize">{ex.tipo_exame.replace('_', ' ')}</p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <Badge variant={isVencido ? "destructive" : "outline"} className={isVencido ? "" : "text-emerald-600 border-emerald-200"}>
                          Vence: {formatDateBR(ex.data_vencimento)}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* NRs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Treinamentos e NRs</CardTitle>
              <CardDescription>Controle de certificações exigidas</CardDescription>
            </div>
            <Dialog open={openNR} onOpenChange={(v) => { setOpenNR(v); if (!v) setNrForm(NR_INITIAL); }}>
              <DialogTrigger asChild>
                <Button size="sm" variant="secondary"><Plus className="size-4 mr-1" /> Registrar</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Registrar NR</DialogTitle></DialogHeader>
                <form onSubmit={handleAddNR} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Funcionário</Label>
                    <Select value={nrForm.funcionario_id || undefined} onValueChange={(v) => setNrForm({...nrForm, funcionario_id: v})}>
                      <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                      <SelectContent>
                        {funcionarios?.map(f => <SelectItem key={f.id} value={f.id}>{f.nome}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Norma (Ex: NR-35)</Label>
                      <Input required placeholder="NR-..." value={nrForm.norma} onChange={e => setNrForm({...nrForm, norma: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Carga Horária</Label>
                      <Input type="number" min="1" required value={nrForm.carga_horaria} onChange={e => setNrForm({...nrForm, carga_horaria: parseInt(e.target.value) || 0})} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Data Realização</Label>
                      <Input type="date" required value={nrForm.data_realizacao} onChange={e => setNrForm({...nrForm, data_realizacao: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Vencimento</Label>
                      <Input type="date" required value={nrForm.data_vencimento} onChange={e => setNrForm({...nrForm, data_vencimento: e.target.value})} />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={addNR.isPending}>Salvar</Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {loadNRs ? <Loader2 className="size-5 animate-spin text-muted-foreground mx-auto my-4" /> : (
              <div className="space-y-3 mt-4">
                {!nrs?.length && <p className="text-center text-muted-foreground text-sm py-4">Nenhum treinamento registrado.</p>}
                {nrs?.map(nr => {
                  const isVencido = nr.data_vencimento < new Date().toISOString().split('T')[0];
                  return (
                    <div key={nr.id} className="flex justify-between items-center p-3 border rounded-md text-sm">
                      <div>
                        <p className="font-medium">{nr.funcionario?.nome}</p>
                        <p className="text-xs text-muted-foreground">{nr.norma} • {nr.carga_horaria}h</p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <Badge variant={isVencido ? "destructive" : "outline"} className={isVencido ? "" : "text-blue-600 border-blue-200"}>
                          Vence: {formatDateBR(nr.data_vencimento)}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
