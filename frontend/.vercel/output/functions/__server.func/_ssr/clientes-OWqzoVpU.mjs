import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { C as Avatar, S as Button, T as require_jsx_runtime, a as ListBox, b as Card, r as Select } from "../_libs/@heroui/react+[...].mjs";
import { u as fetchClients, y as updateClient } from "./api-CpUZCTJ1.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { B as CircleInfo, M as Ellipsis, R as Clock, c as Plus, q as Check, t as Xmark } from "../_libs/gravity-ui__icons.mjs";
import { p as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/clientes-OWqzoVpU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ClientCard({ client, onEdit }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "flex flex-row items-center justify-between p-4 bg-zinc-100 hover:bg-zinc-200/60 rounded-[16px] border-none shadow-none transition-colors group text-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
				className: "size-8 shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar.Image, {
					alt: client.name,
					src: `https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/${client.name.length % 2 === 0 ? "orange" : "blue"}.jpg`
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar.Fallback, { children: client.name.charAt(0) })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-1 flex-col min-w-0 max-w-32",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-zinc-800 truncate leading-tight",
					children: client.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-zinc-800 truncate",
					children: client.email
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [client.hasPendingPayment ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "bg-[#EAB308] text-white px-1.5 py-0.5 rounded-full w-fit items-center justify-center font-medium",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1.5 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3" }), "Pagamento pendênte"]
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "bg-zinc-400 text-white px-2.5 py-0.5 rounded-full inline-flex items-center justify-center font-medium",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1.5 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleInfo, { className: "size-3" }), "Sem pendências"]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				isIconOnly: true,
				size: "sm",
				onPress: () => onEdit?.(client),
				className: "text-zinc-400 hover:text-zinc-700 bg-transparent hover:bg-zinc-200 size-6 rounded-full cursor-pointer transition-colors border-none p-0 flex items-center justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-4" })
			})]
		})]
	});
}
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
function EditClientModal({ isOpen, onClose, onSubmit, client, isPending = false, error = null }) {
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
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								"aria-label": "Status do Cliente",
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
										children: CLIENT_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.Item, {
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
								className: labelClass,
								children: "Comunicação Preferencial"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								"aria-label": "Comunicação Preferencial",
								selectedKey: comm,
								onSelectionChange: (key) => setComm(key),
								className: "w-full",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select.Trigger, {
									className: "bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-secondary text-sm font-medium w-full flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Value, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Indicator, {})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Popover, {
									className: "bg-white border border-zinc-200 rounded-xl shadow-lg z-[120]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox, {
										className: "p-1",
										children: COMM_METHODS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.Item, {
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
								className: labelClass,
								children: "Método de Pagamento Preferido"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								"aria-label": "Método de Pagamento Preferido",
								selectedKey: payment,
								onSelectionChange: (key) => setPayment(key),
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-5 py-4 border-t border-zinc-200 shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleSubmit,
						disabled: isPending || !name || !email,
						className: `w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer border-none ${!name || !email ? "bg-zinc-200 text-zinc-400 cursor-not-allowed" : "bg-secondary text-white hover:bg-secondary/90 active:scale-[0.98]"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }), "Salvar Alterações"]
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
function Clientes() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { data: clients = [], isLoading } = useQuery({
		queryKey: ["clients"],
		queryFn: fetchClients
	});
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [editingClient, setEditingClient] = (0, import_react.useState)(null);
	const [isEditModalOpen, setIsEditModalOpen] = (0, import_react.useState)(false);
	const { mutate: handleUpdateClient, isPending: isUpdatingClient, error: updateError } = useMutation({
		mutationFn: ({ id, data }) => updateClient(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["clients"] });
			queryClient.invalidateQueries({ queryKey: ["dashboard"] });
			setIsEditModalOpen(false);
			setEditingClient(null);
		}
	});
	const getErrorMessage = (err) => {
		if (!err) return null;
		return Array.isArray(err.response?.data?.message) ? err.response.data.message.join(", ") : err.response?.data?.message || err.message;
	};
	const filteredClients = clients.filter((client) => {
		if (filter === "pending") return client.hasPendingPayment;
		if (filter === "paid") return !client.hasPendingPayment;
		return true;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white rounded-[24px] p-6 overflow-y-auto min-w-0 h-fit max-h-[calc(100vh-100px)] scrollbar-none flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between items-center shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-medium tracking-tight text-secondary leading-none",
					children: "Clientes"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						selectedKey: filter,
						onSelectionChange: (key) => setFilter(key),
						className: "shrink-0 rounded-[12px]",
						"aria-label": "Filtrar clientes",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select.Trigger, {
							className: "bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-full pl-3 py-2.5 text-[14px] border-none outline-none cursor-pointer flex items-center justify-between transition-colors shadow-none select-none",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Value, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Indicator, {})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Popover, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ListBox, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.Item, {
								id: "all",
								textValue: "Filtro: Todos",
								children: "Filtro: Todos"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.Item, {
								id: "pending",
								textValue: "Com pendências",
								children: "Com pendências"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.Item, {
								id: "paid",
								textValue: "Sem pendências",
								children: "Sem pendências"
							})
						] }) })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onPress: () => navigate({ to: "/clientes/novo" }),
						className: "bg-primary/50 hover:bg-primary text-secondary font-bold rounded-full px-5 h-10 border-none text-[14px] transition-colors flex items-center gap-2 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Novo Cliente"]
					})]
				})]
			}),
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 flex-1 min-h-0",
				children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "animate-pulse bg-zinc-100 rounded-[24px] h-[88px] w-full" }, i))
			}) : filteredClients.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col items-center justify-center flex-1 py-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-zinc-400 text-lg font-medium",
					children: "Nenhum cliente encontrado."
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 overflow-y-auto scrollbar-none pb-4",
				children: filteredClients.map((client) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientCard, {
					client,
					onEdit: (c) => {
						setEditingClient(c);
						setIsEditModalOpen(true);
					}
				}, client.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditClientModal, {
				isOpen: isEditModalOpen,
				onClose: () => {
					setIsEditModalOpen(false);
					setEditingClient(null);
				},
				onSubmit: (id, data) => handleUpdateClient({
					id,
					data
				}),
				client: editingClient,
				isPending: isUpdatingClient,
				error: getErrorMessage(updateError)
			})
		]
	});
}
//#endregion
export { Clientes as component };
