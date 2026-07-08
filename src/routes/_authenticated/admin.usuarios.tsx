import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, KeyRound, UserX, UserCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/usuarios")({
  head: () => ({ meta: [{ title: "Usuários — BRITO ENGENHARIA" }] }),
  component: UsuariosPage,
});

type AppRole = "admin" | "campo" | "cliente";

interface UsuarioRow {
  id: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  ativo: boolean;
  role: AppRole | null;
}

function UsuariosPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const usuarios = useQuery({
    queryKey: ["usuarios-admin"],
    queryFn: async (): Promise<UsuarioRow[]> => {
      const { data: profs, error } = await supabase
        .from("profiles")
        .select("id, nome, email, telefone, ativo")
        .order("nome");
      if (error) throw error;
      const { data: roles } = await supabase.from("user_roles").select("user_id, role");
      const map = new Map(roles?.map((r) => [r.user_id, r.role as AppRole]));
      return (profs ?? []).map((p) => ({ ...p, role: map.get(p.id) ?? null }));
    },
  });

  const toggleAtivo = useMutation({
    mutationFn: async ({ id, ativo }: { id: string; ativo: boolean }) => {
      const { error } = await supabase.from("profiles").update({ ativo }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["usuarios-admin"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const changeRole = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: AppRole }) => {
      await supabase.from("user_roles").delete().eq("user_id", id);
      const { error } = await supabase.from("user_roles").insert({ user_id: id, role });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Papel atualizado."); qc.invalidateQueries({ queryKey: ["usuarios-admin"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Usuários</h1>
          <p className="text-sm text-muted-foreground mt-1">Cadastre administradores, equipes de campo e clientes.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="size-4" /> Novo usuário</Button>
          </DialogTrigger>
          <NovoUsuarioDialog onClose={() => setOpen(false)} />
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Cadastrados</CardTitle></CardHeader>
        <CardContent>
          {usuarios.isLoading ? (
            <Loader2 className="size-5 animate-spin mx-auto" />
          ) : !usuarios.data?.length ? (
            <p className="text-sm text-muted-foreground">Nenhum usuário.</p>
          ) : (
            <div className="divide-y">
              {usuarios.data.map((u) => (
                <div key={u.id} className="py-3 flex flex-wrap items-center gap-3">
                  <div className="flex-1 min-w-[200px]">
                    <div className="font-medium text-sm flex items-center gap-2">
                      {u.nome}
                      {!u.ativo && <Badge variant="outline" className="text-xs">inativo</Badge>}
                    </div>
                    <div className="text-xs text-muted-foreground">{u.email} {u.telefone && `· ${u.telefone}`}</div>
                  </div>
                  <Select
                    value={u.role ?? ""}
                    onValueChange={(v) => changeRole.mutate({ id: u.id, role: v as AppRole })}
                  >
                    <SelectTrigger className="w-32"><SelectValue placeholder="Papel" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="campo">Campo</SelectItem>
                      <SelectItem value="cliente">Cliente</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleAtivo.mutate({ id: u.id, ativo: !u.ativo })}
                  >
                    {u.ativo ? <><UserX className="size-4" /> Desativar</> : <><UserCheck className="size-4" /> Ativar</>}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function NovoUsuarioDialog({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    nome: "", email: "", senha: "", telefone: "", role: "campo" as AppRole,
  });

  const criar = useMutation({
    mutationFn: async () => {
      // Salva a sessão do admin (signUp troca a sessão para o novo usuário)
      const { data: adminSess } = await supabase.auth.getSession();

      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.senha,
        options: {
          data: { nome: form.nome, role: form.role },
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      const newId = data.user?.id;

      // Restaura imediatamente a sessão do admin
      if (adminSess.session) {
        await supabase.auth.setSession({
          access_token: adminSess.session.access_token,
          refresh_token: adminSess.session.refresh_token,
        });
      }

      if (newId) {
        await supabase.from("profiles").update({ telefone: form.telefone || null, nome: form.nome }).eq("id", newId);
        await supabase.from("user_roles").delete().eq("user_id", newId);
        await supabase.from("user_roles").insert({ user_id: newId, role: form.role });
      }
    },
    onSuccess: () => {
      toast.success("Usuário criado.");
      qc.invalidateQueries({ queryKey: ["usuarios-admin"] });
      onClose();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <DialogContent>
      <DialogHeader><DialogTitle>Novo usuário</DialogTitle></DialogHeader>
      <form onSubmit={(e) => { e.preventDefault(); criar.mutate(); }} className="space-y-3">
        <div className="space-y-1.5">
          <Label>Nome *</Label>
          <Input required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label>E-mail *</Label>
          <Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label>Senha inicial *</Label>
          <Input required type="text" minLength={8} value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} />
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <KeyRound className="size-3" />
            Compartilhe com o usuário — ele pode trocar depois.
          </p>
        </div>
        <div className="space-y-1.5">
          <Label>Telefone</Label>
          <Input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label>Papel</Label>
          <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as AppRole })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin — gerencia tudo</SelectItem>
              <SelectItem value="campo">Campo — preenche RDOs</SelectItem>
              <SelectItem value="cliente">Cliente — só visualiza</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={criar.isPending}>
            {criar.isPending && <Loader2 className="size-4 animate-spin" />}
            Criar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
