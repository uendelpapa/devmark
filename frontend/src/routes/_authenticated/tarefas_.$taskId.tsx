import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Checkbox, ProgressBar, Select, ListBox, DatePicker, DateField, TimeField, Calendar, Label } from '@heroui/react'
import type { TimeValue } from '@heroui/react'
import { Clock, Briefcase, Calendar as CalendarIcon, TrashBin, ChevronLeft } from '@gravity-ui/icons'
import { fetchTaskDetails, updateTask, deleteTask, fetchTasks, fetchProjects } from '../../services/api'
import type { Task, TaskCardData } from '../../services/api'
import { toast } from '../../components/ui/Toast'
import { useTimer } from '../../components/ui/TimerTracker'
import { getLocalTimeZone, parseAbsoluteToLocal } from '@internationalized/date'
import type { DateValue } from '@internationalized/date'
import { Button } from '#/components/ui/Button'

export const Route = createFileRoute('/_authenticated/tarefas_/$taskId')({
  component: TaskDetailsPage
})

const TASK_STATUSES: { key: Task['status']; label: string; bg: string; text: string }[] = [
  { key: 'PENDING', label: 'A Fazer', bg: 'bg-zinc-200', text: 'text-secondary' },
  { key: 'IN_PROGRESS', label: 'Fazendo', bg: 'bg-primary/50', text: 'text-secondary' },
  { key: 'REVIEW', label: 'Revisão', bg: 'bg-zinc-200', text: 'text-secondary' },
  { key: 'COMPLETED', label: 'Concluído', bg: 'bg-primary', text: 'text-secondary' },
  { key: 'CANCELED', label: 'Cancelado', bg: 'bg-zinc-200', text: 'text-secondary/50' },
]

const PRIORITIES: { key: Task['priority']; label: string; bg: string; text: string }[] = [
  { key: 'LOW', label: 'Baixa', bg: 'bg-zinc-200', text: 'text-secondary' },
  { key: 'MEDIUM', label: 'Normal', bg: 'bg-zinc-200', text: 'text-secondary' },
  { key: 'HIGH', label: 'Alta', bg: 'bg-primary/50', text: 'text-secondary' },
  { key: 'URGENT', label: 'Urgente', bg: 'bg-primary', text: 'text-secondary' },
]

