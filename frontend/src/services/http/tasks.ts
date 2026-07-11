import { api } from '../../lib/axios'
import { formatDate } from './utils'
import type { Task, TaskCardData, CreateTaskData } from '../types'

export async function fetchTasks(projectId?: string | any): Promise<TaskCardData[]> {
  const validProjectId = typeof projectId === 'string' ? projectId : undefined;
  const url = validProjectId ? `/tasks?project_id=${validProjectId}` : '/tasks'
  const response = await api.get(url)
  return response.data.data.map((t: any) => ({
    ...t, // Spread original task fields
    id: t.id,
    taskId: `#${t.id.substring(0, 6)}`,
    title: t.title,
    description: t.description || '',
    status: t.status,
    dueDate: t.due_date ? formatDate(t.due_date) : null,
    client: { 
      name: t.project?.client?.name || 'Projeto Oculto', 
      email: t.project?.client?.email || '' 
    }
  }))
}

export async function updateTaskStatus(taskId: string, newStatus: Task['status']): Promise<void> {
  await api.patch(`/tasks/${taskId}`, { status: newStatus })
}

export async function createTask(data: CreateTaskData): Promise<Task> {
  const response = await api.post('/tasks', data)
  return response.data
}

export async function updateTask(taskId: string, data: Partial<CreateTaskData>): Promise<Task> {
  const response = await api.patch(`/tasks/${taskId}`, data)
  return response.data
}

export async function deleteTask(taskId: string): Promise<void> {
  await api.delete(`/tasks/${taskId}`)
}

export async function fetchTaskDetails(taskId: string): Promise<any> {
  const response = await api.get(`/tasks/${taskId}`)
  return response.data
}
