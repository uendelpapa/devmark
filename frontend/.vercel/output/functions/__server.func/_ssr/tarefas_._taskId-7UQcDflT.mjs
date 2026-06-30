import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { S as Button, T as require_jsx_runtime, a as ListBox, p as ProgressBar, r as Select, y as Checkbox } from "../_libs/@heroui/react+[...].mjs";
import { c as deleteTask, m as fetchTaskDetails, x as updateTask } from "./api-CpUZCTJ1.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { E as FloppyDisk, R as Clock, X as Calendar, Z as Briefcase, n as TrashBin, nt as ArrowLeft } from "../_libs/gravity-ui__icons.mjs";
import { p as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Route } from "./tarefas_._taskId-DJn4_KL9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tarefas_._taskId-7UQcDflT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TASK_STATUSES = [
	{
		key: "PENDING",
		label: "A Fazer",
		bg: "bg-zinc-100",
		text: "text-secondary/60"
	},
	{
		key: "IN_PROGRESS",
		label: "Fazendo",
		bg: "bg-amber-100",
		text: "text-amber-750"
	},
	{
		key: "REVIEW",
		label: "Revisão",
		bg: "bg-blue-100",
		text: "text-blue-700"
	},
	{
		key: "COMPLETED",
		label: "Concluído",
		bg: "bg-emerald-100",
		text: "text-emerald-700"
	},
	{
		key: "CANCELED",
		label: "Cancelado",
		bg: "bg-red-100",
		text: "text-red-700"
	}
];
var PRIORITIES = [
	{
		key: "LOW",
		label: "Baixa",
		bg: "bg-zinc-100",
		text: "text-secondary/60"
	},
	{
		key: "MEDIUM",
		label: "Normal",
		bg: "bg-blue-50",
		text: "text-blue-600"
	},
	{
		key: "HIGH",
		label: "Alta",
		bg: "bg-amber-50",
		text: "text-amber-700"
	},
	{
		key: "URGENT",
		label: "Urgente",
		bg: "bg-red-50",
		text: "text-red-650"
	}
];
function TaskDetailsPage() {
	const { taskId } = Route.useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { data: task, isLoading, error } = useQuery({
		queryKey: ["taskDetails", taskId],
		queryFn: () => fetchTaskDetails(taskId),
		enabled: !!taskId
	});
	const [description, setDescription] = (0, import_react.useState)("");
	const [isEditingDesc, setIsEditingDesc] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (task) setDescription(task.description || "");
	}, [task]);
	const updateMutation = useMutation({
		mutationFn: (data) => updateTask(taskId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["taskDetails", taskId] });
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
			queryClient.invalidateQueries({ queryKey: ["dashboard"] });
			if (task?.project?.id) queryClient.invalidateQueries({ queryKey: ["projectDetails", task.project.id] });
		}
	});
	const deleteMutation = useMutation({
		mutationFn: () => deleteTask(taskId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
			queryClient.invalidateQueries({ queryKey: ["dashboard"] });
			navigate({ to: "/tarefas" });
		}
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "bg-white rounded-[24px] p-6 h-[calc(100vh-100px)] flex items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "animate-spin size-8 border-4 border-primary border-t-transparent rounded-full" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-secondary/60 text-sm font-medium",
				children: "Carregando detalhes da tarefa..."
			})]
		})
	});
	if (error || !task) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white rounded-[24px] p-6 h-[calc(100vh-100px)] flex flex-col items-center justify-center gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-red-500 font-bold",
			children: "Erro ao carregar tarefa ou tarefa não encontrada."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			className: "bg-zinc-100 text-secondary",
			onPress: () => navigate({ to: "/tarefas" }),
			children: "Voltar para Tarefas"
		})]
	});
	const taskCode = `#${task.id.substring(0, 6)}`;
	const dateFormatted = task.due_date ? new Date(task.due_date).toLocaleDateString("pt-BR", { timeZone: "UTC" }) : "Sem data";
	const currentStatusInfo = TASK_STATUSES.find((s) => s.key === task.status) || TASK_STATUSES[0];
	const handleStatusChange = (newStatus) => {
		updateMutation.mutate({ status: newStatus });
	};
	const handlePriorityChange = (newPriority) => {
		updateMutation.mutate({ priority: newPriority });
	};
	const handleToggleSubtask = (subtaskIndex) => {
		if (!task.subtasks) return;
		const updatedSubtasks = task.subtasks.map((sub, idx) => idx === subtaskIndex ? {
			text: sub.text,
			completed: !sub.completed
		} : {
			text: sub.text,
			completed: sub.completed
		});
		updateMutation.mutate({ subtasks: updatedSubtasks });
	};
	const handleSaveDescription = () => {
		updateMutation.mutate({ description: description.trim() });
		setIsEditingDesc(false);
	};
	const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;
	const totalSubtasks = task.subtasks?.length || 0;
	const subtasksPercent = totalSubtasks === 0 ? 0 : Math.round(completedSubtasks / totalSubtasks * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white rounded-[24px] p-6 overflow-y-auto min-w-0 h-fit max-h-[calc(100vh-100px)] scrollbar-none flex flex-col gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-4 shrink-0 flex-wrap",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					isIconOnly: true,
					variant: "ghost",
					onPress: () => window.history.back(),
					className: "text-secondary hover:bg-zinc-100 rounded-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
						width: 20,
						height: 20
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-zinc-400 font-bold tracking-wider",
							children: taskCode
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `text-[10px] font-bold px-2 py-0.5 rounded-full ${currentStatusInfo.bg} ${currentStatusInfo.text}`,
							children: currentStatusInfo.label
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-medium tracking-tight text-secondary leading-normal",
						children: task.title
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				isIconOnly: true,
				variant: "ghost",
				className: "rounded-full hover:bg-red-50 text-red-500 hover:text-red-600 border-none cursor-pointer",
				onPress: () => {
					if (confirm("Tem certeza de que deseja excluir esta tarefa?")) deleteMutation.mutate();
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrashBin, { className: "size-5" })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-2 flex flex-col gap-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-zinc-50 rounded-[16px] p-6 border border-zinc-100",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold text-secondary text-base",
								children: "Descrição da Tarefa"
							}), !isEditingDesc ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setIsEditingDesc(true),
								className: "text-xs font-semibold text-primary-dark hover:underline bg-transparent border-none cursor-pointer",
								children: "Editar descrição"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: handleSaveDescription,
									className: "text-xs font-bold text-emerald-600 hover:underline bg-transparent border-none cursor-pointer flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloppyDisk, { className: "size-3" }), "Salvar"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => {
										setDescription(task.description || "");
										setIsEditingDesc(false);
									},
									className: "text-xs font-semibold text-zinc-400 hover:underline bg-transparent border-none cursor-pointer",
									children: "Cancelar"
								})]
							})]
						}), isEditingDesc ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: description,
							onChange: (e) => setDescription(e.target.value),
							placeholder: "Insira a descrição da tarefa...",
							rows: 4,
							className: "w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-secondary text-sm outline-none resize-none focus:ring-2 focus:ring-primary/50 transition-all"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-secondary/80 text-sm whitespace-pre-wrap leading-relaxed",
							children: task.description || "Sem descrição fornecida para esta tarefa."
						})]
					}),
					totalSubtasks > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-zinc-50 rounded-[16px] p-6 border border-zinc-100 flex flex-col gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-secondary font-bold text-base",
								children: "Progresso das Subtasks"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-secondary font-bold text-sm",
								children: [
									completedSubtasks,
									" de ",
									totalSubtasks,
									" (",
									subtasksPercent,
									"%)"
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressBar, {
							value: subtasksPercent,
							color: "success",
							className: "w-full"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-zinc-50 rounded-[16px] p-6 border border-zinc-100 flex flex-col gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold text-secondary text-base",
							children: "Checklist de Subtasks"
						}), task.subtasks && task.subtasks.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-col gap-3",
							children: task.subtasks.map((sub, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-white rounded-xl p-4 border border-zinc-100 flex items-center gap-3 shadow-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
									isSelected: sub.completed,
									onChange: () => handleToggleSubtask(idx),
									"aria-label": sub.text,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox.Content, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox.Control, {
										className: `subtask-checkbox-control ${sub.completed ? "is-completed" : ""}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox.Indicator, { className: "subtask-checkbox-indicator" })
									}) })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `text-sm ${sub.completed ? "text-zinc-400 line-through" : "text-secondary font-medium"}`,
									children: sub.text
								})]
							}, sub.id))
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-secondary/50 text-sm italic",
							children: "Nenhuma subtask cadastrada para esta tarefa."
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-zinc-50 rounded-[16px] p-6 border border-zinc-100 flex flex-col gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-bold text-secondary text-base border-b border-zinc-200 pb-2",
							children: "Detalhes"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-secondary/50 text-xs font-bold uppercase tracking-wider",
								children: "Status"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								"aria-label": "Alterar Status",
								selectedKey: task.status,
								onSelectionChange: (key) => handleStatusChange(key),
								className: "w-full",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select.Trigger, {
									className: "bg-white border border-zinc-200 rounded-xl px-3 py-1.5 text-secondary text-sm font-semibold w-full flex items-center justify-between shadow-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Value, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Indicator, {})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Popover, {
									className: "bg-white border border-zinc-200 rounded-xl shadow-lg z-[120]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox, {
										className: "p-1",
										children: TASK_STATUSES.map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.Item, {
											id: status.key,
											textValue: status.label,
											className: "px-3 py-1.5 text-sm rounded-lg hover:bg-zinc-100 cursor-pointer text-secondary",
											children: status.label
										}, status.key))
									})
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-secondary/50 text-xs font-bold uppercase tracking-wider",
								children: "Prioridade"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								"aria-label": "Alterar Prioridade",
								selectedKey: task.priority,
								onSelectionChange: (key) => handlePriorityChange(key),
								className: "w-full",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select.Trigger, {
									className: "bg-white border border-zinc-200 rounded-xl px-3 py-1.5 text-secondary text-sm font-semibold w-full flex items-center justify-between shadow-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Value, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Indicator, {})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Popover, {
									className: "bg-white border border-zinc-200 rounded-xl shadow-lg z-[120]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox, {
										className: "p-1",
										children: PRIORITIES.map((priority) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.Item, {
											id: priority.key,
											textValue: priority.label,
											className: "px-3 py-1.5 text-sm rounded-lg hover:bg-zinc-100 cursor-pointer text-secondary",
											children: priority.label
										}, priority.key))
									})
								})]
							})]
						}),
						task.project && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-secondary/50 text-xs font-bold uppercase tracking-wider",
								children: "Projeto Relacionado"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => navigate({
									to: "/projetos/$projectId",
									params: { projectId: task.project.id }
								}),
								className: "w-full text-left bg-white border border-zinc-200 rounded-xl px-3.5 py-3 hover:border-zinc-350 transition-colors shadow-xs flex items-center gap-2 cursor-pointer text-secondary/80 hover:text-secondary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "size-4 text-primary-dark" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-bold truncate",
									children: task.project.name
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "size-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-secondary/50 text-[10px] font-bold uppercase tracking-wider",
									children: "Prazo de Entrega"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-bold text-secondary truncate",
									children: dateFormatted
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "size-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-secondary/50 text-[10px] font-bold uppercase tracking-wider",
									children: "Horas Estimadas / Gastas"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-sm font-bold text-secondary truncate",
									children: [
										task.estimated_hours || 0,
										"h estimadas / ",
										task.worked_hours || 0,
										"h gastas"
									]
								})]
							})]
						})
					]
				})
			})]
		})]
	});
}
//#endregion
export { TaskDetailsPage as component };
