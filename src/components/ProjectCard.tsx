import { memo } from 'react'
import { Avatar, Button } from '@heroui/react'
import { EllipsisVertical, Calendar, CircleExclamationFill, TriangleExclamationFill, CircleFill } from '@gravity-ui/icons'

interface ProjectCardProps {
  id: string
  name: string
  description: string
  status: 'PLANNING' | 'IN_PROGRESS' | 'WAITING_CLIENT' | 'REVIEW' | 'COMPLETED' | 'CANCELED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  expected_delivery_date: string
  client_name: string
  client_email: string
}

const PRIORITY_LABELS: Record<ProjectCardProps['priority'], string> = {
  LOW: 'baixa',
  MEDIUM: 'média',
  HIGH: 'alta',
  URGENT: 'urgente'
}

export const ProjectCard = memo(function ProjectCard({
  name,
  description,
  status,
  priority,
  expected_delivery_date,
  client_name,
  client_email
}: ProjectCardProps) {
  const isCompleted = status === 'COMPLETED'
  const priorityLabel = PRIORITY_LABELS[priority]

  return (
    <div
      className={`rounded-[20px] p-5 flex flex-col gap-3 transition-all hover:shadow-md ${
        isCompleted ? 'bg-primary/50' : 'bg-zinc-100'
      }`}
    >
      {/* Header: Title + Menu */}
      <div className="flex justify-between items-start gap-2">
        <div className="flex flex-col gap-1 min-w-0">
          <h4 className="font-semibold text-secondary text-[15px] leading-tight truncate">
            {name}
          </h4>
          <p className="text-secondary/60 text-[13px] leading-tight truncate">
            {description}
          </p>
        </div>
        <Button
          size="sm"
          className="size-7 min-w-7 bg-transparent hover:bg-secondary/5 border-none rounded-full p-0 flex items-center justify-center shrink-0"
          aria-label="Opções do projeto"
        >
          <EllipsisVertical className="text-secondary/60" width={16} height={16} />
        </Button>
      </div>

      {/* Tags de status e prioridade */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="flex items-center gap-1 text-[12px] font-medium text-secondary bg-white/60 rounded-full px-2.5 py-1">
          <CircleFill className="text-secondary/70" width={10} height={10} />
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
              <span className="flex items-center gap-1 text-[12px] font-medium text-red-700 bg-red-100 rounded-full px-2.5 py-1">
                <CircleExclamationFill className="text-red-600" width={12} height={12} />
                urgente
              </span>
            );
          } else if (diffDays <= 20) {
            return (
              <span className="flex items-center gap-1 text-[12px] font-medium text-orange-700 bg-orange-100 rounded-full px-2.5 py-1">
                <TriangleExclamationFill className="text-orange-600" width={12} height={12} />
                atenção
              </span>
            );
          }
          return null;
        })()}
      </div>

      {/* Footer: Client + Due Date */}
      <div className="flex items-center justify-between gap-2">
        {/* Client Info */}
        <div className="flex items-center gap-2 min-w-0">
          <Avatar className="size-7 shrink-0">
            <Avatar.Image
              alt={client_name}
              src={`https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/${isCompleted ? 'blue' : client_name.length % 2 === 0 ? 'orange' : 'blue'}.jpg`}
            />
            <Avatar.Fallback>{client_name.charAt(0)}</Avatar.Fallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-[12px] font-semibold text-secondary leading-tight truncate">
              {client_name}
            </span>
            <span className="text-[11px] text-secondary/60 leading-tight truncate">
              {client_email}
            </span>
          </div>
        </div>

        {/* Due Date */}
        <div className="flex items-center gap-1 shrink-0">
          <Calendar className="text-secondary/50" width={12} height={12} />
          <span className="text-[11px] text-secondary/60 font-medium whitespace-nowrap">
            Due Date {expected_delivery_date}
          </span>
        </div>
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
