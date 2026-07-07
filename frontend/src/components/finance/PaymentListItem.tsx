import { memo, useCallback } from 'react'
import { Avatar, Button } from '@heroui/react'
import { Comment } from '@gravity-ui/icons'

interface PaymentListItemProps {
  name: string
  email: string
  avatarUrl?: string
  onAction?: (name: string) => void
}

export const PaymentListItem = memo(function PaymentListItem({
  name,
  email,
  avatarUrl = 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg',
  onAction
}: PaymentListItemProps) {
  const handleActionClick = useCallback(() => {
    onAction?.(name)
  }, [onAction, name])

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 min-w-0">
        <Avatar className="size-9 shrink-0">
          <Avatar.Image
            alt={name}
            src={avatarUrl}
          />
          <Avatar.Fallback>{name.substring(0, 2).toUpperCase()}</Avatar.Fallback>
        </Avatar>
        <div className="min-w-0">
          <p className="font-bold text-[13px] leading-none text-zinc-700 truncate">{name}</p>
          <p className="text-[11px] opacity-70 font-semibold leading-none mt-1 text-zinc-700 text-ellipsis overflow-hidden whitespace-nowrap max-w-[110px]">
            {email}
          </p>
        </div>
      </div>
      <Button
        className="w-8 h-8 min-w-8 p-0 rounded-lg hover:bg-secondary/5 flex items-center justify-center cursor-pointer text-secondary/70 hover:text-secondary shrink-0 border-none bg-transparent"
        onClick={handleActionClick}
        aria-label={`Comentar sobre o pagamento de ${name}`}
      >
        <Comment width={16} height={16} />
      </Button>
    </div>
  )
})

export function PaymentListItemSkeleton() {
  return (
    <div className="flex items-center justify-between animate-pulse">
      <div className="flex items-center gap-3 min-w-0">
        <div className="size-9 rounded-full bg-secondary/10 shrink-0" />
        <div className="space-y-1 min-w-0">
          <div className="h-3.5 bg-secondary/10 rounded w-20" />
          <div className="h-2.5 bg-secondary/10 rounded w-28" />
        </div>
      </div>
      <div className="w-8 h-8 rounded-lg bg-secondary/10 shrink-0" />
    </div>
  )
}
