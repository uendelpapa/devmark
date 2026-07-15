import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { T as require_jsx_runtime, c as Label, l as TextField, u as Input, x as Button } from "../_libs/@heroui/react+[...].mjs";
import { i as useAuthStore, r as toast } from "./axios-CfOZTD6c.mjs";
import { a as updateProfile } from "./auth-CHlrDUd9.mjs";
import "./api-CPpqugVW.mjs";
import { t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { W as Check, g as Lock } from "../_libs/gravity-ui__icons.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/configuracoes-BMOBDvmd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var inputClass = "w-full bg-zinc-100 rounded-[12px] px-3 py-2 text-[14px] text-zinc-600 outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-zinc-700 transition-all border border-transparent data-[invalid=true]:border-red-500 appearance-none shadow-none";
var labelClass = "text-[14px] font-semibold text-secondary block";
function Configuracoes() {
	const { user, updateUser } = useAuthStore();
	const [name, setName] = (0, import_react.useState)(user?.name || "");
	const [email, setEmail] = (0, import_react.useState)(user?.email || "");
	const [currentPassword, setCurrentPassword] = (0, import_react.useState)("");
	const [newPassword, setNewPassword] = (0, import_react.useState)("");
	const [confirmPassword, setConfirmPassword] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (user) {
			setName(user.name);
			setEmail(user.email);
		}
	}, [user]);
	const { mutate: saveProfile, isPending: isSavingProfile } = useMutation({
		mutationFn: (data) => updateProfile(data),
		onSuccess: (updatedUser) => {
			updateUser(updatedUser);
			toast.success("Perfil atualizado com sucesso!");
		},
		onError: (err) => {
			const msg = err.response?.data?.message || "Erro ao atualizar perfil";
			toast.error(msg);
		}
	});
	const { mutate: savePassword, isPending: isSavingPassword } = useMutation({
		mutationFn: (data) => updateProfile(data),
		onSuccess: () => {
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
			toast.success("Senha alterada com sucesso!");
		},
		onError: (err) => {
			const msg = err.response?.data?.message || "Erro ao alterar senha";
			toast.error(msg);
		}
	});
	const handleProfileSubmit = (e) => {
		e.preventDefault();
		if (!name.trim() || !email.trim()) return;
		const data = {};
		if (name !== user?.name) data.name = name;
		if (email !== user?.email) data.email = email;
		if (Object.keys(data).length === 0) {
			toast.info("Nenhuma alteração detectada");
			return;
		}
		saveProfile(data);
	};
	const handlePasswordSubmit = (e) => {
		e.preventDefault();
		if (!currentPassword || !newPassword || !confirmPassword) {
			toast.error("Preencha todos os campos de senha");
			return;
		}
		if (newPassword !== confirmPassword) {
			toast.error("A nova senha e a confirmação não conferem");
			return;
		}
		if (newPassword.length < 6) {
			toast.error("A nova senha deve ter no mínimo 6 caracteres");
			return;
		}
		savePassword({
			currentPassword,
			newPassword
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white rounded-[24px] p-8 overflow-y-auto min-w-0 scrollbar-none flex flex-col gap-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-medium tracking-tight text-secondary leading-none flex items-center gap-3",
					children: "Configurações"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-zinc-400",
					children: "Gerencie suas informações pessoais e de segurança"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-[400px] flex flex-col gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xl font-semibold text-secondary",
								children: "Perfil"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-zinc-400",
								children: "Atualize seu nome e endereço de e-mail."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleProfileSubmit,
							className: "flex flex-col gap-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 gap-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TextField, {
									value: name,
									onChange: setName,
									className: "flex flex-col gap-2 w-full",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: labelClass,
										children: "Nome Completo"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "text",
										className: inputClass,
										placeholder: "Seu nome"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TextField, {
									value: email,
									onChange: setEmail,
									className: "flex flex-col gap-2 w-full",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: labelClass,
										children: "E-mail"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "email",
										className: inputClass,
										placeholder: "seu@email.com"
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "submit",
									size: "lg",
									className: "font-medium text-sm rounded-full bg-primary/50 text-secondary hover:bg-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-none",
									isDisabled: isSavingProfile || !name.trim() || !email.trim() || name === user?.name && email === user?.email,
									children: [!isSavingProfile && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }), isSavingProfile ? "Salvando..." : "Salvar Perfil"]
								})
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-[400px] flex flex-col gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xl font-semibold text-secondary",
								children: "Segurança"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-zinc-400",
								children: "Altere sua senha para manter sua conta segura."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handlePasswordSubmit,
							className: "flex flex-col gap-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "max-w-md flex flex-col gap-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TextField, {
										value: currentPassword,
										onChange: setCurrentPassword,
										className: "flex flex-col gap-2 w-full",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: labelClass,
											children: "Senha Atual"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "password",
											className: inputClass,
											placeholder: "••••••••"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-1 h-px bg-zinc-200" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TextField, {
										value: newPassword,
										onChange: setNewPassword,
										className: "flex flex-col gap-2 w-full",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: labelClass,
											children: "Nova Senha"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "password",
											className: inputClass,
											placeholder: "••••••••"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TextField, {
										value: confirmPassword,
										onChange: setConfirmPassword,
										className: "flex flex-col gap-2 w-full",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: labelClass,
											children: "Confirmar Nova Senha"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "password",
											className: inputClass,
											placeholder: "••••••••"
										})]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "submit",
									size: "lg",
									className: "font-medium text-sm rounded-full bg-primary/50 text-secondary hover:bg-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-none",
									isDisabled: isSavingPassword || !currentPassword || !newPassword || !confirmPassword,
									children: [!isSavingPassword && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-4" }), isSavingPassword ? "Alterando..." : "Alterar Senha"]
								})
							})]
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { Configuracoes as component };
