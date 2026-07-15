import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { T as require_jsx_runtime, _ as $ad063034c8620db8$export$aa8b41735afcabd2, a as ListBox, c as Label, f as TimeField, g as $58246871e4652552$export$8e384432362ed0f0, h as DateField, m as DatePicker, p as ProgressBar, r as Select, t as Calendar, v as Checkbox } from "../_libs/@heroui/react+[...].mjs";
import { r as toast } from "./axios-CfOZTD6c.mjs";
import { S as fetchTasks, k as updateTask, p as deleteTask, x as fetchTaskDetails, y as fetchProjects } from "./api-CPpqugVW.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { H as ChevronLeft, J as Briefcase, U as ChevronDown, n as TrashBin, q as Calendar$1 } from "../_libs/gravity-ui__icons.mjs";
import { r as useTimer } from "./TimerTracker-CidYLMp3.mjs";
import { t as Button$1 } from "./Button-CKIMbDdG.mjs";
import { p as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Route } from "./tarefas_._taskId-0xKFq2MY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tarefas_._taskId-DxqJwHsG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TASK_STATUSES = [
	{
		key: "PENDING",
		label: "A Fazer",
		bg: "bg-zinc-200",
		text: "text-secondary"
	},
	{
		key: "IN_PROGRESS",
		label: "Fazendo",
		bg: "bg-primary/50",
		text: "text-secondary"
	},
	{
		key: "REVIEW",
		label: "Revisão",
		bg: "bg-zinc-200",
		text: "text-secondary"
	},
	{
		key: "COMPLETED",
		label: "Concluído",
		bg: "bg-primary",
		text: "text-secondary"
	},
	{
		key: "CANCELED",
		label: "Cancelado",
		bg: "bg-zinc-200",
		text: "text-secondary/50"
	}
];
var PRIORITIES = [
	{
		key: "LOW",
		label: "Baixa",
		bg: "bg-zinc-200",
		text: "text-secondary"
	},
	{
		key: "MEDIUM",
		label: "Normal",
		bg: "bg-zinc-200",
		text: "text-secondary"
	},
	{
		key: "HIGH",
		label: "Alta",
		bg: "bg-primary/50",
		text: "text-secondary"
	},
	{
		key: "URGENT",
		label: "Urgente",
		bg: "bg-primary",
		text: "text-secondary"
	}
];
function TaskDetailsPage() {
	const { taskId } = Route.useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { startTimer, pauseTimer, activeTaskId, setActiveTaskId } = useTimer();
	const { data: task, isLoading, error } = useQuery({
		queryKey: ["taskDetails", taskId],
		queryFn: () => fetchTaskDetails(taskId),
		enabled: !!taskId
	});
	const { data: projects = [] } = useQuery({
		queryKey: ["projects"],
		queryFn: fetchProjects
	});
	const { data: allTasks = [] } = useQuery({
		queryKey: ["tasks"],
		queryFn: fetchTasks
	});
	const [description, setDescription] = (0, import_react.useState)("");
	const [subtaskInput, setSubtaskInput] = (0, import_react.useState)("");
	const [title, setTitle] = (0, import_react.useState)("");
	const [projectId, setProjectId] = (0, import_react.useState)("");
	const [estimatedHours, setEstimatedHours] = (0, import_react.useState)(0);
	const [dueDate, setDueDate] = (0, import_react.useState)(null);
	const [tags, setTags] = (0, import_react.useState)([]);
	const [isProjectOpen, setIsProjectOpen] = (0, import_react.useState)(false);
	const [isTagSuggestionsOpen, setIsTagSuggestionsOpen] = (0, import_react.useState)(false);
	const [tagInput, setTagInput] = (0, import_react.useState)("");
	const projectRef = (0, import_react.useRef)(null);
	const tagsRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (task) {
			setDescription(task.description || "");
			setTitle(task.title || "");
			setProjectId(task.project_id || "");
			setEstimatedHours(task.estimated_hours || 0);
			setTags(task.tags || []);
			if (task.due_date) setDueDate($58246871e4652552$export$8e384432362ed0f0(task.due_date));
			else setDueDate(null);
		}
	}, [task]);
	(0, import_react.useEffect)(() => {
		const handleClickOutside = (event) => {
			if (projectRef.current && !projectRef.current.contains(event.target)) setIsProjectOpen(false);
			if (tagsRef.current && !tagsRef.current.contains(event.target)) setIsTagSuggestionsOpen(false);
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);
	const filteredSuggestions = Array.from(new Set(allTasks.flatMap((t) => t.tags || []).filter((tag) => tag && tag.trim() !== ""))).filter((tag) => !tags.includes(tag) && tag.toLowerCase().includes(tagInput.trim().toLowerCase()));
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
	const handleUpdateField = (field, value) => {
		updateMutation.mutate({ [field]: value });
	};
	const handleTitleBlur = () => {
		if (title.trim() && title.trim() !== task?.title) handleUpdateField("title", title.trim());
	};
	const handleSelectProject = (id) => {
		setProjectId(id);
		setIsProjectOpen(false);
		handleUpdateField("project_id", id);
	};
	const handleDateChange = (date) => {
		setDueDate(date);
		handleUpdateField("due_date", date ? date.toDate($ad063034c8620db8$export$aa8b41735afcabd2()).toISOString() : null);
	};
	const handleHoursBlur = () => {
		if (estimatedHours !== task?.estimated_hours) handleUpdateField("estimated_hours", estimatedHours);
	};
	const handleAddTag = () => {
		const trimmed = tagInput.trim().toLowerCase();
		if (trimmed && !tags.includes(trimmed)) {
			const newTags = [...tags, trimmed];
			setTags(newTags);
			setTagInput("");
			handleUpdateField("tags", newTags);
		}
	};
	const handleRemoveTag = (tag) => {
		const newTags = tags.filter((t) => t !== tag);
		setTags(newTags);
		handleUpdateField("tags", newTags);
	};
	const handleStatusChange = async (newStatus) => {
		if (newStatus === "IN_PROGRESS") try {
			const inProgress = (await queryClient.fetchQuery({
				queryKey: ["tasks"],
				queryFn: fetchTasks
			})).find((t) => t.status === "IN_PROGRESS");
			if (inProgress && inProgress.id !== taskId) {
				toast.warning("Você já tem uma tarefa em andamento. Conclua ou pause ela antes de iniciar outra.");
				return;
			}
		} catch (err) {
			console.error("Failed to validate in-progress tasks:", err);
		}
		handleUpdateField("status", newStatus);
		if (newStatus === "IN_PROGRESS") {
			setActiveTaskId(taskId);
			startTimer(taskId);
		} else if (activeTaskId === taskId) pauseTimer();
	};
	const handlePriorityChange = (newPriority) => {
		handleUpdateField("priority", newPriority);
	};
	const handleToggleSubtask = (subtaskIndex) => {
		if (!task.subtasks) return;
		handleUpdateField("subtasks", task.subtasks.map((sub, idx) => idx === subtaskIndex ? {
			text: sub.text,
			completed: !sub.completed
		} : {
			text: sub.text,
			completed: sub.completed
		}));
	};
	const handleAddSubtask = () => {
		const trimmed = subtaskInput.trim();
		if (!trimmed) return;
		handleUpdateField("subtasks", [...task.subtasks || [], {
			text: trimmed,
			completed: false
		}]);
		setSubtaskInput("");
	};
	const handleRemoveSubtask = (subtaskIndex) => {
		if (!task.subtasks) return;
		handleUpdateField("subtasks", task.subtasks.filter((_, idx) => idx !== subtaskIndex));
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "bg-white rounded-[24px] p-6 h-[calc(100vh-100px)] flex items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "animate-spin size-8 border-4 border-primary border-t-transparent rounded-full" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-zinc-700 text-sm font-medium",
				children: "Carregando detalhes da tarefa..."
			})]
		})
	});
	if (error || !task) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white rounded-[24px] p-6 h-[calc(100vh-100px)] flex flex-col items-center justify-center gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-red-500 font-bold",
			children: "Erro ao carregar tarefa ou tarefa não encontrada."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
			className: "bg-zinc-100 text-secondary",
			onPress: () => navigate({ to: "/tarefas" }),
			children: "Voltar para Tarefas"
		})]
	});
	const taskCode = `#${task.id.substring(0, 6)}`;
	const currentStatusInfo = TASK_STATUSES.find((s) => s.key === task.status) || TASK_STATUSES[0];
	const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;
	const totalSubtasks = task.subtasks?.length || 0;
	const subtasksPercent = totalSubtasks === 0 ? 0 : Math.round(completedSubtasks / totalSubtasks * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white rounded-[24px] p-6 overflow-y-auto min-w-0 h-fit max-h-[calc(100vh-100px)] scrollbar-none flex flex-col gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-4 shrink-0 flex-wrap",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-6 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
					onClick: () => window.history.back(),
					size: "lg",
					variant: "onlyIcon",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-1 w-full max-w-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-zinc-500 font-semibold",
							children: taskCode
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `text-[11px] font-semibold px-2 py-0.5 rounded-full ${currentStatusInfo.bg} ${currentStatusInfo.text}`,
							children: currentStatusInfo.label
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-grid items-center -ml-3 max-w-full",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "col-start-1 row-start-1 invisible whitespace-pre overflow-hidden text-2xl font-bold tracking-tight px-3",
							children: title || "Título da tarefa"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: title,
							onChange: (e) => setTitle(e.target.value),
							onBlur: handleTitleBlur,
							onKeyDown: (e) => {
								if (e.key === "Enter") e.currentTarget.blur();
							},
							className: "col-start-1 row-start-1 w-fit text-2xl font-bold tracking-tight text-secondary leading-normal bg-transparent border border-transparent hover:border-zinc-200 outline-none placeholder:text-secondary/30 focus:bg-zinc-50 focus:border-zinc-300 px-3 rounded-lg transition-all",
							placeholder: "Título da tarefa"
						})]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
					variant: "zinc",
					className: "size-10 hover:bg-rose-200! hover:text-rose-800",
					onPress: () => {
						if (confirm("Tem certeza de que deseja excluir esta tarefa?")) deleteMutation.mutate();
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrashBin, { className: "size-5" })
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-2 flex flex-col gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-zinc-100 border border-zinc-200 rounded-[20px] p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-between mb-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-bold text-zinc-700 text-base",
							children: "Descrição da Tarefa"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: description,
						onChange: (e) => setDescription(e.target.value),
						onBlur: () => {
							const trimmed = description.trim();
							if (trimmed !== (task?.description || "")) handleUpdateField("description", trimmed);
						},
						placeholder: "Sem descrição fornecida para esta tarefa. Adicione uma descrição.",
						rows: Math.max(3, description.split("\n").length),
						className: "w-full bg-transparent hover:border-zinc-200 rounded-xl px-0 py-1 text-zinc-700 text-[15px] leading-relaxed outline-none focus:bg-white focus:border-zinc-300 focus:px-3 focus:py-2 transition-all resize-none border border-transparent"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-zinc-100 h-full border border-zinc-200 rounded-[20px] p-6 flex flex-col gap-6",
					children: [totalSubtasks > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-zinc-700 font-bold text-base",
								children: "Progresso"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-zinc-700 font-semibold text-sm",
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
							className: "w-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressBar.Track, {
								className: "bg-zinc-200",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressBar.Fill, { className: "bg-primary" })
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-zinc-700 text-base",
								children: "Checklist"
							}),
							task.subtasks && task.subtasks.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-col gap-2.5",
								children: task.subtasks.map((sub, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-white rounded-[16px] p-4 flex items-center gap-3 border border-zinc-200 group",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
											isSelected: sub.completed,
											onChange: () => handleToggleSubtask(idx),
											"aria-label": sub.text,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox.Content, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox.Control, {
												className: `subtask-checkbox-control ${sub.completed ? "is-completed" : ""}`,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox.Indicator, { className: "subtask-checkbox-indicator" })
											}) })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `text-[15px] flex-1 ${sub.completed ? "text-zinc-700 line-through" : "text-secondary font-medium"}`,
											children: sub.text
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => handleRemoveSubtask(idx),
											className: "size-7 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 hover:bg-zinc-100 transition-all cursor-pointer bg-transparent border-none text-secondary/50 hover:text-red-500 shrink-0",
											title: "Remover subtask",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrashBin, { className: "size-4" })
										})
									]
								}, idx))
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-secondary/50 text-sm italic",
								children: "Nenhuma subtask cadastrada para esta tarefa."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 bg-white border border-zinc-300 rounded-[16px] px-4 py-3 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all mt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: subtaskInput,
									onChange: (e) => setSubtaskInput(e.target.value),
									onKeyDown: (e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											handleAddSubtask();
										}
									},
									placeholder: "Adicionar nova subtask...",
									className: "flex-1 bg-transparent border-none outline-none text-secondary text-[15px] placeholder:text-zinc-400"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: handleAddSubtask,
									disabled: !subtaskInput.trim() || updateMutation.isPending,
									className: `text-sm font-bold transition-all bg-transparent border-none cursor-pointer p-1 ${subtaskInput.trim() ? "text-primary hover:text-primary/80 font-extrabold" : "text-zinc-400 cursor-not-allowed"}`,
									children: "Adicionar"
								})]
							})
						]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-zinc-100 border border-zinc-200 rounded-[20px] p-6 flex flex-col gap-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-bold text-zinc-700 text-base border-b border-zinc-200 pb-3",
						children: "Detalhes"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-[100px_1fr] items-center gap-y-4 gap-x-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-zinc-600 text-xs font-bold uppercase tracking-wider",
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								"aria-label": "Alterar Status",
								selectedKey: task.status,
								onSelectionChange: (key) => handleStatusChange(key),
								className: "w-full",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select.Trigger, {
									className: "bg-white text-zinc-700 text-sm font-bold shadow-none border border-zinc-200 w-full flex items-center justify-between cursor-pointer group hover:bg-zinc-50 rounded-xl px-2 py-2.5 transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Value, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Indicator, { className: "text-zinc-400 group-hover:text-zinc-600 transition-colors" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Popover, {
									className: "bg-white border border-zinc-200 rounded-xl shadow-xl z-[120]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox, {
										className: "p-1",
										children: TASK_STATUSES.map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.Item, {
											id: status.key,
											textValue: status.label,
											className: "px-3 py-2 text-sm rounded-lg hover:bg-zinc-100 cursor-pointer text-secondary font-medium",
											children: status.label
										}, status.key))
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-zinc-600 text-xs font-bold uppercase tracking-wider",
								children: "Prioridade"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								"aria-label": "Alterar Prioridade",
								selectedKey: task.priority,
								onSelectionChange: (key) => handlePriorityChange(key),
								className: "w-full",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select.Trigger, {
									className: "bg-white text-zinc-700 text-sm font-bold shadow-none border border-zinc-200 w-full flex items-center justify-between cursor-pointer group hover:bg-zinc-50 rounded-xl px-2 py-2.5 transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Value, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Indicator, { className: "text-zinc-400 group-hover:text-zinc-600 transition-colors" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Popover, {
									className: "bg-white border border-zinc-200 rounded-xl shadow-xl z-[120]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox, {
										className: "p-1",
										children: PRIORITIES.map((priority) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.Item, {
											id: priority.key,
											textValue: priority.label,
											className: "px-3 py-2 text-sm rounded-lg hover:bg-zinc-100 cursor-pointer text-secondary font-medium",
											children: priority.label
										}, priority.key))
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-zinc-600 text-xs font-bold uppercase tracking-wider",
								children: "Projeto"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative w-full",
								ref: projectRef,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setIsProjectOpen(!isProjectOpen),
									className: "bg-white text-zinc-700 text-sm font-bold shadow-none border border-zinc-200 w-full flex items-center justify-between cursor-pointer group hover:bg-zinc-50 rounded-xl px-2 py-2.5 transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: projectId ? projects.find((p) => p.id === projectId)?.name || "Desconhecido" : "Selecionar Projeto"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4 text-zinc-400 group-hover:text-zinc-600 transition-colors shrink-0" })]
								}), isProjectOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute left-0 top-full mt-1 w-full bg-white border border-zinc-200 rounded-xl shadow-xl z-[120] py-1 max-h-60 overflow-y-auto",
									children: projects.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => handleSelectProject(p.id),
										className: `w-full text-left px-4 py-2.5 text-sm font-semibold flex items-center gap-3 border-none bg-transparent cursor-pointer transition-colors hover:bg-zinc-50 ${projectId === p.id ? "text-secondary" : "text-secondary/70"}`,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "size-4 text-zinc-400" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate flex-1",
												children: p.name
											}),
											projectId === p.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-primary shrink-0",
												children: "✓"
											})
										]
									}, p.id))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-zinc-600 text-xs font-bold uppercase tracking-wider self-start pt-2",
								children: "Tags"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-1.5 w-full min-h-[32px]  hover:bg-zinc-200/50 rounded-lg transition-colors",
								children: [tags.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 bg-secondary text-white px-2 py-0.5 rounded text-[11px] font-semibold",
									children: [tag, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => handleRemoveTag(tag),
										className: "size-3.5 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors cursor-pointer bg-transparent border-none text-white/70 hover:text-white text-[10px] leading-none",
										children: "×"
									})]
								}, tag)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative flex-1 min-w-[60px]",
									ref: tagsRef,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: tagInput,
										onChange: (e) => setTagInput(e.target.value),
										onKeyDown: (e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												handleAddTag();
											}
										},
										onFocus: () => setIsTagSuggestionsOpen(true),
										placeholder: tags.length === 0 ? "Adicionar..." : "+",
										className: "bg-white text-zinc-700 text-sm font-bold shadow-none border border-zinc-200 w-full flex items-center justify-between cursor-pointer group hover:bg-zinc-50 rounded-xl px-2 py-2.5 transition-colors"
									}), isTagSuggestionsOpen && filteredSuggestions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "absolute left-0 top-full  w-48 bg-white border border-zinc-200 rounded-xl z-[120] py-1 h-40 overflow-y-auto shadow-xl",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "px-3 py-1.5 text-[10px] text-zinc-400 uppercase font-bold tracking-wider",
											children: "Sugestões"
										}), filteredSuggestions.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onMouseDown: (e) => {
												e.preventDefault();
												if (!tags.includes(tag)) {
													const newTags = [...tags, tag];
													setTags(newTags);
													handleUpdateField("tags", newTags);
													setTagInput("");
												}
												setIsTagSuggestionsOpen(false);
											},
											className: "w-full text-left px-4 py-2 text-sm text-secondary hover:bg-zinc-50 border-none bg-transparent cursor-pointer font-medium",
											children: tag
										}, tag))]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-zinc-600 text-xs font-bold uppercase tracking-wider",
								children: "Prazo"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatePicker, {
								className: "w-full",
								value: dueDate,
								onChange: handleDateChange,
								granularity: "minute",
								hideTimeZone: true,
								hourCycle: 24,
								children: ({ state }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateField.Group, {
									className: "bg-transparent border-none p-0 m-0 w-full cursor-pointer h-11 shadow-none",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DatePicker.Trigger, {
										className: "bg-white text-zinc-700 text-sm font-bold shadow-none border border-zinc-200 w-full flex items-center justify-between cursor-pointer group hover:bg-zinc-50 rounded-xl px-2 py-2.5 h-full transition-colors",
										children: [dueDate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: dueDate.toDate($ad063034c8620db8$export$aa8b41735afcabd2()).toLocaleDateString("pt-BR", {
											day: "numeric",
											month: "short",
											year: "numeric",
											hour: "2-digit",
											minute: "2-digit"
										}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-secondary/40 font-normal",
											children: "Definir prazo"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar$1, { className: "size-4 text-zinc-400 group-hover:text-zinc-600 transition-colors shrink-0" })]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DatePicker.Popover, {
									placement: "bottom end",
									className: "flex flex-col gap-3 bg-white p-4 rounded-xl shadow-xl border border-zinc-200 z-[150] min-w-[280px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Calendar, {
										"aria-label": "Date",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Calendar.Header, {
											className: "flex items-center justify-between mb-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar.YearPickerTrigger, {
												className: "font-bold text-secondary hover:bg-zinc-100 px-2 py-1 rounded cursor-pointer transition-colors",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar.YearPickerTriggerHeading, {})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar.NavButton, {
													slot: "previous",
													className: "size-7 flex items-center justify-center hover:bg-zinc-100 rounded cursor-pointer text-secondary/70 transition-colors"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar.NavButton, {
													slot: "next",
													className: "size-7 flex items-center justify-center hover:bg-zinc-100 rounded cursor-pointer text-secondary/70 transition-colors"
												})]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Calendar.Grid, {
											className: "w-full border-collapse",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar.GridHeader, {
												className: "mb-2",
												children: (day) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar.HeaderCell, {
													className: "text-[11px] font-bold text-secondary/40 pb-2",
													children: day
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar.GridBody, { children: (date) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar.Cell, {
												date,
												className: "text-sm size-8 flex items-center justify-center hover:bg-zinc-100 rounded text-center cursor-pointer data-[selected=true]:bg-primary/50 data-[selected=true]:font-bold data-[selected=true]:text-secondary transition-colors"
											}) })]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between pt-3 border-t border-zinc-100",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-bold text-secondary/50 uppercase tracking-wider",
											children: "Horário"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimeField, {
											"aria-label": "Time",
											granularity: "minute",
											hourCycle: 24,
											value: state.timeValue,
											onChange: (v) => state.setTimeValue(v),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimeField.Group, {
												className: "flex bg-zinc-100 rounded-lg px-2 py-1 border border-zinc-200",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimeField.Input, {
													className: "flex gap-0.5 text-sm font-bold text-secondary outline-none",
													children: (segment) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimeField.Segment, {
														segment,
														className: "focus:bg-primary/30 rounded px-0.5"
													})
												})
											})
										})]
									})]
								})] })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-zinc-600 text-xs font-bold uppercase tracking-wider",
								children: "Horas"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center text-sm font-bold text-secondary rounded-lg px-2 py-1.5 transition-colors w-full",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										value: estimatedHours || "",
										onChange: (e) => setEstimatedHours(parseInt(e.target.value) || 0),
										onBlur: handleHoursBlur,
										onKeyDown: (e) => e.key === "Enter" && e.currentTarget.blur(),
										className: "w-10 bg-transparent border-none outline-none text-left font-bold text-sm text-secondary p-0",
										placeholder: "0"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-secondary/50 mx-1",
										children: "h  /"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-secondary",
										children: [task.worked_hours || 0, "h"]
									})
								]
							})
						]
					})]
				})
			})]
		})]
	});
}
//#endregion
export { TaskDetailsPage as component };
