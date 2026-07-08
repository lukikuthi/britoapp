import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
            <Button onClick={() => setEditing(null)}>
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
                    onClick={() => {
                      if (confirm(`Remover a obra "${o.nome}"? Esta ação não pode ser desfeita.`)) {
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
    descricao: obra?.descricao ?? "",
    cliente_id: obra?.cliente_id ?? "",
  });

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

  const save = useMutation({
    mutationFn: async () => {
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
        descricao: form.descricao || null,
        cliente_id: form.cliente_id || null,
      };
      if (isEdit) {
        const { error } = await supabase.from("obras").update(payload).eq("id", obra!.id);
        if (error) throw error;
      } else {
        const { data: u } = await supabase.auth.getUser();
        const { error } = await supabase.from("obras").insert({ ...payload, criado_por: u.user?.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(isEdit ? "Obra atualizada." : "Obra criada.");
      qc.invalidateQueries({ queryKey: ["obras"] });
      qc.invalidateQueries({ queryKey: ["obras-dashboard"] });
      onClose();
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
        <div className="space-y-2">
          <Label>Nome *</Label>
          <Input required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Endereço</Label>
          <Input value={form.endereco} onChange={(e) => setForm({ ...form, endereco: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Cidade</Label>
            <Input value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Estado (UF)</Label>
            <Input maxLength={2} value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value.toUpperCase() })} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
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
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Início</Label>
            <Input type="date" value={form.data_inicio} onChange={(e) => setForm({ ...form, data_inicio: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Previsão de término</Label>
            <Input type="date" value={form.data_prevista_termino} onChange={(e) => setForm({ ...form, data_prevista_termino: e.target.value })} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Obra["status"] })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="em_andamento">Em andamento</SelectItem>
              <SelectItem value="pausada">Pausada</SelectItem>
              <SelectItem value="concluida">Concluída</SelectItem>
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

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={save.isPending}>
            {save.isPending && <Loader2 className="size-4 animate-spin" />}
            Salvar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
