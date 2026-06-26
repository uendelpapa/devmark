import type { CalendarItem } from '../../services/types'

interface MonthViewProps {
  currentDate: Date
  items: CalendarItem[]
  selectedDate: Date | null
  onSelectDate: (date: Date) => void
}

const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startPad = firstDay.getDay()
  const totalDays = lastDay.getDate()

  const days: (Date | null)[] = []
  // Padding for days before the 1st
  for (let i = 0; i < startPad; i++) {
    const d = new Date(year, month, -(startPad - i - 1))
    days.push(d)
  }
  // Actual days
  for (let i = 1; i <= totalDays; i++) {
    days.push(new Date(year, month, i))
  }
  // Padding after to fill 6 rows
  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    days.push(new Date(year, month + 1, i))
  }
  return days
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
    // For events spanning multiple days
    if (item.end) {
      const endDate = new Date(item.end)
      return date >= itemDate && date <= endDate
    }
    return false
  })
}

const TYPE_CHIP_STYLES: Record<string, string> = {
  project: 'bg-primary/30 text-secondary border-primary/50',
  task: 'bg-blue-50 text-blue-700 border-blue-200',
  event: 'bg-amber-50 text-amber-700 border-amber-200',
}

export function MonthView({ currentDate, items, selectedDate, onSelectDate }: MonthViewProps) {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const days = getMonthDays(year, month)

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 border-b border-zinc-100">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="py-2.5 text-center text-[11px] font-bold text-secondary/40 uppercase tracking-wider"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 grid-rows-6 flex-1 min-h-0">
        {days.map((date, i) => {
          if (!date) return <div key={i} />

          const isCurrentMonth = date.getMonth() === month
          const dayItems = getItemsForDay(items, date)
          const isSelected = selectedDate && isSameDay(date, selectedDate)
          const today = isToday(date)

          return (
            <button
              key={i}
              onClick={() => onSelectDate(date)}
              className={`
                relative flex flex-col items-start p-1.5 border-r border-b border-zinc-100/80
                transition-all duration-150 cursor-pointer bg-transparent text-left
                hover:bg-zinc-50/80
                ${!isCurrentMonth ? 'opacity-35' : ''}
                ${isSelected ? 'bg-primary/8 ring-1 ring-primary/30 ring-inset' : ''}
              `}
            >
              {/* Day Number */}
              <span
                className={`
                  text-xs font-semibold leading-none mb-1 w-6 h-6 flex items-center justify-center rounded-full
                  ${today ? 'bg-secondary text-white' : 'text-secondary/70'}
                  ${isSelected && !today ? 'bg-primary/30 text-secondary' : ''}
                `}
              >
                {date.getDate()}
              </span>

              {/* Items */}
              <div className="flex flex-col gap-0.5 w-full overflow-hidden flex-1">
                {dayItems.slice(0, 3).map((item) => (
                  <div
                    key={`${item.type}-${item.id}`}
                    className={`
                      text-[10px] font-semibold px-1.5 py-0.5 rounded-md truncate
                      border transition-transform hover:scale-[1.02]
                      ${TYPE_CHIP_STYLES[item.type]}
                    `}
                    title={item.title}
                  >
                    {item.title}
                  </div>
                ))}
                {dayItems.length > 3 && (
                  <span className="text-[10px] text-secondary/40 font-semibold px-1.5">
                    +{dayItems.length - 3} mais
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
