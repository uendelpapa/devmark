import { Xmark } from '@gravity-ui/icons'
import type { CalendarItem } from '../../services/types'

interface ActivityPanelProps {
  selectedDate: Date | null
  items: CalendarItem[]
  onClose: () => void
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

function getItemsForDay(items: CalendarItem[], date: Date): CalendarItem[] {
  return items.filter((item) => {
    const itemDate = new Date(item.start)
    if (isSameDay(itemDate, date)) return true
    if (item.end) {
      const endDate = new Date(item.end)
      return date >= itemDate && date <= endDate
    }
    return false
  })
}

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

const TYPE_CONFIG: Record<string, { label: string; dotColor: string; bg: string; text: string }> = {
  project: { label: 'Projetos', dotColor: 'bg-primary', bg: 'bg-primary/10', text: 'text-secondary' },
  task: { label: 'Tarefas', dotColor: 'bg-blue-400', bg: 'bg-blue-50', text: 'text-blue-800' },
  event: { label: 'Eventos', dotColor: 'bg-amber-400', bg: 'bg-amber-50', text: 'text-amber-800' },
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export function ActivityPanel({ selectedDate, items, onClose }: ActivityPanelProps) {
  if (!selectedDate) return null

  const dayItems = getItemsForDay(items, selectedDate)
  const grouped = {
    project: dayItems.filter(i => i.type === 'project'),
    task: dayItems.filter(i => i.type === 'task'),
    event: dayItems.filter(i => i.type === 'event'),
  }

  const formattedDate = `${selectedDate.getDate()} de ${MONTHS[selectedDate.getMonth()]}`

  return (
    <div className="w-[280px] shrink-0 border-l border-zinc-200 pl-4 flex flex-col min-h-0 animate-calendar-panel-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h3 className="text-sm font-bold text-secondary">Atividades</h3>
        <button
          onClick={onClose}
          className="size-6 flex items-center justify-center rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer bg-transparent border-none"
        >
          <Xmark className="size-3.5 text-secondary/50" />
        </button>
      </div>

      {/* Date Label */}
      <p className="text-xs font-semibold text-secondary/50 mb-3 shrink-0">{formattedDate}</p>

      {/* Items */}
      <div className="flex-1 overflow-y-auto scrollbar-none space-y-4">
        {dayItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <span className="text-2xl mb-2">✨</span>
            <p className="text-xs font-semibold text-secondary/40">Dia livre!</p>
            <p className="text-[11px] text-secondary/30 mt-0.5">Nenhuma atividade programada</p>
          </div>
        ) : (
          (['project', 'task', 'event'] as const).map((type) => {
            const typeItems = grouped[type]
            if (typeItems.length === 0) return null
            const config = TYPE_CONFIG[type]

            return (
              <div key={type}>
                <div className="flex items-center gap-1.5 mb-2">
                  <div className={`size-2 rounded-full ${config.dotColor}`} />
                  <span className="text-[10px] font-bold text-secondary/40 uppercase tracking-wider">
                    {config.label}
                  </span>
                </div>

                <div className="space-y-1.5">
                  {typeItems.map((item) => (
                    <div
                      key={`${item.type}-${item.id}`}
                      className={`
                        ${config.bg} rounded-xl p-2.5 transition-all duration-200 
                        hover:shadow-sm cursor-default animate-calendar-item-in
                      `}
                    >
                      <p className={`text-xs font-semibold ${config.text} truncate`}>
                        {item.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {item.start && (
                          <span className="text-[10px] text-secondary/40 font-medium">
                            {formatTime(new Date(item.start))}
                          </span>
                        )}
                        {item.status && (
                          <span className="text-[10px] text-secondary/40 font-medium">
                            • {item.status.replace(/_/g, ' ')}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
