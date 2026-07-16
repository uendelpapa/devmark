import { memo, useState, useRef, useEffect } from 'react'
import { Avatar, Button } from '@heroui/react'
import { Ellipsis, PencilToLine, Layers, TrashBin, Check } from '@gravity-ui/icons'
import { Folder, User, Flag, ListTodo } from 'lucide-react'

interface ProjectCardV2Props {
  id: string
  name: string
  description: string
  status: 'PLANNING' | 'IN_PROGRESS' | 'WAITING_CLIENT' | 'REVIEW' | 'COMPLETED' | 'CANCELED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  expected_delivery_date: string
  client_name: string
  client_email: string
  area?: 'MARKETING' | 'DEVELOPER'
  estimated_hours?: number
  totalTasks?: number
  completedTasks?: number
  onPress?: (id: string) => void
  onEdit?: (id: string) => void
  onChangeStatus?: (id: string, currentStatus: string) => void
  onDelete?: (id: string, name: string) => void
  onMarkCompleted?: (id: string) => void
}

const PRIORITY_LABELS: Record<ProjectCardV2Props['priority'], string> = {
  LOW: 'Baixa',
  MEDIUM: 'Média',
  HIGH: 'Alta',
  URGENT: 'Urgente'
}

const PRIORITY_LEVELS: Record<ProjectCardV2Props['priority'], number> = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  URGENT: 3
}

const STATUS_CONFIGS: Record<ProjectCardV2Props['status'], { bg: string; dot: string; label: string; text: string; progressColor: string }> = {
  PLANNING: {
    bg: 'bg-yellow-100 border border-yellow-200',
    dot: 'bg-yellow-950',
    text: 'text-yellow-950',
    label: 'Planejado',
    progressColor: 'text-yellow-500'
  },
  IN_PROGRESS: {
    bg: 'bg-primary/50 text-secondary border border-primary',
    dot: 'bg-secondary',
    text: 'text-primary',
    label: 'Ativo',
    progressColor: 'text-primary'
  },
  WAITING_CLIENT: {
    bg: 'bg-amber-100 text-amber-700 border border-amber-100',
    dot: 'bg-amber-500',
    text: 'text-amber-700',
    label: 'Pendente',
    progressColor: 'text-amber-500'
  },
  REVIEW: {
    bg: 'bg-orange-100 text-orange-700 border border-orange-200',
    dot: 'bg-orange-950',
    text: 'text-orange-950',
    label: 'Revisão',
    progressColor: 'text-orange-500'
  },
  COMPLETED: {
    bg: 'bg-blue-100 text-blue-700 border border-blue-200',
    dot: 'bg-blue-950',
    text: 'text-blue-950',
    label: 'Concluído',
    progressColor: 'text-blue-500'
  },
  CANCELED: {
    bg: 'bg-red-100 text-red-700 border border-red-200',
    dot: 'bg-red-950',
    text: 'text-red-950',
    label: 'Cancelado',
    progressColor: 'text-red-500'
  }
}

