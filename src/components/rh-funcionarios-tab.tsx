import { useState } from "react";
import { useFuncionarios, useAdicionarFuncionario, Funcionario } from "@/hooks/use-rh";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, UserX, Loader2, Search, FileText } from "lucide-react";

export function RhFuncionariosTab() {
  const { data: funcionarios, isLoading } = useFuncionarios();
  const addFunc = useAdicionarFuncionario();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState<Partial<Funcionario>>({
    nome: "",
    cpf: "",
    cargo: "",
    status: "ativo",
    data_admissao: new Date().toISOString().split("T")[0],
    salario: 0,
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addFunc.mutateAsync(form);
    setOpen(false);
  };

  const filtered = funcionarios?.filter(f => f.nome.toLowerCase().includes(search.toLowerCase()) || f.cargo.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar funcionário..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Novo Funcionário</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Admitir Funcionário</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-2">
                <Label>Nome Completo</Label>
                <Input required value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>CPF</Label>
                  <Input value={form.cpf || ""} onChange={e => setForm({...form, cpf: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Cargo / Função</Label>
                  <Input required value={form.cargo} onChange={e => setForm({...form, cargo: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data Admissão</Label>
                  <Input type="date" required value={form.data_admissao} onChange={e => setForm({...form, data_admissao: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Salário (R$)</Label>
                  <Input type="number" step="0.01" value={form.salario || ""} onChange={e => setForm({...form, salario: parseFloat(e.target.value)})} />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={addFunc.isPending}>
                {addFunc.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Salvar Cadastro
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quadro de Colaboradores</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground" /></div>
          ) : !filtered?.length ? (
            <div className="text-center p-8 text-muted-foreground">Nenhum funcionário encontrado.</div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="p-3 font-medium">Nome</th>
                    <th className="p-3 font-medium">Cargo</th>
                    <th className="p-3 font-medium">Status</th>
                    <th className="p-3 font-medium">Admissão</th>
                    <th className="p-3 font-medium text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map(f => (
                    <tr key={f.id} className="hover:bg-muted/50 transition-colors">
                      <td className="p-3 font-medium">{f.nome}</td>
                      <td className="p-3">{f.cargo}</td>
                      <td className="p-3">
                        <Badge variant={f.status === 'ativo' ? 'default' : f.status === 'ferias' ? 'secondary' : 'destructive'} className={f.status === 'ativo' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}>
                          {f.status}
                        </Badge>
                      </td>
                      <td className="p-3">{new Date(f.data_admissao).toLocaleDateString()}</td>
                      <td className="p-3 text-right">
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-primary">
                          <FileText className="h-4 w-4 mr-1" /> Ficha
                        </Button>
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
