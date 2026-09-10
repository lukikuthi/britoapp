import { useState } from "react";
import { useEstoque, useAdicionarItem } from "@/hooks/use-compras";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Loader2, Wrench, Package, HardHat } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import * as xlsx from "xlsx";
import { toast } from "sonner";
import { useImportarPlanilhaFerramentas } from "@/hooks/use-compras";

const FORM_INITIAL = { nome: "", tipo: "material", obra_id: "matriz", quantidade_atual: 0, limite_minimo: 0 };

export function ComprasEstoqueTab() {
  const { data: estoque, isLoading } = useEstoque();
  const addItem = useAdicionarItem();
  
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(FORM_INITIAL);

  const { data: obras } = useQuery({
    queryKey: ["todas-obras"],
    queryFn: async () => {
      const { data } = await supabase.from("obras").select("id, nome").order("nome");
      return data || [];
    }
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addItem.mutateAsync({
      ...form,
      obra_id: form.obra_id === "matriz" ? null : form.obra_id,
      quantidade_atual: Math.max(0, form.quantidade_atual),
      limite_minimo: Math.max(0, form.limite_minimo)
    });
    setOpen(false);
  };

  const importMutation = useImportarPlanilhaFerramentas();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = xlsx.read(bstr, { type: 'binary' });
        
        let sheetName = "";
        if (wb.SheetNames.includes("Ferramentas")) sheetName = "Ferramentas";
        else if (wb.SheetNames.includes("Materiais Diversos")) sheetName = "Materiais Diversos";
        else sheetName = wb.SheetNames[0];

        const ws = wb.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(ws, { header: 1 }) as any[][];
        
        // As abas tem um header na linha 2 (index 1) no modelo da empresa Brito
        const itensToInsert = [];
        
        // Pula as primeiras 2 linhas que são cabeçalhos
        for (let i = 2; i < data.length; i++) {
          const row = data[i];
          if (!row || row.length < 2) continue; // Pula linha vazia
          
          const patrimonio = row[0]; // Nº Patrimônio
          const nome = row[1]; // Descrição do item
          const num_pedido = row[2];
          
          // Tratamento de datas do Excel (se vier numérico)
          let data_compra = null;
          if (row[3]) {
             if (typeof row[3] === 'number') {
                const dateObj = new Date(Math.round((row[3] - 25569) * 86400 * 1000));
                data_compra = dateObj.toISOString().split('T')[0];
             } else {
                data_compra = row[3];
             }
          }
          
          const nf = row[4];
          const valor = row[5]; // Valor do equipamento
          const fornecedor = sheetName === "Ferramentas" ? row[7] : row[12]; // Ferramentas: col H (7), Materiais: col M (12)
          
          if (nome) {
            itensToInsert.push({
              nome,
              tipo: sheetName === "Ferramentas" ? "ferramenta" : "material",
              patrimonio: patrimonio || null,
              data_compra: data_compra,
              nf: nf?.toString() || null,
              valor_equipamento: typeof valor === 'number' ? valor : 0,
              fornecedor_nome: fornecedor || null,
              num_pedido: num_pedido || null,
              quantidade_atual: 1, // Geralmente ferramentas vêm 1 por linha com patrimônio
              limite_minimo: 0,
            });
          }
        }
        
        if (itensToInsert.length > 0) {
          await importMutation.mutateAsync(itensToInsert);
        } else {
          toast.error("Nenhum item válido encontrado na planilha.");
        }
      } catch (err: any) {
        toast.error("Erro ao processar planilha: " + err.message);
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = ''; // reseta o input
  };

  const filtered = estoque?.filter(i => i.nome.toLowerCase().includes(search.toLowerCase()));

  const getTypeIcon = (tipo: string) => {
    switch (tipo) {
      case 'epi': return <HardHat className="size-4 mr-1 text-amber-500" />;
      case 'ferramenta': return <Wrench className="size-4 mr-1 text-blue-500" />;
      default: return <Package className="size-4 mr-1 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar item no estoque..."
            className="pl-8"
            aria-label="Buscar item no estoque"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <Input 
              type="file" 
              accept=".xlsx,.xls" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileUpload}
              title="Importar Planilha do Estoque Brito"
            />
            <Button variant="outline" className="pointer-events-none" disabled={importMutation.isPending}>
              {importMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Package className="mr-2 h-4 w-4" />}
              {importMutation.isPending ? "Importando..." : "Importar Planilha"}
            </Button>
          </div>
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setForm(FORM_INITIAL); }}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> Novo Item</Button>
            </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Cadastrar no Estoque</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-2">
                <Label>Nome do Item</Label>
                <Input required value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select value={form.tipo} onValueChange={(v) => setForm({...form, tipo: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="material">Material (Insumo)</SelectItem>
                      <SelectItem value="ferramenta">Ferramenta</SelectItem>
                      <SelectItem value="epi">E.P.I.</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Alocação (Obra)</Label>
                  <Select value={form.obra_id} onValueChange={(v) => setForm({...form, obra_id: v})}>
                    <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="matriz">Depósito / Matriz</SelectItem>
                      {obras?.map(o => <SelectItem key={o.id} value={o.id}>{o.nome}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Quantidade Inicial</Label>
                  <Input type="number" min="0" required value={form.quantidade_atual} onChange={e => setForm({...form, quantidade_atual: Number(e.target.value) || 0})} />
                </div>
                <div className="space-y-2">
                  <Label>Limite Mínimo (Alerta)</Label>
                  <Input type="number" min="0" required value={form.limite_minimo} onChange={e => setForm({...form, limite_minimo: Number(e.target.value) || 0})} />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={addItem.isPending}>
                {addItem.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Salvar Item
              </Button>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground" /></div>
          ) : !filtered?.length ? (
            <div className="text-center p-12 text-muted-foreground">Nenhum item cadastrado no estoque.</div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="p-3 font-medium">Nome do Item</th>
                    <th className="p-3 font-medium">Categoria</th>
                    <th className="p-3 font-medium">Alocação</th>
                    <th className="p-3 font-medium">Qtd Atual</th>
                    <th className="p-3 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map(item => {
                    const isCritico = item.quantidade_atual <= item.limite_minimo;
                    return (
                      <tr key={item.id} className={`hover:bg-muted/50 transition-colors ${isCritico ? 'bg-red-50/30' : ''}`}>
                        <td className="p-3 font-medium">{item.nome}</td>
                        <td className="p-3 flex items-center capitalize">{getTypeIcon(item.tipo)} {item.tipo}</td>
                        <td className="p-3">{item.obra?.nome || 'Matriz'}</td>
                        <td className="p-3 font-bold">{item.quantidade_atual}</td>
                        <td className="p-3 text-right">
                          <Badge variant={isCritico ? "destructive" : "secondary"}>
                            {isCritico ? `Baixo (Min: ${item.limite_minimo})` : "OK"}
                          </Badge>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
