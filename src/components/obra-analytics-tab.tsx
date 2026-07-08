import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Users, CloudRain, CheckCircle, TrendingUp, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format, subDays, parseISO, isAfter } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts";

interface ObraAnalyticsProps {
  obraId: string;
}

export function ObraAnalyticsTab({ obraId }: ObraAnalyticsProps) {
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["obra-analytics", obraId],
    enabled: !!obraId,
    queryFn: async () => {
      // Buscar todos os RDOs aprovados/enviados da obra (últimos 30 dias)
      const thirtyDaysAgo = subDays(new Date(), 30).toISOString();
      const { data: rdos, error: errRdo } = await supabase
        .from("rdos" as any)
        .select("id, data, status")
        .eq("obra_id", obraId)
        .gte("data", thirtyDaysAgo)
        .order("data", { ascending: true });

      if (errRdo) throw errRdo;
      if (!rdos || rdos.length === 0) return { rdos: [], chartData: [], stats: null };

      const rdoIds = rdos.map((r: any) => r.id);

      // Buscar Mao de Obra para esses RDOs
      const { data: maoObra } = await supabase
        .from("rdo_mao_de_obra" as any)
        .select("rdo_id, quantidade, tipo, empresa")
        .in("rdo_id", rdoIds);

      // Buscar Clima para esses RDOs
      const { data: climas } = await supabase
        .from("rdo_clima" as any)
        .select("rdo_id, condicao, praticavel, impacta_prazo")
        .in("rdo_id", rdoIds);
        
      // Buscar Ocorrencias para Impacto
      const { data: ocorrencias } = await supabase
        .from("rdo_ocorrencias" as any)
        .select("rdo_id, impacta_prazo")
        .in("rdo_id", rdoIds);

      // Buscar EAP da obra
      const { data: eap } = await supabase
        .from("obra_eap" as any)
        .select("peso_percentual, avanco_realizado")
        .eq("obra_id", obraId);

      // Processar dados para o gráfico
      const chartData = rdos.map((rdo: any) => {
        const mo = (maoObra || []).filter((m: any) => m.rdo_id === rdo.id);
        const totalProprio = mo.filter((m: any) => m.tipo === "proprio").reduce((acc: number, curr: any) => acc + (curr.quantidade || 0), 0);
        const totalTerceiro = mo.filter((m: any) => m.tipo === "terceirizado").reduce((acc: number, curr: any) => acc + (curr.quantidade || 0), 0);
        
        return {
          data: format(parseISO(rdo.data), "dd/MM", { locale: ptBR }),
          "Próprio": totalProprio,
          "Terceirizado": totalTerceiro,
          Total: totalProprio + totalTerceiro,
        };
      });

      // Calcular Stats
      const totalRdos = rdos.length;
      const diasImpraticaveis = (climas || []).filter((c: any) => c.praticavel === false).length;
      const rdosAprovados = rdos.filter((r: any) => r.status === "aprovado").length;
      const avgEfetivo = chartData.reduce((acc, curr) => acc + curr.Total, 0) / (totalRdos || 1);
      
      const climasImpacto = (climas || []).filter((c: any) => c.impacta_prazo === true).length;
      const ocorrenciasImpacto = (ocorrencias || []).filter((o: any) => o.impacta_prazo === true).length;
      
      // Agrupar Empreiteiras
      const empreiteirasMap = new Map<string, number>();
      (maoObra || []).forEach((m: any) => {
        if (m.tipo === "terceirizado" && m.empresa) {
          const emp = m.empresa.trim().toUpperCase();
          empreiteirasMap.set(emp, (empreiteirasMap.get(emp) || 0) + (m.quantidade || 0));
        }
      });
      
      const empreiteiras = Array.from(empreiteirasMap.entries())
        .map(([nome, total]) => ({ nome, total }))
        .sort((a, b) => b.total - a.total);

      // Calcular Avanço Global EAP
      const avancoGlobal = (eap || []).reduce((acc: number, item: any) => {
        return acc + ((item.avanco_realizado || 0) * (item.peso_percentual || 0) / 100);
      }, 0);

      return {
        rdos,
        chartData,
        stats: {
          totalRdos,
          diasImpraticaveis: Math.floor(diasImpraticaveis / 3), // dividindo por 3 pq clima é salvo por manha/tarde/noite
          rdosAprovados,
          avgEfetivo: Math.round(avgEfetivo),
          diasImpacto: Math.floor(climasImpacto / 3) + ocorrenciasImpacto,
          avancoGlobal: avancoGlobal.toFixed(2)
        },
        empreiteiras
      };
    }
  });

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="size-8 animate-spin text-muted-foreground" /></div>;
  }

  if (!analyticsData || analyticsData.rdos.length === 0) {
    return (
      <div className="text-center p-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
        Não há dados de RDO suficientes nos últimos 30 dias para gerar gráficos.
      </div>
    );
  }

  const { chartData, stats, empreiteiras } = analyticsData;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-primary text-primary-foreground border-primary/20">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="flex items-center gap-2 text-primary-foreground/80">
              <Target className="size-4" /> Avanço Global
            </CardDescription>
            <CardTitle className="text-3xl font-bold">{stats?.avancoGlobal}%</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-2">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="size-4 text-blue-500" /> Efetivo Médio
            </CardDescription>
            <CardTitle className="text-2xl">{stats?.avgEfetivo} <span className="text-sm font-normal text-muted-foreground">pessoas/dia</span></CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardDescription className="flex items-center gap-2 text-red-500">
              <CloudRain className="size-4" /> Impacto de Prazo (Claim)
            </CardDescription>
            <CardTitle className="text-2xl text-red-600">{stats?.diasImpacto} <span className="text-sm font-normal text-muted-foreground">eventos</span></CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardDescription className="flex items-center gap-2">
              <CheckCircle className="size-4 text-green-500" /> RDOs Aprovados
            </CardDescription>
            <CardTitle className="text-2xl">{stats?.rdosAprovados} <span className="text-sm font-normal text-muted-foreground">/ {stats?.totalRdos}</span></CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardDescription className="flex items-center gap-2">
              <Users className="size-4 text-amber-500" /> Total RDOs
            </CardDescription>
            <CardTitle className="text-2xl">{stats?.totalRdos} <span className="text-sm font-normal text-muted-foreground">dias</span></CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Curva de Mão de Obra (Últimos 30 dias)</CardTitle>
          <CardDescription>Acompanhe o pico de efetivo e a evolução das contratações próprias e terceirizadas.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProprio" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorTerc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="data" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="Próprio" stroke="#3b82f6" fillOpacity={1} fill="url(#colorProprio)" strokeWidth={2} />
                <Area type="monotone" dataKey="Terceirizado" stroke="#f59e0b" fillOpacity={1} fill="url(#colorTerc)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {empreiteiras && empreiteiras.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Consolidado de Empreiteiros / Terceirizados</CardTitle>
            <CardDescription>Total de Homens-Dia agrupados por empresa nos últimos 30 dias (para validação de Medição).</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/20 text-muted-foreground">
                    <th className="px-4 py-2 text-left font-medium">Empresa / Terceirizada</th>
                    <th className="px-4 py-2 text-right font-medium">Total (Homens-Dia)</th>
                  </tr>
                </thead>
                <tbody>
                  {empreiteiras.map((emp) => (
                    <tr key={emp.nome} className="border-b last:border-0 hover:bg-muted/10 transition-colors">
                      <td className="px-4 py-3 font-medium">{emp.nome}</td>
                      <td className="px-4 py-3 text-right">
                        <span className="bg-primary/10 text-primary font-bold px-2 py-1 rounded-md">
                          {emp.total} H.D
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
