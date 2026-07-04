import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { ChevronLeft, EnvelopeOpen, CircleInfo, Briefcase, CircleDollar, Layers, Pencil } from '@gravity-ui/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchClient, updateClient } from '../../services/api'
import { useState } from 'react'
import { EditClientModal } from '../../components/clients/EditClientModal'
import { Button } from '#/components/ui/Button'

export const Route = createFileRoute('/_authenticated/clientes_/$clientId')({
  component: ClientDetailsPage
})

const formatCurrency = (val: any) => {
  const num = parseFloat(val)
  if (isNaN(num)) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num)
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'ACTIVE': return <div className="bg-primary/40 text-secondary px-2 py-1 rounded-full text-xs font-semibold">Ativo</div>
    case 'LEAD': return <div className="bg-blue-500/10 text-blue-600 px-2 py-1 rounded-full text-xs font-semibold">Lead</div>
    case 'NEGOTIATING': return <div className="bg-amber-500/10 text-amber-600 px-2 py-1 rounded-full text-xs font-semibold">Em Negociação</div>
    case 'INACTIVE': return <div className="bg-zinc-500/10 text-zinc-600 px-2 py-1 rounded-full text-xs font-semibold">Inativo</div>
    case 'LOST': return <div className="bg-red-500/10 text-red-600 px-2 py-1 rounded-full text-xs font-semibold">Perdido</div>
    default: return null
  }
}

const getProjectStatusInfo = (status: string) => {
  switch (status) {
    case 'PLANNING':
      return { label: 'Planejamento', bg: 'bg-blue-200 text-blue-900' }
    case 'IN_PROGRESS':
      return { label: 'Em Andamento', bg: 'bg-amber-200 text-amber-900' }
    case 'WAITING_CLIENT':
      return { label: 'Aguardando Cliente', bg: 'bg-purple-200 text-purple-900' }
    case 'REVIEW':
      return { label: 'Em Revisão', bg: 'bg-indigo-200 text-indigo-900' }
    case 'COMPLETED':
      return { label: 'Concluído', bg: 'bg-primary/50 text-secondary' }
    case 'CANCELED':
      return { label: 'Cancelado', bg: 'bg-rose-200 text-rose-900' }
    default:
      return { label: status, bg: 'bg-zinc-200 text-zinc-900' }
  }
}

