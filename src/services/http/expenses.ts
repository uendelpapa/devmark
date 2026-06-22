import { api } from '../../lib/axios'
import type { ProjectExpense, CreateProjectExpenseData } from '../types'

export async function createProjectExpense(data: CreateProjectExpenseData): Promise<ProjectExpense> {
  const response = await api.post('/project-expenses', data)
  return response.data
}

export async function deleteProjectExpense(expenseId: string): Promise<void> {
  await api.delete(`/project-expenses/${expenseId}`)
}
