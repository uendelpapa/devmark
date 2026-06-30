import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { S as Button, T as require_jsx_runtime, a as ListBox, c as Label, l as TextField, o as FieldError, r as Select, u as Input } from "../_libs/@heroui/react+[...].mjs";
import { t as createClient } from "./api-CpUZCTJ1.mjs";
import { G as ChevronLeft, W as ChevronRight, c as Plus } from "../_libs/gravity-ui__icons.mjs";
import { p as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Controller, r as useForm, t as u } from "../_libs/@hookform/resolvers+[...].mjs";
import { a as string, i as object, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/clientes_.novo-RoGH2Dg0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var clientSchema = object({
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
var inputClass = "w-full bg-zinc-100 rounded-[12px] px-3 py-2 text-[14px] text-zinc-600 outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-zinc-700 transition-all border border-transparent data-[invalid=true]:border-red-500 appearance-none shadow-none";
var labelClass = "text-[14px] font-semibold text-secondary block";
var errorClass = "text-[12px] text-red-500 mt-1 block";
function NovoCliente() {
	const navigate = useNavigate();
	const [currentStep, setCurrentStep] = (0, import_react.useState)(1);
	const totalSteps = 4;
	const { control, handleSubmit, trigger } = useForm({
		resolver: u(clientSchema),
		defaultValues: {
			name: "",
			email: "",
			company_name: "",
			document: "",
			phone: "",
			preferred_communication: "WHATSAPP",
			preferred_payment_method: "PIX"
		}
	});
	const stepFields = {
		1: ["name", "email"],
		2: ["company_name", "document"],
		3: ["phone", "preferred_communication"],
		4: ["preferred_payment_method"]
	};
	const handleNext = async () => {
		const fieldsToValidate = stepFields[currentStep];
		if (await trigger(fieldsToValidate) && currentStep < totalSteps) setCurrentStep((prev) => prev + 1);
	};
	const handleBack = () => {
		if (currentStep > 1) setCurrentStep((prev) => prev - 1);
		else navigate({ to: "/clientes" });
	};
	const onSubmit = async (data) => {
		try {
			await createClient({
				...data,
				status: "ACTIVE"
			});
			navigate({ to: "/clientes" });
		} catch (err) {
			console.error("Failed to create client:", err);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white rounded-[24px] p-8 overflow-y-auto min-w-0 h-fit max-h-[calc(100vh-100px)] scrollbar-none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 mb-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					className: "size-8 min-w-8 bg-primary/50 hover:bg-primary text-secondary border-none rounded-full p-0 flex items-center justify-center shrink-0 cursor-pointer transition-colors",
					onPress: handleBack,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {
						width: 16,
						height: 16
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold tracking-tight text-secondary leading-none",
					children: "Novo Cliente"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-[16px] font-semibold text-secondary mb-6",
				children: {
					1: "Informações Pessoais",
					2: "Informações Empresariais",
					3: "Contato & Preferências",
					4: "Configuração Financeira"
				}[currentStep]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit(onSubmit),
				className: "flex flex-col flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 max-w-3xl",
					children: [
						currentStep === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Controller, {
								name: "name",
								control,
								render: ({ field: { name, value, onChange }, fieldState: { error } }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TextField, {
									name,
									value: value || "",
									onChange,
									isInvalid: !!error,
									className: "flex flex-col gap-1.5 w-full",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
											className: labelClass,
											children: ["Nome Completo ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-red-500",
												children: "*"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											placeholder: "Ex: John Smith",
											className: inputClass
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldError, {
											className: errorClass,
											children: error?.message
										})
									]
								})
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Controller, {
								name: "email",
								control,
								render: ({ field: { name, value, onChange }, fieldState: { error } }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TextField, {
									name,
									value: value || "",
									onChange,
									isInvalid: !!error,
									className: "flex flex-col gap-1.5 w-full",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
											className: labelClass,
											children: ["E-mail ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-red-500",
												children: "*"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											placeholder: "Ex: john@acme.com",
											className: inputClass
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldError, {
											className: errorClass,
											children: error?.message
										})
									]
								})
							}) })]
						}),
						currentStep === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Controller, {
								name: "company_name",
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
											children: "Nome da Empresa"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											placeholder: "Ex: Acme Corp",
											className: inputClass
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldError, {
											className: errorClass,
											children: error?.message
										})
									]
								})
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Controller, {
								name: "document",
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
											children: "CNPJ / CPF"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											placeholder: "Ex: 12.345.678/0001-90",
											className: inputClass
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldError, {
											className: errorClass,
											children: error?.message
										})
									]
								})
							}) })]
						}),
						currentStep === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Controller, {
								name: "phone",
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
											children: "Telefone / WhatsApp"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											placeholder: "Ex: (11) 99999-9999",
											className: inputClass
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldError, {
											className: errorClass,
											children: error?.message
										})
									]
								})
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Controller, {
								name: "preferred_communication",
								control,
								render: ({ field: { name, value, onChange }, fieldState: { error } }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									name,
									selectedKey: value || null,
									onSelectionChange: (k) => onChange(k),
									isInvalid: !!error,
									className: "flex flex-col gap-1.5 w-full",
									placeholder: "Selecione a comunicação preferida",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: labelClass,
											children: "Comunicação Preferencial"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select.Trigger, {
											className: `${inputClass} flex items-center justify-between`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Value, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Indicator, {})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Popover, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ListBox, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.Item, {
												id: "WHATSAPP",
												textValue: "WhatsApp",
												children: "WhatsApp"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.Item, {
												id: "EMAIL",
												textValue: "E-mail",
												children: "E-mail"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.Item, {
												id: "PHONE",
												textValue: "Telefone",
												children: "Telefone"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.Item, {
												id: "MEETING",
												textValue: "Reunião",
												children: "Reunião"
											})
										] }) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldError, {
											className: errorClass,
											children: error?.message
										})
									]
								})
							}) })]
						}),
						currentStep === 4 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Controller, {
								name: "preferred_payment_method",
								control,
								render: ({ field: { name, value, onChange }, fieldState: { error } }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									name,
									selectedKey: value || null,
									onSelectionChange: (k) => onChange(k),
									isInvalid: !!error,
									className: "flex flex-col gap-1.5 w-full",
									placeholder: "Selecione o pagamento preferido",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: labelClass,
											children: "Método de Pagamento Preferido"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select.Trigger, {
											className: `${inputClass} flex items-center justify-between`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Value, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Indicator, {})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Popover, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ListBox, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.Item, {
												id: "PIX",
												textValue: "PIX",
												children: "PIX"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.Item, {
												id: "BANK_TRANSFER",
												textValue: "Boleto / Transferência",
												children: "Boleto / Transferência"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.Item, {
												id: "CREDIT_CARD",
												textValue: "Cartão de Crédito",
												children: "Cartão de Crédito"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.Item, {
												id: "CASH",
												textValue: "Dinheiro",
												children: "Dinheiro"
											})
										] }) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldError, {
											className: errorClass,
											children: error?.message
										})
									]
								})
							}) })
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 mt-10 shrink-0",
					children: [currentStep === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						className: "bg-zinc-100 text-zinc-400 font-medium rounded-full px-6 py-2 border-none text-[13px] cursor-not-allowed",
						onPress: handleBack,
						size: "lg",
						isDisabled: true,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" }), "Anterior"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						className: "bg-secondary hover:bg-primary text-white hover:text-secondary font-medium rounded-full px-6 py-2 border-none text-[13px] cursor-pointer transition-all duration-200",
						onPress: handleBack,
						size: "lg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" }), "Anterior"]
					}), currentStep < totalSteps ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						className: "bg-secondary hover:bg-primary text-white hover:text-secondary font-medium rounded-full px-6 py-2 border-none text-[13px] cursor-pointer transition-all duration-200",
						onPress: handleNext,
						size: "lg",
						children: ["Próximo", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						className: "bg-secondary hover:bg-primary hover:text-secondary text-white font-medium rounded-full px-6 py-2 border-none text-[13px] cursor-pointer transition-all duration-200 flex items-center gap-1.5",
						size: "lg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), "Criar Cliente"]
					})]
				})]
			})
		]
	});
}
//#endregion
export { NovoCliente as component };
