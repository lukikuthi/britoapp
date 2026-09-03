import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, ShoppingCart, DollarSign, Users, Briefcase, ArrowRight } from "lucide-react";
import { useModulos, AppModulo } from "@/hooks/use-auth";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/hub")({
  head: () => ({ meta: [{ title: "Portal Matriz — BRITO ENGENHARIA" }] }),
  component: HubPage,
});

const MODULE_INFO: Record<AppModulo, { title: string; desc: string; icon: any; color: string; to: string }> = {
  obras: {
    title: "Obras & Canteiro",
    desc: "Gestão de canteiro, RDOs, plantas, FVS e apontamentos.",
    icon: Building2,
    color: "text-blue-500",
    to: "/dashboard"
  },
  compras: {
    title: "Compras",
    desc: "Suprimentos, fornecedores, cotações e pedidos de materiais.",
    icon: ShoppingCart,
    color: "text-amber-500",
    to: "/compras"
  },
  financeiro: {
    title: "Financeiro",
    desc: "Fluxo de caixa, medições e aprovações de faturas.",
    icon: DollarSign,
    color: "text-green-600",
    to: "/financeiro"
  },
  rh: {
    title: "Recursos Humanos",
    desc: "Ponto de campo, folha de pagamento e gestão de EPIs.",
    icon: Users,
    color: "text-purple-500",
    to: "/rh"
  },
  diretoria: {
    title: "Painel da Diretoria",
    desc: "Visão global consolidada, BI, aprovações finais e metas.",
    icon: Briefcase,
    color: "text-[var(--brand-gold)]",
    to: "/diretoria"
  }
};

function HubPage() {
  const { data: modulos, isLoading } = useModulos();
  const navigate = useNavigate();

  // Se o usuário só tiver 1 módulo, redireciona automaticamente para ele
  useEffect(() => {
    if (modulos && modulos.length === 1) {
      const info = MODULE_INFO[modulos[0]];
      if (info) {
        navigate({ to: info.to, replace: true });
      }
    }
  }, [modulos, navigate]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!modulos || modulos.length === 0) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center mt-12">
        <h2 className="text-2xl font-bold">Sem Acesso</h2>
        <p className="text-muted-foreground mt-2">Você ainda não foi vinculado a nenhum módulo da empresa. Fale com o Administrador.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Bem-vindo ao Portal</h1>
        <p className="text-muted-foreground text-lg">Selecione o módulo que deseja acessar.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modulos.map((mod) => {
          const info = MODULE_INFO[mod];
          if (!info) return null;
          
          return (
            <Link key={mod} to={info.to} className="group block h-full">
              <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-[var(--brand-gold)] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <info.icon className={`size-24 ${info.color}`} />
                </div>
                <CardHeader>
                  <div className={`size-12 rounded-lg bg-secondary flex items-center justify-center mb-4 ${info.color}`}>
                    <info.icon className="size-6" />
                  </div>
                  <CardTitle className="text-xl">{info.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">{info.desc}</CardDescription>
                  <div className="mt-6 flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                    Acessar módulo <ArrowRight className="ml-1 size-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
