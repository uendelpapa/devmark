import { E as require_jsx_runtime, a as ListBox, r as Select } from "../_libs/@heroui/react+[...].mjs";
import { S as Funnel } from "../_libs/gravity-ui__icons.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Select-rIFcJ1Uc.js
var import_jsx_runtime = require_jsx_runtime();
function Select$1({ children, selectedKey, onSelectionChange, ariaLabel = "Selecione", placeholder, className = "", triggerClassName = "", variant = "zinc" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
		"aria-label": ariaLabel,
		selectedKey,
		onSelectionChange,
		className: `shrink-0 ${className}`,
		placeholder,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select.Trigger, {
			className: `${{
				zinc: "bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 rounded-full pl-4 shadow-none text-lg text-zinc-700 font-medium w-fit ",
				outline: "",
				primary: "bg-primary/50 hover:bg-primary border border-primary rounded-full pl-4 shadow-none text-lg text-secondary font-medium w-fit cursor-pointer "
			}[variant]} flex items-center gap-1 ${triggerClassName}`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: `size-4 ${{
					zinc: "text-zinc-700",
					outline: "text-zinc-500",
					primary: "text-secondary"
				}[variant]}` }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Value, { className: "text-base font-medium" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Indicator, {})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Popover, {
			className: "bg-white border border-zinc-200 rounded-3xl z-[120] shadow-lg",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox, {
				className: "p-2 max-h-[300px] overflow-y-auto scrollbar-none",
				children
			})
		})]
	});
}
function SelectItem({ id, children, textValue, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.Item, {
		id,
		textValue: textValue || (typeof children === "string" ? children : String(id)),
		className: `text-base ${className}`,
		children
	});
}
//#endregion
export { SelectItem as n, Select$1 as t };
