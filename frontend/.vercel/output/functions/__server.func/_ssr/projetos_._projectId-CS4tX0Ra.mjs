import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { C as Avatar, S as Button, T as require_jsx_runtime, a as ListBox, g as $58246871e4652552$export$6b862160d295c8e, r as Select, t as Calendar } from "../_libs/@heroui/react+[...].mjs";
import { a as deletePayment, f as fetchProjectDetails, n as createPayment, r as createProjectExpense, s as deleteProjectExpense } from "./api-C8eLQxfJ.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { A as EnvelopeOpen, G as ChevronLeft, L as ClockArrowRotateLeft, P as CommentDot, R as Clock, V as CircleDollar, Z as Briefcase, c as Plus, n as TrashBin, t as Xmark, x as Layers } from "../_libs/gravity-ui__icons.mjs";
import { t as Route } from "./projetos_._projectId-CHatJui6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/projetos_._projectId-CS4tX0Ra.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PAYMENT_METHODS = [
	{
		key: "PIX",
		label: "PIX"
	},
	{
		key: "BANK_TRANSFER",
		label: "Transferência Bancária"
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
var PAYMENT_STATUSES = [
	{
		key: "PENDING",
		label: "Pendente"
	},
	{
		key: "PAID",
		label: "Pago"
	},
	{
		key: "OVERDUE",
		label: "Atrasado"
	},
	{
		key: "CANCELED",
		label: "Cancelado"
	}
];
function AddPaymentModal({ isOpen, onClose, onSubmit, projectId, isPending = false, error = null }) {
	const [amount, setAmount] = (0, import_react.useState)("");
	const [dueDate, setDueDate] = (0, import_react.useState)("");
	const [paymentDate, setPaymentDate] = (0, import_react.useState)("");
	const [paymentMethod, setPaymentMethod] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("PENDING");
	const [notes, setNotes] = (0, import_react.useState)("");
	const getCalendarValue = (dateStr) => {
		if (!dateStr) return null;
		try {
			return $58246871e4652552$export$6b862160d295c8e(dateStr.substring(0, 10));
		} catch (e) {
			return null;
		}
	};
	(0, import_react.useEffect)(() => {
		if (!isOpen) {
			setAmount("");
			setDueDate("");
			setPaymentDate("");
			setPaymentMethod("");
			setStatus("PENDING");
			setNotes("");
		}
	}, [isOpen]);
	if (!isOpen) return null;
	const handleSubmit = () => {
		const value = parseFloat(amount);
		if (isNaN(value) || value <= 0 || !dueDate) return;
		onSubmit({
			project_id: projectId,
			amount: value,
			due_date: dueDate,
			payment_date: paymentDate || void 0,
			payment_method: paymentMethod ? paymentMethod : void 0,
			status,
			notes: notes.trim() || void 0
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 bg-black/30 backdrop-blur-sm z-[100]",
			onClick: onClose
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "fixed right-0 top-0 h-full w-[440px] max-w-[100vw] bg-white z-[101] flex flex-col shadow-2xl animate-slide-in-right overflow-x-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-5 pt-5 pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-bold text-secondary",
						children: "Registrar Pagamento"
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
								className: "text-secondary/60 text-xs font-bold uppercase tracking-wider",
								children: "Valor (R$)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: "0",
								step: "0.01",
								value: amount,
								onChange: (e) => setAmount(e.target.value),
								placeholder: "0,00",
								className: "w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-secondary text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/30 transition-all font-semibold"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-secondary/60 text-xs font-bold uppercase tracking-wider",
								children: "Data de Vencimento"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bg-zinc-50 border border-zinc-200 rounded-2xl p-3 flex justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Calendar, {
									"aria-label": "Data de Vencimento",
									value: getCalendarValue(dueDate),
									onChange: (date) => setDueDate(date ? date.toString() : ""),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Calendar.Header, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar.Heading, {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar.NavButton, { slot: "previous" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar.NavButton, { slot: "next" })
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Calendar.Grid, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar.GridHeader, { children: (day) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar.HeaderCell, { children: day }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar.GridBody, { children: (date) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar.Cell, { date }) })] })]
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-secondary/60 text-xs font-bold uppercase tracking-wider",
									children: "Data de Pagamento (Opcional)"
								}), paymentDate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setPaymentDate(""),
									className: "text-xs text-red-500 hover:text-red-700 font-bold bg-transparent border-none cursor-pointer",
									children: "Limpar"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bg-zinc-50 border border-zinc-200 rounded-2xl p-3 flex justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Calendar, {
									"aria-label": "Data de Pagamento",
									value: getCalendarValue(paymentDate),
									onChange: (date) => setPaymentDate(date ? date.toString() : ""),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Calendar.Header, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar.Heading, {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar.NavButton, { slot: "previous" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar.NavButton, { slot: "next" })
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Calendar.Grid, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar.GridHeader, { children: (day) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar.HeaderCell, { children: day }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar.GridBody, { children: (date) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar.Cell, { date }) })] })]
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-secondary/60 text-xs font-bold uppercase tracking-wider",
									children: "Método de Pagamento (Opcional)"
								}), paymentMethod && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setPaymentMethod(""),
									className: "text-xs text-red-500 hover:text-red-700 font-bold bg-transparent border-none cursor-pointer",
									children: "Limpar"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								"aria-label": "Método de Pagamento",
								placeholder: "Selecione um método",
								selectedKey: paymentMethod,
								onSelectionChange: (key) => setPaymentMethod(key),
								className: "w-full",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select.Trigger, {
									className: "bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-secondary text-sm font-medium w-full flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Value, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Indicator, {})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Popover, {
									className: "bg-white border border-zinc-200 rounded-xl shadow-lg z-[120]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox, {
										className: "p-1",
										children: PAYMENT_METHODS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.Item, {
											id: m.key,
											textValue: m.label,
											className: "px-3 py-1.5 text-sm rounded-lg hover:bg-zinc-100 cursor-pointer",
											children: m.label
										}, m.key))
									})
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-secondary/60 text-xs font-bold uppercase tracking-wider",
								children: "Status do Pagamento"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								"aria-label": "Status do Pagamento",
								selectedKey: status,
								onSelectionChange: (key) => setStatus(key),
								className: "w-full",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select.Trigger, {
									className: "bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-secondary text-sm font-medium w-full flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Value, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Indicator, {})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Popover, {
									className: "bg-white border border-zinc-200 rounded-xl shadow-lg z-[120]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox, {
										className: "p-1",
										children: PAYMENT_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.Item, {
											id: s.key,
											textValue: s.label,
											className: "px-3 py-1.5 text-sm rounded-lg hover:bg-zinc-100 cursor-pointer",
											children: s.label
										}, s.key))
									})
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-secondary/60 text-xs font-bold uppercase tracking-wider",
								children: "Observações"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: notes,
								onChange: (e) => setNotes(e.target.value),
								placeholder: "Ex: Primeira parcela, Entrada, etc.",
								rows: 3,
								className: "w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-secondary text-sm outline-none resize-none placeholder:text-zinc-400 focus:border-primary/60 focus:ring-2 focus:ring-primary/30 transition-all"
							})]
						})
					]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-5 pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-medium",
						children: error
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-5 py-4 border-t border-zinc-200",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleSubmit,
						disabled: isPending || !amount || !dueDate,
						className: `w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer border-none ${!amount || !dueDate ? "bg-zinc-200 text-zinc-400 cursor-not-allowed" : "bg-secondary text-white hover:bg-secondary/90 active:scale-[0.98]"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Adicionar Pagamento"]
					})
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
var EXPENSE_CATEGORIES = [
	{
		key: "AI",
		label: "Inteligência Artificial"
	},
	{
		key: "SOFTWARE",
		label: "Software"
	},
	{
		key: "DOMAIN",
		label: "Domínio"
	},
	{
		key: "HOSTING",
		label: "Hospedagem"
	},
	{
		key: "DESIGN",
		label: "Design"
	},
	{
		key: "ADS",
		label: "Anúncios / Ads"
	},
	{
		key: "FREELANCER",
		label: "Freelancer"
	},
	{
		key: "OTHER",
		label: "Outros"
	}
];
function AddExpenseModal({ isOpen, onClose, onSubmit, projectId, isPending = false, error = null }) {
	const [title, setTitle] = (0, import_react.useState)("");
	const [value, setValue] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("OTHER");
	const [description, setDescription] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!isOpen) {
			setTitle("");
			setValue("");
			setCategory("OTHER");
			setDescription("");
		}
	}, [isOpen]);
	if (!isOpen) return null;
	const handleSubmit = () => {
		const numericValue = parseFloat(value);
		if (!title.trim() || isNaN(numericValue) || numericValue <= 0 || !category) return;
		onSubmit({
			project_id: projectId,
			title: title.trim(),
			value: numericValue,
			category,
			description: description.trim() || void 0
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 bg-black/30 backdrop-blur-sm z-[100]",
			onClick: onClose
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "fixed right-0 top-0 h-full w-[440px] max-w-[100vw] bg-white z-[101] flex flex-col shadow-2xl animate-slide-in-right overflow-x-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-5 pt-5 pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-bold text-secondary",
						children: "Registrar Gasto"
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
								className: "text-secondary/60 text-xs font-bold uppercase tracking-wider",
								children: "Título do Gasto"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: title,
								onChange: (e) => setTitle(e.target.value),
								placeholder: "Ex: Assinatura Vercel Pro, Licença Figma",
								className: "w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-secondary text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/30 transition-all font-medium"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-secondary/60 text-xs font-bold uppercase tracking-wider",
								children: "Valor (R$)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: "0",
								step: "0.01",
								value,
								onChange: (e) => setValue(e.target.value),
								placeholder: "0,00",
								className: "w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-secondary text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/30 transition-all font-semibold"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-secondary/60 text-xs font-bold uppercase tracking-wider",
								children: "Categoria"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								"aria-label": "Categoria",
								selectedKey: category,
								onSelectionChange: (key) => setCategory(key),
								className: "w-full",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select.Trigger, {
									className: "bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-secondary text-sm font-medium w-full flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Value, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Indicator, {})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Popover, {
									className: "bg-white border border-zinc-200 rounded-xl shadow-lg z-[120]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox, {
										className: "p-1",
										children: EXPENSE_CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.Item, {
											id: c.key,
											textValue: c.label,
											className: "px-3 py-1.5 text-sm rounded-lg hover:bg-zinc-100 cursor-pointer",
											children: c.label
										}, c.key))
									})
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-secondary/60 text-xs font-bold uppercase tracking-wider",
								children: "Descrição (Opcional)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: description,
								onChange: (e) => setDescription(e.target.value),
								placeholder: "Adicione detalhes sobre esta despesa...",
								rows: 4,
								className: "w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-secondary text-sm outline-none resize-none placeholder:text-zinc-400 focus:border-primary/60 focus:ring-2 focus:ring-primary/30 transition-all"
							})]
						})
					]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-5 pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-medium",
						children: error
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-5 py-4 border-t border-zinc-200",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleSubmit,
						disabled: isPending || !title.trim() || !value || !category,
						className: `w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer border-none ${!title.trim() || !value || !category ? "bg-zinc-200 text-zinc-400 cursor-not-allowed" : "bg-secondary text-white hover:bg-secondary/90 active:scale-[0.98]"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Adicionar Gasto"]
					})
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
function TaskRingsChart({ data, size = 170 }) {
	const total = data.reduce((acc, d) => acc + d.value, 0);
	const activeData = data.filter((d) => d.value > 0);
	if (total === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col gap-2",
			children: data.slice(0, 4).map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-2.5 rounded-full bg-zinc-200" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-secondary/40 font-medium",
					children: d.label
				})]
			}, i))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
			width: size,
			height: size,
			viewBox: `0 0 ${size} ${size}`,
			children: [
				0,
				1,
				2
			].map((i) => {
				const r = size / 2 - 14 - i * 18;
				const circumference = 2 * Math.PI * r;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: size / 2,
					cy: size / 2,
					r,
					fill: "none",
					stroke: "#e4e4e7",
					strokeWidth: 13,
					strokeLinecap: "round",
					strokeDasharray: `${circumference * .75} ${circumference}`,
					transform: `rotate(-90 ${size / 2} ${size / 2})`
				}, i);
			})
		})]
	});
	const ringData = activeData.slice(0, 4);
	const center = size / 2;
	const strokeWidth = 13;
	const gap = 18;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col gap-2.5",
			children: ringData.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "size-2.5 rounded-full",
					style: { backgroundColor: d.color }
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-secondary/70 font-semibold",
					children: d.label
				})]
			}, i))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
			width: size,
			height: size,
			viewBox: `0 0 ${size} ${size}`,
			children: ringData.map((d, i) => {
				const r = center - 14 - i * gap;
				const circumference = 2 * Math.PI * r;
				const fraction = d.value / total;
				const dashLength = circumference * Math.min(.92, Math.max(.08, fraction));
				const gapLength = circumference - dashLength;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: center,
					cy: center,
					r,
					fill: "none",
					stroke: "#e4e4e7",
					strokeWidth,
					opacity: .5
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: center,
					cy: center,
					r,
					fill: "none",
					stroke: d.color,
					strokeWidth,
					strokeLinecap: "round",
					strokeDasharray: `${dashLength} ${gapLength}`,
					transform: `rotate(-90 ${center} ${center})`,
					className: "transition-all duration-700"
				})] }, i);
			})
		})]
	});
}
function ProjectDetailsPage() {
	const { projectId } = Route.useParams();
	const [isPaymentModalOpen, setIsPaymentModalOpen] = (0, import_react.useState)(false);
	const [isExpenseModalOpen, setIsExpenseModalOpen] = (0, import_react.useState)(false);
	const queryClient = useQueryClient();
	const { data: project, isLoading } = useQuery({
		queryKey: ["projectDetails", projectId],
		queryFn: () => fetchProjectDetails(projectId),
		enabled: !!projectId
	});
	const { mutate: handleCreatePayment, isPending: isCreatingPayment, error: paymentError } = useMutation({
		mutationFn: createPayment,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["projectDetails", projectId] });
			queryClient.invalidateQueries({ queryKey: ["dashboard"] });
			setIsPaymentModalOpen(false);
		}
	});
	const { mutate: handleDeletePayment } = useMutation({
		mutationFn: deletePayment,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["projectDetails", projectId] });
			queryClient.invalidateQueries({ queryKey: ["dashboard"] });
		}
	});
	const { mutate: handleCreateExpense, isPending: isCreatingExpense, error: expenseError } = useMutation({
		mutationFn: createProjectExpense,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["projectDetails", projectId] });
			queryClient.invalidateQueries({ queryKey: ["dashboard"] });
			setIsExpenseModalOpen(false);
		}
	});
	const { mutate: handleDeleteExpense } = useMutation({
		mutationFn: deleteProjectExpense,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["projectDetails", projectId] });
			queryClient.invalidateQueries({ queryKey: ["dashboard"] });
		}
	});
	const formatCurrency = (val) => {
		const num = parseFloat(val);
		if (isNaN(num)) return "R$ 0,00";
		return num.toLocaleString("pt-BR", {
			style: "currency",
			currency: "BRL"
		});
	};
	const formatDate = (dateStr) => {
		if (!dateStr) return "";
		return new Date(dateStr).toLocaleDateString("pt-BR", { timeZone: "UTC" });
	};
	const getCategoryInfo = (cat) => {
		switch (cat) {
			case "AI": return {
				label: "Inteligência Artificial",
				bg: "bg-indigo-100",
				color: "text-indigo-700"
			};
			case "SOFTWARE": return {
				label: "Software",
				bg: "bg-blue-100",
				color: "text-blue-700"
			};
			case "DOMAIN": return {
				label: "Domínio",
				bg: "bg-amber-100",
				color: "text-amber-700"
			};
			case "HOSTING": return {
				label: "Hospedagem",
				bg: "bg-purple-100",
				color: "text-purple-700"
			};
			case "DESIGN": return {
				label: "Design",
				bg: "bg-pink-100",
				color: "text-pink-700"
			};
			case "ADS": return {
				label: "Anúncios / Ads",
				bg: "bg-red-100",
				color: "text-red-700"
			};
			case "FREELANCER": return {
				label: "Freelancer",
				bg: "bg-teal-100",
				color: "text-teal-700"
			};
			default: return {
				label: "Outros",
				bg: "bg-zinc-200",
				color: "text-secondary/70"
			};
		}
	};
	const getPriorityInfo = (pri) => {
		switch (pri) {
			case "LOW": return {
				label: "Baixa",
				bg: "bg-zinc-200 text-zinc-900"
			};
			case "MEDIUM": return {
				label: "Média",
				bg: "bg-sky-200 text-zinc-900"
			};
			case "HIGH": return {
				label: "Alta",
				bg: "bg-orange-200 text-zinc-900"
			};
			case "URGENT": return {
				label: "Urgente",
				bg: "bg-red-200 text-zinc-900"
			};
			default: return {
				label: pri,
				bg: "bg-zinc-200 text-zinc-900"
			};
		}
	};
	const getStatusInfo = (status) => {
		switch (status) {
			case "PLANNING": return {
				label: "Planejamento",
				bg: "bg-blue-200 text-zinc-900"
			};
			case "IN_PROGRESS": return {
				label: "Em Andamento",
				bg: "bg-amber-200 text-zinc-900"
			};
			case "WAITING_CLIENT": return {
				label: "Aguardando Cliente",
				bg: "bg-purple-200 text-zinc-900"
			};
			case "REVIEW": return {
				label: "Revisão",
				bg: "bg-indigo-200 text-zinc-900"
			};
			case "COMPLETED": return {
				label: "Concluído",
				bg: "bg-emerald-200 text-zinc-900"
			};
			case "CANCELED": return {
				label: "Cancelado",
				bg: "bg-rose-200 text-zinc-900"
			};
			default: return {
				label: status,
				bg: "bg-zinc-200 text-zinc-900"
			};
		}
	};
	const getErrorMessage = (err) => {
		if (!err) return null;
		return Array.isArray(err.response?.data?.message) ? err.response.data.message.join(", ") : err.response?.data?.message || err.message;
	};
	const allTasks = [...project?.tasks || []].sort((a, b) => {
		const STATUS_ORDER = {
			IN_PROGRESS: 1,
			REVIEW: 2,
			PENDING: 3,
			COMPLETED: 4,
			CANCELED: 5
		};
		return (STATUS_ORDER[a.status] || 99) - (STATUS_ORDER[b.status] || 99);
	});
	const pieData = (0, import_react.useMemo)(() => {
		if (!project?.tasks) return [];
		const counts = {
			PENDING: 0,
			IN_PROGRESS: 0,
			REVIEW: 0,
			COMPLETED: 0,
			CANCELED: 0
		};
		project.tasks.forEach((t) => {
			counts[t.status] = (counts[t.status] || 0) + 1;
		});
		return [
			{
				label: "To do",
				value: counts.PENDING,
				color: "#d4d4d8"
			},
			{
				label: "Fazendo",
				value: counts.IN_PROGRESS,
				color: "#fde68a"
			},
			{
				label: "Revisão",
				value: counts.REVIEW,
				color: "#bfdbfe"
			},
			{
				label: "Feito",
				value: counts.COMPLETED,
				color: "#a7f3d0"
			},
			{
				label: "Cancelado",
				value: counts.CANCELED,
				color: "#fecdd3"
			}
		];
	}, [project?.tasks]);
	const totalWorkedHours = project?.tasks.reduce((acc, t) => acc + (t.worked_hours || 0), 0) || 0;
	const startDate = new Date(project?.created_at || Date.now());
	const endDate = project?.expected_delivery_date ? new Date(project.expected_delivery_date) : /* @__PURE__ */ new Date();
	const diffTime = Math.max(0, endDate.getTime() - startDate.getTime());
	const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
	const totalExpenses = project?.project_expenses.reduce((acc, exp) => acc + parseFloat(exp.value), 0) || 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white rounded-[24px] p-6 overflow-y-auto min-w-0 h-fit max-h-[calc(100vh-100px)] scrollbar-none flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => window.history.back(),
						size: "lg",
						className: "size-9 text-secondary bg-primary/50 transition-colors cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-medium tracking-tight text-secondary leading-none",
						children: isLoading ? "Carregando..." : project?.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 flex-wrap",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "bg-zinc-100 text-secondary font-medium px-2 py-1 rounded-full text-xs flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "size-3.5" }), isLoading ? "..." : project?.client.name]
							}),
							!isLoading && project?.status && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `px-2 py-1 rounded-full text-xs font-semibold ${getStatusInfo(project.status).bg}`,
								children: getStatusInfo(project.status).label
							}),
							!isLoading && project?.area && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "bg-zinc-100 text-secondary font-medium px-2 py-1 rounded-full text-xs",
								children: project.area === "DEVELOPER" ? "Desenvolvimento" : "Marketing"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-medium text-secondary text-lg",
						children: "Sobre o projeto"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-secondary leading-relaxed",
						children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "block h-12 bg-zinc-100 animate-pulse rounded-xl w-full" }) : project?.description || "Nenhuma descrição detalhada foi fornecida para este projeto. Adicione uma descrição para manter a equipe."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "shrink-0 bg-primary/50 rounded-2xl px-3 py-2 flex items-center gap-2 text-secondary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-col text-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-medium",
								children: [
									"Duração atual ",
									diffDays,
									" dias"
								]
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "shrink-0 bg-primary/50 rounded-2xl px-3 py-2 flex items-center gap-2 text-secondary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClockArrowRotateLeft, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-col text-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-medium",
								children: [
									"Total trabalhado ",
									totalWorkedHours,
									"h"
								]
							})
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-3 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-2 bg-zinc-100 rounded-2xl p-4 flex flex-col gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-zinc-800",
								children: "Quadros de tarefas"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs font-semibold text-primary-light bg-secondary px-2 py-1 rounded-full",
								children: [
									allTasks.length,
									" ",
									allTasks.length !== 1 ? "tarefas" : "tarefa"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", {}),
						allTasks.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-col gap-1",
							children: allTasks.map((task) => {
								const priInfo = getPriorityInfo(task.priority);
								const stInfo = getStatusInfo(task.status);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between px-4 py-3 w-full min-w-0 bg-primary/50 rounded-xl",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col gap-1 min-w-0 pr-4 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-secondary text-[14px] truncate",
											children: task.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1 flex-wrap",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `text-[10px] font-semibold px-2 py-0.5 rounded-full ${stInfo.bg}`,
													children: stInfo.label
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `text-[10px] font-semibold px-2 py-0.5 rounded-full ${priInfo.bg}`,
													children: priInfo.label
												}),
												task.due_date && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-secondary/50 text-[11px] font-medium",
													children: ["Entrega: ", formatDate(task.due_date)]
												})
											]
										})]
									}), task.worked_hours !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col items-end shrink-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-bold text-secondary/40 uppercase tracking-wider",
											children: "Horas"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[14px] font-bold text-secondary",
											children: [task.worked_hours, "h"]
										})]
									})]
								}, task.id);
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 flex flex-col items-center justify-center py-10 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-8 text-secondary/25" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-secondary/50 text-sm font-medium text-center",
								children: [
									"O projeto ainda não possui tarefas.",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									"Crie tarefas no painel principal."
								]
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bg-primary/50 rounded-2xl p-4 flex items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskRingsChart, {
						data: pieData,
						size: 170
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-medium tracking-tight text-secondary leading-none",
					children: "Saúde Financeira"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-secondary",
					children: "Controle de orçamentos, faturamentos e despesas ativas."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-primary/50 p-6 rounded-3xl flex flex-col gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-secondary font-semibold",
								children: "Orçamento Total"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleDollar, { className: "size-4 text-secondary" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-3xl font-medium text-secondary",
							children: formatCurrency(project?.project_value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-zinc-100 p-6 rounded-3xl flex flex-col gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-secondary font-semibold",
								children: "Faturado"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleDollar, { className: "size-4 text-secondary" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-3xl font-medium text-secondary",
							children: formatCurrency(project?.amount_received)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-zinc-100 p-6 rounded-3xl flex flex-col gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-secondary font-semibold",
								children: "A Receber"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleDollar, { className: "size-4 text-secondary" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-3xl font-medium text-secondary",
							children: formatCurrency(project?.amount_pending)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-zinc-100 p-6 rounded-3xl flex flex-col gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-secondary font-semibold",
								children: "Despesas"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleDollar, { className: "size-4 text-secondary" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-3xl font-medium text-secondary",
							children: formatCurrency(totalExpenses)
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-zinc-100 rounded-2xl p-4 flex flex-col gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-secondary text-sm",
								children: "Histórico de parcelas"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								onClick: () => setIsPaymentModalOpen(true),
								className: "flex items-center gap-1.5 bg-primary/50 hover:bg-primary text-secondary font-medium text-xs rounded-full px-4 py-2 cursor-pointer border-none transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3" }), "Cadastrar Parcela"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", {}),
						project?.payments && project.payments.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-col gap-1",
							children: project.payments.map((payment) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between py-3 border-b border-secondary/5 last:border-0 w-full min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col gap-1 min-w-0 pr-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 flex-wrap",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-bold text-secondary text-base",
													children: formatCurrency(payment.amount)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `text-[10px] font-semibold px-2 py-0.5 rounded-full ${payment.status === "PAID" ? "bg-emerald-200 text-zinc-900" : payment.status === "OVERDUE" ? "bg-rose-200 text-zinc-900" : payment.status === "CANCELED" ? "bg-zinc-200 text-zinc-900" : "bg-amber-200 text-zinc-900"}`,
													children: payment.status === "PAID" ? "Pago" : payment.status === "OVERDUE" ? "Atrasado" : payment.status === "CANCELED" ? "Cancelado" : "Pendente"
												}),
												payment.payment_method && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] bg-zinc-200 text-zinc-900 font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider",
													children: payment.payment_method
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-secondary/50 text-xs font-semibold",
											children: [
												"Vence: ",
												formatDate(payment.due_date),
												payment.payment_date && ` • Pago: ${formatDate(payment.payment_date)}`
											]
										}),
										payment.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-secondary/50 text-[11px] font-medium italic mt-0.5 truncate max-w-sm",
											children: [
												"\"",
												payment.notes,
												"\""
											]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: () => {
										if (confirm("Deseja realmente excluir esta parcela?")) handleDeletePayment(payment.id);
									},
									className: "bg-transparent hover:bg-red-50 text-secondary/40 hover:text-red-500 rounded-full p-2 border-none cursor-pointer transition-colors shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrashBin, { className: "size-4" })
								})]
							}, payment.id))
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "py-10 flex flex-col items-center justify-center gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-secondary/40 text-sm font-medium",
								children: "Nenhuma parcela cadastrada."
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-zinc-100 rounded-2xl p-4 flex flex-col gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-secondary text-sm",
								children: "Registro de despesas"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								onClick: () => setIsExpenseModalOpen(true),
								className: "flex items-center gap-1.5 bg-primary/50 hover:bg-primary text-secondary font-medium text-xs rounded-full px-4 py-2 cursor-pointer border-none transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3" }), "Lançar Gasto"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", {}),
						project?.project_expenses && project.project_expenses.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-col gap-1",
							children: project.project_expenses.map((expense) => {
								const catInfo = getCategoryInfo(expense.category);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between py-3 border-b border-secondary/5 last:border-0 w-full min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col gap-1 min-w-0 pr-2 flex-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2 flex-wrap",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-bold text-secondary text-base truncate",
													children: expense.title
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `text-[10px] font-semibold px-2 py-0.5 rounded-full ${catInfo.bg} ${catInfo.color}`,
													children: catInfo.label
												})]
											}),
											expense.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-secondary/50 text-xs font-semibold truncate max-w-sm",
												children: expense.description
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-secondary/40 text-[10px] font-medium",
												children: new Date(expense.created_at).toLocaleDateString("pt-BR")
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 shrink-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-bold text-red-600 text-base",
											children: ["-", formatCurrency(expense.value)]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											onClick: () => {
												if (confirm("Deseja excluir este lançamento?")) handleDeleteExpense(expense.id);
											},
											className: "bg-transparent hover:bg-red-50 text-secondary/40 hover:text-red-500 rounded-full p-2 border-none cursor-pointer transition-colors shrink-0",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrashBin, { className: "size-4" })
										})]
									})]
								}, expense.id);
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "py-10 flex flex-col items-center justify-center gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-secondary/40 text-sm font-medium",
								children: "Nenhum gasto registrado."
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-medium text-secondary text-lg mb-4",
					children: "Cliente"
				}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-16 bg-zinc-100 animate-pulse rounded-2xl w-full" }) : project?.client ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
							className: "size-12 shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar.Image, {
								alt: project.client.name,
								src: `https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/${project.client.name.length % 2 === 0 ? "orange" : "blue"}.jpg`
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar.Fallback, { children: project.client.name.charAt(0).toUpperCase() })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-secondary text-xl",
								children: project.client.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-zinc-600 text-base",
								children: project.client.email || "Sem email cadastrado"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => window.location.href = `mailto:${project.client.email}`,
							isDisabled: !project.client.email,
							size: "lg",
							className: "flex items-center text-base h-10 gap-2 bg-primary/50 hover:bg-primary text-secondary font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnvelopeOpen, { className: "size-4" }), "Enviar e-mail"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => window.open(`https://wa.me/`, "_blank"),
							size: "lg",
							className: "flex items-center text-base h-10 gap-2 bg-primary/50 hover:bg-primary text-secondary font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommentDot, { className: "size-4" }), "WhatsApp"]
						})]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-secondary/60 text-sm",
					children: "Cliente não vinculado."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddPaymentModal, {
				isOpen: isPaymentModalOpen,
				onClose: () => setIsPaymentModalOpen(false),
				onSubmit: (data) => handleCreatePayment(data),
				projectId,
				isPending: isCreatingPayment,
				error: getErrorMessage(paymentError)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddExpenseModal, {
				isOpen: isExpenseModalOpen,
				onClose: () => setIsExpenseModalOpen(false),
				onSubmit: (data) => handleCreateExpense(data),
				projectId,
				isPending: isCreatingExpense,
				error: getErrorMessage(expenseError)
			})
		]
	});
}
//#endregion
export { ProjectDetailsPage as component };