function TaskDetailsPage() {
  const { taskId } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { startTimer, pauseTimer, activeTaskId, setActiveTaskId } = useTimer()

  // Queries
  const { data: task, isLoading, error } = useQuery({
    queryKey: ['taskDetails', taskId],
    queryFn: () => fetchTaskDetails(taskId),
    enabled: !!taskId
  })

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects
  })

  const { data: allTasks = [] } = useQuery<any[]>({
    queryKey: ['tasks'],
    queryFn: fetchTasks
  })

  // States
  const [description, setDescription] = useState('')
  const [subtaskInput, setSubtaskInput] = useState('')

  const [title, setTitle] = useState('')
  const [projectId, setProjectId] = useState('')
  const [estimatedHours, setEstimatedHours] = useState<number>(0)
  const [dueDate, setDueDate] = useState<DateValue | null>(null)
  const [tags, setTags] = useState<string[]>([])

  const [isProjectOpen, setIsProjectOpen] = useState(false)
  const [isTagSuggestionsOpen, setIsTagSuggestionsOpen] = useState(false)
  const [tagInput, setTagInput] = useState('')

  const projectRef = useRef<HTMLDivElement>(null)
  const tagsRef = useRef<HTMLDivElement>(null)

  // Sync state on load
  useEffect(() => {
    if (task) {
      setDescription(task.description || '')
      setTitle(task.title || '')
      setProjectId(task.project_id || '')
      setEstimatedHours(task.estimated_hours || 0)
      setTags(task.tags || [])

      if (task.due_date) {
        setDueDate(parseAbsoluteToLocal(task.due_date))
      } else {
        setDueDate(null)
      }
    }
  }, [task])

  // Click outside to close popovers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (projectRef.current && !projectRef.current.contains(event.target as Node)) {
        setIsProjectOpen(false)
      }
      if (tagsRef.current && !tagsRef.current.contains(event.target as Node)) {
        setIsTagSuggestionsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Tags auto-complete logic
  const allExistingTags = Array.from(
    new Set(
      allTasks
        .flatMap((t) => t.tags || [])
        .filter((tag) => tag && tag.trim() !== '')
    )
  )

  const filteredSuggestions = allExistingTags.filter(
    (tag) => !tags.includes(tag) && tag.toLowerCase().includes(tagInput.trim().toLowerCase())
  )

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

  const handleUpdateField = (field: string, value: any) => {
    updateMutation.mutate({ [field]: value })
  }

  // --- Handlers ---
  const handleTitleBlur = () => {
    if (title.trim() && title.trim() !== task?.title) {
      handleUpdateField('title', title.trim())
    }
  }

  const handleSelectProject = (id: string) => {
    setProjectId(id)
    setIsProjectOpen(false)
    handleUpdateField('project_id', id)
  }

  const handleDateChange = (date: DateValue | null) => {
    setDueDate(date)
    handleUpdateField('due_date', date ? date.toDate(getLocalTimeZone()).toISOString() : null)
  }

  const handleHoursBlur = () => {
    if (estimatedHours !== task?.estimated_hours) {
      handleUpdateField('estimated_hours', estimatedHours)
    }
  }

  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase()
    if (trimmed && !tags.includes(trimmed)) {
      const newTags = [...tags, trimmed]
      setTags(newTags)
      setTagInput('')
      handleUpdateField('tags', newTags)
    }
  }

  const handleRemoveTag = (tag: string) => {
    const newTags = tags.filter(t => t !== tag)
    setTags(newTags)
    handleUpdateField('tags', newTags)
  }

  const handleStatusChange = async (newStatus: any) => {
    if (newStatus === 'IN_PROGRESS') {
      try {
        const tasksList = await queryClient.fetchQuery<TaskCardData[]>({
          queryKey: ['tasks'],
          queryFn: fetchTasks
        })
        const inProgress = tasksList.find(t => t.status === 'IN_PROGRESS')
        if (inProgress && inProgress.id !== taskId) {
          toast.warning('Você já tem uma tarefa em andamento. Conclua ou pause ela antes de iniciar outra.')
          return
        }
      } catch (err) {
        console.error('Failed to validate in-progress tasks:', err)
      }
    }

    handleUpdateField('status', newStatus)

    if (newStatus === 'IN_PROGRESS') {
      setActiveTaskId(taskId)
      startTimer(taskId)
    } else if (activeTaskId === taskId) {
      pauseTimer()
    }
  }

  const handlePriorityChange = (newPriority: any) => {
    handleUpdateField('priority', newPriority)
  }

  const handleToggleSubtask = (subtaskIndex: number) => {
    if (!task.subtasks) return
    const updatedSubtasks = task.subtasks.map((sub: any, idx: number) =>
      idx === subtaskIndex ? { text: sub.text, completed: !sub.completed } : { text: sub.text, completed: sub.completed }
    )
    handleUpdateField('subtasks', updatedSubtasks)
  }

  const handleAddSubtask = () => {
    const trimmed = subtaskInput.trim()
    if (!trimmed) return
    const updatedSubtasks = [...(task.subtasks || []), { text: trimmed, completed: false }]
    handleUpdateField('subtasks', updatedSubtasks)
    setSubtaskInput('')
  }

  const handleRemoveSubtask = (subtaskIndex: number) => {
    if (!task.subtasks) return
    const updatedSubtasks = task.subtasks.filter((_: any, idx: number) => idx !== subtaskIndex)
    handleUpdateField('subtasks', updatedSubtasks)
  }

  // Render Checks
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
  const currentStatusInfo = TASK_STATUSES.find(s => s.key === task.status) || TASK_STATUSES[0]

  const completedSubtasks = task.subtasks?.filter((s: any) => s.completed).length || 0
  const totalSubtasks = task.subtasks?.length || 0
  const subtasksPercent = totalSubtasks === 0 ? 0 : Math.round((completedSubtasks / totalSubtasks) * 100)

  return (
    <div className="bg-white rounded-[24px] p-6 overflow-y-auto min-w-0 h-fit max-h-[calc(100vh-100px)] scrollbar-none flex flex-col gap-6">

      {/* Header Bar */}
      <div className="flex items-center justify-between gap-4 shrink-0 flex-wrap">
        <div className="flex items-center gap-6 flex-1">
          <Button
            onClick={() => window.history.back()}
            size='lg'
            variant='onlyIcon'
          >
            <ChevronLeft className='size-5' />
          </Button>

          <div className="flex flex-col gap-1 w-full max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs text-secondary/50 font-semibold">{taskCode}</span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${currentStatusInfo.bg} ${currentStatusInfo.text}`}>
                {currentStatusInfo.label}
              </span>
            </div>
            <div className="inline-grid items-center -ml-3 max-w-full">
              <span className="col-start-1 row-start-1 invisible whitespace-pre overflow-hidden text-2xl font-bold tracking-tight px-3">
                {title || 'Título da tarefa'}
              </span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleBlur}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.currentTarget.blur()
                  }
                }}
                className="col-start-1 row-start-1 w-full text-2xl font-bold tracking-tight text-secondary leading-normal bg-transparent border border-transparent hover:border-zinc-200 outline-none placeholder:text-secondary/30 focus:bg-zinc-50 focus:border-zinc-300 px-3 rounded-lg transition-all"
                placeholder="Título da tarefa"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant='zinc'
            className="size-10"
            onPress={() => {
              if (confirm('Tem certeza de que deseja excluir esta tarefa?')) {
                deleteMutation.mutate()
              }
            }}
          >
            <TrashBin className="size-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left main content columns */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Description Section */}
          <div className="bg-zinc-100 border border-zinc-200 rounded-[20px] p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-secondary text-base">Descrição da Tarefa</h3>
            </div>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => {
                const trimmed = description.trim()
                if (trimmed !== (task?.description || '')) {
                  handleUpdateField('description', trimmed)
                }
              }}
              placeholder="Sem descrição fornecida para esta tarefa. Adicione uma descrição."
              rows={Math.max(3, description.split('\n').length)}
              className="w-full bg-transparent hover:border-zinc-200 rounded-xl px-0 py-1 text-secondary text-[15px] leading-relaxed outline-none focus:bg-white focus:border-zinc-300 focus:px-3 focus:py-2 transition-all resize-none border border-transparent"
            />
          </div>

          {/* Subtasks Section */}
          <div className="bg-zinc-100 border border-zinc-200 rounded-[20px] p-6 flex flex-col gap-6">
            {totalSubtasks > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-secondary font-bold text-base">Progresso</span>
                  <span className="text-secondary font-semibold text-sm">{completedSubtasks} de {totalSubtasks} ({subtasksPercent}%)</span>
                </div>
                <ProgressBar value={subtasksPercent} className="w-full">
                  <ProgressBar.Track className="bg-zinc-200">
                    <ProgressBar.Fill className="bg-primary" />
                  </ProgressBar.Track>
                </ProgressBar>
              </div>
            )}

            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-secondary text-base">Checklist</h3>
              {task.subtasks && task.subtasks.length > 0 ? (
                <div className="flex flex-col gap-2.5">
                  {task.subtasks.map((sub: any, idx: number) => (
                    <div key={idx} className="bg-white rounded-[16px] p-4 flex items-center gap-3 border border-zinc-200 group">
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
                      <span className={`text-[15px] flex-1 ${sub.completed ? 'text-secondary/50 line-through' : 'text-secondary font-medium'}`}>
                        {sub.text}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubtask(idx)}
                        className="size-7 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 hover:bg-zinc-100 transition-all cursor-pointer bg-transparent border-none text-secondary/50 hover:text-red-500 shrink-0"
                        title="Remover subtask"
                      >
                        <TrashBin className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-secondary/50 text-sm italic">Nenhuma subtask cadastrada para esta tarefa.</p>
              )}

              {/* Add New Subtask Input */}
              <div className="flex items-center gap-3 bg-white border border-zinc-200 rounded-[16px] px-4 py-3 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all mt-2 shadow-sm">
                <input
                  type="text"
                  value={subtaskInput}
                  onChange={(e) => setSubtaskInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddSubtask()
                    }
                  }}
                  placeholder="Adicionar nova subtask..."
                  className="flex-1 bg-transparent border-none outline-none text-secondary text-[15px] placeholder:text-zinc-400"
                />
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  disabled={!subtaskInput.trim() || updateMutation.isPending}
                  className={`text-sm font-bold transition-all bg-transparent border-none cursor-pointer p-1 ${subtaskInput.trim()
                    ? 'text-primary hover:text-primary/80 font-extrabold'
                    : 'text-zinc-400 cursor-not-allowed'
                    }`}
                >
                  Adicionar
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Sidebar Info Panel */}
        <div className="flex flex-col gap-4">
          <div className="bg-zinc-100 border border-zinc-200 rounded-[20px] p-6 flex flex-col gap-5">
            <h3 className="font-bold text-secondary text-base border-b border-zinc-200 pb-3">Detalhes</h3>

            {/* Status Option */}
            <div className="flex flex-col gap-2">
              <span className="text-secondary/60 text-xs font-bold uppercase tracking-wider">Status</span>
              <Select
                aria-label="Alterar Status"
                selectedKey={task.status}
                onSelectionChange={(key) => handleStatusChange(key as string)}
                className="w-full"
              >
                <Select.Trigger className="bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-secondary text-sm font-semibold w-full flex items-center justify-between hover:border-zinc-300 transition-colors shadow-sm">
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover className="bg-white border border-zinc-200 rounded-xl shadow-xl z-[120]">
                  <ListBox className="p-1">
                    {TASK_STATUSES.map((status) => (
                      <ListBox.Item key={status.key} id={status.key} textValue={status.label} className="px-3 py-2 text-sm rounded-lg hover:bg-zinc-100 cursor-pointer text-secondary font-medium">
                        {status.label}
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>

            {/* Priority Option */}
            <div className="flex flex-col gap-2">
              <span className="text-secondary/60 text-xs font-bold uppercase tracking-wider">Prioridade</span>
              <Select
                aria-label="Alterar Prioridade"
                selectedKey={task.priority}
                onSelectionChange={(key) => handlePriorityChange(key as string)}
                className="w-full"
              >
                <Select.Trigger className="bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-secondary text-sm font-semibold w-full flex items-center justify-between hover:border-zinc-300 transition-colors shadow-sm">
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover className="bg-white border border-zinc-200 rounded-xl shadow-xl z-[120]">
                  <ListBox className="p-1">
                    {PRIORITIES.map((priority) => (
                      <ListBox.Item key={priority.key} id={priority.key} textValue={priority.label} className="px-3 py-2 text-sm rounded-lg hover:bg-zinc-100 cursor-pointer text-secondary font-medium">
                        {priority.label}
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>

            {/* Project */}
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-secondary/60 text-xs font-bold uppercase tracking-wider">Projeto</span>
              <div className="relative" ref={projectRef}>
                <button
                  onClick={() => setIsProjectOpen(!isProjectOpen)}
                  className="w-full text-left bg-white border border-zinc-200 rounded-xl px-4 py-3 hover:border-zinc-300 transition-colors flex items-center justify-between cursor-pointer text-secondary group shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/30 transition-colors">
                      <Briefcase className="size-4 text-secondary" />
                    </div>
                    <span className="text-sm font-bold truncate">
                      {projectId ? projects.find(p => p.id === projectId)?.name || 'Desconhecido' : 'Selecionar Projeto'}
                    </span>
                  </div>
                </button>
                {isProjectOpen && (
                  <div className="absolute left-0 top-full mt-2 w-full bg-white border border-zinc-200 rounded-xl shadow-xl z-[120] py-1 max-h-60 overflow-y-auto">
                    {projects.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleSelectProject(p.id)}
                        className={`w-full text-left px-4 py-2.5 text-sm font-semibold flex items-center gap-3 border-none bg-transparent cursor-pointer transition-colors hover:bg-zinc-50 ${projectId === p.id ? 'text-secondary' : 'text-secondary/70'}`}
                      >
                        <Briefcase className="size-4 text-zinc-400" />
                        <span className="truncate flex-1">{p.name}</span>
                        {projectId === p.id && <span className="text-primary shrink-0">✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-secondary/60 text-xs font-bold uppercase tracking-wider">Tags</span>
              <div className="flex flex-wrap items-center gap-2 bg-white border border-zinc-200 rounded-xl px-3 py-2 min-h-[46px] shadow-sm">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 bg-secondary text-white px-2.5 py-1 rounded-xl text-xs font-semibold"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="size-4 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors cursor-pointer bg-transparent border-none text-white/70 hover:text-white text-xs leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <div className="relative flex-1 min-w-[80px]" ref={tagsRef}>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                    onFocus={() => setIsTagSuggestionsOpen(true)}
                    placeholder={tags.length === 0 ? "Adicionar tags..." : "+ tag"}
                    className="bg-transparent border-none outline-none text-secondary text-sm w-full placeholder:text-zinc-400 py-1"
                  />
                  {isTagSuggestionsOpen && filteredSuggestions.length > 0 && (
                    <div className="absolute left-0 top-full mt-2 w-48 bg-white border border-zinc-200 rounded-xl z-[120] py-1 max-h-40 overflow-y-auto shadow-xl">
                      <div className="px-3 py-1.5 text-[10px] text-zinc-400 uppercase font-bold tracking-wider">
                        Sugestões
                      </div>
                      {filteredSuggestions.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault() // Prevents input onBlur
                            if (!tags.includes(tag)) {
                              const newTags = [...tags, tag]
                              setTags(newTags)
                              handleUpdateField('tags', newTags)
                              setTagInput('')
                            }
                            setIsTagSuggestionsOpen(false)
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-secondary hover:bg-zinc-50 border-none bg-transparent cursor-pointer font-medium"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Due date */}
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-secondary/60 text-xs font-bold uppercase tracking-wider">Prazo</span>
              <DatePicker
                className="w-full h-10"
                value={dueDate}
                onChange={handleDateChange}
                granularity="minute"
                hideTimeZone={true}
                hourCycle={24}
              >
                {({ state }) => (
                  <>
                    <DateField.Group className="bg-white border border-zinc-200 rounded-full w-full cursor-pointer hover:border-zinc-300 transition-colors shadow-sm">
                      <DatePicker.Trigger className="bg-transparent border-none shadow-none px-4 py-2.5 cursor-pointer outline-none w-full text-left flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-lg bg-zinc-100 flex items-center justify-center text-secondary shrink-0 group-hover:bg-zinc-200 transition-colors">
                            <CalendarIcon className="size-4" />
                          </div>
                          {dueDate ? (
                            <span className="text-sm font-bold text-secondary">
                              {dueDate.toDate(getLocalTimeZone()).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          ) : (
                            <span className="text-sm font-bold text-secondary/40">Definir prazo</span>
                          )}
                        </div>
                      </DatePicker.Trigger>
                    </DateField.Group>
                    <DatePicker.Popover placement="bottom end" className="flex flex-col gap-3 bg-white p-4 rounded-xl shadow-xl border border-zinc-200 z-[150] min-w-[280px]">
                      <Calendar aria-label="Date">
                        <Calendar.Header className="flex items-center justify-between mb-3">
                          <Calendar.YearPickerTrigger className="font-bold text-secondary hover:bg-zinc-100 px-2 py-1 rounded cursor-pointer transition-colors">
                            <Calendar.YearPickerTriggerHeading />
                          </Calendar.YearPickerTrigger>
                          <div className="flex">
                            <Calendar.NavButton slot="previous" className="size-7 flex items-center justify-center hover:bg-zinc-100 rounded cursor-pointer text-secondary/70 transition-colors" />
                            <Calendar.NavButton slot="next" className="size-7 flex items-center justify-center hover:bg-zinc-100 rounded cursor-pointer text-secondary/70 transition-colors" />
                          </div>
                        </Calendar.Header>
                        <Calendar.Grid className="w-full border-collapse">
                          <Calendar.GridHeader className="mb-2">
                            {(day) => <Calendar.HeaderCell className="text-[11px] font-bold text-secondary/40 pb-2">{day}</Calendar.HeaderCell>}
                          </Calendar.GridHeader>
                          <Calendar.GridBody>
                            {(date) => <Calendar.Cell date={date} className="text-sm size-8 flex items-center justify-center hover:bg-zinc-100 rounded text-center cursor-pointer data-[selected=true]:bg-primary/50 data-[selected=true]:font-bold data-[selected=true]:text-secondary transition-colors" />}
                          </Calendar.GridBody>
                        </Calendar.Grid>
                      </Calendar>
                      <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
                        <Label className="text-xs font-bold text-secondary/50 uppercase tracking-wider">Horário</Label>
                        <TimeField
                          aria-label="Time"
                          granularity="minute"
                          hourCycle={24}
                          value={state.timeValue}
                          onChange={(v) => state.setTimeValue(v as TimeValue)}
                        >
                          <TimeField.Group className="flex bg-zinc-100 rounded-lg px-2 py-1 border border-zinc-200">
                            <TimeField.Input className="flex gap-0.5 text-sm font-bold text-secondary outline-none">
                              {(segment) => <TimeField.Segment segment={segment} className="focus:bg-primary/30 rounded px-0.5" />}
                            </TimeField.Input>
                          </TimeField.Group>
                        </TimeField>
                      </div>
                    </DatePicker.Popover>
                  </>
                )}
              </DatePicker>
            </div>

            {/* Estimated vs Worked hours */}
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-secondary/60 text-xs font-bold uppercase tracking-wider">Horas: Estimado / Gasto</span>
              <div className="flex items-center justify-between bg-white border border-zinc-200 rounded-xl px-4 py-2.5 shadow-sm">
                <div className="flex items-center gap-3 flex-1">
                  <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center text-secondary shrink-0">
                    <Clock className="size-4" />
                  </div>
                  <div className="flex items-center text-sm font-bold text-secondary w-full">
                    <input
                      type="number"
                      value={estimatedHours || ''}
                      onChange={(e) => setEstimatedHours(parseInt(e.target.value) || 0)}
                      onBlur={handleHoursBlur}
                      onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                      className="w-12 bg-transparent border-b border-transparent hover:border-zinc-300 focus:border-secondary outline-none text-center transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="0"
                    />
                    <span className="text-secondary/50 mx-2">h  /</span>
                    <span>{task.worked_hours || 0}h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
