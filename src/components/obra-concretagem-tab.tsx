import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Plus, Edit, Trash2, Truck, Droplets, MapPin, Hash, CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react";

import { useConfirmStore } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

import {
  useConcretagens,
  useCreateConcretagem,
  useUpdateConcretagem,
  useDeleteConcretagem,
  Concretagem,
} from "@/hooks/use-concretagem";

const concretagemSchema = z.object({
  data: z.string().min(1, "Data é obrigatória"),
  fornecedor: z.string().optional(),
  nota_fiscal: z.string().optional(),
  placa_caminhao: z.string().optional(),
  volume_m3: z.coerce.number().optional(),
  fck_projeto: z.coerce.number().optional(),
  slump_test: z.string().optional(),
  local_lancamento: z.string().optional(),
  status: z.enum(["agendado", "em_andamento", "concluido", "cancelado"]),
  observacoes: z.string().optional(),
});

type ConcretagemFormValues = z.infer<typeof concretagemSchema>;

export function ObraConcretagemTab({ obraId }: { obraId: string }) {
  const { data: concretagens, isLoading } = useConcretagens(obraId);
  const createMutation = useCreateConcretagem();
  const updateMutation = useUpdateConcretagem();
  const deleteMutation = useDeleteConcretagem();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingConcretagem, setEditingConcretagem] = useState<Concretagem | null>(null);

  const form = useForm<ConcretagemFormValues>({
    resolver: zodResolver(concretagemSchema),
    defaultValues: {
      data: new Date().toISOString().slice(0, 16),
      fornecedor: "",
      nota_fiscal: "",
      placa_caminhao: "",
      volume_m3: undefined,
      fck_projeto: undefined,
      slump_test: "",
      local_lancamento: "",
      status: "agendado",
      observacoes: "",
    },
  });

  const onSubmit = async (values: ConcretagemFormValues) => {
    try {
      if (editingConcretagem) {
        await updateMutation.mutateAsync({
          id: editingConcretagem.id,
          ...values,
          fornecedor: values.fornecedor || null,
          nota_fiscal: values.nota_fiscal || null,
          placa_caminhao: values.placa_caminhao || null,
          volume_m3: values.volume_m3 || null,
          fck_projeto: values.fck_projeto || null,
          slump_test: values.slump_test || null,
          local_lancamento: values.local_lancamento || null,
          observacoes: values.observacoes || null,
        });
        toast.success("Concretagem atualizada com sucesso");
      } else {
        await createMutation.mutateAsync({
          obra_id: obraId,
          ...values,
          fornecedor: values.fornecedor || null,
          nota_fiscal: values.nota_fiscal || null,
          placa_caminhao: values.placa_caminhao || null,
          volume_m3: values.volume_m3 || null,
          fck_projeto: values.fck_projeto || null,
          slump_test: values.slump_test || null,
          local_lancamento: values.local_lancamento || null,
          observacoes: values.observacoes || null,
          rastreabilidade_corpos_prova: null,
        });
        toast.success("Concretagem registrada com sucesso");
      }
      setIsDialogOpen(false);
      form.reset();
      setEditingConcretagem(null);
    } catch (error) {
      toast.error("Erro ao salvar concretagem");
    }
  };

  const handleEdit = (concretagem: Concretagem) => {
    setEditingConcretagem(concretagem);
    form.reset({
      data: new Date(concretagem.data).toISOString().slice(0, 16),
      fornecedor: concretagem.fornecedor || "",
      nota_fiscal: concretagem.nota_fiscal || "",
      placa_caminhao: concretagem.placa_caminhao || "",
      volume_m3: concretagem.volume_m3 || undefined,
      fck_projeto: concretagem.fck_projeto || undefined,
      slump_test: concretagem.slump_test || "",
      local_lancamento: concretagem.local_lancamento || "",
      status: concretagem.status,
      observacoes: concretagem.observacoes || "",
    });
    setIsDialogOpen(true);
  };

  async function handleDelete(id: string) {
    const ok = await useConfirmStore.getState().confirm("Tem certeza que deseja excluir este registro de concretagem?", "Excluir concretagem");
    if (ok) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success("Registro excluído com sucesso");
      } catch (error) {
        toast.error("Erro ao excluir registro");
      }
    }
  };

  const openNewDialog = () => {
    setEditingConcretagem(null);
    form.reset({
      data: new Date().toISOString().slice(0, 16),
      fornecedor: "",
      nota_fiscal: "",
      placa_caminhao: "",
      volume_m3: undefined,
      fck_projeto: undefined,
      slump_test: "",
      local_lancamento: "",
      status: "agendado",
      observacoes: "",
    });
    setIsDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "agendado":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><Clock className="w-3 h-3 mr-1" /> Agendado</Badge>;
      case "em_andamento":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200"><Truck className="w-3 h-3 mr-1" /> Em Andamento</Badge>;
      case "concluido":
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200"><CheckCircle2 className="w-3 h-3 mr-1" /> Concluído</Badge>;
      case "cancelado":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1" /> Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Truck className="w-6 h-6 text-primary" />
            Diário de Concretagem
          </h2>
          <p className="text-muted-foreground">
            Gerencie os lançamentos de concreto e rastreabilidade da obra.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog} className="shadow-md">
              <Plus className="w-4 h-4 mr-2" />
              Novo Lançamento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingConcretagem ? "Editar Lançamento" : "Novo Lançamento de Concreto"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="data"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data e Hora</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="agendado">Agendado</SelectItem>
                            <SelectItem value="em_andamento">Em Andamento</SelectItem>
                            <SelectItem value="concluido">Concluído</SelectItem>
                            <SelectItem value="cancelado">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="fornecedor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fornecedor</FormLabel>
                        <FormControl>
                          <Input placeholder="Concreteira XYZ" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nota_fiscal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nota Fiscal</FormLabel>
                        <FormControl>
                          <Input placeholder="Nº da NF" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="placa_caminhao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Placa do Caminhão</FormLabel>
                        <FormControl>
                          <Input placeholder="ABC-1234" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="volume_m3"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Volume (m³)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" placeholder="8.0" {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fck_projeto"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fck (MPa)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="30" {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="slump_test"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slump Test</FormLabel>
                        <FormControl>
                          <Input placeholder="10 ± 2" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="local_lancamento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Local de Lançamento</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Pilar P1 a P5, Laje Nível 1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="observacoes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Observações adicionais sobre o lançamento..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {createMutation.isPending || updateMutation.isPending ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-t-4 border-t-primary shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Histórico de Lançamentos</CardTitle>
          <CardDescription>Lista de todos os caminhões e volumes concretados nesta obra.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 flex justify-center text-muted-foreground">
              Carregando dados...
            </div>
          ) : concretagens && concretagens.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Fornecedor/Placa</TableHead>
                    <TableHead>Local</TableHead>
                    <TableHead className="text-center">Volume</TableHead>
                    <TableHead className="text-center">Fck / Slump</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {concretagens.map((item) => (
                    <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell>
                        <div className="font-medium">
                          {format(new Date(item.data), "dd/MM/yyyy", { locale: ptBR })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(item.data), "HH:mm", { locale: ptBR })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium flex items-center gap-1">
                          {item.fornecedor || "-"}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Hash className="w-3 h-3" /> NF: {item.nota_fiscal || "-"} | Placa: {item.placa_caminhao || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          <span className="truncate max-w-[200px]" title={item.local_lancamento || ""}>
                            {item.local_lancamento || "-"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-semibold">
                        <Badge variant="secondary" className="bg-slate-100">
                          {item.volume_m3 ? `${item.volume_m3} m³` : "-"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="text-sm">
                          {item.fck_projeto ? `${item.fck_projeto} MPa` : "-"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.slump_test || "-"}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(item.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEdit(item)}
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDelete(item.id)}
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center border rounded-lg border-dashed bg-slate-50/50">
              <AlertCircle className="w-12 h-12 text-slate-300 mb-3" />
              <h3 className="text-lg font-medium text-slate-900">Nenhuma concretagem registrada</h3>
              <p className="text-sm text-slate-500 mb-4 max-w-sm">
                Você ainda não registrou nenhum lançamento de concreto nesta obra. Clique no botão acima para adicionar.
              </p>
              <Button onClick={openNewDialog} variant="outline" className="shadow-sm">
                <Plus className="w-4 h-4 mr-2" />
                Registrar Primeira Concretagem
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
