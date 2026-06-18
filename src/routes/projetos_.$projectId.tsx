import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Button, ProgressBar } from '@heroui/react'
import { ArrowLeft, Clock, Check, Layers, Briefcase, TrashBin } from '@gravity-ui/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  fetchProjectDetails,
  createPayment,
  deletePayment,
  createProjectExpense,
  deleteProjectExpense 
} from '../services/api'
import { AddPaymentModal } from '../components/AddPaymentModal'
import { AddExpenseModal } from '../components/AddExpenseModal'

export const Route = createFileRoute('/projetos_/$projectId')({
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
        return { label: 'Baixa', bg: 'bg-zinc-100', color: 'text-secondary/60' }
      case 'MEDIUM':
        return { label: 'Normal', bg: 'bg-blue-50', color: 'text-blue-600' }
      case 'HIGH':
        return { label: 'Alta', bg: 'bg-amber-50', color: 'text-amber-700' }
      case 'URGENT':
        return { label: 'Urgente', bg: 'bg-red-50', color: 'text-red-600' }
      default:
        return { label: pri, bg: 'bg-zinc-100', color: 'text-secondary/60' }
    }
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PENDING':
        return { label: 'A Fazer', bg: 'bg-zinc-100 text-secondary/60' }
      case 'IN_PROGRESS':
        return { label: 'Fazendo', bg: 'bg-amber-100 text-amber-700' }
      case 'REVIEW':
        return { label: 'Revisão', bg: 'bg-blue-100 text-blue-700' }
      case 'COMPLETED':
        return { label: 'Concluído', bg: 'bg-emerald-100 text-emerald-700' }
      case 'CANCELED':
        return { label: 'Cancelado', bg: 'bg-red-100 text-red-700' }
      default:
        return { label: status, bg: 'bg-zinc-100 text-secondary/60' }
    }
  }

  const getErrorMessage = (err: any) => {
    if (!err) return null
    return Array.isArray(err.response?.data?.message)
      ? err.response.data.message.join(', ')
      : err.response?.data?.message || err.message
  }

  // Calculate task stats
  const totalTasks = project?.tasks?.length || 0
  const completedTasks = project?.tasks?.filter(t => t.status === 'COMPLETED').length || 0
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
  const totalWorkedHours = project?.tasks?.reduce((acc, t) => acc + (t.worked_hours || 0), 0) || 0

  // Calculate days elapsed (from created_at)
  const startDate = new Date(project?.created_at || Date.now())
  const endDate = project?.expected_delivery_date ? new Date(project.expected_delivery_date) : new Date()
  // Ensure we don't calculate negative days if future
  const diffTime = Math.max(0, endDate.getTime() - startDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  // Calculate total project expenses
  const totalExpenses = project?.project_expenses?.reduce((acc, exp) => acc + parseFloat(exp.value as any), 0) || 0

  return (
    <div className="bg-white rounded-[24px] p-6 overflow-y-auto min-w-0 h-fit max-h-[calc(100vh-100px)] scrollbar-none flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          isIconOnly
          variant="ghost"
          onPress={() => window.history.back()}
          className="text-secondary hover:bg-zinc-100 rounded-full"
        >
          <ArrowLeft width={20} height={20} />
        </Button>
        <div className="flex items-center gap-3">
          <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary-dark">
            <Briefcase className="size-6" />
          </div>
          <div>
            <h1 className="text-3xl font-medium tracking-tight text-secondary leading-none mb-1">
              {isLoading ? 'Carregando...' : project?.name}
            </h1>
            <p className="text-secondary/60 text-base font-medium">
              {isLoading ? 'Aguarde os detalhes do projeto' : project?.client?.name}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2 flex flex-col gap-6">
          {/* Descrição */}
          <div className="bg-zinc-50 rounded-[16px] p-6 border border-zinc-100">
            <h3 className="font-semibold text-secondary mb-2">Sobre o Projeto</h3>
            <p className="text-secondary/80 text-sm">
              {isLoading ? (
                <div className="h-10 bg-zinc-200 animate-pulse rounded w-full" />
              ) : (
                project?.description || 'Sem descrição fornecida.'
              )}
            </p>
          </div>

          {/* Progresso Geral */}
          <div className="bg-zinc-50 rounded-[16px] p-6 border border-zinc-100">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-secondary font-bold text-lg">Progresso do Projeto</span>
                <span className="text-secondary font-bold text-lg">{progressPercent}%</span>
              </div>
              <ProgressBar
                value={progressPercent}
                color="success"
                className="w-full"
              />
            </div>
          </div>

          {/* Bottom Stats: Tasks */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#f0f9eb] rounded-[16px] p-6 flex flex-col gap-2 border border-[#d8f0cb]">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-10 rounded-full bg-[#BAF08A] flex items-center justify-center text-secondary">
                  <Check className="size-5" />
                </div>
                <span className="font-bold text-secondary text-lg">Feitas</span>
              </div>
              <span className="text-5xl font-black text-secondary">{completedTasks}</span>
              <span className="text-secondary/60 text-sm font-medium">tarefas concluídas</span>
            </div>

            <div className="bg-zinc-50 rounded-[16px] p-6 flex flex-col gap-2 border border-zinc-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-10 rounded-full bg-zinc-200 flex items-center justify-center text-secondary">
                  <Layers className="size-5" />
                </div>
                <span className="font-bold text-secondary text-lg">A Fazer</span>
              </div>
              <span className="text-5xl font-black text-secondary">{pendingTasks}</span>
              <span className="text-secondary/60 text-sm font-medium">tarefas restantes</span>
            </div>
          </div>

          {/* Project Tasks List */}
          <div className="bg-zinc-50 rounded-[16px] p-6 border border-zinc-100 flex flex-col gap-4">
            <h3 className="font-semibold text-secondary">Tarefas do Projeto</h3>
            {allTasks.length > 0 ? (
              <div className="flex flex-col gap-3">
                {allTasks.map(task => {
                  const priInfo = getPriorityInfo(task.priority)
                  const stInfo = getStatusInfo(task.status)
                  return (
                    <div key={task.id} className="bg-white rounded-[12px] p-4 border border-zinc-100 flex items-center justify-between shadow-xs">
                      <div className="flex flex-col gap-1 min-w-0 pr-2">
                        <span className="font-medium text-secondary text-sm truncate">{task.title}</span>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${priInfo.bg} ${priInfo.color}`}>
                            Prioridade: {priInfo.label}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stInfo.bg}`}>
                            {stInfo.label}
                          </span>
                          {task.due_date && (
                            <span className="text-secondary/40 text-[10px] font-medium">
                              Vence em: {formatDate(task.due_date)}
                            </span>
                          )}
                        </div>
                      </div>
                      {task.worked_hours !== undefined && (
                        <span className="text-sm font-bold text-secondary bg-zinc-100 px-3 py-1 rounded-full shrink-0">
                          {task.worked_hours}h
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-secondary/60 text-sm">Nenhuma tarefa registrada para este projeto.</p>
            )}
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="col-span-1 flex flex-col gap-4">
          {/* Top Stats: Duration */}
          <div className="bg-zinc-50 rounded-[16px] p-6 border border-zinc-100 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                <Clock className="size-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-secondary/60 text-sm font-medium">Duração até o momento</span>
                <span className="text-2xl font-bold text-secondary">
                  {diffDays} {diffDays === 1 ? 'dia' : 'dias'}
                </span>
              </div>
            </div>
            
            <div className="w-full h-px bg-zinc-200" />
            
            <div className="flex flex-col">
              <span className="text-secondary/60 text-sm font-medium">Horas Trabalhadas</span>
              <span className="text-3xl font-bold text-secondary">{totalWorkedHours}h</span>
            </div>
          </div>

          {/* Client Details */}
          <div className="bg-zinc-50 rounded-[16px] p-6 border border-zinc-100 flex flex-col gap-4">
            <h3 className="font-semibold text-secondary">Informações do Cliente</h3>
            {isLoading ? (
               <div className="h-16 bg-zinc-200 animate-pulse rounded w-full" />
            ) : project?.client ? (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col">
                  <span className="text-secondary/60 text-xs font-medium uppercase tracking-wider mb-0.5">Nome</span>
                  <span className="text-secondary font-medium text-sm">{project.client.name}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-secondary/60 text-xs font-medium uppercase tracking-wider mb-0.5">Email</span>
                  <span className="text-secondary font-medium text-sm">{project.client.email || 'Não informado'}</span>
                </div>
                <Button 
                  className="bg-primary/50 hover:bg-primary text-secondary font-bold w-full mt-2"
                  onPress={() => window.location.href = `mailto:${project.client.email}`}
                  isDisabled={!project.client.email}
                >
                  Enviar Email
                </Button>
              </div>
            ) : (
              <p className="text-secondary/60 text-sm">Cliente não encontrado.</p>
            )}
          </div>
        </div>
      </div>

      {/* Finanças do Projeto Section */}
      <div className="border-t border-zinc-200 pt-6 flex flex-col gap-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold text-secondary">Finanças do Projeto</h2>
            <p className="text-secondary/50 text-xs font-medium mt-0.5">Monitore os pagamentos recebidos e as despesas operacionais.</p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="bg-primary/50 hover:bg-primary text-secondary font-bold rounded-full border-none text-xs px-5 h-9 cursor-pointer transition-colors"
            >
              + Registrar Pagamento
            </button>
            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className="bg-secondary hover:bg-secondary/90 text-white font-bold rounded-full border-none text-xs px-5 h-9 cursor-pointer transition-colors"
            >
              + Registrar Gasto
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-50 border border-zinc-150 rounded-2xl p-4 flex flex-col gap-1 shadow-xs">
            <span className="text-[11px] text-secondary/50 font-bold uppercase tracking-wider">Valor do Projeto</span>
            <span className="text-2xl font-black text-secondary">{formatCurrency(project?.project_value)}</span>
          </div>
          <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-4 flex flex-col gap-1 shadow-xs">
            <span className="text-[11px] text-emerald-700/80 font-bold uppercase tracking-wider">Valor Recebido</span>
            <span className="text-2xl font-black text-emerald-700">{formatCurrency(project?.amount_received)}</span>
          </div>
          <div className="bg-amber-50/40 border border-amber-100 rounded-2xl p-4 flex flex-col gap-1 shadow-xs">
            <span className="text-[11px] text-amber-700/80 font-bold uppercase tracking-wider">Valor Pendente</span>
            <span className="text-2xl font-black text-amber-700">{formatCurrency(project?.amount_pending)}</span>
          </div>
          <div className="bg-red-50/40 border border-red-100 rounded-2xl p-4 flex flex-col gap-1 shadow-xs">
            <span className="text-[11px] text-red-700/80 font-bold uppercase tracking-wider">Gastos do Projeto</span>
            <span className="text-2xl font-black text-red-700">{formatCurrency(totalExpenses)}</span>
          </div>
        </div>

        {/* Two Columns for Payments and Expenses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pagamentos Column */}
          <div className="bg-zinc-50 border border-zinc-150 rounded-2xl p-5 flex flex-col gap-4 shadow-xs">
            <h3 className="font-bold text-secondary text-base leading-none">Parcelas de Pagamento</h3>
            
            {project?.payments && project.payments.length > 0 ? (
              <div className="flex flex-col gap-3">
                {project.payments.map((payment) => (
                  <div key={payment.id} className="bg-white rounded-xl p-4 border border-zinc-100 flex items-center justify-between shadow-xs hover:border-zinc-200 transition-colors">
                    <div className="flex flex-col gap-1 min-w-0 pr-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-secondary text-sm leading-none">{formatCurrency(payment.amount)}</span>
                        {payment.payment_method && (
                          <span className="text-[9px] bg-zinc-100 text-secondary/60 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {payment.payment_method}
                          </span>
                        )}
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          payment.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' :
                          payment.status === 'OVERDUE' ? 'bg-red-100 text-red-700' :
                          payment.status === 'CANCELED' ? 'bg-zinc-200 text-secondary/50' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {payment.status === 'PAID' ? 'Pago' :
                           payment.status === 'OVERDUE' ? 'Atrasado' :
                           payment.status === 'CANCELED' ? 'Cancelado' :
                           'Pendente'}
                        </span>
                      </div>
                      <span className="text-secondary/50 text-xs font-semibold">
                        Vence em: {formatDate(payment.due_date)} 
                        {payment.payment_date && ` • Pago em: ${formatDate(payment.payment_date)}`}
                      </span>
                      {payment.notes && (
                        <span className="text-secondary/40 text-[11px] font-medium italic truncate">
                          Obs: {payment.notes}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        if (confirm('Deseja realmente excluir esta parcela de pagamento?')) {
                          handleDeletePayment(payment.id)
                        }
                      }}
                      className="size-8 rounded-xl hover:bg-red-50 text-red-400 hover:text-red-600 flex items-center justify-center border-none bg-transparent cursor-pointer transition-colors shrink-0"
                    >
                      <TrashBin className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-secondary/60 text-sm py-4 text-center bg-white border border-dashed border-zinc-200 rounded-xl font-medium">Nenhum pagamento registrado para este projeto.</p>
            )}
          </div>

          {/* Gastos Column */}
          <div className="bg-zinc-50 border border-zinc-150 rounded-2xl p-5 flex flex-col gap-4 shadow-xs">
            <h3 className="font-bold text-secondary text-base leading-none">Gastos do Projeto</h3>
            
            {project?.project_expenses && project.project_expenses.length > 0 ? (
              <div className="flex flex-col gap-3">
                {project.project_expenses.map((expense) => {
                  const catInfo = getCategoryInfo(expense.category);
                  return (
                    <div key={expense.id} className="bg-white rounded-xl p-4 border border-zinc-100 flex items-center justify-between shadow-xs hover:border-zinc-200 transition-colors">
                      <div className="flex flex-col gap-1 min-w-0 pr-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-secondary text-sm truncate leading-none">{expense.title}</span>
                          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${catInfo.bg} ${catInfo.color}`}>
                            {catInfo.label}
                          </span>
                        </div>
                        {expense.description && (
                          <span className="text-secondary/50 text-xs truncate font-medium">{expense.description}</span>
                        )}
                        <span className="text-secondary/40 text-[10px] font-medium">
                          Registrado em: {new Date(expense.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-black text-red-600 text-sm">
                          -{formatCurrency(expense.value)}
                        </span>
                        <button
                          onClick={() => {
                            if (confirm('Deseja realmente excluir este gasto?')) {
                              handleDeleteExpense(expense.id)
                            }
                          }}
                          className="size-8 rounded-xl hover:bg-red-50 text-red-400 hover:text-red-600 flex items-center justify-center border-none bg-transparent cursor-pointer transition-colors"
                        >
                          <TrashBin className="size-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-secondary/60 text-sm py-4 text-center bg-white border border-dashed border-zinc-200 rounded-xl font-medium">Nenhum gasto registrado para este projeto.</p>
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
