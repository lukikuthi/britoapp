import { useEffect, useState } from "react";
import { useRouterState, useNavigate } from "@tanstack/react-router";
import { Joyride, CallBackProps, STATUS, Step, ACTIONS, EVENTS } from "react-joyride";
import { useTutorial } from "@/hooks/use-tutorial";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HardHat, Compass, FileCheck2, MapPin, PartyPopper } from "lucide-react";
import { toast } from "sonner";

/* ───────────────────────────────────────────────
   STEPS: DASHBOARD (COM OBRAS)
   ─────────────────────────────────────────────── */
const DASHBOARD_STEPS: Step[] = [
  {
    target: "body",
    content: "Bem-vindo ao Brito Builder Log! Sou seu assistente e vou te guiar por todas as funcionalidades da plataforma.",
    placement: "center",
    disableBeacon: true,
  },
  {
    target: ".tour-nova-obra",
    content: "Botão de Ações Rápidas: Clique aqui para registrar uma nova obra ou adicionar um novo usuário à plataforma.",
    placement: "top",
  },
  {
    target: ".tour-lista-obras",
    content: "Painel de Obras: Todas as suas obras ativas aparecem aqui. Você vê o status, a cidade, e quantos apontamentos estão abertos — tudo sem precisar entrar na obra. Ao finalizar, vou entrar automaticamente na primeira obra para continuar o tutorial.",
    placement: "top",
  },
];

/* ───────────────────────────────────────────────
   STEPS: DASHBOARD (SEM OBRAS)
   ─────────────────────────────────────────────── */
const DASHBOARD_EMPTY_STEPS: Step[] = [
  {
    target: "body",
    content: "Bem-vindo ao Brito Builder Log! Você ainda não tem nenhuma obra cadastrada. Vamos criar sua primeira agora!",
    placement: "center",
    disableBeacon: true,
  },
  {
    target: ".tour-nova-obra",
    content: "Clique neste botão para abrir o formulário de criação. Ao avançar, eu vou navegar até a tela de obras para você!",
    placement: "top",
  },
];

/* ───────────────────────────────────────────────
   STEPS: CRIANDO OBRA (Formulário)
   ─────────────────────────────────────────────── */
const CREATING_OBRA_STEPS: Step[] = [
  {
    target: "body",
    content: "Esta é a tela de Gestão de Obras. Aqui você cadastra e gerencia todos os seus canteiros. Vamos criar uma obra agora!",
    placement: "center",
    disableBeacon: true,
  },
  {
    target: ".tour-form-nova",
    content: "Clique em 'Nova Obra' para abrir o formulário. Ao avançar, eu abro automaticamente para você!",
    placement: "bottom",
  },
  {
    target: ".tour-form-nome",
    content: "📝 Nome da Obra: Dê um nome descritivo — pode ser o nome do edifício, do condomínio ou do cliente. Este é o único campo obrigatório.",
    placement: "right",
  },
  {
    target: ".tour-form-latlng",
    content: "📍 Latitude e Longitude: MUITO IMPORTANTE! O sistema usa essas coordenadas para buscar automaticamente as condições climáticas via satélite quando você cria um RDO. Sem elas, o clima não é preenchido automaticamente.",
    placement: "right",
  },
  {
    target: ".tour-form-status",
    content: "🔄 Status: Mantenha 'Em andamento' para poder criar RDOs e apontamentos. Obras 'Pausadas' ou 'Concluídas' ficam bloqueadas para edição.",
    placement: "right",
  },
  {
    target: ".tour-form-save",
    content: "✅ Preencha pelo menos o nome e clique em Salvar. O sistema vai te redirecionar automaticamente para dentro da nova obra!",
    placement: "top",
  },
];

/* ───────────────────────────────────────────────
   STEPS: ESPERANDO O USUÁRIO ENTRAR NA OBRA
   ─────────────────────────────────────────────── */
