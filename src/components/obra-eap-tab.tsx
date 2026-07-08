import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Target, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ObraEapProps {
  obraId: string;
}

export function ObraEapTab({ obraId }: ObraEapProps) {
  const queryClient = useQueryClient();
  const [novoCodigo, setNovoCodigo] = useState("");
  const [novaDescricao, setNovaDescricao] = useState("");
  const [novoPeso, setNovoPeso] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

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

  const addMut = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("obra_eap").insert({
        obra_id: obraId,
        codigo: novoCodigo,
        descricao: novaDescricao,
        peso_percentual: parseFloat(novoPeso) || 0,
        data_inicio_planejada: dataInicio || null,
        data_fim_planejada: dataFim || null
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["obra-eap", obraId] });
      setNovoCodigo("");
      setNovaDescricao("");
      setNovoPeso("");
      setDataInicio("");
      setDataFim("");
      toast.success("Atividade da EAP adicionada!");
    },
    onError: (e: any) => toast.error("Erro: " + e.message)
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("obra_eap").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["obra-eap", obraId] });
      toast.success("Atividade removida.");
    }
  });

  const avancoGeral = eapItems.reduce((acc, item) => acc + ((item.avanco_realizado || 0) * (item.peso_percentual || 0) / 100), 0);

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="size-8 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Target className="size-6 text-primary" /> 
            Cronograma Físico (EAP)
          </h2>
          <p className="text-muted-foreground mt-1">Gerencie a Estrutura Analítica do Projeto e acompanhe o avanço da obra.</p>
        </div>
        <div className="bg-primary/10 border-primary/20 border rounded-lg p-3 text-center min-w-[150px]">
          <p className="text-sm font-medium text-primary">Avanço Físico Global</p>
          <p className="text-3xl font-bold text-primary">{avancoGeral.toFixed(2)}%</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nova Tarefa na EAP</CardTitle>
          <CardDescription>Cadastre as tarefas com seus prazos e pesos percentuais no orçamento total.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="w-20">
              <label className="text-xs font-medium mb-1 block">Cód.</label>
              <Input placeholder="1.1" value={novoCodigo} onChange={e => setNovoCodigo(e.target.value)} />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs font-medium mb-1 block">Descrição da Tarefa</label>
              <Input placeholder="Fundação Profunda..." value={novaDescricao} onChange={e => setNovaDescricao(e.target.value)} />
            </div>
            <div className="w-24">
              <label className="text-xs font-medium mb-1 block">Peso (%)</label>
              <Input placeholder="15" type="number" step="0.01" value={novoPeso} onChange={e => setNovoPeso(e.target.value)} />
            </div>
            <div className="w-36">
              <label className="text-xs font-medium mb-1 block">Início Planejado</label>
              <Input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} />
            </div>
            <div className="w-36">
              <label className="text-xs font-medium mb-1 block">Fim Planejado</label>
              <Input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} />
            </div>
            <Button onClick={() => addMut.mutate()} disabled={!novoCodigo || !novaDescricao || addMut.isPending}>
              {addMut.isPending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4 mr-2" />} Adicionar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="px-4 py-3 text-left font-medium">Cód.</th>
                <th className="px-4 py-3 text-left font-medium">Descrição</th>
                <th className="px-4 py-3 text-left font-medium">Período Planejado</th>
                <th className="px-4 py-3 text-right font-medium">Peso Global</th>
                <th className="px-4 py-3 text-right font-medium">Avanço Realizado</th>
                <th className="px-4 py-3 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {eapItems.map((item) => {
                const hasDates = item.data_inicio_planejada && item.data_fim_planejada;
                const dateStr = hasDates 
                  ? `${new Date(item.data_inicio_planejada).toLocaleDateString('pt-BR')} até ${new Date(item.data_fim_planejada).toLocaleDateString('pt-BR')}`
                  : <span className="text-muted-foreground/50 text-xs italic">Não definido</span>;

                return (
                  <tr key={item.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-4 py-3 font-semibold">{item.codigo}</td>
                    <td className="px-4 py-3">{item.descricao}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{dateStr}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{item.peso_percentual}%</td>
                    <td className="px-4 py-3 text-right">
                      <span className="bg-green-100 text-green-800 font-bold px-2 py-1 rounded">
                        {item.avanco_realizado || 0}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => deleteMut.mutate(item.id)}>
                        <Trash2 className="size-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {eapItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    Nenhuma tarefa cadastrada na EAP. Adicione acima.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
