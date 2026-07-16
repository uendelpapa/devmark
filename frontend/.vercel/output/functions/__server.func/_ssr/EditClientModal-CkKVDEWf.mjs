import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { E as require_jsx_runtime } from "../_libs/@heroui/react+[...].mjs";
import { W as Check, t as Xmark } from "../_libs/gravity-ui__icons.mjs";
import { n as SelectItem, t as Select$1 } from "./Select-rIFcJ1Uc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/EditClientModal-CkKVDEWf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CLIENT_STATUSES = [
	{
		key: "LEAD",
		label: "Lead"
	},
	{
		key: "NEGOTIATING",
		label: "Em Negociação"
	},
	{
		key: "ACTIVE",
		label: "Ativo"
	},
	{
		key: "INACTIVE",
		label: "Inativo"
	},
	{
		key: "LOST",
		label: "Perdido"
	}
];
var COMM_METHODS = [
	{
		key: "WHATSAPP",
		label: "WhatsApp"
	},
	{
		key: "EMAIL",
		label: "E-mail"
	},
	{
		key: "PHONE",
		label: "Telefone"
	},
	{
		key: "MEETING",
		label: "Reunião"
	}
];
var PAYMENT_METHODS = [
	{
		key: "PIX",
		label: "PIX"
	},
	{
		key: "BANK_TRANSFER",
		label: "Boleto / Transferência"
	},
	{
		key: "CREDIT_CARD",
		label: "Cartão de Crédito"
	},
	{
		key: "CASH",
		label: "Dinheiro"
	}
];
function EditClientModal({ isOpen, onClose, onSubmit, onDelete, client, isPending = false, error = null }) {
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [companyName, setCompanyName] = (0, import_react.useState)("");
	const [documentVal, setDocumentVal] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("ACTIVE");
	const [comm, setComm] = (0, import_react.useState)("WHATSAPP");
	const [payment, setPayment] = (0, import_react.useState)("PIX");
	(0, import_react.useEffect)(() => {
		if (isOpen && client) {
			setName(client.name || "");
			setEmail(client.email || "");
			setCompanyName(client.company_name || "");
			setDocumentVal(client.document || "");
			setPhone(client.phone || "");
			setStatus(client.status);
			setComm(client.preferred_communication);
			setPayment(client.preferred_payment_method);
		}
	}, [isOpen, client]);
	if (!isOpen || !client) return null;
	const handleSubmit = () => {
		if (!name || !email) return;
		onSubmit(client.id, {
			name: name.trim(),
			email: email.trim(),
			company_name: companyName.trim(),
			document: documentVal.trim(),
			phone: phone.trim(),
			status,
			preferred_communication: comm,
			preferred_payment_method: payment
		});
	};
	const labelClass = "text-secondary/60 text-xs font-bold uppercase tracking-wider";
	const inputClass = "w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-secondary text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/30 transition-all font-semibold";
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
						children: "Editar Cliente"
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
								children: "Nome Completo"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: name,
								onChange: (e) => setName(e.target.value),
								placeholder: "Ex: John Smith",
								className: inputClass
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: labelClass,
								children: "E-mail"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "email",
								value: email,
								onChange: (e) => setEmail(e.target.value),
								placeholder: "Ex: john@acme.com",
								className: inputClass
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: labelClass,
								children: "Nome da Empresa"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: companyName,
								onChange: (e) => setCompanyName(e.target.value),
								placeholder: "Ex: Acme Corp",
								className: inputClass
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: labelClass,
								children: "CNPJ / CPF"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: documentVal,
								onChange: (e) => setDocumentVal(e.target.value),
								placeholder: "Ex: 12.345.678/0001-90",
								className: inputClass
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: labelClass,
								children: "Telefone"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: phone,
								onChange: (e) => setPhone(e.target.value),
								placeholder: "Ex: (11) 99999-9999",
								className: inputClass
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: labelClass,
								children: "Status do Cliente"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select$1, {
								ariaLabel: "Status do Cliente",
								selectedKey: status,
								onSelectionChange: (key) => setStatus(key),
								className: "w-full",
								children: CLIENT_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									id: s.key,
									children: s.label
								}, s.key))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: labelClass,
								children: "Comunicação Preferencial"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select$1, {
								ariaLabel: "Comunicação Preferencial",
								selectedKey: comm,
								onSelectionChange: (key) => setComm(key),
								className: "w-full",
								children: COMM_METHODS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									id: m.key,
									children: m.label
								}, m.key))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: labelClass,
								children: "Método de Pagamento Preferido"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select$1, {
								ariaLabel: "Método de Pagamento Preferido",
								selectedKey: payment,
								onSelectionChange: (key) => setPayment(key),
								className: "w-full",
								children: PAYMENT_METHODS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									id: m.key,
									children: m.label
								}, m.key))
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
						disabled: isPending || !name || !email,
						className: `w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer border-none ${!name || !email ? "bg-zinc-200 text-zinc-400 cursor-not-allowed" : "bg-secondary text-white hover:bg-secondary/90 active:scale-[0.98]"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }), "Salvar Alterações"]
					}), onDelete && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							if (confirm("Tem certeza que deseja excluir este cliente?")) onDelete(client.id);
						},
						disabled: isPending,
						className: "w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm bg-red-50 text-red-600 hover:bg-red-100 transition-all cursor-pointer border-none active:scale-[0.98]",
						children: "Excluir Cliente"
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
export { EditClientModal as t };
