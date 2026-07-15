import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { T as require_jsx_runtime } from "../_libs/@heroui/react+[...].mjs";
import { m as fetchCalendarItems, s as createTask } from "./api-CPpqugVW.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { H as ChevronLeft, V as ChevronRight, s as Plus, t as Xmark } from "../_libs/gravity-ui__icons.mjs";
import { t as Button$1 } from "./Button-CKIMbDdG.mjs";
import { t as CreateTaskModal } from "./CreateTaskModal-CXKBbu34.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/calendario-dRee2jQt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var VIEW_BUTTONS = [
	{
		key: "day",
		label: "Dia"
	},
	{
		key: "week",
		label: "Semana"
	},
	{
		key: "month",
		label: "Mês"
	},
	{
		key: "year",
		label: "Ano"
	}
];
function formatPeriodTitle(date, mode) {
	const months = [
		"Janeiro",
		"Fevereiro",
		"Março",
		"Abril",
		"Maio",
		"Junho",
		"Julho",
		"Agosto",
		"Setembro",
		"Outubro",
		"Novembro",
		"Dezembro"
	];
	const weekDays = [
		"Domingo",
		"Segunda",
		"Terça",
		"Quarta",
		"Quinta",
		"Sexta",
		"Sábado"
	];
	switch (mode) {
		case "day": return `${weekDays[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]} ${date.getFullYear()}`;
		case "week": {
			const startOfWeek = new Date(date);
			startOfWeek.setDate(date.getDate() - date.getDay());
			const endOfWeek = new Date(startOfWeek);
			endOfWeek.setDate(startOfWeek.getDate() + 6);
			if (startOfWeek.getMonth() === endOfWeek.getMonth()) return `${startOfWeek.getDate()} – ${endOfWeek.getDate()} de ${months[startOfWeek.getMonth()]} ${startOfWeek.getFullYear()}`;
			return `${startOfWeek.getDate()} ${months[startOfWeek.getMonth()].slice(0, 3)} – ${endOfWeek.getDate()} ${months[endOfWeek.getMonth()].slice(0, 3)} ${endOfWeek.getFullYear()}`;
		}
		case "month": return `${months[date.getMonth()]} ${date.getFullYear()}`;
		case "year": return `${date.getFullYear()}`;
	}
}
function CalendarHeader({ currentDate, viewMode, onViewModeChange, onNavigate, onAddTask }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between shrink-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-medium tracking-tight text-secondary leading-none",
				children: "Calendário"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-1.5",
				children: VIEW_BUTTONS.map(({ key, label }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => onViewModeChange(key),
					className: `${viewMode === key ? "bg-primary text-secondary hover:bg-primary/50 border border-primary/50" : "bg-primary/50 text-secondary hover:bg-primary border border-primary"} font-bold rounded-full px-4 h-9 text-xs transition-colors cursor-pointer`,
					children: label
				}, key))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => onNavigate("prev"),
							className: "size-9 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors cursor-pointer bg-transparent border-none",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4 text-secondary" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => onNavigate("today"),
							className: "px-3 h-9 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer bg-transparent border-none text-sm font-semibold text-secondary",
							children: "Hoje"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => onNavigate("next"),
							className: "size-9 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors cursor-pointer bg-transparent border-none",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4 text-secondary" })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm font-semibold text-secondary/70 min-w-[180px]",
					children: formatPeriodTitle(currentDate, viewMode)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button$1, {
					onClick: onAddTask,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Nova Tarefa"]
				})
			]
		})]
	});
}
var WEEKDAY_LABELS$2 = [
	"Dom",
	"Seg",
	"Ter",
	"Qua",
	"Qui",
	"Sex",
	"Sáb"
];
function getMonthDays$1(year, month) {
	const firstDay = new Date(year, month, 1);
	const lastDay = new Date(year, month + 1, 0);
	const startPad = firstDay.getDay();
	const totalDays = lastDay.getDate();
	const days = [];
	for (let i = 0; i < startPad; i++) {
		const d = new Date(year, month, -(startPad - i - 1));
		days.push(d);
	}
	for (let i = 1; i <= totalDays; i++) days.push(new Date(year, month, i));
	const remaining = 42 - days.length;
	for (let i = 1; i <= remaining; i++) days.push(new Date(year, month + 1, i));
	return days;
}
function isSameDay$3(a, b) {
	return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function isToday$1(date) {
	return isSameDay$3(date, /* @__PURE__ */ new Date());
}
function getItemsForDay$3(items, date) {
	return items.filter((item) => {
		const itemDate = new Date(item.start);
		if (isSameDay$3(itemDate, date)) return true;
		if (item.end) {
			const endDate = new Date(item.end);
			return date >= itemDate && date <= endDate;
		}
		return false;
	});
}
var TYPE_CHIP_STYLES = {
	project: "bg-primary/30 text-secondary border-primary/50",
	task: "bg-blue-50 text-blue-700 border-blue-200",
	event: "bg-amber-50 text-amber-700 border-amber-200"
};
function MonthView({ currentDate, items, selectedDate, onSelectDate }) {
	const year = currentDate.getFullYear();
	const month = currentDate.getMonth();
	const days = getMonthDays$1(year, month);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex-1 flex flex-col min-h-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-7 border-b border-zinc-100",
			children: WEEKDAY_LABELS$2.map((label) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "py-2.5 text-center text-[11px] font-bold text-secondary/40 uppercase tracking-wider",
				children: label
			}, label))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-7 grid-rows-6 flex-1 min-h-0",
			children: days.map((date, i) => {
				if (!date) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}, i);
				const isCurrentMonth = date.getMonth() === month;
				const dayItems = getItemsForDay$3(items, date);
				const isSelected = selectedDate && isSameDay$3(date, selectedDate);
				const today = isToday$1(date);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => onSelectDate(date),
					className: `
                relative flex flex-col items-start p-1.5 border-r border-b border-zinc-100/80
                transition-all duration-150 cursor-pointer bg-transparent text-left
                hover:bg-zinc-50/80
                ${!isCurrentMonth ? "opacity-35" : ""}
                ${isSelected ? "bg-primary/8 ring-1 ring-primary/30 ring-inset" : ""}
              `,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `
                  text-xs font-semibold leading-none mb-1 w-6 h-6 flex items-center justify-center rounded-full
                  ${today ? "bg-secondary text-white" : "text-secondary/70"}
                  ${isSelected && !today ? "bg-primary/30 text-secondary" : ""}
                `,
						children: date.getDate()
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-0.5 w-full overflow-hidden flex-1",
						children: [dayItems.slice(0, 3).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `
                      text-[10px] font-semibold px-1.5 py-0.5 rounded-md truncate
                      border transition-transform hover:scale-[1.02]
                      ${TYPE_CHIP_STYLES[item.type]}
                    `,
							title: item.title,
							children: item.title
						}, `${item.type}-${item.id}`)), dayItems.length > 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10px] text-secondary/40 font-semibold px-1.5",
							children: [
								"+",
								dayItems.length - 3,
								" mais"
							]
						})]
					})]
				}, i);
			})
		})]
	});
}
var WEEKDAY_LABELS$1 = [
	"Dom",
	"Seg",
	"Ter",
	"Qua",
	"Qui",
	"Sex",
	"Sáb"
];
var HOURS$1 = Array.from({ length: 24 }, (_, i) => i);
function getWeekDays(date) {
	const startOfWeek = new Date(date);
	startOfWeek.setDate(date.getDate() - date.getDay());
	return Array.from({ length: 7 }, (_, i) => {
		const d = new Date(startOfWeek);
		d.setDate(startOfWeek.getDate() + i);
		return d;
	});
}
function isSameDay$2(a, b) {
	return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function isToday(date) {
	return isSameDay$2(date, /* @__PURE__ */ new Date());
}
function getItemsForDay$2(items, date) {
	return items.filter((item) => {
		const itemDate = new Date(item.start);
		if (isSameDay$2(itemDate, date)) return true;
		if (item.end) {
			const endDate = new Date(item.end);
			return date >= itemDate && date <= endDate;
		}
		return false;
	});
}
var TYPE_STYLES$1 = {
	project: {
		bg: "bg-primary/20",
		border: "border-l-primary",
		text: "text-secondary"
	},
	task: {
		bg: "bg-blue-50",
		border: "border-l-blue-400",
		text: "text-blue-800"
	},
	event: {
		bg: "bg-amber-50",
		border: "border-l-amber-400",
		text: "text-amber-800"
	}
};
function WeekView({ currentDate, items, selectedDate, onSelectDate }) {
	const weekDays = getWeekDays(currentDate);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex-1 flex flex-col min-h-0 overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-[60px_repeat(7,1fr)] border-b border-zinc-200 shrink-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "py-3" }),
				" ",
				weekDays.map((day, i) => {
					const today = isToday(day);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => onSelectDate(day),
						className: `
                py-3 text-center border-l border-zinc-100 cursor-pointer bg-transparent transition-colors
                ${selectedDate && isSameDay$2(day, selectedDate) ? "bg-primary/8" : "hover:bg-zinc-50"}
              `,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-bold text-secondary/40 uppercase tracking-wider block",
							children: WEEKDAY_LABELS$1[i]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `
                  text-lg font-bold mt-0.5 inline-flex items-center justify-center size-8 rounded-full
                  ${today ? "bg-secondary text-white" : "text-secondary"}
                `,
							children: day.getDate()
						})]
					}, i);
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex-1 overflow-y-auto scrollbar-none",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-[60px_repeat(7,1fr)] min-h-[1440px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative",
					children: HOURS$1.map((hour) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-[60px] flex items-start justify-end pr-2 pt-0.5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10px] font-semibold text-secondary/30",
							children: [hour.toString().padStart(2, "0"), ":00"]
						})
					}, hour))
				}), weekDays.map((day, dayIndex) => {
					const dayItems = getItemsForDay$2(items, day);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `
                  relative border-l border-zinc-100
                  ${selectedDate && isSameDay$2(day, selectedDate) ? "bg-primary/5" : ""}
                `,
						children: [HOURS$1.map((hour) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-[60px] border-b border-zinc-100/60" }, hour)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute top-1 left-1 right-1 flex flex-col gap-0.5",
							children: [dayItems.slice(0, 5).map((item) => {
								const styles = TYPE_STYLES$1[item.type];
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `
                          ${styles.bg} ${styles.text} border-l-2 ${styles.border}
                          text-[10px] font-semibold px-1.5 py-1 rounded-r-md truncate
                          transition-transform hover:scale-[1.02] cursor-default
                        `,
									title: item.title,
									children: item.title
								}, `${item.type}-${item.id}`);
							}), dayItems.length > 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] text-secondary/40 font-semibold px-1",
								children: ["+", dayItems.length - 5]
							})]
						})]
					}, dayIndex);
				})]
			})
		})]
	});
}
var HOURS = Array.from({ length: 24 }, (_, i) => i);
function isSameDay$1(a, b) {
	return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function getItemsForDay$1(items, date) {
	return items.filter((item) => {
		const itemDate = new Date(item.start);
		if (isSameDay$1(itemDate, date)) return true;
		if (item.end) {
			const endDate = new Date(item.end);
			return date >= itemDate && date <= endDate;
		}
		return false;
	});
}
var TYPE_LABELS = {
	project: "Projeto",
	task: "Tarefa",
	event: "Evento"
};
var TYPE_STYLES = {
	project: {
		bg: "bg-primary/15",
		border: "border-l-primary",
		text: "text-secondary",
		badge: "bg-primary/40 text-secondary"
	},
	task: {
		bg: "bg-blue-50",
		border: "border-l-blue-400",
		text: "text-blue-900",
		badge: "bg-blue-100 text-blue-700"
	},
	event: {
		bg: "bg-amber-50",
		border: "border-l-amber-400",
		text: "text-amber-900",
		badge: "bg-amber-100 text-amber-700"
	}
};
function DayView({ currentDate, items, onCreateTask }) {
	const dayItems = getItemsForDay$1(items, currentDate);
	const today = /* @__PURE__ */ new Date();
	const isToday = isSameDay$1(currentDate, today);
	const currentHour = today.getHours();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex-1 flex min-h-0 overflow-hidden gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-[320px] shrink-0 flex flex-col gap-3 overflow-y-auto scrollbar-none pr-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "text-xs font-bold text-secondary/40 uppercase tracking-wider",
					children: [
						dayItems.length,
						" item",
						dayItems.length !== 1 ? "s" : "",
						" neste dia"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => onCreateTask(currentDate),
					className: "text-xs font-bold text-secondary hover:text-secondary/80 bg-transparent border-none cursor-pointer transition-colors",
					children: "+ Tarefa"
				})]
			}), dayItems.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 flex flex-col items-center justify-center py-12 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "size-12 rounded-full bg-zinc-100 flex items-center justify-center mb-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xl",
							children: "📅"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold text-secondary/40",
						children: "Nenhum item"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-secondary/30 mt-1",
						children: "Este dia está livre"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-2",
				children: dayItems.map((item) => {
					const styles = TYPE_STYLES[item.type];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `
                    ${styles.bg} border-l-3 ${styles.border} rounded-r-xl p-3
                    transition-all duration-200 hover:shadow-md cursor-default
                    animate-calendar-item-in
                  `,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `text-sm font-semibold ${styles.text} truncate`,
									children: item.title
								}), item.projectName && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-secondary/50 mt-0.5 truncate",
									children: item.projectName
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `${styles.badge} text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap`,
								children: TYPE_LABELS[item.type]
							})]
						}), item.status && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] font-semibold text-secondary/40",
								children: ["Status: ", item.status.replace(/_/g, " ")]
							}), item.priority && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] font-semibold text-secondary/40",
								children: ["• ", item.priority]
							})]
						})]
					}, `${item.type}-${item.id}`);
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex-1 overflow-y-auto scrollbar-none border-l border-zinc-200 pl-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative min-h-[1440px]",
				children: [HOURS.map((hour) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "h-[60px] flex border-b border-zinc-100/60 group",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-14 shrink-0 flex items-start justify-end pr-3 pt-0.5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10px] font-semibold text-secondary/25",
							children: [hour.toString().padStart(2, "0"), ":00"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-1 hover:bg-zinc-50/50 transition-colors cursor-pointer",
						onClick: () => onCreateTask(currentDate)
					})]
				}, hour)), isToday && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute left-14 right-0 flex items-center z-10 pointer-events-none",
					style: { top: `${currentHour / 24 * 1440 + today.getMinutes() / 60 * 60}px` },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-2 rounded-full bg-red-500 -ml-1 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1 h-[1.5px] bg-red-500" })]
				})]
			})
		})]
	});
}
var MONTH_NAMES = [
	"Jan",
	"Fev",
	"Mar",
	"Abr",
	"Mai",
	"Jun",
	"Jul",
	"Ago",
	"Set",
	"Out",
	"Nov",
	"Dez"
];
var WEEKDAY_LABELS = [
	"D",
	"S",
	"T",
	"Q",
	"Q",
	"S",
	"S"
];
function getMonthDays(year, month) {
	const firstDay = new Date(year, month, 1);
	const lastDay = new Date(year, month + 1, 0);
	const startPad = firstDay.getDay();
	const totalDays = lastDay.getDate();
	const days = [];
	for (let i = 0; i < startPad; i++) days.push(null);
	for (let i = 1; i <= totalDays; i++) days.push(i);
	return days;
}
function hasItemsOnDay(items, year, month, day) {
	const date = new Date(year, month, day);
	const result = {
		project: false,
		task: false,
		event: false
	};
	for (const item of items) {
		const itemDate = new Date(item.start);
		if (itemDate.getFullYear() === year && itemDate.getMonth() === month && itemDate.getDate() === day || item.end && date >= new Date(item.start) && date <= new Date(item.end)) result[item.type] = true;
	}
	return result;
}
function YearView({ currentDate, items, onSelectMonth }) {
	const year = currentDate.getFullYear();
	const today = /* @__PURE__ */ new Date();
	const todayYear = today.getFullYear();
	const todayMonth = today.getMonth();
	const todayDate = today.getDate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex-1 overflow-y-auto scrollbar-none",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-4 gap-4 p-2",
			children: Array.from({ length: 12 }, (_, month) => {
				const days = getMonthDays(year, month);
				const isCurrentMonth = year === todayYear && month === todayMonth;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => onSelectMonth(month),
					className: `
                bg-transparent border border-zinc-100 rounded-2xl p-3 cursor-pointer
                transition-all duration-200 hover:border-primary/40 hover:shadow-md hover:scale-[1.02]
                text-left
                ${isCurrentMonth ? "ring-1 ring-primary/30 border-primary/20" : ""}
              `,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: `text-sm font-bold mb-2 ${isCurrentMonth ? "text-secondary" : "text-secondary/70"}`,
							children: MONTH_NAMES[month]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-7 mb-0.5",
							children: WEEKDAY_LABELS.map((label, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[8px] font-bold text-secondary/20 text-center",
								children: label
							}, i))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-7 gap-y-0.5",
							children: days.map((day, i) => {
								if (day === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4" }, i);
								const isToday = year === todayYear && month === todayMonth && day === todayDate;
								const activity = hasItemsOnDay(items, year, month, day);
								const hasAny = activity.project || activity.task || activity.event;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "h-4 flex flex-col items-center justify-center relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `
                          text-[9px] font-semibold leading-none
                          ${isToday ? "bg-secondary text-white rounded-full size-3.5 flex items-center justify-center" : ""}
                          ${!isToday && hasAny ? "text-secondary" : "text-secondary/30"}
                        `,
										children: day
									}), hasAny && !isToday && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-px mt-px",
										children: [
											activity.project && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-[3px] rounded-full bg-primary" }),
											activity.task && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-[3px] rounded-full bg-blue-400" }),
											activity.event && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-[3px] rounded-full bg-amber-400" })
										]
									})]
								}, i);
							})
						})
					]
				}, month);
			})
		})
	});
}
function isSameDay(a, b) {
	return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function getItemsForDay(items, date) {
	return items.filter((item) => {
		const itemDate = new Date(item.start);
		if (isSameDay(itemDate, date)) return true;
		if (item.end) {
			const endDate = new Date(item.end);
			return date >= itemDate && date <= endDate;
		}
		return false;
	});
}
var MONTHS = [
	"Janeiro",
	"Fevereiro",
	"Março",
	"Abril",
	"Maio",
	"Junho",
	"Julho",
	"Agosto",
	"Setembro",
	"Outubro",
	"Novembro",
	"Dezembro"
];
var TYPE_CONFIG = {
	project: {
		label: "Projetos",
		dotColor: "bg-primary",
		bg: "bg-primary/10",
		text: "text-secondary"
	},
	task: {
		label: "Tarefas",
		dotColor: "bg-blue-400",
		bg: "bg-blue-50",
		text: "text-blue-800"
	},
	event: {
		label: "Eventos",
		dotColor: "bg-amber-400",
		bg: "bg-amber-50",
		text: "text-amber-800"
	}
};
function formatTime(date) {
	return date.toLocaleTimeString("pt-BR", {
		hour: "2-digit",
		minute: "2-digit"
	});
}
function ActivityPanel({ selectedDate, items, onClose }) {
	if (!selectedDate) return null;
	const dayItems = getItemsForDay(items, selectedDate);
	const grouped = {
		project: dayItems.filter((i) => i.type === "project"),
		task: dayItems.filter((i) => i.type === "task"),
		event: dayItems.filter((i) => i.type === "event")
	};
	const formattedDate = `${selectedDate.getDate()} de ${MONTHS[selectedDate.getMonth()]}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-[280px] shrink-0 border-l border-zinc-200 pl-4 flex flex-col min-h-0 animate-calendar-panel-in",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-4 shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-bold text-secondary",
					children: "Atividades"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "size-6 flex items-center justify-center rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer bg-transparent border-none",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Xmark, { className: "size-3.5 text-secondary/50" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold text-secondary/50 mb-3 shrink-0",
				children: formattedDate
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 overflow-y-auto scrollbar-none space-y-4",
				children: dayItems.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center justify-center py-8 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-2xl mb-2",
							children: "✨"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold text-secondary/40",
							children: "Dia livre!"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-secondary/30 mt-0.5",
							children: "Nenhuma atividade programada"
						})
					]
				}) : [
					"project",
					"task",
					"event"
				].map((type) => {
					const typeItems = grouped[type];
					if (typeItems.length === 0) return null;
					const config = TYPE_CONFIG[type];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 mb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `size-2 rounded-full ${config.dotColor}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-bold text-secondary/40 uppercase tracking-wider",
							children: config.label
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-1.5",
						children: typeItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `
                        ${config.bg} rounded-xl p-2.5 transition-all duration-200 
                        hover:shadow-sm cursor-default animate-calendar-item-in
                      `,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: `text-xs font-semibold ${config.text} truncate`,
								children: item.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 mt-1",
								children: [item.start && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-secondary/40 font-medium",
									children: formatTime(new Date(item.start))
								}), item.status && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] text-secondary/40 font-medium",
									children: ["• ", item.status.replace(/_/g, " ")]
								})]
							})]
						}, `${item.type}-${item.id}`))
					})] }, type);
				})
			})
		]
	});
}
function Calendario() {
	const [viewMode, setViewMode] = (0, import_react.useState)("month");
	const [currentDate, setCurrentDate] = (0, import_react.useState)(/* @__PURE__ */ new Date());
	const [selectedDate, setSelectedDate] = (0, import_react.useState)(null);
	const [isCreateModalOpen, setIsCreateModalOpen] = (0, import_react.useState)(false);
	const queryClient = useQueryClient();
	const { data: items = [] } = useQuery({
		queryKey: ["calendar-items"],
		queryFn: () => fetchCalendarItems()
	});
	const { mutate: mutateCreate, isPending: isCreating, error: createError, reset: resetCreate } = useMutation({
		mutationFn: (data) => createTask(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["calendar-items"] });
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
			queryClient.invalidateQueries({ queryKey: ["dashboard"] });
			setIsCreateModalOpen(false);
		}
	});
	const handleNavigate = (0, import_react.useCallback)((direction) => {
		setCurrentDate((prev) => {
			if (direction === "today") return /* @__PURE__ */ new Date();
			const d = new Date(prev);
			const delta = direction === "prev" ? -1 : 1;
			switch (viewMode) {
				case "day":
					d.setDate(d.getDate() + delta);
					break;
				case "week":
					d.setDate(d.getDate() + delta * 7);
					break;
				case "month":
					d.setMonth(d.getMonth() + delta);
					break;
				case "year":
					d.setFullYear(d.getFullYear() + delta);
					break;
			}
			return d;
		});
	}, [viewMode]);
	const handleSelectDate = (0, import_react.useCallback)((date) => {
		setSelectedDate((prev) => {
			if (prev && prev.getTime() === date.getTime()) return null;
			return date;
		});
	}, []);
	const handleSelectMonth = (0, import_react.useCallback)((month) => {
		setCurrentDate((prev) => {
			const d = new Date(prev);
			d.setMonth(month);
			return d;
		});
		setViewMode("month");
	}, []);
	const handleCreateTaskFromCalendar = (0, import_react.useCallback)((_date) => {
		setIsCreateModalOpen(true);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white rounded-[24px] p-6 flex flex-col min-w-0 min-h-0 flex-1 overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarHeader, {
					currentDate,
					viewMode,
					onViewModeChange: (0, import_react.useCallback)((mode) => {
						setViewMode(mode);
						if (mode === "day" && selectedDate) setCurrentDate(selectedDate);
					}, [selectedDate]),
					onNavigate: handleNavigate,
					onAddTask: () => setIsCreateModalOpen(true)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 flex min-h-0 overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 flex flex-col min-h-0 min-w-0",
					children: [
						viewMode === "month" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthView, {
							currentDate,
							items,
							selectedDate,
							onSelectDate: handleSelectDate
						}),
						viewMode === "week" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeekView, {
							currentDate,
							items,
							selectedDate,
							onSelectDate: handleSelectDate
						}),
						viewMode === "day" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DayView, {
							currentDate,
							items,
							onCreateTask: handleCreateTaskFromCalendar
						}),
						viewMode === "year" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(YearView, {
							currentDate,
							items,
							onSelectMonth: handleSelectMonth
						})
					]
				}), selectedDate && (viewMode === "month" || viewMode === "week") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityPanel, {
					selectedDate,
					items,
					onClose: () => setSelectedDate(null)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreateTaskModal, {
				isOpen: isCreateModalOpen,
				onClose: () => {
					setIsCreateModalOpen(false);
					resetCreate();
				},
				onSubmit: (data) => mutateCreate(data),
				isPending: isCreating,
				error: createError ? Array.isArray(createError.response?.data?.message) ? createError.response.data.message.join(", ") : createError.response?.data?.message || createError.message : null
			})
		]
	});
}
//#endregion
export { Calendario as component };
