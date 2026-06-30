import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { T as require_jsx_runtime } from "../_libs/@heroui/react+[...].mjs";
import { i as useAuthStore, t as ToastContainer } from "./axios-CZGDF9fW.mjs";
import { r as refreshToken } from "./auth-BfHNtaDZ.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as Outlet, d as createRootRoute, i as HeadContent, l as lazyRouteComponent, m as redirect, r as Scripts, s as createRouter, u as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as string, i as object, n as boolean, r as number, t as _enum } from "../_libs/zod.mjs";
import { t as Route$12 } from "./projetos-B8X-MJgs.mjs";
import { t as Route$13 } from "./projetos_._projectId-CHatJui6.mjs";
import { t as Route$14 } from "./projetos_._projectId.editar-DtZdsYcr.mjs";
import { t as Route$15 } from "./tarefas_._taskId-reWSMbJV.mjs";
import { t as ReactQueryDevtools2 } from "../_libs/tanstack__react-query-devtools.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-8CDYbU28.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-BIJOPnEd.css";
var queryClient = new QueryClient({ defaultOptions: { queries: {
	staleTime: 1e3 * 60 * 5,
	retry: 1,
	refetchOnWindowFocus: false
} } });
var Route$11 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Devmark — Gestão de Projetos" }
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}]
	}),
	component: RootComponent,
	shellComponent: RootDocument
});
function RootComponent() {
	const isLoading = useAuthStore((s) => s.isLoading);
	const setAuth = useAuthStore((s) => s.setAuth);
	const setLoading = useAuthStore((s) => s.setLoading);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		async function restoreSession() {
			try {
				const { user, accessToken } = await refreshToken();
				if (!cancelled) setAuth(user, accessToken);
			} catch {
				if (!cancelled) setLoading(false);
			}
		}
		restoreSession();
		return () => {
			cancelled = true;
		};
	}, [setAuth, setLoading]);
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-screen w-screen items-center justify-center bg-backpage",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/logo.svg",
				alt: "Logo",
				className: "w-12 h-auto animate-pulse"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-6 h-6 border-3 border-secondary/20 border-t-secondary rounded-full animate-spin" })]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
}
function RootDocument({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "pt-BR",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
			client: queryClient,
			children: [
				children,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastContainer, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReactQueryDevtools2, {
					initialIsOpen: false,
					buttonPosition: "bottom-left"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
var $$splitComponentImporter$10 = () => import("./register-Cu_aPdT4.mjs");
var Route$10 = createFileRoute("/register")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
object({
	name: string().min(1, "Nome é obrigatório"),
	email: string().email("Endereço de e-mail inválido").min(1, "E-mail é obrigatório"),
	password: string().min(6, "A senha deve ter no mínimo 6 caracteres"),
	confirmPassword: string().min(1, "Confirme sua senha")
}).refine((data) => data.password === data.confirmPassword, {
	message: "As senhas não coincidem",
	path: ["confirmPassword"]
});
var $$splitComponentImporter$9 = () => import("./login-fnX3l4Xz.mjs");
var Route$9 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
object({
	email: string().email("Endereço de e-mail inválido").min(1, "E-mail é obrigatório"),
	password: string().min(1, "Senha é obrigatória")
});
var $$splitComponentImporter$8 = () => import("../_authenticated-9h-OBRJx.mjs");
var Route$8 = createFileRoute("/_authenticated")({
	beforeLoad: () => {
		const { isAuthenticated, isLoading } = useAuthStore.getState();
		if (isLoading) return;
		if (!isAuthenticated) throw redirect({ to: "/login" });
	},
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("../_authenticated-B7f-9eXQ.mjs");
var Route$7 = createFileRoute("/_authenticated/")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./tarefas-CvKc69-9.mjs");
var Route$6 = createFileRoute("/_authenticated/tarefas")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./configuracoes-CElz_cgg.mjs");
var Route$5 = createFileRoute("/_authenticated/configuracoes")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./clientes-Dspzjd1W.mjs");
var Route$4 = createFileRoute("/_authenticated/clientes")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./calendario-CQDwK1NT.mjs");
var Route$3 = createFileRoute("/_authenticated/calendario")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./projetos_.novo-Db_wKDAj.mjs");
var Route$2 = createFileRoute("/_authenticated/projetos_/novo")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
object({
	client_id: string().min(1, "Obrigatório"),
	name: string().min(1, "Obrigatório"),
	area: string().min(1, "Obrigatório"),
	specialty: string().min(1, "Obrigatório"),
	project_value: number().min(0, "Inválido"),
	amount_received: number().min(0, "Inválido"),
	payment_status: string().min(1, "Obrigatório"),
	start_date: string().min(1, "Obrigatório"),
	expected_delivery_date: string().min(1, "Obrigatório"),
	estimated_hours: number().min(1, "Inválido"),
	priority: string().min(1, "Obrigatório"),
	status: string().min(1, "Obrigatório"),
	create_tasks_ai: boolean()
});
var $$splitComponentImporter$1 = () => import("./projetos_.ia-Ctv3an2W.mjs");
var Route$1 = createFileRoute("/_authenticated/projetos_/ia")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./clientes_.novo-BtWCt-iv.mjs");
var Route = createFileRoute("/_authenticated/clientes_/novo")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
object({
	name: string().min(1, "Nome completo é obrigatório"),
	email: string().email("Endereço de e-mail inválido").min(1, "E-mail é obrigatório"),
	company_name: string(),
	document: string(),
	phone: string(),
	preferred_communication: _enum([
		"WHATSAPP",
		"EMAIL",
		"PHONE",
		"MEETING"
	]),
	preferred_payment_method: _enum([
		"PIX",
		"BANK_TRANSFER",
		"CREDIT_CARD",
		"CASH"
	])
});
var RegisterRoute = Route$10.update({
	id: "/register",
	path: "/register",
	getParentRoute: () => Route$11
});
var LoginRoute = Route$9.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$11
});
var AuthenticatedRoute = Route$8.update({
	id: "/_authenticated",
	getParentRoute: () => Route$11
});
var AuthenticatedIndexRoute = Route$7.update({
	id: "/",
	path: "/",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedTarefasRoute = Route$6.update({
	id: "/tarefas",
	path: "/tarefas",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedProjetosRoute = Route$12.update({
	id: "/projetos",
	path: "/projetos",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedConfiguracoesRoute = Route$5.update({
	id: "/configuracoes",
	path: "/configuracoes",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedClientesRoute = Route$4.update({
	id: "/clientes",
	path: "/clientes",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedCalendarioRoute = Route$3.update({
	id: "/calendario",
	path: "/calendario",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedTarefasTaskIdRoute = Route$15.update({
	id: "/tarefas_/$taskId",
	path: "/tarefas/$taskId",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedProjetosNovoRoute = Route$2.update({
	id: "/projetos_/novo",
	path: "/projetos/novo",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedProjetosIaRoute = Route$1.update({
	id: "/projetos_/ia",
	path: "/projetos/ia",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedProjetosProjectIdRoute = Route$13.update({
	id: "/projetos_/$projectId",
	path: "/projetos/$projectId",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedClientesNovoRoute = Route.update({
	id: "/clientes_/novo",
	path: "/clientes/novo",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedProjetosProjectIdRouteChildren = { AuthenticatedProjetosProjectIdEditarRoute: Route$14.update({
	id: "/editar",
	path: "/editar",
	getParentRoute: () => AuthenticatedProjetosProjectIdRoute
}) };
var AuthenticatedRouteChildren = {
	AuthenticatedCalendarioRoute,
	AuthenticatedClientesRoute,
	AuthenticatedConfiguracoesRoute,
	AuthenticatedProjetosRoute,
	AuthenticatedTarefasRoute,
	AuthenticatedIndexRoute,
	AuthenticatedClientesNovoRoute,
	AuthenticatedProjetosProjectIdRoute: AuthenticatedProjetosProjectIdRoute._addFileChildren(AuthenticatedProjetosProjectIdRouteChildren),
	AuthenticatedProjetosIaRoute,
	AuthenticatedProjetosNovoRoute,
	AuthenticatedTarefasTaskIdRoute
};
var rootRouteChildren = {
	AuthenticatedRoute: AuthenticatedRoute._addFileChildren(AuthenticatedRouteChildren),
	LoginRoute,
	RegisterRoute
};
var routeTree = Route$11._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
	return createRouter({
		routeTree,
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0
	});
}
//#endregion
export { getRouter };
