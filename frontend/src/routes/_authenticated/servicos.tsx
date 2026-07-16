import { createFileRoute } from '@tanstack/react-router'
import { Select, SelectItem } from '../../components/ui/Select'
import { Plus, Layers } from '@gravity-ui/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchServices, createService, updateService, deleteService, fetchClients } from '../../services/api'
import type { Service, Client } from '../../services/types'
import { useState } from 'react'
import { Button } from '#/components/ui/Button'
import { ServiceModal } from '../../components/services/ServiceModal'
import { StatusBadge } from '../../components/ui/StatusBadge'

export const Route = createFileRoute('/_authenticated/servicos')({
  component: Servicos,
})

const SERVICE_STATUSES = [
  { key: 'PENDING', label: 'Pendente' },
  { key: 'IN_PROGRESS', label: 'Em Andamento' },
  { key: 'REVIEW', label: 'Em Revisão' },
  { key: 'COMPLETED', label: 'Concluído' },
  { key: 'CANCELED', label: 'Cancelado' },
]

const formatCurrency = (val: any) => {
  const num = parseFloat(val)
  if (isNaN(num)) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num)
}

function Servicos() {
  const queryClient = useQueryClient()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  const [selectedStatus, setSelectedStatus] = useState('ALL')
  const [selectedClient, setSelectedClient] = useState('ALL')

  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: () => fetchServices(),
  })

  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: fetchClients,
  })

  const filteredServices = services.filter((service) => {
    const matchesStatus = selectedStatus === 'ALL' || service.status === selectedStatus
    const matchesClient = selectedClient === 'ALL' || service.client_id === selectedClient
    return matchesStatus && matchesClient
  })

  const createMutation = useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      setIsModalOpen(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      setIsModalOpen(false)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      setIsModalOpen(false)
    },
  })

  const getErrorMessage = (err: any) => {
    if (!err) return null
    return Array.isArray(err.response?.data?.message)
      ? err.response.data.message.join(', ')
      : err.response?.data?.message || err.message
  }

  return (
    <div className="bg-white rounded-[24px] p-6 overflow-y-auto min-w-0 h-fit max-h-[calc(100vh-100px)] scrollbar-none flex flex-col gap-8">
      {/* Page Heading & Action */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 shrink-0">
        <h1 className="text-3xl font-medium tracking-tight text-secondary leading-none">
          Serviços Avulsos
        </h1>
        {/* Filters Bar */}
        <div className="flex gap-4 shrink-0 flex-wrap items-center">
          {/* Status Filter */}
          <Select
            ariaLabel="Filtrar por Status"
            selectedKey={selectedStatus}
            onSelectionChange={(key) => setSelectedStatus(key as string)}
            variant="zinc"
            triggerClassName="text-sm font-semibold w-fit py-2"
          >
            <SelectItem id="ALL" textValue="Todos os Status">
              Todos os Status
            </SelectItem>
            {SERVICE_STATUSES.map((s) => (
              <SelectItem key={s.key} id={s.key} textValue={s.label}>
                {s.label}
              </SelectItem>
            ))}
          </Select>

          {/* Client Filter */}
          <Select
            ariaLabel="Filtrar por Cliente"
            selectedKey={selectedClient}
            onSelectionChange={(key) => setSelectedClient(key as string)}
            variant="zinc"
            triggerClassName="text-sm font-semibold w-fit py-2"
          >
            <SelectItem id="ALL" textValue="Todos os Clientes">
              Todos os Clientes
            </SelectItem>
            {clients.map((c) => (
              <SelectItem key={c.id} id={c.id} textValue={c.name}>
                {c.name}
              </SelectItem>
            ))}
          </Select>

          <Button
            size="lg"
            onPress={() => {
              setSelectedService(null)
              setIsModalOpen(true)
            }}
          >
            <Plus className="stroke-[2.5]" width={16} height={16} />
            Novo Serviço
          </Button>
        </div>
      </div>

      {/* Services Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-zinc-50 border border-zinc-200 rounded-[24px] p-6 h-48 animate-pulse" />
          ))}
        </div>
      ) : filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              onClick={() => {
                setSelectedService(service)
                setIsModalOpen(true)
              }}
              className="bg-zinc-100 border border-zinc-200 rounded-[24px] p-6 transition-all duration-300 group flex flex-col gap-4 cursor-pointer hover:border-primary/40 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/0 group-hover:bg-backpage transition-colors" />
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                  {service.client?.name || 'Cliente Oculto'}
                </span>
                <h4 className="font-bold text-zinc-800 transition-colors line-clamp-2 text-base leading-snug">
                  {service.title}
                </h4>
              </div>

              <div className="flex flex-col gap-2">
                <StatusBadge status={service.status} className="w-fit" />
                {service.due_date && (
                  <span className="text-xs text-zinc-500 font-medium">
                    Prazo: {new Date(service.due_date).toLocaleDateString('pt-BR')}
                  </span>
                )}
                <div className="flex items-center justify-between pt-4 border-t border-zinc-100/80 mt-1">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-semibold text-zinc-800 tracking-wider mb-0.5">Valor</span>
                    <span className="text-sm font-bold text-zinc-800">{formatCurrency(service.value)}</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] uppercase font-semibold text-secondary tracking-wider mb-0.5">Recebido</span>
                    <span className="text-sm font-bold text-secondary">{formatCurrency(service.amount_received)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-secondary/50 font-medium bg-zinc-50 border border-dashed border-zinc-200 rounded-[20px] flex flex-col items-center justify-center gap-4">
          <Layers className="size-10 text-zinc-300" />
          <span>Nenhum serviço avulso encontrado para os filtros selecionados.</span>
        </div>
      )}

      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => {
          if (selectedService) {
            updateMutation.mutate({ id: selectedService.id, data })
          } else {
            createMutation.mutate(data)
          }
        }}
        onDelete={(id) => deleteMutation.mutate(id)}
        service={selectedService}
        isPending={createMutation.isPending || updateMutation.isPending || deleteMutation.isPending}
        error={getErrorMessage(createMutation.error || updateMutation.error || deleteMutation.error)}
      />
    </div>
  )
}
