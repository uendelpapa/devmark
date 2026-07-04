import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Plus, LayoutHeaderCells, ChartColumnStacked, LayoutRows3, LayoutHeaderCellsLarge } from '@gravity-ui/icons'
import { Select, SelectItem } from '../../components/ui/Select'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchTasks, updateTaskStatus, createTask, updateTask, deleteTask, fetchProjects } from '../../services/api'
import type { TaskCardData as Task } from '../../services/api'
import { KanbanView } from '../../components/tasks/KanbanView'
import { ListView } from '../../components/tasks/ListView'
import { TableView } from '../../components/tasks/TableView'
import { useTimer } from '../../components/ui/TimerTracker'
import { CreateTaskModal, type CreateTaskPayload } from '../../components/tasks/CreateTaskModal'
import { EditTaskModal } from '../../components/tasks/EditTaskModal'
import { toast } from '../../components/ui/Toast'
import { Button } from '#/components/ui/Button'

export const Route = createFileRoute('/_authenticated/tarefas')({
  component: Tarefas
})

type ViewMode = 'kanban' | 'list' | 'table'

const viewButtons: { key: ViewMode; label: string; icon: typeof LayoutHeaderCells }[] = [
  { key: 'kanban', label: 'Kanban', icon: ChartColumnStacked },
  { key: 'list', label: 'List', icon: LayoutRows3 },
  { key: 'table', label: 'Table', icon: LayoutHeaderCellsLarge }
]

function Tarefas() {
  const [view, setView] = useState<ViewMode>('kanban')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [createTaskStatusPreset, setCreateTaskStatusPreset] = useState<Task['status'] | undefined>(undefined)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const { activeTaskId, setActiveTaskId, startTimer, pauseTimer } = useTimer()

  const handleAddTaskClick = (status?: Task['status']) => {
    setCreateTaskStatusPreset(status)
    setIsCreateModalOpen(true)
  }

  const queryClient = useQueryClient()

  const [selectedProjectId, setSelectedProjectId] = useState<string>('ALL')

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects
  })

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks', selectedProjectId],
    queryFn: () => fetchTasks(selectedProjectId === 'ALL' ? undefined : selectedProjectId)
  })

  const { mutate } = useMutation({
    mutationFn: ({ taskId, newStatus }: { taskId: string, newStatus: Task['status'] }) =>
      updateTaskStatus(taskId, newStatus),
    onMutate: async ({ taskId, newStatus }) => {
      const queryKey = ['tasks', selectedProjectId]
      await queryClient.cancelQueries({ queryKey })
      const previousTasks = queryClient.getQueryData(queryKey)

      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;
        return old.map((task: any) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      })

      return { previousTasks, queryKey }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(context.queryKey, context.previousTasks)
      }
    },
    onSettled: () => {
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
    if (newStatus === 'IN_PROGRESS' && inProgressTasks.length > 0 && !inProgressTasks.find((t) => t.id === taskId)) {
      toast.warning('Você já tem uma tarefa em andamento. Conclua ou pause ela antes de iniciar outra.')
      return
    }

    // Optimistic update logic could be added here
    mutate({ taskId, newStatus })

    if (newStatus === 'IN_PROGRESS') {
      setActiveTaskId(taskId)
      startTimer(taskId)
    } else if (activeTaskId === taskId) {
      pauseTimer()
    }
  }

  const handleTaskReorder = (_reorderedTasks: Task[]) => {
    // Not implemented in API yet, skipping reordering logic
  }

  return (
    <div className="flex flex-col bg-white rounded-[24px] p-6 overflow-y-auto min-w-0 max-h-[calc(100vh-100px)] h-fit scrollbar-none gap-8">

      {/* Action Bar */}
      <div className="flex items-center justify-between shrink-0">
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
                  ? 'bg-primary text-secondary hover:bg-primary/50 border border-primary'
                  : 'bg-primary/50 text-secondary hover:bg-primary border border-primary'
                  } font-semibold rounded-full px-5 h-10  text-[14px] transition-colors flex items-center gap-2 cursor-pointer`}
              >
                <Icon className="size-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Select
            ariaLabel="Filtrar por Projeto"
            selectedKey={selectedProjectId}
            onSelectionChange={(key) => setSelectedProjectId(key as string)}
            variant="zinc"
          >
            <SelectItem id="ALL">
              Todos os Projetos
            </SelectItem>
            {projects.map((p: any) => (
              <SelectItem key={p.id} id={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </Select>

          <Button
            onClick={() => handleAddTaskClick()}
          >
            <Plus className="size-4" />
            Adicionar Tarefa
          </Button>
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
          onAddTask={(status) => handleAddTaskClick(status)}
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
          onTaskDelete={(taskId) => mutateDelete(taskId)}
        />
      )}

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        statusPreset={createTaskStatusPreset}
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
