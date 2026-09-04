import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Send, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface ChatSetorProps {
  moduloAtual: string;
}

export function ChatSetor({ moduloAtual }: ChatSetorProps) {
  const qc = useQueryClient();
  const { user } = useAuth();
  
  // Hook local para as mensagens
  const { data: mensagens, isLoading } = useQuery({
    queryKey: ["mensagens", moduloAtual],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mensagens_setor")
        .select("*, autor:profiles(nome)")
        .or(`para_modulo.eq.${moduloAtual},de_modulo.eq.${moduloAtual}`)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Hook local para enviar
  const enviarMsg = useMutation({
    mutationFn: async (novo: { de_modulo: string; para_modulo: string; mensagem: string }) => {
      const { data, error } = await supabase.from("mensagens_setor").insert({
        ...novo,
        autor_id: user?.id
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Mensagem enviada com sucesso!");
      qc.invalidateQueries({ queryKey: ["mensagens"] });
      // Invalida também a query específica da diretoria caso exista
      qc.invalidateQueries({ queryKey: ["diretoria-mensagens"] });
    },
    onError: (e: Error) => toast.error(`Erro ao enviar: ${e.message}`)
  });

  // Remove o módulo atual das opções de envio
  const opcoes = ["diretoria", "financeiro", "obras", "rh", "compras"].filter(m => m !== moduloAtual);
  
  const [paraModulo, setParaModulo] = useState(opcoes[0]);
  const [mensagem, setMensagem] = useState("");

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mensagem.trim()) return;
    
    await enviarMsg.mutateAsync({
      de_modulo: moduloAtual,
      para_modulo: paraModulo,
      mensagem: mensagem.trim()
    });
    setMensagem("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500 max-w-6xl w-full">
      <Card className="lg:col-span-2 flex flex-col h-[600px]">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-lg flex items-center">
            <MessageSquare className="mr-2 size-5 text-primary" /> Histórico de Requisições ({moduloAtual.toUpperCase()})
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 dark:bg-slate-900/20">
          {isLoading ? (
            <div className="flex justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div>
          ) : !mensagens?.length ? (
            <div className="text-center text-muted-foreground mt-10">Nenhuma mensagem enviada ou recebida neste setor.</div>
          ) : (
            <div className="flex flex-col-reverse gap-4">
              {mensagens.map(msg => {
                const souEu = msg.de_modulo === moduloAtual;
                return (
                  <div key={msg.id} className={`flex flex-col max-w-[80%] ${souEu ? 'self-end items-end' : 'self-start items-start'}`}>
                    <span className="text-[10px] text-muted-foreground mb-1 px-1">
                      {souEu ? 'Você' : msg.autor?.nome || 'Sistema'} ({msg.de_modulo.toUpperCase()}) • {new Date(msg.created_at).toLocaleString()}
                    </span>
                    <div className={`p-3 rounded-lg text-sm ${souEu ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-muted rounded-tl-none border'}`}>
                      {msg.mensagem}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="text-lg">Nova Mensagem / Requisição</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEnviar} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Enviar para Setor:</label>
              <Select value={paraModulo} onValueChange={setParaModulo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {opcoes.map(op => (
                    <SelectItem key={op} value={op} className="capitalize">{op}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Mensagem:</label>
              <Textarea 
                placeholder="Ex: Precisamos aprovar o orçamento..." 
                className="min-h-[150px] resize-none"
                value={mensagem}
                onChange={e => setMensagem(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={enviarMsg.isPending || !mensagem.trim()}>
              {enviarMsg.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Enviar Mensagem
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
