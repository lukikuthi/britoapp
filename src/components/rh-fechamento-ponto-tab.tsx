import { useState } from "react";
import { format } from "date-fns";
import { useFechamentoPonto } from "@/hooks/use-rh";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CalendarDays, FileDown, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export function RhFechamentoPontoTab() {
  const [mesAno, setMesAno] = useState(format(new Date(), 'yyyy-MM'));
  const { data: resumo, isLoading } = useFechamentoPonto(mesAno);

  const handleExport = () => {
    toast.info("Exportação para CSV / PDF será iniciada.");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <CalendarDays className="size-5 text-primary" />
                Fechamento de Ponto
              </CardTitle>
              <CardDescription>
                Consolidação dos apontamentos diários realizados pelos engenheiros nas obras.
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-3">
              <Input 
                type="month" 
                value={mesAno} 
                onChange={(e) => setMesAno(e.target.value)}
                className="w-40"
              />
              <Button onClick={handleExport} variant="outline" size="icon">
                <FileDown className="size-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div>
          ) : !resumo?.length ? (
            <div className="p-12 text-center text-muted-foreground border-t border-dashed">
              Nenhum apontamento encontrado para este mês.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground border-y">
                  <tr>
                    <th className="p-4 font-medium">Colaborador</th>
                    <th className="p-4 font-medium text-center">Dias Presente</th>
                    <th className="p-4 font-medium text-center">Faltas (Injust.)</th>
                    <th className="p-4 font-medium text-center">Atrasos</th>
                    <th className="p-4 font-medium text-center">Horas Extras</th>
                    <th className="p-4 font-medium text-right">Adicional HE Estimado</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {resumo.map((r: any) => {
                    const valorHora = (r.salario || 0) / 220; // base 220h mensais
                    const valorExtra = r.horas_extras * valorHora * 1.5; // adicional de 50%
                    
                    return (
                      <tr key={r.id} className="hover:bg-muted/50 transition-colors">
                        <td className="p-4">
                          <p className="font-medium">{r.nome}</p>
                          <p className="text-xs text-muted-foreground">{r.cargo}</p>
                        </td>
                        <td className="p-4 text-center font-medium text-emerald-600">{r.dias_presente}</td>
                        <td className="p-4 text-center text-red-500 font-medium">{r.faltas > 0 ? r.faltas : '-'}</td>
                        <td className="p-4 text-center text-amber-500 font-medium">{r.atrasos > 0 ? r.atrasos : '-'}</td>
                        <td className="p-4 text-center font-bold">
                          {r.horas_extras > 0 ? (
                            <span className="flex items-center justify-center gap-1 text-blue-600">
                              <Clock className="size-3" /> {r.horas_extras}h
                            </span>
                          ) : '-'}
                        </td>
                        <td className="p-4 text-right">
                          {valorExtra > 0 ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorExtra) : '-'}
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
      
      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="bg-blue-50/50 border-blue-100">
          <CardContent className="p-4 flex items-start gap-3">
            <Clock className="size-5 text-blue-500 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">Integração com Folha</p>
              <p className="text-sm text-blue-700/80">
                Os dados desta tela já consideram todos os DSRs e lançamentos das obras em tempo real. Exporte para enviar à contabilidade.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50/50 border-amber-100">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="size-5 text-amber-500 mt-0.5" />
            <div>
              <p className="font-medium text-amber-900">Faltas Injustificadas</p>
              <p className="text-sm text-amber-700/80">
                Descontos de DSR são aplicáveis caso o funcionário tenha faltado sem justificativa durante a semana correspondente.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
