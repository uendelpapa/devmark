import { Clock, Code } from '@gravity-ui/icons'
import type { TaskCardData as Task } from '../../services/api'

export type { Task }

export function getUrgencyInfo(dueDateStr: string) {
  const due = new Date(dueDateStr)
  const now = new Date('2026-11-08') // Using a fixed reference for demo, ideally Date.now()

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
    <span className={`${urgencyInfo.className} border-none px-1.5 py-0.5 rounded-full inline-flex items-center justify-center`}>
      <span className="flex items-center gap-1.5 text-xs">
        <Clock className="size-3" />
        {urgencyInfo.label.toLowerCase()}
      </span>
    </span>
  )
}

export function WebTagChip() {
  return (
    <span className="bg-[#1C6ED7] text-white border-none px-1.5 py-0.5 rounded-full inline-flex items-center justify-center">
      <span className="flex items-center gap-1 text-xs">
        <span className="font-mono text-[10px]">
          <Code />
        </span> web
      </span>
    </span>
  )
}
