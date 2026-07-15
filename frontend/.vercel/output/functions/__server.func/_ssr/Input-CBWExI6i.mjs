import { T as require_jsx_runtime } from "../_libs/@heroui/react+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Input-CBWExI6i.js
var import_jsx_runtime = require_jsx_runtime();
function Input({ variant = "zinc", classNames, className = "", icon, endContent, ...props }) {
	const defaultClassNames = {
		zinc: {
			inputWrapper: "bg-zinc-100 hover:bg-zinc-200 focus-within:!bg-zinc-200 border border-zinc-200 shadow-none rounded-full h-10 px-4 transition-colors flex items-center gap-2",
			input: "text-base text-zinc-800 placeholder:text-zinc-500 bg-transparent outline-none flex-1 min-w-0 w-full"
		},
		outline: {
			inputWrapper: "bg-transparent border border-zinc-200 focus-within:border-zinc-300 shadow-none rounded-full h-10 px-4 transition-colors flex items-center gap-2",
			input: "text-base text-zinc-800 placeholder:text-zinc-500 bg-transparent outline-none flex-1 min-w-0 w-full"
		}
	}[variant];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `${defaultClassNames.inputWrapper} ${classNames?.inputWrapper || ""} ${className}`.trim(),
		children: [
			icon,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: `${defaultClassNames.input} ${classNames?.input || ""}`.trim(),
				...props
			}),
			endContent
		]
	});
}
//#endregion
export { Input as t };
