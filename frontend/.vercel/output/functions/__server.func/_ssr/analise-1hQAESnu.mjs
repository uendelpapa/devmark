import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { E as require_jsx_runtime } from "../_libs/@heroui/react+[...].mjs";
import { a as Download, c as ArrowUp, l as ArrowDown, r as Plus } from "../_libs/lucide-react.mjs";
import { m as fetchAnalyticsData } from "./api-Beqz3ccz.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { F as Clock, R as CircleDollar, l as Persons, w as Folder } from "../_libs/gravity-ui__icons.mjs";
import { t as Button$1 } from "./Button-CKIMbDdG.mjs";
import { p as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as SelectItem, t as Select$1 } from "./Select-rIFcJ1Uc.mjs";
import { a as Bar, c as Cell, i as XAxis, l as Tooltip, n as BarChart, o as Area, r as YAxis, s as CartesianGrid, t as AreaChart, u as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analise-1hQAESnu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function formatCurrency(value) {
	return `R$ ${value.toLocaleString("pt-BR", {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	})}`;
}
function getAvatarColor(name) {
	const colors = [
		"bg-[#BAF08A]/30 text-secondary",
		"bg-sky-100 text-sky-700",
		"bg-purple-100 text-purple-700",
		"bg-orange-100 text-orange-700",
		"bg-pink-100 text-pink-700",
		"bg-teal-100 text-teal-700"
	];
	let sum = 0;
	for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
	return colors[sum % colors.length];
}
function getStatusBadgeClass(status) {
	switch (status.toUpperCase()) {
		case "ACTIVE": return "text-secondary bg-primary border border-lime-200";
		case "LEAD": return "text-sky-700 bg-sky-100 border border-sky-200";
		case "NEGOTIATING": return "text-purple-700 bg-purple-100 border border-purple-200";
		case "LOST": return "text-red-700 bg-red-100 border border-red-200";
		default: return "text-zinc-700 bg-zinc-100 border border-zinc-200";
	}
}
function getStatusLabel(status) {
	switch (status.toUpperCase()) {
		case "ACTIVE": return "Ativo";
		case "LEAD": return "Lead";
		case "NEGOTIATING": return "Em Negociação";
		case "LOST": return "Perdido";
		default: return status;
	}
}
var CATEGORY_COLORS = {
	AI: "#BAF08A",
	SOFTWARE: "#38BDF8",
	DOMAIN: "#C084FC",
	HOSTING: "#F472B6",
	DESIGN: "#FB923C",
	ADS: "#FACC15",
	FREELANCER: "#2DD4BF",
	OTHER: "#A9A9A9"
};
function AnalisePage() {
	const navigate = useNavigate();
	const [months, setMonths] = (0, import_react.useState)("6");
	const monthsCount = parseInt(months, 10) || 6;
	const { data: pageData, isLoading: isLoadingPage } = useQuery({
		queryKey: ["analyticsPage"],
		queryFn: () => fetchAnalyticsData(6)
	});
	const { data: chartData, isLoading: isLoadingChart, isFetching: isFetchingChart } = useQuery({
		queryKey: ["analyticsChart", monthsCount],
		queryFn: () => fetchAnalyticsData(monthsCount)
	});
	const kpis = (0, import_react.useMemo)(() => pageData?.kpis || {
		revenue: {
			value: 0,
			diff: 0,
			isPositive: true
		},
		conversion: {
			value: 0,
			diff: 0,
			isPositive: true
		},
		activeProjects: {
			value: 0,
			diff: 0,
			isPositive: true
		},
		hours: {
			value: 0,
			diff: 0,
			isPositive: true
		}
	}, [pageData]);
	const quickStats = (0, import_react.useMemo)(() => chartData?.quickStats || {
		totalRecebido: 0,
		totalDespesas: 0,
		saldoLiquido: 0
	}, [chartData]);
	const monthlyData = (0, import_react.useMemo)(() => chartData?.monthlyData || [], [chartData]);
	const crmFunnel = (0, import_react.useMemo)(() => pageData?.crmFunnel || [], [pageData]);
	const totalClients = (0, import_react.useMemo)(() => crmFunnel.reduce((acc, curr) => acc + curr.count, 0), [crmFunnel]);
	const costDistribution = (0, import_react.useMemo)(() => pageData?.costDistribution || [], [pageData]);
	const topClients = (0, import_react.useMemo)(() => pageData?.topClients || [], [pageData]);
	const workedHoursByProject = (0, import_react.useMemo)(() => pageData?.workedHoursByProject || [], [pageData]);
	const CustomTooltip = ({ active, payload, label }) => {
		if (active && payload && payload.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-secondary/20 backdrop-blur-sm text-primary-light p-4 rounded-[20px] shadow-2xl border border-secondary/5 text-xs font-semibold space-y-1.5 z-50",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-1 text-secondary font-bold",
				children: label
			}), payload.map((pld, index) => {
				const isHours = pld.name.includes("Horas");
				const isCount = pld.name === "Criadas" || pld.name === "Concluídas" || pld.name.includes("Demandas");
				const displayValue = isHours ? `${pld.value}h` : isCount ? pld.value : formatCurrency(pld.value);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "size-2 rounded-full",
						style: { backgroundColor: pld.color || pld.fill }
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-secondary",
						children: [
							pld.name,
							": ",
							displayValue
						]
					})]
				}, index);
			})]
		});
		return null;
	};
	if (isLoadingPage) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white rounded-[24px] p-6 overflow-y-auto min-w-0 max-h-[calc(100vh-100px)] h-fit scrollbar-none flex flex-col gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex justify-between items-center animate-pulse",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-48 bg-zinc-200 rounded-lg" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-72 bg-zinc-200 rounded-lg" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-44 bg-zinc-200 rounded-full" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-12 gap-4 animate-pulse",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "col-span-4 grid grid-cols-2 gap-4",
				children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-28 bg-zinc-100 border border-zinc-200 rounded-[24px]" }, i))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "col-span-8 h-64 bg-zinc-50 border border-zinc-200 rounded-[24px]" })]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white rounded-[24px] p-6 overflow-y-auto min-w-0 max-h-[calc(100vh-100px)] h-fit scrollbar-none flex flex-col gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between items-center shrink-0 mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-medium tracking-tight text-secondary leading-none",
					children: "Análise"
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button$1, {
						size: "lg",
						variant: "zinc",
						className: "flex items-center gap-1.5",
						onPress: () => console.log("Exportar Relatório"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), " Exportar"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button$1, {
						size: "lg",
						onPress: () => navigate({ to: "/clientes/novo" }),
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Novo Cliente"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-12 gap-2 items-stretch",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-primary/50 border border-primary rounded-3xl p-5 shadow-xs flex flex-col justify-between min-h-[140px]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between w-full",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "p-2.5 rounded-full bg-primary text-secondary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleDollar, { className: "size-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${kpis.revenue.isPositive ? "text-secondary bg-primary" : "text-red-700 bg-red-100"}`,
										children: [
											kpis.revenue.isPositive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "size-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "size-3" }),
											Math.abs(kpis.revenue.diff),
											"%"
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-bold text-secondary uppercase tracking-wider block",
										children: "Receita Total"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-2xl font-extrabold text-secondary tracking-tight",
										children: formatCurrency(kpis.revenue.value)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex justify-between items-center text-[10px] text-secondary mt-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "VS. Período anterior" })
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-zinc-100 border border-zinc-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between min-h-[140px]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between w-full",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "p-2.5 rounded-full bg-zinc-300 text-zinc-800",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Persons, { className: "size-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${kpis.conversion.isPositive ? "text-secondary bg-primary" : "text-red-700 bg-red-100"}`,
										children: [
											kpis.conversion.isPositive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "size-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "size-3" }),
											Math.abs(kpis.conversion.diff),
											"%"
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-bold text-zinc-800 uppercase tracking-wider block",
										children: "Taxa de Conversão"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-2xl font-extrabold text-zinc-800 tracking-tight",
										children: [kpis.conversion.value, "%"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex justify-between items-center text-[10px] text-zinc-500 mt-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "VS. Período anterior" })
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-zinc-100 border border-zinc-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between min-h-[140px]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between w-full",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "p-2.5 rounded-full bg-zinc-300 text-zinc-800",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, { className: "size-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${kpis.activeProjects.isPositive ? "text-secondary bg-primary" : "text-red-700 bg-red-100"}`,
										children: [
											kpis.activeProjects.isPositive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "size-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "size-3" }),
											Math.abs(kpis.activeProjects.diff),
											"%"
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-bold text-zinc-800 uppercase tracking-wider block",
										children: "Projetos Ativos"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-2xl font-extrabold text-secondary tracking-tight",
										children: kpis.activeProjects.value
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex justify-between items-center text-[10px] text-zinc-500 mt-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "VS. Período anterior" })
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-zinc-100 border border-zinc-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between min-h-[140px]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between w-full",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "p-2.5 rounded-full bg-zinc-300 text-zinc-800",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${kpis.hours.isPositive ? "text-secondary bg-primary" : "text-red-700 bg-red-100"}`,
										children: [
											kpis.hours.isPositive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "size-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "size-3" }),
											Math.abs(kpis.hours.diff),
											"%"
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-bold text-zinc-800 uppercase tracking-wider block",
										children: "Horas Trabalhadas"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-2xl font-extrabold text-zinc-800 tracking-tight",
										children: [kpis.hours.value, "h"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex justify-between items-center text-[10px] text-zinc-500 mt-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "VS. Período anterior" })
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "group relative lg:col-span-7 bg-primary/50 border border-primary p-6 rounded-3xl flex flex-col justify-between min-h-[300px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full mb-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-extrabold text-base text-secondary",
								children: "Desempenho Financeiro"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-secondary",
								children: "Fluxo histórico de receitas recebidas mensais."
							})] }),
							isLoadingChart || isFetchingChart ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "hidden sm:flex items-center gap-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-20 bg-primary rounded-2xl animate-pulse" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-20 bg-primary rounded-2xl animate-pulse" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-20 bg-primary rounded-2xl animate-pulse" })
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-6 text-left",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-semibold text-secondary uppercase tracking-wider block",
										children: "Total Recebido"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-bold text-secondary",
										children: formatCurrency(quickStats.totalRecebido)
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-semibold text-secondary uppercase tracking-wider block",
										children: "Despesas"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-bold text-orange-600",
										children: formatCurrency(quickStats.totalDespesas)
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-semibold text-secondary uppercase tracking-wider block",
										children: "Saldo Líquido"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-bold text-lime-600",
										children: formatCurrency(quickStats.saldoLiquido)
									})] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select$1, {
								selectedKey: months,
								onSelectionChange: (key) => setMonths(key),
								ariaLabel: "Filtrar histórico",
								variant: "primary",
								className: "absolute bottom-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto",
								triggerClassName: "!text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										id: "3",
										textValue: "Mensal: 3M",
										children: "Mensal: 3M"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										id: "6",
										textValue: "Mensal: 6M",
										children: "Mensal: 6M"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										id: "12",
										textValue: "Mensal: 12M",
										children: "Mensal: 12M"
									})
								]
							})
						]
					}), isLoadingChart || isFetchingChart ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 flex flex-col justify-between gap-4 animate-pulse w-full",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-6 text-left sm:hidden mb-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-20 bg-zinc-100 rounded-md" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-20 bg-zinc-100 rounded-md" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-20 bg-zinc-100 rounded-md" })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 bg-zinc-50/50 border border-zinc-100 rounded-2xl h-56 w-full flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-11/12 h-5/6 flex items-end justify-between px-4 pb-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-full h-full border-b-2 border-l-2 border-dashed border-zinc-200/60 relative",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute inset-0 flex items-center justify-center font-bold text-xs text-zinc-400",
										children: "Carregando dados..."
									})
								})
							})
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-56 w-full mt-2",
						children: monthlyData.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full flex items-center justify-center text-sm text-secondary",
							children: "Sem dados históricos."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
								data: monthlyData,
								margin: {
									top: 5,
									right: 10,
									left: -25,
									bottom: 0
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
										id: "colorRevenuePerformance",
										x1: "0",
										y1: "0",
										x2: "0",
										y2: "1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "5%",
											stopColor: "#011D00",
											stopOpacity: .25
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "95%",
											stopColor: "#011D00",
											stopOpacity: .01
										})]
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										vertical: false,
										stroke: ""
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "month",
										stroke: "#011d00",
										fontSize: 10,
										tickLine: false,
										axisLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										stroke: "#011d00",
										fontSize: 10,
										tickLine: false,
										axisLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomTooltip, {}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
										type: "monotone",
										name: "Receitas",
										dataKey: "receita",
										stroke: "#011D00",
										strokeWidth: 3,
										fillOpacity: 1,
										fill: "url(#colorRevenuePerformance)"
									})
								]
							})
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-12 gap-2 items-stretch",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-5 bg-zinc-100 border border-zinc-200 p-6 rounded-3xl flex flex-col justify-between min-h-[300px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between items-center w-full mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-extrabold text-base text-zinc-800",
							children: "Alocação de Tempo"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-zinc-500",
							children: "Tempo dedicado por projeto (horas)."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-bold bg-zinc-200 text-zinc-600 px-2 py-0.5 rounded-full uppercase",
							children: "Semanal"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-56 w-full mt-2",
						children: workedHoursByProject.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full flex items-center justify-center text-sm text-zinc-400",
							children: "Sem horas registradas."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: workedHoursByProject,
								margin: {
									top: 5,
									right: 0,
									left: -25,
									bottom: 0
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										vertical: false,
										stroke: "#f4f4f5"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "name",
										stroke: "#a1a1aa",
										fontSize: 10,
										tickLine: false,
										axisLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										stroke: "#a1a1aa",
										fontSize: 10,
										tickLine: false,
										axisLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomTooltip, {}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										name: "Horas Trabalhadas",
										dataKey: "hours",
										fill: "#011D00",
										radius: [
											6,
											6,
											0,
											0
										],
										barSize: 16,
										children: workedHoursByProject.map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: index % 2 === 0 ? "#011D00" : "#BAF08A" }, `cell-${index}`))
									})
								]
							})
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-7 bg-zinc-100 border border-zinc-200 p-6 rounded-3xl flex flex-col justify-between min-h-[300px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row justify-between sm:items-center gap-4 w-full mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-extrabold text-base text-zinc-800",
							children: "Pipeline do Funil de Leads"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-zinc-500",
							children: "Distribuição e taxa de conversão dos clientes ativos no funil."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-bold text-zinc-500 uppercase tracking-wider block",
								children: "Clientes Totais"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-base font-black text-secondary",
								children: totalClients
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-bold text-zinc-500 uppercase tracking-wider block",
								children: "Conversão de Leads"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-base font-black text-secondary",
								children: [kpis.conversion.value, "%"]
							})] })]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-1 flex flex-col justify-center w-full px-2 py-4",
						children: crmFunnel.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-zinc-400 text-center py-10",
							children: "Funil vazio."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full",
							children: crmFunnel.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: { borderLeft: `4px solid ${item.color}` },
									className: "flex-1 bg-white border border-zinc-200/60 p-5 rounded-2xl flex flex-col gap-1 shadow-xs hover:border-zinc-300 transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] uppercase font-bold text-zinc-500 tracking-wider",
										children: item.stage
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-baseline mt-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-2xl font-black text-secondary",
											children: item.count
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											style: {
												color: item.color,
												backgroundColor: `${item.color}15`
											},
											className: "text-xs font-bold px-2 py-0.5 rounded-lg",
											children: [item.percentage, "%"]
										})]
									})]
								}), idx < crmFunnel.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex justify-center items-center h-full text-zinc-800 shrink-0 font-black text-xl rotate-90 sm:rotate-0 my-1 sm:my-0",
									children: "→"
								})]
							}, idx))
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-12 gap-2 items-stretch",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg:col-span-4 bg-primary/50 border border-primary p-6 rounded-3xl flex flex-col gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-between items-center w-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-extrabold text-base text-secondary",
								children: "Desempenho por Cliente"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-secondary ",
								children: [
									"Clientes mais valiosos ordenados pelo ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									" volume financeiro gerado."
								]
							})] })
						}), topClients.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-zinc-400 text-center py-10 flex-1 flex items-center justify-center",
							children: "Nenhuma receita faturada para clientes neste período."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto scrollbar-none flex-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-left border-collapse text-xs text-secondary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-b border-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-wider",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3.5 w-12 text-center",
											children: "#"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3.5",
											children: "Cliente"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3.5 text-center",
											children: "Projetos"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3.5 text-center",
											children: "Status"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3.5 text-right",
											children: "Volume"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3.5 text-right w-40",
											children: "Participação"
										})
									]
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
									className: "divide-y divide-secondary/10 font-medium",
									children: topClients.map((client, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "hover:bg-secondary/20 transition-colors",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3 text-center text-zinc-800 font-bold",
												children: index + 1
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: `size-9 rounded-full flex items-center justify-center  font-bold text-xs shrink-0 ${getAvatarColor(client.name)}`,
														children: client.name.charAt(0).toUpperCase()
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex flex-col min-w-0",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-bold text-zinc-800 truncate",
															children: client.name
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[10px] text-zinc-800 truncate",
															children: client.companyName
														})]
													})]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3 text-center text-zinc-800 font-semibold",
												children: client.projectsCount
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3 text-center",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-block ${getStatusBadgeClass(client.status)}`,
													children: getStatusLabel(client.status)
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3 text-right text-zinc-800 text-nowrap font-bold",
												children: formatCurrency(client.billed)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-end gap-2.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-zinc-800 font-bold text-[10px]",
														children: [client.percentage, "%"]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "w-16 h-1.5 bg-white rounded-full overflow-hidden shrink-0",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "bg-primary h-full rounded-full",
															style: { width: `${client.percentage}%` }
														})
													})]
												})
											})
										]
									}, client.id))
								})]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg:col-span-4 bg-zinc-100 border border-zinc-200 p-6 rounded-3xl flex flex-col justify-between min-h-[300px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between items-center w-full mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-extrabold text-base text-zinc-800",
								children: "Volume de Serviço"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-zinc-500",
								children: "Histórico de demandas criadas e concluídas por mês."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-end gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded bg-secondary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-bold text-zinc-600 uppercase",
										children: "Criadas"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded bg-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-bold text-zinc-600 uppercase",
										children: "Concluídas"
									})]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-56 w-full mt-2",
							children: monthlyData.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full flex items-center justify-center text-sm text-zinc-500",
								children: "Sem histórico de demandas."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
									data: monthlyData,
									margin: {
										top: 5,
										right: 0,
										left: -25,
										bottom: 0
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											strokeDasharray: "3 3",
											vertical: false,
											stroke: "#e4e4e7"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "month",
											stroke: "#a1a1aa",
											fontSize: 10,
											tickLine: false,
											axisLine: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											stroke: "#a1a1aa",
											fontSize: 10,
											tickLine: false,
											axisLine: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomTooltip, {}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											name: "Criadas",
											dataKey: "demandasCriadas",
											fill: "#011D00",
											radius: [
												4,
												4,
												0,
												0
											],
											barSize: 14
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											name: "Concluídas",
											dataKey: "demandasConcluidas",
											fill: "#BAF08A",
											radius: [
												4,
												4,
												0,
												0
											],
											barSize: 14
										})
									]
								})
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg:col-span-4 bg-zinc-100 border border-zinc-200 p-6 rounded-3xl flex flex-col justify-between min-h-[300px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between items-center w-full mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-extrabold text-base text-secondary",
								children: "Distribuição de Despesas"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-secondary",
								children: "Total investido por categoria no período."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-bold bg-primary text-secondary px-2 py-0.5 rounded-full uppercase",
								children: "Categoria"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-56 w-full mt-2",
							children: costDistribution.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full flex items-center justify-center text-sm text-secondary",
								children: "Sem despesas registradas."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
									data: costDistribution,
									margin: {
										top: 5,
										right: 0,
										left: -25,
										bottom: 0
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											strokeDasharray: "3 3",
											vertical: false,
											stroke: ""
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "category",
											stroke: "#011d00",
											fontSize: 9,
											tickLine: false,
											axisLine: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											stroke: "#011d00",
											fontSize: 10,
											tickLine: false,
											axisLine: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomTooltip, {}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											name: "Valor Gasto",
											dataKey: "value",
											fill: "#FB923C",
											radius: [
												6,
												6,
												0,
												0
											],
											barSize: 16,
											children: costDistribution.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: CATEGORY_COLORS[entry.category] || "#FB923C" }, `cell-${index}`))
										})
									]
								})
							})
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { AnalisePage as component };
