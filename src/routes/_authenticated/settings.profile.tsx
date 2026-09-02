import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useProfile } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Camera, Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/settings/profile")({
  head: () => ({ meta: [{ title: "Meu Perfil — BRITO ENGENHARIA" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const qc = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    idioma: "pt-BR"
  });

  useEffect(() => {
    if (profile) {
      setForm({
        nome: profile.nome || "",
        email: profile.email || user?.email || "",
        telefone: profile.telefone || "",
        idioma: "pt-BR"
      });
    }
  }, [profile, user]);

  const saveMutation = useMutation({
    mutationFn: async () => {

      const { error } = await supabase
        .from("profiles")
        .update({
          nome: form.nome,
          telefone: form.telefone || null,
        })
        .eq("id", user!.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Perfil atualizado com sucesso!");
      qc.invalidateQueries({ queryKey: ["profile", user?.id] });
    },
    onError: (e: Error) => {
      toast.error(e.message);
    }
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user!.id}/avatar_${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: data.publicUrl })
        .eq("id", user!.id);

      if (updateError) throw updateError;
      return data.publicUrl;
    },
    onSuccess: () => {
      toast.success("Foto de perfil atualizada!");
      qc.invalidateQueries({ queryKey: ["profile", user?.id] });
    },
    onError: (e: Error) => {
      toast.error("Erro ao fazer upload da imagem. Talvez o bucket 'avatars' não exista no Supabase.");
      console.error(e);
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadAvatarMutation.mutate(e.target.files[0]);
    }
  };

  const inits = profile?.nome?.substring(0, 2).toUpperCase() || "US";

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <SettingsIcon className="size-8 text-primary" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Configurações da Conta</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerencie suas informações pessoais e preferências de sistema.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Sua Foto</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="size-32">
              <AvatarImage src={profile?.avatar_url || ""} />
              <AvatarFallback className="text-4xl bg-primary/10 text-primary">{inits}</AvatarFallback>
            </Avatar>
            <input 
              type="file" 
              accept="image/*"
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              disabled={uploadAvatarMutation.isPending}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploadAvatarMutation.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : <Camera className="size-4 mr-2" />}
              Alterar Foto
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Detalhes do Perfil</CardTitle>
            <CardDescription>Informações básicas que serão exibidas para outros usuários.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }} className="space-y-4">
              <div className="space-y-2">
                <Label>Nome Completo</Label>
                <Input 
                  value={form.nome} 
                  onChange={e => setForm({...form, nome: e.target.value})} 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input 
                  type="email"
                  value={form.email} 
                  disabled
                />
                <p className="text-[10px] text-muted-foreground">O e-mail não pode ser alterado por motivos de segurança.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Telefone (WhatsApp)</Label>
                  <Input 
                    value={form.telefone} 
                    onChange={e => setForm({...form, telefone: e.target.value})} 
                    placeholder="(00) 00000-0000"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Idioma</Label>
                  <Select value={form.idioma} onValueChange={v => setForm({...form, idioma: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
                  Salvar Alterações
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
