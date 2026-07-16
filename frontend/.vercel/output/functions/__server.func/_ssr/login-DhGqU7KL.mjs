import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { E as require_jsx_runtime, c as Label, l as TextField, o as FieldError, u as Input, x as Button } from "../_libs/@heroui/react+[...].mjs";
import { i as useAuthStore } from "./axios-Dt9xUiMl.mjs";
import { t as loginUser } from "./auth-dh_aAPrw.mjs";
import "./api-Beqz3ccz.mjs";
import { f as Link, p as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Controller, r as useForm, t as u } from "../_libs/@hookform/resolvers+[...].mjs";
import { a as string, i as object } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-DhGqU7KL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var loginSchema = object({
	email: string().email("Endereço de e-mail inválido").min(1, "E-mail é obrigatório"),
	password: string().min(1, "Senha é obrigatória")
});
var inputClass = "w-full bg-zinc-100 rounded-[12px] px-4 py-3 text-[14px] text-zinc-800 outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-zinc-400 transition-all border border-transparent data-[invalid=true]:border-red-500 appearance-none shadow-none";
var labelClass = "text-[14px] font-semibold text-secondary block";
var errorClass = "text-[12px] text-red-500 mt-1 block";
function LoginPage() {
	const navigate = useNavigate();
	const setAuth = useAuthStore((s) => s.setAuth);
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const [serverError, setServerError] = (0, import_react.useState)(null);
	const { control, handleSubmit } = useForm({
		resolver: u(loginSchema),
		defaultValues: {
			email: "",
			password: ""
		}
	});
	const onSubmit = async (data) => {
		setIsSubmitting(true);
		setServerError(null);
		try {
			const { user, accessToken } = await loginUser(data);
			setAuth(user, accessToken);
			navigate({ to: "/" });
		} catch (err) {
			setServerError(err?.message || "Erro ao fazer login");
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
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/logo.svg",
							alt: "Logo"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[24px] font-extrabold text-secondary tracking-tight",
							children: "Devmark"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-secondary/60 text-[14px] font-medium text-center",
						children: "Entre na sua conta para continuar"
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
										id: "login-email"
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
										placeholder: "••••••••",
										className: inputClass,
										type: "password",
										autoComplete: "current-password",
										id: "login-password"
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
							id: "login-submit",
							children: isSubmitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }), "Entrando..."]
							}) : "Entrar"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-center text-[13px] text-secondary/60 font-medium",
					children: [
						"Não tem uma conta?",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/register",
							className: "text-secondary font-bold hover:underline transition-all",
							children: "Criar conta"
						})
					]
				})
			]
		})
	});
}
//#endregion
export { LoginPage as component };
