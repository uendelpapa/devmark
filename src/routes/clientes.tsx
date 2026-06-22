import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Plus } from '@gravity-ui/icons'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button, Select, ListBox } from '@heroui/react'
import { fetchClients } from '../services/api'
import { ClientCard } from '../components/clientes/ClientCard'

export const Route = createFileRoute('/clientes')({
  component: Clientes
})

function Clientes() {
  const navigate = useNavigate()
  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients
  })
  const [filter, setFilter] = useState<string>('all')

  const filteredClients = clients.filter((client) => {
    if (filter === 'pending') return client.hasPendingPayment
    if (filter === 'paid') return !client.hasPendingPayment
    return true
  })

  return (
    <div className="bg-white rounded-[24px] p-6 overflow-y-auto min-w-0 h-fit max-h-[calc(100vh-100px)] scrollbar-none flex flex-col gap-4">
      {/* Top Header & Actions */}
      <div className="flex justify-between items-center shrink-0">
        <h1 className="text-3xl font-medium tracking-tight text-secondary leading-none">
          Clientes
        </h1>

        <div className="flex items-center gap-3">
          {/* Custom Select for Filter using HeroUI Select */}
          <Select
            selectedKey={filter}
            onSelectionChange={(key) => setFilter(key as string)}
            className="w-[256px] h-[36px] shrink-0 rounded-[12px]"
            aria-label="Filtrar clientes"
          >
            <Select.Trigger className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-full pl-5 pr-10 h-10 text-[14px] border-none outline-none cursor-pointer flex items-center justify-between transition-colors shadow-none select-none">
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                <ListBox.Item id="all" textValue="Filtro: Todos">
                  Filtro: Todos
                </ListBox.Item>
                <ListBox.Item id="pending" textValue="Com pendências">
                  Com pendências
                </ListBox.Item>
                <ListBox.Item id="paid" textValue="Sem pendências">
                  Sem pendências
                </ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>

          {/* Add Client Button using HeroUI Button */}
          <Button
            onPress={() => navigate({ to: '/clientes/novo' })}
            className="bg-primary/50 hover:bg-primary text-secondary font-bold rounded-full px-5 h-10 border-none text-[14px] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus className="size-4" />
            Novo Cliente
          </Button>
        </div>
      </div>

      {/* Clients Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 flex-1 min-h-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-zinc-100 rounded-[24px] h-[88px] w-full" />
          ))}
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 py-12">
          <span className="text-zinc-400 text-lg font-medium">Nenhum cliente encontrado.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 overflow-y-auto scrollbar-none pb-4">
          {filteredClients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      )}
    </div>
  )
}
