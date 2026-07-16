import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { E as require_jsx_runtime, a as ListBox, c as Label, l as TextField, o as FieldError, r as Select, s as Description, u as Input, v as Checkbox } from "../_libs/@heroui/react+[...].mjs";
import { n as api, r as toast } from "./axios-Dt9xUiMl.mjs";
import { _ as fetchClients, a as createProjectWithTasks, r as createProject } from "./api-Beqz3ccz.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { H as ChevronLeft, V as ChevronRight, i as Sparkles, s as Plus } from "../_libs/gravity-ui__icons.mjs";
import { t as Button$1 } from "./Button-CKIMbDdG.mjs";
import { p as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Controller, r as useForm, t as u } from "../_libs/@hookform/resolvers+[...].mjs";
import { a as string, i as object, n as boolean, r as number } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/projetos_.novo-BWZPCuS3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var projectSchema = object({
	client_id: string().min(1, "Obrigatório"),
	name: string().min(1, "Obrigatório"),
	area: string().min(1, "Obrigatório"),
	specialty: string().min(1, "Obrigatório"),
	project_value: number().min(0, "Inválido"),
	amount_received: number().min(0, "Inválido"),
	start_date: string().min(1, "Obrigatório"),
	expected_delivery_date: string().min(1, "Obrigatório"),
	estimated_hours: number().min(1, "Inválido"),
	priority: string().min(1, "Obrigatório"),
	status: string().min(1, "Obrigatório"),
	create_tasks_ai: boolean()
});
var inputClass = "w-full bg-zinc-100 rounded-[12px] px-3 py-2 text-[14px] text-zinc-600 outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-zinc-700 transition-all border border-transparent data-[invalid=true]:border-red-500 appearance-none shadow-none";
var labelClass = "text-[14px] font-semibold text-secondary block";
var errorClass = "text-[12px] text-red-500 mt-1 block";
function NovoProjeto() {
	const navigate = useNavigate();
	const [currentStep, setCurrentStep] = (0, import_react.useState)(1);
	const totalSteps = 6;
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const queryClient = useQueryClient();
	const { data: clients } = useQuery({
		queryKey: ["clients"],
		queryFn: fetchClients
	});
	const { mutate: mutateCreateNormal } = useMutation({
		mutationFn: (data) => createProject(data),
		onMutate: async (newProject) => {
			await queryClient.cancelQueries({ queryKey: ["projects"] });
			const previousProjects = queryClient.getQueryData(["projects"]);
			queryClient.setQueryData(["projects"], (old) => {
				return [{
					...newProject,
					id: `temp-${Date.now()}`,
					created_at: (/* @__PURE__ */ new Date()).toISOString(),
					status: "PENDING"
				}, ...old || []];
			});
			return { previousProjects };
		},
		onError: (err, _newProject, context) => {
			if (context?.previousProjects) queryClient.setQueryData(["projects"], context.previousProjects);
			toast.error(err?.response?.data?.message || "Erro ao criar projeto.");
		},
		onSuccess: () => {
			toast.success("Projeto criado com sucesso!");
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["projects"] });
			queryClient.invalidateQueries({ queryKey: ["dashboard"] });
		}
	});
	const { control, handleSubmit, trigger } = useForm({
		resolver: u(projectSchema),
		defaultValues: {
			client_id: "",
			name: "",
			area: "",
			specialty: "",
			project_value: 0,
			amount_received: 0,
			start_date: "",
			expected_delivery_date: "",
			estimated_hours: 0,
			priority: "",
			status: "",
			create_tasks_ai: false
		}
	});
	const stepFields = {
		1: ["client_id", "name"],
		2: ["area", "specialty"],
		3: ["project_value", "amount_received"],
		4: ["start_date", "expected_delivery_date"],
		5: ["estimated_hours", "priority"],
		6: ["status", "create_tasks_ai"]
	};
	const handleNext = async () => {
		const fieldsToValidate = stepFields[currentStep];
		if (await trigger(fieldsToValidate) && currentStep < totalSteps) setCurrentStep((prev) => prev + 1);
	};
	const handleBack = () => {
		if (currentStep > 1) setCurrentStep((prev) => prev - 1);
		else navigate({ to: "/projetos" });
	};
	const onSubmit = async (data) => {
		setIsSubmitting(true);
		try {
			if (data.create_tasks_ai) {
				toast.info("Criando projeto e gerando tarefas com IA...");
				const messageText = `O usuário preencheu o formulário de projeto manualmente. Crie as tarefas para este projeto: ${JSON.stringify(data)}. Retorne is_complete: true e as tarefas.`;
				const result = (await api.post("/ai/chat", {
					messages: [{
						role: "user",
						parts: [{ text: messageText }]
					}],
					model: "gemini-2.5-flash"
				})).data;
				const { create_tasks_ai, ...projectData } = data;
				if (result.is_complete && result.tasks && result.tasks.length > 0) {
					await createProjectWithTasks(projectData, result.tasks);
					toast.success("Projeto e tarefas criados com sucesso!");
				} else {
					await createProject(projectData);
					toast.success("Projeto criado, mas não foi possível gerar tarefas.");
				}
				queryClient.invalidateQueries({ queryKey: ["projects"] });
				queryClient.invalidateQueries({ queryKey: ["dashboard"] });
				navigate({ to: "/projetos" });
			} else {
				const { create_tasks_ai, ...projectData } = data;
				mutateCreateNormal(projectData);
				navigate({ to: "/projetos" });
			}
		} catch (err) {
			console.error(err);
			toast.error(err?.response?.data?.message || "Erro ao criar projeto.");
		} finally {
			setIsSubmitting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white rounded-[24px] p-8 overflow-y-auto min-w-0 h-fit max-h-[calc(100vh-100px)] scrollbar-none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 mb-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
					size: "sm",
					onPress: handleBack,
					variant: "onlyIcon",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {
						width: 16,
						height: 16
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold tracking-tight text-secondary leading-none",
					children: "Novo Projeto"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-[16px] font-semibold text-secondary mb-6",
				children: {
					1: "Informações Gerais",
					2: "Área de Atuação",
					3: "Financeiro",
					4: "Datas",
					5: "Planejamento",
					6: "Status"
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
								name: "client_id",
								control,
								render: ({ field: { name, value, onChange }, fieldState: { error } }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									name,
									selectedKey: value || null,
									onSelectionChange: (k) => onChange(k),
									isInvalid: !!error,
									className: "w-full",
									placeholder: "Selecione o cliente",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
											className: labelClass,
											children: ["Cliente ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-red-500",
												children: "*"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select.Trigger, {
											className: `${inputClass} flex items-center justify-between`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Value, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Indicator, {})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Popover, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox, { children: clients?.map((client) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ListBox.Item, {
											id: client.id,
											textValue: client.name,
											children: [client.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.ItemIndicator, {})]
										}, client.id)) }) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldError, {
											className: errorClass,
											children: error?.message
										})
									]
								})
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Controller, {
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
											children: ["Nome do Projeto ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-red-500",
												children: "*"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											placeholder: "Projeto",
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
								name: "area",
								control,
								render: ({ field: { name, value, onChange }, fieldState: { error } }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									name,
									selectedKey: value || null,
									onSelectionChange: (k) => onChange(k),
									isInvalid: !!error,
									className: "flex flex-col gap-1.5 w-full",
									placeholder: "Selecione a área",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
											className: labelClass,
											children: ["Área ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-red-500",
												children: "*"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select.Trigger, {
											className: `${inputClass} flex items-center justify-between`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Value, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Indicator, {})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Popover, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ListBox, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.Item, {
											id: "MARKETING",
											textValue: "Marketing",
											children: "Marketing"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.Item, {
											id: "DEVELOPER",
											textValue: "Desenvolvimento",
											children: "Desenvolvimento"
										})] }) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldError, {
											className: errorClass,
											children: error?.message
										})
									]
								})
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Controller, {
								name: "specialty",
								control,
								render: ({ field: { name, value, onChange }, fieldState: { error } }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									name,
									selectedKey: value || null,
									onSelectionChange: (k) => onChange(k),
									isInvalid: !!error,
									className: "flex flex-col gap-1.5 w-full",
									placeholder: "Selecione a especialidade",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
											className: labelClass,
											children: ["Especialidade ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-red-500",
												children: "*"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select.Trigger, {
											className: `${inputClass} flex items-center justify-between`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Value, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Indicator, {})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Popover, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ListBox, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.Item, {
												id: "FRONTEND",
												textValue: "Frontend",
												children: "Frontend"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.Item, {
												id: "BACKEND",
												textValue: "Backend",
												children: "Backend"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.Item, {
												id: "SEO",
												textValue: "SEO",
												children: "SEO"
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
						currentStep === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Controller, {
								name: "project_value",
								control,
								render: ({ field: { name, value, onChange }, fieldState: { error } }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TextField, {
									name,
									value: value ? value.toString() : "",
									onChange: (val) => onChange(parseFloat(val) || 0),
									isInvalid: !!error,
									className: "flex flex-col gap-1.5 w-full relative",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
											className: labelClass,
											children: ["Valor do Projeto ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-red-500",
												children: "*"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative w-full",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "absolute left-4 top-1/2 -translate-y-1/2 text-secondary/50 text-[14px] z-10",
												children: "R$"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												placeholder: "0,00",
												className: `${inputClass} pl-10`
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldError, {
											className: errorClass,
											children: error?.message
										})
									]
								})
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Controller, {
								name: "amount_received",
								control,
								render: ({ field: { name, value, onChange }, fieldState: { error } }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TextField, {
									name,
									value: value ? value.toString() : "",
									onChange: (val) => onChange(parseFloat(val) || 0),
									isInvalid: !!error,
									className: "flex flex-col gap-1.5 w-full relative",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
											className: labelClass,
											children: ["Valor Recebido ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-red-500",
												children: "*"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative w-full",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "absolute left-4 top-1/2 -translate-y-1/2 text-secondary/50 text-[14px] z-10",
												children: "R$"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												placeholder: "0,00",
												className: `${inputClass} pl-10`
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldError, {
											className: errorClass,
											children: error?.message
										})
									]
								})
							}) })]
						}),
						currentStep === 4 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Controller, {
								name: "start_date",
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
											children: ["Data de Início ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-red-500",
												children: "*"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "date",
											className: inputClass
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldError, {
											className: errorClass,
											children: error?.message
										})
									]
								})
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Controller, {
								name: "expected_delivery_date",
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
											children: ["Data de Entrega Prevista ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-red-500",
												children: "*"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "date",
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
						currentStep === 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Controller, {
								name: "estimated_hours",
								control,
								render: ({ field: { name, value, onChange }, fieldState: { error } }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TextField, {
									name,
									value: value ? value.toString() : "",
									onChange: (val) => onChange(parseInt(val, 10) || 0),
									isInvalid: !!error,
									className: "flex flex-col gap-1.5 w-full",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
											className: labelClass,
											children: ["Horas Previstas ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-red-500",
												children: "*"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											placeholder: "0",
											className: inputClass
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldError, {
											className: errorClass,
											children: error?.message
										})
									]
								})
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Controller, {
								name: "priority",
								control,
								render: ({ field: { name, value, onChange }, fieldState: { error } }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									name,
									selectedKey: value || null,
									onSelectionChange: (k) => onChange(k),
									isInvalid: !!error,
									className: "flex flex-col gap-1.5 w-full",
									placeholder: "Selecione a prioridade",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
											className: labelClass,
											children: ["Prioridade ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-red-500",
												children: "*"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select.Trigger, {
											className: `${inputClass} flex items-center justify-between`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Value, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Indicator, {})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Popover, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ListBox, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.Item, {
												id: "LOW",
												textValue: "Baixa",
												children: "Baixa"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.Item, {
												id: "MEDIUM",
												textValue: "Média",
												children: "Média"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.Item, {
												id: "HIGH",
												textValue: "Alta",
												children: "Alta"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.Item, {
												id: "URGENT",
												textValue: "Urgente",
												children: "Urgente"
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
						currentStep === 6 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-1/2 pr-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Controller, {
									name: "status",
									control,
									render: ({ field: { name, value, onChange }, fieldState: { error } }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										name,
										selectedKey: value || null,
										onSelectionChange: (k) => onChange(k),
										isInvalid: !!error,
										className: "flex flex-col gap-1.5 w-full",
										placeholder: "Selecione o status",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
												className: labelClass,
												children: ["Status do Projeto ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-red-500",
													children: "*"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select.Trigger, {
												className: `${inputClass} flex items-center justify-between`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Value, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Indicator, {})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Popover, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ListBox, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.Item, {
													id: "PLANNING",
													textValue: "Planejamento",
													children: "Planejamento"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.Item, {
													id: "IN_PROGRESS",
													textValue: "Em progresso",
													children: "Em progresso"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.Item, {
													id: "WAITING_CLIENT",
													textValue: "Aguardando cliente",
													children: "Aguardando cliente"
												})
											] }) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldError, {
												className: errorClass,
												children: error?.message
											})
										]
									})
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Controller, {
								name: "create_tasks_ai",
								control,
								render: ({ field: { value, onChange }, fieldState: { error } }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Checkbox, {
									isSelected: !!value,
									onChange: (e) => {
										if (typeof e === "boolean") onChange(e);
										else if (e && e.target && typeof e.target.checked === "boolean") onChange(e.target.checked);
										else onChange(!value);
									},
									isInvalid: !!error,
									className: "w-[60%]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Checkbox.Content, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox.Control, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox.Indicator, {}) }), "Criar tarefas com IA"] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description, {
											className: "text-secondary/60 text-[12px]",
											children: "Crie tarefas baseadas na descrição do projeto."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldError, { children: error?.message })
									]
								})
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 mt-10",
					children: [
						currentStep === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button$1, {
							className: "bg-zinc-500 text-zinc-800 border border-zinc-600 cursor-not-allowed",
							onPress: () => navigate({ to: "/projetos" }),
							size: "lg",
							isDisabled: true,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" }), "Anterior"]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button$1, {
							onPress: handleBack,
							size: "lg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" }), "Anterior"]
						}),
						currentStep < totalSteps ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button$1, {
							onPress: handleNext,
							size: "lg",
							children: ["Próximo", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
							type: "submit",
							size: "lg",
							isDisabled: isSubmitting,
							children: isSubmitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }), "Salvando..."]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), "Criar Projeto"] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button$1, {
							onPress: () => navigate({ to: "/projetos/ia" }),
							size: "lg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {}), "Criar com IA"]
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { NovoProjeto as component };
