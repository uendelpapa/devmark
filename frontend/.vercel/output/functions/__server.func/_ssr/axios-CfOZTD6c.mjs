import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { T as require_jsx_runtime } from "../_libs/@heroui/react+[...].mjs";
import { a as CircleCheck, i as CircleX, n as TriangleAlert, r as Info, t as X } from "../_libs/lucide-react.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { t as axios } from "../_libs/axios+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/axios-CfOZTD6c.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ToastManager = class {
	listeners = /* @__PURE__ */ new Set();
	subscribe(listener) {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}
	notify(message, type, duration = 4e3) {
		const toast = {
			id: Math.random().toString(36).substring(2, 9),
			message,
			type,
			duration
		};
		this.listeners.forEach((listener) => listener(toast));
	}
	success(message, duration) {
		this.notify(message, "success", duration);
	}
	error(message, duration) {
		this.notify(message, "error", duration);
	}
	warning(message, duration) {
		this.notify(message, "warning", duration);
	}
	info(message, duration) {
		this.notify(message, "info", duration);
	}
};
var toast = new ToastManager();
function ToastContainer() {
	const [toasts, setToasts] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		return toast.subscribe((newToast) => {
			setToasts((prev) => [...prev, newToast]);
		});
	}, []);
	const removeToast = (id) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-md w-full pointer-events-none",
		children: toasts.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastItem, {
			...t,
			onClose: removeToast
		}, t.id))
	});
}
function ToastItem({ id, message, type, duration = 4500, onClose }) {
	const [isExiting, setIsExiting] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const timer = setTimeout(() => {
			setIsExiting(true);
		}, duration - 200);
		const removeTimer = setTimeout(() => {
			onClose(id);
		}, duration);
		return () => {
			clearTimeout(timer);
			clearTimeout(removeTimer);
		};
	}, [
		id,
		duration,
		onClose
	]);
	const handleManualClose = () => {
		setIsExiting(true);
		setTimeout(() => {
			onClose(id);
		}, 200);
	};
	const config = {
		success: {
			bg: "bg-emerald-950/90 border-emerald-500/30 text-emerald-100",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-5 text-emerald-400 shrink-0" })
		},
		error: {
			bg: "bg-red-950/90 border-red-500/30 text-red-100",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "size-5 text-red-400 shrink-0" })
		},
		warning: {
			bg: "bg-amber-950/90 border-amber-500/30 text-amber-100",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-5 text-amber-400 shrink-0" })
		},
		info: {
			bg: "bg-zinc-900/90 border-zinc-700/50 text-zinc-100",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "size-5 text-blue-400 shrink-0" })
		}
	}[type];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `pointer-events-auto flex items-start gap-3 px-4 py-3.5 rounded-[16px] border backdrop-blur-md shadow-2xl transition-all duration-200 ${config.bg} ${isExiting ? "animate-slide-out" : "animate-slide-in"}`,
		role: "alert",
		children: [
			config.icon,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 text-[13px] font-medium leading-relaxed select-text",
				children: message
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: handleManualClose,
				className: "text-white/40 hover:text-white/80 transition-colors cursor-pointer p-0.5 rounded-md hover:bg-white/5 shrink-0",
				"aria-label": "Fechar notificação",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
			})
		]
	});
}
var useAuthStore = create((set) => ({
	user: null,
	accessToken: null,
	isAuthenticated: false,
	isLoading: true,
	setAuth: (user, accessToken) => set({
		user,
		accessToken,
		isAuthenticated: true,
		isLoading: false
	}),
	setAccessToken: (accessToken) => set({ accessToken }),
	logout: () => set({
		user: null,
		accessToken: null,
		isAuthenticated: false,
		isLoading: false
	}),
	setLoading: (isLoading) => set({ isLoading }),
	updateUser: (user) => set((state) => ({ user: {
		...state.user,
		...user
	} }))
}));
var ApiError = class extends Error {
	statusCode;
	originalError;
	constructor(message, statusCode, originalError) {
		super(message);
		this.name = "ApiError";
		this.statusCode = statusCode;
		this.originalError = originalError;
	}
};
var api = axios.create({
	baseURL: "http://localhost:3001/api",
	headers: { "Content-Type": "application/json" },
	withCredentials: true
});
api.interceptors.request.use((config) => {
	const { accessToken } = useAuthStore.getState();
	if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
	return config;
});
function getSuccessMessage(method, url) {
	const normalizedUrl = url.toLowerCase();
	if (normalizedUrl.includes("/auth/")) return null;
	if (normalizedUrl.includes("/time-entries")) return null;
	if (normalizedUrl.includes("/ai/")) return null;
	if (method === "post") {
		if (normalizedUrl.includes("/clients")) return "Cliente cadastrado com sucesso!";
		if (normalizedUrl.includes("/projects")) return "Projeto criado com sucesso!";
		if (normalizedUrl.includes("/tasks")) return "Tarefa criada com sucesso!";
		return "Item cadastrado com sucesso!";
	}
	if (method === "patch" || method === "put") {
		if (normalizedUrl.includes("/projects")) return "Projeto atualizado com sucesso!";
		if (normalizedUrl.includes("/tasks")) return "Tarefa atualizada com sucesso!";
		if (normalizedUrl.includes("/clients")) return "Cliente atualizado com sucesso!";
		return "Item atualizado com sucesso!";
	}
	if (method === "delete") {
		if (normalizedUrl.includes("/projects")) return "Projeto excluído com sucesso!";
		if (normalizedUrl.includes("/tasks")) return "Tarefa excluída com sucesso!";
		if (normalizedUrl.includes("/clients")) return "Cliente excluído com sucesso!";
		return "Item excluído com sucesso!";
	}
	return null;
}
var isRefreshing = false;
var failedQueue = [];
function processQueue(error, token = null) {
	failedQueue.forEach(({ resolve, reject }) => {
		if (error) reject(error);
		else resolve(token);
	});
	failedQueue = [];
}
api.interceptors.response.use((response) => {
	const method = response.config.method?.toLowerCase();
	const url = response.config.url || "";
	if (method && [
		"post",
		"patch",
		"put",
		"delete"
	].includes(method)) {
		const msg = getSuccessMessage(method, url);
		if (msg) toast.success(msg);
	}
	return response;
}, async (error) => {
	const originalRequest = error.config;
	const isAuthEndpoint = originalRequest?.url?.includes("/auth/login") || originalRequest?.url?.includes("/auth/register") || originalRequest?.url?.includes("/auth/refresh");
	if (error.response?.status === 401 && !originalRequest?._retry && !isAuthEndpoint) {
		if (isRefreshing) return new Promise((resolve, reject) => {
			failedQueue.push({
				resolve: (token) => {
					originalRequest.headers.Authorization = `Bearer ${token}`;
					resolve(api(originalRequest));
				},
				reject
			});
		});
		originalRequest._retry = true;
		isRefreshing = true;
		try {
			const { data } = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {}, { withCredentials: true });
			const newAccessToken = data.accessToken;
			useAuthStore.getState().setAuth(data.user, newAccessToken);
			processQueue(null, newAccessToken);
			originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
			return api(originalRequest);
		} catch (refreshError) {
			processQueue(refreshError, null);
			useAuthStore.getState().logout();
			if (!window.location.pathname.startsWith("/login")) window.location.href = "/login";
			return Promise.reject(refreshError);
		} finally {
			isRefreshing = false;
		}
	}
	let errorMessage = "Ocorreu um erro inesperado.";
	if (error.response) {
		const { status, data } = error.response;
		if (data && data.message) if (Array.isArray(data.message)) errorMessage = data.message.join("\n");
		else errorMessage = data.message;
		else switch (status) {
			case 400:
				errorMessage = "Dados inválidos. Verifique as informações preenchidas.";
				break;
			case 401:
				errorMessage = "Sessão expirada. Faça login novamente.";
				break;
			case 403:
				errorMessage = "Você não tem permissão para realizar esta ação.";
				break;
			case 404:
				errorMessage = "Recurso não encontrado no servidor.";
				break;
			case 500:
				errorMessage = "Erro interno do servidor. Tente novamente mais tarde.";
				break;
		}
	} else if (error.request) errorMessage = "Não foi possível conectar ao servidor. Verifique se o backend está ativo.";
	else errorMessage = error.message;
	if (!originalRequest?.url?.includes("/logs")) try {
		let requestDataParsed = null;
		if (originalRequest?.data) if (typeof originalRequest.data === "string") try {
			requestDataParsed = JSON.parse(originalRequest.data);
		} catch {
			requestDataParsed = originalRequest.data;
		}
		else requestDataParsed = originalRequest.data;
		const logPayload = {
			message: `HTTP Error: ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url} -> Status ${error.response?.status || "Network Error"}`,
			stack: error.stack || (/* @__PURE__ */ new Error()).stack,
			url: window.location.href,
			user_agent: navigator.userAgent,
			level: "ERROR",
			metadata: {
				errorMessage,
				status: error.response?.status,
				requestData: requestDataParsed,
				responseData: error.response?.data
			}
		};
		const token = useAuthStore.getState().accessToken;
		const headers = { "Content-Type": "application/json" };
		if (token) headers["Authorization"] = `Bearer ${token}`;
		axios.post(`${api.defaults.baseURL}/logs`, logPayload, { headers }).catch(() => {});
	} catch (logErr) {
		console.error("Failed to log error:", logErr);
	}
	if (!isAuthEndpoint) toast.error(errorMessage);
	return Promise.reject(new ApiError(errorMessage, error.response?.status, error));
});
//#endregion
export { useAuthStore as i, api as n, toast as r, ToastContainer as t };
