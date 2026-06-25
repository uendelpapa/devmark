import type { ClientWithPaymentStatus } from '../../services/api'
import { Ellipsis, Clock, CircleInfo } from '@gravity-ui/icons'
import { Card, Button, Avatar } from '@heroui/react'

interface ClientCardProps {
  client: ClientWithPaymentStatus
  onEdit?: (client: ClientWithPaymentStatus) => void
}

export function ClientCard({ client, onEdit }: ClientCardProps) {
  return (
    <Card className="flex flex-row items-center justify-between p-4 bg-zinc-100 hover:bg-zinc-200/60 rounded-[16px] border-none shadow-none transition-colors group text-secondary">
      <div className="flex items-center gap-2 min-w-0">
        {/* Avatar with custom zinc gradient */}
        <Avatar className="size-8 shrink-0">
          <Avatar.Image
            alt={client.name}
            src={`https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/${client.name.length % 2 === 0 ? 'orange' : 'blue'}.jpg`}
          />
          <Avatar.Fallback>{client.name.charAt(0)}</Avatar.Fallback>
        </Avatar>

        {/* Client details */}
        <div className="flex flex-1 flex-col min-w-0 max-w-32">
          <span className="text-xs text-zinc-800 truncate leading-tight">
            {client.name}
          </span>
          <span className="text-xs text-zinc-800 truncate">
            {client.email}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Payment Status Badge */}
        {client.hasPendingPayment ? (
          <span className="bg-[#EAB308] text-white px-1.5 py-0.5 rounded-full w-fit items-center justify-center font-medium">
            <span className="flex items-center gap-1.5 text-xs">
              <Clock className="size-3" />
              Pagamento pendênte
            </span>
          </span>
        ) : (
          <span className="bg-zinc-400 text-white px-2.5 py-0.5 rounded-full inline-flex items-center justify-center font-medium">
            <span className="flex items-center gap-1.5 text-xs">
              <CircleInfo className="size-3" />
              Sem pendências
            </span>
          </span>
        )}

        {/* Action button using HeroUI Button */}
        <Button
          isIconOnly
          size="sm"
          onPress={() => onEdit?.(client)}
          className="text-zinc-400 hover:text-zinc-700 bg-transparent hover:bg-zinc-200 size-6 rounded-full cursor-pointer transition-colors border-none p-0 flex items-center justify-center"
        >
          <Ellipsis className="size-4" />
        </Button>
      </div>
    </Card>
  )
}
