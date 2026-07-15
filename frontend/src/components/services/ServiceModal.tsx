import { useState, useEffect } from 'react'
import { Xmark, Check } from '@gravity-ui/icons'
import { useQuery } from '@tanstack/react-query'
import { fetchClients } from '../../services/api'
import type { Service, Client } from '../../services/api'
import { Select, SelectItem } from '../ui/Select'

interface ServiceModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  onDelete?: (id: string) => void
  service: Service | null
  clientId?: string
  isPending?: boolean
  error?: string | null
}

const SERVICE_STATUSES = [
  { key: 'PENDING', label: 'Pendente' },
  { key: 'IN_PROGRESS', label: 'Em Andamento' },
  { key: 'REVIEW', label: 'Em Revisão' },
  { key: 'COMPLETED', label: 'Concluído' },
  { key: 'CANCELED', label: 'Cancelado' },
]

export function ServiceModal({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  service,
  clientId,
  isPending = false,
  error = null,
}: ServiceModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedClientId, setSelectedClientId] = useState('')
  const [value, setValue] = useState('')
  const [amountReceived, setAmountReceived] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [status, setStatus] = useState('PENDING')

  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: fetchClients,
    enabled: isOpen,
  })

  useEffect(() => {
    if (isOpen) {
      if (service) {
        setTitle(service.title || '')
        setDescription(service.description || '')
        setSelectedClientId(service.client_id || '')
        setValue(service.value ? String(service.value) : '')
        setAmountReceived(service.amount_received ? String(service.amount_received) : '')
        setDueDate(
          service.due_date
            ? new Date(service.due_date).toISOString().split('T')[0]
            : ''
        )
        setStatus(service.status || 'PENDING')
      } else {
        setTitle('')
        setDescription('')
        setSelectedClientId(clientId || '')
        setValue('')
        setAmountReceived('')
        setDueDate('')
        setStatus('PENDING')
      }
    }
  }, [isOpen, service, clientId])

  if (!isOpen) return null

  const handleSubmit = () => {
    if (!title || !selectedClientId) return

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      client_id: selectedClientId,
      value: value ? parseFloat(value) : 0,
      amount_received: amountReceived ? parseFloat(amountReceived) : 0,
      due_date: dueDate ? new Date(dueDate).toISOString() : undefined,
      status,
    })
  }

  const labelClass = 'text-secondary/60 text-xs font-bold uppercase tracking-wider'
  const inputClass =
    'w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-secondary text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/30 transition-all font-semibold'

  const currentClient = clients.find((c) => c.id === selectedClientId)

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100]"
        onClick={onClose}
      />

      {/* Modal Panel - right side slide-in */}
      <div className="fixed right-0 top-0 h-full w-[440px] max-w-[100vw] bg-white z-[101] flex flex-col shadow-2xl animate-slide-in-right overflow-x-hidden">
        {/* Header Controls */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
          <h2 className="text-lg font-bold text-secondary">
            {service ? 'Editar Serviço Avulso' : 'Registrar Serviço Avulso'}
          </h2>
          <button
            onClick={onClose}
            className="size-8 flex items-center justify-center rounded-xl hover:bg-zinc-100 transition-colors cursor-pointer bg-transparent border-none"
          >
            <Xmark className="size-4 text-secondary/60" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-5 pb-4 space-y-5 scrollbar-none">
          {/* Título */}
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Título do Serviço</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Edição de Vídeo do Reels"
              className={inputClass}
            />
          </div>

          {/* Descrição */}
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Descrição / Notas</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adicione observações sobre o serviço..."
              className={`${inputClass} min-h-[80px] resize-y`}
            />
          </div>

          {/* Cliente */}
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Cliente</label>
            {clientId ? (
              <div className="w-full bg-zinc-100 border border-zinc-200 rounded-xl px-4 py-2.5 text-zinc-500 text-sm font-semibold">
                {currentClient?.name || 'Cliente Selecionado'}
              </div>
            ) : (
              <Select
                ariaLabel="Selecionar Cliente"
                selectedKey={selectedClientId}
                onSelectionChange={(key) => setSelectedClientId(key as string)}
                className="w-full"
              >
                {clients.map((c) => (
                  <SelectItem key={c.id} id={c.id}>
                    {c.name} {c.company_name ? `(${c.company_name})` : ''}
                  </SelectItem>
                ))}
              </Select>
            )}
          </div>

          {/* Valores (Lado a Lado) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Valor Cobrado (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="0.00"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Valor Recebido (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amountReceived}
                onChange={(e) => setAmountReceived(e.target.value)}
                placeholder="0.00"
                className={inputClass}
              />
            </div>
          </div>

          {/* Prazo */}
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Data de Entrega / Prazo</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Status</label>
            <Select
              ariaLabel="Status do Serviço"
              selectedKey={status}
              onSelectionChange={(key) => setStatus(key as string)}
              className="w-full"
            >
              {SERVICE_STATUSES.map((s) => (
                <SelectItem key={s.key} id={s.key}>
                  {s.label}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="px-5 pb-2 shrink-0">
            <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-medium">
              {error}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-5 py-4 border-t border-zinc-200 shrink-0 flex flex-col gap-2">
          <button
            onClick={handleSubmit}
            disabled={isPending || !title || !selectedClientId}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer border-none ${
              !title || !selectedClientId
                ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                : 'bg-secondary text-white hover:bg-secondary/90 active:scale-[0.98]'
            }`}
          >
            <Check className="size-4" />
            {service ? 'Salvar Alterações' : 'Salvar Serviço'}
          </button>

          {service && onDelete && (
            <button
              onClick={() => {
                if (confirm('Tem certeza que deseja excluir este serviço avulso?')) {
                  onDelete(service.id)
                }
              }}
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm bg-red-50 text-red-600 hover:bg-red-100 transition-all cursor-pointer border-none active:scale-[0.98]"
            >
              Excluir Serviço
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </>
  )
}
