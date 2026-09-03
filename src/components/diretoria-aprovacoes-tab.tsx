import { useState } from "react";
import { useCaixaEntradaDiretoria, useResponderMensagem } from "@/hooks/use-diretoria";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Reply, CheckCircle2, Inbox } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function DiretoriaAprovacoesTab() {
  const { data: mensagens, isLoading } = useCaixaEntradaDiretoria();
  const responder = useResponderMensagem();

  const [open, setOpen] = useState(false);
  const [resposta, setResposta] = useState("");
  const [msgAtiva, setMsgAtiva] = useState<any>(null);

  const handleResponder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resposta.trim() || !msgAtiva) return;
    
    await responder.mutateAsync({
      para_modulo: msgAtiva.de_modulo,
      mensagem: resposta.trim()
    });
    setOpen(false);
    setResposta("");
    setMsgAtiva(null);
  };

  const openReply = (msg: any) => {
    setMsgAtiva(msg);
    setResposta("");
    setOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Caixa de Aprovações (Inbox)</h2>
          <p className="text-sm text-muted-foreground">Decisões executivas demandadas por outros setores</p>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Responder / Aprovar Requisição</DialogTitle></DialogHeader>
          <div className="bg-muted/50 p-4 rounded-md text-sm mb-4 border">
            <p className="font-semibold mb-1">Setor: {msgAtiva?.de_modulo.toUpperCase()}</p>
            <p className="text-muted-foreground">"{msgAtiva?.mensagem}"</p>
          </div>
          <form onSubmit={handleResponder} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Sua Decisão / Resposta:</label>
              <Textarea 
                placeholder="Ex: Aprovado. Pode prosseguir com a compra." 
                className="min-h-[120px] resize-none"
                value={resposta}
                onChange={e => setResposta(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-[var(--brand-gold)] hover:bg-yellow-600 text-black" disabled={responder.isPending || !resposta.trim()}>
              {responder.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
              Enviar Decisão
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center p-12"><Loader2 className="animate-spin text-muted-foreground" /></div>
          ) : !mensagens?.length ? (
            <div className="text-center p-16 text-muted-foreground flex flex-col items-center">
              <Inbox className="size-12 mb-3 opacity-20" />
              Nenhuma requisição pendente. Tudo tranquilo por aqui.
            </div>
          ) : (
            <div className="divide-y">
              {mensagens.map((msg: any) => {
                const souEu = msg.de_modulo === 'diretoria';
                
                return (
                  <div key={msg.id} className={`p-4 flex gap-4 transition-colors ${souEu ? 'bg-muted/30' : 'hover:bg-muted/50 bg-background'}`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">
                          {souEu ? 'Sua Resposta' : msg.autor?.nome || 'Sistema'}
                        </span>
                        <Badge variant="outline" className={souEu ? 'text-gray-500' : 'text-[var(--brand-gold)] border-[var(--brand-gold)] bg-yellow-50 dark:bg-yellow-950/20'}>
                          Setor: {msg.de_modulo.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {new Date(msg.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className={`text-sm mt-2 ${souEu ? 'text-muted-foreground' : 'text-foreground'}`}>
                        {msg.mensagem}
                      </p>
                    </div>
                    
                    {!souEu && (
                      <div className="flex items-center ml-4 border-l pl-4">
                        <Button variant="outline" size="sm" onClick={() => openReply(msg)}>
                          <Reply className="size-4 mr-2" /> Decidir
                        </Button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
