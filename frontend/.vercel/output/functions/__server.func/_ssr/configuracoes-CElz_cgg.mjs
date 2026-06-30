import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { T as require_jsx_runtime } from "../_libs/@heroui/react+[...].mjs";
import { i as useAuthStore, r as toast } from "./axios-CZGDF9fW.mjs";
import { a as updateProfile } from "./auth-BfHNtaDZ.mjs";
import "./api-C8eLQxfJ.mjs";
import { t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { C as Gear, _ as Lock, o as ShieldCheck, q as Check } from "../_libs/gravity-ui__icons.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/configuracoes-CElz_cgg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex justify-between items-center shrink-0 border-b border-zinc-100 pb-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "text-3xl font-medium tracking-tight text-secondary leading-none flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "size-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gear, { className: "size-6" })
				}), "Configurações"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium text-secondary/50 mt-4",
				children: "Gerencie suas informações pessoais e de segurança"
			})] })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-xl font-bold text-secondary flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-5 text-primary" }), "Perfil"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-secondary/50",
						children: "Atualize seu nome e endereço de e-mail."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleProfileSubmit,
					className: "flex flex-col gap-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 md:grid-cols-2 gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-sm font-bold text-secondary/70",
								children: "Nome Completo"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								placeholder: "Seu nome",
								value: name,
								onChange: (e) => setName(e.target.value),
								className: "bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-secondary"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-sm font-bold text-secondary/70",
								children: "E-mail"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "email",
								placeholder: "seu@email.com",
								value: email,
								onChange: (e) => setEmail(e.target.value),
								className: "bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-secondary"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-end pt-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							className: "font-bold rounded-xl px-8 bg-primary text-white hover:bg-primary/90 py-2.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-none",
							disabled: isSavingProfile || !name.trim() || !email.trim() || name === user?.name && email === user?.email,
							children: [!isSavingProfile && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }), isSavingProfile ? "Salvando..." : "Salvar Perfil"]
						})
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-xl font-bold text-secondary flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-5 text-primary" }), "Segurança"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-secondary/50",
						children: "Altere sua senha para manter sua conta segura."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handlePasswordSubmit,
					className: "flex flex-col gap-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-md flex flex-col gap-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-sm font-bold text-secondary/70",
									children: "Senha Atual"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "password",
									placeholder: "••••••••",
									value: currentPassword,
									onChange: (e) => setCurrentPassword(e.target.value),
									className: "bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-secondary"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-1 h-px bg-zinc-200" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-sm font-bold text-secondary/70",
									children: "Nova Senha"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "password",
									placeholder: "••••••••",
									value: newPassword,
									onChange: (e) => setNewPassword(e.target.value),
									className: "bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-secondary"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-sm font-bold text-secondary/70",
									children: "Confirmar Nova Senha"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "password",
									placeholder: "••••••••",
									value: confirmPassword,
									onChange: (e) => setConfirmPassword(e.target.value),
									className: "bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-secondary"
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-end pt-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							className: "font-bold rounded-xl px-8 bg-secondary text-white hover:bg-secondary/90 py-2.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-none",
							disabled: isSavingPassword || !currentPassword || !newPassword || !confirmPassword,
							children: [!isSavingPassword && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-4" }), isSavingPassword ? "Alterando..." : "Alterar Senha"]
						})
					})]
				})]
			})]
		})]
	});
}
//#endregion
export { Configuracoes as component };
