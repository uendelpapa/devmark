import { o as __toESM } from "./_runtime.mjs";
import { i as require_react } from "./_libs/dnd-kit__accessibility+react.mjs";
import { S as Avatar, T as require_jsx_runtime, b as CardContent, d as Tooltip, x as Button, y as Card } from "./_libs/@heroui/react+[...].mjs";
import { _ as fetchDashboardData } from "./_ssr/api-CPpqugVW.mjs";
import { n as useQuery } from "./_libs/tanstack__react-query.mjs";
import { B as CircleChevronDown, C as FolderArrowRight, D as FilePlus, L as CircleInfo, N as Comment, Y as ArrowUpRightFromSquare, s as Plus, z as CircleChevronUp } from "./_libs/gravity-ui__icons.mjs";
import { n as TimerTracker } from "./_ssr/TimerTracker-CidYLMp3.mjs";
import { t as Button$1 } from "./_ssr/Button-CKIMbDdG.mjs";
import { p as useNavigate } from "./_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_authenticated-BLrJ_EqS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var StatCard = (0, import_react.memo)(function StatCard({ title, value, indicator, diffValue, variant = "zinc", onAction }) {
	const isPrimary = variant === "primary";
	const handleActionClick = (0, import_react.useCallback)(() => {
		onAction?.(title);
	}, [onAction, title]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: `${isPrimary ? "bg-primary/50 border-primary text-secondary" : "bg-zinc-100 border-zinc-200 text-zinc-700"} border shadow-none rounded-[24px] p-6  relative`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "font-semibold",
						children: title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
						size: "lg",
						variant: "onlyIcon",
						onClick: handleActionClick,
						"aria-label": `Visualizar detalhes de ${title}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRightFromSquare, {
							width: 16,
							height: 16
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-5xl font-semibold leading-none tracking-tight block",
					children: value
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1",
					children: [
						indicator === "down" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleChevronDown, {
							className: "text-rose-500",
							width: 16,
							height: 16
						}),
						indicator === "up" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleChevronUp, {
							className: "text-[#259E00]",
							width: 16,
							height: 16
						}),
						indicator === "info" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleInfo, {
							className: "text-zinc-700",
							width: 16,
							height: 16
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm tracking-tight leading-none",
							children: indicator === "info" ? "sem alterações" : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: `font-semibold ${indicator === "down" ? "text-rose-500" : "text-[#259E00]"}`,
								children: [diffValue, " "]
							}), "referente ao mês anterior"] })
						})
					]
				})
			]
		})
	});
});
function StatCardSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "bg-zinc-100 border border-zinc-200 shadow-none rounded-[24px] p-6 text-secondary relative animate-pulse",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-5 bg-secondary/10 rounded w-1/2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-10 bg-secondary/10 rounded-xl" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-12 bg-secondary/10 rounded w-1/3 my-2" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-4 bg-secondary/10 rounded-full" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 bg-secondary/10 rounded w-2/3" })]
				})
			]
		})
	});
}
var FinanceCard = (0, import_react.memo)(function FinanceCard({ title, value, indicator, diffValue }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col shrink-0 bg-primary/50 border border-primary space-y-4 px-6 py-4 rounded-[24px] min-w-[227px]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-medium text-secondary",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-3xl font-bold text-secondary",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1",
				children: [
					indicator === "down" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleChevronDown, {
						className: "text-rose-500",
						width: 16,
						height: 16
					}),
					indicator === "up" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleChevronUp, {
						className: "text-[#259E00]",
						width: 16,
						height: 16
					}),
					indicator === "info" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleInfo, {
						className: "text-secondary",
						width: 16,
						height: 16
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-secondary tracking-tight leading-none",
						children: indicator === "info" ? "Sem alterações" : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: `font-semibold ${indicator === "down" ? "text-rose-500" : "text-[#259E00]"}`,
							children: [diffValue, " "]
						}), "referente ao mês anterior"] })
					})
				]
			})
		]
	});
});
function FinanceCardSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col shrink-0 bg-primary/20 border border-zinc-200/50 space-y-4 px-6 py-4 rounded-[24px] min-w-[200px] animate-pulse",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-semibold bg-secondary/10 rounded h-4 w-1/2" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-3xl font-bold bg-secondary/10 rounded h-8 w-2/3" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5 text-sm font-semibold text-secondary",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-4 bg-secondary/10 rounded-full" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-normal bg-secondary/10 rounded h-4 w-1/2" })]
			})
		]
	});
}
var ProjectListItem = (0, import_react.memo)(function ProjectListItem({ id, name, date, avatarUrl = "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg", onAction }) {
	const handleActionClick = (0, import_react.useCallback)(() => {
		onAction?.(id);
	}, [onAction, id]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between py-1 border-b border-zinc-200 last:border-0 w-full min-w-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3 min-w-0 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
				className: "size-9 shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar.Image, {
					alt: name,
					src: avatarUrl
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar.Fallback, { children: name.substring(0, 2).toUpperCase() })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1 -space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-bold text-[14px] text-zinc-700 truncate",
					children: name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[12px] font-medium text-zinc-600 truncate",
					children: ["Entregar ", date]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			className: "w-8 h-8 min-w-8 p-0 rounded-lg hover:bg-secondary/5 flex items-center justify-center cursor-pointer text-secondary/80 hover:text-secondary border-none bg-transparent shrink-0",
			onClick: handleActionClick,
			"aria-label": `Visualizar detalhes do projeto ${name}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderArrowRight, {
				width: 16,
				height: 16
			})
		})]
	});
});
function ProjectListItemSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between py-1 border-b border-secondary/5 last:border-0 animate-pulse w-full min-w-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3 min-w-0 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-9 rounded-full bg-secondary/10 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1 min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3.5 bg-secondary/10 rounded w-24" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2.5 bg-secondary/10 rounded w-16" })]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-8 h-8 rounded-lg bg-secondary/10 shrink-0" })]
	});
}
var PaymentListItem = (0, import_react.memo)(function PaymentListItem({ name, email, avatarUrl = "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg", onAction }) {
	const handleActionClick = (0, import_react.useCallback)(() => {
		onAction?.(name);
	}, [onAction, name]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3 min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
				className: "size-9 shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar.Image, {
					alt: name,
					src: avatarUrl
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar.Fallback, { children: name.substring(0, 2).toUpperCase() })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-bold text-[13px] leading-none text-zinc-700 truncate",
					children: name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] opacity-70 font-semibold leading-none mt-1 text-zinc-700 text-ellipsis overflow-hidden whitespace-nowrap max-w-[110px]",
					children: email
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			className: "w-8 h-8 min-w-8 p-0 rounded-lg hover:bg-secondary/5 flex items-center justify-center cursor-pointer text-secondary/70 hover:text-secondary shrink-0 border-none bg-transparent",
			onClick: handleActionClick,
			"aria-label": `Comentar sobre o pagamento de ${name}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Comment, {
				width: 16,
				height: 16
			})
		})]
	});
});
function PaymentListItemSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between animate-pulse",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3 min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-9 rounded-full bg-secondary/10 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1 min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3.5 bg-secondary/10 rounded w-20" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2.5 bg-secondary/10 rounded w-28" })]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-8 h-8 rounded-lg bg-secondary/10 shrink-0" })]
	});
}
function formatCurrency(value) {
	return `R$ ${value.toLocaleString("pt-BR")}`;
}
function mapProjectSummaryToStatCards(data) {
	const { total, completed, in_progress, planning } = data.project_summary;
	const prev = data.prev_project_summary || {
		total: 0,
		completed: 0,
		in_progress: 0,
		planning: 0
	};
	const totalDiff = total - prev.total;
	const totalIndicator = totalDiff > 0 ? "up" : totalDiff < 0 ? "down" : "info";
	const totalDiffStr = totalDiff > 0 ? `+${totalDiff}` : totalDiff < 0 ? `${totalDiff}` : void 0;
	const completedDiff = completed - prev.completed;
	const completedIndicator = completedDiff > 0 ? "up" : completedDiff < 0 ? "down" : "info";
	const completedDiffStr = completedDiff > 0 ? `+${completedDiff}` : completedDiff < 0 ? `${completedDiff}` : void 0;
	const inProgressDiff = in_progress - prev.in_progress;
	const inProgressIndicator = inProgressDiff > 0 ? "up" : inProgressDiff < 0 ? "down" : "info";
	const inProgressDiffStr = inProgressDiff > 0 ? `+${inProgressDiff}` : inProgressDiff < 0 ? `${inProgressDiff}` : void 0;
	const planningDiff = planning - prev.planning;
	const planningIndicator = planningDiff > 0 ? "down" : planningDiff < 0 ? "up" : "info";
	const planningDiffStr = planningDiff > 0 ? `+${planningDiff}` : planningDiff < 0 ? `${planningDiff}` : void 0;
	return [
		{
			title: "Total de Projetos",
			value: total,
			indicator: totalIndicator,
			diffValue: totalDiffStr,
			variant: "primary"
		},
		{
			title: "Projetos Finalizados",
			value: completed,
			indicator: completedIndicator,
			diffValue: completedDiffStr,
			variant: "zinc"
		},
		{
			title: "Projetos Iniciados",
			value: in_progress,
			indicator: inProgressIndicator,
			diffValue: inProgressDiffStr,
			variant: "zinc"
		},
		{
			title: "Projetos Pendentes",
			value: planning,
			indicator: planningIndicator,
			diffValue: planningDiffStr,
			variant: "zinc"
		}
	];
}
function mapFinanceSummaryToCards(data) {
	const { total_paid, total_expenses, total_pending } = data.finance_summary;
	const prev = data.prev_finance_summary || {
		total_paid: 0,
		total_expenses: 0,
		total_pending: 0
	};
	const paidDiff = total_paid - prev.total_paid;
	const paidIndicator = paidDiff > 0 ? "up" : paidDiff < 0 ? "down" : "info";
	const paidDiffStr = paidDiff > 0 ? `+${formatCurrency(paidDiff)}` : paidDiff < 0 ? `-${formatCurrency(Math.abs(paidDiff))}` : void 0;
	const expensesDiff = total_expenses - prev.total_expenses;
	const expensesIndicator = expensesDiff > 0 ? "down" : expensesDiff < 0 ? "up" : "info";
	const expensesDiffStr = expensesDiff > 0 ? `+${formatCurrency(expensesDiff)}` : expensesDiff < 0 ? `-${formatCurrency(Math.abs(expensesDiff))}` : void 0;
	const pendingDiff = total_pending - prev.total_pending;
	const pendingIndicator = pendingDiff > 0 ? "up" : pendingDiff < 0 ? "down" : "info";
	const pendingDiffStr = pendingDiff > 0 ? `+${formatCurrency(pendingDiff)}` : pendingDiff < 0 ? `-${formatCurrency(Math.abs(pendingDiff))}` : void 0;
	return [
		{
			title: "Entrada",
			value: formatCurrency(total_paid),
			indicator: paidIndicator,
			diffValue: paidDiffStr
		},
		{
			title: "Gastos c/ ferramentas",
			value: formatCurrency(total_expenses),
			indicator: expensesIndicator,
			diffValue: expensesDiffStr
		},
		{
			title: "A receber",
			value: formatCurrency(total_pending),
			indicator: pendingIndicator,
			diffValue: pendingDiffStr
		}
	];
}
function Home() {
	const navigate = useNavigate();
	const { data, isLoading } = useQuery({
		queryKey: ["dashboard"],
		queryFn: fetchDashboardData
	});
	const stats = (0, import_react.useMemo)(() => data ? mapProjectSummaryToStatCards(data) : [], [data]);
	const finances = (0, import_react.useMemo)(() => data ? mapFinanceSummaryToCards(data) : [], [data]);
	const projects = data?.projects || [];
	const pendingPayments = data?.pending_payments || [];
	const weeklyWorkLevel = (0, import_react.useMemo)(() => data?.weekly_work_level || [
		0,
		0,
		0,
		0,
		0,
		0,
		0
	], [data]);
	const maxHours = (0, import_react.useMemo)(() => Math.max(...weeklyWorkLevel, 0), [weeklyWorkLevel]);
	const getBarHeight = (0, import_react.useCallback)((hours, defaultHeight) => {
		if (maxHours === 0) return defaultHeight;
		const computed = Math.round(hours / maxHours * 182);
		return Math.max(computed, 20);
	}, [maxHours]);
	const handleStatCardAction = (0, import_react.useCallback)((title) => {
		let status = "ALL";
		if (title === "Projetos Finalizados") status = "COMPLETED";
		else if (title === "Projetos Iniciados") status = "IN_PROGRESS";
		else if (title === "Projetos Pendentes") status = "PLANNING";
		navigate({
			to: "/projetos",
			search: { status }
		});
	}, [navigate]);
	const handleProjectAction = (0, import_react.useCallback)((projectId) => {
		navigate({
			to: "/projetos/$projectId",
			params: { projectId }
		});
	}, [navigate]);
	const handlePaymentAction = (0, import_react.useCallback)((personName) => {
		console.log(`Enviar comentário para: ${personName}`);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white rounded-[24px] p-6 overflow-y-auto min-w-0 max-h-[calc(100vh-100px)] h-fit scrollbar-none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between items-start shrink-0 mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-medium tracking-tight text-secondary leading-none",
						children: "Dashboard"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-secondary leading-none",
						children: "Planeje, priorize e acompanhe suas tarefas com facilidade."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
						size: "lg",
						variant: "zinc",
						children: "Importar Dados"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button$1, {
						size: "lg",
						onPress: () => navigate({ to: "/projetos/novo" }),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilePlus, {
							className: "stroke-[2.5]",
							width: 16,
							height: 16
						}), " Novo Projeto"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-4 gap-2 mb-2 shrink-0",
				children: isLoading ? Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCardSkeleton, {}, i)) : stats.map((stat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					title: stat.title,
					value: stat.value,
					indicator: stat.indicator,
					diffValue: stat.diffValue,
					variant: stat.variant,
					onAction: handleStatCardAction
				}, stat.title))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-12 gap-2 items-start",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col-span-6 flex flex-col gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "p-0 bg-zinc-100 border border-zinc-200 shadow-none rounded-[24px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "space-y-4 p-0 text-zinc-700",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-semibold px-6 pt-6",
									children: "Finanças"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex gap-2 overflow-x-auto px-6 pb-6 scrollbar-none",
									children: isLoading ? Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinanceCardSkeleton, {}, i)) : finances.map((finance) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinanceCard, {
										title: finance.title,
										value: finance.value,
										indicator: finance.indicator,
										diffValue: finance.diffValue
									}, finance.title))
								})]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "bg-zinc-100 border border-zinc-200 shadow-none rounded-[24px] p-6 text-zinc-700 flex flex-col justify-between",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "p-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-semibold",
									children: "Nível de trabalho"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "w-full flex items-end justify-between gap-3 px-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-1 flex flex-col items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip.Trigger, {
												className: "w-full flex justify-center items-end",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													style: {
														height: `${getBarHeight(weeklyWorkLevel[0], 108)}px`,
														animationDelay: "0ms",
														backgroundImage: "url(/bgcharts.jpg)",
														backgroundSize: "cover",
														backgroundPosition: "center"
													},
													className: "flex w-full max-w-[256px] rounded-full chart-bar animate-grow-up"
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip.Content, {
												showArrow: true,
												placement: "top",
												className: "bg-secondary text-primary-light font-semibold text-xs py-2 px-3.5 rounded-xl shadow-lg border border-primary/10",
												children: [
													"Segunda-feira: ",
													weeklyWorkLevel[0],
													"h"
												]
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xl font-medium",
												children: "s"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-1 flex flex-col items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip.Trigger, {
												className: "w-full flex justify-center items-end",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													style: {
														height: `${getBarHeight(weeklyWorkLevel[1], 146)}px`,
														animationDelay: "60ms"
													},
													className: "flex w-full max-w-[256px] bg-[#8cb870] rounded-full chart-bar animate-grow-up"
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip.Content, {
												showArrow: true,
												placement: "top",
												className: "bg-secondary text-primary-light font-semibold text-xs py-2 px-3.5 rounded-xl shadow-lg border border-primary/10",
												children: [
													"Terça-feira: ",
													weeklyWorkLevel[1],
													"h"
												]
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xl font-medium",
												children: "t"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-1 flex flex-col items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip.Trigger, {
												className: "w-full flex justify-center items-end",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													style: {
														height: `${getBarHeight(weeklyWorkLevel[2], 88)}px`,
														animationDelay: "120ms",
														backgroundImage: "url(/bgcharts.jpg)",
														backgroundSize: "cover",
														backgroundPosition: "center"
													},
													className: "flex w-full max-w-[256px] rounded-full chart-bar animate-grow-up"
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip.Content, {
												showArrow: true,
												placement: "top",
												className: "bg-secondary text-primary-light font-semibold text-xs py-2 px-3.5 rounded-xl shadow-lg border border-primary/10",
												children: [
													"Quarta-feira: ",
													weeklyWorkLevel[2],
													"h"
												]
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xl font-medium",
												children: "q"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-1 flex flex-col items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip.Trigger, {
												className: "w-full flex justify-center items-end",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex w-full max-w-[256px] rounded-full border-[1.5px] border-secondary chart-bar animate-grow-up",
													style: {
														height: `${getBarHeight(weeklyWorkLevel[3], 182)}px`,
														backgroundImage: "radial-gradient(#8cb870 20%, transparent 20%), radial-gradient(#8cb870 20%, #BAF08A 20%)",
														backgroundSize: "6px 6px",
														backgroundPosition: "0 0, 3px 3px",
														animationDelay: "180ms"
													}
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip.Content, {
												showArrow: true,
												placement: "top",
												className: "bg-secondary text-primary-light font-semibold text-xs py-2 px-3.5 rounded-xl shadow-lg border border-primary/10",
												children: [
													"Quinta-feira: ",
													weeklyWorkLevel[3],
													"h"
												]
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xl font-medium",
												children: "q"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-1 flex flex-col items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip.Trigger, {
												className: "w-full flex justify-center items-end",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													style: {
														height: `${getBarHeight(weeklyWorkLevel[4], 120)}px`,
														animationDelay: "240ms",
														backgroundImage: "url(/bgcharts.jpg)",
														backgroundSize: "cover",
														backgroundPosition: "center"
													},
													className: "flex w-full max-w-[256px] rounded-full chart-bar animate-grow-up"
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip.Content, {
												showArrow: true,
												placement: "top",
												className: "bg-secondary text-primary-light font-semibold text-xs py-2 px-3.5 rounded-xl shadow-lg border border-primary/10",
												children: [
													"Sexta-feira: ",
													weeklyWorkLevel[4],
													"h"
												]
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xl font-medium",
												children: "s"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-1 flex flex-col items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip.Trigger, {
												className: "w-full flex justify-center items-end",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex w-full max-w-[256px] rounded-full border-[1.5px] border-secondary chart-bar animate-grow-up",
													style: {
														height: `${getBarHeight(weeklyWorkLevel[5], 86)}px`,
														backgroundImage: "radial-gradient(#8cb870 25%, transparent 25%)",
														backgroundSize: "8px 8px",
														backgroundColor: "#BAF08A",
														animationDelay: "300ms"
													}
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip.Content, {
												showArrow: true,
												placement: "top",
												className: "bg-secondary text-primary-light font-semibold text-xs py-2 px-3.5 rounded-xl shadow-lg border border-primary/10",
												children: [
													"Sábado: ",
													weeklyWorkLevel[5],
													"h"
												]
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xl font-medium",
												children: "s"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-1 flex flex-col items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip.Trigger, {
												className: "w-full flex justify-center items-end",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													style: {
														height: `${getBarHeight(weeklyWorkLevel[6], 65)}px`,
														animationDelay: "360ms",
														backgroundImage: "url(/bgcharts.jpg)",
														backgroundSize: "cover",
														backgroundPosition: "center"
													},
													className: "flex w-full max-w-[256px] rounded-full chart-bar animate-grow-up"
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip.Content, {
												showArrow: true,
												placement: "top",
												className: "bg-secondary text-primary-light font-semibold text-xs py-2 px-3.5 rounded-xl shadow-lg border border-primary/10",
												children: [
													"Domingo: ",
													weeklyWorkLevel[6],
													"h"
												]
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xl font-medium",
												children: "d"
											})]
										})
									]
								})]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-span-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "h-[540px] bg-zinc-100 border border-zinc-200 shadow-none rounded-[24px] p-6 text-zinc-700",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "p-0 flex flex-col w-full h-full",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between mb-4 shrink-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-semibold",
										children: "Projetos"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
										size: "lg",
										onPress: () => navigate({ to: "/projetos/novo" }),
										variant: "onlyIcon",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
											width: 16,
											height: 16
										})
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex-1 overflow-y-auto pr-1 flex flex-col gap-3 scrollbar-none",
									children: isLoading || projects.length === 0 ? Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectListItemSkeleton, {}, i)) : projects.map((project) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectListItem, {
										id: project.id,
										name: project.name,
										date: project.expected_delivery_date,
										onAction: handleProjectAction
									}, project.id))
								})]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col-span-3 flex flex-col gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimerTracker, { variant: "dashboard" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "bg-zinc-100 border border-zinc-200 shadow-none rounded-[24px] p-6 text-zinc-700 h-[345px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "p-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between mb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-semibold leading-tight",
										children: "Pagamentos pendentes"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-secondary/60",
										children: isLoading ? "..." : pendingPayments.length
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-col gap-3 overflow-y-auto h-[300px] scrollbar-none",
									children: isLoading || pendingPayments.length === 0 ? Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentListItemSkeleton, {}, i)) : pendingPayments.map((person) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentListItem, {
										name: person.client_name,
										email: person.client_email,
										onAction: handlePaymentAction
									}, person.payment_id))
								})]
							})
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { Home as component };
