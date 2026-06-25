import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Checkbox, ProgressBar, Select, ListBox } from '@heroui/react'
import { ArrowLeft, Clock, Briefcase, Calendar, TrashBin, FloppyDisk } from '@gravity-ui/icons'
import { fetchTaskDetails, updateTask, deleteTask } from '../../services/api'
import type { Task } from '../../services/api'

export const Route = createFileRoute('/_authenticated/tarefas_/$taskId')({
  component: TaskDetailsPage
})

const TASK_STATUSES: { key: Task['status']; label: string; bg: string; text: string }[] = [
  { key: 'PENDING', label: 'A Fazer', bg: 'bg-zinc-100', text: 'text-secondary/60' },
  { key: 'IN_PROGRESS', label: 'Fazendo', bg: 'bg-amber-100', text: 'text-amber-750' },
  { key: 'REVIEW', label: 'Revisão', bg: 'bg-blue-100', text: 'text-blue-700' },
  { key: 'COMPLETED', label: 'Concluído', bg: 'bg-emerald-100', text: 'text-emerald-700' },
  { key: 'CANCELED', label: 'Cancelado', bg: 'bg-red-100', text: 'text-red-700' },
]

const PRIORITIES: { key: Task['priority']; label: string; bg: string; text: string }[] = [
  { key: 'LOW', label: 'Baixa', bg: 'bg-zinc-100', text: 'text-secondary/60' },
  { key: 'MEDIUM', label: 'Normal', bg: 'bg-blue-50', text: 'text-blue-600' },
  { key: 'HIGH', label: 'Alta', bg: 'bg-amber-50', text: 'text-amber-700' },
  { key: 'URGENT', label: 'Urgente', bg: 'bg-red-50', text: 'text-red-650' },
]

