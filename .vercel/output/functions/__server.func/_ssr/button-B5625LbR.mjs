import { o as __toESM } from "../_runtime.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { d as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { D as Slot, F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-B5625LbR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-all duration-300 active:scale-[0.96] active:brightness-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-gradient-to-b from-primary/95 to-primary text-primary-foreground shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),_0_2px_6px_rgba(0,0,0,0.15)] hover:from-primary hover:to-primary/90",
			destructive: "bg-gradient-to-b from-destructive/95 to-destructive text-destructive-foreground shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),_0_2px_6px_rgba(0,0,0,0.15)] hover:from-destructive hover:to-destructive/90",
			outline: "border border-input bg-background/60 backdrop-blur-md shadow-[0_2px_4px_rgba(0,0,0,0.04)] hover:bg-accent/80 hover:text-accent-foreground",
			secondary: "bg-gradient-to-b from-secondary/90 to-secondary text-secondary-foreground shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_2px_4px_rgba(0,0,0,0.05)] hover:from-secondary hover:to-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		type: asChild ? void 0 : type ?? "button",
		...props
	});
});
Button.displayName = "Button";
//#endregion
export { buttonVariants as n, Button as t };
