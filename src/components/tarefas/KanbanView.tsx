import { Chip } from '@heroui/react'
import {
  Ellipsis,
  Clock,
  Calendar,
  Flag,
  Plus
} from '@gravity-ui/icons'
import type { Task } from './taskData'
import { getUrgencyInfo } from './taskData'

function TaskCard({ task }: { task: Task }) {
  const urgencyInfo = getUrgencyInfo(task.dueDate)

  return (
    <div className="bg-white rounded-[16px] p-5 shadow-sm border border-transparent flex flex-col gap-4 cursor-pointer hover:border-zinc-200 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-[16px] text-secondary leading-tight">{task.title}</h3>
          <p className="text-[13px] text-secondary/50 font-medium">{task.description}</p>
        </div>
        <button className="text-secondary/30 hover:text-secondary transition-colors">
          <Ellipsis className="size-4" />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center">
          <Chip
            size="sm"
            className={`${urgencyInfo.className} border-none h-6 px-2 flex items-center justify-center`}
          >
            <div className="font-semibold flex items-center gap-1.5 text-[11px]">
              <Clock className="size-3" />
              {urgencyInfo.label.toLowerCase()}
            </div>
          </Chip>
        </div>

        <div className="flex items-center gap-1.5 text-secondary/60">
          <Calendar className="size-4" />
          <span className="text-[12px] font-semibold">Due Date {task.dueDate}</span>
        </div>
      </div>
    </div>
  )
}

interface KanbanColumnProps {
  title: string
  tasks: Task[]
  headerBg: string
  flagColor: string
}

function KanbanColumn({ title, tasks, headerBg, flagColor }: KanbanColumnProps) {
  return (
    <div className="flex flex-col w-[360px] shrink-0 bg-zinc-100 rounded-[24px] p-3 gap-3">
      <div className={`${headerBg} rounded-[16px] p-4 flex items-center justify-between shrink-0`}>
        <div className="flex items-center gap-3">
          <Flag className={`${flagColor} size-4`} />
          <span className="font-bold text-secondary text-[16px]">{title}</span>
          <Chip size="sm" className="bg-white/80 text-secondary font-bold text-[11px] h-6 px-1 border-none shadow-sm">
            {tasks.length} Tarefas
          </Chip>
        </div>
        <button className="size-8 bg-[#3F5234] text-white rounded-full flex items-center justify-center hover:bg-[#334621] transition-colors cursor-pointer">
          <Plus className="size-4" />
        </button>
      </div>
      <div className="flex flex-col gap-3 flex-1 overflow-y-auto scrollbar-none px-1">
        {tasks.map(task => <TaskCard key={task.id} task={task} />)}
      </div>
    </div>
  )
}

interface KanbanViewProps {
  todoTasks: Task[]
  doingTasks: Task[]
  doneTasks: Task[]
}

export function KanbanView({ todoTasks, doingTasks, doneTasks }: KanbanViewProps) {
  return (
    <div className="flex flex-1 gap-6 min-h-0 overflow-x-auto overflow-y-hidden pb-4 scrollbar-none">
      <KanbanColumn title="To do" tasks={todoTasks} headerBg="bg-[#C3D0BB]" flagColor="text-secondary" />
      <KanbanColumn title="Doing" tasks={doingTasks} headerBg="bg-[#E5DDB8]" flagColor="text-[#B38D19]" />
      <KanbanColumn title="Done" tasks={doneTasks} headerBg="bg-[#C3D0BB]" flagColor="text-[#3F5234]" />
    </div>
  )
}
