import { useState } from "react";
import { useTerceiros, useAdicionarTerceiro } from "@/hooks/use-rh";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2, Building2, Search } from "lucide-react";

export function RhTerceirosTab() {
  const { data: terceiros, isLoading } = useTerceiros();
  const addTerceiro = useAdicionarTerceiro();
  
  const [open, setOpen] = useState(false);
  const [busca, setBusca] = useState("");
  const [form, setForm] = useState({ razao_social: "", cnpj: "", especialidade: "", contato_nome: "", contato_telefone: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.razao_social || !form.cnpj) return;
    
    await addTerceiro.mutateAsync(form);
    setOpen(false);
    setForm({ razao_social: "", cnpj: "", especialidade: "", contato_nome: "", contato_telefone: "" });
  };

  const filtered = terceiros?.filter((t: any) => 
    t.razao_social.toLowerCase().includes(busca.toLowerCase()) || 
    t.cnpj?.includes(busca)
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Buscar empreiteira..." value={busca} onChange={e => setBusca(e.target.value)} className="pl-9" />
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto"><Plus className="size-4 mr-2" /> Nova Empreiteira</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Cadastrar Terceirizado</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label>Razão Social / Nome Fantasia</Label>
                  <Input required value={form.razao_social} onChange={e => setForm({...form, razao_social: e.target.value})} placeholder="Ex: Zé do Aço Estruturas" />
                </div>
                <div className="space-y-2">
                  <Label>CNPJ</Label>
                  <Input required value={form.cnpj} onChange={e => setForm({...form, cnpj: e.target.value})} placeholder="00.000.000/0000-00" />
                </div>
                <div className="space-y-2">
                  <Label>Especialidade</Label>
                  <Input value={form.especialidade} onChange={e => setForm({...form, especialidade: e.target.value})} placeholder="Ex: Alvenaria, Elétrica..." />
                </div>
                <div className="space-y-2">
                  <Label>Nome do Contato</Label>
                  <Input value={form.contato_nome} onChange={e => setForm({...form, contato_nome: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input value={form.contato_telefone} onChange={e => setForm({...form, contato_telefone: e.target.value})} />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={addTerceiro.isPending}>
                {addTerceiro.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : null} Salvar Empresa
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
            <div className="text-center p-12 text-muted-foreground">Nenhuma empreiteira cadastrada.</div>
          ) : (
            <div className="divide-y">
              {filtered.map((t: any) => (
                <div key={t.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-muted rounded-full">
                      <Building2 className="size-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{t.razao_social}</h3>
                      <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                        <span>CNPJ: {t.cnpj}</span>
                        <span>{t.especialidade}</span>
                      </div>
                      <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                        <span>Contato: {t.contato_nome}</span>
                        <span>Tel: {t.contato_telefone}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Badge variant={t.status === 'ativo' ? 'default' : 'secondary'} className={t.status === 'ativo' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}>
                      {t.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
