import { api } from '../../lib/axios'
import { formatDate } from './utils'
import type { DashboardData, ProjectSummary, FinanceSummary } from '../types'
import { toast } from '../../components/Toast'

interface RawProjectListItem {
  id: string
  name: string
  expected_delivery_date: string | null
}

interface RawPendingPaymentItem {
  payment_id: string
  amount: number
  due_date: string
  client_name: string
  client_email: string
}

interface RawDashboardResponse {
  project_summary: ProjectSummary
  finance_summary: FinanceSummary
  projects: RawProjectListItem[]
  pending_payments: RawPendingPaymentItem[]
  weekly_work_level: number[]
}

export async function fetchDashboardData(): Promise<DashboardData> {
  try {
    const response = await api.get<RawDashboardResponse>('/dashboard')
    const data = response.data

    const projects = (data.projects || []).map((p) => ({
      id: p.id,
      name: p.name,
      expected_delivery_date: p.expected_delivery_date ? formatDate(p.expected_delivery_date) : ''
    }))

    const pending_payments = (data.pending_payments || []).map((p) => ({
      payment_id: p.payment_id,
      amount: p.amount,
      due_date: formatDate(p.due_date),
      client_name: p.client_name,
      client_email: p.client_email
    }))

    return {
      project_summary: data.project_summary,
      finance_summary: data.finance_summary,
      projects,
      pending_payments,
      weekly_work_level: data.weekly_work_level || [0, 0, 0, 0, 0, 0, 0]
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao buscar dados do dashboard'
    toast.error(`Falha ao carregar dashboard: ${message}`)
    throw error
  }
}

