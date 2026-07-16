import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { E as require_jsx_runtime, a as ListBox, c as Label, l as TextField, o as FieldError, r as Select, u as Input, x as Button } from "../_libs/@heroui/react+[...].mjs";
import { O as updateProject, y as fetchProjectDetails } from "./api-Beqz3ccz.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { H as ChevronLeft, T as FloppyDisk, V as ChevronRight } from "../_libs/gravity-ui__icons.mjs";
import { p as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Controller, r as useForm, t as u } from "../_libs/@hookform/resolvers+[...].mjs";
import { a as string, i as object, r as number } from "../_libs/zod.mjs";
import { t as Route } from "./projetos_._projectId.editar-BA65D3do.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/projetos_._projectId.editar-DrFiLPNF.js
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
	status: string().min(1, "Obrigatório")
});
var inputClass = "w-full bg-zinc-100 rounded-[12px] px-3 py-2 text-[14px] text-zinc-600 outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-zinc-700 transition-all border border-transparent data-[invalid=true]:border-red-500 appearance-none shadow-none";
var labelClass = "text-[14px] font-semibold text-secondary block";
var errorClass = "text-[12px] text-red-500 mt-1 block";
function EditarProjeto() {
	const { projectId } = Route.useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [currentStep, setCurrentStep] = (0, import_react.useState)(1);
	const totalSteps = 6;
	const { data: project, isLoading } = useQuery({
		queryKey: ["projectDetails", projectId],
		queryFn: () => fetchProjectDetails(projectId),
		enabled: !!projectId
	});
	const { control, handleSubmit, trigger, reset } = useForm({
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
			status: ""
		}
	});
	(0, import_react.useEffect)(() => {
		if (project) reset({
			client_id: project.client_id || "",
			name: project.name || "",
			area: project.area || "MARKETING",
			specialty: "FRONTEND",
			project_value: project.project_value || 0,
			amount_received: project.amount_received || 0,
			start_date: project.created_at ? project.created_at.split("T")[0] : "",
			expected_delivery_date: project.expected_delivery_date ? project.expected_delivery_date.split("T")[0] : "",
			estimated_hours: project.estimated_hours || 0,
			priority: project.priority || "MEDIUM",
			status: project.status || "PLANNING"
		});
	}, [project, reset]);
	const updateMutation = useMutation({
		mutationFn: (data) => updateProject(projectId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["projects"] });
			queryClient.invalidateQueries({ queryKey: ["projectDetails", projectId] });
			queryClient.invalidateQueries({ queryKey: ["dashboard"] });
			navigate({ to: "/projetos" });
		}
	});
	const stepFields = {
		1: ["client_id", "name"],
		2: ["area", "specialty"],
		3: ["project_value", "amount_received"],
		4: ["start_date", "expected_delivery_date"],
		5: ["estimated_hours", "priority"],
		6: ["status"]
	};
	const handleNext = async () => {
		const fieldsToValidate = stepFields[currentStep];
		if (await trigger(fieldsToValidate) && currentStep < totalSteps) setCurrentStep((prev) => prev + 1);
	};
	const handleBack = () => {
		if (currentStep > 1) setCurrentStep((prev) => prev - 1);
		else navigate({ to: "/projetos" });
	};
	const onSubmit = (data) => {
		updateMutation.mutate(data);
	};
	const stepTitles = {
		1: "Informações Gerais",
		2: "Área de Atuação",
		3: "Financeiro",
		4: "Datas",
		5: "Planejamento",
		6: "Status"
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-8 text-secondary",
		children: "Carregando dados do projeto..."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white rounded-[24px] p-8 overflow-y-auto min-w-0 h-fit max-h-[calc(100vh-100px)] scrollbar-none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 mb-8",
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
					children: "Editar Projeto"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-[16px] font-semibold text-secondary mb-6",
				children: stepTitles[currentStep]
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
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select.Popover, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ListBox, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.Item, {
												id: "c1",
												textValue: "Bob Inc",
												children: "Bob Inc"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.Item, {
												id: "c2",
												textValue: "Fred Tech",
												children: "Fred Tech"
											}),
											project?.client_id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.Item, {
												id: project.client_id,
												textValue: project.client?.name || project.client_id,
												children: project.client?.name || "Cliente atual"
											})
										] }) }),
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
						currentStep === 6 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-col gap-8",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.Item, {
													id: "REVIEW",
													textValue: "Revisão",
													children: "Revisão"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.Item, {
													id: "COMPLETED",
													textValue: "Concluído",
													children: "Concluído"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBox.Item, {
													id: "CANCELED",
													textValue: "Cancelado",
													children: "Cancelado"
												})
											] }) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldError, {
												className: errorClass,
												children: error?.message
											})
										]
									})
								})
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 mt-10",
					children: [currentStep === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "bg-zinc-700 text-white font-medium rounded-full px-6 py-2 border-none text-[13px] cursor-not-allowed",
						onPress: () => navigate({ to: "/projetos" }),
						size: "lg",
						isDisabled: true,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" }), "Anterior"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "bg-secondary hover:bg-primary text-white hover:text-secondary font-medium rounded-full px-6 py-2 border-none text-[13px] cursor-pointer transition-all duration-200",
						onPress: handleBack,
						size: "lg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" }), "Anterior"]
					}), currentStep < totalSteps ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "bg-secondary hover:bg-primary text-white hover:text-secondary font-medium rounded-full px-6 py-2 border-none text-[13px] cursor-pointer transition-all duration-200",
						onPress: handleNext,
						size: "lg",
						children: ["Próximo", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						className: "bg-secondary hover:bg-primary hover:text-secondary text-white font-medium rounded-full px-6 py-2 border-none text-[13px] cursor-pointer transition-all durantion-200",
						size: "lg",
						isDisabled: updateMutation.isPending,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloppyDisk, {}), "Salvar Alterações"]
					})]
				})]
			})
		]
	});
}
//#endregion
export { EditarProjeto as component };
