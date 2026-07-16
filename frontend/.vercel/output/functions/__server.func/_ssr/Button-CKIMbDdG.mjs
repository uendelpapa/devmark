import { E as require_jsx_runtime, x as Button } from "../_libs/@heroui/react+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Button-CKIMbDdG.js
var import_jsx_runtime = require_jsx_runtime();
function Button$1({ size = "lg", variant = "primary", className = "", children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		size,
		className: `font-medium rounded-full transition-colors ${{
			primary: "bg-primary/50 hover:bg-primary border! border-primary text-secondary shadow-none text-base",
			secondary: "bg-secondary hover:bg-secondary/90 text-primary-light shadow-none text-base",
			zinc: "bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-700 shadow-none text-base",
			onlyIcon: "size-10 bg-secondary text-primary-light cursor-pointer hover:bg-secondary/80 shadow-md shadow-black/40"
		}[variant]} ${className}`,
		...props,
		children
	});
}
//#endregion
export { Button$1 as t };
