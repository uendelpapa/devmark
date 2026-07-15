import { n as api } from "./axios-CfOZTD6c.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-CHlrDUd9.js
async function loginUser(data) {
	return (await api.post("/auth/login", data)).data;
}
async function registerUser(data) {
	return (await api.post("/auth/register", data)).data;
}
var activeRefreshPromise = null;
async function refreshToken() {
	if (activeRefreshPromise) return activeRefreshPromise;
	activeRefreshPromise = api.post("/auth/refresh").then((res) => res.data);
	try {
		return await activeRefreshPromise;
	} finally {
		activeRefreshPromise = null;
	}
}
async function logoutUser() {
	await api.post("/auth/logout");
}
async function updateProfile(data) {
	return (await api.patch("/auth/profile", data)).data;
}
//#endregion
export { updateProfile as a, registerUser as i, logoutUser as n, refreshToken as r, loginUser as t };
