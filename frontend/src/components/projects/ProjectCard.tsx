import { memo, useState, useRef, useEffect } from 'react'
import { Avatar, Button } from '@heroui/react'
import { Ellipsis, PencilToLine, Layers, TrashBin, Check } from '@gravity-ui/icons'

interface ProjectCardProps {
  id: string
  name: string
  description: string
  status: 'PLANNING' | 'IN_PROGRESS' | 'WAITING_CLIENT' | 'REVIEW' | 'COMPLETED' | 'CANCELED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  expected_delivery_date: string
  client_name: string
  client_email: string
  onPress?: (id: string) => void
  onEdit?: (id: string) => void
  onChangeStatus?: (id: string, currentStatus: string) => void
  onDelete?: (id: string, name: string) => void
  onMarkCompleted?: (id: string) => void
}

const PRIORITY_LABELS: Record<ProjectCardProps['priority'], string> = {
  LOW: 'Baixa',
  MEDIUM: 'Média',
  HIGH: 'Alta',
  URGENT: 'Urgente'
}

const STATUS_LABELS: Record<ProjectCardProps['status'], string> = {
  PLANNING: 'Planejamento',
  IN_PROGRESS: 'Em Andamento',
  WAITING_CLIENT: 'Aguardando Cliente',
  REVIEW: 'Revisão',
  COMPLETED: 'Concluído',
  CANCELED: 'Cancelado'
}

const STATUS_STYLES: Record<ProjectCardProps['status'], string> = {
  PLANNING: 'bg-blue-200 text-zinc-900',
  IN_PROGRESS: 'bg-amber-200 text-zinc-900',
  WAITING_CLIENT: 'bg-purple-200 text-zinc-900',
  REVIEW: 'bg-indigo-200 text-zinc-900',
  COMPLETED: 'bg-emerald-200 text-zinc-900',
  CANCELED: 'bg-rose-200 text-zinc-900'
}

const PRIORITY_STYLES: Record<ProjectCardProps['priority'], string> = {
  LOW: 'bg-zinc-200 text-zinc-900',
  MEDIUM: 'bg-sky-200 text-zinc-900',
  HIGH: 'bg-orange-200 text-zinc-900',
  URGENT: 'bg-red-200 text-zinc-900'
}

export const ProjectCard = memo(function ProjectCard({
  id,
  name,
  description,
  status,
  priority,
  expected_delivery_date,
  client_name,
  client_email,
  onPress,
  onEdit,
  onChangeStatus,
  onDelete,
  onMarkCompleted
}: ProjectCardProps) {
  const isCompleted = status === 'COMPLETED'
  const priorityLabel = PRIORITY_LABELS[priority]
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

  return (
    <div
      onClick={() => onPress?.(id)}
      className={`rounded-[16px] p-4 flex flex-col gap-6 transition-all cursor-pointer duration-300 ease-in-out ${isCompleted ? 'bg-primary/50 hover:bg-primary' : 'bg-zinc-100 hover:bg-zinc-200'
        }`}
    >
      {/* Header: Title + Menu */}
      <div className="flex justify-between items-start gap-2">
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <h4 className="font-semibold text-secondary text-lg leading-tight truncate">
            {name}
          </h4>
          <p className="text-secondary/60 text-sm leading-tight truncate">
            {description}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <div
            className="relative"
            ref={menuRef}
          >
            <Button
              size="sm"
              className="size-7 min-w-7 bg-transparent hover:bg-secondary/5 border-none rounded-full p-0 flex items-center justify-center shrink-0"
              aria-label="Opções do projeto"
              onPress={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Ellipsis className="text-zinc-700" width={16} height={16} />
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

      {/* Tags de status e prioridade */}
      <div className="flex flex-wrap items-center gap-1.5">
        {/* Status Tag */}
        <span className={`text-[11px] font-semibold rounded-full px-2 py-1 ${STATUS_STYLES[status]}`}>
          {STATUS_LABELS[status]}
        </span>

        {/* Priority Tag */}
        <span className={`text-[11px] font-semibold rounded-full px-2 py-0.5 ${PRIORITY_STYLES[priority]}`}>
          {priorityLabel}
        </span>

        {(() => {
          if (isCompleted || !expected_delivery_date) return null;

          const [day, month] = expected_delivery_date.split('/');
          if (!day || !month) return null;

          const deliveryDate = new Date(new Date().getFullYear(), parseInt(month, 10) - 1, parseInt(day, 10));
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const diffTime = deliveryDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays <= 3) {
            return (
              <span className="text-[10px] font-semibold text-zinc-700 bg-red-100/60 rounded-full px-2 py-0.5">
                urgente
              </span>
            );
          } else if (diffDays <= 20) {
            return (
              <span className="text-[10px] font-semibold text-zinc-700 bg-orange-100/60 rounded-full px-2 py-0.5">
                atenção
              </span>
            );
          }
          return null;
        })()}
      </div>

      {/* Footer: Client + Due Date */}
      <div className="flex items-end justify-between gap-2">
        {/* Client Info */}
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="size-7 shrink-0">
            <Avatar.Image
              alt={client_name}
              src={`https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/${isCompleted ? 'blue' : client_name.length % 2 === 0 ? 'orange' : 'blue'}.jpg`}
            />
            <Avatar.Fallback>{client_name.charAt(0)}</Avatar.Fallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-xs text-secondary leading-tight truncate">
              {client_name}
            </span>
            <span className="text-xs text-secondary/50 leading-tight truncate">
              {client_email}
            </span>
          </div>
        </div>

        {/* Due Date */}
        {/* <div className="flex items-center gap-1 shrink-0">
          <Calendar className="text-secondary size-4" />
          <span className="text-xs text-secondary font-medium whitespace-nowrap">
            Due Date {expected_delivery_date}
          </span>
        </div> */}
      </div>
    </div>
  )
})

export function ProjectCardSkeleton() {
  return (
    <div className="rounded-[20px] p-5 bg-zinc-100 flex flex-col gap-3 animate-pulse">
      {/* Header skeleton */}
      <div className="flex justify-between items-start gap-2">
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="h-4 bg-secondary/10 rounded w-3/4" />
          <div className="h-3 bg-secondary/10 rounded w-1/2" />
        </div>
        <div className="size-7 bg-secondary/10 rounded-full" />
      </div>

      {/* Priority badge skeleton */}
      <div className="h-6 bg-secondary/10 rounded-full w-20" />

      {/* Footer skeleton */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="size-7 bg-secondary/10 rounded-full" />
          <div className="flex flex-col gap-1">
            <div className="h-3 bg-secondary/10 rounded w-16" />
            <div className="h-2.5 bg-secondary/10 rounded w-24" />
          </div>
        </div>
        <div className="h-3 bg-secondary/10 rounded w-28" />
      </div>
    </div>
  )
}
