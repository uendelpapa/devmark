import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { Avatar, Button } from '@heroui/react'
import { Layers, Briefcase, TrashBin, Clock, CommentDot, Plus, CircleDollar, ChevronLeft, ClockArrowRotateLeft, EnvelopeOpen, Check } from '@gravity-ui/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchProjectDetails,
  createPayment,
  deletePayment,
  createProjectExpense,
  deleteProjectExpense,
  updateTaskStatus,
  deleteTask
} from '../../services/api'
import { AddPaymentModal } from '../../components/finance/AddPaymentModal'
import { AddExpenseModal } from '../../components/finance/AddExpenseModal'

export const Route = createFileRoute('/_authenticated/projetos_/$projectId')({
  component: ProjectDetailsPage
})

// ─── Activity Rings Chart (Concentric arcs) ────────────────────────────────
interface RingsChartProps {
  data: { label: string; value: number; color: string }[]
  size?: number
}

function TaskRingsChart({ data, size = 170 }: RingsChartProps) {
  const total = data.reduce((acc, d) => acc + d.value, 0)
  const activeData = data.filter(d => d.value > 0)

  if (total === 0) {
    return (
      <div className="flex items-center gap-6">
        <div className="flex flex-col gap-2">
          {data.slice(0, 4).map((d, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="size-2.5 rounded-full bg-zinc-200" />
              <span className="text-xs text-secondary/40 font-medium">{d.label}</span>
            </div>
          ))}
        </div>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {[0, 1, 2].map(i => {
            const r = size / 2 - 14 - i * 18
            const circumference = 2 * Math.PI * r
            return (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke="#e4e4e7"
                strokeWidth={13}
                strokeLinecap="round"
                strokeDasharray={`${circumference * 0.75} ${circumference}`}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
            )
          })}
        </svg>
      </div>
    )
  }

  // Up to 4 rings (outermost = first item with data)
  const ringData = activeData.slice(0, 4)
  const center = size / 2
  const strokeWidth = 13
  const gap = 18

  return (
    <div className="flex items-center gap-6">
      {/* Legend */}
      <div className="flex flex-col gap-2.5">
        {ringData.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="size-2.5 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-xs text-secondary/70 font-semibold">{d.label}</span>
          </div>
        ))}
      </div>

      {/* Rings SVG */}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {ringData.map((d, i) => {
          const r = center - 14 - i * gap
          const circumference = 2 * Math.PI * r
          const fraction = d.value / total
          // At least 8% arc so short values are visible, max 92% so it doesn't look full
          const arcFraction = Math.min(0.92, Math.max(0.08, fraction))
          const dashLength = circumference * arcFraction
          const gapLength = circumference - dashLength

          return (
            <g key={i}>
              {/* Background track */}
              <circle
                cx={center}
                cy={center}
                r={r}
                fill="none"
                stroke="#e4e4e7"
                strokeWidth={strokeWidth}
                opacity={0.5}
              />
              {/* Colored arc */}
              <circle
                cx={center}
                cy={center}
                r={r}
                fill="none"
                stroke={d.color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={`${dashLength} ${gapLength}`}
                transform={`rotate(-90 ${center} ${center})`}
                className="transition-all duration-700"
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────

function ProjectDetailsPage() {
  const { projectId } = Route.useParams()
  const navigate = useNavigate()
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

  const { mutate: handleUpdateTaskStatus } = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => updateTaskStatus(id, status as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectDetails', projectId] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    }
  })

  const { mutate: handleDeleteTask } = useMutation({
    mutationFn: deleteTask,
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

  // Pie chart data
  const pieData = useMemo(() => {
    if (!project?.tasks) return []
    const counts: Record<string, number> = { PENDING: 0, IN_PROGRESS: 0, REVIEW: 0, COMPLETED: 0, CANCELED: 0 }
    project.tasks.forEach(t => { counts[t.status] = (counts[t.status] || 0) + 1 })
    return [
      { label: 'To do', value: counts.PENDING, color: '#d4d4d8' },
      { label: 'Fazendo', value: counts.IN_PROGRESS, color: '#fde68a' },
      { label: 'Revisão', value: counts.REVIEW, color: '#bfdbfe' },
      { label: 'Feito', value: counts.COMPLETED, color: '#a7f3d0' },
      { label: 'Cancelado', value: counts.CANCELED, color: '#fecdd3' },
    ]
  }, [project?.tasks])

  // Calculate duration stats
  const totalWorkedHours = project?.tasks.reduce((acc: number, t: any) => acc + (t.worked_hours || 0), 0) || 0

  const startDate = new Date(project?.created_at || Date.now())
  const endDate = project?.expected_delivery_date ? new Date(project.expected_delivery_date) : new Date()
  const diffTime = Math.max(0, endDate.getTime() - startDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  // Calculate total project expenses
  const totalExpenses = project?.project_expenses.reduce((acc: number, exp: any) => acc + parseFloat(exp.value as any), 0) || 0

  return (
    <div className="bg-white rounded-[24px] p-6 overflow-y-auto min-w-0 h-fit max-h-[calc(100vh-100px)] scrollbar-none flex flex-col gap-6">

      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <Button
          onClick={() => window.history.back()}
          size='lg'
          className="size-9 text-secondary bg-primary/50 transition-colors cursor-pointer"
        >
          <ChevronLeft className='size-4' />
        </Button>

        <h1 className="text-3xl font-medium tracking-tight text-secondary leading-none">
          {isLoading ? 'Carregando...' : project?.name}
        </h1>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-zinc-100 text-secondary font-medium px-2 py-1 rounded-full text-xs flex items-center gap-1.5">
            <Briefcase className="size-3.5" />
            {isLoading ? '...' : project?.client.name}
          </span>
          {!isLoading && project?.status && (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusInfo(project.status).bg}`}>
              {getStatusInfo(project.status).label}
            </span>
          )}
          {!isLoading && project?.area && (
            <span className="bg-zinc-100 text-secondary font-medium px-2 py-1 rounded-full text-xs">
              {project.area === 'DEVELOPER' ? 'Desenvolvimento' : 'Marketing'}
            </span>
          )}
        </div>
      </div>

      {/* ── Sobre o projeto + Duração ─────────────────────────────────── */}
      <div className="flex items-end justify-between gap-6">
        <div className="flex-1 flex flex-col gap-2">
          <h3 className="font-medium text-secondary text-lg">Sobre o projeto</h3>
          <p className="text-secondary leading-relaxed">
            {isLoading ? (
              <span className="block h-12 bg-zinc-100 animate-pulse rounded-xl w-full" />
            ) : (
              project?.description || 'Nenhuma descrição detalhada foi fornecida para este projeto. Adicione uma descrição para manter a equipe.'
            )}
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <div className="shrink-0 bg-primary/50 rounded-2xl px-3 py-2 flex items-center gap-2 text-secondary">
            <Clock className="size-4" />
            <div className="flex flex-col text-sm">
              <span className="font-medium">Duração atual {diffDays} dias</span>
            </div>
          </div>

          <div className="shrink-0 bg-primary/50 rounded-2xl px-3 py-2 flex items-center gap-2 text-secondary">
            <ClockArrowRotateLeft className="size-4" />
            <div className="flex flex-col text-sm">
              <span className="font-medium">Total trabalhado {totalWorkedHours}h</span>
            </div>
          </div>
        </div>
      </div>

      <hr />

      {/* ── Quadro de Tarefas + Pie Chart ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        {/* Task Board */}
        <div className="lg:col-span-2 bg-zinc-100 rounded-2xl p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-medium text-zinc-800">Quadros de tarefas</span>
            <span className="text-xs font-semibold text-primary-light bg-secondary px-2 py-1 rounded-full">
              {allTasks.filter(t => t.status === 'COMPLETED').length} de {allTasks.length} {allTasks.length !== 1 ? 'tarefas' : 'tarefa'}
            </span>
          </div>

          <hr />

          {allTasks.length > 0 ? (
            <div className="relative flex flex-col gap-1">
              {allTasks.map(task => {
                const priInfo = getPriorityInfo(task.priority)
                const stInfo = getStatusInfo(task.status)
                return (
                  <div
                    key={task.id}
                    className="flex items-center justify-between px-4 py-3 w-full min-w-0 bg-primary/50 hover:bg-primary/70 transition-colors rounded-xl cursor-pointer group"
                    onClick={() => navigate({ to: '/tarefas/$taskId', params: { taskId: task.id } })}
                  >
                    <div className="flex flex-col gap-1 min-w-0 pr-4 flex-1">
                      <span className={`font-bold text-[14px] truncate transition-colors ${task.status === 'COMPLETED' ? 'text-secondary/50 line-through' : 'text-secondary'}`}>
                        {task.title}
                      </span>
                      <div className="flex items-center gap-1 flex-wrap">
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

                    <div className="grid shrink-0 justify-items-end items-center min-h-[32px] min-w-[72px]">
                      {task.worked_hours !== undefined && (
                        <div className="col-start-1 row-start-1 flex flex-col items-end shrink-0 transition-all duration-300 group-hover:opacity-0 group-hover:-translate-x-2">
                          <span className="text-[10px] font-bold text-secondary/40 uppercase tracking-wider">Horas</span>
                          <span className="text-[14px] font-bold text-secondary">
                            {task.worked_hours}h
                          </span>
                        </div>
                      )}

                      <div className="col-start-1 row-start-1 flex items-center gap-2 transition-all duration-300 opacity-0 translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 z-10">
                        <Button
                          size="sm"
                          className={`size-8 p-0 min-w-8 rounded-full border-none flex items-center justify-center duration-300 ease-in-out transition-colors cursor-pointer ${task.status === 'COMPLETED'
                            ? 'bg-secondary/50 hover:bg-secondary text-white'
                            : 'bg-secondary hover:bg-secondary/50 text-white'
                            }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateTaskStatus({
                              id: task.id,
                              status: task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED'
                            });
                          }}
                          aria-label={task.status === 'COMPLETED' ? "Marcar como pendente" : "Marcar como concluída"}
                        >
                          <Check className="size-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="size-8 p-0 min-w-8 bg-red-900 hover:bg-red-700 text-white rounded-full border-none flex items-center justify-center transition-colors cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Deseja excluir esta tarefa?')) {
                              handleDeleteTask(task.id);
                            }
                          }}
                          aria-label="Excluir tarefa"
                        >
                          <TrashBin className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-10 gap-3">
              <Layers className="size-8 text-secondary/25" />
              <p className="text-secondary/50 text-sm font-medium text-center">O projeto ainda não possui tarefas.<br />Crie tarefas no painel principal.</p>
            </div>
          )}
        </div>

        {/* Activity Rings Chart */}
        <div className="bg-primary/50 rounded-2xl p-4 flex items-center justify-center">
          <TaskRingsChart data={pieData} size={170} />
        </div>
      </div>

      <hr />

      {/* ── Saúde Financeira ──────────────────────────────────────────── */}
      <div className='flex flex-col gap-2'>
        <h2 className="text-lg font-medium tracking-tight text-secondary leading-none">
          Saúde Financeira
        </h2>
        <p className="text-secondary">
          Controle de orçamentos, faturamentos e despesas ativas.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-primary/50 p-6 rounded-3xl flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-secondary font-semibold">Orçamento Total</span>
            <CircleDollar className="size-4 text-secondary" />
          </div>
          <span className="text-3xl font-medium text-secondary">{formatCurrency(project?.project_value)}</span>
        </div>

        <div className="bg-zinc-100 p-6 rounded-3xl flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-secondary font-semibold">Faturado</span>
            <CircleDollar className="size-4 text-secondary" />
          </div>
          <span className="text-3xl font-medium text-secondary">{formatCurrency(project?.amount_received)}</span>
        </div>

        <div className="bg-zinc-100 p-6 rounded-3xl flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-secondary font-semibold">A Receber</span>
            <CircleDollar className="size-4 text-secondary" />
          </div>
          <span className="text-3xl font-medium text-secondary">{formatCurrency(project?.amount_pending)}</span>
        </div>

        <div className="bg-zinc-100 p-6 rounded-3xl flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-secondary font-semibold">Despesas</span>
            <CircleDollar className="size-4 text-secondary" />
          </div>
          <span className="text-3xl font-medium text-secondary">{formatCurrency(totalExpenses)}</span>
        </div>
      </div>

      {/* ── Parcelas + Despesas ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">

        {/* Histórico de Parcelas */}
        <div className="bg-zinc-100 rounded-2xl p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-secondary text-sm">Histórico de parcelas</span>
            <Button
              size='sm'
              onClick={() => setIsPaymentModalOpen(true)}
              className="flex items-center gap-1.5 bg-primary/50 hover:bg-primary text-secondary font-medium text-xs rounded-full px-4 py-2 cursor-pointer border-none transition-colors"
            >
              <Plus className="size-3" />
              Cadastrar Parcela
            </Button>
          </div>

          <hr />

          {project?.payments && project.payments.length > 0 ? (
            <div className="flex flex-col gap-1">
              {project.payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between py-3 border-b border-secondary/5 last:border-0 w-full min-w-0">
                  <div className="flex flex-col gap-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-secondary text-base">{formatCurrency(payment.amount)}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${payment.status === 'PAID' ? 'bg-emerald-200 text-zinc-900' :
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
                    onClick={() => {
                      if (confirm('Deseja realmente excluir esta parcela?')) {
                        handleDeletePayment(payment.id)
                      }
                    }}
                    className="bg-transparent hover:bg-red-50 text-secondary/40 hover:text-red-500 rounded-full p-2 border-none cursor-pointer transition-colors shrink-0"
                  >
                    <TrashBin className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 flex flex-col items-center justify-center gap-2">
              <span className="text-secondary/40 text-sm font-medium">Nenhuma parcela cadastrada.</span>
            </div>
          )}
        </div>

        {/* Registro de Despesas */}
        <div className="bg-zinc-100 rounded-2xl p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-secondary text-sm">Registro de despesas</span>
            <Button
              size='sm'
              onClick={() => setIsExpenseModalOpen(true)}
              className="flex items-center gap-1.5 bg-primary/50 hover:bg-primary text-secondary font-medium text-xs rounded-full px-4 py-2 cursor-pointer border-none transition-colors"
            >
              <Plus className="size-3" />
              Lançar Gasto
            </Button>
          </div>

          <hr />

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
                        onClick={() => {
                          if (confirm('Deseja excluir este lançamento?')) {
                            handleDeleteExpense(expense.id)
                          }
                        }}
                        className="bg-transparent hover:bg-red-50 text-secondary/40 hover:text-red-500 rounded-full p-2 border-none cursor-pointer transition-colors shrink-0"
                      >
                        <TrashBin className="size-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-10 flex flex-col items-center justify-center gap-2">
              <span className="text-secondary/40 text-sm font-medium">Nenhum gasto registrado.</span>
            </div>
          )}
        </div>
      </div>

      <hr />

      {/* ── Cliente ───────────────────────────────────────────────────── */}
      <div className="">
        <h3 className="font-medium text-secondary text-lg mb-4">Cliente</h3>

        {isLoading ? (
          <div className="h-16 bg-zinc-100 animate-pulse rounded-2xl w-full" />
        ) : project?.client ? (
          <div className="flex flex-col w-full gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="size-12 shrink-0">
                <Avatar.Image
                  alt={project.client.name}
                  src={`https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/${project.client.name.length % 2 === 0 ? 'orange' : 'blue'}.jpg`}
                />
                <Avatar.Fallback>{project.client.name.charAt(0).toUpperCase()}</Avatar.Fallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-secondary text-xl">{project.client.name}</span>
                <span className="text-zinc-600 text-base">{project.client.email || 'Sem email cadastrado'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => window.location.href = `mailto:${project.client.email}`}
                isDisabled={!project.client.email}
                size='lg'
                className="flex items-center text-base h-10 gap-2 bg-primary/50 hover:bg-primary text-secondary font-medium"
              >
                <EnvelopeOpen className="size-4" />
                Enviar e-mail
              </Button>

              <Button
                onClick={() => window.open(`https://wa.me/`, '_blank')}
                size='lg'
                className="flex items-center text-base h-10 gap-2 bg-primary/50 hover:bg-primary text-secondary font-medium"
              >
                <CommentDot className="size-4" />
                WhatsApp
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-secondary/60 text-sm">Cliente não vinculado.</p>
        )}
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
