import { h as createFileRoute, m as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/obras._obraId-CvUFqvMC.js
var $$splitComponentImporter = () => import("./obras._obraId-T_RCMnkC.mjs");
var Route = createFileRoute("/_authenticated/obras/$obraId")({
	head: () => ({ meta: [{ title: "Obra — BRITO ENGENHARIA" }] }),
	validateSearch: (s) => ({ tab: [
		"visao",
		"analytics",
		"mapa",
		"rdo",
		"fotografia",
		"menu",
		"materiais",
		"laudos",
		"sesmt",
		"cronograma",
		"concretagem",
		"fvr",
		"rnc",
		"bm",
		"medicao"
	].includes(String(s.tab)) ? s.tab : "visao" }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
