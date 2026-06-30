import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { T as require_jsx_runtime, a as ListBox, c as Label, f as TimeField, h as DateField, m as DatePicker, r as Select, t as Calendar, v as $ad063034c8620db8$export$aa8b41735afcabd2, y as Checkbox } from "../_libs/@heroui/react+[...].mjs";
import { h as fetchTasks, p as fetchProjects } from "./api-C8eLQxfJ.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { $ as ArrowUpRightFromSquare, D as Flag, M as Ellipsis, c as Plus, n as TrashBin, t as Xmark } from "../_libs/gravity-ui__icons.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CreateTaskModal-DgENZ96R.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TASK_STATUSES = [
	{
		key: "PENDING",
		label: "To Do"
	},
	{
		key: "IN_PROGRESS",
		label: "Fazendo"
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
var PRIORITIES = [
	{
		key: "LOW",
		label: "Baixa",
		activeColor: "bg-zinc-500 text-white"
	},
	{
		key: "MEDIUM",
		label: "Normal",
		activeColor: "bg-blue-500 text-white"
	},
	{
		key: "HIGH",
		label: "Alta",
		activeColor: "bg-amber-500 text-white"
	},
	{
		key: "URGENT",
		label: "Urgente",
		activeColor: "bg-red-500 text-white"
	}
];
var STATUS_CHIP_ACTIVE = {
	PENDING: "bg-zinc-200 text-secondary",
	IN_PROGRESS: "bg-amber-100 text-amber-700",
	REVIEW: "bg-blue-100 text-blue-700",
	COMPLETED: "bg-primary/50 text-secondary",
	CANCELED: "bg-red-100 text-red-600"
};
function CreateTaskModal({ isOpen, onClose, onSubmit, isPending = false, error = null, statusPreset }) {
	const [title, setTitle] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [priority, setPriority] = (0, import_react.useState)("MEDIUM");
	const [status, setStatus] = (0, import_react.useState)("PENDING");
	const [projectId, setProjectId] = (0, import_react.useState)(null);
	const [estimatedHours, setEstimatedHours] = (0, import_react.useState)(0);
	const [dueDate, setDueDate] = (0, import_react.useState)(null);
	const [tags, setTags] = (0, import_react.useState)([]);
	const [tagInput, setTagInput] = (0, import_react.useState)("");
	const [subtasks, setSubtasks] = (0, import_react.useState)([]);
	const [subtaskInput, setSubtaskInput] = (0, import_react.useState)("");
	const [isTagSuggestionsOpen, setIsTagSuggestionsOpen] = (0, import_react.useState)(false);
	const { data: tasks = [] } = useQuery({
		queryKey: ["tasks"],
		queryFn: fetchTasks,
		enabled: isOpen
	});
	const filteredSuggestions = Array.from(new Set(tasks.flatMap((t) => t.tags || []).filter((tag) => tag && tag.trim() !== ""))).filter((tag) => !tags.includes(tag) && tag.toLowerCase().includes(tagInput.trim().toLowerCase()));
	(0, import_react.useEffect)(() => {
		if (!isOpen) {
			setTitle("");
			setDescription("");
			setPriority("MEDIUM");
			setStatus("PENDING");
			setProjectId(null);
			setEstimatedHours(0);
			setDueDate(null);
			setTags([]);
			setSubtasks([]);
		} else if (statusPreset) setStatus(statusPreset);
	}, [isOpen, statusPreset]);
	const { data: projects = [] } = useQuery({
		queryKey: ["projects"],
		queryFn: fetchProjects,
		enabled: isOpen
	});
	if (!isOpen) return null;
	const handleAddTag = () => {
		const trimmed = tagInput.trim().toLowerCase();
		if (trimmed && !tags.includes(trimmed)) {
			setTags([...tags, trimmed]);
			setTagInput("");
		}
	};
	const handleRemoveTag = (tag) => {
		setTags(tags.filter((t) => t !== tag));
	};
	const handleAddSubtask = () => {
		const trimmed = subtaskInput.trim();
		if (trimmed) {
			setSubtasks([...subtasks, {
				id: crypto.randomUUID(),
				text: trimmed,
				completed: false
			}]);
			setSubtaskInput("");
		}
	};
	const handleToggleSubtask = (id) => {
		setSubtasks(subtasks.map((s) => s.id === id ? {
			...s,
			completed: !s.completed
		} : s));
	};
	const handleRemoveSubtask = (id) => {
		setSubtasks(subtasks.filter((s) => s.id !== id));
	};
	const handleSubmit = () => {
		if (!title.trim() || !projectId) return;
		onSubmit({
			project_id: projectId,
			title: title.trim(),
			description: description.trim(),
			priority,
			status,
			estimated_hours: estimatedHours,
			due_date: dueDate ? dueDate.toDate($ad063034c8620db8$export$aa8b41735afcabd2()).toISOString() : void 0,
			tags,
			subtasks: subtasks.map((s) => ({
				text: s.text,
				completed: s.completed
			}))
		});
	};
	const today = (/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR", {
		day: "numeric",
		month: "short",
		year: "numeric"
	});
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
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: onClose,
							className: "size-8 flex items-center justify-center rounded-xl hover:bg-zinc-100 transition-colors cursor-pointer bg-transparent border-none",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Xmark, { className: "size-4 text-secondary/60" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "size-8 flex items-center justify-center rounded-xl hover:bg-zinc-100 transition-colors cursor-pointer bg-transparent border-none",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRightFromSquare, { className: "size-4 text-secondary/60" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "size-8 flex items-center justify-center rounded-xl hover:bg-zinc-100 transition-colors cursor-pointer bg-transparent border-none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-4 text-secondary/60" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 overflow-y-auto overflow-x-hidden px-5 pb-4 space-y-5 scrollbar-none",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: title,
							onChange: (e) => setTitle(e.target.value),
							placeholder: "Nome da tarefa",
							className: "w-full bg-transparent border-none outline-none text-secondary text-xl font-semibold placeholder:text-zinc-400 py-1"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-secondary/50 text-sm w-28 shrink-0 font-medium",
										children: "Projeto:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										"aria-label": "Projeto",
										placeholder: "Selecione um projeto",
										selectedKey: projectId,
										onSelectionChange: (key) => setProjectId(key),
										className: "flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select.Trigger, {
											className: "bg-zinc-100 border border-zinc-200 rounded-xl shadow-none px-2.5 py-1.5 text-secondary text-sm font-medium w-full flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Value, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Indicator, {})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Popover, {
											className: "bg-white border border-zinc-200 rounded-xl shadow-lg z-[120]",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox, {
												className: "p-1",
												children: projects.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.Item, {
													id: p.id,
													textValue: p.name,
													className: "px-3 py-1.5 text-sm rounded-lg hover:bg-zinc-100 cursor-pointer",
													children: p.name
												}, p.id))
											})
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-secondary/50 text-sm w-28 shrink-0 font-medium pt-1",
										children: "Prioridade:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center gap-1.5 flex-wrap",
										children: PRIORITIES.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => setPriority(p.key),
											className: `flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer border-none whitespace-nowrap ${priority === p.key ? p.activeColor : "bg-zinc-100 text-secondary/60 hover:bg-zinc-200"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { className: "size-3" }), p.label]
										}, p.key))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-secondary/50 text-sm w-28 shrink-0 font-medium",
										children: "Data de entrega:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatePicker, {
										className: "w-fit min-w-[200px]",
										value: dueDate,
										onChange: setDueDate,
										granularity: "minute",
										hideTimeZone: true,
										hourCycle: 24,
										children: ({ state }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DateField.Group, {
											className: "bg-zinc-100 border border-zinc-200 rounded-xl shadow-none px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-primary/50 transition-all flex items-center justify-between w-full",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateField.Input, {
												className: "flex gap-1 text-sm font-medium text-secondary outline-none cursor-text",
												children: (segment) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateField.Segment, {
													segment,
													className: "focus:bg-primary/30 focus:text-secondary rounded px-0.5"
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateField.Suffix, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatePicker.Trigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatePicker.TriggerIndicator, { className: "text-secondary/50" }) }) })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DatePicker.Popover, {
											className: "flex flex-col gap-3 bg-white p-4 rounded-xl shadow-xl border border-zinc-200 z-[150] min-w-[280px]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Calendar, {
												"aria-label": "Date",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Calendar.Header, {
													className: "flex items-center justify-between mb-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar.YearPickerTrigger, {
														className: "font-bold text-secondary hover:bg-zinc-100 px-2 py-1 rounded cursor-pointer transition-colors",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar.YearPickerTriggerHeading, {})
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex gap-1",
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
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-secondary/50 text-sm w-28 shrink-0 font-medium pt-1",
										children: "Status"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center gap-1.5 flex-wrap",
										children: TASK_STATUSES.slice(0, 4).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setStatus(s.key),
											className: `px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer border-none whitespace-nowrap ${status === s.key ? STATUS_CHIP_ACTIVE[s.key] : "bg-zinc-100 text-secondary/40 hover:bg-zinc-200 hover:text-secondary/60"}`,
											children: s.label
										}, s.key))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-secondary/50 text-sm w-28 shrink-0 pt-1 font-medium",
										children: "Tags"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-2 flex-1 relative",
										children: [tags.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1.5 bg-secondary text-white px-2.5 py-1 rounded-xl text-xs font-semibold",
											children: [tag, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => handleRemoveTag(tag),
												className: "size-3.5 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors cursor-pointer bg-transparent border-none text-white/70 hover:text-white text-[10px] leading-none",
												children: "X"
											})]
										}, tag)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative inline-block",
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
												onBlur: () => {
													setTimeout(() => setIsTagSuggestionsOpen(false), 200);
												},
												placeholder: "+ tag",
												className: "bg-transparent border-none outline-none text-secondary/50 text-xs w-16 placeholder:text-zinc-400 py-1"
											}), isTagSuggestionsOpen && filteredSuggestions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "absolute left-0 top-full mt-1 w-48 bg-white border border-zinc-200 rounded-xl shadow-lg z-[110] py-1 max-h-40 overflow-y-auto",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "px-2.5 py-1 text-[10px] text-zinc-400 uppercase font-bold tracking-wider",
													children: "Tags existentes"
												}), filteredSuggestions.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onMouseDown: () => {
														if (!tags.includes(tag)) {
															setTags([...tags, tag]);
															setTagInput("");
														}
														setIsTagSuggestionsOpen(false);
													},
													className: "w-full text-left px-3 py-1.5 text-xs text-secondary hover:bg-zinc-100 border-none bg-transparent cursor-pointer font-medium",
													children: tag
												}, tag))]
											})]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-secondary/50 text-sm w-28 shrink-0 font-medium",
										children: "Horas estimadas"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										min: 0,
										value: estimatedHours || "",
										onChange: (e) => setEstimatedHours(parseInt(e.target.value) || 0),
										placeholder: "0",
										className: "bg-zinc-100 border border-zinc-200 rounded-xl px-2.5 py-1 text-secondary text-sm font-medium outline-none w-20 appearance-none focus:ring-2 focus:ring-primary/50 transition-all"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-secondary/50 text-sm w-28 shrink-0 font-medium",
										children: "Criado em"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-secondary text-sm font-semibold",
										children: today
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px bg-zinc-200 w-full" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-secondary text-xs font-bold tracking-wider uppercase mb-3",
							children: "Descrição"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: description,
							onChange: (e) => setDescription(e.target.value),
							placeholder: "Adicione uma descrição para esta tarefa...",
							rows: 4,
							className: "w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 text-secondary text-sm outline-none resize-none placeholder:text-zinc-400 focus:border-primary/60 focus:ring-2 focus:ring-primary/30 transition-all"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px bg-zinc-200 w-full" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-secondary text-xs font-bold tracking-wider uppercase mb-3",
							children: "Adicionar Subtasks"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2.5",
							children: [subtasks.map((sub) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 group",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
										isSelected: sub.completed,
										onChange: () => handleToggleSubtask(sub.id),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox.Content, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox.Control, {
											className: `w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all after:!hidden ${sub.completed ? "!bg-primary !border-primary text-[#011D00]" : "border-zinc-500 bg-white text-transparent"}`,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox.Indicator, { className: "subtask-checkbox-indicator" })
										}) })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-sm flex-1 ${sub.completed ? "text-zinc-400 line-through" : "text-secondary"}`,
										children: sub.text
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => handleRemoveSubtask(sub.id),
										className: "size-6 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all cursor-pointer bg-transparent border-none",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrashBin, { className: "size-3 text-red-400" })
									})
								]
							}, sub.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/30 transition-all",
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
									placeholder: "Nova subtask...",
									className: "flex-1 bg-transparent border-none outline-none text-secondary text-sm placeholder:text-zinc-400"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: handleAddSubtask,
									disabled: !subtaskInput.trim(),
									className: `text-xs font-bold transition-all bg-transparent border-none cursor-pointer p-1 ${subtaskInput.trim() ? "text-primary hover:text-primary/80 font-extrabold" : "text-zinc-400 cursor-not-allowed"}`,
									children: "Adicionar"
								})]
							})]
						})] })
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
						disabled: isPending || !title.trim() || !projectId,
						className: `w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer border-none ${!title.trim() || !projectId ? "bg-zinc-200 text-zinc-400 cursor-not-allowed" : "bg-secondary text-white hover:bg-secondary/90 active:scale-[0.98]"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Criar Tarefa"]
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
//#endregion
export { CreateTaskModal as t };
