import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-8Lt4JWZh.mjs";
import { d as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { H as HardHat, Z as Compass, j as MapPin, q as FileCheckCorner, w as PartyPopper } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-BGAiVp67.mjs";
import { t as Button } from "./button-B5625LbR.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { M as redirect, _ as Link, b as useRouter, c as HeadContent, f as createRouter, g as createRootRouteWithContext, h as createFileRoute, m as lazyRouteComponent, p as Outlet, s as Scripts, u as useRouterState, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useAuth, t as AuthProvider } from "./use-auth-D2UOjB9-.mjs";
import { t as useTutorial } from "./use-tutorial-DOFDVu-o.mjs";
import { t as Route$8 } from "./obras._obraId-CvUFqvMC.mjs";
import { t as Route$9 } from "./obras._obraId.rdos._rdoId-CkWTuRSh.mjs";
import { t as Route$10 } from "./obras._obraId.torres._torreId.andares._andarId-D7ab6LSH.mjs";
import { n as AnimatePresence, t as motion } from "../_libs/framer-motion.mjs";
import { n as Joyride, r as STATUS, t as EVENTS } from "../_libs/react-joyride+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BlgsMwi0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-CAhksQU9.css";
function reportAppError(error, context = {}) {
	if (typeof window === "undefined") return;
	console.error("[App Error]", error, context);
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function AppLoadingScreen({ ready = false, onHidden }) {
	const [visible, setVisible] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		if (ready) setVisible(false);
	}, [ready]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
		onExitComplete: onHidden,
		children: visible && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
			className: "fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white overflow-hidden shadow-2xl",
			initial: {
				opacity: 0,
				y: 0
			},
			animate: {
				opacity: 1,
				y: 0
			},
			exit: { y: "-100%" },
			transition: {
				duration: .7,
				ease: [
					.22,
					1,
					.36,
					1
				]
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				className: "relative z-10 flex flex-col items-center justify-center h-full w-full",
				initial: {
					opacity: 0,
					scale: .95
				},
				animate: {
					opacity: 1,
					scale: 1
				},
				transition: {
					duration: .5,
					delay: .2
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/gif.gif",
					alt: "Carregando...",
					className: "h-64 md:h-96 w-auto max-w-[90vw] object-contain"
				})
			})
		}, "splash")
	});
}
var DASHBOARD_STEPS = [
	{
		target: "body",
		content: "Bem-vindo ao Brito Builder Log! Sou seu assistente e vou te guiar por todas as funcionalidades da plataforma.",
		placement: "center",
		disableBeacon: true
	},
	{
		target: ".tour-nova-obra",
		content: "Botão de Ações Rápidas: Clique aqui para registrar uma nova obra ou adicionar um novo usuário à plataforma.",
		placement: "top"
	},
	{
		target: ".tour-lista-obras",
		content: "Painel de Obras: Todas as suas obras ativas aparecem aqui. Você vê o status, a cidade, e quantos apontamentos estão abertos — tudo sem precisar entrar na obra. Ao finalizar, vou entrar automaticamente na primeira obra para continuar o tutorial.",
		placement: "top"
	}
];
var DASHBOARD_EMPTY_STEPS = [{
	target: "body",
	content: "Bem-vindo ao Brito Builder Log! Você ainda não tem nenhuma obra cadastrada. Vamos criar sua primeira agora!",
	placement: "center",
	disableBeacon: true
}, {
	target: ".tour-nova-obra",
	content: "Clique neste botão para abrir o formulário de criação. Ao avançar, eu vou navegar até a tela de obras para você!",
	placement: "top"
}];
var CREATING_OBRA_STEPS = [
	{
		target: "body",
		content: "Esta é a tela de Gestão de Obras. Aqui você cadastra e gerencia todos os seus canteiros. Vamos criar uma obra agora!",
		placement: "center",
		disableBeacon: true
	},
	{
		target: ".tour-form-nova",
		content: "Clique em 'Nova Obra' para abrir o formulário. Ao avançar, eu abro automaticamente para você!",
		placement: "bottom"
	},
	{
		target: ".tour-form-nome",
		content: "📝 Nome da Obra: Dê um nome descritivo — pode ser o nome do edifício, do condomínio ou do cliente. Este é o único campo obrigatório.",
		placement: "right"
	},
	{
		target: ".tour-form-latlng",
		content: "📍 Latitude e Longitude: MUITO IMPORTANTE! O sistema usa essas coordenadas para buscar automaticamente as condições climáticas via satélite quando você cria um RDO. Sem elas, o clima não é preenchido automaticamente.",
		placement: "right"
	},
	{
		target: ".tour-form-status",
		content: "🔄 Status: Mantenha 'Em andamento' para poder criar RDOs e apontamentos. Obras 'Pausadas' ou 'Concluídas' ficam bloqueadas para edição.",
		placement: "right"
	},
	{
		target: ".tour-form-save",
		content: "✅ Preencha pelo menos o nome e clique em Salvar. O sistema vai te redirecionar automaticamente para dentro da nova obra!",
		placement: "top"
	}
];
var WAITING_OBRA_STEP = [{
	target: ".tour-lista-obras",
	content: "Agora clique em qualquer obra da lista para entrarmos no canteiro e continuarmos o tutorial!",
	placement: "top",
	disableBeacon: true
}];
var OBRA_STEPS = [
	{
		target: "body",
		content: "🏗️ Bem-vindo ao Painel da Obra! Aqui é onde toda a mágica acontece. Vou te mostrar CADA seção em detalhes. O sistema vai trocar de aba automaticamente para você!",
		placement: "center",
		disableBeacon: true
	},
	{
		target: ".tour-tab-visao",
		content: "📊 VISÃO GERAL: Resume toda a obra em números. Você vê a quantidade de Torres, Andares, Apontamentos Abertos e Resolvidos. Clique nos cards para navegar diretamente para a seção correspondente.",
		placement: "top"
	},
	{
		target: ".tour-tab-rdo",
		content: "📋 RDO (Relatório Diário de Obra): O documento mais importante do canteiro! Registre clima, efetivo, atividades e fotos. E a novidade: quando os 5 dias da semana (Segunda a Sexta) estiverem preenchidos, o sistema libera automaticamente a criação de um RDO SEMANAL consolidado!",
		placement: "top"
	},
	{
		target: ".tour-tab-medicao",
		content: "📐 MEDIÇÃO DE CAMPO: Importe a planilha de orçamento do escritório e vá para o campo dar baixa nas quantidades executadas. O sistema calcula automaticamente o Saldo restante e o % de Progresso. Você pode configurar a obra como 'Escopo Parcial' ou 'Global' nas Configurações.",
		placement: "top"
	},
	{
		target: ".tour-tab-mapa",
		content: "🗺️ PLANTAS E APONTAMENTOS: Faça upload das plantas (agora com remoção e substituição facilitadas) e adicione PINS interativos direto no desenho para marcar pendências. Exporte tudo em PDF.",
		placement: "top"
	},
	{
		target: ".tour-tab-fotografia",
		content: "📸 DIÁRIO FOTOGRÁFICO: Centralize todas as fotos do canteiro com título e descrição. Ideal para montar relatórios fotográficos em PDF — útil para medições, vistorias de entrega e acompanhamento de clientes.",
		placement: "top"
	},
	{
		target: ".tour-tab-materiais",
		content: "📦 MATERIAIS: Gerencie o controle de recebimento de materiais no canteiro. Cadastre itens esperados, registre entregas, e acompanhe o que já chegou vs. o que falta. Integra com o módulo FVR (Ficha de Verificação) no Menu.",
		placement: "top"
	},
	{
		target: ".tour-tab-laudos",
		content: "📄 LAUDOS E ARTs: Guarde toda a documentação técnica da obra em um só lugar — laudos estruturais, ARTs de responsabilidade técnica, relatórios de sondagem, etc. Faça upload de qualquer arquivo.",
		placement: "top"
	},
	{
		target: ".tour-tab-sesmt",
		content: "⛑️ SESMT (Segurança do Trabalho): Controle de DDS (Diálogos Diários de Segurança) e entrega de EPIs com ficha assinada. Mantenha sua obra 100% regularizada com o Ministério do Trabalho.",
		placement: "top"
	},
	{
		target: ".tour-tab-cronograma",
		content: "📅 CRONOGRAMA GANTT: Monte a EAP (Estrutura Analítica do Projeto) com os pacotes de trabalho e visualize o progresso em barras de Gantt. Essencial para controle de prazos e medições de empreiteiros.",
		placement: "top"
	},
	{
		target: ".tour-obra-config",
		content: "⚙️ CONFIGURAÇÕES: Edite os dados da obra (nome, endereço, coordenadas), gerencie a Equipe (convide Engenheiros, Fiscais e Clientes) e configure a Estrutura (Torres, Andares e Grupos).",
		placement: "bottom"
	},
	{
		target: ".tour-tab-menu",
		content: "📂 MENU COMPLETO: Aqui ficam os Módulos Avançados que não cabem na barra inferior: Concretagem (controle de caminhões-betoneira), FVR (Ficha de Verificação de Recebimento), RNC (Relatório de Não Conformidade) e BM (Boletim de Medição Física). Explore cada um!",
		placement: "top"
	}
];
function GlobalTutorial() {
	const { stage, setStage, hasObras } = useTutorial();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const navigate = useNavigate();
	const [steps, setSteps] = (0, import_react.useState)([]);
	const [run, setRun] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (stage === "waiting_obra" && pathname.includes("/obras/")) setStage("obra");
	}, [
		pathname,
		stage,
		setStage
	]);
	(0, import_react.useEffect)(() => {
		setRun(false);
		if (stage === "idle" || stage === "finished" || stage === "welcome") return;
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
	const handleJoyrideCallback = (data) => {
		const { status, type, step } = data;
		const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
		if (type === EVENTS.STEP_AFTER && stage === "creating_obra") {
			if (step.target === ".tour-form-nova") {
				const btn = document.querySelector(".tour-form-nova");
				if (btn) btn.click();
			}
		}
		if (type === EVENTS.STEP_BEFORE && stage === "obra") {
			const match = pathname.match(/\/obras\/([^/]+)/);
			const obraId = match ? match[1] : null;
			if (obraId && typeof step.target === "string") {
				let nextTab = null;
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
				if (nextTab) navigate({
					to: "/obras/$obraId",
					params: { obraId },
					search: { tab: nextTab },
					replace: true
				});
			}
		}
		if (finishedStatuses.includes(status)) {
			if (stage === "dashboard") if (hasObras) {
				const href = document.querySelector(".tour-lista-obras a")?.getAttribute("href");
				if (href) {
					navigate({ to: href });
					setStage("obra");
				} else setStage("waiting_obra");
			} else {
				const novaBtn = document.querySelector(".tour-nova-obra");
				if (novaBtn) novaBtn.click();
				navigate({ to: "/obras" });
				setStage("creating_obra");
			}
			else if (stage === "creating_obra") setStage("waiting_obra");
			else if (stage === "waiting_obra") setStage("idle");
			else if (stage === "obra") {
				setStage("finished");
				toast.success("🎉 Tutorial finalizado! Agora você conhece todas as funcionalidades. Explore à vontade!", { duration: 6e3 });
			}
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: stage === "welcome",
			onOpenChange: (open) => !open && setStage("idle"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "sm:max-w-[520px]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "text-2xl font-bold flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "size-6 text-primary" }), "Bem-vindo ao Brito Builder"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
						className: "text-base mt-2",
						children: "Este sistema foi feito por engenheiros para engenheiros. Aqui você vai gerenciar suas obras de ponta a ponta sem complicação."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 py-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-3 items-start",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "bg-primary/10 p-2 rounded-full mt-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HardHat, { className: "size-5 text-primary" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-semibold text-foreground",
									children: "Gestão de Canteiro"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: "Obras, RDOs diários com clima automático, equipe e controle fotográfico."
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-3 items-start",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "bg-primary/10 p-2 rounded-full mt-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-5 text-primary" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-semibold text-foreground",
									children: "Apontamentos Visuais"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: "Faça upload de plantas e insira PINS para marcar defeitos, tarefas e não conformidades direto no projeto."
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-3 items-start",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "bg-primary/10 p-2 rounded-full mt-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheckCorner, { className: "size-5 text-primary" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-semibold text-foreground",
									children: "Módulos Avançados"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: "Concretagem, FVR, RNC, Boletim de Medição, SESMT, Cronograma Gantt e muito mais."
								})] })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setStage("idle"),
						children: "Pular Tutorial"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => setStage("dashboard"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "size-4 mr-2" }), "Iniciar Tour Guiado"]
					})] })
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: stage === "finished",
			onOpenChange: (open) => !open && setStage("idle"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "sm:max-w-[450px] text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-4 py-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bg-primary/10 p-4 rounded-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartyPopper, { className: "size-10 text-primary" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "text-2xl font-bold",
							children: "Tutorial Finalizado! 🎉"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-base",
							children: "Agora você conhece todas as funcionalidades do Brito Builder Log. Explore cada módulo à vontade e construa obras extraordinárias!"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Dica: use o botão \"Tutorial da Obra\" dentro de qualquer obra para rever as explicações a qualquer momento."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, {
					className: "sm:justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => setStage("idle"),
						children: "Começar a Usar! 🚀"
					})
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Joyride, {
			callback: handleJoyrideCallback,
			continuous: true,
			hideCloseButton: true,
			run,
			scrollToFirstStep: true,
			showProgress: true,
			showSkipButton: true,
			steps,
			styles: {
				options: {
					zIndex: 1e4,
					primaryColor: "#0f172a",
					textColor: "#0f172a"
				},
				tooltip: {
					borderRadius: 12,
					padding: 20
				},
				tooltipContent: {
					fontSize: 14,
					lineHeight: 1.6
				}
			},
			locale: {
				back: "Voltar",
				close: "Fechar",
				last: stage === "dashboard" ? "Entrar na Obra →" : "Finalizar Tour 🎉",
				next: "Próximo →",
				skip: "Pular tour"
			}
		}, stage)
	] });
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportAppError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$7 = createRootRouteWithContext()({
	ssr: false,
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover"
			},
			{
				name: "theme-color",
				content: "#002b5b"
			},
			{ title: "BRITO ENGENHARIA — Gestão de Obras" },
			{
				name: "description",
				content: "Sistema de gestão de obras da BRITO ENGENHARIA: apontamentos visuais em planta, fotos e relatórios."
			},
			{
				name: "author",
				content: "BRITO ENGENHARIA"
			},
			{
				property: "og:title",
				content: "BRITO ENGENHARIA — Gestão de Obras"
			},
			{
				property: "og:description",
				content: "Sistema de gestão de obras com apontamentos visuais em planta."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/manifest.webmanifest"
			},
			{
				rel: "icon",
				href: "/favicon.svg",
				type: "image/svg+xml"
			},
			{
				rel: "apple-touch-icon",
				href: "/icon-192.png"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "pt-BR",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$7.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppBoot, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlobalTutorial, {})
		] })
	});
}
function AppBoot() {
	const { loading: authLoading } = useAuth();
	const [minTimeDone, setMinTimeDone] = (0, import_react.useState)(false);
	const [showSplash, setShowSplash] = (0, import_react.useState)(true);
	const isAuthRoute = useRouter().state.location.pathname === "/auth";
	(0, import_react.useEffect)(() => {
		const timer = setTimeout(() => setMinTimeDone(true), isAuthRoute ? 2600 : 1600);
		return () => clearTimeout(timer);
	}, [isAuthRoute]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [showSplash && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppLoadingScreen, {
		ready: minTimeDone && !authLoading,
		progressDuration: isAuthRoute ? 2400 : 1600,
		onHidden: () => setShowSplash(false)
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})] });
}
var $$splitComponentImporter$5 = () => import("./auth-Dwn52xqd.mjs");
var Route$6 = createFileRoute("/auth")({
	ssr: false,
	head: () => ({ meta: [{ title: "Entrar — BRITO ENGENHARIA" }, {
		name: "description",
		content: "Acesso restrito ao sistema de Diário de Obra da BRITO ENGENHARIA."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./route-CwAnxFlj.mjs");
var Route$5 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		const { data } = await supabase.auth.getUser();
		if (!data.user) throw redirect({ to: "/auth" });
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var Route$4 = createFileRoute("/")({ beforeLoad: () => {
	throw redirect({ to: "/dashboard" });
} });
var $$splitComponentImporter$3 = () => import("./dashboard-DqpZX0KM.mjs");
var Route$3 = createFileRoute("/_authenticated/dashboard")({
	head: () => ({ meta: [{ title: "Obras — BRITO ENGENHARIA" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./obras.index-CihDGula.mjs");
var Route$2 = createFileRoute("/_authenticated/obras/")({
	head: () => ({ meta: [{ title: "Obras — BRITO ENGENHARIA" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./admin.usuarios-D7S6hgXl.mjs");
var Route$1 = createFileRoute("/_authenticated/admin/usuarios")({
	head: () => ({ meta: [{ title: "Usuários — BRITO ENGENHARIA" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./admin.audit-BuE6wve-.mjs");
var Route = createFileRoute("/_authenticated/admin/audit")({
	head: () => ({ meta: [{ title: "Audit Log — BRITO ENGENHARIA" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var AuthRoute = Route$6.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$7
});
var AuthenticatedRouteRoute = Route$5.update({
	id: "/_authenticated",
	getParentRoute: () => Route$7
});
var IndexRoute = Route$4.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$7
});
var AuthenticatedDashboardRoute = Route$3.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedObrasIndexRoute = Route$2.update({
	id: "/obras/",
	path: "/obras/",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedObrasObraIdRoute = Route$8.update({
	id: "/obras/$obraId",
	path: "/obras/$obraId",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAdminUsuariosRoute = Route$1.update({
	id: "/admin/usuarios",
	path: "/admin/usuarios",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAdminAuditRoute = Route.update({
	id: "/admin/audit",
	path: "/admin/audit",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedObrasObraIdRouteChildren = {
	AuthenticatedObrasObraIdRdosRdoIdRoute: Route$9.update({
		id: "/rdos/$rdoId",
		path: "/rdos/$rdoId",
		getParentRoute: () => AuthenticatedObrasObraIdRoute
	}),
	AuthenticatedObrasObraIdTorresTorreIdAndaresAndarIdRoute: Route$10.update({
		id: "/torres/$torreId/andares/$andarId",
		path: "/torres/$torreId/andares/$andarId",
		getParentRoute: () => AuthenticatedObrasObraIdRoute
	})
};
var AuthenticatedRouteRouteChildren = {
	AuthenticatedDashboardRoute,
	AuthenticatedAdminAuditRoute,
	AuthenticatedAdminUsuariosRoute,
	AuthenticatedObrasObraIdRoute: AuthenticatedObrasObraIdRoute._addFileChildren(AuthenticatedObrasObraIdRouteChildren),
	AuthenticatedObrasIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	AuthRoute
};
var routeTree = Route$7._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		basepath: "/",
		context: { queryClient: new QueryClient({ defaultOptions: { queries: {
			staleTime: 3e4,
			refetchOnWindowFocus: false
		} } }) },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
