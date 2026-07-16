import { useState, useEffect } from 'react'
import { Xmark, ArrowUpRightFromSquare, Ellipsis, Plus, TrashBin, Flag, Briefcase } from '@gravity-ui/icons'

import { useQuery } from '@tanstack/react-query'
import { fetchProjects, fetchTasks } from '../../services/api'
import type { Task } from '../../services/api'
import { DatePicker, DateField, TimeField, Checkbox, Calendar, Label } from '@heroui/react'
import type { TimeValue } from '@heroui/react'
import { getLocalTimeZone } from '@internationalized/date'
import type { DateValue } from '@internationalized/date'

interface Subtask {
  id: string
  text: string
  completed: boolean
}

interface CreateTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateTaskPayload) => void
  isPending?: boolean
  error?: string | null
  statusPreset?: Task['status']
}

export interface CreateTaskPayload {
  project_id: string
  title: string
  description: string
  priority: Task['priority']
  status: Task['status']
  estimated_hours: number
  due_date?: string
  tags: string[]
  subtasks: { text: string; completed?: boolean }[]
}

const TASK_STATUSES: { key: Task['status']; label: string }[] = [
  { key: 'PENDING', label: 'To Do' },
  { key: 'IN_PROGRESS', label: 'Fazendo' },
  { key: 'REVIEW', label: 'Revisão' },
  { key: 'COMPLETED', label: 'Concluído' },
  { key: 'CANCELED', label: 'Cancelado' },
]

const PRIORITIES: { key: Task['priority']; label: string; activeColor: string }[] = [
  { key: 'LOW', label: 'Baixa', activeColor: 'bg-zinc-500 text-white' },
  { key: 'MEDIUM', label: 'Normal', activeColor: 'bg-blue-500 text-white' },
  { key: 'HIGH', label: 'Alta', activeColor: 'bg-amber-500 text-white' },
  { key: 'URGENT', label: 'Urgente', activeColor: 'bg-red-500 text-white' },
]

const STATUS_CHIP_ACTIVE: Record<Task['status'], string> = {
  PENDING: 'bg-zinc-100 text-zinc-700 border border-zinc-200',
  IN_PROGRESS: 'bg-amber-50 text-amber-700 border border-amber-200/60',
  REVIEW: 'bg-blue-50 text-blue-700 border border-blue-200/60',
  COMPLETED: 'bg-primary/20 text-secondary border border-primary/50',
  CANCELED: 'bg-red-50 text-red-700 border border-red-200/60',
}

