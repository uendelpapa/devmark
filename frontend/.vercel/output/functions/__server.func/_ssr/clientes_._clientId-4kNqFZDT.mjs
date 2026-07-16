import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { E as require_jsx_runtime, w as IconPlus } from "../_libs/@heroui/react+[...].mjs";
import { D as updateClient, f as deleteService, g as fetchClient, k as updateService, o as createService } from "./api-Beqz3ccz.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { H as ChevronLeft, J as Briefcase, L as CircleInfo, R as CircleDollar, b as Layers, d as Pencil, k as EnvelopeOpen } from "../_libs/gravity-ui__icons.mjs";
import { t as Button$1 } from "./Button-CKIMbDdG.mjs";
import { f as Link, p as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as EditClientModal } from "./EditClientModal-CkKVDEWf.mjs";
import { t as Route } from "./clientes_._clientId-BBTJh9JI.mjs";
import { t as ServiceModal } from "./ServiceModal-Bi5H2QX3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/clientes_._clientId-4kNqFZDT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var formatCurrency = (val) => {
	const num = parseFloat(val);
	if (isNaN(num)) return "R$ 0,00";
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL"
	}).format(num);
};
var getStatusBadge = (status) => {
	switch (status) {
		case "ACTIVE": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "bg-primary/40 text-secondary px-2 py-1 rounded-full text-xs font-semibold",
			children: "Ativo"
		});
		case "LEAD": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "bg-blue-500/10 text-blue-600 px-2 py-1 rounded-full text-xs font-semibold",
			children: "Lead"
		});
		case "NEGOTIATING": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "bg-amber-500/10 text-amber-600 px-2 py-1 rounded-full text-xs font-semibold",
			children: "Em Negociação"
		});
		case "INACTIVE": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "bg-zinc-500/10 text-zinc-600 px-2 py-1 rounded-full text-xs font-semibold",
			children: "Inativo"
		});
		case "LOST": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "bg-red-500/10 text-red-600 px-2 py-1 rounded-full text-xs font-semibold",
			children: "Perdido"
		});
		default: return null;
	}
};
var getProjectStatusInfo = (status) => {
	switch (status) {
		case "PLANNING": return {
			label: "Planejamento",
			bg: "bg-blue-200 text-blue-900"
		};
		case "IN_PROGRESS": return {
			label: "Em Andamento",
			bg: "bg-amber-200 text-amber-900"
		};
		case "WAITING_CLIENT": return {
			label: "Aguardando Cliente",
			bg: "bg-purple-200 text-purple-900"
		};
		case "REVIEW": return {
			label: "Em Revisão",
			bg: "bg-indigo-200 text-indigo-900"
		};
		case "COMPLETED": return {
			label: "Concluído",
			bg: "bg-primary/50 text-secondary"
		};
		case "CANCELED": return {
			label: "Cancelado",
			bg: "bg-rose-200 text-rose-900"
		};
		default: return {
			label: status,
			bg: "bg-zinc-200 text-zinc-900"
		};
	}
};
var getServiceStatusInfo = (status) => {
	switch (status) {
		case "PENDING": return {
			label: "Pendente",
			bg: "bg-zinc-200 text-zinc-800"
		};
		case "IN_PROGRESS": return {
			label: "Em Andamento",
			bg: "bg-amber-200 text-amber-950"
		};
		case "REVIEW": return {
			label: "Em Revisão",
			bg: "bg-purple-200 text-purple-950"
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
function ClientDetailsPage() {
	const { clientId } = Route.useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { data: client, isLoading } = useQuery({
		queryKey: ["client", clientId],
		queryFn: () => fetchClient(clientId)
	});
	const [isEditModalOpen, setIsEditModalOpen] = (0, import_react.useState)(false);
	const [isServiceModalOpen, setIsServiceModalOpen] = (0, import_react.useState)(false);
	const [selectedServiceForEdit, setSelectedServiceForEdit] = (0, import_react.useState)(null);
	const { mutate: handleUpdateClient, isPending: isUpdatingClient, error: updateError } = useMutation({
		mutationFn: ({ id, data }) => updateClient(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["client", clientId] });
			queryClient.invalidateQueries({ queryKey: ["clients"] });
			setIsEditModalOpen(false);
		}
	});
	const { mutate: handleCreateService, isPending: isCreatingService, error: createServiceError } = useMutation({
		mutationFn: (data) => createService(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["client", clientId] });
			setIsServiceModalOpen(false);
		}
	});
	const { mutate: handleUpdateService, isPending: isUpdatingService, error: updateServiceError } = useMutation({
		mutationFn: ({ id, data }) => updateService(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["client", clientId] });
			setIsServiceModalOpen(false);
		}
	});
	const { mutate: handleDeleteService } = useMutation({
		mutationFn: (id) => deleteService(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["client", clientId] });
			setIsServiceModalOpen(false);
		}
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "bg-white rounded-[24px] p-6 h-fit min-h-[400px] flex items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary" })
	});
	if (!client) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white rounded-[24px] p-6 h-fit flex flex-col items-center justify-center gap-4 min-h-[400px]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-xl font-medium text-secondary",
			children: "Cliente não encontrado"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
			onPress: () => navigate({ to: "/clientes" }),
			className: "bg-zinc-100",
			children: "Voltar"
		})]
	});
	const getErrorMessage = (err) => {
		if (!err) return null;
		return Array.isArray(err.response?.data?.message) ? err.response.data.message.join(", ") : err.response?.data?.message || err.message;
	};
	const totalProjectValue = client.projects.reduce((acc, p) => acc + (parseFloat(p.project_value) || 0), 0);
	const totalReceivedProjects = client.projects.reduce((acc, p) => acc + (parseFloat(p.amount_received) || 0), 0);
	const totalServiceValue = client.services?.reduce((acc, s) => acc + (parseFloat(s.value) || 0), 0) || 0;
	const totalReceivedServices = client.services?.reduce((acc, s) => acc + (parseFloat(s.amount_received) || 0), 0) || 0;
	const totalAccumulated = totalProjectValue + totalServiceValue;
	const totalReceived = totalReceivedProjects + totalReceivedServices;
	const totalPending = totalAccumulated - totalReceived;
	const isPendingZero = totalPending <= 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white rounded-[24px] p-6 overflow-y-auto min-w-0 h-fit max-h-[calc(100vh-100px)] scrollbar-none flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start sm:items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
						onClick: () => window.history.back(),
						size: "lg",
						variant: "onlyIcon",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 flex-wrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-2xl sm:text-3xl font-bold tracking-tight text-secondary leading-none",
								children: client.name
							}), getStatusBadge(client.status)]
						}), client.company_name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-medium text-zinc-500 mt-1",
							children: client.company_name
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button$1, {
					onPress: () => setIsEditModalOpen(true),
					variant: "primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {}), "Editar Cliente"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-1 bg-zinc-100 border border-zinc-200 rounded-[24px] p-6 flex flex-col gap-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-medium text-sm text-zinc-600 mb-1",
							children: "Informações do Cliente"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "size-11 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-500 shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnvelopeOpen, { className: "size-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold text-zinc-600",
									children: "E-mail"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-medium text-secondary truncate",
									children: client.email
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "size-11 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-500 shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "size-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold text-zinc-600",
									children: "Documento (CPF/CNPJ)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-medium text-secondary truncate",
									children: client.document || "Não informado"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "size-11 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-500 shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleInfo, { className: "size-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold text-zinc-600",
									children: "Telefone"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-medium text-secondary truncate",
									children: client.phone || "Não informado"
								})]
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-zinc-100 h-36 transition-colors rounded-[24px] p-6 border border-zinc-200 flex flex-col justify-center gap-1 cursor-default",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-zinc-600 mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-medium",
									children: "Projetos & Serviços"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-baseline gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-4xl font-extrabold text-zinc-800 tracking-tight",
									children: client.projects.length
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-sm text-zinc-500 font-medium",
									children: [
										"/ ",
										client.services?.length || 0,
										" avulsos"
									]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-primary/50 h-36 transition-colors rounded-[24px] p-6 border border-primary flex flex-col justify-center gap-1 cursor-default",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-secondary mb-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleDollar, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-medium",
										children: "Valor Recebido"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-3xl font-extrabold text-secondary truncate",
									children: formatCurrency(totalReceived)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 w-full bg-secondary/40 h-2 rounded-full overflow-hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "bg-secondary h-full rounded-full transition-all duration-1000 ease-out",
										style: { width: `${totalAccumulated > 0 ? Math.min(totalReceived / totalAccumulated * 100, 100) : 0}%` }
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `transition-colors h-36 rounded-[24px] p-6 border flex flex-col justify-center gap-1 cursor-default ${isPendingZero ? "bg-zinc-50 border-zinc-200" : "bg-amber-100 border-amber-200"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `flex items-center gap-2 mb-1 ${isPendingZero ? "text-zinc-500" : "text-amber-955"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleDollar, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-medium",
										children: "Valor Pendente"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `text-3xl font-extrabold tracking-tight truncate ${isPendingZero ? "text-zinc-400" : "text-amber-955"}`,
									children: formatCurrency(isPendingZero ? 0 : totalPending)
								}),
								isPendingZero && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-zinc-400 mt-2 flex items-center gap-1",
									children: "Tudo certo por aqui"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-zinc-100 h-36 transition-colors rounded-[24px] p-6 border border-zinc-200 flex flex-col justify-center gap-1 cursor-default",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-zinc-600 mb-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleDollar, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-medium",
										children: "Total Acumulado"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-3xl font-extrabold text-zinc-800 tracking-tight truncate",
									children: formatCurrency(totalAccumulated)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-zinc-500 mt-2 flex items-center gap-1",
									children: "Projetos + serviços avulsos"
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-5 mt-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-xl font-bold text-secondary tracking-tight",
						children: "Projetos do Cliente"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/projetos/novo",
						search: { clientId },
						className: "flex text-xs items-center text-zinc-400 hover:text-zinc-600 transition-all duration-200 font-medium gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconPlus, { className: "size-3" }), "Novo Projeto"]
					})]
				}), client.projects.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-zinc-50 border border-zinc-200 border-dashed rounded-[24px] p-12 flex flex-col items-center justify-center text-center gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-10 text-zinc-300" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center justify-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-zinc-600 font-semibold text-lg",
								children: "Nenhum projeto encontrado"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-zinc-400 text-sm mt-1 max-w-sm",
								children: "Este cliente ainda não tem projetos associados. Inicie um novo projeto para começar."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button$1, {
							variant: "zinc",
							onPress: () => navigate({
								to: "/projetos/novo",
								search: { clientId }
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconPlus, {}), "Criar Novo Projeto"]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5",
					children: client.projects.map((project) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/projetos/$projectId",
						params: { projectId: project.id },
						className: "bg-zinc-100 border border-zinc-200 rounded-[24px] p-6 transition-all duration-300 group flex flex-col gap-4 cursor-pointer relative overflow-hidden",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 left-0 w-1.5 h-full bg-primary/0 group-hover:bg-backpage transition-colors" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-start justify-between gap-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-bold text-zinc-800 transition-colors line-clamp-2 text-base leading-snug",
									children: project.name
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `text-xs font-semibold tracking-wider px-2.5 py-1 rounded-full w-fit ${getProjectStatusInfo(project.status).bg}`,
									children: getProjectStatusInfo(project.status).label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between pt-4 border-t border-zinc-100/80",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] uppercase font-semibold text-zinc-800 tracking-wider mb-0.5",
											children: "Valor"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm font-bold text-zinc-800",
											children: formatCurrency(project.project_value)
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col text-right",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] uppercase font-semibold text-secondary tracking-wider mb-0.5",
											children: "Recebido"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm font-bold text-secondary",
											children: formatCurrency(project.amount_received)
										})]
									})]
								})]
							})
						]
					}, project.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-5 mt-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-xl font-bold text-secondary tracking-tight",
						children: "Serviços Avulsos"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button$1, {
						className: "bg-transparent border-none text-xs text-zinc-400 hover:text-zinc-600 transition-all duration-200 font-medium hover:bg-transparent gap-1",
						size: "sm",
						onPress: () => {
							setSelectedServiceForEdit(null);
							setIsServiceModalOpen(true);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconPlus, { className: "size-3" }), "Adicionar Serviço"]
					})]
				}), !client.services || client.services.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-zinc-50 border border-zinc-200 border-dashed rounded-[24px] p-12 flex flex-col items-center justify-center text-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-10 text-zinc-300" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center justify-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-zinc-600 font-semibold text-lg",
							children: "Nenhum serviço avulso encontrado"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-zinc-400 text-sm mt-1 max-w-sm",
							children: "Este cliente ainda não tem serviços avulsos cadastrados."
						})]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5",
					children: client.services.map((service) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => {
							setSelectedServiceForEdit(service);
							setIsServiceModalOpen(true);
						},
						className: "bg-zinc-100 border border-zinc-200 rounded-[24px] p-6 transition-all duration-300 group flex flex-col gap-4 cursor-pointer hover:border-primary/40 relative overflow-hidden",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 left-0 w-1.5 h-full bg-primary/0 group-hover:bg-backpage transition-colors" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-start justify-between gap-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-bold text-zinc-800 transition-colors line-clamp-2 text-base leading-snug",
									children: service.title
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `text-xs font-semibold tracking-wider px-2.5 py-1 rounded-full w-fit ${getServiceStatusInfo(service.status).bg}`,
										children: getServiceStatusInfo(service.status).label
									}),
									service.due_date && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-zinc-500 font-medium mt-1",
										children: ["Prazo: ", new Date(service.due_date).toLocaleDateString("pt-BR")]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between pt-4 border-t border-zinc-100/80",
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
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditClientModal, {
				isOpen: isEditModalOpen,
				onClose: () => setIsEditModalOpen(false),
				onSubmit: (id, data) => handleUpdateClient({
					id,
					data
				}),
				client,
				isPending: isUpdatingClient,
				error: getErrorMessage(updateError)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceModal, {
				isOpen: isServiceModalOpen,
				onClose: () => setIsServiceModalOpen(false),
				onSubmit: (data) => {
					if (selectedServiceForEdit) handleUpdateService({
						id: selectedServiceForEdit.id,
						data
					});
					else handleCreateService(data);
				},
				onDelete: (id) => handleDeleteService(id),
				service: selectedServiceForEdit,
				clientId,
				isPending: isCreatingService || isUpdatingService,
				error: getErrorMessage(createServiceError || updateServiceError)
			})
		]
	});
}
//#endregion
export { ClientDetailsPage as component };
