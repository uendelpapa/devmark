import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Plus, Magnifier } from '@gravity-ui/icons'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Select, SelectItem } from '../../components/ui/Select'
import { Input } from '../../components/ui/Input'
import { fetchClients, updateClient, deleteClient } from '../../services/api'
import { ClientCard } from '../../components/clients/ClientCard'
import { EditClientModal } from '../../components/clients/EditClientModal'
import { Button } from '#/components/ui/Button'

export const Route = createFileRoute('/_authenticated/clientes')({
  component: Clientes
})

function Clientes() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients
  })
  const [filter, setFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [editingClient, setEditingClient] = useState<any | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const { mutate: handleUpdateClient, isPending: isUpdatingClient, error: updateError } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateClient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      setIsEditModalOpen(false)
      setEditingClient(null)
    }
  })

  const { mutate: handleDeleteClient, isPending: isDeletingClient, error: deleteError } = useMutation({
    mutationFn: (id: string) => deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      setIsEditModalOpen(false)
      setEditingClient(null)
    }
  })

  const getErrorMessage = (err: any) => {
    if (!err) return null
    return Array.isArray(err.response?.data?.message)
      ? err.response.data.message.join(', ')
      : err.response?.data?.message || err.message
  }

  const filteredClients = clients.filter((client) => {
    if (filter === 'pending' && !client.hasPendingPayment) return false
    if (filter === 'paid' && client.hasPendingPayment) return false
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase()
      if (!client.name.toLowerCase().includes(q) && !client.email.toLowerCase().includes(q)) {
        return false
      }
    }
    return true
  })

  return (
    <div className="bg-white rounded-[24px] p-6 overflow-y-auto min-w-0 h-fit max-h-[calc(100vh-100px)] scrollbar-none flex flex-col gap-8">
      {/* Top Header & Actions */}
      <div className="flex justify-between items-center shrink-0">
        <h1 className="text-3xl font-medium tracking-tight text-secondary leading-none">
          Clientes
        </h1>

        <div className="flex items-center gap-3">
          {/* Search Input */}
          <Input
            placeholder="Pesquisar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Pesquisar clientes"
            icon={<Magnifier className="text-zinc-500 size-4 mr-1" />}
            className="w-64 shrink-0"
            variant="zinc"
          />

          {/* Custom Select for Filter using HeroUI Select */}
          <Select
            selectedKey={filter}
            onSelectionChange={(key) => setFilter(key as string)}
            ariaLabel="Filtrar clientes"
            variant="zinc"
          >
            <SelectItem id="all" textValue="Filtro: Todos">
              Filtro: Todos
            </SelectItem>
            <SelectItem id="pending" textValue="Com pendências">
              Com pendências
            </SelectItem>
            <SelectItem id="paid" textValue="Sem pendências">
              Sem pendências
            </SelectItem>
          </Select>

          {/* Add Client Button using HeroUI Button */}
          <Button
            onPress={() => navigate({ to: '/clientes/novo' })}
          >
            <Plus className="size-4" />
            Novo Cliente
          </Button>
        </div>
      </div>

      {/* Clients Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 flex-1 min-h-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-zinc-100 rounded-[24px] h-[88px] w-full" />
          ))}
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm">
          {searchQuery ? 'Nenhum cliente encontrado para essa busca.' : 'Nenhum cliente encontrado.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto scrollbar-none pb-4">
          {filteredClients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onEdit={(c) => {
                setEditingClient(c)
                setIsEditModalOpen(true)
              }}
            />
          ))}
        </div>
      )}

      <EditClientModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingClient(null)
        }}
        onSubmit={(id, data) => handleUpdateClient({ id, data })}
        onDelete={(id) => handleDeleteClient(id)}
        client={editingClient}
        isPending={isUpdatingClient || isDeletingClient}
        error={getErrorMessage(updateError || deleteError)}
      />
    </div>
  )
}
