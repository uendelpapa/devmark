import { Clock } from '@gravity-ui/icons'

export interface Task {
  id: string
  taskId: string
  title: string
  description: string
  status: 'TODO' | 'DOING' | 'DONE'
  dueDate: string
  client: { name: string; email: string; avatar?: string }
}

export function getUrgencyInfo(dueDateStr: string) {
  const due = new Date(dueDateStr)
  const now = new Date('2026-11-08')

  const diffTime = due.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return { label: 'Atrasado', className: 'bg-red-700 text-white' }
  if (diffDays <= 3) return { label: 'Urgente', className: 'bg-[#b84a5b]/90 text-white' }
  if (diffDays <= 7) return { label: 'Atenção', className: 'bg-[#D4A017]/90 text-white' }
  return { label: 'Normal', className: 'bg-[#4E7A36]/90 text-white' }
}

export function UrgencyChip({ dueDate }: { dueDate: string }) {
  const urgencyInfo = getUrgencyInfo(dueDate)

  return (
    <span className={`${urgencyInfo.className} border-none h-6 px-2 rounded-full inline-flex items-center justify-center`}>
      <span className="font-semibold flex items-center gap-1.5 text-[11px]">
        <Clock className="size-3" />
        {urgencyInfo.label.toLowerCase()}
      </span>
    </span>
  )
}

export function WebTagChip() {
  return (
    <span className="bg-[#1C6ED7] text-white border-none h-6 px-2 rounded-full inline-flex items-center justify-center">
      <span className="font-semibold flex items-center gap-1 text-[11px]">
        <span className="font-mono text-[10px]">{'{ }'}</span> web
      </span>
    </span>
  )
}

const mockClient = {
  name: 'John Smith',
  email: 'john@acme.com',
  avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d'
}

export const mockTasks: Task[] = [
  { id: '1', taskId: '#4586933', title: 'Projeto 1', description: 'descrição do card da task', status: 'TODO', dueDate: '10 Nov 2026', client: mockClient },
  { id: '2', taskId: '#4586933', title: 'Projeto 1', description: 'descrição do card da task', status: 'TODO', dueDate: '14 Nov 2026', client: mockClient },
  { id: '3', taskId: '#4586933', title: 'Projeto 1', description: 'descrição do card da task', status: 'TODO', dueDate: '20 Nov 2026', client: mockClient },
  { id: '4', taskId: '#4586933', title: 'Projeto 1', description: 'descrição do card da task', status: 'DOING', dueDate: '10 Nov 2026', client: mockClient },
  { id: '5', taskId: '#4586933', title: 'Projeto 1', description: 'descrição do card da task', status: 'DOING', dueDate: '14 Nov 2026', client: mockClient },
  { id: '6', taskId: '#4586933', title: 'Projeto 1', description: 'descrição do card da task', status: 'DONE', dueDate: '10 Nov 2026', client: mockClient },
  { id: '7', taskId: '#4586933', title: 'Projeto 1', description: 'descrição do card da task', status: 'DONE', dueDate: '10 Nov 2026', client: mockClient },
  { id: '8', taskId: '#4586933', title: 'Projeto 1', description: 'descrição do card da task', status: 'DONE', dueDate: '14 Nov 2026', client: mockClient },
  { id: '9', taskId: '#4586933', title: 'Projeto 1', description: 'descrição do card da task', status: 'DONE', dueDate: '20 Nov 2026', client: mockClient }
]
