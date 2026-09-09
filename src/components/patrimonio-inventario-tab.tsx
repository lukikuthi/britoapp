import { useState } from "react";
import { useEquipamentos, useAdicionarEquipamento } from "@/hooks/use-patrimonio";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2, Wrench, PackageSearch } from "lucide-react";

const INITIAL_FORM = {
  nome: "",
  codigo_patrimonio: "",
  tipo: "ferramenta",
  valor_aquisicao: 0,
  data_aquisicao: new Date().toISOString().split('T')[0],
  vida_util_meses: 24
};

export function PatrimonioInventarioTab() {
  const { data: equipamentos, isLoading } = useEquipamentos();
  const addEquipamento = useAdicionarEquipamento();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [busca, setBusca] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.codigo_patrimonio) return;
    
    await addEquipamento.mutateAsync({
      ...form,
      valor_aquisicao: Math.max(0, form.valor_aquisicao)
    });
    setOpen(false);
    setForm(INITIAL_FORM);
  };

  const filtered = equipamentos?.filter((eq: any) => 
    eq.nome.toLowerCase().includes(busca.toLowerCase()) || 
    eq.codigo_patrimonio?.toLowerCase().includes(busca.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-72">
          <PackageSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Buscar equipamento..." value={busca} onChange={e => setBusca(e.target.value)} className="pl-9" />
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto"><Plus className="size-4 mr-2" /> Novo Cadastro</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Cadastrar Patrimônio</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label>Nome do Equipamento / Ferramenta</Label>
                  <Input required value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} placeholder="Ex: Martelete Rompedor Bosch" />
                </div>
                <div className="space-y-2">
                  <Label>Código (Patrimônio)</Label>
                  <Input required value={form.codigo_patrimonio} onChange={e => setForm({...form, codigo_patrimonio: e.target.value})} placeholder="Ex: FER-001" />
                </div>
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select value={form.tipo} onValueChange={(v) => setForm({...form, tipo: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ferramenta">Ferramenta Leve</SelectItem>
                      <SelectItem value="maquina_leve">Máquina Leve</SelectItem>
                      <SelectItem value="maquina_pesada">Máquina Pesada</SelectItem>
                      <SelectItem value="veiculo">Veículo</SelectItem>
                      <SelectItem value="tecnologia">Tecnologia (Notebook, etc)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Valor Aquisição (R$)</Label>
                  <Input type="number" step="0.01" value={form.valor_aquisicao} onChange={e => setForm({...form, valor_aquisicao: parseFloat(e.target.value) || 0})} />
                </div>
                <div className="space-y-2">
                  <Label>Data Aquisição</Label>
                  <Input type="date" required value={form.data_aquisicao} onChange={e => setForm({...form, data_aquisicao: e.target.value})} />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={addEquipamento.isPending}>
                {addEquipamento.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : null} Salvar Cadastro
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center p-12"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>
          ) : !filtered.length ? (
            <div className="text-center p-12 text-muted-foreground">Nenhum equipamento encontrado.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground border-b">
                  <tr>
                    <th className="p-4 font-medium">Código</th>
                    <th className="p-4 font-medium">Equipamento</th>
                    <th className="p-4 font-medium">Tipo</th>
                    <th className="p-4 font-medium">Status Atual</th>
                    <th className="p-4 font-medium text-right">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map((eq: any) => (
                    <tr key={eq.id} className="hover:bg-muted/50 transition-colors">
                      <td className="p-4 font-mono font-medium">{eq.codigo_patrimonio}</td>
                      <td className="p-4 font-semibold">{eq.nome}</td>
                      <td className="p-4 capitalize">{eq.tipo.replace('_', ' ')}</td>
                      <td className="p-4">
                        <Badge variant="outline" className={
                          eq.status === 'disponivel' ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                          eq.status === 'em_uso' ? "bg-blue-50 text-blue-600 border-blue-200" :
                          "bg-red-50 text-red-600 border-red-200"
                        }>
                          {eq.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(eq.valor_aquisicao || 0)}</td>
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
