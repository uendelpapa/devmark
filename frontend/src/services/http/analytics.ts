import { api } from '../../lib/axios'
import type { AnalyticsData } from '../types'
import { toast } from '../../components/ui/Toast'

export async function fetchAnalyticsData(months: number = 6): Promise<AnalyticsData> {
  try {
    const response = await api.get<AnalyticsData>('/analytics', {
      params: { months }
    })
    return response.data
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao buscar dados analíticos'
    toast.error(`Falha ao carregar análise: ${message}`)
    throw error
  }
}
