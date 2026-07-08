import { useEffect, useState } from "react";
import { useRouterState, useNavigate } from "@tanstack/react-router";
import { Joyride, CallBackProps, STATUS, Step, ACTIONS, EVENTS } from "react-joyride";
import { useTutorial } from "@/hooks/use-tutorial";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HardHat, Compass, FileCheck2, MapPin } from "lucide-react";

const DASHBOARD_STEPS: Step[] = [
  {
    target: "body",
    content: "Bem-vindo ao Brito Builder Log! Sou seu assistente de tour e vou te mostrar os controles básicos do seu novo império da construção civil.",
    placement: "center",
    disableBeacon: true,
  },
  {
    target: ".tour-nova-obra",
    content: "Criar Obra: Clique neste botão gigante no canto para registrar um novo canteiro de obras. Você precisará de dados básicos como Endereço, Latitude/Longitude (para o Clima Inteligente) e Data de Início.",
    placement: "top",
  },
  {
    target: ".tour-lista-obras",
    content: "Painel de Comando: Todas as suas Obras ativas aparecerão nesta lista. Você pode ver instantaneamente quantas RNCs ou Apontamentos estão atrasados sem nem precisar entrar na obra.",
    placement: "top",
  },
];

const DASHBOARD_EMPTY_STEPS: Step[] = [
  {
    target: "body",
    content: "Como você ainda não tem nenhuma obra, vamos começar criando sua primeira!",
    placement: "center",
    disableBeacon: true,
  },
  {
    target: ".tour-nova-obra",
    content: "Ao finalizar, eu vou clicar magicamente aqui para você abrir o formulário de Nova Obra.",
    placement: "top",
  }
];

const CREATING_OBRA_STEPS: Step[] = [
  {
    target: "body",
    content: "Esta é a tela de Gestão de Obras. Aqui você verá todas as suas obras cadastradas no futuro.",
    placement: "center",
    disableBeacon: true,
  },
  {
    target: ".tour-form-nova",
    content: "Ao clicar em Próximo, eu vou abrir o formulário automaticamente para você!",
    placement: "bottom",
  },
  {
    target: ".tour-form-nome",
    content: "Nome da Obra: Como ela será chamada? Pode ser o nome do edifício, cliente ou loteamento.",
    placement: "right",
  },
  {
    target: ".tour-form-latlng",
    content: "Latitude e Longitude: Extremamente importantes! O sistema usará isso para puxar o Clima automático via satélite todos os dias.",
    placement: "right",
  },
  {
    target: ".tour-form-status",
    content: "Status: Mantenha 'Em andamento' para poder preencher RDOs e Apontamentos.",
    placement: "right",
  },
  {
    target: ".tour-form-save",
    content: "Tudo pronto! Preencha o nome (obrigatório) e clique em Salvar para entrarmos na sua nova obra.",
    placement: "top",
  },
];

const WAITING_OBRA_STEP: Step[] = [
  {
    target: ".tour-lista-obras",
    content: "Para continuarmos nosso tour, clique em qualquer uma das suas obras na lista para entrarmos no canteiro!",
    placement: "top",
    disableBeacon: true,
  }
];

