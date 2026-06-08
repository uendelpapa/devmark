import { Chip } from '@heroui/react'
import {
  Ellipsis,
  Calendar,
  Plus,
  ChevronDown
} from '@gravity-ui/icons'
import type { Task } from './taskData'
import { UrgencyChip, WebTagChip } from './taskData'

interface TaskListSectionProps {
  title: string
  tasks: Task[]
}

function TaskListSection({ title, tasks }: TaskListSectionProps) {
  return (
    <div className="flex flex-col border-4 border-zinc-100 rounded-[24px] overflow-hidden bg-white shrink-0">
      <div className="bg-[#A7B99E] p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-6 rounded-full bg-[#1A2619] flex items-center justify-center text-white cursor-pointer hover:bg-[#253924] transition-colors">
            <ChevronDown className="size-4" />
          </div>
          <span className="font-bold text-secondary text-[16px]">{title}</span>
          <Chip size="sm" className="bg-white/80 text-secondary font-bold text-[11px] h-6 px-2 border-none shadow-sm">
            {tasks.length} Tarefas
          </Chip>
        </div>
        <button className="size-8 bg-[#1A2619] text-white rounded-full flex items-center justify-center hover:bg-[#253924] transition-colors cursor-pointer">
          <Plus className="size-4" />
        </button>
      </div>
      <div className="flex flex-col">
        {tasks.map(task => (
          <div key={task.id} className="flex items-center justify-between p-5 border-b border-zinc-100 last:border-b-0 hover:bg-zinc-50 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="size-5 rounded-full bg-zinc-200 shrink-0" />
              <span className="font-bold text-[16px] text-secondary">{task.title}</span>
            </div>
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-1.5 text-secondary/60">
                <Calendar className="size-4" />
                <span className="text-[13px] font-semibold">Due Date {task.dueDate}</span>
              </div>

              <UrgencyChip dueDate={task.dueDate} />
              <WebTagChip />

              <button className="text-secondary/30 hover:text-secondary transition-colors ml-2">
                <Ellipsis className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface ListViewProps {
  todoTasks: Task[]
  doingTasks: Task[]
  doneTasks: Task[]
}

export function ListView({ todoTasks, doingTasks, doneTasks }: ListViewProps) {
  return (
    <div className="flex flex-col flex-1 gap-6 overflow-y-auto scrollbar-none pr-2 pb-4">
      <TaskListSection title="To do" tasks={todoTasks} />
      <TaskListSection title="Doing" tasks={doingTasks} />
      <TaskListSection title="Done" tasks={doneTasks} />
    </div>
  )
}
