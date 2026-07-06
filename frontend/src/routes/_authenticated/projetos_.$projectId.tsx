import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useMemo, useEffect } from 'react'
import { Avatar } from '@heroui/react'
import { Layers, Briefcase, TrashBin, Clock, CommentDot, Plus, CircleDollar, ChevronLeft, ClockArrowRotateLeft, EnvelopeOpen, Check, Pencil, Xmark } from '@gravity-ui/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchProjectDetails,
  createPayment,
  deletePayment,
  createProjectExpense,
  deleteProjectExpense,
  updateTaskStatus,
  updateProject,
  deleteTask
} from '../../services/api'
import { AddPaymentModal } from '../../components/finance/AddPaymentModal'
import { AddExpenseModal } from '../../components/finance/AddExpenseModal'
import { Select, SelectItem } from '../../components/ui/Select'
import { Button } from '#/components/ui/Button'

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
              <span className="text-xs text-zinc-600 font-medium">{d.label}</span>
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
                stroke="#A9A9A9"
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const [editDescription, setEditDescription] = useState('')

  const [isEditingDates, setIsEditingDates] = useState(false)
  const [editStartDate, setEditStartDate] = useState('')
  const [editDeliveryDate, setEditDeliveryDate] = useState('')

  const [editName, setEditName] = useState('')

  const queryClient = useQueryClient()

  const { data: project, isLoading } = useQuery({
    queryKey: ['projectDetails', projectId],
    queryFn: () => fetchProjectDetails(projectId),
    enabled: !!projectId
  })

  useEffect(() => {
    if (project) {
      if (project.name) setEditName(project.name)
      if (project.description !== undefined) setEditDescription(project.description || '')
    }
  }, [project])

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
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['projectDetails', projectId] })
      const previousProject = queryClient.getQueryData(['projectDetails', projectId])

      queryClient.setQueryData(['projectDetails', projectId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          tasks: old.tasks?.map((task: any) =>
            task.id === id ? { ...task, status } : task
          )
        }
      })

      return { previousProject }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousProject) {
        queryClient.setQueryData(['projectDetails', projectId], context.previousProject)
      }
    },
    onSettled: () => {
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

  const { mutate: handleUpdateProject, isPending: isUpdatingProject } = useMutation({
    mutationFn: (data: any) => updateProject(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectDetails', projectId] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['calendar-items'] })
      setIsEditModalOpen(false)
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
        return { label: 'Planejamento', bg: 'bg-blue-200 border border-blue-400 text-zinc-900' }
      case 'IN_PROGRESS':
        return { label: 'Em Andamento', bg: 'bg-amber-200 border border-amber-400 text-zinc-900' }
      case 'WAITING_CLIENT':
        return { label: 'Aguardando Cliente', bg: 'bg-purple-200 border border-purple-400 text-zinc-900' }
      case 'REVIEW':
        return { label: 'Revisão', bg: 'bg-indigo-200 border border-indigo-400 text-zinc-900' }
      case 'COMPLETED':
        return { label: 'Concluído', bg: 'bg-emerald-200 border border-emerald-400 text-zinc-900' }
      case 'CANCELED':
        return { label: 'Cancelado', bg: 'bg-rose-200 border border-rose-400 text-zinc-900' }
      default:
        return { label: status, bg: 'bg-zinc-200 border border-zinc-400 text-zinc-900' }
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
      { label: 'To do', value: counts.PENDING, color: '#89898B' },
      { label: 'Fazendo', value: counts.IN_PROGRESS, color: '#fde68a' },
      { label: 'Revisão', value: counts.REVIEW, color: '#bfdbfe' },
      { label: 'Feito', value: counts.COMPLETED, color: '#BAF08A ' },
      { label: 'Cancelado', value: counts.CANCELED, color: '#fecdd3' },
    ]
  }, [project?.tasks])

  // Calculate duration stats
  const totalWorkedHours = project?.tasks.reduce((acc: number, t: any) => acc + (t.worked_hours || 0), 0) || 0

  const startDate = new Date(project?.start_date || project?.created_at || Date.now())
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
          variant='onlyIcon'
        >
          <ChevronLeft className='size-4' />
        </Button>

        <div className="flex-1 min-w-0">
          {isLoading ? (
            <h1 className="text-3xl font-medium tracking-tight text-secondary leading-none">Carregando...</h1>
          ) : (
            <div className="inline-grid items-center -ml-3 max-w-full">
              <span className="col-start-1 row-start-1 invisible whitespace-pre overflow-hidden text-3xl font-bold tracking-tight px-3">
                {editName || 'Nome do projeto'}
              </span>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={() => {
                  if (editName.trim() && editName.trim() !== project?.name) {
                    handleUpdateProject({ name: editName.trim() })
                  } else {
                    setEditName(project?.name || '')
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') e.currentTarget.blur()
                }}
                className="col-start-1 row-start-1 w-full text-3xl font-bold tracking-tight text-secondary leading-normal bg-transparent border border-transparent hover:border-zinc-200 outline-none placeholder:text-secondary/50 focus:bg-zinc-50 focus:border-zinc-300 px-3 rounded-lg transition-all"
                placeholder="Nome do projeto"
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-zinc-100 border border-zinc-200 text-secondary font-medium px-2 py-1 rounded-full text-xs flex items-center gap-1.5">
            <Briefcase className="size-3.5" />
            {isLoading ? '...' : project?.client.name}
          </span>
          {!isLoading && project?.status && (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusInfo(project.status).bg}`}>
              {getStatusInfo(project.status).label}
            </span>
          )}
          {!isLoading && project?.area && (
            <span className="flex gap-1 bg-zinc-100 border border-zinc-200 text-secondary font-medium px-2 py-1 rounded-full text-xs">
              {project.area === 'DEVELOPER' ? 'Desenvolvimento' : 'Marketing'}
              <button
                onClick={() => setIsEditModalOpen(true)}
                className=" flex items-center justify-center rounded-xl hover:bg-zinc-100 transition-colors cursor-pointer bg-transparent border-none text-secondary/50 hover:text-secondary"
                title="Editar categoria (área) do projeto"
              >
                <Pencil className="size-3" />
              </button>
            </span>
          )}
        </div>


      </div>

      {/* ── Sobre o projeto + Duração ─────────────────────────────────── */}
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-secondary text-lg">Sobre o projeto</h3>
          </div>

          <div className="mt-1">
            {isLoading ? (
              <span className="block h-12 bg-zinc-100 animate-pulse rounded-xl w-full" />
            ) : (
              <textarea
                value={editDescription}
                onChange={e => setEditDescription(e.target.value)}
                onBlur={() => {
                  const trimmed = editDescription.trim()
                  if (trimmed !== (project?.description || '')) {
                    handleUpdateProject({ description: trimmed })
                  }
                }}
                className="w-full bg-transparent border border-transparent hover:border-zinc-200 rounded-xl px-0 py-1 text-secondary text-sm leading-relaxed outline-none focus:bg-zinc-50 focus:border-zinc-300 focus:px-3 focus:py-2 transition-all resize-none"
                rows={Math.max(3, editDescription.split('\n').length)}
                placeholder="Nenhuma descrição detalhada foi fornecida para este projeto. Adicione uma descrição para manter a equipe informada."
              />
            )}
          </div>
        </div>

        <div className='flex flex-col items-end gap-2 mt-2'>
          <div className="shrink-0 bg-primary/50 border border-primary rounded-2xl px-3 py-2 flex flex-col gap-2 text-secondary relative group">
            <div className="flex items-center gap-2">
              <Clock className="size-4 mt-0.5" />
              {isEditingDates ? (
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">Início:</span>
                    <input type="date" value={editStartDate} onChange={e => setEditStartDate(e.target.value)} className="bg-white/50 border-none rounded px-2 py-0.5 text-xs outline-none" />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">Entrega:</span>
                    <input type="date" value={editDeliveryDate} onChange={e => setEditDeliveryDate(e.target.value)} className="bg-white/50 border-none rounded px-2 py-0.5 text-xs outline-none" />
                  </div>
                  <div className="flex gap-1 mt-1 justify-end">
                    <button onClick={() => setIsEditingDates(false)} className="px-2 py-1 rounded text-[10px] font-semibold bg-zinc-100/50 hover:bg-zinc-100 text-secondary border-none cursor-pointer transition-colors">Cancelar</button>
                    <button onClick={() => {
                      handleUpdateProject({
                        start_date: editStartDate || null,
                        expected_delivery_date: editDeliveryDate || null
                      })
                      setIsEditingDates(false)
                    }} disabled={isUpdatingProject} className="px-2 py-1 rounded text-[10px] font-semibold bg-white text-secondary border-none cursor-pointer hover:bg-zinc-50 transition-colors">Salvar</button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col text-sm pr-4">
                  <span className="font-medium">Início: {formatDate(project?.start_date || project?.created_at || '')}</span>
                  <span className="font-medium">Entrega: {project?.expected_delivery_date ? formatDate(project?.expected_delivery_date) : 'Sem prazo'}</span>
                  <button onClick={() => {
                    setEditStartDate(project?.start_date ? project.start_date.split('T')[0] : (project?.created_at ? project.created_at.split('T')[0] : ''))
                    setEditDeliveryDate(project?.expected_delivery_date ? project.expected_delivery_date.split('T')[0] : '')
                    setIsEditingDates(true)
                  }} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-secondary/50 hover:text-secondary bg-transparent border-none cursor-pointer p-0.5">
                    <Pencil className="size-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="shrink-0 bg-primary/50 border border-primary rounded-2xl px-3 py-2 flex items-center gap-2 text-secondary">
            <ClockArrowRotateLeft className="size-4" />
            <div className="flex flex-col text-sm">
              <span className="font-medium">Duração: {diffDays} dias</span>
              <span className="font-medium">Trabalhado: {totalWorkedHours}h</span>
            </div>
          </div>
        </div>
      </div>

      <hr />

      {/* ── Quadro de Tarefas + Pie Chart ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        {/* Task Board */}
        <div className="lg:col-span-2 bg-zinc-100 border border-zinc-200 rounded-2xl p-4 flex flex-col gap-2">
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
                    className="flex items-center justify-between px-4 py-3 w-full min-w-0 bg-primary/50 border border-primary hover:bg-primary/70 transition-colors rounded-xl cursor-pointer group"
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
        <div className="bg-zinc-100 border border-zinc-200 rounded-2xl p-4 flex items-center justify-center">
          <TaskRingsChart data={pieData} size={250} />
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
        <div className="bg-primary/50 border border-primary p-6 rounded-3xl flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-secondary font-semibold">Orçamento Total</span>
            <CircleDollar className="size-4 text-secondary" />
          </div>
          <span className="text-3xl font-medium text-secondary">{formatCurrency(project?.project_value)}</span>
        </div>

        <div className="bg-zinc-100 border border-zinc-200 p-6 rounded-3xl flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-secondary font-semibold">Faturado</span>
            <CircleDollar className="size-4 text-secondary" />
          </div>
          <span className="text-3xl font-medium text-secondary">{formatCurrency(project?.amount_received)}</span>
        </div>

        <div className="bg-zinc-100 border border-zinc-200 p-6 rounded-3xl flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-secondary font-semibold">A Receber</span>
            <CircleDollar className="size-4 text-secondary" />
          </div>
          <span className="text-3xl font-medium text-secondary">{formatCurrency(project?.amount_pending)}</span>
        </div>

        <div className="bg-zinc-100 border border-zinc-200 p-6 rounded-3xl flex flex-col gap-4">
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
        <div className="bg-zinc-100 border border-zinc-200 rounded-2xl p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-zinc-800 text-sm">Histórico de parcelas</span>
            <Button
              size='sm'
              onClick={() => setIsPaymentModalOpen(true)}
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
        <div className="bg-zinc-100 border border-zinc-200 rounded-2xl p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-zinc-800 text-sm">Registro de despesas</span>
            <Button
              size='sm'
              onClick={() => setIsExpenseModalOpen(true)}
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
      <div className="flex flex-col gap-2">
        <h3 className="font-medium text-secondary text-lg">Cliente</h3>

        {isLoading ? (
          <div className="h-16 bg-zinc-100 animate-pulse rounded-2xl w-full" />
        ) : project?.client ? (
          <div className="flex flex-col w-full gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="size-12 shrink-0">
                <Avatar.Image
                  alt={project.client.name}
                  src={`https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/${project.client.name.length % 2 === 0 ? 'orange' : 'blue'}.jpg`}
                />
                <Avatar.Fallback>{project.client.name.charAt(0).toUpperCase()}</Avatar.Fallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-secondary text-lg">{project.client.name}</span>
                <span className="text-zinc-600 text-sm">{project.client.email || 'Sem email cadastrado'}</span>
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

      {project && (
        <EditProjectModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={(data) => handleUpdateProject(data)}
          project={project}
          isPending={isUpdatingProject}
        />
      )}
    </div>
  )
}

// ─── Edit Project Modal ─────────────────────────────────────────────────────

interface EditProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  project: any
  isPending?: boolean
}

const labelClass = "text-secondary/60 text-xs font-bold uppercase tracking-wider"

function EditProjectModal({ isOpen, onClose, onSubmit, project, isPending = false }: EditProjectModalProps) {
  const [area, setArea] = useState(project.area || 'DEVELOPER')

  useEffect(() => {
    if (isOpen && project) {
      setArea(project.area || 'DEVELOPER')
    }
  }, [isOpen, project])

  if (!isOpen) return null

  const handleSubmit = () => {
    const data: any = {
      area,
    }
    onSubmit(data)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100]"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div className="fixed right-0 top-0 h-full w-[400px] max-w-[100vw] bg-white z-[101] flex flex-col shadow-2xl animate-slide-in-right overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-lg font-bold text-secondary">Editar Projeto</h2>
          <button
            onClick={onClose}
            className="size-8 flex items-center justify-center rounded-xl hover:bg-zinc-100 transition-colors cursor-pointer bg-transparent border-none"
          >
            <Xmark className="size-4 text-secondary/60" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-5 scrollbar-none">
          {/* Categoria / Área */}
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Categoria</label>
            <Select
              selectedKey={area}
              onSelectionChange={(key) => setArea(key as string)}
              ariaLabel="Selecionar categoria"
              variant="outline"
              triggerClassName="w-full rounded-full"
            >
              <SelectItem id="DEVELOPER" textValue="Desenvolvimento">
                Desenvolvimento
              </SelectItem>
              <SelectItem id="MARKETING" textValue="Marketing">
                Marketing
              </SelectItem>
            </Select>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-100 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-secondary bg-zinc-100 hover:bg-zinc-200 transition-colors cursor-pointer border-none"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-secondary bg-primary/50 hover:bg-primary transition-colors cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </div>
    </>
  )
}

