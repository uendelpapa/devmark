import { memo, useCallback } from 'react'
import { Avatar, Button } from '@heroui/react'
import { FolderArrowRight } from '@gravity-ui/icons'

interface ProjectListItemProps {
  name: string
  date: string
  avatarUrl?: string
  onAction?: (name: string) => void
}

export const ProjectListItem = memo(function ProjectListItem({
  name,
  date,
  avatarUrl = 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg',
  onAction
}: ProjectListItemProps) {
  const handleActionClick = useCallback(() => {
    onAction?.(name)
  }, [onAction, name])

  return (
    <div className="flex items-center justify-between py-1 border-b border-secondary/5 last:border-0">
      <div className="flex items-center gap-3">
        <Avatar className="size-9 shrink-0">
          <Avatar.Image
            alt={name}
            src={avatarUrl}
          />
          <Avatar.Fallback>{name.substring(0, 2).toUpperCase()}</Avatar.Fallback>
        </Avatar>
        <div className="min-w-0">
          <p className="font-bold text-[14px] leading-tight text-secondary truncate">{name}</p>
          <p className="text-[12px] opacity-75 font-semibold mt-0.5 text-secondary leading-none">Entregar {date}</p>
        </div>
      </div>
      <Button
        className="w-8 h-8 min-w-8 p-0 rounded-lg hover:bg-secondary/5 flex items-center justify-center cursor-pointer text-secondary/80 hover:text-secondary border-none bg-transparent shrink-0"
        onClick={handleActionClick}
        aria-label={`Visualizar detalhes do projeto ${name}`}
      >
        <FolderArrowRight width={16} height={16} />
      </Button>
    </div>
  )
})

export function ProjectListItemSkeleton() {
  return (
    <div className="flex items-center justify-between py-1 border-b border-secondary/5 last:border-0 animate-pulse">
      <div className="flex items-center gap-3 min-w-0">
        <div className="size-9 rounded-full bg-secondary/10 shrink-0" />
        <div className="space-y-1 min-w-0">
          <div className="h-3.5 bg-secondary/10 rounded w-24" />
          <div className="h-2.5 bg-secondary/10 rounded w-16" />
        </div>
      </div>
      <div className="w-8 h-8 rounded-lg bg-secondary/10 shrink-0" />
    </div>
  )
}
