import { n as api } from "./axios-B7sqCQdD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-SemYZqoY.js
async function loginUser(data) {
	return (await api.post("/auth/login", data)).data;
}
async function registerUser(data) {
	return (await api.post("/auth/register", data)).data;
}
async function refreshToken() {
	return (await api.post("/auth/refresh")).data;
}
async function logoutUser() {
	await api.post("/auth/logout");
}
async function updateProfile(data) {
	return (await api.patch("/auth/profile", data)).data;
}
//#endregion
export { updateProfile as a, registerUser as i, logoutUser as n, refreshToken as r, loginUser as t };