export function CreateTaskModal({ isOpen, onClose, onSubmit, isPending = false, error = null, statusPreset }: CreateTaskModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Task['priority'] | null>(null)
  const [status, setStatus] = useState<Task['status'] | null>(null)
  const [projectId, setProjectId] = useState<string | null>(null)
  const [estimatedHours, setEstimatedHours] = useState(0)
  const [dueDate, setDueDate] = useState<DateValue | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [subtasks, setSubtasks] = useState<Subtask[]>([])
  const [subtaskInput, setSubtaskInput] = useState('')
  const [isTagSuggestionsOpen, setIsTagSuggestionsOpen] = useState(false)
  const [isPriorityOpen, setIsPriorityOpen] = useState(false)
  const [isStatusOpen, setIsStatusOpen] = useState(false)
  const [isProjectOpen, setIsProjectOpen] = useState(false)

  const { data: tasks = [] } = useQuery<any[]>({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
    enabled: isOpen
  })

  const allExistingTags = Array.from(
    new Set(
      tasks
        .flatMap((t) => t.tags || [])
        .filter((tag) => tag && tag.trim() !== '')
    )
  )

  const filteredSuggestions = allExistingTags.filter(
    (tag) => !tags.includes(tag) && tag.toLowerCase().includes(tagInput.trim().toLowerCase())
  )

  useEffect(() => {
    if (!isOpen) {
      setTitle('')
      setDescription('')
      setPriority(null)
      setStatus(null)
      setProjectId(null)
      setEstimatedHours(0)
      setDueDate(null)
      setTags([])
      setSubtasks([])
      setIsPriorityOpen(false)
      setIsStatusOpen(false)
      setIsProjectOpen(false)
    } else if (statusPreset) {
      setStatus(statusPreset)
    }
  }, [isOpen, statusPreset])

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    enabled: isOpen
  })

  if (!isOpen) return null

  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase()
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
  }

  const handleAddSubtask = () => {
    const trimmed = subtaskInput.trim()
    if (trimmed) {
      setSubtasks([...subtasks, { id: crypto.randomUUID(), text: trimmed, completed: false }])
      setSubtaskInput('')
    }
  }

  const handleToggleSubtask = (id: string) => {
    setSubtasks(subtasks.map(s => s.id === id ? { ...s, completed: !s.completed } : s))
  }

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter(s => s.id !== id))
  }

  const handleSubmit = () => {
    if (!title.trim() || !projectId) return
    onSubmit({
      project_id: projectId,
      title: title.trim(),
      description: description.trim(),
      priority: priority || 'MEDIUM',
      status: status || 'PENDING',
      estimated_hours: estimatedHours,
      due_date: dueDate ? dueDate.toDate(getLocalTimeZone()).toISOString() : undefined,
      tags,
      subtasks: subtasks.map(s => ({ text: s.text, completed: s.completed }))
    })
  }

  const today = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100]"
        onClick={onClose}
      />

      {/* Modal Panel - right side slide-in */}
      <div className="fixed right-0 top-0 h-full w-[440px] max-w-[100vw] bg-white z-[101] flex flex-col shadow-2xl animate-slide-in-right overflow-x-hidden">

        {/* Header Controls */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="size-8 flex items-center justify-center rounded-xl hover:bg-zinc-100 transition-colors cursor-pointer bg-transparent border-none"
            >
              <Xmark className="size-4 text-secondary/60" />
            </button>
            <button
              className="size-8 flex items-center justify-center rounded-xl hover:bg-zinc-100 transition-colors cursor-pointer bg-transparent border-none"
            >
              <ArrowUpRightFromSquare className="size-4 text-secondary/60" />
            </button>
          </div>
          <button
            className="size-8 flex items-center justify-center rounded-xl hover:bg-zinc-100 transition-colors cursor-pointer bg-transparent border-none"
          >
            <Ellipsis className="size-4 text-secondary/60" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-5 pb-4 space-y-5 scrollbar-none">

          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nome da tarefa"
            className="w-full bg-transparent border-none outline-none text-secondary text-xl font-semibold placeholder:text-zinc-400 py-1"
          />

          {/* Meta Info Grid */}
          <div className="space-y-3.5">

            {/* Projeto */}
            <div className="flex items-start gap-4">
              <span className="text-secondary/50 text-sm w-28 shrink-0 font-medium pt-1">Projeto:</span>
              <div className="relative">
                {projectId ? (
                  <button
                    onClick={() => setIsProjectOpen(!isProjectOpen)}
                    className="flex items-center gap-1.5 py-1 text-sm font-medium transition-all cursor-pointer border-none whitespace-nowrap bg-transparent text-secondary hover:text-secondary/70"
                  >
                    {projects.find(p => p.id === projectId)?.name || 'Projeto'}
                  </button>
                ) : (
                  <button
                    onClick={() => setIsProjectOpen(!isProjectOpen)}
                    className="flex items-center gap-1.5 py-1 text-sm font-medium transition-all cursor-pointer border-none whitespace-nowrap bg-transparent text-secondary/40 hover:text-secondary/60"
                  >
                    <Plus className="size-3" />
                    Adicionar
                  </button>
                )}
                {isProjectOpen && (
                  <>
                    <div className="fixed inset-0 z-[109]" onClick={() => setIsProjectOpen(false)} />
                    <div className="absolute left-0 top-full mt-1.5 w-56 bg-white border border-zinc-200 rounded-xl shadow-lg z-[110] py-1 max-h-60 overflow-y-auto">
                      <div className="px-3 py-1.5 text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Projeto</div>
                      {projects.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => { setProjectId(p.id); setIsProjectOpen(false) }}
                          className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center gap-2 border-none bg-transparent cursor-pointer transition-colors rounded-lg mx-auto hover:bg-zinc-50 ${projectId === p.id ? 'text-secondary' : 'text-secondary/70'
                            }`}
                        >
                          <Briefcase className="size-3 text-zinc-400" />
                          <span className="truncate">{p.name}</span>
                          {projectId === p.id && <span className="ml-auto text-primary shrink-0">✓</span>}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Prioridade */}
            <div className="flex items-start gap-4">
              <span className="text-secondary/50 text-sm w-28 shrink-0 font-medium pt-1">Prioridade:</span>
              <div className="relative">
                {priority ? (
                  <button
                    onClick={() => setIsPriorityOpen(!isPriorityOpen)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer border-none whitespace-nowrap ${PRIORITIES.find(p => p.key === priority)?.activeColor}`}
                  >
                    <Flag className="size-3" />
                    {PRIORITIES.find(p => p.key === priority)?.label}
                  </button>
                ) : (
                  <button
                    onClick={() => setIsPriorityOpen(!isPriorityOpen)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer border-none whitespace-nowrap bg-zinc-100 text-secondary/50 hover:bg-zinc-200 hover:text-secondary/70"
                  >
                    <Plus className="size-3" />
                    Adicionar
                  </button>
                )}
                {isPriorityOpen && (
                  <>
                    <div className="fixed inset-0 z-[109]" onClick={() => setIsPriorityOpen(false)} />
                    <div className="absolute left-0 top-full mt-1.5 w-48 bg-white border border-zinc-200 rounded-xl shadow-lg z-[110] py-1">
                      <div className="px-3 py-1.5 text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Prioridade</div>
                      {PRIORITIES.map((p) => (
                        <button
                          key={p.key}
                          onClick={() => { setPriority(p.key); setIsPriorityOpen(false) }}
                          className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center gap-2 border-none bg-transparent cursor-pointer transition-colors rounded-lg mx-auto hover:bg-zinc-50 ${priority === p.key ? 'text-secondary' : 'text-secondary/70'
                            }`}
                        >
                          <span className={`size-2.5 rounded-full ${p.activeColor.split(' ')[0]}`} />
                          {p.label}
                          {priority === p.key && <span className="ml-auto text-primary">✓</span>}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Data de Entrega */}
            <div className="flex items-center gap-4">
              <span className="text-secondary/50 text-sm w-28 shrink-0 font-medium">Data de entrega:</span>
              <DatePicker
                className="w-fit"
                value={dueDate}
                onChange={setDueDate}
                granularity="minute"
                hideTimeZone={true}
                hourCycle={24}
              >
                {({ state }) => (
                  <>
                    <DateField.Group className="border-none bg-transparent shadow-none p-0 m-0 w-fit cursor-pointer">
                      <DatePicker.Trigger className="bg-transparent border-none shadow-none p-0 cursor-pointer outline-none w-full text-left flex items-center">
                        {dueDate ? (
                          <span className="text-sm font-medium text-secondary hover:text-secondary/70 transition-colors py-1 flex items-center">
                            {dueDate.toDate(getLocalTimeZone()).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 py-1 text-sm font-medium text-secondary/40 hover:text-secondary/60 transition-colors">
                            <Plus className="size-3" />
                            Adicionar
                          </span>
                        )}
                      </DatePicker.Trigger>
                    </DateField.Group>
                    <DatePicker.Popover placement="bottom start" className="flex flex-col gap-3 bg-white p-4 rounded-xl shadow-xl border border-zinc-200 z-[150] min-w-[280px]">
                      <Calendar aria-label="Date">
                        <Calendar.Header className="flex items-center justify-between mb-3">
                          <Calendar.YearPickerTrigger className="font-bold text-secondary hover:bg-zinc-100 px-2 py-1 rounded cursor-pointer transition-colors">
                            <Calendar.YearPickerTriggerHeading />
                          </Calendar.YearPickerTrigger>
                          <div className="flex gap-1">
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
                              {(segment) => <TimeField.Segment segment={segment} className="focus:bg-primary/50 rounded px-0.5" />}
                            </TimeField.Input>
                          </TimeField.Group>
                        </TimeField>
                      </div>
                    </DatePicker.Popover>
                  </>
                )}
              </DatePicker>
            </div>

            {/* Status */}
            <div className="flex items-start gap-4">
              <span className="text-secondary/50 text-sm w-28 shrink-0 font-medium pt-1">Status</span>
              <div className="relative">
                {status ? (
                  <button
                    onClick={() => setIsStatusOpen(!isStatusOpen)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer border-none whitespace-nowrap ${STATUS_CHIP_ACTIVE[status]}`}
                  >
                    {TASK_STATUSES.find(s => s.key === status)?.label}
                  </button>
                ) : (
                  <button
                    onClick={() => setIsStatusOpen(!isStatusOpen)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer border-none whitespace-nowrap bg-zinc-100 text-secondary/50 hover:bg-zinc-200 hover:text-secondary/70"
                  >
                    <Plus className="size-3" />
                    Adicionar
                  </button>
                )}
                {isStatusOpen && (
                  <>
                    <div className="fixed inset-0 z-[109]" onClick={() => setIsStatusOpen(false)} />
                    <div className="absolute left-0 top-full mt-1.5 w-48 bg-white border border-zinc-200 rounded-xl shadow-lg z-[110] py-1">
                      <div className="px-3 py-1.5 text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Status</div>
                      {TASK_STATUSES.map((s) => (
                        <button
                          key={s.key}
                          onClick={() => { setStatus(s.key); setIsStatusOpen(false) }}
                          className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center gap-2 border-none bg-transparent cursor-pointer transition-colors rounded-lg mx-auto hover:bg-zinc-50 ${status === s.key ? 'text-secondary' : 'text-secondary/70'
                            }`}
                        >
                          <span className={`size-2.5 rounded-full ${STATUS_CHIP_ACTIVE[s.key].split(' ')[0]}`} />
                          {s.label}
                          {status === s.key && <span className="ml-auto text-primary">✓</span>}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="flex items-start gap-4">
              <span className="text-secondary/50 text-sm w-28 shrink-0 pt-1 font-medium">Tags</span>
              <div className="flex flex-wrap items-center gap-2 flex-1 relative">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 bg-secondary text-white px-2.5 py-1 rounded-xl text-xs font-semibold"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="size-3.5 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors cursor-pointer bg-transparent border-none text-white/70 hover:text-white text-[10px] leading-none"
                    >
                      X
                    </button>
                  </span>
                ))}
                <div className="relative inline-block">
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
                    onBlur={() => {
                      setTimeout(() => setIsTagSuggestionsOpen(false), 200)
                    }}
                    placeholder="+ tag"
                    className="bg-transparent border-none outline-none text-secondary/50 text-xs w-16 placeholder:text-zinc-400 py-1"
                  />
                  {isTagSuggestionsOpen && filteredSuggestions.length > 0 && (
                    <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-zinc-200 rounded-xl shadow-lg z-[110] py-1 max-h-40 overflow-y-auto">
                      <div className="px-2.5 py-1 text-[10px] text-zinc-400 uppercase font-bold tracking-wider">
                        Tags existentes
                      </div>
                      {filteredSuggestions.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onMouseDown={() => {
                            if (!tags.includes(tag)) {
                              setTags([...tags, tag])
                              setTagInput('')
                            }
                            setIsTagSuggestionsOpen(false)
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs text-secondary hover:bg-zinc-100 border-none bg-transparent cursor-pointer font-medium"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Horas estimadas */}
            <div className="flex items-center gap-4">
              <span className="text-secondary/50 text-sm w-28 shrink-0 font-medium">Horas estimadas</span>
              <input
                type="number"
                min={0}
                value={estimatedHours || ''}
                onChange={(e) => setEstimatedHours(parseInt(e.target.value) || 0)}
                placeholder="0"
                className="text-secondary text-sm font-medium outline-none w-6 border-b border-transparent focus:border-b focus:border-secondary transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>

            {/* Criado em */}
            <div className="flex items-center gap-4">
              <span className="text-secondary/50 text-sm w-28 shrink-0 font-medium">Criado em</span>
              <span className="text-secondary text-sm font-semibold">{today}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-zinc-200 w-full" />

          {/* Description */}
          <div>
            <h3 className="text-secondary text-xs font-bold tracking-wider uppercase mb-3">Descrição</h3>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adicione uma descrição para esta tarefa..."
              rows={4}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 text-secondary text-sm outline-none resize-none placeholder:text-zinc-400 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
            />
          </div>

          {/* Divider */}
          <div className="h-px bg-zinc-200 w-full" />

          {/* Subtasks */}
          <div>
            <h3 className="text-secondary text-xs font-bold tracking-wider uppercase mb-3">Adicionar Subtasks</h3>

            <div className="space-y-2.5">
              {subtasks.map((sub) => (
                <div key={sub.id} className="flex items-center gap-3 group">
                  <Checkbox
                    isSelected={sub.completed}
                    onChange={() => handleToggleSubtask(sub.id)}
                  >
                    <Checkbox.Content>
                      <Checkbox.Control className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all after:!hidden ${sub.completed ? '!bg-primary !border-primary text-[#011D00]' : 'border-zinc-500 bg-white text-transparent'}`}>
                        <Checkbox.Indicator className="subtask-checkbox-indicator" />
                      </Checkbox.Control>
                    </Checkbox.Content>
                  </Checkbox>
                  <span className={`text-sm flex-1 ${sub.completed ? 'text-zinc-400 line-through' : 'text-secondary'}`}>
                    {sub.text}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(sub.id)}
                    className="size-6 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all cursor-pointer bg-transparent border-none"
                  >
                    <TrashBin className="size-3 text-red-400" />
                  </button>
                </div>
              ))}

              {/* New subtask input with Add Link-Button */}
              <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
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
                  placeholder="Nova subtask..."
                  className="flex-1 bg-transparent border-none outline-none text-secondary text-sm placeholder:text-zinc-400"
                />
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  disabled={!subtaskInput.trim()}
                  className={`text-xs font-bold transition-all bg-transparent border-none cursor-pointer p-1 ${subtaskInput.trim()
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

        {/* Error message */}
        {error && (
          <div className="px-5 pb-2">
            <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-medium">
              {error}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-5 py-4 border-t border-zinc-200">
          <button
            onClick={handleSubmit}
            disabled={isPending || !title.trim() || !projectId}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer border-none ${!title.trim() || !projectId
              ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
              : 'bg-secondary text-white hover:bg-secondary/90 active:scale-[0.98]'
              }`}
          >
            <Plus className="size-4" />
            Criar Tarefa
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </>
  )
}
