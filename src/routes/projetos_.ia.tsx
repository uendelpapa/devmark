import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Sidebar } from '../components/Sidebar'
import { Header } from '../components/Header'
import { TimerProvider } from '../components/TimerTracker'
import { Button } from '@heroui/react'
import { ChevronLeft, Sparkles, Microphone, ArrowRight, Paperclip } from '@gravity-ui/icons'

export const Route = createFileRoute('/projetos_/ia')({
  component: ProjetoIA
})

function ProjetoIA() {
  const navigate = useNavigate()

  return (
    <TimerProvider>
      <div className="flex h-screen w-screen bg-backpage font-sans overflow-hidden select-none">
        <Sidebar />
        <div className="flex-1 flex flex-col px-4.5 py-2.25 gap-2 h-full min-w-0">
          <Header />
          
          <div className="bg-white rounded-[24px] p-8 overflow-y-auto min-w-0 flex-1 scrollbar-none flex flex-col">
            {/* Cabeçalho da página */}
            <div className="flex items-center justify-between mb-8 w-full">
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

              <Button
                className="bg-[#a9e278]/30 hover:bg-[#a9e278] text-[#334621] font-semibold rounded-full px-5 py-2 border-none text-[13px] cursor-pointer transition-colors"
                onPress={() => navigate({ to: '/projetos/novo' })}
              >
                Criar Manualmente
              </Button>
            </div>

            {/* Conteúdo Central */}
            <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full pb-20">
              
              {/* Ícone Animado (Folha/Chama) */}
              <div className="mb-6 relative flex items-center justify-center">
                <svg
                  className="w-24 h-24 text-[#a9e278] fill-none"
                  viewBox="0 0 28 28"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 3C14 3 8.5 7.5 8.5 13.5C8.5 19.5 14 25 14 25C14 25 19.5 19.5 19.5 13.5C19.5 7.5 14 3 14 3Z" />
                  <path d="M14 9C14 9 11.5 12 11.5 15.5C11.5 19 14 22 14 22C14 22 16.5 19 16.5 15.5C16.5 12 14 9 14 9Z" />
                  <path d="M14 25V17" />
                </svg>
                {/* Opcional: Efeito de brilho ao fundo */}
                <div className="absolute inset-0 bg-[#a9e278]/10 blur-2xl rounded-full scale-150" />
              </div>

              {/* Títulos */}
              <h2 className="text-[28px] font-medium text-secondary/40 mb-1 tracking-tight">
                Crie o Projeto em segundos
              </h2>
              <h1 className="text-[34px] font-medium text-secondary tracking-tight mb-12">
                Use IA para acelerar seu fluxo
              </h1>

              {/* Caixa de Input (Prompt) */}
              <div className="w-full bg-[#f4f4f5] rounded-2xl flex flex-col pt-4 pb-3 px-4 shadow-sm border border-transparent focus-within:border-zinc-300 transition-colors">
                <textarea 
                  className="w-full bg-transparent outline-none resize-none text-[15px] text-secondary placeholder:text-secondary/50 min-h-[50px] overflow-hidden"
                  placeholder="Digite [ / ] para comando"
                />
                
                <div className="flex items-center justify-between border-t border-zinc-200/80 pt-3 mt-1">
                  <div className="flex items-center gap-3 text-secondary/70">
                    <button className="hover:text-secondary cursor-pointer transition-colors p-1">
                      <Paperclip width={15} height={15} />
                    </button>
                    <button className="flex items-center gap-1.5 text-[13px] font-medium hover:text-secondary cursor-pointer transition-colors p-1">
                      <span className="font-bold">@</span>
                      <Sparkles width={14} height={14} />
                      Agent
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button className="text-secondary/60 hover:text-secondary transition-colors p-1 cursor-pointer">
                      <Microphone width={16} height={16} />
                    </button>
                    <button className="bg-[#a9e278] hover:bg-[#97d066] text-[#334621] size-8 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-sm shrink-0">
                      <ArrowRight width={14} height={14} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Aviso do Rodapé */}
              <p className="text-[11px] text-secondary/40 font-medium mt-4 text-center">
                O conteúdo é gerado por IA e pode apresentar erros ou informações incorretas.
              </p>

            </div>
          </div>
        </div>
      </div>
    </TimerProvider>
  )
}
