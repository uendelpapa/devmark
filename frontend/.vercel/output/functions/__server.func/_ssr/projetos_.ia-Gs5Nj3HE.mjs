import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { E as require_jsx_runtime } from "../_libs/@heroui/react+[...].mjs";
import { n as api } from "./axios-Dt9xUiMl.mjs";
import { H as ChevronLeft, U as ChevronDown, V as ChevronRight, W as Check, a as Sliders, i as Sparkles, m as Microphone, p as Paperclip, t as Xmark } from "../_libs/gravity-ui__icons.mjs";
import { t as Button$1 } from "./Button-CKIMbDdG.mjs";
import { p as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/projetos_.ia-Gs5Nj3HE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MODEL_LABELS = {
	"gemini-2.5-flash": "Gemini Flash",
	"gemini-1.5-pro": "Gemini Pro",
	"gemma-4-31b-it": "Gemma-4",
	"openai/gpt-oss-20b:free": "GPT-OSS 20B (OpenRouter)",
	"nvidia/nemotron-3-ultra-550b-a55b:free": "Nemotron 3 (OpenRouter)"
};
function ProjetoIA() {
	const navigate = useNavigate();
	const [messages, setMessages] = (0, import_react.useState)([]);
	const [input, setInput] = (0, import_react.useState)("");
	const [isLoading, setIsLoading] = (0, import_react.useState)(false);
	const [isComplete, setIsComplete] = (0, import_react.useState)(false);
	const [projectData, setProjectData] = (0, import_react.useState)(null);
	const [tasksData, setTasksData] = (0, import_react.useState)([]);
	const [showSummary, setShowSummary] = (0, import_react.useState)(false);
	const [selectedModel, setSelectedModel] = (0, import_react.useState)("gemini-2.5-flash");
	const [attachedFile, setAttachedFile] = (0, import_react.useState)(null);
	const fileInputRef = (0, import_react.useRef)(null);
	const messagesEndRef = (0, import_react.useRef)(null);
	const [isListening, setIsListening] = (0, import_react.useState)(false);
	const recognitionRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
		if (SpeechRecognition) {
			const recognition = new SpeechRecognition();
			recognition.continuous = true;
			recognition.interimResults = true;
			recognition.lang = "pt-BR";
			recognition.onstart = () => {
				setIsListening(true);
			};
			recognition.onend = () => {
				setIsListening(false);
			};
			recognition.onerror = (event) => {
				console.error("Erro no reconhecimento de voz:", event.error);
				setIsListening(false);
			};
			recognition.onresult = (event) => {
				let transcript = "";
				for (let i = event.resultIndex; i < event.results.length; i++) if (event.results[i].isFinal) transcript += event.results[i][0].transcript;
				if (transcript) setInput((prev) => {
					const trimmed = prev.trim();
					return trimmed ? `${trimmed} ${transcript}` : transcript;
				});
			};
			recognitionRef.current = recognition;
		}
		return () => {
			if (recognitionRef.current) recognitionRef.current.abort();
		};
	}, []);
	const toggleSpeechRecognition = () => {
		if (!recognitionRef.current) {
			alert("Seu navegador não suporta reconhecimento de voz. Recomendamos o Google Chrome ou Microsoft Edge.");
			return;
		}
		if (isListening) recognitionRef.current.stop();
		else try {
			recognitionRef.current.start();
		} catch (err) {
			console.error("Erro ao iniciar reconhecimento:", err);
		}
	};
	(0, import_react.useEffect)(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);
	const handleFileChange = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		if (![
			"image/jpeg",
			"image/png",
			"image/webp",
			"image/heic",
			"image/heif",
			"application/pdf",
			"text/plain"
		].includes(file.type)) {
			alert("Formato de arquivo não suportado. Envie imagens (JPG, PNG, WEBP), PDF ou texto.");
			return;
		}
		const reader = new FileReader();
		reader.onloadend = () => {
			const base64 = reader.result.split(",")[1];
			setAttachedFile({
				name: file.name,
				data: base64,
				mimeType: file.type
			});
		};
		reader.readAsDataURL(file);
	};
	const removeAttachedFile = () => {
		setAttachedFile(null);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};
	const handleSend = async (customText) => {
		const textToSend = customText || input;
		if (!textToSend.trim() && !attachedFile || isLoading) return;
		const parts = [];
		if (textToSend.trim()) parts.push({ text: textToSend });
		if (!customText && attachedFile) {
			parts.push({ inlineData: {
				data: attachedFile.data,
				mimeType: attachedFile.mimeType
			} });
			if (parts.length === 1) parts.unshift({ text: "Analise este arquivo para extrair as informações do projeto." });
		}
		const userMessage = {
			role: "user",
			parts
		};
		const newMessages = [...messages, userMessage];
		setMessages(newMessages);
		if (!customText) {
			setInput("");
			setAttachedFile(null);
			if (fileInputRef.current) fileInputRef.current.value = "";
		}
		setIsLoading(true);
		const messagesForApi = newMessages.map((msg, index) => {
			if (index === newMessages.length - 1) return msg;
			return {
				...msg,
				parts: msg.parts.map((p) => p.text ? { text: p.text } : { text: "[Arquivo anexado na mensagem anterior]" })
			};
		});
		try {
			const today = /* @__PURE__ */ new Date();
			const localDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
			const aiData = (await api.post("/ai/chat", {
				messages: messagesForApi,
				model: selectedModel,
				currentDate: localDate
			})).data;
			const aiMessage = {
				role: "model",
				parts: [{ text: aiData.reply }]
			};
			setMessages((prev) => [...prev, aiMessage]);
			if (aiData.extracted_data) setProjectData(aiData.extracted_data);
			if (aiData.is_complete) {
				setIsComplete(true);
				if (aiData.tasks) {
					setTasksData(aiData.tasks);
					setShowSummary(true);
				}
			}
		} catch (error) {
			console.error("Erro ao enviar mensagem:", error);
			const errorMessage = {
				role: "model",
				parts: [{ text: "Desculpe, ocorreu um erro ao processar sua solicitação." }]
			};
			setMessages((prev) => [...prev, errorMessage]);
		} finally {
			setIsLoading(false);
		}
	};
	const handleKeyDown = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};
	const removeTask = (indexToRemove) => {
		setTasksData((prev) => prev.filter((_, i) => i !== indexToRemove));
	};
	const suggestNewTasks = () => {
		handleSend("Por favor, sugira outras tarefas diferentes para este projeto.");
	};
	const handleConfirmAndCreate = async () => {
		setIsLoading(true);
		try {
			await api.post("/projects/with-tasks", {
				project: projectData,
				tasks: tasksData
			});
			navigate({ to: "/projetos" });
		} catch (error) {
			console.error("Erro ao criar projeto:", error);
			setIsLoading(false);
			alert("Erro ao criar projeto. Verifique se todas as informações estão corretas.");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white rounded-3xl p-8 overflow-hidden min-w-0 flex-1 scrollbar-none flex flex-col relative h-full max-h-[calc(100vh-100px)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-8 w-full shrink-0 z-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
						size: "sm",
						onPress: () => navigate({ to: "/projetos" }),
						variant: "onlyIcon",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {
							width: 16,
							height: 16
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-semibold tracking-tight text-secondary leading-none",
						children: "Novo Projeto"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [projectData && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button$1, {
						onPress: () => setShowSummary(!showSummary),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sliders, {
							width: 16,
							height: 16,
							className: "mr-2"
						}), showSummary ? "Esconder Resumo" : "Ver Resumo"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
						onPress: () => navigate({ to: "/projetos/novo" }),
						size: "lg",
						children: "Criar Manualmente"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `flex-1 flex flex-col min-h-0 ${messages.length === 0 ? "items-center justify-center pb-20" : "justify-end"} max-w-3xl mx-auto w-full relative scrollbar-none`,
				children: [
					messages.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "w-full flex flex-col items-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								className: "w-24 h-24",
								src: "/logo.svg",
								alt: ""
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-[28px] font-medium text-secondary/40 tracking-tight",
								children: "Crie o Projeto em segundos"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-[34px] font-medium text-secondary tracking-tight mb-24",
								children: "Use IA para acelerar seu fluxo"
							})
						]
					}),
					messages.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 w-full overflow-y-auto mb-6 pr-2 flex flex-col gap-6 scrollbar-thin",
						children: [
							messages.map((msg, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `max-w-[85%] rounded-[20px] px-5 py-4 text-[15px] leading-relaxed flex flex-col gap-2 ${msg.role === "user" ? "bg-[#f4f4f5] text-secondary" : "bg-transparent text-secondary"}`,
									children: msg.parts.map((part, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [part.text && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: part.text }), part.inlineData && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 mt-2 bg-white/50 w-fit px-3 py-1.5 rounded-lg border border-zinc-200/50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "w-4 h-4 text-secondary/60" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[13px] font-medium text-secondary italic",
											children: "Arquivo anexado"
										})]
									})] }, i))
								})
							}, index)),
							isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex w-full justify-start",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-transparent px-5 py-4 flex gap-1.5 items-center",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 bg-zinc-300 rounded-full animate-bounce" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "w-2 h-2 bg-zinc-300 rounded-full animate-bounce",
											style: { animationDelay: "150ms" }
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "w-2 h-2 bg-zinc-300 rounded-full animate-bounce",
											style: { animationDelay: "300ms" }
										})
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: messagesEndRef })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "w-full bg-zinc-50 border border-zinc-200 rounded-2xl flex flex-col pt-4 pb-2 px-4 shadow-lg focus-within:border-zinc-300 transition-colors shrink-0",
						children: [
							attachedFile && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 mb-2 bg-white w-fit px-3 py-1.5 rounded-lg border border-zinc-200",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "w-4 h-4 text-secondary/60" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[13px] font-medium text-secondary truncate max-w-[200px]",
										children: attachedFile.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: removeAttachedFile,
										className: "text-secondary/40 hover:text-red-500 cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Xmark, { className: "w-4 h-4" })
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								className: "w-full bg-transparent outline-none resize-none text-[15px] text-secondary placeholder:text-secondary/50 max-h-[150px] overflow-y-auto",
								placeholder: isComplete ? "Projeto pronto para ser criado!" : "Digite [ / ] para comando ou descreva seu projeto...",
								value: input,
								onChange: (e) => setInput(e.target.value),
								onKeyDown: handleKeyDown,
								disabled: isLoading || isComplete
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-t border-zinc-200 pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 text-secondary/70",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "file",
											ref: fileInputRef,
											onChange: handleFileChange,
											className: "hidden",
											accept: "image/*,application/pdf,text/plain"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "hover:text-secondary cursor-pointer transition-colors",
											disabled: isLoading || isComplete,
											onClick: () => fileInputRef.current?.click(),
											title: "Anexar arquivo",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, {
												width: 15,
												height: 15
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative flex w-fit items-center text-xs font-medium transition-colors text-zinc-600 pr-2",
											title: "Selecionar modelo de IA",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-bold text-zinc-600 mr-1",
													children: "@"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "pr-4 pointer-events-none select-none text-zinc-700",
													children: MODEL_LABELS[selectedModel] || selectedModel
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "absolute right-1.5 w-3 h-3 text-zinc-400 pointer-events-none" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													value: selectedModel,
													onChange: (e) => setSelectedModel(e.target.value),
													className: "absolute inset-0 w-full h-full bg-transparent opacity-0 cursor-pointer",
													disabled: isLoading || isComplete,
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "gemini-2.5-flash",
															children: "Gemini Flash"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "gemini-1.5-pro",
															children: "Gemini Pro"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "gemma-4-31b-it",
															children: "Gemma-4"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "openai/gpt-oss-20b:free",
															children: "GPT-OSS 20B (OpenRouter)"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "nvidia/nemotron-3-ultra-550b-a55b:free",
															children: "Nemotron 3 (OpenRouter)"
														})
													]
												})
											]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: `transition-all p-1.5 cursor-pointer rounded-full ${isListening ? "text-red-500 bg-red-50 animate-pulse scale-110 shadow-sm border border-red-200" : "text-secondary/60 hover:text-secondary hover:bg-zinc-100"}`,
										disabled: isLoading || isComplete,
										onClick: toggleSpeechRecognition,
										title: isListening ? "Parar gravação" : "Gravar áudio",
										type: "button",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Microphone, {
											width: 16,
											height: 16
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
										onPress: () => handleSend(),
										isDisabled: isLoading || !input.trim() && !attachedFile || isComplete,
										variant: "primary",
										className: "size-8",
										size: "sm",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
											width: 14,
											height: 14,
											strokeWidth: 2.5
										})
									})]
								})]
							})
						]
					}),
					messages.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-secondary/40 font-medium mt-4 text-center",
						children: "O conteúdo é gerado por IA e pode apresentar erros ou informações incorretas."
					})
				]
			}),
			showSummary && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute top-24 right-8 w-95 bg-white rounded-3xl shadow-2xl border border-zinc-100 flex flex-col max-h-[calc(100%-120px)] z-20 overflow-hidden animate-in fade-in slide-in-from-right-8 duration-200",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between p-5 border-b border-zinc-100 shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-medium text-secondary text-lg flex items-center",
							children: "Resumo do Projeto"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "p-1 hover:bg-zinc-100 rounded-full text-secondary/60 hover:text-secondary transition-colors cursor-pointer",
							onClick: () => setShowSummary(false),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Xmark, { className: "w-5 h-5" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5 overflow-y-auto flex flex-col gap-6 scrollbar-thin",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-[11px] font-bold text-secondary/50 uppercase tracking-wider",
								children: "Informações Extraídas"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-[#f4f4f5] rounded-2xl p-4 flex flex-col gap-2.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[13px] text-secondary/60",
											children: "Nome"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[13px] font-medium text-secondary text-right",
											children: projectData?.name || "-"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[13px] text-secondary/60",
											children: "Cliente"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[13px] font-medium text-secondary text-right truncate max-w-[150px]",
											children: projectData?.client_id || "-"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[13px] text-secondary/60",
											children: "Área"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[13px] font-medium text-secondary text-right",
											children: projectData?.area || "-"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[13px] text-secondary/60",
											children: "Valor"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[13px] font-medium text-secondary text-right",
											children: projectData?.project_value ? `R$ ${projectData.project_value}` : "-"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[13px] text-secondary/60",
											children: "Início"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[13px] font-medium text-secondary text-right",
											children: projectData?.start_date || "-"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[13px] text-secondary/60",
											children: "Entrega"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[13px] font-medium text-secondary text-right",
											children: projectData?.expected_delivery_date || "-"
										})]
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-xs font-bold text-secondary/50 uppercase tracking-wider",
										children: "Tarefas Sugeridas"
									}), tasksData.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-medium bg-secondary text-zinc-50 px-1.5 py-0.5  rounded-full",
										children: tasksData.length
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-col gap-2.5",
									children: tasksData.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[13px] text-secondary/50 italic text-center py-4",
										children: "Nenhuma tarefa sugerida ainda."
									}) : tasksData.map((task, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bg-white border border-zinc-200 rounded-2xl p-3 shadow-sm flex flex-col gap-1 relative group",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => removeTask(idx),
												className: "absolute top-2 right-2 p-1 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded-full transition-all cursor-pointer",
												title: "Remover Tarefa",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Xmark, { className: "w-4 h-4" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[14px] font-medium text-secondary pr-6",
												children: task.title
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[12px] text-secondary/60 line-clamp-2 pr-2",
												children: task.description
											}),
											task.estimated_hours && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[11px] font-medium bg-zinc-100 text-secondary w-fit px-2 py-1 rounded-md mt-1",
												children: [task.estimated_hours, "h"]
											})
										]
									}, idx))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button$1, {
									className: "w-full mt-1 text-xs text-secondary bg-zinc-100 hover:bg-zinc-200 font-medium transition-colors",
									onPress: suggestNewTasks,
									isDisabled: isLoading,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-4 h-4 mr-1.5" }), "Sugerir Novas Tarefas"]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-5 border-t border-zinc-100 bg-zinc-50 shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button$1, {
							className: "w-full bg-primary/50 hover:bg-primary text-secondary font-medium rounded-full py-2.5 border-none transition-all shadow-md",
							onPress: handleConfirmAndCreate,
							isPending: isLoading,
							isDisabled: !isComplete,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mr-2" }), "Confirmar e Criar Projeto"]
						})
					})
				]
			})
		]
	});
}
//#endregion
export { ProjetoIA as component };
