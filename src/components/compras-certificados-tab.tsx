import { useState } from "react";
import { useCertificados, useEstoque, useAdicionarCertificado } from "@/hooks/use-compras";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, FileCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";

const FORM_INITIAL = { item_id: "", numero_certificado: "", data_emissao: "", data_vencimento: "" };

function formatDateBR(dateStr: string) {
  if (!dateStr) return "—";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

export function ComprasCertificadosTab() {
  const { data: certificados, isLoading } = useCertificados();
  const { data: estoque } = useEstoque();
  const addCert = useAdicionarCertificado();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(FORM_INITIAL);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.item_id) { toast.error("Selecione um equipamento"); return; }
    await addCert.mutateAsync(form);
    setOpen(false);
  };

  const ferramentasEEpis = estoque?.filter(i => i.tipo === 'ferramenta' || i.tipo === 'epi') || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Certificados e Calibração</h2>
          <p className="text-sm text-muted-foreground">Monitoramento de laudos de equipamentos e EPIs</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setForm(FORM_INITIAL); }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Novo Certificado</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Registrar Certificado</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Equipamento / EPI</Label>
                <Select value={form.item_id || undefined} onValueChange={(v) => setForm({...form, item_id: v})}>
                  <SelectTrigger><SelectValue placeholder="Selecione o equipamento..." /></SelectTrigger>
                  <SelectContent>
                    {ferramentasEEpis.map(item => (
                      <SelectItem key={item.id} value={item.id}>{item.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Nº do Certificado / Laudo</Label>
                <Input required value={form.numero_certificado} onChange={e => setForm({...form, numero_certificado: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data de Emissão</Label>
                  <Input type="date" required value={form.data_emissao} onChange={e => setForm({...form, data_emissao: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Vencimento</Label>
                  <Input type="date" required value={form.data_vencimento} onChange={e => setForm({...form, data_vencimento: e.target.value})} />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={addCert.isPending}>
                {addCert.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Salvar
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground" /></div>
          ) : !certificados?.length ? (
            <div className="text-center p-12 text-muted-foreground flex flex-col items-center">
              <FileCheck className="size-12 mb-3 opacity-20" />
              Nenhum certificado registrado no sistema.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground border-b">
                  <tr>
                    <th className="p-4 font-medium">Equipamento</th>
                    <th className="p-4 font-medium">Nº Certificado</th>
                    <th className="p-4 font-medium">Emissão</th>
                    <th className="p-4 font-medium">Vencimento</th>
                    <th className="p-4 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {certificados.map(c => {
                    const today = new Date().toISOString().split('T')[0];
                    const limit10 = new Date();
                    limit10.setDate(limit10.getDate() + 10);
                    const limit10Str = limit10.toISOString().split('T')[0];
                    
                    const isVencido = c.data_vencimento < today;
                    const isCritico = c.data_vencimento <= limit10Str && !isVencido;

                    return (
                      <tr key={c.id} className="hover:bg-muted/50 transition-colors">
                        <td className="p-4 font-medium">{c.item?.nome}</td>
                        <td className="p-4">{c.numero_certificado}</td>
                        <td className="p-4 text-muted-foreground">{formatDateBR(c.data_emissao)}</td>
                        <td className="p-4 font-semibold">{formatDateBR(c.data_vencimento)}</td>
                        <td className="p-4 text-right">
                          <Badge variant={isVencido ? "destructive" : isCritico ? "outline" : "secondary"} 
                                 className={isCritico ? "text-amber-600 border-amber-300 bg-amber-50" : isVencido ? "" : "bg-emerald-100 text-emerald-800"}>
                            {isVencido ? "Vencido" : isCritico ? "Vence em breve" : "Válido"}
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
