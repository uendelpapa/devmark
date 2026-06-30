import { n as api, r as toast } from "./axios-B7sqCQdD.mjs";
import "./auth-SemYZqoY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-CpUZCTJ1.js
function formatDate(dateString) {
	if (!dateString) return "N/A";
	try {
		const date = new Date(dateString);
		const day = date.getDate().toString().padStart(2, "0");
		const month = date.toLocaleString("pt-BR", { month: "short" }).replace(".", "");
		const year = date.getFullYear();
		return `${day} ${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
	} catch (e) {
		return dateString;
	}
}
async function fetchDashboardData() {
	try {
		const data = (await api.get("/dashboard")).data;
		const projects = (data.projects || []).map((p) => ({
			id: p.id,
			name: p.name,
			expected_delivery_date: p.expected_delivery_date ? formatDate(p.expected_delivery_date) : ""
		}));
		const pending_payments = (data.pending_payments || []).map((p) => ({
			payment_id: p.payment_id,
			amount: p.amount,
			due_date: formatDate(p.due_date),
			client_name: p.client_name,
			client_email: p.client_email
		}));
		return {
			project_summary: data.project_summary,
			finance_summary: data.finance_summary,
			projects,
			pending_payments,
			weekly_work_level: data.weekly_work_level || [
				0,
				0,
				0,
				0,
				0,
				0,
				0
			]
		};
	} catch (error) {
		const message = error instanceof Error ? error.message : "Erro ao buscar dados do dashboard";
		toast.error(`Falha ao carregar dashboard: ${message}`);
		throw error;
	}
}
async function fetchProjects() {
	const response = await api.get("/projects");
	const STATUS_ORDER = {
		IN_PROGRESS: 3,
		WAITING_CLIENT: 1,
		REVIEW: 2,
		PLANNING: 3,
		COMPLETED: 4,
		CANCELED: 5
	};
	return response.data.data.map((p) => ({
		id: p.id,
		name: p.name,
		description: p.description || `Descrição do projeto ${p.name}`,
		status: p.status,
		priority: p.priority,
		expected_delivery_date: formatDate(p.expected_delivery_date),
		client_name: p.client?.name || "Cliente Oculto",
		client_email: p.client?.email || "email@dominio.com"
	})).sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);
}
async function fetchProjectDetails(id) {
	return (await api.get(`/projects/${id}`)).data;
}
async function updateProject(id, data) {
	return (await api.patch(`/projects/${id}`, data)).data;
}
async function deleteProject(id) {
	await api.delete(`/projects/${id}`);
}
async function fetchClients() {
	return (await api.get("/clients")).data.data;
}
async function createClient(clientData) {
	return (await api.post("/clients", clientData)).data;
}
async function updateClient(id, clientData) {
	return (await api.patch(`/clients/${id}`, clientData)).data;
}
async function fetchTasks(projectId) {
	const validProjectId = typeof projectId === "string" ? projectId : void 0;
	const url = validProjectId ? `/tasks?project_id=${validProjectId}` : "/tasks";
	return (await api.get(url)).data.data.map((t) => ({
		...t,
		id: t.id,
		taskId: `#${t.id.substring(0, 6)}`,
		title: t.title,
		description: t.description || "",
		status: t.status,
		dueDate: t.due_date ? formatDate(t.due_date) : formatDate(t.created_at),
		client: {
			name: t.project?.client?.name || "Projeto Oculto",
			email: t.project?.client?.email || ""
		}
	}));
}
async function updateTaskStatus(taskId, newStatus) {
	await api.patch(`/tasks/${taskId}`, { status: newStatus });
}
async function createTask(data) {
	return (await api.post("/tasks", data)).data;
}
async function updateTask(taskId, data) {
	return (await api.patch(`/tasks/${taskId}`, data)).data;
}
async function deleteTask(taskId) {
	await api.delete(`/tasks/${taskId}`);
}
async function fetchTaskDetails(taskId) {
	return (await api.get(`/tasks/${taskId}`)).data;
}
async function createPayment(data) {
	return (await api.post("/payments", data)).data;
}
async function deletePayment(paymentId) {
	await api.delete(`/payments/${paymentId}`);
}
async function createProjectExpense(data) {
	return (await api.post("/project-expenses", data)).data;
}
async function deleteProjectExpense(expenseId) {
	await api.delete(`/project-expenses/${expenseId}`);
}
async function fetchTimeEntries(params) {
	return (await api.get("/time-entries", { params })).data;
}
async function startTimeEntry(data) {
	return (await api.post("/time-entries", {
		...data,
		start_time: (/* @__PURE__ */ new Date()).toISOString()
	})).data;
}
async function stopTimeEntry(id, description) {
	return (await api.patch(`/time-entries/${id}`, {
		end_time: (/* @__PURE__ */ new Date()).toISOString(),
		description
	})).data;
}
var COLORS = {
	project: "#BAF08A",
	task: "#60a5fa",
	event: "#fbbf24"
};
async function fetchCalendarItems(params) {
	const [projectsRes, tasksRes, eventsRes] = await Promise.all([
		api.get("/projects"),
		api.get("/tasks"),
		api.get("/events", { params })
	]);
	const items = [];
	const projects = projectsRes.data?.data || projectsRes.data || [];
	for (const p of projects) if (p.expected_delivery_date) items.push({
		id: p.id,
		title: p.name,
		type: "project",
		start: new Date(p.expected_delivery_date),
		status: p.status,
		priority: p.priority,
		projectName: p.client?.name,
		color: COLORS.project
	});
	const tasks = tasksRes.data?.data || tasksRes.data || [];
	for (const t of tasks) if (t.due_date) items.push({
		id: t.id,
		title: t.title,
		type: "task",
		start: new Date(t.due_date),
		status: t.status,
		priority: t.priority,
		projectName: t.project?.name,
		color: COLORS.task
	});
	const events = eventsRes.data || [];
	for (const e of events) items.push({
		id: e.id,
		title: e.title,
		type: "event",
		start: new Date(e.start_date),
		end: new Date(e.end_date),
		projectName: e.project?.name,
		color: COLORS.event
	});
	return items;
}
//#endregion
export { updateTaskStatus as S, startTimeEntry as _, deletePayment as a, updateProject as b, deleteTask as c, fetchDashboardData as d, fetchProjectDetails as f, fetchTimeEntries as g, fetchTasks as h, createTask as i, fetchCalendarItems as l, fetchTaskDetails as m, createPayment as n, deleteProject as o, fetchProjects as p, createProjectExpense as r, deleteProjectExpense as s, createClient as t, fetchClients as u, stopTimeEntry as v, updateTask as x, updateClient as y };