export const ProjectCard = memo(function ProjectCard({
  id,
  name,
  description,
  status,
  priority,
  expected_delivery_date,
  client_name,
  area,
  estimated_hours,
  totalTasks: propTotalTasks,
  completedTasks: propCompletedTasks,
  onPress,
  onEdit,
  onChangeStatus,
  onDelete,
  onMarkCompleted
}: ProjectCardV2Props) {
  const isCompleted = status === 'COMPLETED'
  const priorityLabel = PRIORITY_LABELS[priority]
  const priorityLevel = PRIORITY_LEVELS[priority]
  const statusConfig = STATUS_CONFIGS[status]

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  // Get task stats from props (default to 0 if not provided)
  const total = propTotalTasks ?? 0
  const completed = propCompletedTasks ?? 0
  const stats = {
    total,
    completed,
    progress: total > 0 ? Math.round((completed / total) * 100) : 0
  }

  // Scope info text
  const scopeText = estimated_hours
    ? `${estimated_hours}h estimadas`
    : (area === 'MARKETING' ? 'Marketing' : 'Desenvolvimento')

  return (
    <div
      onClick={() => onPress?.(id)}
      className="bg-zinc-100 rounded-[24px] border border-zinc-200 p-5 transition-all duration-300 flex flex-col justify-between h-full group relative cursor-pointer"
    >
      <div className="flex flex-col gap-4">
        {/* Header: Folder Icon + Status Pill & Menu */}
        <div className="flex justify-between items-center">
          {/* Folder Icon wrapper */}
          <div className="p-2.5 bg-zinc-200 border border-zinc-300 rounded-[12px] text-zinc-700 w-10 h-10 flex items-center justify-center">
            <Folder className="size-5 stroke-[1.8]" />
          </div>

          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {/* Status Pill */}
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${statusConfig.bg} ${statusConfig.text}`}>
              <span className={`size-1.5 rounded-full ${statusConfig.dot}`} />
              {statusConfig.label}
            </span>

            {/* Menu */}
            <div className="relative" ref={menuRef}>
              <Button
                size="sm"
                className="size-7 min-w-7 bg-transparent hover:bg-zinc-100 border-none rounded-full p-0 flex items-center justify-center shrink-0"
                aria-label="Opções do projeto"
                onPress={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Ellipsis className="text-zinc-600" width={16} height={16} />
              </Button>

              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-[16px] shadow-lg border border-zinc-100 py-2 z-50 flex flex-col">
                  {!isCompleted && onMarkCompleted && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); onMarkCompleted(id); }}
                        className="w-full text-left px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 flex items-center gap-2 transition-colors cursor-pointer border-none bg-transparent font-medium"
                      >
                        <Check width={16} height={16} /> Concluir Projeto
                      </button>
                      <div className="h-[1px] bg-zinc-100 my-1 w-full" />
                    </>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); onEdit?.(id); }}
                    className="w-full text-left px-4 py-2 text-sm text-secondary hover:bg-zinc-50 flex items-center gap-2 transition-colors cursor-pointer border-none bg-transparent font-medium"
                  >
                    <PencilToLine width={16} /> Editar
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); onChangeStatus?.(id, status); }}
                    className="w-full text-left px-4 py-2 text-sm text-secondary hover:bg-zinc-50 flex items-center gap-2 transition-colors cursor-pointer border-none bg-transparent font-medium"
                  >
                    <Layers width={16} /> Mudar Status
                  </button>
                  <div className="h-[1px] bg-zinc-100 my-1 w-full" />
                  <button
                    onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); onDelete?.(id, name); }}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer font-medium border-none bg-transparent"
                  >
                    <TrashBin width={16} /> Excluir
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Title & Description */}
        <div className="flex flex-col min-w-0">
          <h4 className="font-semibold text-zinc-800 text-[18px] leading-snug group-hover:text-black transition-colors truncate">
            {name}
          </h4>
          <p className="text-zinc-600 text-sm leading-relaxed mt-1 line-clamp-2 min-h-[40px]">
            {description}
          </p>
        </div>

        {/* Client Row */}
        <div className="flex items-center gap-2 min-w-0">
          <User className="size-4 text-zinc-600 shrink-0" />
          <span className="text-xs font-semibold text-zinc-600 truncate">
            {client_name} <span className="text-zinc-600 mx-1 font-normal">•</span> {scopeText}
          </span>
        </div>

        {/* Date & Priority row */}
        <div className="flex items-center justify-between text-zinc-600">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600">
            <Flag className="size-4 text-zinc-600" />
            <span>{expected_delivery_date}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="flex items-end gap-0.5 h-3">
              <span className={`w-[3px] rounded-full transition-colors ${priorityLevel >= 1 ? 'bg-zinc-800 h-2' : 'bg-zinc-400 h-2'}`} />
              <span className={`w-[3px] rounded-full transition-colors ${priorityLevel >= 2 ? 'bg-zinc-800 h-3' : 'bg-zinc-400 h-3'}`} />
              <span className={`w-[3px] rounded-full transition-colors ${priorityLevel >= 3 ? 'bg-zinc-800 h-4' : 'bg-zinc-400 h-4'}`} />
            </div>
            <span className="text-zinc-800 font-semibold text-xs leading-none">{priorityLabel}</span>
          </div>
        </div>
      </div>

      {/* Progress & Task Section & Avatar */}
      <div className="flex flex-col">
        {/* Divider */}
        <div className="h-[1px] bg-zinc-100 my-4 w-full" />

        <div className="flex items-center justify-between">
          {/* Progress Ring & Stats */}
          <div className="flex items-center gap-2">
            {/* SVG progress circle */}
            <div className="relative flex items-center justify-center">
              <svg className="w-5 h-5 -rotate-90" viewBox="0 0 36 36">
                <circle
                  className="text-zinc-100"
                  strokeWidth="4.5"
                  stroke="currentColor"
                  fill="transparent"
                  r="15"
                  cx="18"
                  cy="18"
                />
                <circle
                  className={statusConfig.progressColor}
                  strokeWidth="4.5"
                  strokeDasharray="94.2"
                  strokeDashoffset={94.2 - (94.2 * stats.progress) / 100}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="15"
                  cx="18"
                  cy="18"
                />
              </svg>
            </div>
            <span className="text-zinc-800 font-semibold text-xs leading-none">{stats.progress}%</span>

            {/* Tasks count */}
            <div className="flex items-center gap-1.5 text-zinc-600 font-semibold text-xs ml-1 leading-none">
              <ListTodo className="size-4 text-zinc-600" />
              <span>{stats.completed}/{stats.total} Tasks</span>
            </div>
          </div>

          {/* User/Client Avatar */}
          <Avatar className="size-7 shrink-0 border border-white shadow-sm rounded-full">
            <Avatar.Image
              alt={client_name}
              src={`https://i.pravatar.cc/150?u=${client_name}`}
            />
            <Avatar.Fallback className="text-[10px] bg-zinc-100 text-zinc-700">{client_name.charAt(0)}</Avatar.Fallback>
          </Avatar>
        </div>
      </div>
    </div>
  )
})

export function ProjectCardSkeleton() {
  return (
    <div className="bg-white rounded-[24px] border border-zinc-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.015)] p-5 flex flex-col justify-between h-[280px] animate-pulse">
      <div className="flex flex-col gap-4">
        {/* Header skeleton */}
        <div className="flex justify-between items-center">
          <div className="size-10 bg-zinc-100 rounded-[12px]" />
          <div className="h-6 bg-zinc-100 rounded-full w-20" />
        </div>

        {/* Title skeleton */}
        <div className="flex flex-col gap-2 mt-2">
          <div className="h-5 bg-zinc-100 rounded w-3/4" />
          <div className="h-4 bg-zinc-100 rounded w-1/2" />
        </div>

        {/* Client row skeleton */}
        <div className="h-4 bg-zinc-100 rounded w-2/3 mt-2" />

        {/* Date & Priority skeleton */}
        <div className="flex justify-between items-center mt-2">
          <div className="h-4 bg-zinc-100 rounded w-1/3" />
          <div className="h-4 bg-zinc-100 rounded w-1/4" />
        </div>
      </div>

      <div className="flex flex-col">
        <div className="h-[1px] bg-zinc-100 my-4 w-full" />
        <div className="flex justify-between items-center">
          <div className="h-5 bg-zinc-100 rounded w-1/2" />
          <div className="size-7 bg-zinc-100 rounded-full" />
        </div>
      </div>
    </div>
  )
}
