import { api } from '../../lib/axios'
import type { CalendarItem, Event } from '../types'

// Color mapping for calendar item types
const COLORS = {
  project: '#BAF08A',  // primary green
  task: '#60a5fa',     // blue-400
  event: '#fbbf24',    // amber-400
} as const

export async function fetchEvents(params?: {
  start?: string
  end?: string
  project_id?: string
}): Promise<Event[]> {
  const response = await api.get('/events', { params })
  return response.data
}

export async function createEvent(data: {
  title: string
  description?: string
  start_date: string
  end_date: string
  project_id?: string
}): Promise<Event> {
  const response = await api.post('/events', data)
  return response.data
}

export async function fetchCalendarItems(params?: {
  start?: string
  end?: string
}): Promise<CalendarItem[]> {
  // Fetch all three data sources in parallel
  const [projectsRes, tasksRes, eventsRes] = await Promise.all([
    api.get('/projects'),
    api.get('/tasks'),
    api.get('/events', { params }),
  ])

  const items: CalendarItem[] = []

  // Projects → calendar items (using expected_delivery_date)
  const projects = projectsRes.data?.data || projectsRes.data || []
  for (const p of projects) {
    if (p.expected_delivery_date) {
      items.push({
        id: p.id,
        title: p.name,
        type: 'project',
        start: new Date(p.expected_delivery_date),
        status: p.status,
        priority: p.priority,
        projectName: p.client?.name,
        color: COLORS.project,
      })
    }
  }

  // Tasks → calendar items (using due_date)
  const tasks = tasksRes.data?.data || tasksRes.data || []
  for (const t of tasks) {
    if (t.due_date) {
      items.push({
        id: t.id,
        title: t.title,
        type: 'task',
        start: new Date(t.due_date),
        status: t.status,
        priority: t.priority,
        projectName: t.project?.name,
        color: COLORS.task,
      })
    }
  }

  // Events → calendar items
  const events = eventsRes.data || []
  for (const e of events) {
    items.push({
      id: e.id,
      title: e.title,
      type: 'event',
      start: new Date(e.start_date),
      end: new Date(e.end_date),
      projectName: e.project?.name,
      color: COLORS.event,
    })
  }

  return items
}
