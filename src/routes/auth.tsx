import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BritoLogo } from "@/components/brito-logo";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Entrar — BRITO ENGENHARIA" },
      { name: "description", content: "Acesso restrito ao sistema de Diário de Obra da BRITO ENGENHARIA." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active && data.session) {
        navigate({ to: "/dashboard", replace: true });
      }
    });
    return () => {
      active = false;
    };
  }, [navigate]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    setLoading(false);
    if (error) {
      toast.error(error.message === "Invalid login credentials"
        ? "E-mail ou senha incorretos."
        : error.message);
      return;
    }
    toast.success("Bem-vindo!");
    navigate({ to: "/dashboard", replace: true });
  }

  async function handleResetPassword() {
    if (!email) {
      toast.error("Digite seu e-mail primeiro para redefinir a senha.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("E-mail de redefinição enviado! Verifique sua caixa de entrada e spam.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-secondary">
      <header className="p-6 pb-2">
        <BritoLogo size="xl" />
      </header>
      <main className="flex-1 flex items-center justify-center px-4 pb-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Entrar</CardTitle>
            <CardDescription>
              Acesso restrito. Use o e-mail e senha fornecidos pelo administrador.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="senha">Senha</Label>
                  <button
                    type="button"
                    onClick={handleResetPassword}
                    className="text-xs text-primary hover:underline font-medium"
                    disabled={loading}
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <Input
                  id="senha"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="size-4 animate-spin" />}
                Entrar
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Não tem cadastro? Solicite ao administrador da sua obra.
              </p>
            </form>
          </CardContent>
        </Card>
      </main>
      <footer className="text-center text-xs text-sidebar-foreground/60 pb-6" suppressHydrationWarning>
        © {new Date().getFullYear()} BRITO ENGENHARIA · PROJETO MATRIZ · Desenvolvido por Lucas Kikuthi
      </footer>
    </div>
  );
}
