import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { T as require_jsx_runtime } from "../_libs/@heroui/react+[...].mjs";
import { g as fetchClients } from "./api-CPpqugVW.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { W as Check, t as Xmark } from "../_libs/gravity-ui__icons.mjs";
import { n as SelectItem, t as Select$1 } from "./Select-DN4KSzcs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ServiceModal-Cg_yFeJf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SERVICE_STATUSES = [
	{
		key: "PENDING",
		label: "Pendente"
	},
	{
		key: "IN_PROGRESS",
		label: "Em Andamento"
	},
	{
		key: "REVIEW",
		label: "Em Revisão"
	},
	{
		key: "COMPLETED",
		label: "Concluído"
	},
	{
		key: "CANCELED",
		label: "Cancelado"
	}
];
function ServiceModal({ isOpen, onClose, onSubmit, onDelete, service, clientId, isPending = false, error = null }) {
	const [title, setTitle] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [selectedClientId, setSelectedClientId] = (0, import_react.useState)("");
	const [value, setValue] = (0, import_react.useState)("");
	const [amountReceived, setAmountReceived] = (0, import_react.useState)("");
	const [dueDate, setDueDate] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("PENDING");
	const { data: clients = [] } = useQuery({
		queryKey: ["clients"],
		queryFn: fetchClients,
		enabled: isOpen
	});
	(0, import_react.useEffect)(() => {
		if (isOpen) if (service) {
			setTitle(service.title || "");
			setDescription(service.description || "");
			setSelectedClientId(service.client_id || "");
			setValue(service.value ? String(service.value) : "");
			setAmountReceived(service.amount_received ? String(service.amount_received) : "");
			setDueDate(service.due_date ? new Date(service.due_date).toISOString().split("T")[0] : "");
			setStatus(service.status || "PENDING");
		} else {
			setTitle("");
			setDescription("");
			setSelectedClientId(clientId || "");
			setValue("");
			setAmountReceived("");
			setDueDate("");
			setStatus("PENDING");
		}
	}, [
		isOpen,
		service,
		clientId
	]);
	if (!isOpen) return null;
	const handleSubmit = () => {
		if (!title || !selectedClientId) return;
		onSubmit({
			title: title.trim(),
			description: description.trim(),
			client_id: selectedClientId,
			value: value ? parseFloat(value) : 0,
			amount_received: amountReceived ? parseFloat(amountReceived) : 0,
			due_date: dueDate ? new Date(dueDate).toISOString() : void 0,
			status
		});
	};
	const labelClass = "text-secondary/60 text-xs font-bold uppercase tracking-wider";
	const inputClass = "w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-secondary text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/30 transition-all font-semibold";
	const currentClient = clients.find((c) => c.id === selectedClientId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 bg-black/30 backdrop-blur-sm z-[100]",
			onClick: onClose
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "fixed right-0 top-0 h-full w-[440px] max-w-[100vw] bg-white z-[101] flex flex-col shadow-2xl animate-slide-in-right overflow-x-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-5 pt-5 pb-3 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-bold text-secondary",
						children: service ? "Editar Serviço Avulso" : "Registrar Serviço Avulso"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "size-8 flex items-center justify-center rounded-xl hover:bg-zinc-100 transition-colors cursor-pointer bg-transparent border-none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Xmark, { className: "size-4 text-secondary/60" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 overflow-y-auto overflow-x-hidden px-5 pb-4 space-y-5 scrollbar-none",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: labelClass,
								children: "Título do Serviço"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: title,
								onChange: (e) => setTitle(e.target.value),
								placeholder: "Ex: Edição de Vídeo do Reels",
								className: inputClass
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: labelClass,
								children: "Descrição / Notas"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: description,
								onChange: (e) => setDescription(e.target.value),
								placeholder: "Adicione observações sobre o serviço...",
								className: `${inputClass} min-h-[80px] resize-y`
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: labelClass,
								children: "Cliente"
							}), clientId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-full bg-zinc-100 border border-zinc-200 rounded-xl px-4 py-2.5 text-zinc-500 text-sm font-semibold",
								children: currentClient?.name || "Cliente Selecionado"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select$1, {
								ariaLabel: "Selecionar Cliente",
								selectedKey: selectedClientId,
								onSelectionChange: (key) => setSelectedClientId(key),
								className: "w-full",
								children: clients.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
									id: c.id,
									children: [
										c.name,
										" ",
										c.company_name ? `(${c.company_name})` : ""
									]
								}, c.id))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: labelClass,
									children: "Valor Cobrado (R$)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									step: "0.01",
									min: "0",
									value,
									onChange: (e) => setValue(e.target.value),
									placeholder: "0.00",
									className: inputClass
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: labelClass,
									children: "Valor Recebido (R$)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									step: "0.01",
									min: "0",
									value: amountReceived,
									onChange: (e) => setAmountReceived(e.target.value),
									placeholder: "0.00",
									className: inputClass
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: labelClass,
								children: "Data de Entrega / Prazo"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								value: dueDate,
								onChange: (e) => setDueDate(e.target.value),
								className: inputClass
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: labelClass,
								children: "Status"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select$1, {
								ariaLabel: "Status do Serviço",
								selectedKey: status,
								onSelectionChange: (key) => setStatus(key),
								className: "w-full",
								children: SERVICE_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									id: s.key,
									children: s.label
								}, s.key))
							})]
						})
					]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-5 pb-2 shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-medium",
						children: error
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-5 py-4 border-t border-zinc-200 shrink-0 flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleSubmit,
						disabled: isPending || !title || !selectedClientId,
						className: `w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer border-none ${!title || !selectedClientId ? "bg-zinc-200 text-zinc-400 cursor-not-allowed" : "bg-secondary text-white hover:bg-secondary/90 active:scale-[0.98]"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }), service ? "Salvar Alterações" : "Salvar Serviço"]
					}), service && onDelete && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							if (confirm("Tem certeza que deseja excluir este serviço avulso?")) onDelete(service.id);
						},
						disabled: isPending,
						className: "w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm bg-red-50 text-red-600 hover:bg-red-100 transition-all cursor-pointer border-none active:scale-[0.98]",
						children: "Excluir Serviço"
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      ` })
	] });
}
//#endregion
export { ServiceModal as t };
