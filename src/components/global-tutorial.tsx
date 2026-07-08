import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Joyride, CallBackProps, STATUS, Step, ACTIONS, EVENTS } from "react-joyride";
import { useTutorial } from "@/hooks/use-tutorial";

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
    content: "RDO (Relatório Diário de Obra): O coração do canteiro. Registre o clima (automático via satélite!), efetivo de mão de obra e anexe fotos que formarão o diário fotográfico.",
    placement: "top",
  },
  {
    target: ".tour-tab-mapa",
    content: "Plantas e Apontamentos Visuais: Suba as plantas arquitetônicas e adicione 'Pins' de tarefas ou defeitos direto no desenho.",
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
  const { stage, setStage } = useTutorial();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  
  const [steps, setSteps] = useState<Step[]>([]);
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  // Monitor route changes to advance tutorial stage automatically
  useEffect(() => {
    if (stage === "waiting_obra" && pathname.includes("/obras/")) {
      // User entered an obra!
      setStage("obra");
    }
  }, [pathname, stage, setStage]);

  // Sync state with Joyride config
  useEffect(() => {
    if (stage === "idle" || stage === "finished") {
      setRun(false);
      return;
    }

    if (stage === "dashboard") {
      setSteps(DASHBOARD_STEPS);
      setStepIndex(0);
      setRun(true);
    } else if (stage === "waiting_obra") {
      setSteps(WAITING_OBRA_STEP);
      setStepIndex(0);
      setRun(true);
    } else if (stage === "obra") {
      // Small delay to allow Obra data to load before attaching tour to elements
      const timer = setTimeout(() => {
        setSteps(OBRA_STEPS);
        setStepIndex(0);
        setRun(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type, action, index } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    // Handle step changes safely
    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1));
    }

    // Handle finish
    if (finishedStatuses.includes(status)) {
      if (stage === "dashboard") {
        setStage("waiting_obra"); // Move to waiting for obra click
      } else if (stage === "waiting_obra") {
        setStage("idle"); // If user skipped while waiting, just stop
      } else if (stage === "obra") {
        setStage("finished");
        // Could show a toast here "Tutorial finalizado!"
      }
    }
  };

  return (
    <Joyride
      callback={handleJoyrideCallback}
      continuous
      hideCloseButton
      run={run}
      stepIndex={stepIndex}
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
  );
}
