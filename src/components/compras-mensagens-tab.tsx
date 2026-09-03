import { useState } from "react";
import { useMensagens, useEnviarMensagem } from "@/hooks/use-compras";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Send, MessageSquare } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function ComprasMensagensTab() {
  const { data: mensagens, isLoading } = useMensagens('compras');
  const enviarMsg = useEnviarMensagem();
  const { user } = useAuth();

  const [paraModulo, setParaModulo] = useState("diretoria");
  const [mensagem, setMensagem] = useState("");

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mensagem.trim()) return;
    
    await enviarMsg.mutateAsync({
      de_modulo: 'compras',
      para_modulo: paraModulo,
      mensagem: mensagem.trim()
    });
    setMensagem("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500 max-w-6xl">
      <Card className="lg:col-span-2 flex flex-col h-[600px]">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-lg flex items-center">
            <MessageSquare className="mr-2 size-5 text-primary" /> Histórico de Requisições
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 dark:bg-slate-900/20">
          {isLoading ? (
            <div className="flex justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div>
          ) : !mensagens?.length ? (
            <div className="text-center text-muted-foreground mt-10">Nenhuma mensagem enviada ou recebida.</div>
          ) : (
            <div className="flex flex-col-reverse gap-4">
              {mensagens.map(msg => {
                const souEu = msg.de_modulo === 'compras';
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
          <CardTitle className="text-lg">Nova Requisição</CardTitle>
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
                  <SelectItem value="diretoria">Diretoria</SelectItem>
                  <SelectItem value="financeiro">Financeiro</SelectItem>
                  <SelectItem value="obras">Obras (Geral)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Mensagem:</label>
              <Textarea 
                placeholder="Ex: Precisamos aprovar o orçamento para cabos NU urgentemente..." 
                className="min-h-[150px] resize-none"
                value={mensagem}
                onChange={e => setMensagem(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={enviarMsg.isPending || !mensagem.trim()}>
              {enviarMsg.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Enviar Requisição
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
