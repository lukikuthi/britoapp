import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useFuncionarios, useAdicionarFuncionario } from "@/hooks/use-rh";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, UserPlus, Loader2 } from "lucide-react";

export function RhFuncionariosTab() {
  const { data: funcionarios, isLoading } = useFuncionarios();
  const addFuncionario = useAdicionarFuncionario();
  
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    cargo: "",
    status: "ativo",
    salario: "",
    data_admissao: "",
    obra_id: "matriz"
  });

  const { data: obras } = useQuery({
    queryKey: ["todas-obras"],
    queryFn: async () => {
      const { data } = await supabase.from("obras").select("id, nome").order("nome");
      return data || [];
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addFuncionario.mutateAsync({
      ...form,
      salario: form.salario ? parseFloat(form.salario) : null,
      obra_id: form.obra_id === "matriz" ? null : form.obra_id
    } as any);
    setOpen(false);
    setForm({
      nome: "", cpf: "", cargo: "", status: "ativo", salario: "", data_admissao: "", obra_id: "matriz"
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Quadro de Funcionários</h2>
          <p className="text-sm text-muted-foreground">Gestão de pessoal, admissões e status.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><UserPlus className="mr-2 h-4 w-4" /> Novo Funcionário</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Funcionário</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Nome Completo</Label>
                <Input required value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>CPF</Label>
                  <Input value={form.cpf} onChange={e => setForm({...form, cpf: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Cargo / Função</Label>
                  <Input required value={form.cargo} onChange={e => setForm({...form, cargo: e.target.value})} />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Alocação Atual</Label>
                <Select value={form.obra_id} onValueChange={(v) => setForm({...form, obra_id: v})}>
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="matriz">Escritório Matriz</SelectItem>
                    {obras?.map(o => <SelectItem key={o.id} value={o.id}>{o.nome}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Salário (Opcional)</Label>
                  <Input type="number" step="0.01" min="0" value={form.salario} onChange={e => setForm({...form, salario: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Data Admissão</Label>
                  <Input type="date" required value={form.data_admissao} onChange={e => setForm({...form, data_admissao: e.target.value})} />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={addFuncionario.isPending}>
                {addFuncionario.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Salvar Cadastro
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground" /></div>
          ) : !funcionarios?.length ? (
            <div className="text-center p-12 text-muted-foreground">Nenhum funcionário cadastrado.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground border-b">
                  <tr>
                    <th className="p-4 font-medium">Nome</th>
                    <th className="p-4 font-medium">Cargo</th>
                    <th className="p-4 font-medium">Alocação</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Admissão</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {funcionarios.map((f: any) => (
                    <tr key={f.id} className="hover:bg-muted/50 transition-colors">
                      <td className="p-4">
                        <p className="font-medium">{f.nome}</p>
                        <p className="text-xs text-muted-foreground">{f.cpf || "Sem CPF"}</p>
                      </td>
                      <td className="p-4">{f.cargo}</td>
                      <td className="p-4">
                        <Badge variant="outline" className="bg-background">
                          {f.obra?.nome || "Matriz"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant={
                          f.status === 'ativo' ? "default" :
                          f.status === 'ferias' ? "secondary" : "destructive"
                        }>
                          {f.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {new Date(f.data_admissao).toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
