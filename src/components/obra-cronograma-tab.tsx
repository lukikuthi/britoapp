import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, CalendarRange } from "lucide-react";
import { addDays, differenceInDays, format, min, max, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ObraCronogramaProps {
  obraId: string;
}

export function ObraCronogramaTab({ obraId }: ObraCronogramaProps) {
  const { data: eapItems = [], isLoading } = useQuery({
    queryKey: ["obra-eap", obraId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("obra_eap")
        .select("*")
        .eq("obra_id", obraId)
        .order("codigo", { ascending: true });
      if (error && error.code !== "PGRST116") throw error;
      return data || [];
    }
  });

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="size-8 animate-spin" /></div>;

  const validItems = eapItems.filter(item => item.data_inicio_planejada && item.data_fim_planejada);

  if (validItems.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <CalendarRange className="size-6 text-primary" />
          Cronograma Visual (Gantt)
        </h2>
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            <p>Nenhuma tarefa da EAP possui datas de início e fim cadastradas.</p>
            <p className="text-sm mt-2">Vá até a aba "EAP" e cadastre os prazos para visualizar o Gantt.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Encontrar o período global do projeto
  const minDate = min(validItems.map(i => new Date(i.data_inicio_planejada)));
  const maxDate = max(validItems.map(i => new Date(i.data_fim_planejada)));
  
  // Criar array de meses/semanas para o header do gráfico
  const startGantt = startOfWeek(minDate, { weekStartsOn: 1 });
  const totalDays = differenceInDays(maxDate, startGantt) + 7; // add buffer
  const daysArray = Array.from({ length: totalDays }, (_, i) => addDays(startGantt, i));

  // Função para desenhar a barra da tarefa
  const renderTaskBar = (start: string, end: string, progress: number = 0) => {
    const taskStart = new Date(start);
    const taskEnd = new Date(end);
    
    // Calcula offsets em % relativos ao totalDays
    const leftOffset = (differenceInDays(taskStart, startGantt) / totalDays) * 100;
    const width = (differenceInDays(taskEnd, taskStart) / totalDays) * 100;
    const progressWidth = `${progress}%`;

    return (
      <div className="relative h-6 w-full bg-muted/20 rounded group">
        <div 
          className="absolute h-full rounded shadow-sm overflow-hidden flex items-center bg-primary/20"
          style={{ left: `${Math.max(0, leftOffset)}%`, width: `${Math.max(1, width)}%` }}
        >
          <div 
            className="h-full bg-primary transition-all duration-500" 
            style={{ width: progressWidth }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <CalendarRange className="size-6 text-primary" />
          Cronograma Visual (Gantt)
        </h2>
        <p className="text-muted-foreground mt-1">Acompanhe o andamento físico da obra ao longo do tempo.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Linha do Tempo</CardTitle>
          <CardDescription>
            De {format(minDate, "dd/MM/yyyy")} a {format(maxDate, "dd/MM/yyyy")}
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto pb-4">
          <div className="min-w-[800px]">
            {/* Cabeçalho da Tabela Gantt */}
            <div className="flex border-b border-border pb-2 mb-4">
              <div className="w-[30%] shrink-0 font-medium text-sm text-muted-foreground pl-2">Tarefas da EAP</div>
              <div className="flex-1 relative">
                {/* Timeline Axis */}
                <div className="absolute left-0 text-xs text-muted-foreground -top-4">Início Projeto</div>
                <div className="absolute right-0 text-xs text-muted-foreground -top-4">Fim Previsto</div>
                <div className="w-full h-full border-l border-r border-border/50 relative">
                  {/* Linha pontilhada no dia de hoje */}
                  {(() => {
                    const today = new Date();
                    if (today >= startGantt && today <= maxDate) {
                      const todayOffset = (differenceInDays(today, startGantt) / totalDays) * 100;
                      return (
                        <div 
                          className="absolute h-full w-[1px] border-l-2 border-dashed border-red-500/50 z-10" 
                          style={{ left: `${todayOffset}%` }}
                        >
                          <span className="absolute -top-5 -left-3 text-[10px] text-red-500 font-bold bg-background px-1">Hoje</span>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              </div>
            </div>

            {/* Linhas das Tarefas */}
            <div className="space-y-3">
              {validItems.map(item => (
                <div key={item.id} className="flex items-center group">
                  <div className="w-[30%] shrink-0 pr-4 truncate">
                    <span className="text-xs font-bold mr-2 text-primary">{item.codigo}</span>
                    <span className="text-sm" title={item.descricao}>{item.descricao}</span>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {format(new Date(item.data_inicio_planejada), "dd/MMM", {locale: ptBR})} - {format(new Date(item.data_fim_planejada), "dd/MMM", {locale: ptBR})} ({item.avanco_realizado || 0}%)
                    </p>
                  </div>
                  <div className="flex-1 relative">
                    {renderTaskBar(item.data_inicio_planejada, item.data_fim_planejada, item.avanco_realizado || 0)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
