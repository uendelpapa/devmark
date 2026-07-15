import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { T as require_jsx_runtime } from "../_libs/@heroui/react+[...].mjs";
import { O as updateService, b as fetchServices, f as deleteService, g as fetchClients, o as createService } from "./api-CPpqugVW.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { b as Layers, s as Plus } from "../_libs/gravity-ui__icons.mjs";
import { t as Button$1 } from "./Button-CKIMbDdG.mjs";
import { n as SelectItem, t as Select$1 } from "./Select-DN4KSzcs.mjs";
import { t as ServiceModal } from "./ServiceModal-Cg_yFeJf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/servicos-CKWuQzYj.js
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
var formatCurrency = (val) => {
	const num = parseFloat(val);
	if (isNaN(num)) return "R$ 0,00";
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL"
	}).format(num);
};
var getServiceStatusInfo = (status) => {
	switch (status) {
		case "PENDING": return {
			label: "Pendente",
			bg: "bg-zinc-200 text-zinc-800"
		};
		case "IN_PROGRESS": return {
			label: "Em Andamento",
			bg: "bg-amber-200 text-amber-955"
		};
		case "REVIEW": return {
			label: "Em Revisão",
			bg: "bg-purple-200 text-purple-955"
		};
		case "COMPLETED": return {
			label: "Concluído",
			bg: "bg-primary/50 text-secondary"
		};
		case "CANCELED": return {
			label: "Cancelado",
			bg: "bg-rose-200 text-rose-955"
		};
		default: return {
			label: status,
			bg: "bg-zinc-100 text-zinc-600"
		};
	}
};
function Servicos() {
	const queryClient = useQueryClient();
	const [isModalOpen, setIsModalOpen] = (0, import_react.useState)(false);
	const [selectedService, setSelectedService] = (0, import_react.useState)(null);
	const [selectedStatus, setSelectedStatus] = (0, import_react.useState)("ALL");
	const [selectedClient, setSelectedClient] = (0, import_react.useState)("ALL");
	const { data: services = [], isLoading } = useQuery({
		queryKey: ["services"],
		queryFn: () => fetchServices()
	});
	const { data: clients = [] } = useQuery({
		queryKey: ["clients"],
		queryFn: fetchClients
	});
	const filteredServices = services.filter((service) => {
		const matchesStatus = selectedStatus === "ALL" || service.status === selectedStatus;
		const matchesClient = selectedClient === "ALL" || service.client_id === selectedClient;
		return matchesStatus && matchesClient;
	});
	const createMutation = useMutation({
		mutationFn: createService,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["services"] });
			queryClient.invalidateQueries({ queryKey: ["dashboard"] });
			setIsModalOpen(false);
		}
	});
	const updateMutation = useMutation({
		mutationFn: ({ id, data }) => updateService(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["services"] });
			queryClient.invalidateQueries({ queryKey: ["dashboard"] });
			setIsModalOpen(false);
		}
	});
	const deleteMutation = useMutation({
		mutationFn: deleteService,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["services"] });
			queryClient.invalidateQueries({ queryKey: ["dashboard"] });
			setIsModalOpen(false);
		}
	});
	const getErrorMessage = (err) => {
		if (!err) return null;
		return Array.isArray(err.response?.data?.message) ? err.response.data.message.join(", ") : err.response?.data?.message || err.message;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white rounded-[24px] p-6 overflow-y-auto min-w-0 h-fit max-h-[calc(100vh-100px)] scrollbar-none flex flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-medium tracking-tight text-secondary leading-none",
					children: "Serviços Avulsos"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-4 shrink-0 flex-wrap items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select$1, {
							ariaLabel: "Filtrar por Status",
							selectedKey: selectedStatus,
							onSelectionChange: (key) => setSelectedStatus(key),
							variant: "zinc",
							triggerClassName: "text-sm font-semibold w-fit py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								id: "ALL",
								textValue: "Todos os Status",
								children: "Todos os Status"
							}), SERVICE_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								id: s.key,
								textValue: s.label,
								children: s.label
							}, s.key))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select$1, {
							ariaLabel: "Filtrar por Cliente",
							selectedKey: selectedClient,
							onSelectionChange: (key) => setSelectedClient(key),
							variant: "zinc",
							triggerClassName: "text-sm font-semibold w-fit py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								id: "ALL",
								textValue: "Todos os Clientes",
								children: "Todos os Clientes"
							}), clients.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								id: c.id,
								textValue: c.name,
								children: c.name
							}, c.id))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button$1, {
							size: "lg",
							onPress: () => {
								setSelectedService(null);
								setIsModalOpen(true);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
								className: "stroke-[2.5]",
								width: 16,
								height: 16
							}), "Novo Serviço"]
						})
					]
				})]
			}),
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5",
				children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-zinc-50 border border-zinc-200 rounded-[24px] p-6 h-48 animate-pulse" }, i))
			}) : filteredServices.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5",
				children: filteredServices.map((service) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					onClick: () => {
						setSelectedService(service);
						setIsModalOpen(true);
					},
					className: "bg-zinc-100 border border-zinc-200 rounded-[24px] p-6 transition-all duration-300 group flex flex-col gap-4 cursor-pointer hover:border-primary/40 relative overflow-hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 left-0 w-1.5 h-full bg-primary/0 group-hover:bg-backpage transition-colors" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] uppercase font-bold text-zinc-500 tracking-wider",
								children: service.client?.name || "Cliente Oculto"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-bold text-zinc-800 transition-colors line-clamp-2 text-base leading-snug",
								children: service.title
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `text-xs font-semibold tracking-wider px-2.5 py-1 rounded-full w-fit ${getServiceStatusInfo(service.status).bg}`,
									children: getServiceStatusInfo(service.status).label
								}),
								service.due_date && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-zinc-500 font-medium",
									children: ["Prazo: ", new Date(service.due_date).toLocaleDateString("pt-BR")]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between pt-4 border-t border-zinc-100/80 mt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] uppercase font-semibold text-zinc-800 tracking-wider mb-0.5",
											children: "Valor"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm font-bold text-zinc-800",
											children: formatCurrency(service.value)
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col text-right",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] uppercase font-semibold text-secondary tracking-wider mb-0.5",
											children: "Recebido"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm font-bold text-secondary",
											children: formatCurrency(service.amount_received)
										})]
									})]
								})
							]
						})
					]
				}, service.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-12 text-center text-secondary/50 font-medium bg-zinc-50 border border-dashed border-zinc-200 rounded-[20px] flex flex-col items-center justify-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-10 text-zinc-300" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Nenhum serviço avulso encontrado para os filtros selecionados." })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceModal, {
				isOpen: isModalOpen,
				onClose: () => setIsModalOpen(false),
				onSubmit: (data) => {
					if (selectedService) updateMutation.mutate({
						id: selectedService.id,
						data
					});
					else createMutation.mutate(data);
				},
				onDelete: (id) => deleteMutation.mutate(id),
				service: selectedService,
				isPending: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
				error: getErrorMessage(createMutation.error || updateMutation.error || deleteMutation.error)
			})
		]
	});
}
//#endregion
export { Servicos as component };
