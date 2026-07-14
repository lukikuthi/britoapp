import { t as __commonJSMin } from "../_runtime.mjs";
//#region node_modules/react-innertext/index.js
var require_react_innertext = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var hasProps = function(jsx) {
		return Object.prototype.hasOwnProperty.call(jsx, "props");
	};
	var reduceJsxToString = function(previous, current) {
		return previous + innerText(current);
	};
	var innerText = function(jsx) {
		if (jsx === null || typeof jsx === "boolean" || typeof jsx === "undefined") return "";
		if (typeof jsx === "number") return jsx.toString();
		if (typeof jsx === "string") return jsx;
		if (Array.isArray(jsx)) return jsx.reduce(reduceJsxToString, "");
		if (hasProps(jsx) && Object.prototype.hasOwnProperty.call(jsx.props, "children")) return innerText(jsx.props.children);
		return "";
	};
	innerText.default = innerText;
	module.exports = innerText;
}));
//#endregion
export { require_react_innertext as t };
