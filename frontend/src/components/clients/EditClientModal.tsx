import { useState, useEffect } from 'react'
import { Xmark, Check } from '@gravity-ui/icons'
import type { Client } from '../../services/api'
import { Select, SelectItem } from '../ui/Select'

interface EditClientModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (id: string, data: any) => void
  onDelete?: (id: string) => void
  client: Client | null
  isPending?: boolean
  error?: string | null
}

const CLIENT_STATUSES = [
  { key: 'LEAD', label: 'Lead' },
  { key: 'NEGOTIATING', label: 'Em Negociação' },
  { key: 'ACTIVE', label: 'Ativo' },
  { key: 'INACTIVE', label: 'Inativo' },
  { key: 'LOST', label: 'Perdido' },
]

const COMM_METHODS = [
  { key: 'WHATSAPP', label: 'WhatsApp' },
  { key: 'EMAIL', label: 'E-mail' },
  { key: 'PHONE', label: 'Telefone' },
  { key: 'MEETING', label: 'Reunião' },
]

const PAYMENT_METHODS = [
  { key: 'PIX', label: 'PIX' },
  { key: 'BANK_TRANSFER', label: 'Boleto / Transferência' },
  { key: 'CREDIT_CARD', label: 'Cartão de Crédito' },
  { key: 'CASH', label: 'Dinheiro' },
]

export function EditClientModal({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  client,
  isPending = false,
  error = null,
}: EditClientModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [documentVal, setDocumentVal] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState('ACTIVE')
  const [comm, setComm] = useState('WHATSAPP')
  const [payment, setPayment] = useState('PIX')

  useEffect(() => {
    if (isOpen && client) {
      setName(client.name || '')
      setEmail(client.email || '')
      setCompanyName(client.company_name || '')
      setDocumentVal(client.document || '')
      setPhone(client.phone || '')
      setStatus(client.status)
      setComm(client.preferred_communication)
      setPayment(client.preferred_payment_method)
    }
  }, [isOpen, client])

  if (!isOpen || !client) return null

  const handleSubmit = () => {
    if (!name || !email) return

    onSubmit(client.id, {
      name: name.trim(),
      email: email.trim(),
      company_name: companyName.trim(),
      document: documentVal.trim(),
      phone: phone.trim(),
      status,
      preferred_communication: comm,
      preferred_payment_method: payment,
    })
  }

  const labelClass = 'text-secondary/60 text-xs font-bold uppercase tracking-wider'
  const inputClass = 'w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-secondary text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/30 transition-all font-semibold'

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
          <h2 className="text-lg font-bold text-secondary">Editar Cliente</h2>
          <button
            onClick={onClose}
            className="size-8 flex items-center justify-center rounded-xl hover:bg-zinc-100 transition-colors cursor-pointer bg-transparent border-none"
          >
            <Xmark className="size-4 text-secondary/60" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-5 pb-4 space-y-5 scrollbar-none">
          {/* Nome */}
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Nome Completo</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: John Smith"
              className={inputClass}
            />
          </div>

          {/* E-mail */}
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ex: john@acme.com"
              className={inputClass}
            />
          </div>

          {/* Nome da Empresa */}
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Nome da Empresa</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Ex: Acme Corp"
              className={inputClass}
            />
          </div>

          {/* CNPJ / CPF */}
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>CNPJ / CPF</label>
            <input
              type="text"
              value={documentVal}
              onChange={(e) => setDocumentVal(e.target.value)}
              placeholder="Ex: 12.345.678/0001-90"
              className={inputClass}
            />
          </div>

          {/* Telefone */}
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Telefone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ex: (11) 99999-9999"
              className={inputClass}
            />
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Status do Cliente</label>
            <Select
              ariaLabel="Status do Cliente"
              selectedKey={status}
              onSelectionChange={(key) => setStatus(key as string)}
              className="w-full"
            >
              {CLIENT_STATUSES.map((s) => (
                <SelectItem key={s.key} id={s.key}>
                  {s.label}
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* Comunicação Preferencial */}
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Comunicação Preferencial</label>
            <Select
              ariaLabel="Comunicação Preferencial"
              selectedKey={comm}
              onSelectionChange={(key) => setComm(key as string)}
              className="w-full"
            >
              {COMM_METHODS.map((m) => (
                <SelectItem key={m.key} id={m.key}>
                  {m.label}
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* Método de Pagamento Preferido */}
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Método de Pagamento Preferido</label>
            <Select
              ariaLabel="Método de Pagamento Preferido"
              selectedKey={payment}
              onSelectionChange={(key) => setPayment(key as string)}
              className="w-full"
            >
              {PAYMENT_METHODS.map((m) => (
                <SelectItem key={m.key} id={m.key}>
                  {m.label}
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
            disabled={isPending || !name || !email}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer border-none ${
              !name || !email
                ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                : 'bg-secondary text-white hover:bg-secondary/90 active:scale-[0.98]'
            }`}
          >
            <Check className="size-4" />
            Salvar Alterações
          </button>

          {onDelete && (
            <button
              onClick={() => {
                if (confirm('Tem certeza que deseja excluir este cliente?')) {
                  onDelete(client.id)
                }
              }}
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm bg-red-50 text-red-600 hover:bg-red-100 transition-all cursor-pointer border-none active:scale-[0.98]"
            >
              Excluir Cliente
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
