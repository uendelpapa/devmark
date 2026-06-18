import { useRef } from 'react'
import { DndContext, useDraggable, useDroppable, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import {
  Ellipsis,
  Clock,
  Calendar,
  Flag,
  Plus
} from '@gravity-ui/icons'
import type { Task } from './taskData'
import { getUrgencyInfo } from './taskData'

interface TaskCardProps {
  task: Task
  onClick?: (task: Task) => void
  wasDragging: React.MutableRefObject<boolean>
}

function TaskCard({ task, onClick, wasDragging }: TaskCardProps) {
  const urgencyInfo = getUrgencyInfo(task.dueDate)

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { task }
  })

  const style = transform ? {
    transform: CSS.Translate.toString(transform),
  } : undefined

  const handleClick = () => {
    if (wasDragging.current) {
      wasDragging.current = false
      return
    }
    onClick?.(task)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className={`w-full h-[164px] justify-between bg-white rounded-[16px] p-4 shadow-sm border border-transparent flex flex-col cursor-pointer hover:border-zinc-200 transition-colors ${isDragging ? 'opacity-50 z-50 shadow-xl cursor-grabbing' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <h3 className="font-semibold text-lg text-secondary leading-tight truncate">{task.title}</h3>
          <p className="text-secondary/50 text-sm truncate">{task.description}</p>
        </div>
        <button className="text-secondary/30 hover:text-secondary transition-colors shrink-0 ml-2">
          <Ellipsis className="size-4" />
        </button>
      </div>

      <div className="flex items-center">
        <span className={`${urgencyInfo.className} border-none px-2 py-0.5 rounded-full inline-flex items-center justify-center text-xs`}>
          <span className="flex items-center gap-1.5 text-xs font-medium">
            <Clock className="size-3" />
            {urgencyInfo.label.toLowerCase()}
          </span>
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-secondary/60">
        <Calendar className="size-4" />
        <span className="text-[12px] font-semibold">Due Date {task.dueDate}</span>
      </div>
    </div>
  )
}

interface KanbanColumnProps {
  id: Task['status']
  title: string
  tasks: Task[]
  headerBg: string
  flagColor: string
  onTaskClick?: (task: Task) => void
  wasDragging: React.MutableRefObject<boolean>
}

function KanbanColumn({ id, title, tasks, headerBg, flagColor, onTaskClick, wasDragging }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col w-full h-fit shrink-0 rounded-[24px] p-2 gap-1 transition-colors ${isOver ? 'bg-zinc-200' : 'bg-zinc-100'}`}
    >
      <div className={`bg-backpage w-full rounded-[16px] p-2 flex items-center justify-between shrink-0`}>
        <div className="flex items-center gap-2">
          <div className={`${headerBg} size-6 flex items-center justify-center rounded-3xl`}>
            <Flag className={`${flagColor} size-4`} />
          </div>
          <span className="font-bold text-zinc-800 text-lg">{title}</span>
          <span className="bg-white/80 text-secondary font-bold text-[11px] px-2 py-0.5 rounded-full">
            {tasks.length} Tarefas
          </span>
        </div>
        <button className="size-8 bg-secondary text-white rounded-full flex items-center justify-center hover:bg-[#334621] transition-colors cursor-pointer">
          <Plus className="size-4" />
        </button>
      </div>
      {/* Removed overflow-y-auto so it doesn't clip dragged children */}
      <div className="flex flex-col gap-3 flex-1 overflow-visible">
        {tasks.map(task => <TaskCard key={task.id} task={task} onClick={onTaskClick} wasDragging={wasDragging} />)}
      </div>
    </div>
  )
}

interface KanbanViewProps {
  pendingTasks: Task[]
  inProgressTasks: Task[]
  reviewTasks: Task[]
  completedTasks: Task[]
  onTaskStatusChange?: (taskId: string, newStatus: Task['status']) => void
  onTaskClick?: (task: Task) => void
}

export function KanbanView({ pendingTasks, inProgressTasks, reviewTasks, completedTasks, onTaskStatusChange, onTaskClick }: KanbanViewProps) {
  const wasDragging = useRef(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    wasDragging.current = true
    const { active, over } = event
    if (!over) return

    const taskId = active.id as string
    const newStatus = over.id as Task['status']
    const activeTask = active.data.current?.task as Task | undefined

    if (activeTask && activeTask.status !== newStatus) {
      onTaskStatusChange?.(taskId, newStatus)
    }
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-4 gap-6 flex-1 overflow-y-auto overflow-x-hidden scrollbar-none pb-4">
        <KanbanColumn id="PENDING" title="To do" tasks={pendingTasks} headerBg="bg-zinc-300" flagColor="text-zinc-800" onTaskClick={onTaskClick} wasDragging={wasDragging} />
        <KanbanColumn id="IN_PROGRESS" title="Doing" tasks={inProgressTasks} headerBg="bg-amber-200" flagColor="text-amber-600" onTaskClick={onTaskClick} wasDragging={wasDragging} />
        <KanbanColumn id="REVIEW" title="Review" tasks={reviewTasks} headerBg="bg-blue-200" flagColor="text-blue-600" onTaskClick={onTaskClick} wasDragging={wasDragging} />
        <KanbanColumn id="COMPLETED" title="Done" tasks={completedTasks} headerBg="bg-secondary" flagColor="text-primary" onTaskClick={onTaskClick} wasDragging={wasDragging} />
      </div>
    </DndContext>
  )
}
