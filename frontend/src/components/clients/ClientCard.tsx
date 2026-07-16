import type { ClientWithPaymentStatus } from '../../services/api'
import { Ellipsis, Clock, CircleInfo } from '@gravity-ui/icons'
import { Card, Button, Avatar } from '@heroui/react'
import { useNavigate } from '@tanstack/react-router'
import { StatusBadge } from '../ui/StatusBadge'

interface ClientCardProps {
  client: ClientWithPaymentStatus
  onEdit?: (client: ClientWithPaymentStatus) => void
}

export function ClientCard({ client, onEdit }: ClientCardProps) {
  const navigate = useNavigate()

  return (
    <Card
      onClick={() => navigate({ to: '/clientes/$clientId', params: { clientId: client.id } })}
      className="relative overflow-hidden flex flex-row items-center justify-between gap-3 p-4 bg-zinc-100 hover:bg-zinc-200 rounded-[16px] border border-zinc-200 shadow-none duration-300 ease-in-out transition-colors group text-zinc-800 cursor-pointer"
    >
      <div className="flex flex-1 items-center gap-2 min-w-0">
        <Avatar className="size-8 shrink-0">
          <Avatar.Image
            alt={client.name}
            src={`https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/${client.name.length % 2 === 0 ? 'orange' : 'blue'}.jpg`}
          />
          <Avatar.Fallback>{client.name.charAt(0)}</Avatar.Fallback>
        </Avatar>

        <div className="flex flex-col items-start flex-1 min-w-0">
          <span className="w-full text-xs text-zinc-800 font-medium truncate">
            {client.name}
          </span>
          <span className="w-full text-xs text-zinc-400 truncate">
            {client.email}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Payment Status Badge */}
        {client.hasPendingPayment ? (
          <StatusBadge status="PENDING" label="Pagamento pendente">
            <Clock className="size-3 shrink-0" />
            Pagamento pendente
          </StatusBadge>
        ) : (
          <StatusBadge status="PAID" label="Sem pendências">
            <CircleInfo className="size-3 shrink-0" />
            Sem pendências
          </StatusBadge>
        )}

        {/* Action button using HeroUI Button */}
        <Button
          isIconOnly
          size="sm"
          onPress={() => onEdit?.(client)}
          onClick={(e) => e.stopPropagation()}
          className="text-zinc-400 hover:text-zinc-700 bg-transparent hover:bg-zinc-200 size-6 shrink-0 rounded-full cursor-pointer transition-colors border-none p-0 flex items-center justify-center"
        >
          <Ellipsis className="size-4 shrink-0" />
        </Button>
      </div>
    </Card>
  )
}