const OBRA_STEPS: Step[] = [
  {
    target: "body",
    content: "Bem-vindo ao Painel da Obra! Vou te mostrar como operar como um verdadeiro Fiscal de Campo.",
    placement: "center",
    disableBeacon: true,
  },
  {
    target: ".tour-tab-visao",
    content: "Visão Geral: Aqui você acompanha rapidamente os números críticos da obra (Andares, Ocorrências Abertas e Resolvidas).",
    placement: "top",
  },
  {
    target: ".tour-tab-rdo",
    content: "RDO (Relatório Diário de Obra): O coração do canteiro. Registre o clima (automático via satélite!), efetivo de mão de obra e andamento.",
    placement: "top",
  },
  {
    target: ".tour-tab-mapa",
    content: "Plantas e Apontamentos Visuais: Suba as plantas arquitetônicas e adicione 'Pins' de tarefas ou defeitos direto no desenho.",
    placement: "top",
  },
  {
    target: ".tour-tab-fotografia",
    content: "Diário Fotográfico: Onde você centraliza todas as fotos do canteiro. Facilita a geração de relatórios fotográficos em PDF com 1 clique.",
    placement: "top",
  },
  {
    target: ".tour-tab-materiais",
    content: "Materiais: Cadastre e monitore as entregas e estoques no canteiro.",
    placement: "top",
  },
  {
    target: ".tour-tab-laudos",
    content: "Laudos e ARTs: Guarde toda a documentação técnica da obra de forma segura e organizada.",
    placement: "top",
  },
  {
    target: ".tour-tab-sesmt",
    content: "SESMT: Controle de Segurança do Trabalho, EPIs e treinamentos para manter a obra 100% regular.",
    placement: "top",
  },
  {
    target: ".tour-tab-cronograma",
    content: "Gantt e EAP: Defina a Estrutura Analítica do Projeto e acompanhe visualmente o progresso das barras no tempo.",
    placement: "top",
  },
  {
    target: ".tour-obra-config",
    content: "Configurações: Ajuste os dados básicos da obra e convide usuários (Fiscais, Engenheiros e Clientes) para sua equipe.",
    placement: "bottom",
  },
  {
    target: ".tour-tab-menu",
    content: "Menu Completo: O botão mais importante! Clicando nele, você encontra os Módulos Sênior: FVR (Ficha de Verificação), Concretagem, RNC (Não Conformidades) e Medição (BM).",
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
      // Small delay to ensure render
      setTimeout(() => setRun(true), 100);
    } else if (stage === "creating_obra") {
      setSteps(CREATING_OBRA_STEPS);
      setTimeout(() => setRun(true), 500); // 500ms for dialog to open
    } else if (stage === "waiting_obra") {
      setSteps(WAITING_OBRA_STEP);
      setTimeout(() => setRun(true), 100);
    } else if (stage === "obra") {
      // Small delay to allow Obra data to load before attaching tour to elements
      const timer = setTimeout(() => {
        setSteps(OBRA_STEPS);
        setRun(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type, step } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    // Automatically change tabs on Obra steps or auto-click elements
    if (type === EVENTS.STEP_AFTER && stage === "creating_obra") {
      if (step.target === ".tour-form-nova") {
        const btn = document.querySelector(".tour-form-nova") as HTMLElement;
        if (btn) btn.click();
      }
    }

    if (type === EVENTS.STEP_BEFORE && stage === "obra") {
      const match = pathname.match(/\/obras\/([^/]+)/);
      const obraId = match ? match[1] : null;
      if (obraId && typeof step.target === "string") {
        let nextTab = null;
        if (step.target === ".tour-tab-visao") nextTab = "visao";
        else if (step.target === ".tour-tab-rdo") nextTab = "rdo";
        else if (step.target === ".tour-tab-mapa") nextTab = "mapa";
        else if (step.target === ".tour-tab-fotografia") nextTab = "fotografia";
        else if (step.target === ".tour-tab-materiais") nextTab = "materiais";
        else if (step.target === ".tour-tab-laudos") nextTab = "laudos";
        else if (step.target === ".tour-tab-sesmt") nextTab = "sesmt";
        else if (step.target === ".tour-tab-cronograma") nextTab = "cronograma";
        else if (step.target === ".tour-tab-menu") nextTab = "menu";

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
          // Auto-navigate to the first obra!
          const firstObra = document.querySelector(".tour-lista-obras a") as HTMLAnchorElement;
          const href = firstObra?.getAttribute("href");
          if (href) {
            navigate({ to: href } as any);
            setStage("obra");
          } else {
            setStage("waiting_obra"); // Fallback
          }
        } else {
          // Auto-click the Nova Obra button if it's there
          const novaBtn = document.querySelector(".tour-nova-obra") as HTMLElement;
          if (novaBtn) novaBtn.click();
          navigate({ to: "/obras" });
          setStage("creating_obra");
        }
      } else if (stage === "creating_obra") {
        setStage("waiting_obra"); // Wait for user to hit save and trigger pathname change
      } else if (stage === "waiting_obra") {
        setStage("idle"); // If user skipped while waiting, just stop
      } else if (stage === "obra") {
        setStage("finished");
        // Could show a toast here "Tutorial finalizado!"
      }
    }
  };

  return (
    <>
      <Dialog open={stage === "welcome"} onOpenChange={(open) => !open && setStage("idle")}>
        <DialogContent className="sm:max-w-[500px]">
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
                <p className="text-sm text-muted-foreground">Obras, usuários, relatórios fotográficos e efetivo.</p>
              </div>
            </div>
            
            <div className="flex gap-3 items-start">
              <div className="bg-primary/10 p-2 rounded-full mt-1">
                <MapPin className="size-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Apontamentos Visuais</h4>
                <p className="text-sm text-muted-foreground">Faça o upload de plantas baixas e insira PINS para apontar ocorrências, tarefas e não conformidades diretamente no projeto.</p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="bg-primary/10 p-2 rounded-full mt-1">
                <FileCheck2 className="size-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Módulos Sênior</h4>
                <p className="text-sm text-muted-foreground">Relatório Diário de Obras (RDO) com clima automatizado via satélite, Fichas de Verificação (FVR), Boletim de Medição (BM) e Cronogramas.</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setStage("idle")}>Pular Tutorial</Button>
            <Button onClick={() => setStage("dashboard")}>Iniciar Tour Guiado</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
            primaryColor: '#0f172a',
            textColor: '#0f172a',
          },
        }}
        locale={{
          back: "Voltar",
          close: "Fechar",
          last: stage === "dashboard" ? "Entrar na Obra" : "Finalizar Tour",
          next: "Próximo",
          skip: "Pular tour",
        }}
      />
    </>
  );
}
