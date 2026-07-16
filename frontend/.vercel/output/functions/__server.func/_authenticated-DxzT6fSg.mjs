import { o as __toESM } from "./_runtime.mjs";
import { i as require_react } from "./_libs/dnd-kit__accessibility+react.mjs";
import { E as require_jsx_runtime, S as Avatar } from "./_libs/@heroui/react+[...].mjs";
import { i as useAuthStore } from "./_ssr/axios-Dt9xUiMl.mjs";
import { n as logoutUser } from "./_ssr/auth-dh_aAPrw.mjs";
import { C as fetchTasks, _ as fetchClients, b as fetchProjects, x as fetchServices } from "./_ssr/api-Beqz3ccz.mjs";
import { n as useQuery } from "./_libs/tanstack__react-query.mjs";
import { G as ChartMixed, I as CircleQuestion, J as Briefcase, X as ArrowRightFromSquare, a as Sliders, h as Magnifier, l as Persons, o as Rectangles4, q as Calendar, w as Folder, y as Layers3Diagonal } from "./_libs/gravity-ui__icons.mjs";
import { n as TimerTracker, t as TimerProvider } from "./_ssr/TimerTracker-DfZmQD1A.mjs";
import { a as useLocation, c as Outlet, f as Link, p as useNavigate } from "./_libs/@tanstack/react-router+[...].mjs";
import { t as Input } from "./_ssr/Input-CBWExI6i.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_authenticated-DxzT6fSg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MenuItem({ icon: Icon, label, badge, href, onClick }) {
	const location = useLocation();
	const targetPath = href || `/${label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`;
	const active = targetPath === "/" ? location.pathname === "/" : location.pathname.startsWith(targetPath);
	const hoverColor = label === "Logout" ? "group-hover:text-red-500" : "group-hover:text-secondary/75";
	if (onClick) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		onClick,
		className: "group flex items-center gap-2 bg-transparent border-none p-0 cursor-pointer",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex justify-center items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
				className: `text-secondary ${hoverColor} transition-colors duration-100 ease-in-out`,
				width: 16,
				height: 16
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `font-semibold text-secondary ${hoverColor} transition-colors duration-100 ease-in-out`,
				children: label
			})]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: targetPath,
		className: `${active ? "border-l-4 border-l-primary rounded-l-full pl-2" : "border-l-0 border-l-transparent"} group flex items-center gap-2 transition-all duration-100 ease-in-out`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex justify-center items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
				className: `${active ? "text-secondary" : `text-secondary ${hoverColor}`} transition-colors duration-100 ease-in-out`,
				width: 16,
				height: 16
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `font-semibold ${active ? "text-secondary" : `text-secondary ${hoverColor}`} transition-colors duration-100 ease-in-out`,
				children: label
			})]
		}), badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "w-fit h-[15px] bg-secondary leading-none flex items-center justify-center text-primary-light text-[10px] font-semibold px-1 rounded-xs text-center",
			children: badge
		})]
	});
}
function Sidebar() {
	const navigate = useNavigate();
	const logout = useAuthStore((s) => s.logout);
	const [isLoggingOut, setIsLoggingOut] = (0, import_react.useState)(false);
	const { data: tasks = [] } = useQuery({
		queryKey: ["tasks"],
		queryFn: fetchTasks
	});
	const activeCount = tasks.filter((t) => t.status !== "COMPLETED" && t.status !== "CANCELED").length;
	const tasksBadge = activeCount > 0 ? `+${activeCount}` : void 0;
	const handleLogout = async () => {
		if (isLoggingOut) return;
		setIsLoggingOut(true);
		try {
			await logoutUser();
		} catch {} finally {
			logout();
			navigate({ to: "/login" });
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "w-fit bg-white h-screen flex flex-col justify-between py-6 px-8 shrink-0 select-none overflow-y-auto gap-10 sidebar-scrollbar",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-center items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/logo.svg",
						alt: "Logo"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xl font-semibold text-secondary tracking-tight mt-1",
						children: "Devmark"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-[10px] font-semibold text-secondary uppercase",
						children: "Menu"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
								icon: Rectangles4,
								label: "Dashboard",
								href: "/"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
								icon: Layers3Diagonal,
								label: "Tarefas",
								badge: tasksBadge
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
								icon: Persons,
								label: "Clientes"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
								icon: Folder,
								label: "Projetos"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
								icon: Briefcase,
								label: "Serviços"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
								icon: Calendar,
								label: "Calendario"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
								icon: ChartMixed,
								label: "Análise"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-[10px] font-semibold text-secondary uppercase",
						children: "Geral"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
								icon: Sliders,
								label: "Configurações",
								href: "/configuracoes"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
								icon: CircleQuestion,
								label: "Ajuda"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
								icon: ArrowRightFromSquare,
								label: "Logout",
								onClick: handleLogout
							})
						]
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimerTracker, {})
		})]
	});
}
function Header() {
	const user = useAuthStore((s) => s.user);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [isOpen, setIsOpen] = (0, import_react.useState)(false);
	const searchRef = (0, import_react.useRef)(null);
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		const handleClickOutside = (event) => {
			if (searchRef.current && !searchRef.current.contains(event.target)) setIsOpen(false);
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);
	const { data: projects = [] } = useQuery({
		queryKey: ["projects"],
		queryFn: fetchProjects,
		enabled: isOpen
	});
	const { data: clients = [] } = useQuery({
		queryKey: ["clients"],
		queryFn: fetchClients,
		enabled: isOpen
	});
	const { data: tasks = [] } = useQuery({
		queryKey: ["tasks"],
		queryFn: fetchTasks,
		enabled: isOpen
	});
	const { data: services = [] } = useQuery({
		queryKey: ["services"],
		queryFn: () => fetchServices(),
		enabled: isOpen
	});
	const query = searchQuery.trim().toLowerCase();
	const matchedProjects = query ? projects.filter((p) => p.name.toLowerCase().includes(query) || p.description && p.description.toLowerCase().includes(query)) : [];
	const matchedClients = query ? clients.filter((c) => c.name.toLowerCase().includes(query) || c.company_name && c.company_name.toLowerCase().includes(query) || c.email && c.email.toLowerCase().includes(query)) : [];
	const matchedTasks = query ? tasks.filter((t) => t.title.toLowerCase().includes(query) || t.description && t.description.toLowerCase().includes(query)) : [];
	const matchedServices = query ? services.filter((s) => s.title.toLowerCase().includes(query) || s.description && s.description.toLowerCase().includes(query)) : [];
	const hasResults = matchedProjects.length > 0 || matchedClients.length > 0 || matchedTasks.length > 0 || matchedServices.length > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "bg-white rounded-[24px] px-6 py-6 flex items-center justify-between shadow-xs shrink-0 relative z-30",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-90 relative",
			ref: searchRef,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				type: "text",
				value: searchQuery,
				onChange: (e) => setSearchQuery(e.target.value),
				onFocus: () => setIsOpen(true),
				placeholder: "Pesquisar...",
				variant: "zinc",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Magnifier, { className: "text-zinc-500 size-4" }),
				className: "w-[370px]"
			}), isOpen && query && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute left-0 top-full mt-2 w-96 max-h-[360px] overflow-y-auto bg-white rounded-2xl shadow-xl border border-zinc-150 py-3 z-50 flex flex-col gap-3 scrollbar-none",
				children: hasResults ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					matchedProjects.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-4 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider",
							children: "Projetos"
						}), matchedProjects.slice(0, 4).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								navigate({
									to: "/projetos/$projectId",
									params: { projectId: p.id }
								});
								setIsOpen(false);
								setSearchQuery("");
							},
							className: "w-full text-left px-4 py-2 hover:bg-zinc-50 flex flex-col gap-0.5 border-none bg-transparent cursor-pointer transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-semibold text-secondary truncate",
								children: p.name
							}), p.client_name && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-secondary/60 truncate",
								children: ["Cliente: ", p.client_name]
							})]
						}, p.id))]
					}),
					matchedClients.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col",
						children: [
							matchedProjects.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px bg-zinc-100 my-1 mx-4" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "px-4 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider",
								children: "Clientes"
							}),
							matchedClients.slice(0, 4).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									navigate({ to: "/clientes" });
									setIsOpen(false);
									setSearchQuery("");
								},
								className: "w-full text-left px-4 py-2 hover:bg-zinc-50 flex flex-col gap-0.5 border-none bg-transparent cursor-pointer transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-semibold text-secondary truncate",
									children: c.name
								}), c.company_name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-secondary/60 truncate",
									children: c.company_name
								})]
							}, c.id))
						]
					}),
					matchedServices.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col",
						children: [
							(matchedProjects.length > 0 || matchedClients.length > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px bg-zinc-100 my-1 mx-4" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "px-4 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider",
								children: "Serviços Avulsos"
							}),
							matchedServices.slice(0, 4).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									navigate({ to: "/servicos" });
									setIsOpen(false);
									setSearchQuery("");
								},
								className: "w-full text-left px-4 py-2 hover:bg-zinc-50 flex flex-col gap-0.5 border-none bg-transparent cursor-pointer transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-semibold text-secondary truncate",
									children: s.title
								}), s.client?.name && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-secondary/60 truncate",
									children: ["Cliente: ", s.client.name]
								})]
							}, s.id))
						]
					}),
					matchedTasks.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col",
						children: [
							(matchedProjects.length > 0 || matchedClients.length > 0 || matchedServices.length > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px bg-zinc-100 my-1 mx-4" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "px-4 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider",
								children: "Tarefas"
							}),
							matchedTasks.slice(0, 4).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									navigate({
										to: "/tarefas/$taskId",
										params: { taskId: t.id }
									});
									setIsOpen(false);
									setSearchQuery("");
								},
								className: "w-full text-left px-4 py-2 hover:bg-zinc-50 flex flex-col gap-0.5 border-none bg-transparent cursor-pointer transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-semibold text-secondary truncate",
									children: t.title
								}), t.client?.name && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-secondary/60 truncate",
									children: ["Projeto: ", t.client.name]
								})]
							}, t.id))
						]
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-4 py-3 text-center text-secondary/50 text-xs font-semibold",
					children: [
						"Nenhum resultado encontrado para \"",
						searchQuery,
						"\""
					]
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center gap-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/configuracoes",
				className: "flex items-center gap-2 hover:bg-zinc-100 p-1.5 rounded-xl transition-colors cursor-pointer border-none no-underline",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
					className: "size-9",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar.Fallback, {
						className: "bg-primary/50 text-secondary font-bold text-sm",
						children: user?.name?.charAt(0)?.toUpperCase() || "U"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-bold text-[14px] text-secondary leading-none",
						children: user?.name || "Usuário"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-secondary/70 font-semibold leading-none mt-1",
						children: user?.email || ""
					})]
				})]
			})
		})]
	});
}
function AuthenticatedLayout() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimerProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-screen w-screen bg-backpage font-sans overflow-hidden select-none",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 flex flex-col px-4.5 py-2.25 gap-2 h-full min-w-0 min-h-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})]
		})]
	}) });
}
//#endregion
export { AuthenticatedLayout as component };