function ClientDetailsPage() {
  const { clientId } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: client, isLoading } = useQuery({
    queryKey: ['client', clientId],
    queryFn: () => fetchClient(clientId)
  })

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const { mutate: handleUpdateClient, isPending: isUpdatingClient, error: updateError } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateClient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client', clientId] })
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      setIsEditModalOpen(false)
    }
  })

  if (isLoading) {
    return (
      <div className="bg-white rounded-[24px] p-6 h-fit min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="bg-white rounded-[24px] p-6 h-fit flex flex-col items-center justify-center gap-4 min-h-[400px]">
        <h2 className="text-xl font-medium text-secondary">Cliente não encontrado</h2>
        <Button onPress={() => navigate({ to: '/clientes' })} className="bg-zinc-100">Voltar</Button>
      </div>
    )
  }

  const getErrorMessage = (err: any) => {
    if (!err) return null
    return Array.isArray(err.response?.data?.message)
      ? err.response.data.message.join(', ')
      : err.response?.data?.message || err.message
  }

  const totalProjectValue = client.projects.reduce((acc, p) => acc + (parseFloat(p.project_value as any) || 0), 0)
  const totalReceived = client.projects.reduce((acc, p) => acc + (parseFloat(p.amount_received as any) || 0), 0)
  const totalPending = totalProjectValue - totalReceived

  const isPendingZero = totalPending <= 0

  return (
    <div className="bg-white rounded-[24px] p-6 overflow-y-auto min-w-0 h-fit max-h-[calc(100vh-100px)] scrollbar-none flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div className="flex items-start sm:items-center gap-4">
          <Button
            onClick={() => window.history.back()}
            size='lg'
            variant='onlyIcon'
          >
            <ChevronLeft className='size-4' />
          </Button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-secondary leading-none">
                {client.name}
              </h1>
              {getStatusBadge(client.status)}
            </div>
            {client.company_name && (
              <span className="text-sm font-medium text-zinc-500 mt-1">{client.company_name}</span>
            )}
          </div>
        </div>

        <Button
          onPress={() => setIsEditModalOpen(true)}
          variant='primary'
        >
          <Pencil />
          Editar Cliente
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info Card */}
        <div className="lg:col-span-1 bg-zinc-100 border border-zinc-200 rounded-[24px] p-6 flex flex-col gap-6">
          <h3 className="font-medium text-sm text-zinc-600 mb-1">Informações do Cliente</h3>

          <div className="flex items-center gap-4">
            <div className="size-11 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-500 shrink-0">
              <EnvelopeOpen className="size-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-zinc-600">E-mail</span>
              <span className="text-sm font-medium text-secondary truncate">{client.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="size-11 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-500 shrink-0">
              <Briefcase className="size-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-zinc-600">Documento (CPF/CNPJ)</span>
              <span className="text-sm font-medium text-secondary truncate">{client.document || 'Não informado'}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="size-11 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-500 shrink-0">
              <CircleInfo className="size-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-zinc-600">Telefone</span>
              <span className="text-sm font-medium text-secondary truncate">{client.phone || 'Não informado'}</span>
            </div>
          </div>
        </div>

        {/* Finance Summary */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="bg-zinc-100 h-36 transition-colors rounded-[24px] p-6 border border-zinc-200 flex flex-col justify-center gap-1 cursor-default">
            <div className="flex items-center gap-2 text-zinc-600 mb-1">
              <Layers className="size-4" />
              <span className="text-sm font-medium">Projetos Ativos</span>
            </div>
            <span className="text-4xl font-extrabold text-zinc-800 tracking-tight">{client.projects.length}</span>
          </div>

          <div className="bg-primary/50 h-36 transition-colors rounded-[24px] p-6 border border-primary flex flex-col justify-center gap-1 cursor-default">
            <div className="flex items-center gap-2 text-secondary mb-1">
              <CircleDollar className="size-4" />
              <span className="text-sm font-medium">Valor Recebido</span>
            </div>
            <span className="text-3xl font-extrabold text-secondary truncate">{formatCurrency(totalReceived)}</span>
            <div className="mt-3 w-full bg-secondary/40 h-2 rounded-full overflow-hidden">
              <div
                className="bg-secondary h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${totalProjectValue > 0 ? Math.min((totalReceived / totalProjectValue) * 100, 100) : 0}%` }}
              />
            </div>
          </div>

          <div className={`transition-colors h-36 rounded-[24px] p-6 border flex flex-col justify-center gap-1 cursor-default ${isPendingZero ? 'bg-zinc-50 border-zinc-200' : 'bg-amber-100 border-amber-200'}`}>
            <div className={`flex items-center gap-2 mb-1 ${isPendingZero ? 'text-zinc-500' : 'text-amber-950'}`}>
              <CircleDollar className="size-4" />
              <span className="text-sm font-medium">Valor Pendente</span>
            </div>
            <span className={`text-3xl font-extrabold tracking-tight truncate ${isPendingZero ? 'text-zinc-400' : 'text-amber-950'}`}>
              {formatCurrency(isPendingZero ? 0 : totalPending)}
            </span>
            {isPendingZero && (
              <span className="text-xs font-medium text-zinc-400 mt-2 flex items-center gap-1">
                Tudo certo por aqui
              </span>
            )}
          </div>
          <div className="bg-zinc-100 h-36 transition-colors rounded-[24px] p-6 border border-zinc-200 flex flex-col justify-center gap-1 cursor-default">
            <div className="flex items-center gap-2 text-zinc-600 mb-1">
              <CircleDollar className="size-4" />
              <span className="text-sm font-medium">Total Acumulado</span>
            </div>
            <span className="text-3xl font-extrabold text-zinc-800 tracking-tight truncate">
              {formatCurrency(totalProjectValue)}
            </span>
            <span className="text-xs font-medium text-zinc-500 mt-2 flex items-center gap-1">
              Soma de todos os projetos
            </span>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="flex flex-col gap-5 mt-2">
        <h3 className="text-xl font-bold text-secondary tracking-tight">Projetos do Cliente</h3>

        {client.projects.length === 0 ? (
          <div className="bg-zinc-50 border border-zinc-200 border-dashed rounded-[24px] p-12 flex flex-col items-center justify-center text-center">
            <Layers className="size-10 text-zinc-300 mb-4" />
            <span className="text-zinc-600 font-semibold text-lg">Nenhum projeto encontrado</span>
            <span className="text-zinc-400 text-sm mt-1 max-w-sm">Este cliente ainda não tem projetos associados. Inicie um novo projeto para começar.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {client.projects.map(project => (
              <Link
                key={project.id}
                to="/projetos/$projectId"
                params={{ projectId: project.id }}
                className="bg-zinc-100 rounded-[24px] p-6 hover:border-backpage transition-all duration-300 group flex flex-col gap-4 cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-primary/0 group-hover:bg-backpage transition-colors" />
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-zinc-800 transition-colors line-clamp-2 text-base leading-snug">{project.name}</h4>
                </div>

                <div className="flex flex-col gap-2">
                  <div className={`text-xs font-semibold tracking-wider px-2.5 py-1 rounded-full w-fit ${getProjectStatusInfo(project.status).bg}`}>
                    {getProjectStatusInfo(project.status).label}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-100/80">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-semibold text-zinc-800 tracking-wider mb-0.5">Valor</span>
                      <span className="text-sm font-bold text-zinc-800">{formatCurrency(project.project_value)}</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[10px] uppercase font-semibold text-secondary tracking-wider mb-0.5">Recebido</span>
                      <span className="text-sm font-bold text-secondary">{formatCurrency(project.amount_received)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <EditClientModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={(id, data) => handleUpdateClient({ id, data })}
        client={client}
        isPending={isUpdatingClient}
        error={getErrorMessage(updateError)}
      />
    </div>
  )
}
