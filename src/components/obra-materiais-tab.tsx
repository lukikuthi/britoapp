import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Plus, 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  AlertCircle,
  MoreVertical,
  X
} from "lucide-react";
import { useMateriaisRequisicoes, useCreateRequisicao, useUpdateRequisicaoStatus } from "@/hooks/use-materiais";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const PRIORIDADE_COLORS: Record<string, string> = {
  baixa: "bg-muted text-muted-foreground",
  normal: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  alta: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  urgente: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  rascunho: <AlertCircle className="size-4 text-muted-foreground" />,
  solicitado: <Clock className="size-4 text-blue-500" />,
  aprovado: <CheckCircle2 className="size-4 text-emerald-500" />,
  comprado: <Package className="size-4 text-purple-500" />,
  entregue: <Truck className="size-4 text-emerald-600" />,
  cancelado: <X className="size-4 text-red-500" />,
};

const STATUS_LABELS: Record<string, string> = {
  rascunho: "Rascunho",
  solicitado: "Solicitado",
  aprovado: "Aprovado",
  comprado: "Comprado",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

export function ObraMateriaisTab({ obraId, isAdmin }: { obraId: string; isAdmin: boolean }) {
  const { data: requisicoes, isLoading } = useMateriaisRequisicoes(obraId);
  const createReq = useCreateRequisicao();
  const updateReq = useUpdateRequisicaoStatus();

  const [openNovaReq, setOpenNovaReq] = useState(false);
  const [form, setForm] = useState({
    prioridade: "normal",
    data_necessidade: "",
    observacoes: "",
    itens: [{ descricao: "", quantidade: 1, unidade: "un" }]
  });

  const handleAddItem = () => {
    setForm({ ...form, itens: [...form.itens, { descricao: "", quantidade: 1, unidade: "un" }] });
  };

  const handleRemoveItem = (index: number) => {
    setForm({ ...form, itens: form.itens.filter((_, i) => i !== index) });
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItens = [...form.itens];
    newItens[index] = { ...newItens[index], [field]: value };
    setForm({ ...form, itens: newItens });
  };

  const handleSave = async () => {
    const validItens = form.itens.filter(i => i.descricao.trim() !== "");
    if (validItens.length === 0) {
      toast.error("Adicione pelo menos um item válido na requisição.");
      return;
    }

    try {
      await createReq.mutateAsync({
        obra_id: obraId,
        prioridade: form.prioridade,
        data_necessidade: form.data_necessidade || undefined,
        observacoes: form.observacoes || undefined,
        itens: validItens,
      });
      toast.success("Requisição criada com sucesso!");
      setOpenNovaReq(false);
      setForm({
        prioridade: "normal",
        data_necessidade: "",
        observacoes: "",
        itens: [{ descricao: "", quantidade: 1, unidade: "un" }]
      });
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleChangeStatus = async (id: string, status: string) => {
    try {
      await updateReq.mutateAsync({ id, obraId, status });
      toast.success(`Status atualizado para ${STATUS_LABELS[status]}`);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Carregando suprimentos...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">Requisições de Materiais (RM)</h2>
        
        <Dialog open={openNovaReq} onOpenChange={setOpenNovaReq}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="size-4 mr-2" /> Nova Requisição
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nova Requisição de Materiais</DialogTitle>
              <DialogDescription>
                Crie um pedido de suprimentos para o canteiro de obras.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Prioridade</Label>
                  <Select value={form.prioridade} onValueChange={(v) => setForm({...form, prioridade: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="urgente">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Data de Necessidade (Opcional)</Label>
                  <Input 
                    type="date" 
                    value={form.data_necessidade} 
                    onChange={(e) => setForm({...form, data_necessidade: e.target.value})} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Itens Solicitados</Label>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                    + Adicionar Linha
                  </Button>
                </div>
                
                <div className="space-y-2 border rounded-md p-2 bg-muted/20">
                  {form.itens.map((item, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <div className="flex-1">
                        <Input 
                          placeholder="Descrição do material..." 
                          value={item.descricao}
                          onChange={(e) => handleItemChange(index, "descricao", e.target.value)}
                        />
                      </div>
                      <div className="w-24">
                        <Input 
                          type="number" 
                          min="0.1" 
                          step="0.1"
                          value={item.quantidade}
                          onChange={(e) => handleItemChange(index, "quantidade", parseFloat(e.target.value))}
                        />
                      </div>
                      <div className="w-24">
                        <Select value={item.unidade} onValueChange={(v) => handleItemChange(index, "unidade", v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="un">un</SelectItem>
                            <SelectItem value="m">m</SelectItem>
                            <SelectItem value="kg">kg</SelectItem>
                            <SelectItem value="cx">cx</SelectItem>
                            <SelectItem value="rolo">rolo</SelectItem>
                            <SelectItem value="saco">saco</SelectItem>
                            <SelectItem value="l">L</SelectItem>
                            <SelectItem value="cj">cj</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(index)} className="text-destructive">
                        <X className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Observações de Aplicação (Onde será usado?)</Label>
                <Textarea 
                  placeholder="Ex: Para instalação no painel principal do térreo..."
                  value={form.observacoes}
                  onChange={(e) => setForm({...form, observacoes: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenNovaReq(false)}>Cancelar</Button>
              <Button onClick={handleSave} disabled={createReq.isPending}>
                {createReq.isPending ? "Salvando..." : "Enviar Requisição"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {!requisicoes?.length ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="size-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium">Nenhum pedido de material</h3>
            <p className="text-sm text-muted-foreground mt-1">Crie requisições para acompanhar as compras da obra.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {requisicoes.map((req) => (
            <Card key={req.id} className="flex flex-col relative overflow-hidden group">
              <div className={`absolute top-0 left-0 w-1 h-full ${req.status === 'entregue' ? 'bg-emerald-500' : req.status === 'cancelado' ? 'bg-red-500' : 'bg-blue-500'}`} />
              <CardHeader className="pb-3 pt-4 pl-5">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      RM-{req.numero_sequencial?.toString().padStart(4, '0')}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1.5 text-xs">
                      {STATUS_ICONS[req.status]}
                      <span className="font-medium">{STATUS_LABELS[req.status]}</span>
                      <span className="mx-1">•</span>
                      {format(new Date(req.created_at), "dd/MM/yyyy", { locale: ptBR })}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="-mt-1 -mr-2">
                        <MoreVertical className="size-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {isAdmin && (
                        <>
                          <DropdownMenuItem onClick={() => handleChangeStatus(req.id, "aprovado")}>
                            Marcar como Aprovado
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleChangeStatus(req.id, "comprado")}>
                            Marcar como Comprado
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleChangeStatus(req.id, "entregue")}>
                            Marcar como Entregue
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleChangeStatus(req.id, "cancelado")} className="text-destructive">
                            Cancelar RM
                          </DropdownMenuItem>
                        </>
                      )}
                      {!isAdmin && (
                        <DropdownMenuItem disabled>
                          Apenas Admins gerenciam status
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="flex-1 pb-3 pl-5 text-sm">
                <div className="mb-3 flex items-center gap-2">
                  <Badge variant="secondary" className={PRIORIDADE_COLORS[req.prioridade]}>
                    {req.prioridade.toUpperCase()}
                  </Badge>
                  {req.data_necessidade && (
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      Para: {format(new Date(req.data_necessidade), "dd/MM/yy")}
                    </span>
                  )}
                </div>
                
                <div className="space-y-1.5 mt-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Itens Solicitados</p>
                  <ul className="space-y-1.5">
                    {req.itens?.slice(0, 3).map((item) => (
                      <li key={item.id} className="flex justify-between border-b pb-1 last:border-0 border-dashed">
                        <span className="truncate pr-2" title={item.descricao}>{item.descricao}</span>
                        <span className="font-medium tabular-nums whitespace-nowrap">{item.quantidade} {item.unidade}</span>
                      </li>
                    ))}
                    {(req.itens?.length ?? 0) > 3 && (
                      <li className="text-xs text-muted-foreground italic pt-1">
                        + {(req.itens?.length ?? 0) - 3} outros itens...
                      </li>
                    )}
                  </ul>
                </div>

                {req.observacoes && (
                  <div className="mt-4 pt-3 border-t text-xs text-muted-foreground italic line-clamp-2">
                    "{req.observacoes}"
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
