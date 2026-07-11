import { api } from '../../lib/axios'
import type { TimeEntry } from '../types'

export async function fetchTimeEntries(params?: { project_id?: string; task_id?: string }): Promise<TimeEntry[]> {
  const response = await api.get('/time-entries', { params })
  return response.data
}

export async function startTimeEntry(data: { project_id: string; task_id: string; description?: string }): Promise<TimeEntry> {
  const response = await api.post('/time-entries', {
    ...data,
    start_time: new Date().toISOString()
  })
  return response.data
}

export async function stopTimeEntry(id: string, description?: string, endTime?: string): Promise<TimeEntry> {
  const response = await api.patch(`/time-entries/${id}`, {
    end_time: endTime || new Date().toISOString(),
    description
  })
  return response.data
}
