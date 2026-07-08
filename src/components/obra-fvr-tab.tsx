import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useFvrs, useCreateFvr, useFvrItensDisponiveis, useDeleteFvr } from "@/hooks/use-fvr";
import { CheckCircle2, ClipboardCheck, FileText, Loader2, PackageOpen, Plus, Trash2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export function ObraFvrTab({ obraId }: { obraId: string }) {
  const { data: fvrs, isLoading } = useFvrs(obraId);
  const { data: itensDisponiveis, isLoading: isLoadingItens } = useFvrItensDisponiveis(obraId);
  const createFvr = useCreateFvr();
  const deleteFvr = useDeleteFvr();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [notaFiscal, setNotaFiscal] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [status, setStatus] = useState<string>("aprovado");
  const [observacoes, setObservacoes] = useState("");

  const handleCreate = async () => {
    if (!selectedItem || !quantidade || !status) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      await createFvr.mutateAsync({
        obra_id: obraId,
        item_id: selectedItem,
        nota_fiscal: notaFiscal,
        quantidade_recebida: Number(quantidade),
        status_qualidade: status,
        observacoes: observacoes,
      });
      toast.success("FVR registrada com sucesso!");
      setIsDialogOpen(false);
      
      // Reset form
      setSelectedItem("");
      setNotaFiscal("");
      setQuantidade("");
      setStatus("aprovado");
      setObservacoes("");
    } catch (error: any) {
      toast.error("Erro ao registrar FVR: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta FVR?")) return;
    try {
      await deleteFvr.mutateAsync({ id, obraId });
      toast.success("FVR excluída com sucesso!");
    } catch (error: any) {
      toast.error("Erro ao excluir FVR: " + error.message);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aprovado':
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20"><CheckCircle2 className="w-3 h-3 mr-1"/> Aprovado</Badge>;
      case 'rejeitado':
        return <Badge variant="destructive" className="bg-red-500/10 text-red-500 border-red-500/20"><XCircle className="w-3 h-3 mr-1"/> Rejeitado</Badge>;
      case 'aprovado_parcial':
        return <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border-amber-500/20"><PackageOpen className="w-3 h-3 mr-1"/> Aprovado Parcial</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Ficha de Verificação de Recebimento</h2>
          <p className="text-muted-foreground">Registre o recebimento e inspeção de materiais</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 w-full sm:w-auto">
              <Plus className="w-4 h-4" />
              Nova FVR
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Nova FVR</DialogTitle>
              <DialogDescription>
                Registre a chegada de um material e seu status de qualidade.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Material da Requisição *</Label>
                <Select value={selectedItem} onValueChange={setSelectedItem}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um item comprado/entregue" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingItens ? (
                      <div className="flex items-center justify-center p-2">
                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                      </div>
                    ) : itensDisponiveis?.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground text-center">Nenhum item disponível</div>
                    ) : (
                      itensDisponiveis?.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.descricao} (Qtd Pedida: {item.quantidade} {item.unidade})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Quantidade Recebida *</Label>
                  <Input 
                    type="number" 
                    step="0.01" 
                    min="0"
                    placeholder="Ex: 100" 
                    value={quantidade}
                    onChange={(e) => setQuantidade(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nota Fiscal</Label>
                  <Input 
                    placeholder="Número da NF" 
                    value={notaFiscal}
                    onChange={(e) => setNotaFiscal(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Status de Qualidade *</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aprovado">Aprovado</SelectItem>
                    <SelectItem value="aprovado_parcial">Aprovado Parcial</SelectItem>
                    <SelectItem value="rejeitado">Rejeitado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea 
                  placeholder="Detalhes sobre avarias, devoluções, etc..." 
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleCreate} disabled={createFvr.isPending}>
                {createFvr.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ClipboardCheck className="w-4 h-4 mr-2" />}
                Salvar FVR
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {fvrs?.length === 0 ? (
        <Card className="border-dashed shadow-none bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <ClipboardCheck className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Nenhuma FVR Registrada</h3>
            <p className="text-muted-foreground max-w-sm mb-6">
              Comece a registrar o recebimento de materiais para ter controle de qualidade e notas fiscais.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>Criar Primeira FVR</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fvrs?.map((fvr) => (
            <Card key={fvr.id} className="relative overflow-hidden group hover:shadow-md transition-all duration-200 border-border/50">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary/50 group-hover:bg-primary transition-colors" />
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-base line-clamp-1" title={fvr.materiais_itens?.descricao || 'Item Desconhecido'}>
                      {fvr.materiais_itens?.descricao || 'Item Desconhecido'}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1.5 text-xs">
                      <FileText className="w-3 h-3" />
                      NF: {fvr.nota_fiscal || 'N/A'}
                    </CardDescription>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDelete(fvr.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Recebido:</span>
                  <span className="font-medium">{fvr.quantidade_recebida} {fvr.materiais_itens?.unidade || ''}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Qualidade:</span>
                  {getStatusBadge(fvr.status_qualidade)}
                </div>

                {fvr.observacoes && (
                  <div className="text-sm bg-muted/50 p-3 rounded-md mt-2 border border-border/50">
                    <span className="text-xs font-medium text-muted-foreground block mb-1">Observações:</span>
                    <p className="text-xs text-foreground/80 leading-relaxed">{fvr.observacoes}</p>
                  </div>
                )}
                
                <div className="pt-2 text-xs text-muted-foreground flex items-center justify-between border-t border-border/50">
                  <span>
                    {new Date(fvr.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
