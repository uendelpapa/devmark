import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { T as require_jsx_runtime, _ as $ad063034c8620db8$export$aa8b41735afcabd2, c as Label, f as TimeField, g as $58246871e4652552$export$8e384432362ed0f0, h as DateField, m as DatePicker, n as Table, t as Calendar, v as Checkbox } from "../_libs/@heroui/react+[...].mjs";
import { r as toast } from "./axios-CfOZTD6c.mjs";
import { A as updateTaskStatus, S as fetchTasks, k as updateTask, p as deleteTask, s as createTask, y as fetchProjects } from "./api-CPpqugVW.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { A as Ellipsis, E as Flag, F as Clock, H as ChevronLeft, J as Briefcase, K as ChartColumnStacked, O as Eye, T as FloppyDisk, U as ChevronDown, V as ChevronRight, Y as ArrowUpRightFromSquare, _ as LayoutRows3, d as Pencil, j as Copy, n as TrashBin, q as Calendar$1, s as Plus, t as Xmark, v as LayoutHeaderCellsLarge, x as Grip } from "../_libs/gravity-ui__icons.mjs";
import { r as useTimer } from "./TimerTracker-CidYLMp3.mjs";
import { a as closestCenter, d as useDraggable, f as useDroppable, h as CSS, i as PointerSensor, m as useSensors, p as useSensor, r as KeyboardSensor, t as DndContext } from "../_libs/@dnd-kit/core+[...].mjs";
import { t as Button$1 } from "./Button-CKIMbDdG.mjs";
import { f as Link, p as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as CreateTaskModal } from "./CreateTaskModal-CXKBbu34.mjs";
import { n as SelectItem, t as Select$1 } from "./Select-DN4KSzcs.mjs";
import { a as verticalListSortingStrategy, i as useSortable, n as arrayMove, r as sortableKeyboardCoordinates, t as SortableContext } from "../_libs/dnd-kit__sortable.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tarefas-Bz6F7uQ9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function getUrgencyInfo(dueDateStr) {
	if (!dueDateStr) return {
		label: "Sem prazo",
		className: "bg-zinc-400/80 text-white"
	};
	const due = new Date(dueDateStr);
	const now = new Date(Date.now());
	const diffTime = due.getTime() - now.getTime();
	const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
	if (diffDays < 0) return {
		label: "Atrasado",
		className: "bg-red-700 text-white"
	};
	if (diffDays <= 3) return {
		label: "Urgente",
		className: "bg-[#b84a5b]/90 text-white"
	};
	if (diffDays <= 7) return {
		label: "Atenção",
		className: "bg-[#D4A017]/90 text-white"
	};
	return {
		label: "Normal",
		className: "bg-[#4E7A36]/90 text-white"
	};
}
function UrgencyChip({ dueDate }) {
	if (!dueDate) return null;
	const urgencyInfo = getUrgencyInfo(dueDate);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `${urgencyInfo.className} border-none px-1.5 py-0.5 rounded-full inline-flex items-center justify-center`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex items-center gap-1.5 text-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3" }), urgencyInfo.label.toLowerCase()]
		})
	});
}
function TaskCard({ task, onClick, wasDragging }) {
	const urgencyInfo = task.dueDate ? getUrgencyInfo(task.dueDate) : null;
	const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
		id: task.id,
		data: { task }
	});
	const style = transform ? { transform: CSS.Translate.toString(transform) } : void 0;
	const handleClick = () => {
		if (wasDragging.current) {
			wasDragging.current = false;
			return;
		}
		onClick?.(task);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: setNodeRef,
		style,
		...attributes,
		...listeners,
		onClick: handleClick,
		className: `w-full h-[164px] justify-between bg-white rounded-[16px] p-4 shadow-sm border border-transparent flex flex-col cursor-pointer hover:border-zinc-200 transition-colors ${isDragging ? "opacity-50 z-50 shadow-xl cursor-grabbing" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-1 min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-semibold text-lg text-secondary leading-tight truncate",
						children: task.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-secondary/50 text-sm truncate",
						children: task.description
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "text-secondary/30 hover:text-secondary transition-colors shrink-0 ml-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-4" })
				})]
			}),
			urgencyInfo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `${urgencyInfo.className} border-none px-2 py-0.5 rounded-full inline-flex items-center justify-center text-xs`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1.5 text-xs font-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3" }), urgencyInfo.label.toLowerCase()]
					})
				})
			}),
			task.dueDate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5 text-secondary/60",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar$1, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-[12px] font-semibold",
					children: ["Entregar ", task.dueDate]
				})]
			})
		]
	});
}
function KanbanColumn({ id, title, tasks, headerBg, flagColor, onTaskClick, onAddTask, wasDragging }) {
	const { setNodeRef, isOver } = useDroppable({ id });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: setNodeRef,
		className: `flex flex-col w-full h-fit shrink-0 rounded-[24px] p-2 gap-1 transition-colors ${isOver ? "bg-zinc-200 border border-zinc-300" : "bg-zinc-100 border border-zinc-200"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `bg-backpage border border-secondary/10 w-full rounded-[16px] p-2 flex items-center justify-between shrink-0`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `${headerBg} size-6 flex items-center justify-center rounded-3xl`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { className: `${flagColor} size-4` })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-bold text-secondary text-lg",
						children: title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "bg-white/80 text-secondary font-bold text-[11px] px-2 py-0.5 rounded-full",
						children: tasks.length === 1 ? `${tasks.length} tarefa` : `${tasks.length} tarefas`
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => onAddTask?.(id),
				className: "size-8 bg-secondary text-white rounded-full flex items-center justify-center hover:bg-[#334621] transition-colors cursor-pointer",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col gap-3 flex-1 overflow-visible",
			children: tasks.map((task) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskCard, {
				task,
				onClick: onTaskClick,
				wasDragging
			}, task.id))
		})]
	});
}
function KanbanView({ pendingTasks, inProgressTasks, reviewTasks, completedTasks, onTaskStatusChange, onTaskClick, onAddTask }) {
	const wasDragging = (0, import_react.useRef)(false);
	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
	const handleDragEnd = (event) => {
		wasDragging.current = true;
		const { active, over } = event;
		if (!over) return;
		const taskId = active.id;
		const newStatus = over.id;
		const activeTask = active.data.current?.task;
		if (activeTask && activeTask.status !== newStatus) onTaskStatusChange?.(taskId, newStatus);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DndContext, {
		sensors,
		onDragEnd: handleDragEnd,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-4 gap-6 flex-1 overflow-y-auto overflow-x-hidden scrollbar-none pb-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KanbanColumn, {
					id: "PENDING",
					title: "To do",
					tasks: pendingTasks,
					headerBg: "bg-zinc-300",
					flagColor: "text-zinc-500",
					onTaskClick,
					onAddTask,
					wasDragging
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KanbanColumn, {
					id: "IN_PROGRESS",
					title: "Fazendo",
					tasks: inProgressTasks,
					headerBg: "bg-amber-200",
					flagColor: "text-amber-700",
					onTaskClick,
					onAddTask,
					wasDragging
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KanbanColumn, {
					id: "REVIEW",
					title: "Revisão",
					tasks: reviewTasks,
					headerBg: "bg-blue-200",
					flagColor: "text-blue-500",
					onTaskClick,
					onAddTask,
					wasDragging
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KanbanColumn, {
					id: "COMPLETED",
					title: "Feito",
					tasks: completedTasks,
					headerBg: "bg-secondary",
					flagColor: "text-primary",
					onTaskClick,
					onAddTask,
					wasDragging
				})
			]
		})
	});
}
function KanbanViewSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-4 gap-6 flex-1 overflow-y-auto overflow-x-hidden scrollbar-none pb-4 animate-pulse",
		children: [
			{
				title: "To do",
				headerBg: "bg-zinc-300/20",
				flagColor: "text-zinc-400/30",
				cardCount: 3
			},
			{
				title: "Fazendo",
				headerBg: "bg-amber-200/20",
				flagColor: "text-amber-500/30",
				cardCount: 1
			},
			{
				title: "Revisão",
				headerBg: "bg-blue-200/20",
				flagColor: "text-blue-400/30",
				cardCount: 2
			},
			{
				title: "Feito",
				headerBg: "bg-secondary/20",
				flagColor: "text-primary/30",
				cardCount: 4
			}
		].map((col, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col w-full h-fit shrink-0 rounded-[24px] p-2 gap-1 bg-zinc-100/50 border border-zinc-200/50",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-backpage border border-secondary/5 w-full rounded-[16px] p-2 flex items-center justify-between shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `${col.headerBg} size-6 flex items-center justify-center rounded-3xl`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { className: `${col.flagColor} size-4` })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-secondary/40 text-lg",
							children: col.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-secondary/5 h-5 w-16 rounded-full" })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-8 bg-secondary/5 rounded-full" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-3 flex-1 overflow-visible",
				children: Array.from({ length: col.cardCount }).map((_, cIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full h-[164px] justify-between bg-white rounded-[16px] p-4 border border-zinc-100 flex flex-col shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-2 min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-5 bg-secondary/10 rounded w-3/4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3.5 bg-secondary/10 rounded w-5/6" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-5 bg-secondary/10 rounded ml-2" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-5 bg-secondary/10 rounded-full w-20" }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-4 bg-secondary/10 rounded-full" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3.5 bg-secondary/10 rounded w-1/2" })]
						})
					]
				}, cIdx))
			})]
		}, idx))
	});
}
function TaskItem({ task, index, total, onStatusChange, onClick }) {
	const roundedClass = total === 1 && index === 0 ? "rounded-2xl" : index === 0 ? "rounded-t-2xl" : index === total - 1 ? "rounded-b-2xl" : "";
	const isDone = task.status === "COMPLETED";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		onClick: () => onClick?.(task),
		className: `flex items-center justify-between p-5 bg-white hover:bg-zinc-50 ${roundedClass} transition-colors cursor-pointer ${isDone ? "opacity-60" : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
				isSelected: isDone,
				onChange: (checked) => {
					onStatusChange?.(task.id, checked ? "COMPLETED" : "PENDING");
				},
				onClick: (e) => e.stopPropagation(),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox.Content, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox.Control, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox.Indicator, {}) }) })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `font-bold text-[16px] text-secondary ${isDone ? "line-through" : ""}`,
				children: task.title
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-5",
			children: [task.dueDate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5 text-secondary/60",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar$1, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-[13px] font-semibold",
					children: ["Due Date ", task.dueDate]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UrgencyChip, { dueDate: task.dueDate })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "text-secondary/30 hover:text-secondary transition-colors ml-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-4" })
			})]
		})]
	});
}
function TaskListSection({ title, tasks, onStatusChange, onTaskClick }) {
	const [collapsed, setCollapsed] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col rounded-[24px] overflow-hidden bg-zinc-200 shrink-0 p-2 gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-backpage p-2 flex items-center justify-between rounded-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setCollapsed((prev) => !prev),
						className: "size-6 rounded-full bg-secondary hover:bg-primary flex items-center justify-center text-white hover:text-secondary cursor-pointer transition-colors border-none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `size-4 transition-transform duration-200 ${collapsed ? "-rotate-90" : ""}` })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-bold text-secondary text-[16px]",
						children: title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "bg-white text-zinc-500 text-xs font-semibold px-2 py-0.5 rounded-full",
						children: [tasks.length, " Tarefas"]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "size-8 bg-[#1A2619] text-white rounded-full flex items-center justify-center hover:bg-[#253924] transition-colors cursor-pointer border-none",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
			})]
		}), !collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col gap-0.5",
			children: tasks.map((task, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskItem, {
				task,
				index: i,
				total: tasks.length,
				onStatusChange,
				onClick: onTaskClick
			}, task.id))
		})]
	});
}
function ListView({ pendingTasks, inProgressTasks, reviewTasks, completedTasks, onTaskStatusChange, onTaskClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex-1 overflow-y-auto overflow-x-hidden scrollbar-none pr-2 space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskListSection, {
				title: "To do",
				tasks: pendingTasks,
				onStatusChange: onTaskStatusChange,
				onTaskClick
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskListSection, {
				title: "Fazendo",
				tasks: inProgressTasks,
				onStatusChange: onTaskStatusChange,
				onTaskClick
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskListSection, {
				title: "Revisão",
				tasks: reviewTasks,
				onStatusChange: onTaskStatusChange,
				onTaskClick
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskListSection, {
				title: "Feito",
				tasks: completedTasks,
				onStatusChange: onTaskStatusChange,
				onTaskClick
			})
		]
	});
}
function ListViewSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex-1 overflow-y-auto overflow-x-hidden scrollbar-none pr-2 space-y-6 animate-pulse",
		children: [
			{
				title: "To do",
				cardCount: 2
			},
			{
				title: "Fazendo",
				cardCount: 1
			},
			{
				title: "Revisão",
				cardCount: 2
			},
			{
				title: "Feito",
				cardCount: 3
			}
		].map((sec, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col rounded-[24px] overflow-hidden bg-zinc-200/50 p-2 gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-backpage p-2 flex items-center justify-between rounded-2xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "size-6 rounded-full bg-secondary/10 flex items-center justify-center text-secondary/30",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-secondary/40 text-[16px]",
							children: sec.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-white/50 h-5 w-16 rounded-full" })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "size-8 bg-secondary/10 rounded-full flex items-center justify-center text-secondary/30",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-0.5",
				children: Array.from({ length: sec.cardCount }).map((_, itemIdx) => {
					const total = sec.cardCount;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `flex items-center justify-between p-5 bg-white ${total === 1 && itemIdx === 0 ? "rounded-2xl" : itemIdx === 0 ? "rounded-t-2xl" : itemIdx === total - 1 ? "rounded-b-2xl" : ""}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-5 rounded bg-secondary/10" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-5 bg-secondary/10 rounded w-48" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 text-secondary/30",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar$1, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 bg-secondary/10 rounded w-28" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-6 bg-secondary/10 rounded-full w-16" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-5 bg-secondary/10 rounded" })
							]
						})]
					}, itemIdx);
				})
			})]
		}, idx))
	});
}
var ROWS_PER_PAGE = 7;
function SortableRow({ task, isFirst, isLast, onStatusChange, onClick, onDelete }) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		...isDragging ? {
			zIndex: 50,
			position: "relative",
			opacity: .8
		} : {}
	};
	const isDone = task.status === "COMPLETED";
	const roundedClass = `${isFirst ? "rounded-t-lg" : ""} ${isLast ? "rounded-b-lg" : ""}`.trim();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table.Row, {
		ref: setNodeRef,
		style,
		className: `${isDone ? "opacity-60" : ""} ${roundedClass}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table.Cell, {
				className: "pr-0 px-4 py-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						...attributes,
						...listeners,
						className: "cursor-grab active:cursor-grabbing p-1 rounded",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grip, { className: "size-4 text-zinc-300 shrink-0 outline-none" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
						slot: null,
						isSelected: isDone,
						onChange: (checked) => onStatusChange?.(task.id, checked ? "COMPLETED" : "PENDING"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox.Content, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox.Control, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox.Indicator, {}) }) })
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table.Cell, {
				className: "font-bold text-[14px] text-secondary px-4 py-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [task.taskId, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4 text-zinc-400 cursor-pointer hover:text-secondary transition-colors" })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table.Cell, {
				className: "font-bold text-[15px] text-secondary px-4 py-3",
				children: task.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table.Cell, {
				className: "px-4 py-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: task.client.avatar,
						alt: task.client.name,
						className: "size-8 rounded-full border border-zinc-200 bg-zinc-200 object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[13px] font-semibold text-secondary leading-tight",
							children: task.client.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[12px] text-secondary/60 leading-tight",
							children: task.client.email
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table.Cell, {
				className: "px-4 py-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: task.dueDate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UrgencyChip, { dueDate: task.dueDate }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[12px] text-zinc-400",
						children: "—"
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table.Cell, {
				className: "text-[13px] font-medium text-secondary px-4 py-3",
				children: task.dueDate || "—"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table.Cell, {
				className: "px-4 py-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 justify-end",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/tarefas/$taskId",
							params: { taskId: task.id },
							className: "size-8 rounded-full bg-zinc-200 flex items-center justify-center text-secondary hover:bg-zinc-300 transition-colors border-none cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => onClick?.(task),
							className: "size-8 rounded-full bg-[#F4D35E] flex items-center justify-center text-[#6E5503] hover:bg-[#E2C355] transition-colors border-none cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => onDelete?.(task.id),
							className: "size-8 rounded-full bg-[#96263A] flex items-center justify-center text-white hover:bg-[#7D1F2F] transition-colors border-none cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrashBin, { className: "size-4" })
						})
					]
				})
			})
		]
	});
}
function TableView({ tasks, onTaskStatusChange, onTaskReorder, onTaskClick, onTaskDelete }) {
	const [page, setPage] = (0, import_react.useState)(1);
	const totalPages = Math.ceil(tasks.length / ROWS_PER_PAGE);
	const pages = (0, import_react.useMemo)(() => Array.from({ length: totalPages }, (_, i) => i + 1), [totalPages]);
	const paginatedTasks = (0, import_react.useMemo)(() => {
		const start = (page - 1) * ROWS_PER_PAGE;
		return tasks.slice(start, start + ROWS_PER_PAGE);
	}, [page, tasks]);
	const start = (page - 1) * ROWS_PER_PAGE + 1;
	const end = Math.min(page * ROWS_PER_PAGE, tasks.length);
	const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
	const handleDragEnd = (event) => {
		const { active, over } = event;
		if (active.id !== over?.id && onTaskReorder) onTaskReorder(arrayMove(tasks, tasks.findIndex((t) => t.id === active.id), tasks.findIndex((t) => t.id === over?.id)));
	};
	const isAllDone = (0, import_react.useMemo)(() => {
		return paginatedTasks.length > 0 && paginatedTasks.every((t) => t.status === "COMPLETED");
	}, [paginatedTasks]);
	const handleToggleAll = (checked) => {
		const targetStatus = checked ? "COMPLETED" : "PENDING";
		paginatedTasks.forEach((t) => {
			if (t.status !== targetStatus) onTaskStatusChange?.(t.id, targetStatus);
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-col overflow-hidden shrink-0",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DndContext, {
			sensors,
			collisionDetection: closestCenter,
			onDragEnd: handleDragEnd,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableContext, {
				items: paginatedTasks.map((t) => t.id),
				strategy: verticalListSortingStrategy,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bg-backpage rounded-[20px] overflow-hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
						className: "bg-backpage border-collapse",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table.ScrollContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table.Content, {
							"aria-label": "Tabela de tarefas",
							className: "w-full min-w-[900px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table.Header, {
								className: "bg-transparent border-none",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table.Column, {
										className: "pr-0 bg-transparent text-zinc-900 font-medium text-xs text-left px-4 py-2 border-none w-16",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
											slot: null,
											isSelected: isAllDone,
											onChange: handleToggleAll,
											"aria-label": "Selecionar todos",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox.Content, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox.Control, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox.Indicator, {}) }) })
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table.Column, {
										className: "bg-transparent text-zinc-900 font-medium text-xs text-left px-4 py-2",
										children: "ID"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table.Column, {
										className: "bg-transparent text-zinc-900 font-medium text-xs text-left px-4 py-2",
										children: "Projeto"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table.Column, {
										className: "bg-transparent text-zinc-900 font-medium text-xs text-left px-4 py-2",
										children: "Cliente"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table.Column, {
										className: "bg-transparent text-zinc-900 font-medium text-xs text-left px-4 py-2",
										children: "Tags"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table.Column, {
										className: "bg-transparent text-zinc-900 font-medium text-xs text-left px-4 py-2",
										children: "Data de entrega"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table.Column, {
										className: "bg-transparent text-zinc-900 font-medium text-xs text-right px-4 py-2",
										children: "Ações"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table.Body, { children: paginatedTasks.map((task, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableRow, {
								task,
								isFirst: index === 0,
								isLast: index === paginatedTasks.length - 1,
								onStatusChange: onTaskStatusChange,
								onClick: onTaskClick,
								onDelete: onTaskDelete
							}, task.id)) })]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table.Footer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between px-4 bg-backpage border-t border-zinc-200/50 w-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-zinc-900 font-medium text-xs",
								children: [
									start,
									" to ",
									end,
									" of ",
									tasks.length,
									" results"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										disabled: page === 1,
										onClick: () => setPage((p) => Math.max(1, p - 1)),
										className: "flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-secondary hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-none bg-transparent cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-3" }), "Prev"]
									}),
									pages.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setPage(p),
										className: `size-8 rounded-lg text-xs font-medium transition-colors border-none cursor-pointer ${p === page ? "bg-secondary text-white" : "bg-transparent text-secondary hover:bg-zinc-200"}`,
										children: p
									}, p)),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										disabled: page === totalPages,
										onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
										className: "flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-secondary hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-none bg-transparent cursor-pointer",
										children: ["Next", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-3" })]
									})
								]
							})]
						}) })]
					})
				})
			})
		})
	});
}
function TableViewSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-col overflow-hidden shrink-0 animate-pulse",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "bg-backpage rounded-[20px] overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
				className: "bg-backpage border-collapse",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table.ScrollContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table.Content, {
					"aria-label": "Tabela de tarefas",
					className: "w-full min-w-[900px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table.Header, {
						className: "bg-transparent border-none",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table.Column, {
								className: "pr-0 bg-transparent text-zinc-400/50 font-medium text-xs text-left px-4 py-2 border-none w-16",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-5 bg-secondary/10 rounded" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table.Column, {
								className: "bg-transparent text-zinc-400/50 font-medium text-xs text-left px-4 py-2",
								children: "ID"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table.Column, {
								className: "bg-transparent text-zinc-400/50 font-medium text-xs text-left px-4 py-2",
								children: "Projeto"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table.Column, {
								className: "bg-transparent text-zinc-400/50 font-medium text-xs text-left px-4 py-2",
								children: "Cliente"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table.Column, {
								className: "bg-transparent text-zinc-400/50 font-medium text-xs text-left px-4 py-2",
								children: "Tags"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table.Column, {
								className: "bg-transparent text-zinc-400/50 font-medium text-xs text-left px-4 py-2",
								children: "Data de entrega"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table.Column, {
								className: "bg-transparent text-zinc-400/50 font-medium text-xs text-right px-4 py-2",
								children: "Ações"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table.Body, { children: Array.from({ length: 6 }).map((_, index) => {
						const roundedClass = `${index === 0 ? "rounded-t-lg" : ""} ${index === 5 ? "rounded-b-lg" : ""}`.trim();
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table.Row, {
							className: roundedClass,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table.Cell, {
									className: "pr-0 px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "p-1",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-4 h-4 bg-secondary/10 rounded" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-5 bg-secondary/10 rounded" })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table.Cell, {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 bg-secondary/10 rounded w-12" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table.Cell, {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 bg-secondary/10 rounded w-40" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table.Cell, {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-8 rounded-full bg-secondary/10 object-cover" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 bg-secondary/10 rounded w-20" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2.5 bg-secondary/10 rounded w-28" })]
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table.Cell, {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-6 bg-secondary/10 rounded-full w-16" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table.Cell, {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 bg-secondary/10 rounded w-20" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table.Cell, {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 justify-end",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-8 rounded-full bg-secondary/10" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-8 rounded-full bg-secondary/10" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-8 rounded-full bg-secondary/10" })
										]
									})
								})
							]
						}, index);
					}) })]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table.Footer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-4 bg-backpage border-t border-zinc-200/50 w-full py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 bg-secondary/10 rounded w-32" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								disabled: true,
								className: "flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-secondary/30 border-none bg-transparent cursor-not-allowed",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-3" }), "Prev"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-8 rounded-lg text-xs font-medium bg-secondary/10 animate-pulse" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-8 rounded-lg text-xs font-medium bg-transparent" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								disabled: true,
								className: "flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-secondary/30 border-none bg-transparent cursor-not-allowed",
								children: ["Next", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-3" })]
							})
						]
					})]
				}) })]
			})
		})
	});
}
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
function EditTaskModal({ isOpen, onClose, onSubmit, onDelete, task, isPending = false, error = null }) {
	const navigate = useNavigate();
	const [title, setTitle] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [priority, setPriority] = (0, import_react.useState)("MEDIUM");
	const [status, setStatus] = (0, import_react.useState)("PENDING");
	const [projectId, setProjectId] = (0, import_react.useState)("");
	const [estimatedHours, setEstimatedHours] = (0, import_react.useState)(0);
	const [dueDate, setDueDate] = (0, import_react.useState)(null);
	const [tags, setTags] = (0, import_react.useState)([]);
	const [tagInput, setTagInput] = (0, import_react.useState)("");
	const [subtasks, setSubtasks] = (0, import_react.useState)([]);
	const [subtaskInput, setSubtaskInput] = (0, import_react.useState)("");
	const [isMenuOpen, setIsMenuOpen] = (0, import_react.useState)(false);
	const [isTagSuggestionsOpen, setIsTagSuggestionsOpen] = (0, import_react.useState)(false);
	const [isPriorityOpen, setIsPriorityOpen] = (0, import_react.useState)(false);
	const [isStatusOpen, setIsStatusOpen] = (0, import_react.useState)(false);
	const [isProjectOpen, setIsProjectOpen] = (0, import_react.useState)(false);
	const { data: tasks = [] } = useQuery({
		queryKey: ["tasks"],
		queryFn: fetchTasks,
		enabled: isOpen
	});
	const filteredSuggestions = Array.from(new Set(tasks.flatMap((t) => t.tags || []).filter((tag) => tag && tag.trim() !== ""))).filter((tag) => !tags.includes(tag) && tag.toLowerCase().includes(tagInput.trim().toLowerCase()));
	(0, import_react.useEffect)(() => {
		if (task && isOpen) {
			setTitle(task.title || "");
			setDescription(task.description || "");
			setPriority(task.priority || "MEDIUM");
			setStatus(task.status || "PENDING");
			setProjectId(task.project_id || "");
			setEstimatedHours(task.estimated_hours || 0);
			if (task.due_date) setDueDate($58246871e4652552$export$8e384432362ed0f0(task.due_date));
			else setDueDate(null);
			setTags(task.tags || []);
			setSubtasks(task.subtasks || []);
			setIsMenuOpen(false);
		}
	}, [task, isOpen]);
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
			due_date: dueDate ? dueDate.toDate($ad063034c8620db8$export$aa8b41735afcabd2()).toISOString() : "",
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
			className: "fixed right-0 top-0 h-full w-[440px] max-w-[100vw] bg-white z-[101] flex flex-col animate-slide-in-right overflow-x-hidden",
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
							onClick: () => {
								if (task) {
									navigate({
										to: "/tarefas/$taskId",
										params: { taskId: task.id }
									});
									onClose();
								}
							},
							className: "size-8 flex items-center justify-center rounded-xl hover:bg-zinc-100 transition-colors cursor-pointer bg-transparent border-none",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRightFromSquare, { className: "size-4 text-secondary/60" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setIsMenuOpen(!isMenuOpen),
							className: "size-8 flex items-center justify-center rounded-xl hover:bg-zinc-100 transition-colors cursor-pointer bg-transparent border-none",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-4 text-secondary/60" })
						}), isMenuOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "fixed inset-0 z-[105]",
							onClick: () => setIsMenuOpen(false)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute right-0 top-full mt-1 w-40 bg-white border border-zinc-200 rounded-xl z-[110] py-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-none bg-transparent cursor-pointer",
								onClick: () => {
									setIsMenuOpen(false);
									onDelete?.();
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrashBin, { className: "size-4" }), "Excluir"]
							})
						})] })]
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
									className: "flex items-start gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-secondary/50 text-sm w-28 shrink-0 font-medium pt-1",
										children: "Projeto:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [projectId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setIsProjectOpen(!isProjectOpen),
											className: "flex items-center gap-1.5 py-1 text-sm font-medium transition-all cursor-pointer border-none whitespace-nowrap bg-transparent text-secondary hover:text-secondary/70",
											children: projects.find((p) => p.id === projectId)?.name || "Projeto"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => setIsProjectOpen(!isProjectOpen),
											className: "flex items-center gap-1.5 py-1 text-sm font-medium transition-all cursor-pointer border-none whitespace-nowrap bg-transparent text-secondary/40 hover:text-secondary/60",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3" }), "Adicionar"]
										}), isProjectOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "fixed inset-0 z-[109]",
											onClick: () => setIsProjectOpen(false)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "absolute left-0 top-full mt-1.5 w-56 bg-white border border-zinc-200 rounded-xl shadow-lg z-[110] py-1 max-h-60 overflow-y-auto",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "px-3 py-1.5 text-[10px] text-zinc-400 uppercase font-bold tracking-wider",
												children: "Projeto"
											}), projects.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												onClick: () => {
													setProjectId(p.id);
													setIsProjectOpen(false);
												},
												className: `w-full text-left px-3 py-2 text-xs font-semibold flex items-center gap-2 border-none bg-transparent cursor-pointer transition-colors rounded-lg mx-auto hover:bg-zinc-50 ${projectId === p.id ? "text-secondary" : "text-secondary/70"}`,
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "size-3 text-zinc-400" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "truncate",
														children: p.name
													}),
													projectId === p.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "ml-auto text-primary shrink-0",
														children: "✓"
													})
												]
											}, p.id))]
										})] })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-secondary/50 text-sm w-28 shrink-0 font-medium pt-1",
										children: "Prioridade:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [priority ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => setIsPriorityOpen(!isPriorityOpen),
											className: `flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer border-none whitespace-nowrap ${PRIORITIES.find((p) => p.key === priority)?.activeColor}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { className: "size-3" }), PRIORITIES.find((p) => p.key === priority)?.label]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => setIsPriorityOpen(!isPriorityOpen),
											className: "flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer border-none whitespace-nowrap bg-zinc-100 text-secondary/50 hover:bg-zinc-200 hover:text-secondary/70",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3" }), "Adicionar"]
										}), isPriorityOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "fixed inset-0 z-[109]",
											onClick: () => setIsPriorityOpen(false)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "absolute left-0 top-full mt-1.5 w-48 bg-white border border-zinc-200 rounded-xl shadow-lg z-[110] py-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "px-3 py-1.5 text-[10px] text-zinc-400 uppercase font-bold tracking-wider",
												children: "Prioridade"
											}), PRIORITIES.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												onClick: () => {
													setPriority(p.key);
													setIsPriorityOpen(false);
												},
												className: `w-full text-left px-3 py-2 text-xs font-semibold flex items-center gap-2 border-none bg-transparent cursor-pointer transition-colors rounded-lg mx-auto hover:bg-zinc-50 ${priority === p.key ? "text-secondary" : "text-secondary/70"}`,
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `size-2.5 rounded-full ${p.activeColor.split(" ")[0]}` }),
													p.label,
													priority === p.key && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "ml-auto text-primary",
														children: "✓"
													})
												]
											}, p.key))]
										})] })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-secondary/50 text-sm w-28 shrink-0 font-medium",
										children: "Data de entrega:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatePicker, {
										className: "w-fit",
										value: dueDate,
										onChange: setDueDate,
										granularity: "minute",
										hideTimeZone: true,
										hourCycle: 24,
										children: ({ state }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateField.Group, {
											className: "border-none bg-transparent shadow-none p-0 m-0 w-fit cursor-pointer",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatePicker.Trigger, {
												className: "bg-transparent border-none shadow-none p-0 cursor-pointer outline-none w-full text-left flex items-center",
												children: dueDate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-sm font-medium text-secondary hover:text-secondary/70 transition-colors py-1 flex items-center",
													children: dueDate.toDate($ad063034c8620db8$export$aa8b41735afcabd2()).toLocaleDateString("pt-BR", {
														day: "numeric",
														month: "short",
														year: "numeric",
														hour: "2-digit",
														minute: "2-digit"
													})
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "flex items-center gap-1.5 py-1 text-sm font-medium text-secondary/40 hover:text-secondary/60 transition-colors",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3" }), "Adicionar"]
												})
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DatePicker.Popover, {
											placement: "bottom start",
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
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-secondary/50 text-sm w-28 shrink-0 font-medium pt-1",
										children: "Status"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [status ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setIsStatusOpen(!isStatusOpen),
											className: `px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer border-none whitespace-nowrap ${STATUS_CHIP_ACTIVE[status]}`,
											children: TASK_STATUSES.find((s) => s.key === status)?.label
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => setIsStatusOpen(!isStatusOpen),
											className: "flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer border-none whitespace-nowrap bg-zinc-100 text-secondary/50 hover:bg-zinc-200 hover:text-secondary/70",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3" }), "Adicionar"]
										}), isStatusOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "fixed inset-0 z-[109]",
											onClick: () => setIsStatusOpen(false)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "absolute left-0 top-full mt-1.5 w-48 bg-white border border-zinc-200 rounded-xl shadow-lg z-[110] py-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "px-3 py-1.5 text-[10px] text-zinc-400 uppercase font-bold tracking-wider",
												children: "Status"
											}), TASK_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												onClick: () => {
													setStatus(s.key);
													setIsStatusOpen(false);
												},
												className: `w-full text-left px-3 py-2 text-xs font-semibold flex items-center gap-2 border-none bg-transparent cursor-pointer transition-colors rounded-lg mx-auto hover:bg-zinc-50 ${status === s.key ? "text-secondary" : "text-secondary/70"}`,
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `size-2.5 rounded-full ${STATUS_CHIP_ACTIVE[s.key].split(" ")[0]}` }),
													s.label,
													status === s.key && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "ml-auto text-primary",
														children: "✓"
													})
												]
											}, s.key))]
										})] })]
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
												className: "absolute left-0 top-full mt-1 w-48 bg-white border border-zinc-200 rounded-xl z-[110] py-1 max-h-40 overflow-y-auto",
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
										className: "text-secondary text-sm font-medium outline-none w-6 border-b border-transparent focus:border-b focus:border-secondary transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
							className: "w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 text-secondary text-sm outline-none resize-none placeholder:text-zinc-400 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
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
								className: "flex items-center gap-3 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all",
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
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloppyDisk, { className: "size-4" }), "Salvar Alterações"]
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
var viewButtons = [
	{
		key: "kanban",
		label: "Kanban",
		icon: ChartColumnStacked
	},
	{
		key: "list",
		label: "List",
		icon: LayoutRows3
	},
	{
		key: "table",
		label: "Table",
		icon: LayoutHeaderCellsLarge
	}
];
function Tarefas() {
	const [view, setView] = (0, import_react.useState)("kanban");
	const [isCreateModalOpen, setIsCreateModalOpen] = (0, import_react.useState)(false);
	const [createTaskStatusPreset, setCreateTaskStatusPreset] = (0, import_react.useState)(void 0);
	const [editingTask, setEditingTask] = (0, import_react.useState)(null);
	const { activeTaskId, setActiveTaskId, startTimer, pauseTimer } = useTimer();
	const handleAddTaskClick = (status) => {
		setCreateTaskStatusPreset(status);
		setIsCreateModalOpen(true);
	};
	const queryClient = useQueryClient();
	const [selectedProjectId, setSelectedProjectId] = (0, import_react.useState)("ALL");
	const { data: projects = [] } = useQuery({
		queryKey: ["projects"],
		queryFn: fetchProjects
	});
	const { data: tasks = [], isLoading } = useQuery({
		queryKey: ["tasks", selectedProjectId],
		queryFn: () => fetchTasks(selectedProjectId === "ALL" ? void 0 : selectedProjectId)
	});
	const { mutate } = useMutation({
		mutationFn: ({ taskId, newStatus }) => updateTaskStatus(taskId, newStatus),
		onMutate: async ({ taskId, newStatus }) => {
			const queryKey = ["tasks", selectedProjectId];
			await queryClient.cancelQueries({ queryKey });
			const previousTasks = queryClient.getQueryData(queryKey);
			queryClient.setQueryData(queryKey, (old) => {
				if (!old) return old;
				return old.map((task) => task.id === taskId ? {
					...task,
					status: newStatus
				} : task);
			});
			return {
				previousTasks,
				queryKey
			};
		},
		onError: (_err, _variables, context) => {
			if (context?.previousTasks) queryClient.setQueryData(context.queryKey, context.previousTasks);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
			queryClient.invalidateQueries({ queryKey: ["dashboard"] });
		}
	});
	const { mutate: mutateCreate, isPending: isCreating, error: createError, reset: resetCreate } = useMutation({
		mutationFn: (data) => createTask(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
			queryClient.invalidateQueries({ queryKey: ["dashboard"] });
			setIsCreateModalOpen(false);
		}
	});
	const { mutate: mutateUpdate, isPending: isUpdating, error: updateError, reset: resetUpdate } = useMutation({
		mutationFn: ({ id, data }) => updateTask(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
			queryClient.invalidateQueries({ queryKey: ["dashboard"] });
			setEditingTask(null);
		}
	});
	const { mutate: mutateDelete, isPending: isDeleting } = useMutation({
		mutationFn: (id) => deleteTask(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
			queryClient.invalidateQueries({ queryKey: ["dashboard"] });
			setEditingTask(null);
		}
	});
	const pendingTasks = tasks.filter((t) => t.status === "PENDING");
	const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS");
	const reviewTasks = tasks.filter((t) => t.status === "REVIEW");
	const completedTasks = tasks.filter((t) => t.status === "COMPLETED");
	const handleTaskStatusChange = (taskId, newStatus) => {
		if (newStatus === "IN_PROGRESS" && inProgressTasks.length > 0 && !inProgressTasks.find((t) => t.id === taskId)) {
			toast.warning("Você já tem uma tarefa em andamento. Conclua ou pause ela antes de iniciar outra.");
			return;
		}
		mutate({
			taskId,
			newStatus
		});
		if (newStatus === "IN_PROGRESS") {
			setActiveTaskId(taskId);
			startTimer(taskId);
		} else if (activeTaskId === taskId) pauseTimer();
	};
	const handleTaskReorder = (_reorderedTasks) => {};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col bg-white rounded-[24px] p-6 overflow-y-auto min-w-0 max-h-[calc(100vh-100px)] h-fit scrollbar-none gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-medium tracking-tight text-secondary leading-none",
						children: "Tarefas"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-2",
						children: viewButtons.map(({ key, label, icon: Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setView(key),
							className: `${view === key ? "bg-primary text-secondary hover:bg-primary/50 border border-primary" : "bg-primary/50 text-secondary hover:bg-primary border border-primary"} font-semibold rounded-full px-5 h-10  text-[14px] transition-colors flex items-center gap-2 cursor-pointer`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), label]
						}, key))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select$1, {
						ariaLabel: "Filtrar por Projeto",
						selectedKey: selectedProjectId,
						onSelectionChange: (key) => setSelectedProjectId(key),
						variant: "zinc",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							id: "ALL",
							children: "Todos os Projetos"
						}), projects.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							id: p.id,
							children: p.name
						}, p.id))]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button$1, {
						onClick: () => handleAddTaskClick(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Adicionar Tarefa"]
					})]
				})]
			}),
			view === "kanban" && (isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KanbanViewSkeleton, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KanbanView, {
				pendingTasks,
				inProgressTasks,
				reviewTasks,
				completedTasks,
				onTaskStatusChange: handleTaskStatusChange,
				onTaskClick: (task) => setEditingTask(task),
				onAddTask: (status) => handleAddTaskClick(status)
			})),
			view === "list" && (isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListViewSkeleton, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListView, {
				pendingTasks,
				inProgressTasks,
				reviewTasks,
				completedTasks,
				onTaskStatusChange: handleTaskStatusChange,
				onTaskClick: (task) => setEditingTask(task)
			})),
			view === "table" && (isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableViewSkeleton, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableView, {
				tasks,
				onTaskStatusChange: handleTaskStatusChange,
				onTaskReorder: handleTaskReorder,
				onTaskClick: (task) => setEditingTask(task),
				onTaskDelete: (taskId) => mutateDelete(taskId)
			})),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreateTaskModal, {
				isOpen: isCreateModalOpen,
				statusPreset: createTaskStatusPreset,
				onClose: () => {
					setIsCreateModalOpen(false);
					resetCreate();
				},
				onSubmit: (data) => mutateCreate(data),
				isPending: isCreating,
				error: createError ? Array.isArray(createError.response?.data?.message) ? createError.response.data.message.join(", ") : createError.response?.data?.message || createError.message : null
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditTaskModal, {
				isOpen: !!editingTask,
				task: editingTask,
				onClose: () => {
					setEditingTask(null);
					resetUpdate();
				},
				onSubmit: (data) => {
					if (editingTask) mutateUpdate({
						id: editingTask.id,
						data
					});
				},
				onDelete: () => {
					if (editingTask && confirm("Tem certeza que deseja excluir esta tarefa?")) mutateDelete(editingTask.id);
				},
				isPending: isUpdating || isDeleting,
				error: updateError ? Array.isArray(updateError.response?.data?.message) ? updateError.response.data.message.join(", ") : updateError.response?.data?.message || updateError.message : null
			})
		]
	});
}
//#endregion
export { Tarefas as component };
