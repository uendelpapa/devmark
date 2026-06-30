import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { T as require_jsx_runtime } from "../_libs/@heroui/react+[...].mjs";
import { _ as startTimeEntry, g as fetchTimeEntries, h as fetchTasks, v as stopTimeEntry } from "./api-C8eLQxfJ.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { l as Play, p as Pause, r as Stop } from "../_libs/gravity-ui__icons.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/TimerTracker-Dx9KrPH7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TimerContext = (0, import_react.createContext)({
	hours: 0,
	minutes: 0,
	seconds: 0,
	isRunning: false,
	activeTaskId: null,
	setActiveTaskId: () => {},
	toggleTimer: () => {},
	startTimer: () => {},
	pauseTimer: () => {},
	resetTimer: () => {}
});
function TimerProvider({ children }) {
	const [seconds, setSeconds] = (0, import_react.useState)(0);
	const [minutes, setMinutes] = (0, import_react.useState)(0);
	const [hours, setHours] = (0, import_react.useState)(0);
	const [isRunning, setIsRunning] = (0, import_react.useState)(false);
	const [activeTaskId, setActiveTaskId] = (0, import_react.useState)(null);
	const [activeTimeEntryId, setActiveTimeEntryId] = (0, import_react.useState)(null);
	const [activeStartTime, setActiveStartTime] = (0, import_react.useState)(null);
	const queryClient = useQueryClient();
	(0, import_react.useEffect)(() => {
		fetchTimeEntries().then((entries) => {
			const running = entries.find((e) => !e.end_time);
			if (running) {
				setActiveTaskId(running.task_id);
				setActiveTimeEntryId(running.id);
				setActiveStartTime(running.start_time);
				setIsRunning(true);
				const start = new Date(running.start_time).getTime();
				const diffSeconds = Math.max(Math.floor((Date.now() - start) / 1e3), 0);
				setHours(Math.floor(diffSeconds / 3600));
				setMinutes(Math.floor(diffSeconds % 3600 / 60));
				setSeconds(diffSeconds % 60);
			}
		}).catch((err) => console.error("Error fetching running timer:", err));
	}, []);
	(0, import_react.useEffect)(() => {
		let interval;
		if (isRunning && activeStartTime) interval = setInterval(() => {
			const start = new Date(activeStartTime).getTime();
			const diffSeconds = Math.max(Math.floor((Date.now() - start) / 1e3), 0);
			setHours(Math.floor(diffSeconds / 3600));
			setMinutes(Math.floor(diffSeconds % 3600 / 60));
			setSeconds(diffSeconds % 60);
		}, 1e3);
		return () => {
			if (interval) clearInterval(interval);
		};
	}, [isRunning, activeStartTime]);
	const toggleTimer = async () => {
		if (isRunning) {
			if (activeTimeEntryId) try {
				await stopTimeEntry(activeTimeEntryId);
				queryClient.invalidateQueries({ queryKey: ["dashboard"] });
				queryClient.invalidateQueries({ queryKey: ["tasks"] });
				queryClient.invalidateQueries({ queryKey: ["projectDetails"] });
			} catch (err) {
				console.error("Error stopping timer:", err);
			}
			setIsRunning(false);
			setActiveTimeEntryId(null);
			setActiveStartTime(null);
		} else {
			if (!activeTaskId) {
				alert("Selecione uma tarefa antes de iniciar o timer.");
				return;
			}
			try {
				const task = (await queryClient.fetchQuery({
					queryKey: ["tasks"],
					queryFn: fetchTasks
				})).find((t) => t.id === activeTaskId);
				if (!task) {
					alert("Tarefa não encontrada.");
					return;
				}
				const entry = await startTimeEntry({
					project_id: task.project_id,
					task_id: task.id,
					description: `Trabalhando em: ${task.title}`
				});
				setActiveTimeEntryId(entry.id);
				setActiveStartTime(entry.start_time);
				setIsRunning(true);
			} catch (err) {
				console.error("Error starting timer:", err);
			}
		}
	};
	const startTimer = () => {
		if (!isRunning) toggleTimer();
	};
	const pauseTimer = () => {
		if (isRunning) toggleTimer();
	};
	const resetTimer = async () => {
		if (activeTimeEntryId) try {
			await stopTimeEntry(activeTimeEntryId);
			queryClient.invalidateQueries({ queryKey: ["dashboard"] });
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
			queryClient.invalidateQueries({ queryKey: ["projectDetails"] });
		} catch (err) {
			console.error("Error resetting timer:", err);
		}
		setIsRunning(false);
		setActiveTimeEntryId(null);
		setActiveStartTime(null);
		setHours(0);
		setMinutes(0);
		setSeconds(0);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimerContext.Provider, {
		value: {
			hours,
			minutes,
			seconds,
			isRunning,
			activeTaskId,
			setActiveTaskId,
			toggleTimer,
			startTimer,
			pauseTimer,
			resetTimer
		},
		children
	});
}
function useTimer() {
	return (0, import_react.useContext)(TimerContext);
}
function TimerTracker({ variant = "sidebar" }) {
	const { hours, minutes, seconds, isRunning, activeTaskId, toggleTimer, resetTimer } = useTimer();
	const { data: tasks = [] } = useQuery({
		queryKey: ["tasks"],
		queryFn: fetchTasks
	});
	const formatNumber = (num) => {
		return num.toString().padStart(2, "0");
	};
	const activeTask = tasks.find((t) => t.id === activeTaskId);
	if (variant === "dashboard") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full bg-primary/50 rounded-[24px] space-y-4 px-6 py-4 flex flex-col items-center justify-between text-secondary",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full flex flex-col items-center gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold text-center text-secondary leading-tight",
					children: "Timer Tracker"
				}), activeTask ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "max-w-60 text-secondary font-medium text-sm truncate block w-full text-center px-2",
					children: activeTask.title
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-secondary/50 text-xs italic text-center",
					children: "Nenhuma tarefa ativa"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-[36px] font-semibold leading-none tracking-tight",
				children: [
					formatNumber(hours),
					":",
					formatNumber(minutes),
					":",
					formatNumber(seconds)
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2 items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: toggleTimer,
					className: `w-[40px] h-[40px] rounded-full flex items-center justify-center transition-all cursor-pointer ${isRunning ? "bg-[#8F9E7C] hover:bg-[#7E8C6A]" : "bg-secondary text-[#EAFFE9] hover:bg-[#023c00]"}`,
					"aria-label": isRunning ? "Pause" : "Play",
					children: isRunning ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-4 text-primary-light" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4 text-primary-light" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: resetTimer,
					className: "w-[40px] h-[40px] bg-[#F48C7F] hover:bg-[#e27c6f] rounded-full flex items-center justify-center transition-all cursor-pointer text-white",
					"aria-label": "Stop",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stop, { className: "size-4 text-primary-light" })
				})]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full bg-primary/50 rounded-[24px] px-4 py-6 space-y-4 flex flex-col items-center justify-between text-secondary",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center w-full flex flex-col items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[18px] leading-none font-normal text-secondary",
					children: "Timer"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[18px] leading-none font-semibold text-secondary",
					children: "Tracker"
				})] }), activeTask ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "max-w-24 text-secondary font-bold text-[11px] truncate block w-full text-center px-2 bg-white/40 rounded-full py-1 border border-primary/20",
					children: activeTask.title
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-secondary/60 text-[11px] italic text-center",
					children: "Nenhuma tarefa"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[24px] font-medium leading-none tracking-tight",
						children: formatNumber(hours)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-1 justify-center my-1.5 opacity-60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1 rounded-full border-[1.5px] border-secondary block" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1 rounded-full border-[1.5px] border-secondary block" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[24px] font-medium leading-none tracking-tight",
						children: formatNumber(minutes)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-1 justify-center my-1.5 opacity-60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1 rounded-full border-[1.5px] border-secondary block" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1 rounded-full border-[1.5px] border-secondary block" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[24px] font-medium leading-none tracking-tight",
						children: formatNumber(seconds)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: toggleTimer,
					className: `size-[40px] rounded-full flex items-center justify-center transition-all cursor-pointer ${isRunning ? "bg-[#8F9E7C] hover:bg-[#7E8C6A]" : "bg-secondary text-[#EAFFE9] hover:bg-[#023c00]"}`,
					"aria-label": isRunning ? "Pause" : "Play",
					children: isRunning ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-4 text-primary-light" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4 text-primary-light" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: resetTimer,
					className: "size-[40px] bg-[#F48C7F] hover:bg-[#e27c6f] rounded-full flex items-center justify-center transition-all cursor-pointer text-white",
					"aria-label": "Stop",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stop, { className: "size-4 text-primary-light" })
				})]
			})
		]
	});
}
//#endregion
export { TimerTracker as n, useTimer as r, TimerProvider as t };
