import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { S as Avatar, T as require_jsx_runtime, x as Button, y as Card } from "../_libs/@heroui/react+[...].mjs";
import { E as updateClient, c as deleteClient, g as fetchClients } from "./api-CPpqugVW.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { A as Ellipsis, F as Clock, L as CircleInfo, h as Magnifier, s as Plus } from "../_libs/gravity-ui__icons.mjs";
import { t as Button$1 } from "./Button-CKIMbDdG.mjs";
import { p as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Input } from "./Input-CBWExI6i.mjs";
import { n as SelectItem, t as Select$1 } from "./Select-DN4KSzcs.mjs";
import { t as EditClientModal } from "./EditClientModal-7Uu_fsex.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/clientes-DgKZK65r.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ClientCard({ client, onEdit }) {
	const navigate = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		onClick: () => navigate({
			to: "/clientes/$clientId",
			params: { clientId: client.id }
		}),
		className: "relative overflow-hidden flex flex-row items-center justify-between gap-3 p-4 bg-zinc-100 hover:bg-zinc-200 rounded-[16px] border border-zinc-200 shadow-none duration-300 ease-in-out transition-colors group text-zinc-800 cursor-pointer",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 items-center gap-2 min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
				className: "size-8 shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar.Image, {
					alt: client.name,
					src: `https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/${client.name.length % 2 === 0 ? "orange" : "blue"}.jpg`
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar.Fallback, { children: client.name.charAt(0) })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-start flex-1 min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "w-full text-xs text-zinc-800 font-medium truncate",
					children: client.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "w-full text-xs text-zinc-400 truncate",
					children: client.email
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 shrink-0",
			children: [client.hasPendingPayment ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "bg-[#EAB308] text-white px-1.5 py-0.5 rounded-full w-fit items-center justify-center font-medium",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center text-nowrap gap-1.5 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3 shrink-0" }), "Pagamento pendente"]
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "bg-zinc-400 text-white px-2.5 py-0.5 rounded-full inline-flex items-center justify-center font-medium",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center text-nowrap gap-1.5 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleInfo, { className: "size-3 shrink-0" }), "Sem pendências"]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				isIconOnly: true,
				size: "sm",
				onPress: () => onEdit?.(client),
				onClick: (e) => e.stopPropagation(),
				className: "text-zinc-400 hover:text-zinc-700 bg-transparent hover:bg-zinc-200 size-6 shrink-0 rounded-full cursor-pointer transition-colors border-none p-0 flex items-center justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-4 shrink-0" })
			})]
		})]
	});
}
function Clientes() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { data: clients = [], isLoading } = useQuery({
		queryKey: ["clients"],
		queryFn: fetchClients
	});
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
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
	const { mutate: handleDeleteClient, isPending: isDeletingClient, error: deleteError } = useMutation({
		mutationFn: (id) => deleteClient(id),
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
		if (filter === "pending" && !client.hasPendingPayment) return false;
		if (filter === "paid" && client.hasPendingPayment) return false;
		if (searchQuery.trim() !== "") {
			const q = searchQuery.toLowerCase();
			if (!client.name.toLowerCase().includes(q) && !client.email.toLowerCase().includes(q)) return false;
		}
		return true;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white rounded-[24px] p-6 overflow-y-auto min-w-0 h-fit max-h-[calc(100vh-100px)] scrollbar-none flex flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between items-center shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-medium tracking-tight text-secondary leading-none",
					children: "Clientes"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Pesquisar...",
							value: searchQuery,
							onChange: (e) => setSearchQuery(e.target.value),
							"aria-label": "Pesquisar clientes",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Magnifier, { className: "text-zinc-500 size-4 mr-1" }),
							className: "w-64 shrink-0",
							variant: "zinc"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select$1, {
							selectedKey: filter,
							onSelectionChange: (key) => setFilter(key),
							ariaLabel: "Filtrar clientes",
							variant: "zinc",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									id: "all",
									textValue: "Filtro: Todos",
									children: "Filtro: Todos"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									id: "pending",
									textValue: "Com pendências",
									children: "Com pendências"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									id: "paid",
									textValue: "Sem pendências",
									children: "Sem pendências"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button$1, {
							onPress: () => navigate({ to: "/clientes/novo" }),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Novo Cliente"]
						})
					]
				})]
			}),
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 flex-1 min-h-0",
				children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "animate-pulse bg-zinc-100 rounded-[24px] h-[88px] w-full" }, i))
			}) : filteredClients.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 flex items-center justify-center text-zinc-500 text-sm",
				children: searchQuery ? "Nenhum cliente encontrado para essa busca." : "Nenhum cliente encontrado."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto scrollbar-none pb-4",
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
				onDelete: (id) => handleDeleteClient(id),
				client: editingClient,
				isPending: isUpdatingClient || isDeletingClient,
				error: getErrorMessage(updateError || deleteError)
			})
		]
	});
}
//#endregion
export { Clientes as component };
