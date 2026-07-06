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

  // Projects → calendar items (Start and End markers)
  const projects = projectsRes.data?.data || projectsRes.data || []
  for (const p of projects) {
    const startDateStr = p.start_date || p.created_at
    const endDateStr = p.expected_delivery_date

    // 1. Início do Projeto
    if (startDateStr) {
      const startObj = new Date(startDateStr)
      if (startDateStr.endsWith('T00:00:00.000Z')) {
        startObj.setMinutes(startObj.getMinutes() + startObj.getTimezoneOffset())
      }
      items.push({
        id: `start-${p.id}`,
        title: `Início: ${p.name}`,
        type: 'project',
        start: startObj,
        status: p.status,
        priority: p.priority,
        projectName: p.client?.name,
        color: COLORS.project,
      })
    }

    // 2. Entrega do Projeto
    if (endDateStr) {
      const endObj = new Date(endDateStr)
      if (endDateStr.endsWith('T00:00:00.000Z')) {
        endObj.setMinutes(endObj.getMinutes() + endObj.getTimezoneOffset())
      }
      items.push({
        id: `end-${p.id}`,
        title: `Entrega: ${p.name}`,
        type: 'project',
        start: endObj,
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
