import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '@heroui/react'
import { ChevronLeft, Sparkles, Microphone, ArrowRight, Paperclip, Check, Xmark, Sliders } from '@gravity-ui/icons'
import { useState, useRef, useEffect } from 'react'
import { api } from '../../lib/axios'

export const Route = createFileRoute('/_authenticated/projetos_/ia')({
  component: ProjetoIA
})

function ProjetoIA() {
  const navigate = useNavigate()

  const [messages, setMessages] = useState<{ role: string; parts: any[] }[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [projectData, setProjectData] = useState<any>(null)
  const [tasksData, setTasksData] = useState<any[]>([])
  const [showSummary, setShowSummary] = useState(false)

  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash')
  const [attachedFile, setAttachedFile] = useState<{ name: string; data: string; mimeType: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check if it's an image or document that Gemini supports (PDF, text, images)
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'application/pdf', 'text/plain']
    if (!validTypes.includes(file.type)) {
      alert('Formato de arquivo não suportado. Envie imagens (JPG, PNG, WEBP), PDF ou texto.')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      const base64 = result.split(',')[1]
      setAttachedFile({ name: file.name, data: base64, mimeType: file.type })
    }
    reader.readAsDataURL(file)
  }

  const removeAttachedFile = () => {
    setAttachedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input
    if ((!textToSend.trim() && !attachedFile) || isLoading) return

    const parts: any[] = []
    if (textToSend.trim()) {
      parts.push({ text: textToSend })
    }

    if (!customText && attachedFile) {
      parts.push({
        inlineData: {
          data: attachedFile.data,
          mimeType: attachedFile.mimeType
        }
      })
      if (parts.length === 1) {
        parts.unshift({ text: "Analise este arquivo para extrair as informações do projeto." })
      }
    }

    const userMessage = { role: 'user', parts }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)

    if (!customText) {
      setInput('')
      setAttachedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
    setIsLoading(true)

    try {
      const response = await api.post('/ai/chat', {
        messages: newMessages,
        model: selectedModel
      })
      const aiData = response.data

      const aiMessage = { role: 'model', parts: [{ text: aiData.reply }] }
      setMessages(prev => [...prev, aiMessage])

      if (aiData.extracted_data) {
        setProjectData(aiData.extracted_data)
      }
      if (aiData.is_complete) {
        setIsComplete(true)
        if (aiData.tasks) {
          setTasksData(aiData.tasks)
          setShowSummary(true)
        }
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      const errorMessage = { role: 'model', parts: [{ text: 'Desculpe, ocorreu um erro ao processar sua solicitação.' }] }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const removeTask = (indexToRemove: number) => {
    setTasksData(prev => prev.filter((_, i) => i !== indexToRemove))
  }

  const suggestNewTasks = () => {
    handleSend('Por favor, sugira outras tarefas diferentes para este projeto.')
  }

  const handleConfirmAndCreate = async () => {
    setIsLoading(true)
    try {
      await api.post('/projects/with-tasks', {
        project: projectData,
        tasks: tasksData
      })
      navigate({ to: '/projetos' })
    } catch (error) {
      console.error('Erro ao criar projeto:', error)
      setIsLoading(false)
      alert('Erro ao criar projeto. Verifique se todas as informações estão corretas.')
    }
  }

  return (
    <div className="bg-white rounded-2xl p-8 overflow-hidden min-w-0 flex-1 scrollbar-none flex flex-col relative h-full max-h-[calc(100vh-100px)]">
      {/* Cabeçalho da página */}
      <div className="flex items-center justify-between mb-8 w-full shrink-0 z-10">
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            className="size-8 min-w-8 bg-primary/30 hover:bg-primary/50 text-secondary border-none rounded-full p-0 flex items-center justify-center shrink-0 cursor-pointer transition-colors"
            onPress={() => navigate({ to: '/projetos' })}
          >
            <ChevronLeft width={16} height={16} />
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight text-secondary leading-none">
            Novo Projeto
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {projectData && (
            <Button
              className="bg-zinc-100 hover:bg-zinc-200 text-secondary font-medium rounded-full px-5 py-2 border-none text-[13px] cursor-pointer transition-colors"
              onPress={() => setShowSummary(!showSummary)}
            >
              <Sliders width={16} height={16} className="mr-2" />
              {showSummary ? 'Esconder Resumo' : 'Ver Resumo'}
            </Button>
          )}
          <Button
            className="bg-[#a9e278]/30 hover:bg-[#a9e278] text-[#334621] font-semibold rounded-full px-5 py-2 border-none text-[13px] cursor-pointer transition-colors"
            onPress={() => navigate({ to: '/projetos/novo' })}
          >
            Criar Manualmente
          </Button>
        </div>
      </div>

      {/* Conteúdo Central */}
      <div className={`flex-1 flex flex-col min-h-0 ${messages.length === 0 ? 'items-center justify-center pb-20' : 'justify-end'} max-w-3xl mx-auto w-full relative`}>

        {messages.length === 0 && (
          <div className="w-full flex flex-col items-center gap-2">
            <img className="w-24 h-24" src="/logo.svg" alt="" />
            <h2 className="text-[28px] font-medium text-secondary/40 tracking-tight">
              Crie o Projeto em segundos
            </h2>
            <h1 className="text-[34px] font-medium text-secondary tracking-tight mb-24">
              Use IA para acelerar seu fluxo
            </h1>
          </div>
        )}

        {messages.length > 0 && (
          <div className="flex-1 w-full overflow-y-auto mb-6 pr-2 flex flex-col gap-6 scrollbar-thin">
            {messages.map((msg, index) => (
              <div key={index} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-[20px] px-5 py-4 text-[15px] leading-relaxed flex flex-col gap-2 ${msg.role === 'user'
                  ? 'bg-[#f4f4f5] text-secondary'
                  : 'bg-transparent text-secondary'
                  }`}>
                  {msg.parts.map((part, i) => (
                    <div key={i}>
                      {part.text && <span>{part.text}</span>}
                      {part.inlineData && (
                        <div className="flex items-center gap-2 mt-2 bg-white/50 w-fit px-3 py-1.5 rounded-lg border border-zinc-200/50">
                          <Paperclip className="w-4 h-4 text-secondary/60" />
                          <span className="text-[13px] font-medium text-secondary italic">Arquivo anexado</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex w-full justify-start">
                <div className="bg-transparent px-5 py-4 flex gap-1.5 items-center">
                  <span className="w-2 h-2 bg-zinc-300 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-zinc-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-zinc-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Caixa de Input (Prompt) */}
        <div className="w-full bg-[#f4f4f5] rounded-2xl flex flex-col pt-4 pb-3 px-4 shadow-sm border border-transparent focus-within:border-zinc-300 transition-colors shrink-0">
          {attachedFile && (
            <div className="flex items-center gap-2 mb-2 bg-white w-fit px-3 py-1.5 rounded-lg border border-zinc-200">
              <Paperclip className="w-4 h-4 text-secondary/60" />
              <span className="text-[13px] font-medium text-secondary truncate max-w-[200px]">{attachedFile.name}</span>
              <button onClick={removeAttachedFile} className="text-secondary/40 hover:text-red-500 cursor-pointer">
                <Xmark className="w-4 h-4" />
              </button>
            </div>
          )}

          <textarea
            className="w-full bg-transparent outline-none resize-none text-[15px] text-secondary placeholder:text-secondary/50 min-h-[50px] max-h-[150px] overflow-y-auto"
            placeholder={isComplete ? "Projeto pronto para ser criado!" : "Digite [ / ] para comando ou descreva seu projeto..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading || isComplete}
          />

          <div className="flex items-center justify-between border-t border-zinc-200/80 pt-3 mt-1">
            <div className="flex items-center gap-3 text-secondary/70">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,application/pdf,text/plain"
              />
              <button
                className="hover:text-secondary cursor-pointer transition-colors"
                disabled={isLoading || isComplete}
                onClick={() => fileInputRef.current?.click()}
                title="Anexar arquivo"
              >
                <Paperclip width={15} height={15} />
              </button>

              <div className="flex items-center text-xs font-medium transition-colors text-zinc-600" title="Selecionar modelo de IA">
                <span className="font-bold text-zinc-600">@</span>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="bg-transparent text-zinc-600 cursor-pointer outline-none font-medium"
                  disabled={isLoading || isComplete}
                >
                  <option value="gemini-2.5-flash">Agent Flash</option>
                  <option value="gemini-2.5-pro">Agent Pro</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="text-secondary/60 hover:text-secondary transition-colors p-1 cursor-pointer" disabled={isLoading || isComplete}>
                <Microphone width={16} height={16} />
              </button>
              <Button
                className="bg-[#a9e278] hover:bg-[#97d066] text-[#334621] size-8 min-w-8 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-sm shrink-0 p-0"
                onPress={() => handleSend()}
                isDisabled={isLoading || (!input.trim() && !attachedFile) || isComplete}
              >
                <ArrowRight width={14} height={14} strokeWidth={2.5} />
              </Button>
            </div>
          </div>
        </div>

        {/* Aviso do Rodapé */}
        {messages.length === 0 && (
          <p className="text-[11px] text-secondary/40 font-medium mt-4 text-center">
            O conteúdo é gerado por IA e pode apresentar erros ou informações incorretas.
          </p>
        )}
      </div>

      {/* Overlay: Resumo do Projeto */}
      {showSummary && (
        <div className="absolute top-24 right-8 w-95 bg-white rounded-3xl shadow-2xl border border-zinc-100 flex flex-col max-h-[calc(100%-120px)] z-20 overflow-hidden animate-in fade-in slide-in-from-right-8 duration-200">
          <div className="flex items-center justify-between p-5 border-b border-zinc-100 shrink-0">
            <h2 className="font-medium text-secondary text-lg flex items-center">
              Resumo do Projeto
            </h2>
            <button
              className="p-1 hover:bg-zinc-100 rounded-full text-secondary/60 hover:text-secondary transition-colors cursor-pointer"
              onClick={() => setShowSummary(false)}
            >
              <Xmark className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 overflow-y-auto flex flex-col gap-6 scrollbar-thin">
            <div className="flex flex-col gap-3">
              <h3 className="text-[11px] font-bold text-secondary/50 uppercase tracking-wider">Informações Extraídas</h3>
              <div className="bg-[#f4f4f5] rounded-2xl p-4 flex flex-col gap-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-secondary/60">Nome</span>
                  <span className="text-[13px] font-medium text-secondary text-right">{projectData?.name || '-'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-secondary/60">Cliente</span>
                  <span className="text-[13px] font-medium text-secondary text-right truncate max-w-[150px]">{projectData?.client_id || '-'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-secondary/60">Área</span>
                  <span className="text-[13px] font-medium text-secondary text-right">{projectData?.area || '-'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-secondary/60">Valor</span>
                  <span className="text-[13px] font-medium text-secondary text-right">
                    {projectData?.project_value ? `R$ ${projectData.project_value}` : '-'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-secondary/60">Início</span>
                  <span className="text-[13px] font-medium text-secondary text-right">{projectData?.start_date || '-'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-secondary/60">Entrega</span>
                  <span className="text-[13px] font-medium text-secondary text-right">{projectData?.expected_delivery_date || '-'}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-secondary/50 uppercase tracking-wider">Tarefas Sugeridas</h3>
                {tasksData.length > 0 && (
                  <span className="text-xs font-medium bg-secondary text-zinc-50 px-1.5 py-0.5  rounded-full">
                    {tasksData.length}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2.5">
                {tasksData.length === 0 ? (
                  <p className="text-[13px] text-secondary/50 italic text-center py-4">
                    Nenhuma tarefa sugerida ainda.
                  </p>
                ) : (
                  tasksData.map((task, idx) => (
                    <div key={idx} className="bg-white border border-zinc-200 rounded-2xl p-3 shadow-sm flex flex-col gap-1 relative group">
                      <button
                        onClick={() => removeTask(idx)}
                        className="absolute top-2 right-2 p-1 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded-full transition-all cursor-pointer"
                        title="Remover Tarefa"
                      >
                        <Xmark className="w-4 h-4" />
                      </button>
                      <p className="text-[14px] font-medium text-secondary pr-6">{task.title}</p>
                      <p className="text-[12px] text-secondary/60 line-clamp-2 pr-2">{task.description}</p>
                      {task.estimated_hours && (
                        <span className="text-[11px] font-medium bg-zinc-100 text-secondary w-fit px-2 py-1 rounded-md mt-1">
                          {task.estimated_hours}h
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>

              <Button
                className="w-full mt-1 text-xs text-secondary bg-zinc-100 hover:bg-zinc-200 font-medium transition-colors"
                onPress={suggestNewTasks}
                isDisabled={isLoading}
              >
                <Sparkles className="w-4 h-4 mr-1.5" />
                Sugerir Novas Tarefas
              </Button>
            </div>
          </div>

          <div className="p-5 border-t border-zinc-100 bg-zinc-50 shrink-0">
            <Button
              className="w-full bg-primary/50 hover:bg-primary text-secondary font-medium rounded-full py-2.5 border-none transition-all shadow-md"
              onPress={handleConfirmAndCreate}
              isPending={isLoading}
              isDisabled={!isComplete}
            >
              <Check className="mr-2" />
              Confirmar e Criar Projeto
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
