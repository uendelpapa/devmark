import type { CalendarItem } from '../../services/types'

interface WeekViewProps {
  currentDate: Date
  items: CalendarItem[]
  selectedDate: Date | null
  onSelectDate: (date: Date) => void
}

const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const HOURS = Array.from({ length: 24 }, (_, i) => i)

function getWeekDays(date: Date): Date[] {
  const startOfWeek = new Date(date)
  startOfWeek.setDate(date.getDate() - date.getDay())
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek)
    d.setDate(startOfWeek.getDate() + i)
    return d
  })
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

function isToday(date: Date): boolean {
  return isSameDay(date, new Date())
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

const TYPE_STYLES: Record<string, { bg: string; border: string; text: string }> = {
  project: { bg: 'bg-primary/20', border: 'border-l-primary', text: 'text-secondary' },
  task: { bg: 'bg-blue-50', border: 'border-l-blue-400', text: 'text-blue-800' },
  event: { bg: 'bg-amber-50', border: 'border-l-amber-400', text: 'text-amber-800' },
}

export function WeekView({ currentDate, items, selectedDate, onSelectDate }: WeekViewProps) {
  const weekDays = getWeekDays(currentDate)

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Day Headers */}
      <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-zinc-200 shrink-0">
        <div className="py-3" /> {/* Time column spacer */}
        {weekDays.map((day, i) => {
          const today = isToday(day)
          const selected = selectedDate && isSameDay(day, selectedDate)
          return (
            <button
              key={i}
              onClick={() => onSelectDate(day)}
              className={`
                py-3 text-center border-l border-zinc-100 cursor-pointer bg-transparent transition-colors
                ${selected ? 'bg-primary/8' : 'hover:bg-zinc-50'}
              `}
            >
              <span className="text-[11px] font-bold text-secondary/40 uppercase tracking-wider block">
                {WEEKDAY_LABELS[i]}
              </span>
              <span
                className={`
                  text-lg font-bold mt-0.5 inline-flex items-center justify-center size-8 rounded-full
                  ${today ? 'bg-secondary text-white' : 'text-secondary'}
                `}
              >
                {day.getDate()}
              </span>
            </button>
          )
        })}
      </div>

      {/* Time Grid */}
      <div className="flex-1 overflow-y-auto scrollbar-none">
        <div className="grid grid-cols-[60px_repeat(7,1fr)] min-h-[1440px]">
          {/* Hours Column */}
          <div className="relative">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="h-[60px] flex items-start justify-end pr-2 pt-0.5"
              >
                <span className="text-[10px] font-semibold text-secondary/30">
                  {hour.toString().padStart(2, '0')}:00
                </span>
              </div>
            ))}
          </div>

          {/* Day Columns */}
          {weekDays.map((day, dayIndex) => {
            const dayItems = getItemsForDay(items, day)
            const selected = selectedDate && isSameDay(day, selectedDate)

            return (
              <div
                key={dayIndex}
                className={`
                  relative border-l border-zinc-100
                  ${selected ? 'bg-primary/5' : ''}
                `}
              >
                {/* Hour gridlines */}
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="h-[60px] border-b border-zinc-100/60"
                  />
                ))}

                {/* Items pinned to top */}
                <div className="absolute top-1 left-1 right-1 flex flex-col gap-0.5">
                  {dayItems.slice(0, 5).map((item) => {
                    const styles = TYPE_STYLES[item.type]
                    return (
                      <div
                        key={`${item.type}-${item.id}`}
                        className={`
                          ${styles.bg} ${styles.text} border-l-2 ${styles.border}
                          text-[10px] font-semibold px-1.5 py-1 rounded-r-md truncate
                          transition-transform hover:scale-[1.02] cursor-default
                        `}
                        title={item.title}
                      >
                        {item.title}
                      </div>
                    )
                  })}
                  {dayItems.length > 5 && (
                    <span className="text-[10px] text-secondary/40 font-semibold px-1">
                      +{dayItems.length - 5}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
