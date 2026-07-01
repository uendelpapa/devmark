import { useState } from 'react'
import {
  Ellipsis,
  Calendar,
  Plus,
  ChevronDown
} from '@gravity-ui/icons'
import { Checkbox } from '@heroui/react'
import type { Task } from './taskData'
import { UrgencyChip } from './taskData'

interface TaskItemProps {
  task: Task
  index: number
  total: number
  onStatusChange?: (taskId: string, newStatus: Task['status']) => void
  onClick?: (task: Task) => void
}

function TaskItem({ task, index, total, onStatusChange, onClick }: TaskItemProps) {
  const roundedClass = total === 1 && index === 0 ? "rounded-2xl" : index === 0 ? 'rounded-t-2xl' : index === total - 1 ? 'rounded-b-2xl' : ''
  const isDone = task.status === 'COMPLETED'

  return (
    <div onClick={() => onClick?.(task)} className={`flex items-center justify-between p-5 bg-white hover:bg-zinc-50 ${roundedClass} transition-colors cursor-pointer ${isDone ? 'opacity-60' : ''}`}>
      <div className="flex items-center gap-4">
        <Checkbox
          isSelected={isDone}
          onChange={(checked) => {
            onStatusChange?.(task.id, checked ? 'COMPLETED' : 'PENDING')
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Checkbox.Content>
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
          </Checkbox.Content>
        </Checkbox>
        <span className={`font-bold text-[16px] text-secondary ${isDone ? 'line-through' : ''}`}>{task.title}</span>
      </div>
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-1.5 text-secondary/60">
          <Calendar className="size-4" />
          <span className="text-[13px] font-semibold">Due Date {task.dueDate}</span>
        </div>

        <UrgencyChip dueDate={task.dueDate} />

        <button className="text-secondary/30 hover:text-secondary transition-colors ml-2">
          <Ellipsis className="size-4" />
        </button>
      </div>
    </div>
  )
}

interface TaskListSectionProps {
  title: string
  tasks: Task[]
  onStatusChange?: (taskId: string, newStatus: Task['status']) => void
  onTaskClick?: (task: Task) => void
}

function TaskListSection({ title, tasks, onStatusChange, onTaskClick }: TaskListSectionProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex flex-col rounded-[24px] overflow-hidden bg-zinc-200 shrink-0 p-2 gap-2">
      <div className="bg-[#A7B99E] p-2 flex items-center justify-between rounded-2xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCollapsed(prev => !prev)}
            className="size-6 rounded-full bg-secondary hover:bg-primary flex items-center justify-center text-white hover:text-secondary cursor-pointer transition-colors border-none"
          >
            <ChevronDown className={`size-4 transition-transform duration-200 ${collapsed ? '-rotate-90' : ''}`} />
          </button>
          <span className="font-bold text-secondary text-[16px]">{title}</span>
          <span className="bg-white text-zinc-500 text-xs font-semibold px-2 py-0.5 rounded-full">
            {tasks.length} Tarefas
          </span>
        </div>
        <button className="size-8 bg-[#1A2619] text-white rounded-full flex items-center justify-center hover:bg-[#253924] transition-colors cursor-pointer border-none">
          <Plus className="size-4" />
        </button>
      </div>
      {!collapsed && (
        <div className="flex flex-col gap-0.5">
          {tasks.map((task, i) => (
            <TaskItem
              key={task.id}
              task={task}
              index={i}
              total={tasks.length}
              onStatusChange={onStatusChange}
              onClick={onTaskClick}
            />))}
        </div>
      )}
    </div>
  )
}

interface ListViewProps {
  pendingTasks: Task[]
  inProgressTasks: Task[]
  reviewTasks: Task[]
  completedTasks: Task[]
  onTaskStatusChange?: (taskId: string, newStatus: Task['status']) => void
  onTaskClick?: (task: Task) => void
}

export function ListView({ pendingTasks, inProgressTasks, reviewTasks, completedTasks, onTaskStatusChange, onTaskClick }: ListViewProps) {
  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none pr-2 space-y-6">
      <TaskListSection title="To do" tasks={pendingTasks} onStatusChange={onTaskStatusChange} onTaskClick={onTaskClick} />
      <TaskListSection title="Fazendo" tasks={inProgressTasks} onStatusChange={onTaskStatusChange} onTaskClick={onTaskClick} />
      <TaskListSection title="Revisão" tasks={reviewTasks} onStatusChange={onTaskStatusChange} onTaskClick={onTaskClick} />
      <TaskListSection title="Feito" tasks={completedTasks} onStatusChange={onTaskStatusChange} onTaskClick={onTaskClick} />
    </div>
  )
}
