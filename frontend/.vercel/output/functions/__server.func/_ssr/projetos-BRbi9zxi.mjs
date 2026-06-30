import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { C as Avatar, S as Button, T as require_jsx_runtime, a as ListBox, i as Modal, r as Select } from "../_libs/@heroui/react+[...].mjs";
import { b as updateProject, o as deleteProject, p as fetchProjects } from "./api-C8eLQxfJ.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { M as Ellipsis, c as Plus, d as PencilToLine, n as TrashBin, q as Check, x as Layers } from "../_libs/gravity-ui__icons.mjs";
import { p as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Route } from "./projetos-B8X-MJgs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/projetos-BRbi9zxi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PRIORITY_LABELS = {
	LOW: "Baixa",
	MEDIUM: "Média",
	HIGH: "Alta",
	URGENT: "Urgente"
};
var STATUS_LABELS = {
	PLANNING: "Planejamento",
	IN_PROGRESS: "Em Andamento",
	WAITING_CLIENT: "Aguardando Cliente",
	REVIEW: "Revisão",
	COMPLETED: "Concluído",
	CANCELED: "Cancelado"
};
var STATUS_STYLES = {
	PLANNING: "bg-blue-200 text-zinc-900",
	IN_PROGRESS: "bg-amber-200 text-zinc-900",
	WAITING_CLIENT: "bg-purple-200 text-zinc-900",
	REVIEW: "bg-indigo-200 text-zinc-900",
	COMPLETED: "bg-emerald-200 text-zinc-900",
	CANCELED: "bg-rose-200 text-zinc-900"
};
var PRIORITY_STYLES = {
	LOW: "bg-zinc-200 text-zinc-900",
	MEDIUM: "bg-sky-200 text-zinc-900",
	HIGH: "bg-orange-200 text-zinc-900",
	URGENT: "bg-red-200 text-zinc-900"
};
var ProjectCard = (0, import_react.memo)(function ProjectCard({ id, name, description, status, priority, expected_delivery_date, client_name, client_email, onPress, onEdit, onChangeStatus, onDelete, onMarkCompleted }) {
	const isCompleted = status === "COMPLETED";
	const priorityLabel = PRIORITY_LABELS[priority];
	const [isMenuOpen, setIsMenuOpen] = (0, import_react.useState)(false);
	const menuRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const handleClickOutside = (event) => {
			if (menuRef.current && !menuRef.current.contains(event.target)) setIsMenuOpen(false);
		};
		if (isMenuOpen) document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isMenuOpen]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		onClick: () => onPress?.(id),
		className: `rounded-[16px] p-4 flex flex-col gap-6 transition-all hover:shadow-md cursor-pointer ${isCompleted ? "bg-primary/50" : "bg-zinc-100"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between items-start gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-1 min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "font-semibold text-secondary text-lg leading-tight truncate",
						children: name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-secondary/60 text-sm leading-tight truncate",
						children: description
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-1 shrink-0",
					onClick: (e) => e.stopPropagation(),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						ref: menuRef,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							className: "size-7 min-w-7 bg-transparent hover:bg-secondary/5 border-none rounded-full p-0 flex items-center justify-center shrink-0",
							"aria-label": "Opções do projeto",
							onPress: () => setIsMenuOpen(!isMenuOpen),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, {
								className: "text-zinc-700",
								width: 16,
								height: 16
							})
						}), isMenuOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute right-0 top-full mt-1 w-48 bg-white rounded-[16px] shadow-lg border border-zinc-100 py-2 z-50 flex flex-col",
							children: [
								!isCompleted && onMarkCompleted && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: (e) => {
										e.stopPropagation();
										setIsMenuOpen(false);
										onMarkCompleted(id);
									},
									className: "w-full text-left px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 flex items-center gap-2 transition-colors cursor-pointer border-none bg-transparent font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
										width: 16,
										height: 16
									}), " Concluir Projeto"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-[1px] bg-zinc-100 my-1 w-full" })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: (e) => {
										e.stopPropagation();
										setIsMenuOpen(false);
										onEdit?.(id);
									},
									className: "w-full text-left px-4 py-2 text-sm text-secondary hover:bg-zinc-50 flex items-center gap-2 transition-colors cursor-pointer border-none bg-transparent font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PencilToLine, { width: 16 }), " Editar"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: (e) => {
										e.stopPropagation();
										setIsMenuOpen(false);
										onChangeStatus?.(id, status);
									},
									className: "w-full text-left px-4 py-2 text-sm text-secondary hover:bg-zinc-50 flex items-center gap-2 transition-colors cursor-pointer border-none bg-transparent font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { width: 16 }), " Mudar Status"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-[1px] bg-zinc-100 my-1 w-full" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: (e) => {
										e.stopPropagation();
										setIsMenuOpen(false);
										onDelete?.(id, name);
									},
									className: "w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer font-medium border-none bg-transparent",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrashBin, { width: 16 }), " Excluir"]
								})
							]
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `text-[10px] font-semibold rounded-full px-2 py-0.5 ${STATUS_STYLES[status]}`,
						children: STATUS_LABELS[status]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `text-[10px] font-semibold rounded-full px-2 py-0.5 ${PRIORITY_STYLES[priority]}`,
						children: priorityLabel
					}),
					(() => {
						if (isCompleted || !expected_delivery_date) return null;
						const [day, month] = expected_delivery_date.split("/");
						if (!day || !month) return null;
						const deliveryDate = new Date((/* @__PURE__ */ new Date()).getFullYear(), parseInt(month, 10) - 1, parseInt(day, 10));
						const today = /* @__PURE__ */ new Date();
						today.setHours(0, 0, 0, 0);
						const diffTime = deliveryDate.getTime() - today.getTime();
						const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
						if (diffDays <= 3) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-semibold text-zinc-700 bg-red-100/60 rounded-full px-2 py-0.5",
							children: "urgente"
						});
						else if (diffDays <= 20) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-semibold text-zinc-700 bg-orange-100/60 rounded-full px-2 py-0.5",
							children: "atenção"
						});
						return null;
					})()
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-end justify-between gap-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
						className: "size-7 shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar.Image, {
							alt: client_name,
							src: `https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/${isCompleted ? "blue" : client_name.length % 2 === 0 ? "orange" : "blue"}.jpg`
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar.Fallback, { children: client_name.charAt(0) })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-secondary leading-tight truncate",
							children: client_name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-secondary/50 leading-tight truncate",
							children: client_email
						})]
					})]
				})
			})
		]
	});
});
function ProjectCardSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-[20px] p-5 bg-zinc-100 flex flex-col gap-3 animate-pulse",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between items-start gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-1.5 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 bg-secondary/10 rounded w-3/4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 bg-secondary/10 rounded w-1/2" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-7 bg-secondary/10 rounded-full" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-6 bg-secondary/10 rounded-full w-20" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-7 bg-secondary/10 rounded-full" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 bg-secondary/10 rounded w-16" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2.5 bg-secondary/10 rounded w-24" })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 bg-secondary/10 rounded w-28" })]
			})
		]
	});
}
function DeleteProjectModal({ isOpen, onClose, onConfirm, projectName, isPending }) {
	if (!isOpen) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		isOpen: true,
		onOpenChange: (open) => !open && onClose(),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal.Backdrop, { className: "fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal.Container, {
			className: "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md bg-white rounded-[24px] z-[101] shadow-2xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal.Dialog, {
				className: "outline-none",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal.Header, {
						className: "flex flex-col gap-1 p-6 border-b border-zinc-100",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl font-bold text-secondary",
							children: "Excluir Projeto"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal.Body, {
						className: "p-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-secondary/80 text-sm",
							children: [
								"Tem certeza que deseja excluir o projeto ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-secondary",
									children: projectName
								}),
								"? Essa ação não pode ser desfeita e apagará todas as tarefas e movimentações financeiras atreladas."
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal.Footer, {
						className: "p-6 border-t border-zinc-100 flex justify-end gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onPress: onClose,
							variant: "ghost",
							className: "bg-zinc-100 text-secondary font-bold hover:bg-zinc-200",
							isDisabled: isPending,
							children: "Cancelar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onPress: onConfirm,
							className: "bg-red-500 text-white hover:bg-red-600 font-bold",
							isDisabled: isPending,
							children: "Sim, Excluir"
						})]
					})
				]
			})
		})]
	});
}
var PROJECT_STATUSES$1 = [
	{
		key: "PLANNING",
		label: "Planejamento",
		dotColor: "bg-blue-500"
	},
	{
		key: "IN_PROGRESS",
		label: "Em Andamento",
		dotColor: "bg-amber-500"
	},
	{
		key: "WAITING_CLIENT",
		label: "Aguardando Cliente",
		dotColor: "bg-purple-500"
	},
	{
		key: "REVIEW",
		label: "Revisão",
		dotColor: "bg-indigo-500"
	},
	{
		key: "COMPLETED",
		label: "Concluído",
		dotColor: "bg-emerald-500"
	},
	{
		key: "CANCELED",
		label: "Cancelado",
		dotColor: "bg-rose-500"
	}
];
function ChangeProjectStatusModal({ isOpen, onClose, onConfirm, currentStatus, isPending }) {
	const [status, setStatus] = (0, import_react.useState)(currentStatus);
	(0, import_react.useEffect)(() => {
		if (isOpen) setStatus(currentStatus);
	}, [isOpen, currentStatus]);
	if (!isOpen) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		isOpen: true,
		onOpenChange: (open) => !open && onClose(),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal.Backdrop, { className: "fixed inset-0 bg-black/25 z-[100] backdrop-blur-xs" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal.Container, {
			className: "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-sm bg-white rounded-[24px] z-[101] shadow-xl border border-zinc-100",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal.Dialog, {
				className: "outline-none",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal.Header, {
						className: "flex flex-col gap-1 p-5 border-b border-zinc-100",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-bold text-secondary",
							children: "Alterar Status"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal.Body, {
						className: "p-5 flex flex-col gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-col gap-1",
							children: PROJECT_STATUSES$1.map((item) => {
								const isSelected = status === item.key;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setStatus(item.key),
									className: `w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer bg-transparent text-left outline-none border-none ${isSelected ? "bg-zinc-100 text-secondary" : "text-secondary/70 hover:bg-zinc-50 hover:text-secondary"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `size-2.5 rounded-full ${item.dotColor} shrink-0` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label })]
									}), isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-secondary stroke-[2.5]" })]
								}, item.key);
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal.Footer, {
						className: "p-5 border-t border-zinc-100 flex justify-end gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onPress: onClose,
							variant: "ghost",
							className: "bg-zinc-100 text-secondary font-bold hover:bg-zinc-200 h-9 px-4 rounded-xl text-xs border-none",
							isDisabled: isPending,
							children: "Cancelar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onPress: () => onConfirm(status),
							className: "bg-primary/50 text-secondary hover:bg-primary font-bold h-9 px-4 rounded-xl text-xs border-none",
							isDisabled: isPending,
							children: "Salvar"
						})]
					})
				]
			})
		})]
	});
}
var PROJECT_STATUSES = [
	{
		key: "PLANNING",
		label: "Planejamento"
	},
	{
		key: "IN_PROGRESS",
		label: "Em Andamento"
	},
	{
		key: "WAITING_CLIENT",
		label: "Aguardando Cliente"
	},
	{
		key: "REVIEW",
		label: "Revisão"
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
function Projetos() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const search = Route.useSearch();
	const [deleteModalOpen, setDeleteModalOpen] = (0, import_react.useState)(false);
	const [projectToDelete, setProjectToDelete] = (0, import_react.useState)(null);
	const [statusModalOpen, setStatusModalOpen] = (0, import_react.useState)(false);
	const [projectToChangeStatus, setProjectToChangeStatus] = (0, import_react.useState)(null);
	const [selectedStatus, setSelectedStatus] = (0, import_react.useState)(search.status || "ALL");
	const [selectedPriority, setSelectedPriority] = (0, import_react.useState)("ALL");
	(0, import_react.useEffect)(() => {
		if (search.status) setSelectedStatus(search.status);
		else setSelectedStatus("ALL");
	}, [search.status]);
	const { data: projects = [], isLoading } = useQuery({
		queryKey: ["projects"],
		queryFn: fetchProjects
	});
	const filteredProjects = projects.filter((project) => {
		const matchesStatus = selectedStatus === "ALL" || project.status === selectedStatus;
		const matchesPriority = selectedPriority === "ALL" || project.priority === selectedPriority;
		return matchesStatus && matchesPriority;
	});
	const deleteMutation = useMutation({
		mutationFn: deleteProject,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["projects"] });
			queryClient.invalidateQueries({ queryKey: ["dashboard"] });
			setDeleteModalOpen(false);
		}
	});
	const updateStatusMutation = useMutation({
		mutationFn: ({ id, status }) => updateProject(id, { status }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["projects"] });
			queryClient.invalidateQueries({ queryKey: ["dashboard"] });
			setStatusModalOpen(false);
		}
	});
	const handleEdit = (id) => {
		navigate({
			to: "/projetos/$projectId/editar",
			params: { projectId: id }
		});
	};
	const handleDelete = (id, name) => {
		setProjectToDelete({
			id,
			name
		});
		setDeleteModalOpen(true);
	};
	const handleChangeStatus = (id, currentStatus) => {
		setProjectToChangeStatus({
			id,
			currentStatus
		});
		setStatusModalOpen(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white rounded-[24px] p-6 overflow-y-auto min-w-0 h-fit max-h-[calc(100vh-100px)] scrollbar-none flex flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between items-center shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-medium tracking-tight text-secondary leading-none",
					children: "Projetos"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-4 shrink-0 flex-wrap items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							"aria-label": "Filtrar por Status",
							selectedKey: selectedStatus,
							onSelectionChange: (key) => setSelectedStatus(key),
							className: "shrink-0 rounded-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select.Trigger, {
								className: "bg-zinc-100 rounded-full shadow-none pl-3 py-2.5 text-secondary text-sm font-semibold w-fit flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Value, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Indicator, {})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Popover, {
								className: "bg-white border border-zinc-200 rounded-xl z-[120]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ListBox, {
									className: "p-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.Item, {
										id: "ALL",
										textValue: "Todos os Status",
										className: "px-3 py-1.5 text-sm rounded-lg hover:bg-zinc-100 cursor-pointer text-secondary",
										children: "Todos os Status"
									}), PROJECT_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.Item, {
										id: s.key,
										textValue: s.label,
										className: "px-3 py-1.5 text-sm rounded-lg hover:bg-zinc-100 cursor-pointer text-secondary",
										children: s.label
									}, s.key))]
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							"aria-label": "Filtrar por Prioridade",
							selectedKey: selectedPriority,
							onSelectionChange: (key) => setSelectedPriority(key),
							className: "shrink-0 rounded-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select.Trigger, {
								className: "bg-zinc-100 rounded-full shadow-none pl-3 py-2.5 text-secondary text-sm font-semibold w-full flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Value, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Indicator, {})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Popover, {
								className: "bg-white border border-zinc-200 rounded-xl z-[120]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ListBox, {
									className: "p-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.Item, {
											id: "ALL",
											textValue: "Todas as Prioridades",
											className: "px-3 py-1.5 text-sm rounded-lg hover:bg-zinc-100 cursor-pointer text-secondary",
											children: "Todas as Prioridades"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.Item, {
											id: "LOW",
											textValue: "Baixa",
											className: "px-3 py-1.5 text-sm rounded-lg hover:bg-zinc-100 cursor-pointer text-secondary",
											children: "Baixa"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.Item, {
											id: "MEDIUM",
											textValue: "Média",
											className: "px-3 py-1.5 text-sm rounded-lg hover:bg-zinc-100 cursor-pointer text-secondary",
											children: "Média"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.Item, {
											id: "HIGH",
											textValue: "Alta",
											className: "px-3 py-1.5 text-sm rounded-lg hover:bg-zinc-100 cursor-pointer text-secondary",
											children: "Alta"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.Item, {
											id: "URGENT",
											textValue: "Urgente",
											className: "px-3 py-1.5 text-sm rounded-lg hover:bg-zinc-100 cursor-pointer text-secondary",
											children: "Urgente"
										})
									]
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "lg",
							className: "bg-primary/50 hover:bg-[#a9e278] text-secondary font-bold rounded-full px-6 py-3 cursor-pointer shadow-xs text-[14px] flex items-center gap-1.5 border-none",
							onPress: () => navigate({ to: "/projetos/novo" }),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
								className: "stroke-[2.5]",
								width: 16,
								height: 16
							}), "Novo Projeto"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-3 gap-6",
				children: isLoading ? Array.from({ length: 9 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectCardSkeleton, {}, i)) : filteredProjects.length > 0 ? filteredProjects.map((project) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectCard, {
					id: project.id,
					name: project.name,
					description: project.description,
					status: project.status,
					priority: project.priority,
					expected_delivery_date: project.expected_delivery_date,
					client_name: project.client_name,
					client_email: project.client_email,
					onPress: (projectId) => navigate({
						to: "/projetos/$projectId",
						params: { projectId }
					}),
					onEdit: handleEdit,
					onDelete: handleDelete,
					onChangeStatus: handleChangeStatus,
					onMarkCompleted: (id) => updateStatusMutation.mutate({
						id,
						status: "COMPLETED"
					})
				}, project.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-span-3 py-12 text-center text-secondary/50 font-medium bg-zinc-50 border border-dashed border-zinc-200 rounded-[20px]",
					children: "Nenhum projeto encontrado para os filtros selecionados."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeleteProjectModal, {
				isOpen: deleteModalOpen,
				onClose: () => setDeleteModalOpen(false),
				projectName: projectToDelete?.name || "",
				isPending: deleteMutation.isPending,
				onConfirm: () => {
					if (projectToDelete) deleteMutation.mutate(projectToDelete.id);
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChangeProjectStatusModal, {
				isOpen: statusModalOpen,
				onClose: () => setStatusModalOpen(false),
				currentStatus: projectToChangeStatus?.currentStatus || "PLANNING",
				isPending: updateStatusMutation.isPending,
				onConfirm: (newStatus) => {
					if (projectToChangeStatus) updateStatusMutation.mutate({
						id: projectToChangeStatus.id,
						status: newStatus
					});
				}
			})
		]
	});
}
//#endregion
export { Projetos as component };
