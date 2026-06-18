import { api } from '../../lib/axios'
import { formatDate } from './utils'
import type { DashboardData } from '../types'

export async function fetchDashboardData(): Promise<DashboardData> {
  const response = await api.get('/dashboard')
  const data = response.data
  
  if (data.projects) {
    data.projects = data.projects.map((p: any) => ({
      ...p,
      expected_delivery_date: formatDate(p.expected_delivery_date)
    }))
  }
  
  if (data.pending_payments) {
    data.pending_payments = data.pending_payments.map((p: any) => ({
      ...p,
      due_date: formatDate(p.due_date)
    }))
  }
  
  return data
}
