import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useConfirmStore } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Loader2, MapPin, Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/obras/")({
  head: () => ({ meta: [{ title: "Obras — BRITO ENGENHARIA" }] }),
  component: ObrasPage,
});

interface Obra {
  id: string;
  nome: string;
  endereco: string | null;
  cidade: string | null;
  estado: string | null;
  latitude: number | null;
  longitude: number | null;
  responsavel_tecnico: string | null;
  data_inicio: string | null;
  data_prevista_termino: string | null;
  status: "em_andamento" | "pausada" | "concluida";
  descricao: string | null;
  cliente_id: string | null;
  tipo_escopo?: string;
  // Faturamento
  faturamento_razao_social?: string | null;
  faturamento_cnpj?: string | null;
  faturamento_cno?: string | null;
  faturamento_endereco?: string | null;
  faturamento_bairro?: string | null;
  faturamento_municipio?: string | null;
  faturamento_cep?: string | null;
  faturamento_inscricao_estadual?: string | null;
  faturamento_telefone?: string | null;
  faturamento_contato?: string | null;
  // Cobrança
  cobranca_razao_social?: string | null;
  cobranca_cnpj?: string | null;
  cobranca_cno?: string | null;
  cobranca_endereco?: string | null;
  cobranca_bairro?: string | null;
  cobranca_municipio?: string | null;
  cobranca_cep?: string | null;
  cobranca_inscricao_estadual?: string | null;
  cobranca_telefone?: string | null;
  cobranca_contato?: string | null;
  // Entrega
  entrega_cno?: string | null;
  entrega_bairro?: string | null;
  entrega_cep?: string | null;
  entrega_telefone?: string | null;
  entrega_contato?: string | null;
}

interface ProfileLite { id: string; nome: string; email: string | null }

function ObrasPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Obra | null>(null);
  const [open, setOpen] = useState(false);

  const obras = useQuery({
    queryKey: ["obras"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("obras")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Obra[];
    },
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("obras").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Obra removida.");
      qc.invalidateQueries({ queryKey: ["obras"] });
      qc.invalidateQueries({ queryKey: ["obras-dashboard"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Obras</h1>
          <p className="text-sm text-muted-foreground mt-1">Cadastre e gerencie todas as obras.</p>
        </div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button className="tour-form-nova" onClick={() => setEditing(null)}>
              <Plus className="size-4" />
              Nova obra
            </Button>
          </DialogTrigger>
          <ObraDialog obra={editing} onClose={() => { setOpen(false); setEditing(null); }} />
        </Dialog>
      </div>

      {obras.isLoading ? (
        <div className="py-12 flex justify-center"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>
      ) : !obras.data?.length ? (
        <Card><CardContent className="py-10 text-center text-muted-foreground">Nenhuma obra ainda.</CardContent></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {obras.data.map((o) => (
            <Card key={o.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">
                    <Link to="/obras/$obraId" params={{ obraId: o.id }} className="hover:underline">
                      {o.nome}
                    </Link>
                  </CardTitle>
                  <span className="brito-status-dot" data-status={o.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {(o.cidade || o.estado) && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="size-3.5" />
                    {[o.cidade, o.estado].filter(Boolean).join(" — ")}
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" onClick={() => { setEditing(o); setOpen(true); }}>
                    <Edit2 className="size-3.5" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={async () => {
                      if (await useConfirmStore.getState().confirm(`Remover a obra "${o.nome}"? Esta ação não pode ser desfeita.`, "Remover obra")) {
                        del.mutate(o.id);
                      }
                    }}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ObraDialog({ obra, onClose }: { obra: Obra | null; onClose: () => void }) {
  const qc = useQueryClient();
  const isEdit = !!obra;
  const [form, setForm] = useState({
    nome: obra?.nome ?? "",
    endereco: obra?.endereco ?? "",
    cidade: obra?.cidade ?? "",
    estado: obra?.estado ?? "",
    latitude: obra?.latitude?.toString() ?? "",
    longitude: obra?.longitude?.toString() ?? "",
    responsavel_tecnico: obra?.responsavel_tecnico ?? "",
    data_inicio: obra?.data_inicio ?? "",
    data_prevista_termino: obra?.data_prevista_termino ?? "",
    status: obra?.status ?? "em_andamento",
    tipo_escopo: (obra as any)?.tipo_escopo ?? "global",
    descricao: obra?.descricao ?? "",
    cliente_id: obra?.cliente_id ?? "",
    // Faturamento
    faturamento_razao_social: obra?.faturamento_razao_social ?? "",
    faturamento_cnpj: obra?.faturamento_cnpj ?? "",
    faturamento_cno: obra?.faturamento_cno ?? "",
    faturamento_endereco: obra?.faturamento_endereco ?? "",
    faturamento_bairro: obra?.faturamento_bairro ?? "",
    faturamento_municipio: obra?.faturamento_municipio ?? "",
    faturamento_cep: obra?.faturamento_cep ?? "",
    faturamento_inscricao_estadual: obra?.faturamento_inscricao_estadual ?? "",
    faturamento_telefone: obra?.faturamento_telefone ?? "",
    faturamento_contato: obra?.faturamento_contato ?? "",
    // Cobrança
    cobranca_razao_social: obra?.cobranca_razao_social ?? "",
    cobranca_cnpj: obra?.cobranca_cnpj ?? "",
    cobranca_cno: obra?.cobranca_cno ?? "",
    cobranca_endereco: obra?.cobranca_endereco ?? "",
    cobranca_bairro: obra?.cobranca_bairro ?? "",
    cobranca_municipio: obra?.cobranca_municipio ?? "",
    cobranca_cep: obra?.cobranca_cep ?? "",
    cobranca_inscricao_estadual: obra?.cobranca_inscricao_estadual ?? "",
    cobranca_telefone: obra?.cobranca_telefone ?? "",
    cobranca_contato: obra?.cobranca_contato ?? "",
    // Entrega
    entrega_cno: obra?.entrega_cno ?? "",
    entrega_bairro: obra?.entrega_bairro ?? "",
    entrega_cep: obra?.entrega_cep ?? "",
    entrega_telefone: obra?.entrega_telefone ?? "",
    entrega_contato: obra?.entrega_contato ?? "",
  });

  const [cobrancaIgual, setCobrancaIgual] = useState(true);

  const clientes = useQuery({
    queryKey: ["users-clientes"],
    queryFn: async () => {
      const { data: roles, error } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "cliente");
      if (error) throw error;
      const ids = roles?.map((r) => r.user_id) ?? [];
      if (!ids.length) return [] as ProfileLite[];
      const { data: profs, error: e2 } = await supabase
        .from("profiles")
        .select("id, nome, email")
        .in("id", ids);
      if (e2) throw e2;
      return (profs ?? []) as ProfileLite[];
    },
  });

  const navigate = useNavigate();

  const save = useMutation({
    mutationFn: async () => {
      // Se cobrança é igual ao faturamento, copiar campos
      const cob = cobrancaIgual ? {
        cobranca_razao_social: form.faturamento_razao_social || null,
        cobranca_cnpj: form.faturamento_cnpj || null,
        cobranca_cno: form.faturamento_cno || null,
        cobranca_endereco: form.faturamento_endereco || null,
        cobranca_bairro: form.faturamento_bairro || null,
        cobranca_municipio: form.faturamento_municipio || null,
        cobranca_cep: form.faturamento_cep || null,
        cobranca_inscricao_estadual: form.faturamento_inscricao_estadual || null,
        cobranca_telefone: form.faturamento_telefone || null,
        cobranca_contato: form.faturamento_contato || null,
      } : {
        cobranca_razao_social: form.cobranca_razao_social || null,
        cobranca_cnpj: form.cobranca_cnpj || null,
        cobranca_cno: form.cobranca_cno || null,
        cobranca_endereco: form.cobranca_endereco || null,
        cobranca_bairro: form.cobranca_bairro || null,
        cobranca_municipio: form.cobranca_municipio || null,
        cobranca_cep: form.cobranca_cep || null,
        cobranca_inscricao_estadual: form.cobranca_inscricao_estadual || null,
        cobranca_telefone: form.cobranca_telefone || null,
        cobranca_contato: form.cobranca_contato || null,
      };

      const payload = {
        nome: form.nome.trim(),
        endereco: form.endereco || null,
        cidade: form.cidade || null,
        estado: form.estado || null,
        latitude: form.latitude ? Number(form.latitude) : null,
        longitude: form.longitude ? Number(form.longitude) : null,
        responsavel_tecnico: form.responsavel_tecnico || null,
        data_inicio: form.data_inicio || null,
        data_prevista_termino: form.data_prevista_termino || null,
        status: form.status as Obra["status"],
        tipo_escopo: form.tipo_escopo,
        descricao: form.descricao || null,
        cliente_id: form.cliente_id || null,
        // Faturamento
        faturamento_razao_social: form.faturamento_razao_social || null,
        faturamento_cnpj: form.faturamento_cnpj || null,
        faturamento_cno: form.faturamento_cno || null,
        faturamento_endereco: form.faturamento_endereco || null,
        faturamento_bairro: form.faturamento_bairro || null,
        faturamento_municipio: form.faturamento_municipio || null,
        faturamento_cep: form.faturamento_cep || null,
        faturamento_inscricao_estadual: form.faturamento_inscricao_estadual || null,
        faturamento_telefone: form.faturamento_telefone || null,
        faturamento_contato: form.faturamento_contato || null,
        // Cobrança (copiada ou manual)
        ...cob,
        // Entrega
        entrega_cno: form.entrega_cno || null,
        entrega_bairro: form.entrega_bairro || null,
        entrega_cep: form.entrega_cep || null,
        entrega_telefone: form.entrega_telefone || null,
        entrega_contato: form.entrega_contato || null,
      };
      if (isEdit) {
        const { error } = await supabase.from("obras").update(payload).eq("id", obra!.id);
        if (error) throw error;
        return obra!.id;
      } else {
        const { data: u } = await supabase.auth.getUser();
        const { data, error } = await supabase
          .from("obras")
          .insert({ ...payload, criado_por: u.user?.id })
          .select("id")
          .single();
        if (error) throw error;
        return data.id;
      }
    },
    onSuccess: (newId) => {
      toast.success(isEdit ? "Obra atualizada." : "Obra criada.");
      qc.invalidateQueries({ queryKey: ["obras"] });
      qc.invalidateQueries({ queryKey: ["obras-dashboard"] });
      onClose();
      if (newId && !isEdit) {
        navigate({
          to: "/obras/$obraId",
          params: { obraId: newId },
          search: { tab: "visao" } as any,
        });
      }
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{isEdit ? "Editar obra" : "Nova obra"}</DialogTitle>
      </DialogHeader>
      <form
        onSubmit={(e) => { e.preventDefault(); save.mutate(); }}
        className="space-y-4"
      >
        <div className="space-y-2 tour-form-nome">
          <Label>Nome da Obra * (Padrão: Construtora - Nome da Obra)</Label>
          <Input required placeholder="Ex: Diálogo - Álvaro Ramos" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Endereço</Label>
          <Input value={form.endereco} onChange={(e) => setForm({ ...form, endereco: e.target.value })} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-2">
            <Label>Cidade</Label>
            <Input value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Estado (UF)</Label>
            <Input maxLength={2} value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value.toUpperCase() })} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 tour-form-latlng">
          <div className="space-y-2">
            <Label>Latitude</Label>
            <Input type="number" step="any" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Longitude</Label>
            <Input type="number" step="any" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} />
          </div>
        </div>
        <p className="text-xs text-muted-foreground -mt-2">
          Lat/Lng podem ser usados para localizar a obra no mapa.
        </p>
        <div className="space-y-2">
          <Label>Responsável técnico</Label>
          <Input value={form.responsavel_tecnico} onChange={(e) => setForm({ ...form, responsavel_tecnico: e.target.value })} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-2">
            <Label>Início</Label>
            <Input type="date" value={form.data_inicio} onChange={(e) => setForm({ ...form, data_inicio: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Previsão de término</Label>
            <Input type="date" value={form.data_prevista_termino} onChange={(e) => setForm({ ...form, data_prevista_termino: e.target.value })} />
          </div>
        </div>
        <div className="space-y-2 tour-form-status">
          <Label>Status</Label>
          <Select value={form.status} onValueChange={(v: any) => setForm({ ...form, status: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="em_andamento">Em andamento</SelectItem>
              <SelectItem value="pausada">Pausada</SelectItem>
              <SelectItem value="concluida">Concluída</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Escopo da Obra</Label>
          <Select value={form.tipo_escopo} onValueChange={(v: any) => setForm({ ...form, tipo_escopo: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="global">Global (Completa)</SelectItem>
              <SelectItem value="parcial">Parcial</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Cliente</Label>
          <Select value={form.cliente_id || "none"} onValueChange={(v) => setForm({ ...form, cliente_id: v === "none" ? "" : v })}>
            <SelectTrigger><SelectValue placeholder="Sem cliente vinculado" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Sem cliente vinculado</SelectItem>
              {clientes.data?.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.nome} ({c.email})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Descrição</Label>
          <Textarea rows={3} value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
        </div>

        {/* ========= DADOS PARA FATURAMENTO ========= */}
        <details className="border rounded-md p-3 bg-muted/20" open={!!form.faturamento_razao_social}>
          <summary className="font-semibold cursor-pointer text-sm">📄 Dados para Faturamento (Pedido de Compra)</summary>
          <div className="mt-3 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label className="text-xs">Razão Social</Label><Input value={form.faturamento_razao_social} onChange={e => setForm({...form, faturamento_razao_social: e.target.value})} /></div>
              <div className="space-y-1"><Label className="text-xs">CNO</Label><Input value={form.faturamento_cno} onChange={e => setForm({...form, faturamento_cno: e.target.value})} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label className="text-xs">CNPJ</Label><Input value={form.faturamento_cnpj} onChange={e => setForm({...form, faturamento_cnpj: e.target.value})} /></div>
              <div className="space-y-1"><Label className="text-xs">Inscrição Estadual</Label><Input value={form.faturamento_inscricao_estadual} onChange={e => setForm({...form, faturamento_inscricao_estadual: e.target.value})} /></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1"><Label className="text-xs">Endereço</Label><Input value={form.faturamento_endereco} onChange={e => setForm({...form, faturamento_endereco: e.target.value})} /></div>
              <div className="space-y-1"><Label className="text-xs">Bairro</Label><Input value={form.faturamento_bairro} onChange={e => setForm({...form, faturamento_bairro: e.target.value})} /></div>
              <div className="space-y-1"><Label className="text-xs">Município</Label><Input value={form.faturamento_municipio} onChange={e => setForm({...form, faturamento_municipio: e.target.value})} /></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1"><Label className="text-xs">CEP</Label><Input value={form.faturamento_cep} onChange={e => setForm({...form, faturamento_cep: e.target.value})} /></div>
              <div className="space-y-1"><Label className="text-xs">Telefone</Label><Input value={form.faturamento_telefone} onChange={e => setForm({...form, faturamento_telefone: e.target.value})} /></div>
              <div className="space-y-1"><Label className="text-xs">Contato</Label><Input value={form.faturamento_contato} onChange={e => setForm({...form, faturamento_contato: e.target.value})} /></div>
            </div>
          </div>
        </details>

        {/* ========= DADOS PARA COBRANÇA ========= */}
        <details className="border rounded-md p-3 bg-muted/20">
          <summary className="font-semibold cursor-pointer text-sm">
            💰 Dados para Cobrança
            <label className="ml-3 text-xs font-normal text-muted-foreground cursor-pointer">
              <input type="checkbox" className="mr-1" checked={cobrancaIgual} onChange={e => setCobrancaIgual(e.target.checked)} />
              Igual ao Faturamento
            </label>
          </summary>
          {!cobrancaIgual && (
            <div className="mt-3 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label className="text-xs">Razão Social</Label><Input value={form.cobranca_razao_social} onChange={e => setForm({...form, cobranca_razao_social: e.target.value})} /></div>
                <div className="space-y-1"><Label className="text-xs">CNO</Label><Input value={form.cobranca_cno} onChange={e => setForm({...form, cobranca_cno: e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label className="text-xs">CNPJ</Label><Input value={form.cobranca_cnpj} onChange={e => setForm({...form, cobranca_cnpj: e.target.value})} /></div>
                <div className="space-y-1"><Label className="text-xs">Inscrição Estadual</Label><Input value={form.cobranca_inscricao_estadual} onChange={e => setForm({...form, cobranca_inscricao_estadual: e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1"><Label className="text-xs">Endereço</Label><Input value={form.cobranca_endereco} onChange={e => setForm({...form, cobranca_endereco: e.target.value})} /></div>
                <div className="space-y-1"><Label className="text-xs">Bairro</Label><Input value={form.cobranca_bairro} onChange={e => setForm({...form, cobranca_bairro: e.target.value})} /></div>
                <div className="space-y-1"><Label className="text-xs">Município</Label><Input value={form.cobranca_municipio} onChange={e => setForm({...form, cobranca_municipio: e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1"><Label className="text-xs">CEP</Label><Input value={form.cobranca_cep} onChange={e => setForm({...form, cobranca_cep: e.target.value})} /></div>
                <div className="space-y-1"><Label className="text-xs">Telefone</Label><Input value={form.cobranca_telefone} onChange={e => setForm({...form, cobranca_telefone: e.target.value})} /></div>
                <div className="space-y-1"><Label className="text-xs">Contato</Label><Input value={form.cobranca_contato} onChange={e => setForm({...form, cobranca_contato: e.target.value})} /></div>
              </div>
            </div>
          )}
        </details>

        {/* ========= DADOS PARA ENTREGA ========= */}
        <details className="border rounded-md p-3 bg-muted/20" open={!!form.entrega_cno}>
          <summary className="font-semibold cursor-pointer text-sm">🚚 Dados para Entrega (complementar ao endereço da obra)</summary>
          <div className="mt-3 space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1"><Label className="text-xs">CNO</Label><Input value={form.entrega_cno} onChange={e => setForm({...form, entrega_cno: e.target.value})} /></div>
              <div className="space-y-1"><Label className="text-xs">Bairro</Label><Input value={form.entrega_bairro} onChange={e => setForm({...form, entrega_bairro: e.target.value})} /></div>
              <div className="space-y-1"><Label className="text-xs">CEP</Label><Input value={form.entrega_cep} onChange={e => setForm({...form, entrega_cep: e.target.value})} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label className="text-xs">Telefone</Label><Input value={form.entrega_telefone} onChange={e => setForm({...form, entrega_telefone: e.target.value})} /></div>
              <div className="space-y-1"><Label className="text-xs">Contato</Label><Input value={form.entrega_contato} onChange={e => setForm({...form, entrega_contato: e.target.value})} /></div>
            </div>
          </div>
        </details>

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button className="tour-form-save" type="submit" disabled={save.isPending}>
            {save.isPending && <Loader2 className="size-4 animate-spin" />}
            Salvar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
