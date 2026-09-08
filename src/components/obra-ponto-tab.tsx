import { useState, useEffect } from "react";
import { useFuncionariosAlocados, usePontoDiario, useSalvarPonto } from "@/hooks/use-ponto";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save, UserCheck, CalendarDays, ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const STATUS_PRESENCA = [
  { value: "presente", label: "Presente", color: "bg-emerald-100 text-emerald-800" },
  { value: "falta_justificada", label: "Falta Just.", color: "bg-amber-100 text-amber-800" },
  { value: "falta_injustificada", label: "Falta Injust.", color: "bg-red-100 text-red-800" },
  { value: "atraso", label: "Atraso", color: "bg-orange-100 text-orange-800" },
  { value: "ferias", label: "Férias", color: "bg-blue-100 text-blue-800" },
  { value: "afastado", label: "Afastado", color: "bg-slate-100 text-slate-800" }
];

export function ObraPontoTab({ obraId }: { obraId: string }) {
  const [dataAtual, setDataAtual] = useState(new Date().toISOString().split('T')[0]);
  const [registros, setRegistros] = useState<Record<string, any>>({});

  const { data: funcionarios, isLoading: loadingFunc } = useFuncionariosAlocados(obraId);
  const { data: pontoSalvo, isLoading: loadingPonto } = usePontoDiario(obraId, dataAtual);
  const salvarPonto = useSalvarPonto();

  // Quando carregar os dados do dia, preenche o state
  useEffect(() => {
    if (funcionarios && pontoSalvo) {
      const stateInicial: Record<string, any> = {};
      
      funcionarios.forEach(f => {
        const salvo = pontoSalvo.get(f.id);
        stateInicial[f.id] = {
          funcionario_id: f.id,
          presenca: salvo?.presenca || "presente", // default presente
          horas_extras: salvo?.horas_extras || 0,
          observacao: salvo?.observacao || ""
        };
      });
      
      setRegistros(stateInicial);
    }
  }, [funcionarios, pontoSalvo]);

  const handleChange = (funcId: string, field: string, value: any) => {
    setRegistros(prev => ({
      ...prev,
      [funcId]: {
        ...prev[funcId],
        [field]: value
      }
    }));
  };

  const handleSalvar = async () => {
    const arr = Object.values(registros);
    if (arr.length === 0) return;
    
    await salvarPonto.mutateAsync({
      obraId,
      dataPonto: dataAtual,
      registros: arr
    });
  };

  if (loadingFunc || loadingPonto) {
    return <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div>;
  }

  if (!funcionarios?.length) {
    return (
      <div className="p-12 text-center max-w-lg mx-auto">
        <UserCheck className="size-12 mx-auto text-muted-foreground mb-4 opacity-50" />
        <h3 className="text-lg font-semibold">Nenhum funcionário alocado</h3>
        <p className="text-muted-foreground">O RH precisa alocar os funcionários para esta obra para que você possa apontar o ponto.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ClipboardList className="size-5" /> Apontamento de Horas
          </h2>
          <p className="text-sm text-muted-foreground">Ponto diário para integração com folha do RH</p>
        </div>
        
        <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-lg border">
          <CalendarDays className="size-4 text-muted-foreground" />
          <Input 
            type="date" 
            value={dataAtual} 
            onChange={e => setDataAtual(e.target.value)}
            className="w-40 border-none bg-transparent shadow-none"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground border-b">
                <tr>
                  <th className="p-4 font-medium">Nome do Colaborador</th>
                  <th className="p-4 font-medium">Cargo</th>
                  <th className="p-4 font-medium w-[180px]">Status (Presença)</th>
                  <th className="p-4 font-medium w-[120px]">Hora Extra</th>
                  <th className="p-4 font-medium min-w-[200px]">Observação</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {funcionarios.map(f => {
                  const reg = registros[f.id];
                  if (!reg) return null;
                  
                  const statusOpt = STATUS_PRESENCA.find(s => s.value === reg.presenca);

                  return (
                    <tr key={f.id} className="hover:bg-muted/50 transition-colors">
                      <td className="p-4 font-medium">{f.nome}</td>
                      <td className="p-4 text-muted-foreground">{f.cargo}</td>
                      <td className="p-4">
                        <Select value={reg.presenca} onValueChange={(v) => handleChange(f.id, 'presenca', v)}>
                          <SelectTrigger className={`h-8 text-xs font-semibold ${statusOpt?.color}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_PRESENCA.map(s => (
                              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-4">
                        <Input 
                          type="number" 
                          step="0.5" 
                          min="0" 
                          max="24"
                          className="h-8 text-xs" 
                          value={reg.horas_extras || ""} 
                          onChange={(e) => handleChange(f.id, 'horas_extras', parseFloat(e.target.value))}
                          placeholder="Ex: 1.5"
                        />
                      </td>
                      <td className="p-4">
                        <Input 
                          type="text" 
                          className="h-8 text-xs" 
                          value={reg.observacao} 
                          onChange={(e) => handleChange(f.id, 'observacao', e.target.value)}
                          placeholder="Motivo da falta, atraso, etc."
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSalvar} disabled={salvarPonto.isPending} className="w-full sm:w-auto">
          {salvarPonto.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Salvar Apontamento do Dia
        </Button>
      </div>
    </div>
  );
}
