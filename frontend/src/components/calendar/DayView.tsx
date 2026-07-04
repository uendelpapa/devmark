import type { CalendarItem } from '../../services/types'

interface DayViewProps {
  currentDate: Date
  items: CalendarItem[]
  onCreateTask: (date: Date) => void
}

const HOURS = Array.from({ length: 24 }, (_, i) => i)

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

const TYPE_LABELS: Record<string, string> = {
  project: 'Projeto',
  task: 'Tarefa',
  event: 'Evento',
}

const TYPE_STYLES: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  project: { bg: 'bg-primary/15', border: 'border-l-primary', text: 'text-secondary', badge: 'bg-primary/40 text-secondary' },
  task: { bg: 'bg-blue-50', border: 'border-l-blue-400', text: 'text-blue-900', badge: 'bg-blue-100 text-blue-700' },
  event: { bg: 'bg-amber-50', border: 'border-l-amber-400', text: 'text-amber-900', badge: 'bg-amber-100 text-amber-700' },
}

export function DayView({ currentDate, items, onCreateTask }: DayViewProps) {
  const dayItems = getItemsForDay(items, currentDate)
  const today = new Date()
  const isToday = isSameDay(currentDate, today)
  const currentHour = today.getHours()

  return (
    <div className="flex-1 flex min-h-0 overflow-hidden gap-4">
      {/* Items List Panel */}
      <div className="w-[320px] shrink-0 flex flex-col gap-3 overflow-y-auto scrollbar-none pr-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-secondary/40 uppercase tracking-wider">
            {dayItems.length} item{dayItems.length !== 1 ? 's' : ''} neste dia
          </h3>
          <button
            onClick={() => onCreateTask(currentDate)}
            className="text-xs font-bold text-secondary hover:text-secondary/80 bg-transparent border-none cursor-pointer transition-colors"
          >
            + Tarefa
          </button>
        </div>

        {dayItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
            <div className="size-12 rounded-full bg-zinc-100 flex items-center justify-center mb-3">
              <span className="text-xl">📅</span>
            </div>
            <p className="text-sm font-semibold text-secondary/40">Nenhum item</p>
            <p className="text-xs text-secondary/30 mt-1">Este dia está livre</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {dayItems.map((item) => {
              const styles = TYPE_STYLES[item.type]
              return (
                <div
                  key={`${item.type}-${item.id}`}
                  className={`
                    ${styles.bg} border-l-3 ${styles.border} rounded-r-xl p-3
                    transition-all duration-200 hover:shadow-md cursor-default
                    animate-calendar-item-in
                  `}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${styles.text} truncate`}>
                        {item.title}
                      </p>
                      {item.projectName && (
                        <p className="text-[11px] text-secondary/50 mt-0.5 truncate">
                          {item.projectName}
                        </p>
                      )}
                    </div>
                    <span className={`${styles.badge} text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap`}>
                      {TYPE_LABELS[item.type]}
                    </span>
                  </div>
                  {item.status && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[10px] font-semibold text-secondary/40">
                        Status: {item.status.replace(/_/g, ' ')}
                      </span>
                      {item.priority && (
                        <span className="text-[10px] font-semibold text-secondary/40">
                          • {item.priority}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto scrollbar-none border-l border-zinc-200 pl-0">
        <div className="relative min-h-[1440px]">
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="h-[60px] flex border-b border-zinc-100/60 group"
            >
              <div className="w-14 shrink-0 flex items-start justify-end pr-3 pt-0.5">
                <span className="text-[10px] font-semibold text-secondary/25">
                  {hour.toString().padStart(2, '0')}:00
                </span>
              </div>
              <div
                className="flex-1 hover:bg-zinc-50/50 transition-colors cursor-pointer"
                onClick={() => onCreateTask(currentDate)}
              />
            </div>
          ))}

          {/* Current Time Indicator */}
          {isToday && (
            <div
              className="absolute left-14 right-0 flex items-center z-10 pointer-events-none"
              style={{ top: `${(currentHour / 24) * 1440 + (today.getMinutes() / 60) * 60}px` }}
            >
              <div className="size-2 rounded-full bg-red-500 -ml-1 shrink-0" />
              <div className="flex-1 h-[1.5px] bg-red-500" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
