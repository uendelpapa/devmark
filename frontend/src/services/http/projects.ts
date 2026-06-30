import { api } from '../../lib/axios'
import { formatDate } from './utils'
import type { Project, ProjectCardData, ProjectDetails } from '../types'

export async function fetchProjects(): Promise<ProjectCardData[]> {
  const response = await api.get('/projects')
  
  // Status sort order: active work first, completed last
  const STATUS_ORDER: Record<Project['status'], number> = {
    IN_PROGRESS: 3,
    WAITING_CLIENT: 1,
    REVIEW: 2,
    PLANNING: 3,
    COMPLETED: 4,
    CANCELED: 5
  }

  return response.data.data.map((p: any) => ({
    id: p.id,
    name: p.name,
    description: p.description || `Descrição do projeto ${p.name}`,
    status: p.status,
    priority: p.priority,
    expected_delivery_date: formatDate(p.expected_delivery_date),
    client_name: p.client?.name || 'Cliente Oculto',
    client_email: p.client?.email || 'email@dominio.com'
  })).sort((a: ProjectCardData, b: ProjectCardData) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status])
}

export async function fetchProjectDetails(id: string): Promise<ProjectDetails> {
  const response = await api.get(`/projects/${id}`)
  return response.data
}
export async function createProject(data: Partial<Project>): Promise<Project> {
  const response = await api.post('/projects', data)
  return response.data
}

export async function createProjectWithTasks(project: Partial<Project>, tasks: any[]): Promise<Project> {
  const response = await api.post('/projects/with-tasks', { project, tasks })
  return response.data
}

export async function updateProject(id: string, data: Partial<Project>): Promise<Project> {
  const response = await api.patch(`/projects/${id}`, data)
  return response.data
}

export async function deleteProject(id: string): Promise<void> {
  await api.delete(`/projects/${id}`)
}
