import { t as cn } from "./utils-C_uf36nf.mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/brito-logo-DZQcPPvx.js
var import_jsx_runtime = require_jsx_runtime();
var sizeClass = {
	sm: "h-10",
	md: "h-12",
	lg: "h-16",
	xl: "h-24"
};
/** Logo da marca (PNG transparente) para header e sidebar. */
function BritoLogo({ className, size = "md", showText = true }) {
	if (!showText) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: "/brito-logo.png",
		alt: "Brito Engenharia e Instalações",
		className: cn("w-auto object-contain shrink-0", sizeClass[size], className)
	});
}
//#endregion
export { BritoLogo as t };