const WAITING_OBRA_STEP: Step[] = [
  {
    target: ".tour-lista-obras",
    content: "Agora clique em qualquer obra da lista para entrarmos no canteiro e continuarmos o tutorial!",
    placement: "top",
    disableBeacon: true,
  },
];

/* ───────────────────────────────────────────────
   STEPS: DENTRO DA OBRA (Tour Completo)
   ─────────────────────────────────────────────── */
const OBRA_STEPS: Step[] = [
  // --- Boas-vindas ---
  {
    target: "body",
    content: "🏗️ Bem-vindo ao Painel da Obra! Aqui é onde toda a mágica acontece. Vou te mostrar CADA seção em detalhes. O sistema vai trocar de aba automaticamente para você!",
    placement: "center",
    disableBeacon: true,
  },
  // --- VISÃO ---
  {
    target: ".tour-tab-visao",
    content: "📊 VISÃO GERAL: Resume toda a obra em números. Você vê a quantidade de Torres, Andares, Apontamentos Abertos e Resolvidos. Clique nos cards para navegar diretamente para a seção correspondente.",
    placement: "top",
  },
  // --- RDO ---
  {
    target: ".tour-tab-rdo",
    content: "📋 RDO (Relatório Diário de Obra): O documento mais importante do canteiro! Registre clima, efetivo, atividades e fotos. E a novidade: quando os 5 dias da semana (Segunda a Sexta) estiverem preenchidos, o sistema libera automaticamente a criação de um RDO SEMANAL consolidado!",
    placement: "top",
  },
  // --- MEDIÇÃO ---
  {
    target: ".tour-tab-medicao",
    content: "📐 MEDIÇÃO DE CAMPO: Importe a planilha de orçamento do escritório e vá para o campo dar baixa nas quantidades executadas. O sistema calcula automaticamente o Saldo restante e o % de Progresso. Você pode configurar a obra como 'Escopo Parcial' ou 'Global' nas Configurações.",
    placement: "top",
  },
  // --- PLANTAS ---
  {
    target: ".tour-tab-mapa",
    content: "🗺️ PLANTAS E APONTAMENTOS: Faça upload das plantas (agora com remoção e substituição facilitadas) e adicione PINS interativos direto no desenho para marcar pendências. Exporte tudo em PDF.",
    placement: "top",
  },
  // --- FOTOS ---
  {
    target: ".tour-tab-fotografia",
    content: "📸 DIÁRIO FOTOGRÁFICO: Centralize todas as fotos do canteiro com título e descrição. Ideal para montar relatórios fotográficos em PDF — útil para medições, vistorias de entrega e acompanhamento de clientes.",
    placement: "top",
  },
  // --- MATERIAIS ---
  {
    target: ".tour-tab-materiais",
    content: "📦 MATERIAIS: Gerencie o controle de recebimento de materiais no canteiro. Cadastre itens esperados, registre entregas, e acompanhe o que já chegou vs. o que falta. Integra com o módulo FVR (Ficha de Verificação) no Menu.",
    placement: "top",
  },
  // --- LAUDOS ---
  {
    target: ".tour-tab-laudos",
    content: "📄 LAUDOS E ARTs: Guarde toda a documentação técnica da obra em um só lugar — laudos estruturais, ARTs de responsabilidade técnica, relatórios de sondagem, etc. Faça upload de qualquer arquivo.",
    placement: "top",
  },
  // --- SESMT ---
  {
    target: ".tour-tab-sesmt",
    content: "⛑️ SESMT (Segurança do Trabalho): Controle de DDS (Diálogos Diários de Segurança) e entrega de EPIs com ficha assinada. Mantenha sua obra 100% regularizada com o Ministério do Trabalho.",
    placement: "top",
  },
  // --- CRONOGRAMA ---
  {
    target: ".tour-tab-cronograma",
    content: "📅 CRONOGRAMA GANTT: Monte a EAP (Estrutura Analítica do Projeto) com os pacotes de trabalho e visualize o progresso em barras de Gantt. Essencial para controle de prazos e medições de empreiteiros.",
    placement: "top",
  },
  // --- CONFIG ---
  {
    target: ".tour-obra-config",
    content: "⚙️ CONFIGURAÇÕES: Edite os dados da obra (nome, endereço, coordenadas), gerencie a Equipe (convide Engenheiros, Fiscais e Clientes) e configure a Estrutura (Torres, Andares e Grupos).",
    placement: "bottom",
  },
  // --- MENU ---
  {
    target: ".tour-tab-menu",
    content: "📂 MENU COMPLETO: Aqui ficam os Módulos Avançados que não cabem na barra inferior: Concretagem (controle de caminhões-betoneira), FVR (Ficha de Verificação de Recebimento), RNC (Relatório de Não Conformidade) e BM (Boletim de Medição Física). Explore cada um!",
    placement: "top",
  },
];

