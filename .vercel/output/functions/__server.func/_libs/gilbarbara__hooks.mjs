import { o as __toESM } from "../_runtime.mjs";
import { d as require_react } from "./@floating-ui/react-dom+[...].mjs";
import { t as equal } from "./gilbarbara__deep-equal.mjs";
//#region node_modules/@gilbarbara/hooks/dist/index.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
function canUseDOM() {
	return !!(typeof window !== "undefined" && window?.document?.createElement);
}
function off(target, ...rest) {
	if (target && target.removeEventListener) target.removeEventListener(...rest);
}
function on(target, ...rest) {
	if (target && target.addEventListener) target.addEventListener(...rest);
}
function useIsFirstRender() {
	const isFirstRender = (0, import_react.useRef)(true);
	if (isFirstRender.current) {
		isFirstRender.current = false;
		return true;
	}
	return isFirstRender.current;
}
function useUpdateEffect(effect, dependencies) {
	const isFirstRender = useIsFirstRender();
	(0, import_react.useEffect)(() => {
		if (!isFirstRender) return effect();
	}, dependencies);
}
canUseDOM() ? import_react.useLayoutEffect : import_react.useEffect;
function usePrevious(state) {
	const ref = (0, import_react.useRef)(void 0);
	(0, import_react.useEffect)(() => {
		ref.current = state;
	});
	return ref.current;
}
canUseDOM();
function useMemoDeepCompare(factory, dependencies) {
	const ref = (0, import_react.useRef)(dependencies);
	if (!equal(dependencies, ref.current)) ref.current = dependencies;
	return (0, import_react.useMemo)(factory, ref.current);
}
function useMount(callback) {
	(0, import_react.useEffect)(() => {
		callback();
	}, []);
}
function useWindowSize(debounce = 0) {
	const [size, setSize] = (0, import_react.useState)({
		height: canUseDOM() ? window.innerHeight : 0,
		width: canUseDOM() ? window.innerWidth : 0
	});
	const timeoutRef = (0, import_react.useRef)(0);
	const handleResize = (0, import_react.useRef)(() => {
		window.clearTimeout(timeoutRef.current);
		timeoutRef.current = window.setTimeout(() => {
			setSize({
				width: window.innerWidth,
				height: window.innerHeight
			});
		}, debounce);
	});
	(0, import_react.useEffect)(() => {
		if (!canUseDOM()) return () => void 0;
		const getSize = handleResize.current;
		setSize({
			height: window.innerHeight,
			width: window.innerWidth
		});
		on(window, "resize", getSize);
		return () => {
			off(window, "resize", getSize);
		};
	}, []);
	return size;
}
//#endregion
export { useWindowSize as a, useUpdateEffect as i, useMount as n, usePrevious as r, useMemoDeepCompare as t };