function TaskDetailsPage() {
  const { taskId } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Task details fetch
  const { data: task, isLoading, error } = useQuery({
    queryKey: ['taskDetails', taskId],
    queryFn: () => fetchTaskDetails(taskId),
    enabled: !!taskId
  })

  // Edit fields
  const [description, setDescription] = useState('')
  const [isEditingDesc, setIsEditingDesc] = useState(false)

  // Sync description state on load
  useEffect(() => {
    if (task) {
      setDescription(task.description || '')
    }
  }, [task])

  // Mutations
  const updateMutation = useMutation({
    mutationFn: (data: any) => updateTask(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskDetails', taskId] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      if (task?.project?.id) {
        queryClient.invalidateQueries({ queryKey: ['projectDetails', task.project.id] })
      }
    }
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      navigate({ to: '/tarefas' })
    }
  })

  if (isLoading) {
    return (
      <div className="bg-white rounded-[24px] p-6 h-[calc(100vh-100px)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin size-8 border-4 border-primary border-t-transparent rounded-full" />
          <span className="text-secondary/60 text-sm font-medium">Carregando detalhes da tarefa...</span>
        </div>
      </div>
    )
  }

  if (error || !task) {
    return (
      <div className="bg-white rounded-[24px] p-6 h-[calc(100vh-100px)] flex flex-col items-center justify-center gap-4">
        <span className="text-red-500 font-bold">Erro ao carregar tarefa ou tarefa não encontrada.</span>
        <Button className="bg-zinc-100 text-secondary" onPress={() => navigate({ to: '/tarefas' })}>
          Voltar para Tarefas
        </Button>
      </div>
    )
  }

  const taskCode = `#${task.id.substring(0, 6)}`
  const dateFormatted = task.due_date
    ? new Date(task.due_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
    : 'Sem data'

  const currentStatusInfo = TASK_STATUSES.find(s => s.key === task.status) || TASK_STATUSES[0]

  // Handle status update directly
  const handleStatusChange = (newStatus: any) => {
    updateMutation.mutate({ status: newStatus })
  }

  // Handle priority update directly
  const handlePriorityChange = (newPriority: any) => {
    updateMutation.mutate({ priority: newPriority })
  }

  // Handle subtask toggle
  const handleToggleSubtask = (subtaskIndex: number) => {
    if (!task.subtasks) return
    const updatedSubtasks = task.subtasks.map((sub: any, idx: number) => 
      idx === subtaskIndex ? { text: sub.text, completed: !sub.completed } : { text: sub.text, completed: sub.completed }
    )
    updateMutation.mutate({ subtasks: updatedSubtasks })
  }

  // Handle description save
  const handleSaveDescription = () => {
    updateMutation.mutate({ description: description.trim() })
    setIsEditingDesc(false)
  }

  const completedSubtasks = task.subtasks?.filter((s: any) => s.completed).length || 0
  const totalSubtasks = task.subtasks?.length || 0
  const subtasksPercent = totalSubtasks === 0 ? 0 : Math.round((completedSubtasks / totalSubtasks) * 100)

  return (
    <div className="bg-white rounded-[24px] p-6 overflow-y-auto min-w-0 h-fit max-h-[calc(100vh-100px)] scrollbar-none flex flex-col gap-6">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-4 shrink-0 flex-wrap">
        <div className="flex items-center gap-4">
          <Button
            isIconOnly
            variant="ghost"
            onPress={() => window.history.back()}
            className="text-secondary hover:bg-zinc-100 rounded-full"
          >
            <ArrowLeft width={20} height={20} />
          </Button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2.5">
              <span className="text-xs text-zinc-400 font-bold tracking-wider">{taskCode}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${currentStatusInfo.bg} ${currentStatusInfo.text}`}>
                {currentStatusInfo.label}
              </span>
            </div>
            <h1 className="text-3xl font-medium tracking-tight text-secondary leading-normal">
              {task.title}
            </h1>
          </div>
        </div>

        <Button
          isIconOnly
          variant="ghost"
          className="rounded-full hover:bg-red-50 text-red-500 hover:text-red-600 border-none cursor-pointer"
          onPress={() => {
            if (confirm('Tem certeza de que deseja excluir esta tarefa?')) {
              deleteMutation.mutate()
            }
          }}
        >
          <TrashBin className="size-5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left main content columns */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Description Section */}
          <div className="bg-zinc-50 rounded-[16px] p-6 border border-zinc-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-secondary text-base">Descrição da Tarefa</h3>
              {!isEditingDesc ? (
                <button
                  onClick={() => setIsEditingDesc(true)}
                  className="text-xs font-semibold text-primary-dark hover:underline bg-transparent border-none cursor-pointer"
                >
                  Editar descrição
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveDescription}
                    className="text-xs font-bold text-emerald-600 hover:underline bg-transparent border-none cursor-pointer flex items-center gap-1"
                  >
                    <FloppyDisk className="size-3" />
                    Salvar
                  </button>
                  <button
                    onClick={() => {
                      setDescription(task.description || '')
                      setIsEditingDesc(false)
                    }}
                    className="text-xs font-semibold text-zinc-400 hover:underline bg-transparent border-none cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>

            {isEditingDesc ? (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Insira a descrição da tarefa..."
                rows={4}
                className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-secondary text-sm outline-none resize-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            ) : (
              <p className="text-secondary/80 text-sm whitespace-pre-wrap leading-relaxed">
                {task.description || 'Sem descrição fornecida para esta tarefa.'}
              </p>
            )}
          </div>

          {/* Subtasks Progress */}
          {totalSubtasks > 0 && (
            <div className="bg-zinc-50 rounded-[16px] p-6 border border-zinc-100 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-secondary font-bold text-base">Progresso das Subtasks</span>
                <span className="text-secondary font-bold text-sm">{completedSubtasks} de {totalSubtasks} ({subtasksPercent}%)</span>
              </div>
              <ProgressBar
                value={subtasksPercent}
                color="success"
                className="w-full"
              />
            </div>
          )}

          {/* Subtasks Checklist */}
          <div className="bg-zinc-50 rounded-[16px] p-6 border border-zinc-100 flex flex-col gap-4">
            <h3 className="font-semibold text-secondary text-base">Checklist de Subtasks</h3>
            {task.subtasks && task.subtasks.length > 0 ? (
              <div className="flex flex-col gap-3">
                {task.subtasks.map((sub: any, idx: number) => (
                  <div key={sub.id} className="bg-white rounded-xl p-4 border border-zinc-100 flex items-center gap-3 shadow-xs">
                    <Checkbox
                      isSelected={sub.completed}
                      onChange={() => handleToggleSubtask(idx)}
                      aria-label={sub.text}
                    >
                      <Checkbox.Content>
                        <Checkbox.Control className={`subtask-checkbox-control ${sub.completed ? 'is-completed' : ''}`}>
                          <Checkbox.Indicator className="subtask-checkbox-indicator" />
                        </Checkbox.Control>
                      </Checkbox.Content>
                    </Checkbox>
                    <span className={`text-sm ${sub.completed ? 'text-zinc-400 line-through' : 'text-secondary font-medium'}`}>
                      {sub.text}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-secondary/50 text-sm italic">Nenhuma subtask cadastrada para esta tarefa.</p>
            )}
          </div>
        </div>

        {/* Sidebar Info Panel */}
        <div className="flex flex-col gap-4">
          
          {/* Attributes Grid */}
          <div className="bg-zinc-50 rounded-[16px] p-6 border border-zinc-100 flex flex-col gap-4">
            <h3 className="font-bold text-secondary text-base border-b border-zinc-200 pb-2">Detalhes</h3>
            
            {/* Status Option */}
            <div className="flex flex-col gap-1.5">
              <span className="text-secondary/50 text-xs font-bold uppercase tracking-wider">Status</span>
              <Select
                aria-label="Alterar Status"
                selectedKey={task.status}
                onSelectionChange={(key) => handleStatusChange(key as string)}
                className="w-full"
              >
                <Select.Trigger className="bg-white border border-zinc-200 rounded-xl px-3 py-1.5 text-secondary text-sm font-semibold w-full flex items-center justify-between shadow-xs">
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover className="bg-white border border-zinc-200 rounded-xl shadow-lg z-[120]">
                  <ListBox className="p-1">
                    {TASK_STATUSES.map((status) => (
                      <ListBox.Item key={status.key} id={status.key} textValue={status.label} className="px-3 py-1.5 text-sm rounded-lg hover:bg-zinc-100 cursor-pointer text-secondary">
                        {status.label}
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>

            {/* Priority Option */}
            <div className="flex flex-col gap-1.5">
              <span className="text-secondary/50 text-xs font-bold uppercase tracking-wider">Prioridade</span>
              <Select
                aria-label="Alterar Prioridade"
                selectedKey={task.priority}
                onSelectionChange={(key) => handlePriorityChange(key as string)}
                className="w-full"
              >
                <Select.Trigger className="bg-white border border-zinc-200 rounded-xl px-3 py-1.5 text-secondary text-sm font-semibold w-full flex items-center justify-between shadow-xs">
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover className="bg-white border border-zinc-200 rounded-xl shadow-lg z-[120]">
                  <ListBox className="p-1">
                    {PRIORITIES.map((priority) => (
                      <ListBox.Item key={priority.key} id={priority.key} textValue={priority.label} className="px-3 py-1.5 text-sm rounded-lg hover:bg-zinc-100 cursor-pointer text-secondary">
                        {priority.label}
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>

            {/* Project */}
            {task.project && (
              <div className="flex flex-col gap-1">
                <span className="text-secondary/50 text-xs font-bold uppercase tracking-wider">Projeto Relacionado</span>
                <button
                  onClick={() => navigate({ to: '/projetos/$projectId', params: { projectId: task.project.id } })}
                  className="w-full text-left bg-white border border-zinc-200 rounded-xl px-3.5 py-3 hover:border-zinc-350 transition-colors shadow-xs flex items-center gap-2 cursor-pointer text-secondary/80 hover:text-secondary"
                >
                  <Briefcase className="size-4 text-primary-dark" />
                  <span className="text-sm font-bold truncate">{task.project.name}</span>
                </button>
              </div>
            )}

            {/* Due date */}
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                <Calendar className="size-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-secondary/50 text-[10px] font-bold uppercase tracking-wider">Prazo de Entrega</span>
                <span className="text-sm font-bold text-secondary truncate">{dateFormatted}</span>
              </div>
            </div>

            {/* Estimated vs Worked hours */}
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <Clock className="size-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-secondary/50 text-[10px] font-bold uppercase tracking-wider">Horas Estimadas / Gastas</span>
                <span className="text-sm font-bold text-secondary truncate">
                  {task.estimated_hours || 0}h estimadas / {task.worked_hours || 0}h gastas
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