export function GlobalTutorial() {
  const { stage, setStage, hasObras } = useTutorial();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  const [steps, setSteps] = useState<Step[]>([]);
  const [run, setRun] = useState(false);

  // Monitor route changes to advance tutorial stage automatically
  useEffect(() => {
    if (stage === "waiting_obra" && pathname.includes("/obras/")) {
      // User entered an obra!
      setStage("obra");
    }
  }, [pathname, stage, setStage]);

  // Sync state with Joyride config
  useEffect(() => {
    setRun(false);

    if (stage === "idle" || stage === "finished" || stage === "welcome") {
      return;
    }

    if (stage === "dashboard") {
      setSteps(hasObras ? DASHBOARD_STEPS : DASHBOARD_EMPTY_STEPS);
      setTimeout(() => setRun(true), 100);
    } else if (stage === "creating_obra") {
      setSteps(CREATING_OBRA_STEPS);
      setTimeout(() => setRun(true), 500);
    } else if (stage === "waiting_obra") {
      setSteps(WAITING_OBRA_STEP);
      setTimeout(() => setRun(true), 100);
    } else if (stage === "obra") {
      const timer = setTimeout(() => {
        setSteps(OBRA_STEPS);
        setRun(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [stage, hasObras]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type, step } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    // Auto-click the "Nova Obra" button during creating_obra stage
    if (type === EVENTS.STEP_AFTER && stage === "creating_obra") {
      if (step.target === ".tour-form-nova") {
        const btn = document.querySelector(".tour-form-nova") as HTMLElement;
        if (btn) btn.click();
      }
    }

    // Automatically change tabs on Obra steps
    if (type === EVENTS.STEP_BEFORE && stage === "obra") {
      const match = pathname.match(/\/obras\/([^/]+)/);
      const obraId = match ? match[1] : null;
      if (obraId && typeof step.target === "string") {
        let nextTab: string | null = null;
        if (step.target === ".tour-tab-visao") nextTab = "visao";
        else if (step.target === ".tour-tab-medicao") nextTab = "medicao";
        else if (step.target === ".tour-tab-rdo") nextTab = "rdo";
        else if (step.target === ".tour-tab-mapa") nextTab = "mapa";
        else if (step.target === ".tour-tab-fotografia") nextTab = "fotografia";
        else if (step.target === ".tour-tab-materiais") nextTab = "materiais";
        else if (step.target === ".tour-tab-laudos") nextTab = "laudos";
        else if (step.target === ".tour-tab-sesmt") nextTab = "sesmt";
        else if (step.target === ".tour-tab-cronograma") nextTab = "cronograma";
        else if (step.target === ".tour-tab-menu") nextTab = "menu";
        else if (step.target === ".tour-obra-config") nextTab = "menu";

        if (nextTab) {
          navigate({
            to: "/obras/$obraId",
            params: { obraId },
            search: { tab: nextTab } as any,
            replace: true,
          });
        }
      }
    }

    // Handle finish
    if (finishedStatuses.includes(status)) {
      if (stage === "dashboard") {
        if (hasObras) {
          // Auto-navigate to the first obra
          const firstObra = document.querySelector(".tour-lista-obras a") as HTMLAnchorElement;
          const href = firstObra?.getAttribute("href");
          if (href) {
            navigate({ to: href } as any);
            setStage("obra");
          } else {
            setStage("waiting_obra");
          }
        } else {
          const novaBtn = document.querySelector(".tour-nova-obra") as HTMLElement;
          if (novaBtn) novaBtn.click();
          navigate({ to: "/obras" });
          setStage("creating_obra");
        }
      } else if (stage === "creating_obra") {
        setStage("waiting_obra");
      } else if (stage === "waiting_obra") {
        setStage("idle");
      } else if (stage === "obra") {
        setStage("finished");
        toast.success("🎉 Tutorial finalizado! Agora você conhece todas as funcionalidades. Explore à vontade!", {
          duration: 6000,
        });
      }
    }
  };

  return (
    <>
      {/* Welcome Dialog */}
      <Dialog open={stage === "welcome"} onOpenChange={(open) => !open && setStage("idle")}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Compass className="size-6 text-primary" />
              Bem-vindo ao Brito Builder
            </DialogTitle>
            <DialogDescription className="text-base mt-2">
              Este sistema foi feito por engenheiros para engenheiros. Aqui você vai gerenciar suas obras de ponta a ponta sem complicação.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex gap-3 items-start">
              <div className="bg-primary/10 p-2 rounded-full mt-1">
                <HardHat className="size-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Gestão de Canteiro</h4>
                <p className="text-sm text-muted-foreground">Obras, RDOs diários com clima automático, equipe e controle fotográfico.</p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="bg-primary/10 p-2 rounded-full mt-1">
                <MapPin className="size-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Apontamentos Visuais</h4>
                <p className="text-sm text-muted-foreground">Faça upload de plantas e insira PINS para marcar defeitos, tarefas e não conformidades direto no projeto.</p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="bg-primary/10 p-2 rounded-full mt-1">
                <FileCheck2 className="size-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Módulos Avançados</h4>
                <p className="text-sm text-muted-foreground">Concretagem, FVR, RNC, Boletim de Medição, SESMT, Cronograma Gantt e muito mais.</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setStage("idle")}>Pular Tutorial</Button>
            <Button onClick={() => setStage("dashboard")}>
              <Compass className="size-4 mr-2" />
              Iniciar Tour Guiado
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Finished Dialog */}
      <Dialog open={stage === "finished"} onOpenChange={(open) => !open && setStage("idle")}>
        <DialogContent className="sm:max-w-[450px] text-center">
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="bg-primary/10 p-4 rounded-full">
              <PartyPopper className="size-10 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-bold">Tutorial Finalizado! 🎉</DialogTitle>
            <DialogDescription className="text-base">
              Agora você conhece todas as funcionalidades do Brito Builder Log. Explore cada módulo à vontade e construa obras extraordinárias!
            </DialogDescription>
            <p className="text-sm text-muted-foreground">
              Dica: use o botão "Tutorial da Obra" dentro de qualquer obra para rever as explicações a qualquer momento.
            </p>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button onClick={() => setStage("idle")}>
              Começar a Usar! 🚀
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Joyride */}
      <Joyride
        key={stage}
        callback={handleJoyrideCallback}
        continuous
        hideCloseButton
        run={run}
        scrollToFirstStep
        showProgress
        showSkipButton
        steps={steps}
        styles={{
          options: {
            zIndex: 10000,
            primaryColor: "#0f172a",
            textColor: "#0f172a",
          },
          tooltip: {
            borderRadius: 12,
            padding: 20,
          },
          tooltipContent: {
            fontSize: 14,
            lineHeight: 1.6,
          },
        }}
        locale={{
          back: "Voltar",
          close: "Fechar",
          last: stage === "dashboard" ? "Entrar na Obra →" : "Finalizar Tour 🎉",
          next: "Próximo →",
          skip: "Pular tour",
        }}
      />
    </>
  );
}
