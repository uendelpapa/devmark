import { useState, useEffect } from 'react'
import { Xmark, Plus } from '@gravity-ui/icons'
import type { CreatePaymentData } from '../services/api'
import { Select, ListBox, Calendar } from '@heroui/react'
import { parseDate } from '@internationalized/date'

interface AddPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreatePaymentData) => void
  projectId: string
  isPending?: boolean
  error?: string | null
}

const PAYMENT_METHODS = [
  { key: 'PIX', label: 'PIX' },
  { key: 'BANK_TRANSFER', label: 'Transferência Bancária' },
  { key: 'CREDIT_CARD', label: 'Cartão de Crédito' },
  { key: 'CASH', label: 'Dinheiro' },
]

const PAYMENT_STATUSES = [
  { key: 'PENDING', label: 'Pendente' },
  { key: 'PAID', label: 'Pago' },
  { key: 'OVERDUE', label: 'Atrasado' },
  { key: 'CANCELED', label: 'Cancelado' },
]

export function AddPaymentModal({
  isOpen,
  onClose,
  onSubmit,
  projectId,
  isPending = false,
  error = null,
}: AddPaymentModalProps) {
  const [amount, setAmount] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [paymentDate, setPaymentDate] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [status, setStatus] = useState('PENDING')
  const [notes, setNotes] = useState('')

  const getCalendarValue = (dateStr: string) => {
    if (!dateStr) return null
    try {
      return parseDate(dateStr.substring(0, 10))
    } catch (e) {
      return null
    }
  }

  useEffect(() => {
    if (!isOpen) {
      setAmount('')
      setDueDate('')
      setPaymentDate('')
      setPaymentMethod('')
      setStatus('PENDING')
      setNotes('')
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = () => {
    const value = parseFloat(amount)
    if (isNaN(value) || value <= 0 || !dueDate) return

    onSubmit({
      project_id: projectId,
      amount: value,
      due_date: dueDate,
      payment_date: paymentDate || undefined,
      payment_method: paymentMethod ? (paymentMethod as any) : undefined,
      status: status as any,
      notes: notes.trim() || undefined,
    })
  }

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
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="text-lg font-bold text-secondary">Registrar Pagamento</h2>
          <button
            onClick={onClose}
            className="size-8 flex items-center justify-center rounded-xl hover:bg-zinc-100 transition-colors cursor-pointer bg-transparent border-none"
          >
            <Xmark className="size-4 text-secondary/60" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-5 pb-4 space-y-5 scrollbar-none">
          {/* Valor */}
          <div className="flex flex-col gap-1.5">
            <label className="text-secondary/60 text-xs font-bold uppercase tracking-wider">
              Valor (R$)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-secondary text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/30 transition-all font-semibold"
            />
          </div>

          {/* Data de Vencimento */}
          <div className="flex flex-col gap-1.5">
            <label className="text-secondary/60 text-xs font-bold uppercase tracking-wider">
              Data de Vencimento
            </label>
            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-3 flex justify-center">
              <Calendar 
                aria-label="Data de Vencimento"
                value={getCalendarValue(dueDate)}
                onChange={(date) => setDueDate(date ? date.toString() : '')}
              >
                <Calendar.Header>
                  <Calendar.Heading />
                  <Calendar.NavButton slot="previous" />
                  <Calendar.NavButton slot="next" />
                </Calendar.Header>
                <Calendar.Grid>
                  <Calendar.GridHeader>
                    {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                  </Calendar.GridHeader>
                  <Calendar.GridBody>
                    {(date) => <Calendar.Cell date={date} />}
                  </Calendar.GridBody>
                </Calendar.Grid>
              </Calendar>
            </div>
          </div>

          {/* Data de Pagamento */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-secondary/60 text-xs font-bold uppercase tracking-wider">
                Data de Pagamento (Opcional)
              </label>
              {paymentDate && (
                <button
                  type="button"
                  onClick={() => setPaymentDate('')}
                  className="text-xs text-red-500 hover:text-red-700 font-bold bg-transparent border-none cursor-pointer"
                >
                  Limpar
                </button>
              )}
            </div>
            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-3 flex justify-center">
              <Calendar 
                aria-label="Data de Pagamento"
                value={getCalendarValue(paymentDate)}
                onChange={(date) => setPaymentDate(date ? date.toString() : '')}
              >
                <Calendar.Header>
                  <Calendar.Heading />
                  <Calendar.NavButton slot="previous" />
                  <Calendar.NavButton slot="next" />
                </Calendar.Header>
                <Calendar.Grid>
                  <Calendar.GridHeader>
                    {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                  </Calendar.GridHeader>
                  <Calendar.GridBody>
                    {(date) => <Calendar.Cell date={date} />}
                  </Calendar.GridBody>
                </Calendar.Grid>
              </Calendar>
            </div>
          </div>

          {/* Método de Pagamento */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-secondary/60 text-xs font-bold uppercase tracking-wider">
                Método de Pagamento (Opcional)
              </label>
              {paymentMethod && (
                <button
                  type="button"
                  onClick={() => setPaymentMethod('')}
                  className="text-xs text-red-500 hover:text-red-700 font-bold bg-transparent border-none cursor-pointer"
                >
                  Limpar
                </button>
              )}
            </div>
            <Select
              aria-label="Método de Pagamento"
              placeholder="Selecione um método"
              selectedKey={paymentMethod}
              onSelectionChange={(key) => setPaymentMethod(key as string)}
              className="w-full"
            >
              <Select.Trigger className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-secondary text-sm font-medium w-full flex items-center justify-between">
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover className="bg-white border border-zinc-200 rounded-xl shadow-lg z-[120]">
                <ListBox className="p-1">
                  {PAYMENT_METHODS.map((m) => (
                    <ListBox.Item key={m.key} id={m.key} textValue={m.label} className="px-3 py-1.5 text-sm rounded-lg hover:bg-zinc-100 cursor-pointer">
                      {m.label}
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
          </div>

          {/* Status do Pagamento */}
          <div className="flex flex-col gap-1.5">
            <label className="text-secondary/60 text-xs font-bold uppercase tracking-wider">
              Status do Pagamento
            </label>
            <Select
              aria-label="Status do Pagamento"
              selectedKey={status}
              onSelectionChange={(key) => setStatus(key as string)}
              className="w-full"
            >
              <Select.Trigger className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-secondary text-sm font-medium w-full flex items-center justify-between">
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover className="bg-white border border-zinc-200 rounded-xl shadow-lg z-[120]">
                <ListBox className="p-1">
                  {PAYMENT_STATUSES.map((s) => (
                    <ListBox.Item key={s.key} id={s.key} textValue={s.label} className="px-3 py-1.5 text-sm rounded-lg hover:bg-zinc-100 cursor-pointer">
                      {s.label}
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
          </div>

          {/* Observações */}
          <div className="flex flex-col gap-1.5">
            <label className="text-secondary/60 text-xs font-bold uppercase tracking-wider">
              Observações
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Primeira parcela, Entrada, etc."
              rows={3}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-secondary text-sm outline-none resize-none placeholder:text-zinc-400 focus:border-primary/60 focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="px-5 pb-2">
            <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-medium">
              {error}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-5 py-4 border-t border-zinc-200">
          <button
            onClick={handleSubmit}
            disabled={isPending || !amount || !dueDate}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer border-none ${
              !amount || !dueDate
                ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                : 'bg-secondary text-white hover:bg-secondary/90 active:scale-[0.98]'
            }`}
          >
            <Plus className="size-4" />
            Adicionar Pagamento
          </button>
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
