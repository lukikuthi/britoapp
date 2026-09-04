import { useState } from "react";
import { useFuncionarios, useFerias, useAgendarFerias } from "@/hooks/use-rh";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CalendarRange, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

const FORM_INITIAL = {
  funcionario_id: "",
  periodo_aquisitivo_inicio: "",
  periodo_aquisitivo_fim: "",
  data_inicio: "",
  data_fim: "",
  status: "agendada"
};

function formatDateBR(dateStr: string) {
  if (!dateStr) return "—";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

export function RhFeriasTab() {
  const { data: ferias, isLoading } = useFerias();
  const { data: funcionarios } = useFuncionarios();
  const addFerias = useAgendarFerias();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(FORM_INITIAL);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.funcionario_id) { toast.error("Selecione um funcionário"); return; }
    await addFerias.mutateAsync(form);
    setOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Controle de Férias</h2>
          <p className="text-sm text-muted-foreground">Agendamento e histórico de férias dos colaboradores</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setForm(FORM_INITIAL); }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Agendar Férias</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Novo Agendamento</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Funcionário</Label>
                <Select value={form.funcionario_id || undefined} onValueChange={(v) => setForm({...form, funcionario_id: v})}>
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    {funcionarios?.map(f => <SelectItem key={f.id} value={f.id}>{f.nome}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4 border p-3 rounded-md bg-muted/30">
                <div className="col-span-2"><Label className="text-xs font-semibold uppercase text-muted-foreground">Período Aquisitivo</Label></div>
                <div className="space-y-2">
                  <Label>Início</Label>
                  <Input type="date" required value={form.periodo_aquisitivo_inicio} onChange={e => setForm({...form, periodo_aquisitivo_inicio: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Fim</Label>
                  <Input type="date" required value={form.periodo_aquisitivo_fim} onChange={e => setForm({...form, periodo_aquisitivo_fim: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data de Saída</Label>
                  <Input type="date" required value={form.data_inicio} onChange={e => setForm({...form, data_inicio: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Data de Retorno</Label>
                  <Input type="date" required value={form.data_fim} onChange={e => setForm({...form, data_fim: e.target.value})} />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={addFerias.isPending}>
                {addFerias.isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null} Salvar Agendamento
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground" /></div>
          ) : !ferias?.length ? (
            <div className="text-center p-12 text-muted-foreground flex flex-col items-center">
              <CalendarRange className="size-12 mb-3 opacity-20" />
              Nenhuma férias agendada ou em andamento.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground border-b">
                  <tr>
                    <th className="p-4 font-medium">Colaborador</th>
                    <th className="p-4 font-medium">Período Aquisitivo</th>
                    <th className="p-4 font-medium">Gozo (Saída / Retorno)</th>
                    <th className="p-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {ferias.map(f => (
                    <tr key={f.id} className="hover:bg-muted/50 transition-colors">
                      <td className="p-4 font-medium">{f.funcionario?.nome}</td>
                      <td className="p-4 text-muted-foreground">
                        {formatDateBR(f.periodo_aquisitivo_inicio)} a {formatDateBR(f.periodo_aquisitivo_fim)}
                      </td>
                      <td className="p-4">
                        {formatDateBR(f.data_inicio)} <span className="text-muted-foreground mx-1">até</span> {formatDateBR(f.data_fim)}
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className={
                          f.status === 'em_andamento' ? 'bg-amber-100 text-amber-700 border-amber-300' :
                          f.status === 'agendada' ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-gray-100 text-gray-700'
                        }>
                          {f.status.replace('_', ' ')}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
