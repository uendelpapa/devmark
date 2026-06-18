import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Plus, LayoutHeaderCells, ChartColumnStacked, LayoutRows3, LayoutHeaderCellsLarge } from '@gravity-ui/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchTasks, updateTaskStatus, createTask, updateTask, deleteTask } from '../services/api'
import type { TaskCardData as Task } from '../services/api'
import { KanbanView } from '../components/tarefas/KanbanView'
import { ListView } from '../components/tarefas/ListView'
import { TableView } from '../components/tarefas/TableView'
import { useTimer } from '../components/TimerTracker'
import { CreateTaskModal, type CreateTaskPayload } from '../components/CreateTaskModal'
import { EditTaskModal } from '../components/EditTaskModal'

export const Route = createFileRoute('/tarefas')({
  component: Tarefas
})

type ViewMode = 'kanban' | 'list' | 'table'

const viewButtons: { key: ViewMode; label: string; icon: typeof LayoutHeaderCells }[] = [
  { key: 'kanban', label: 'Kanban', icon: ChartColumnStacked },
  { key: 'list', label: 'List', icon: LayoutRows3 },
  { key: 'table', label: 'Table', icon: LayoutHeaderCellsLarge }
]

function Tarefas() {
  const [view, setView] = useState<ViewMode>('table')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const { activeTaskId, setActiveTaskId, startTimer, pauseTimer } = useTimer()

  const queryClient = useQueryClient()
  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks
  })

  const { mutate } = useMutation({
    mutationFn: ({ taskId, newStatus }: { taskId: string, newStatus: Task['status'] }) => 
      updateTaskStatus(taskId, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    }
  })

  const { mutate: mutateCreate, isPending: isCreating, error: createError, reset: resetCreate } = useMutation({
    mutationFn: (data: CreateTaskPayload) => createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      setIsCreateModalOpen(false)
    }
  })

  const { mutate: mutateUpdate, isPending: isUpdating, error: updateError, reset: resetUpdate } = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<CreateTaskPayload> }) => updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      setEditingTask(null)
    }
  })

  const { mutate: mutateDelete, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      setEditingTask(null)
    }
  })


  // Group by new API statuses (filtering out CANCELED for Kanban)
  const pendingTasks = tasks.filter((t: Task) => t.status === 'PENDING')
  const inProgressTasks = tasks.filter((t: Task) => t.status === 'IN_PROGRESS')
  const reviewTasks = tasks.filter((t: Task) => t.status === 'REVIEW')
  const completedTasks = tasks.filter((t: Task) => t.status === 'COMPLETED')

  const handleTaskStatusChange = (taskId: string, newStatus: Task['status']) => {
    // Optimistic update logic could be added here
    mutate({ taskId, newStatus })

    if (newStatus === 'IN_PROGRESS') {
      setActiveTaskId(taskId)
      startTimer()
    } else if (activeTaskId === taskId) {
      pauseTimer()
    }
  }

  const handleTaskReorder = (_reorderedTasks: Task[]) => {
    // Not implemented in API yet, skipping reordering logic
  }

  return (
    <div className="bg-white rounded-[24px] p-6 overflow-y-auto min-w-0 max-h-[calc(100vh-100px)] h-fit scrollbar-none">

      {/* Action Bar */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-8">
          <h1 className="text-3xl font-medium tracking-tight text-secondary leading-none">
            Tarefas
          </h1>

          <div className="flex items-center gap-2">
            {viewButtons.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setView(key)}
                className={`${view === key
                  ? 'bg-primary/50 text-secondary hover:bg-primary'
                  : 'bg-secondary text-white hover:bg-secondary/80'
                  } font-bold rounded-full px-5 h-10 border-none text-[14px] transition-colors flex items-center gap-2 cursor-pointer`}
              >
                <Icon className="size-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            className="bg-primary/50 hover:bg-primary text-secondary font-bold rounded-full border-none text-[14px] transition-colors flex items-center gap-2 px-5 h-10 cursor-pointer"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="size-4" />
            Adicionar Tarefa
          </button>
          <button
            className="bg-zinc-200 hover:bg-zinc-300 text-secondary font-bold rounded-full border-none text-[14px] transition-colors px-5 h-10 cursor-pointer"
          >
            Importar Dados
          </button>
        </div>
      </div>

      {/* Task Views */}
      {view === 'kanban' && (
        <KanbanView 
          pendingTasks={pendingTasks} 
          inProgressTasks={inProgressTasks} 
          reviewTasks={reviewTasks}
          completedTasks={completedTasks} 
          onTaskStatusChange={handleTaskStatusChange} 
          onTaskClick={(task) => setEditingTask(task)}
        />
      )}
      {view === 'list' && (
        <ListView 
          pendingTasks={pendingTasks} 
          inProgressTasks={inProgressTasks} 
          reviewTasks={reviewTasks}
          completedTasks={completedTasks} 
          onTaskStatusChange={handleTaskStatusChange} 
          onTaskClick={(task) => setEditingTask(task)}
        />
      )}
      {view === 'table' && (
        <TableView 
          tasks={tasks} 
          onTaskStatusChange={handleTaskStatusChange} 
          onTaskReorder={handleTaskReorder} 
          onTaskClick={(task) => setEditingTask(task)}
        />
      )}

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false)
          resetCreate()
        }}
        onSubmit={(data) => mutateCreate(data)}
        isPending={isCreating}
        error={
          createError
            ? Array.isArray((createError as any).response?.data?.message)
              ? (createError as any).response.data.message.join(', ')
              : (createError as any).response?.data?.message || createError.message
            : null
        }
      />

      {/* Edit Task Modal */}
      <EditTaskModal
        isOpen={!!editingTask}
        task={editingTask}
        onClose={() => {
          setEditingTask(null)
          resetUpdate()
        }}
        onSubmit={(data) => {
          if (editingTask) {
            mutateUpdate({ id: editingTask.id, data })
          }
        }}
        onDelete={() => {
          if (editingTask && confirm('Tem certeza que deseja excluir esta tarefa?')) {
            mutateDelete(editingTask.id)
          }
        }}
        isPending={isUpdating || isDeleting}
        error={
          updateError
            ? Array.isArray((updateError as any).response?.data?.message)
              ? (updateError as any).response.data.message.join(', ')
              : (updateError as any).response?.data?.message || updateError.message
            : null
        }
      />

    </div>
  )
}
