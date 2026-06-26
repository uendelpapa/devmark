import type { CalendarItem } from '../../services/types'

interface YearViewProps {
  currentDate: Date
  items: CalendarItem[]
  onSelectMonth: (month: number) => void
}

const MONTH_NAMES = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
]

const WEEKDAY_LABELS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

function getMonthDays(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startPad = firstDay.getDay()
  const totalDays = lastDay.getDate()

  const days: (number | null)[] = []
  for (let i = 0; i < startPad; i++) days.push(null)
  for (let i = 1; i <= totalDays; i++) days.push(i)
  return days
}

function hasItemsOnDay(items: CalendarItem[], year: number, month: number, day: number): { project: boolean; task: boolean; event: boolean } {
  const date = new Date(year, month, day)
  const result = { project: false, task: false, event: false }

  for (const item of items) {
    const itemDate = new Date(item.start)
    const sameDay = itemDate.getFullYear() === year &&
      itemDate.getMonth() === month &&
      itemDate.getDate() === day

    if (sameDay || (item.end && date >= new Date(item.start) && date <= new Date(item.end))) {
      result[item.type] = true
    }
  }
  return result
}

export function YearView({ currentDate, items, onSelectMonth }: YearViewProps) {
  const year = currentDate.getFullYear()
  const today = new Date()
  const todayYear = today.getFullYear()
  const todayMonth = today.getMonth()
  const todayDate = today.getDate()

  return (
    <div className="flex-1 overflow-y-auto scrollbar-none">
      <div className="grid grid-cols-4 gap-4 p-2">
        {Array.from({ length: 12 }, (_, month) => {
          const days = getMonthDays(year, month)
          const isCurrentMonth = year === todayYear && month === todayMonth

          return (
            <button
              key={month}
              onClick={() => onSelectMonth(month)}
              className={`
                bg-transparent border border-zinc-100 rounded-2xl p-3 cursor-pointer
                transition-all duration-200 hover:border-primary/40 hover:shadow-md hover:scale-[1.02]
                text-left
                ${isCurrentMonth ? 'ring-1 ring-primary/30 border-primary/20' : ''}
              `}
            >
              {/* Month Title */}
              <h3 className={`text-sm font-bold mb-2 ${isCurrentMonth ? 'text-secondary' : 'text-secondary/70'}`}>
                {MONTH_NAMES[month]}
              </h3>

              {/* Mini Weekday Headers */}
              <div className="grid grid-cols-7 mb-0.5">
                {WEEKDAY_LABELS.map((label, i) => (
                  <span key={i} className="text-[8px] font-bold text-secondary/20 text-center">
                    {label}
                  </span>
                ))}
              </div>

              {/* Mini Calendar Grid */}
              <div className="grid grid-cols-7 gap-y-0.5">
                {days.map((day, i) => {
                  if (day === null) {
                    return <div key={i} className="h-4" />
                  }

                  const isToday = year === todayYear && month === todayMonth && day === todayDate
                  const activity = hasItemsOnDay(items, year, month, day)
                  const hasAny = activity.project || activity.task || activity.event

                  return (
                    <div
                      key={i}
                      className="h-4 flex flex-col items-center justify-center relative"
                    >
                      <span
                        className={`
                          text-[9px] font-semibold leading-none
                          ${isToday ? 'bg-secondary text-white rounded-full size-3.5 flex items-center justify-center' : ''}
                          ${!isToday && hasAny ? 'text-secondary' : 'text-secondary/30'}
                        `}
                      >
                        {day}
                      </span>
                      {hasAny && !isToday && (
                        <div className="flex gap-px mt-px">
                          {activity.project && <div className="size-[3px] rounded-full bg-primary" />}
                          {activity.task && <div className="size-[3px] rounded-full bg-blue-400" />}
                          {activity.event && <div className="size-[3px] rounded-full bg-amber-400" />}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
