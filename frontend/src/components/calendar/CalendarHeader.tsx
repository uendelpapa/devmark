import { ChevronLeft, ChevronRight, Plus } from '@gravity-ui/icons'
import type { CalendarViewMode } from '../../services/types'

interface CalendarHeaderProps {
  currentDate: Date
  viewMode: CalendarViewMode
  onViewModeChange: (mode: CalendarViewMode) => void
  onNavigate: (direction: 'prev' | 'next' | 'today') => void
  onAddTask: () => void
}

const VIEW_BUTTONS: { key: CalendarViewMode; label: string }[] = [
  { key: 'day', label: 'Dia' },
  { key: 'week', label: 'Semana' },
  { key: 'month', label: 'Mês' },
  { key: 'year', label: 'Ano' },
]

function formatPeriodTitle(date: Date, mode: CalendarViewMode): string {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]
  const weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

  switch (mode) {
    case 'day':
      return `${weekDays[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]} ${date.getFullYear()}`
    case 'week': {
      const startOfWeek = new Date(date)
      startOfWeek.setDate(date.getDate() - date.getDay())
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)
      if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
        return `${startOfWeek.getDate()} – ${endOfWeek.getDate()} de ${months[startOfWeek.getMonth()]} ${startOfWeek.getFullYear()}`
      }
      return `${startOfWeek.getDate()} ${months[startOfWeek.getMonth()].slice(0, 3)} – ${endOfWeek.getDate()} ${months[endOfWeek.getMonth()].slice(0, 3)} ${endOfWeek.getFullYear()}`
    }
    case 'month':
      return `${months[date.getMonth()]} ${date.getFullYear()}`
    case 'year':
      return `${date.getFullYear()}`
  }
}

export function CalendarHeader({
  currentDate,
  viewMode,
  onViewModeChange,
  onNavigate,
  onAddTask,
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between shrink-0">
      <div className="flex items-center gap-6">
        <h1 className="text-3xl font-medium tracking-tight text-secondary leading-none">
          Calendário
        </h1>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5">
          {VIEW_BUTTONS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => onViewModeChange(key)}
              className={`${
                viewMode === key
                  ? 'bg-primary/50 text-secondary hover:bg-primary'
                  : 'bg-secondary text-white hover:bg-secondary/80'
              } font-bold rounded-full px-4 h-9 border-none text-[13px] transition-colors cursor-pointer`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Date Navigation */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onNavigate('prev')}
            className="size-9 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors cursor-pointer bg-transparent border-none"
          >
            <ChevronLeft className="size-4 text-secondary" />
          </button>

          <button
            onClick={() => onNavigate('today')}
            className="px-3 h-9 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer bg-transparent border-none text-sm font-semibold text-secondary"
          >
            Hoje
          </button>

          <button
            onClick={() => onNavigate('next')}
            className="size-9 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors cursor-pointer bg-transparent border-none"
          >
            <ChevronRight className="size-4 text-secondary" />
          </button>
        </div>

        {/* Current Period Title */}
        <span className="text-sm font-semibold text-secondary/70 min-w-[180px]">
          {formatPeriodTitle(currentDate, viewMode)}
        </span>

        {/* Add Task Button */}
        <button
          onClick={onAddTask}
          className="bg-primary/50 hover:bg-primary text-secondary font-bold rounded-full border-none text-[14px] transition-colors flex items-center gap-2 px-5 h-10 cursor-pointer"
        >
          <Plus className="size-4" />
          Nova Tarefa
        </button>
      </div>
    </div>
  )
}
