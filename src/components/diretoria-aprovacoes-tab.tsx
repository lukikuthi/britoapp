import { useState } from "react";
import { useCaixaEntradaDiretoria, useResponderMensagem, usePagamentosPendentes, useAprovarPagamento } from "@/hooks/use-diretoria";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Reply, CheckCircle2, Inbox, XCircle, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getPublicFileUrl } from "@/lib/storage-utils";

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
};

export function DiretoriaAprovacoesTab() {
  const { data: mensagens, isLoading: loadingMsg } = useCaixaEntradaDiretoria();
  const responder = useResponderMensagem();
  
  const { data: pagamentos, isLoading: loadingPag } = usePagamentosPendentes();
  const aprovarPag = useAprovarPagamento();

  const [open, setOpen] = useState(false);
  const [resposta, setResposta] = useState("");
  const [msgAtiva, setMsgAtiva] = useState<any>(null);

  const [openPag, setOpenPag] = useState(false);
  const [pagAtivo, setPagAtivo] = useState<any>(null);
  const [justificativa, setJustificativa] = useState("");

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

  const handleAprovar = async (status: 'aprovada' | 'recusada') => {
    if (!pagAtivo) return;
    await aprovarPag.mutateAsync({
      transacaoId: pagAtivo.id,
      status,
      justificativa: justificativa.trim()
    });
    setOpenPag(false);
    setPagAtivo(null);
    setJustificativa("");
  };

  const openReply = (msg: any) => {
    setMsgAtiva(msg);
    setResposta("");
    setOpen(true);
  };

  const openPagamento = (pag: any) => {
    setPagAtivo(pag);
    setJustificativa("");
    setOpenPag(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Caixa de Aprovações (Inbox)</h2>
          <p className="text-sm text-muted-foreground">Decisões executivas demandadas por outros setores</p>
        </div>
      </div>

      {/* MODAL RESPONDER MENSAGEM */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Responder Requisição</DialogTitle></DialogHeader>
          <div className="bg-muted/50 p-4 rounded-md text-sm mb-4 border">
            <p className="font-semibold mb-1">Setor: {msgAtiva?.de_modulo.toUpperCase()}</p>
            <p className="text-muted-foreground">"{msgAtiva?.mensagem}"</p>
          </div>
          <form onSubmit={handleResponder} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Sua Resposta:</label>
              <Textarea 
                placeholder="Ex: Ciente, pode prosseguir." 
                className="min-h-[120px] resize-none"
                value={resposta}
                onChange={e => setResposta(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-[var(--brand-gold)] hover:bg-yellow-600 text-black" disabled={responder.isPending || !resposta.trim()}>
              {responder.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
              Enviar Resposta
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL APROVAR PAGAMENTO */}
      <Dialog open={openPag} onOpenChange={setOpenPag}>
        <DialogContent>
          <DialogHeader><DialogTitle>Aprovação de Pagamento</DialogTitle></DialogHeader>
          <div className="bg-muted/50 p-4 rounded-md text-sm mb-4 border flex flex-col gap-2">
            <div><span className="font-semibold">Fornecedor:</span> {pagAtivo?.fornecedor_cliente}</div>
            <div><span className="font-semibold">Descrição:</span> {pagAtivo?.descricao}</div>
            <div className="text-lg font-bold text-red-600">Valor: {formatCurrency(pagAtivo?.valor || 0)}</div>
            <div><span className="font-semibold">Vencimento:</span> {pagAtivo?.data_vencimento}</div>
            
            {pagAtivo?.anexo_nf_url && (
              <div className="mt-2 pt-2 border-t">
                <a 
                  href={getPublicFileUrl("financeiro-anexos", pagAtivo.anexo_nf_url)} 
                  target="_blank" rel="noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1 font-medium"
                >
                  <FileText className="size-4" /> Visualizar Anexo/NF
                </a>
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Justificativa (Opcional):</label>
              <Textarea 
                placeholder="Por que está aprovando ou recusando?" 
                className="min-h-[80px] resize-none"
                value={justificativa}
                onChange={e => setJustificativa(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="destructive" className="w-full" disabled={aprovarPag.isPending} onClick={() => handleAprovar('recusada')}>
                <XCircle className="mr-2 h-4 w-4" /> Recusar
              </Button>
              <Button type="button" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={aprovarPag.isPending} onClick={() => handleAprovar('aprovada')}>
                <CheckCircle2 className="mr-2 h-4 w-4" /> Aprovar Pagamento
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* COLUNA 1: Aprovações de Pagamento (Trava Real) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="size-5 text-emerald-500" />
              Aprovações Financeiras Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loadingPag ? (
              <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground" /></div>
            ) : !pagamentos?.length ? (
              <div className="text-center p-8 text-muted-foreground flex flex-col items-center">
                <CheckCircle2 className="size-8 mb-2 opacity-20 text-emerald-500" />
                Nenhum pagamento pendente de assinatura.
              </div>
            ) : (
              <div className="divide-y">
                {pagamentos.map((pag: any) => (
                  <div key={pag.id} className="p-4 flex gap-4 hover:bg-muted/50 bg-background transition-colors">
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-sm">{pag.fornecedor_cliente}</span>
                        <span className="text-red-600 font-bold text-sm">{formatCurrency(pag.valor)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{pag.descricao}</p>
                      <Button size="sm" onClick={() => openPagamento(pag)} className="w-full bg-[var(--brand-gold)] hover:bg-yellow-600 text-black">
                        Analisar Pagamento
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* COLUNA 2: Mensagens do Chat Geral */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Inbox className="size-5 text-blue-500" />
              Mensagens / Chat
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loadingMsg ? (
              <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground" /></div>
            ) : !mensagens?.length ? (
              <div className="text-center p-8 text-muted-foreground flex flex-col items-center">
                <Inbox className="size-8 mb-2 opacity-20" />
                Nenhuma mensagem no momento.
              </div>
            ) : (
              <div className="divide-y">
                {mensagens.map((msg: any) => {
                  const souEu = msg.de_modulo === 'diretoria';
                  
                  return (
                    <div key={msg.id} className={`p-4 flex flex-col gap-2 transition-colors ${souEu ? 'bg-muted/30' : 'hover:bg-muted/50 bg-background'}`}>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={souEu ? 'text-gray-500' : 'text-[var(--brand-gold)] border-[var(--brand-gold)] bg-yellow-50 dark:bg-yellow-950/20'}>
                          {souEu ? 'Diretoria' : msg.de_modulo.toUpperCase()}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground ml-auto">
                          {new Date(msg.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className={`text-sm ${souEu ? 'text-muted-foreground' : 'text-foreground'}`}>
                        {msg.mensagem}
                      </p>
                      
                      {!souEu && (
                        <div className="flex justify-end mt-1">
                          <Button variant="ghost" size="sm" onClick={() => openReply(msg)} className="h-7 text-xs">
                            <Reply className="size-3 mr-1" /> Responder
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
    </div>
  );
}
