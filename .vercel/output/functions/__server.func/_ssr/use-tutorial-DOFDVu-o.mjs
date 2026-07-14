import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-tutorial-DOFDVu-o.js
var useTutorial = create((set) => ({
	stage: "idle",
	hasObras: true,
	startTutorial: (hasObras = true) => set({
		stage: "welcome",
		hasObras
	}),
	setStage: (stage) => set({ stage }),
	stopTutorial: () => set({ stage: "idle" })
}));
//#endregion
export { useTutorial as t };
