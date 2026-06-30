import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { S as Button, T as require_jsx_runtime, c as Label, l as TextField, o as FieldError, u as Input } from "../_libs/@heroui/react+[...].mjs";
import { i as useAuthStore } from "./axios-CZGDF9fW.mjs";
import { i as registerUser } from "./auth-BfHNtaDZ.mjs";
import "./api-C8eLQxfJ.mjs";
import { f as Link, p as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Controller, r as useForm, t as u } from "../_libs/@hookform/resolvers+[...].mjs";
import { a as string, i as object } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/register-Cu_aPdT4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var registerSchema = object({
	name: string().min(1, "Nome é obrigatório"),
	email: string().email("Endereço de e-mail inválido").min(1, "E-mail é obrigatório"),
	password: string().min(6, "A senha deve ter no mínimo 6 caracteres"),
	confirmPassword: string().min(1, "Confirme sua senha")
}).refine((data) => data.password === data.confirmPassword, {
	message: "As senhas não coincidem",
	path: ["confirmPassword"]
});
var inputClass = "w-full bg-zinc-100 rounded-[12px] px-4 py-3 text-[14px] text-zinc-800 outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-zinc-400 transition-all border border-transparent data-[invalid=true]:border-red-500 appearance-none shadow-none";
var labelClass = "text-[14px] font-semibold text-secondary block";
var errorClass = "text-[12px] text-red-500 mt-1 block";
function RegisterPage() {
	const navigate = useNavigate();
	const setAuth = useAuthStore((s) => s.setAuth);
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const [serverError, setServerError] = (0, import_react.useState)(null);
	const { control, handleSubmit } = useForm({
		resolver: u(registerSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: ""
		}
	});
	const onSubmit = async (data) => {
		setIsSubmitting(true);
		setServerError(null);
		try {
			const { user, accessToken } = await registerUser({
				name: data.name,
				email: data.email,
				password: data.password
			});
			setAuth(user, accessToken);
			navigate({ to: "/" });
		} catch (err) {
			setServerError(err?.message || "Erro ao criar conta");
		} finally {
			setIsSubmitting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen w-full flex items-center justify-center bg-backpage p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-[440px] bg-white rounded-[32px] shadow-2xl shadow-secondary/10 p-10 flex flex-col gap-8 animate-slide-in",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							className: "w-8 h-8 text-secondary fill-none",
							viewBox: "0 0 28 28",
							stroke: "currentColor",
							strokeWidth: "2.5",
							strokeLinecap: "round",
							strokeLinejoin: "round",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M14 3C14 3 8.5 7.5 8.5 13.5C8.5 19.5 14 25 14 25C14 25 19.5 19.5 19.5 13.5C19.5 7.5 14 3 14 3Z" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M14 9C14 9 11.5 12 11.5 15.5C11.5 19 14 22 14 22C14 22 16.5 19 16.5 15.5C16.5 12 14 9 14 9Z" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M14 25V17" })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[24px] font-extrabold text-secondary tracking-tight",
							children: "Devmark"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-secondary/60 text-[14px] font-medium text-center",
						children: "Crie sua conta para começar"
					})]
				}),
				serverError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bg-red-50 border border-red-200 text-red-600 text-[13px] font-medium rounded-[12px] px-4 py-3 text-center",
					children: serverError
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit(onSubmit),
					className: "flex flex-col gap-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Controller, {
							name: "name",
							control,
							render: ({ field: { name, value, onChange }, fieldState: { error } }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TextField, {
								name,
								value: value || "",
								onChange,
								isInvalid: !!error,
								className: "flex flex-col gap-1.5 w-full",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: labelClass,
										children: "Nome completo"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "Seu nome",
										className: inputClass,
										autoComplete: "name",
										id: "register-name"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldError, {
										className: errorClass,
										children: error?.message
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Controller, {
							name: "email",
							control,
							render: ({ field: { name, value, onChange }, fieldState: { error } }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TextField, {
								name,
								value: value || "",
								onChange,
								isInvalid: !!error,
								className: "flex flex-col gap-1.5 w-full",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: labelClass,
										children: "E-mail"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "seu@email.com",
										className: inputClass,
										type: "email",
										autoComplete: "email",
										id: "register-email"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldError, {
										className: errorClass,
										children: error?.message
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Controller, {
							name: "password",
							control,
							render: ({ field: { name, value, onChange }, fieldState: { error } }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TextField, {
								name,
								value: value || "",
								onChange,
								isInvalid: !!error,
								className: "flex flex-col gap-1.5 w-full",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: labelClass,
										children: "Senha"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "Mínimo 6 caracteres",
										className: inputClass,
										type: "password",
										autoComplete: "new-password",
										id: "register-password"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldError, {
										className: errorClass,
										children: error?.message
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Controller, {
							name: "confirmPassword",
							control,
							render: ({ field: { name, value, onChange }, fieldState: { error } }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TextField, {
								name,
								value: value || "",
								onChange,
								isInvalid: !!error,
								className: "flex flex-col gap-1.5 w-full",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: labelClass,
										children: "Confirmar senha"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "Repita sua senha",
										className: inputClass,
										type: "password",
										autoComplete: "new-password",
										id: "register-confirm-password"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldError, {
										className: errorClass,
										children: error?.message
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							isDisabled: isSubmitting,
							className: "w-full bg-secondary hover:bg-secondary/90 text-white font-semibold rounded-full py-3 h-12 border-none text-[15px] cursor-pointer transition-all duration-200 mt-2",
							size: "lg",
							id: "register-submit",
							children: isSubmitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }), "Criando conta..."]
							}) : "Criar conta"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-center text-[13px] text-secondary/60 font-medium",
					children: [
						"Já tem uma conta?",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							className: "text-secondary font-bold hover:underline transition-all",
							children: "Entrar"
						})
					]
				})
			]
		})
	});
}
//#endregion
export { RegisterPage as component };
