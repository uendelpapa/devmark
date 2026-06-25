import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Button, ProgressBar, Avatar } from '@heroui/react'
import { ArrowLeft, Layers, Briefcase, TrashBin } from '@gravity-ui/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  fetchProjectDetails,
  createPayment,
  deletePayment,
  createProjectExpense,
  deleteProjectExpense 
} from '../../services/api'
import { AddPaymentModal } from '../../components/AddPaymentModal'
import { AddExpenseModal } from '../../components/AddExpenseModal'

export const Route = createFileRoute('/_authenticated/projetos_/$projectId')({
  component: ProjectDetailsPage
})

function ProjectDetailsPage() {
  const { projectId } = Route.useParams()
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)

  const queryClient = useQueryClient()

  const { data: project, isLoading } = useQuery({
    queryKey: ['projectDetails', projectId],
    queryFn: () => fetchProjectDetails(projectId),
    enabled: !!projectId
  })

  // Mutations
  const { mutate: handleCreatePayment, isPending: isCreatingPayment, error: paymentError } = useMutation({
    mutationFn: createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectDetails', projectId] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      setIsPaymentModalOpen(false)
    }
  })

  const { mutate: handleDeletePayment } = useMutation({
    mutationFn: deletePayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectDetails', projectId] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    }
  })

  const { mutate: handleCreateExpense, isPending: isCreatingExpense, error: expenseError } = useMutation({
    mutationFn: createProjectExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectDetails', projectId] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      setIsExpenseModalOpen(false)
    }
  })

  const { mutate: handleDeleteExpense } = useMutation({
    mutationFn: deleteProjectExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectDetails', projectId] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    }
  })


  const formatCurrency = (val: any) => {
    const num = parseFloat(val)
    if (isNaN(num)) return 'R$ 0,00'
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' })
  }

  const getCategoryInfo = (cat: string) => {
    switch (cat) {
      case 'AI':
        return { label: 'Inteligência Artificial', bg: 'bg-indigo-100', color: 'text-indigo-700' }
      case 'SOFTWARE':
        return { label: 'Software', bg: 'bg-blue-100', color: 'text-blue-700' }
      case 'DOMAIN':
        return { label: 'Domínio', bg: 'bg-amber-100', color: 'text-amber-700' }
      case 'HOSTING':
        return { label: 'Hospedagem', bg: 'bg-purple-100', color: 'text-purple-700' }
      case 'DESIGN':
        return { label: 'Design', bg: 'bg-pink-100', color: 'text-pink-700' }
      case 'ADS':
        return { label: 'Anúncios / Ads', bg: 'bg-red-100', color: 'text-red-700' }
      case 'FREELANCER':
        return { label: 'Freelancer', bg: 'bg-teal-100', color: 'text-teal-700' }
      default:
        return { label: 'Outros', bg: 'bg-zinc-200', color: 'text-secondary/70' }
    }
  }

  const getPriorityInfo = (pri: string) => {
    switch (pri) {
      case 'LOW':
        return { label: 'Baixa', bg: 'bg-zinc-200 text-zinc-900' }
      case 'MEDIUM':
        return { label: 'Média', bg: 'bg-sky-200 text-zinc-900' }
      case 'HIGH':
        return { label: 'Alta', bg: 'bg-orange-200 text-zinc-900' }
      case 'URGENT':
        return { label: 'Urgente', bg: 'bg-red-200 text-zinc-900' }
      default:
        return { label: pri, bg: 'bg-zinc-200 text-zinc-900' }
    }
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PLANNING':
        return { label: 'Planejamento', bg: 'bg-blue-200 text-zinc-900' }
      case 'IN_PROGRESS':
        return { label: 'Em Andamento', bg: 'bg-amber-200 text-zinc-900' }
      case 'WAITING_CLIENT':
        return { label: 'Aguardando Cliente', bg: 'bg-purple-200 text-zinc-900' }
      case 'REVIEW':
        return { label: 'Revisão', bg: 'bg-indigo-200 text-zinc-900' }
      case 'COMPLETED':
        return { label: 'Concluído', bg: 'bg-emerald-200 text-zinc-900' }
      case 'CANCELED':
        return { label: 'Cancelado', bg: 'bg-rose-200 text-zinc-900' }
      default:
        return { label: status, bg: 'bg-zinc-200 text-zinc-900' }
    }
  }

  const getErrorMessage = (err: any) => {
    if (!err) return null
    return Array.isArray(err.response?.data?.message)
      ? err.response.data.message.join(', ')
      : err.response?.data?.message || err.message
  }

  // Calculate task stats
  const totalTasks = project?.tasks.length || 0
  const completedTasks = project?.tasks.filter(t => t.status === 'COMPLETED').length || 0
  const allTasks = [...(project?.tasks || [])].sort((a, b) => {
    const STATUS_ORDER: Record<string, number> = {
      IN_PROGRESS: 1,
      REVIEW: 2,
      PENDING: 3,
      COMPLETED: 4,
      CANCELED: 5
    }
    return (STATUS_ORDER[a.status] || 99) - (STATUS_ORDER[b.status] || 99)
  })
  const pendingTasks = totalTasks - completedTasks
  const progressPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)

  // Calculate duration stats (using worked_hours and days elapsed)
  const totalWorkedHours = project?.tasks.reduce((acc, t) => acc + (t.worked_hours || 0), 0) || 0

  // Calculate days elapsed (from created_at)
  const startDate = new Date(project?.created_at || Date.now())
  const endDate = project?.expected_delivery_date ? new Date(project.expected_delivery_date) : new Date()
  // Ensure we don't calculate negative days if future
  const diffTime = Math.max(0, endDate.getTime() - startDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  // Calculate total project expenses
  const totalExpenses = project?.project_expenses.reduce((acc, exp) => acc + parseFloat(exp.value as any), 0) || 0

  return (
    <div className="bg-white rounded-[32px] p-2 md:p-4 lg:p-6 overflow-y-auto min-w-0 h-fit max-h-[calc(100vh-100px)] scrollbar-none flex flex-col gap-6 lg:gap-8">
      {/* Header Limpo */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-zinc-100">
        <div className="flex items-center gap-4">
          <Button
            isIconOnly
            variant="ghost"
            onPress={() => window.history.back()}
            className="bg-zinc-100 hover:bg-zinc-200 text-secondary rounded-full size-10 min-w-10 border-none"
          >
            <ArrowLeft width={20} height={20} />
          </Button>

          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-medium tracking-tight text-secondary leading-none">
              {isLoading ? 'Carregando...' : project?.name}
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-zinc-100 text-secondary font-medium px-3 py-1 rounded-full text-xs flex items-center gap-1.5">
                <Briefcase className="size-3.5 opacity-80" />
                {isLoading ? '...' : project?.client.name}
              </span>
              {!isLoading && project?.status && (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusInfo(project.status).bg}`}>
                  {getStatusInfo(project.status).label}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Progresso das Tarefas Widget */}
        <div className="w-full md:w-72 bg-primary/50 rounded-[24px] p-5 flex flex-col gap-3 text-secondary">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-xs uppercase tracking-wider">Progresso das Tarefas</span>
            <span className="font-bold text-lg">{progressPercent}%</span>
          </div>
          <ProgressBar
            value={progressPercent}
            color="success"
            className="w-full"
          />
          <div className="flex items-center justify-between text-xs font-medium opacity-80">
            <span>{completedTasks} Concluídas</span>
            <span>{pendingTasks} Restantes</span>
          </div>
        </div>
      </div>

      {/* Bento Grid: Visão Geral */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Coluna Principal - Esquerda (8 colunas) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Card Sobre o Projeto */}
          <div className="bg-[#F4F4F6] rounded-[24px] p-6 text-secondary flex flex-col gap-4">
            <h3 className="font-semibold text-secondary text-lg">
              Sobre o Projeto
            </h3>
            <p className="text-secondary/70 text-sm leading-relaxed">
              {isLoading ? (
                <div className="h-16 bg-secondary/10 animate-pulse rounded-xl w-full" />
              ) : (
                project?.description || 'Nenhuma descrição detalhada foi fornecida para este projeto. Adicione uma descrição para manter a equipe alinhada.'
              )}
            </p>
          </div>

          {/* Tarefas do Projeto */}
          <div className="bg-zinc-100 rounded-[24px] p-6 text-secondary flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-secondary/5">
              <h3 className="font-semibold text-secondary text-lg">
                Quadro de Tarefas
              </h3>
              <span className="text-xs font-semibold text-secondary/50 bg-secondary/20 px-3 py-1 rounded-full">
                {allTasks.length} tarefas
              </span>
            </div>

            {allTasks.length > 0 ? (
              <div className="flex flex-col">
                {allTasks.map(task => {
                  const priInfo = getPriorityInfo(task.priority)
                  const stInfo = getStatusInfo(task.status)
                  return (
                    <div 
                      key={task.id} 
                      className="flex items-center justify-between py-3 border-b border-secondary/5 last:border-0 w-full min-w-0"
                    >
                      <div className="flex flex-col gap-1 min-w-0 pr-4 flex-1">
                        <span className="font-bold text-secondary text-[14px] truncate">
                          {task.title}
                        </span>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${stInfo.bg}`}>
                            {stInfo.label}
                          </span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${priInfo.bg}`}>
                            {priInfo.label}
                          </span>
                          {task.due_date && (
                            <span className="text-secondary/50 text-[11px] font-medium">
                              Entrega: {formatDate(task.due_date)}
                            </span>
                          )}
                        </div>
                      </div>
                      {task.worked_hours !== undefined && (
                        <div className="flex flex-col items-end shrink-0">
                          <span className="text-[10px] font-bold text-secondary/40 uppercase tracking-wider">Horas</span>
                          <span className="text-[14px] font-bold text-secondary">
                            {task.worked_hours}h
                          </span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center bg-white/20 border border-dashed border-secondary/15 rounded-2xl gap-3">
                <Layers className="size-8 text-secondary/30" />
                <p className="text-secondary/60 text-sm font-medium text-center">O projeto ainda não possui tarefas.<br/>Crie tarefas no painel principal.</p>
              </div>
            )}
          </div>

        </div>

        {/* Coluna Lateral - Direita (4 colunas) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Card de Tempo & Esforço */}
          <div className="bg-[#F4F4F6] rounded-[24px] p-6 text-secondary flex flex-col gap-5">
            <h3 className="font-semibold text-secondary text-lg">
              Tempo & Esforço
            </h3>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-secondary/60 text-sm">Duração Atual</span>
                <span className="font-bold text-secondary text-lg">
                  {diffDays} {diffDays === 1 ? 'dia' : 'dias'}
                </span>
              </div>
              
              <div className="h-[1px] bg-secondary/5" />
              
              <div className="flex items-center justify-between">
                <span className="text-secondary/60 text-sm">Total Trabalhado</span>
                <span className="font-bold text-secondary text-lg">{totalWorkedHours}h</span>
              </div>
            </div>
          </div>

          {/* Card Informações do Cliente */}
          <div className="bg-zinc-100 rounded-[24px] p-6 text-secondary flex flex-col gap-4">
            <h3 className="font-semibold text-secondary text-lg">
              Cliente
            </h3>

            {isLoading ? (
               <div className="h-20 bg-secondary/10 animate-pulse rounded-2xl w-full" />
            ) : project?.client ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="size-10 shrink-0">
                    <Avatar.Image
                      alt={project.client.name}
                      src={`https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/${project.client.name.length % 2 === 0 ? 'orange' : 'blue'}.jpg`}
                    />
                    <Avatar.Fallback>{project.client.name.charAt(0).toUpperCase()}</Avatar.Fallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-secondary text-[14px] truncate">{project.client.name}</span>
                    <span className="text-secondary/60 text-[12px] truncate">{project.client.email || 'Sem email cadastrado'}</span>
                  </div>
                </div>

                <Button 
                  size="lg"
                  className="bg-primary/50 hover:bg-primary text-secondary font-bold rounded-full w-full border-none shadow-xs text-sm"
                  onPress={() => window.location.href = `mailto:${project.client.email}`}
                  isDisabled={!project.client.email}
                >
                  Entrar em Contato
                </Button>
              </div>
            ) : (
              <p className="text-secondary/60 text-sm">Cliente não vinculado.</p>
            )}
          </div>

        </div>
      </div>

      {/* Mini-Dashboard Financeiro */}
      <div className="flex flex-col gap-6 mt-4">
        
        <div>
          <h2 className="text-2xl font-medium tracking-tight text-secondary leading-none">
            Saúde Financeira
          </h2>
          <p className="text-secondary/60 text-sm mt-2">
            Controle de orçamentos, faturamentos e despesas ativas.
          </p>
        </div>

        {/* KPIs Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card Valor Projeto */}
          <div className="bg-zinc-100 rounded-[24px] p-5 flex flex-col gap-2">
            <span className="text-xs text-secondary/60 font-semibold uppercase tracking-wider">Orçamento Total</span>
            <span className="text-2xl font-bold text-secondary">{formatCurrency(project?.project_value)}</span>
          </div>

          {/* Card Recebido */}
          <div className="bg-primary/50 rounded-[24px] p-5 flex flex-col gap-2">
            <span className="text-xs text-secondary/70 font-semibold uppercase tracking-wider">Faturado</span>
            <span className="text-2xl font-bold text-secondary">{formatCurrency(project?.amount_received)}</span>
          </div>

          {/* Card Pendente */}
          <div className="bg-zinc-100 rounded-[24px] p-5 flex flex-col gap-2">
            <span className="text-xs text-secondary/60 font-semibold uppercase tracking-wider">A Receber</span>
            <span className="text-2xl font-bold text-secondary">{formatCurrency(project?.amount_pending)}</span>
          </div>

          {/* Card Gastos */}
          <div className="bg-[#F4F4F6] rounded-[24px] p-5 flex flex-col gap-2">
            <span className="text-xs text-secondary/60 font-semibold uppercase tracking-wider">Despesas</span>
            <span className="text-2xl font-bold text-secondary">{formatCurrency(totalExpenses)}</span>
          </div>
        </div>

        {/* Extratos: 2 Colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Coluna Receitas */}
          <div className="bg-zinc-100 rounded-[24px] p-6 text-secondary flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-secondary/5">
              <h3 className="font-semibold text-secondary text-lg">Histórico de Parcelas</h3>
              <Button
                size="sm"
                className="bg-primary/50 hover:bg-primary text-secondary font-bold rounded-full border-none px-4"
                onPress={() => setIsPaymentModalOpen(true)}
              >
                + Registrar Parcela
              </Button>
            </div>
            
            {project?.payments && project.payments.length > 0 ? (
              <div className="flex flex-col gap-1">
                {project.payments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between py-3 border-b border-secondary/5 last:border-0 w-full min-w-0">
                    <div className="flex flex-col gap-1 min-w-0 pr-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-secondary text-base">{formatCurrency(payment.amount)}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          payment.status === 'PAID' ? 'bg-emerald-200 text-zinc-900' :
                          payment.status === 'OVERDUE' ? 'bg-rose-200 text-zinc-900' :
                          payment.status === 'CANCELED' ? 'bg-zinc-200 text-zinc-900' :
                          'bg-amber-200 text-zinc-900'
                        }`}>
                          {payment.status === 'PAID' ? 'Pago' :
                           payment.status === 'OVERDUE' ? 'Atrasado' :
                           payment.status === 'CANCELED' ? 'Cancelado' :
                           'Pendente'}
                        </span>
                        {payment.payment_method && (
                          <span className="text-[10px] bg-zinc-200 text-zinc-900 font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {payment.payment_method}
                          </span>
                        )}
                      </div>
                      <span className="text-secondary/50 text-xs font-semibold">
                        Vence: {formatDate(payment.due_date)} 
                        {payment.payment_date && ` • Pago: ${formatDate(payment.payment_date)}`}
                      </span>
                      {payment.notes && (
                        <span className="text-secondary/50 text-[11px] font-medium italic mt-0.5 truncate max-w-sm">
                          "{payment.notes}"
                        </span>
                      )}
                    </div>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        if (confirm('Deseja realmente excluir esta parcela?')) {
                          handleDeletePayment(payment.id)
                        }
                      }}
                      className="bg-transparent hover:bg-red-50 text-secondary hover:text-red-500 rounded-full border-none shrink-0"
                    >
                      <TrashBin className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 flex flex-col items-center justify-center bg-white/20 border border-dashed border-secondary/15 rounded-2xl gap-2">
                <span className="text-secondary/50 text-sm font-medium">Nenhuma parcela cadastrada.</span>
              </div>
            )}
          </div>

          {/* Coluna Despesas */}
          <div className="bg-[#F4F4F6] rounded-[24px] p-6 text-secondary flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-secondary/5">
              <h3 className="font-semibold text-secondary text-lg">Registro de Despesas</h3>
              <Button
                size="sm"
                className="bg-rose-200 hover:bg-rose-300 text-red-700 font-bold rounded-full border-none px-4"
                onPress={() => setIsExpenseModalOpen(true)}
              >
                + Lançar Gasto
              </Button>
            </div>
            
            {project?.project_expenses && project.project_expenses.length > 0 ? (
              <div className="flex flex-col gap-1">
                {project.project_expenses.map((expense) => {
                  const catInfo = getCategoryInfo(expense.category);
                  return (
                    <div key={expense.id} className="flex items-center justify-between py-3 border-b border-secondary/5 last:border-0 w-full min-w-0">
                      <div className="flex flex-col gap-1 min-w-0 pr-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-secondary text-base truncate">{expense.title}</span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${catInfo.bg} ${catInfo.color}`}>
                            {catInfo.label}
                          </span>
                        </div>
                        {expense.description && (
                          <span className="text-secondary/50 text-xs font-semibold truncate max-w-sm">{expense.description}</span>
                        )}
                        <span className="text-secondary/40 text-[10px] font-medium">
                          {new Date(expense.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-bold text-red-600 text-base">
                          -{formatCurrency(expense.value)}
                        </span>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            if (confirm('Deseja excluir este lançamento?')) {
                              handleDeleteExpense(expense.id)
                            }
                          }}
                          className="bg-transparent hover:bg-red-50 text-secondary hover:text-red-500 rounded-full border-none shrink-0"
                        >
                          <TrashBin className="size-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 flex flex-col items-center justify-center bg-white/20 border border-dashed border-secondary/15 rounded-2xl gap-2">
                <span className="text-secondary/50 text-sm font-medium">Nenhum gasto registrado.</span>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Modals */}
      <AddPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSubmit={(data) => handleCreatePayment(data)}
        projectId={projectId}
        isPending={isCreatingPayment}
        error={getErrorMessage(paymentError)}
      />

      <AddExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSubmit={(data) => handleCreateExpense(data)}
        projectId={projectId}
        isPending={isCreatingExpense}
        error={getErrorMessage(expenseError)}
      />
    </div>
  )
}
