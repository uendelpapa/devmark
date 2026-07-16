import { useState, useEffect } from 'react'
import { Xmark, Plus } from '@gravity-ui/icons'
import type { CreatePaymentData } from '../../services/api'
import { Select, SelectItem } from '../ui/Select'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { Drawer } from '@heroui/react'

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
    <Drawer isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Drawer.Backdrop className="bg-black/30 backdrop-blur-sm">
        <Drawer.Content placement='right'>
          <Drawer.Dialog className="bg-white h-full w-[440px] max-w-[100vw] flex flex-col shadow-2xl outline-none">
            {/* Header Controls */}
            <Drawer.Header className="flex items-center justify-between px-5 pt-5 pb-3 border-none bg-transparent">
              <h2 className="text-lg font-bold text-secondary">Registrar Pagamento</h2>
              <button
                onClick={onClose}
                className="size-8 flex items-center justify-center rounded-xl hover:bg-zinc-100 transition-colors cursor-pointer bg-transparent border-none"
              >
                <Xmark className="size-4 text-secondary/60" />
              </button>
            </Drawer.Header>

            {/* Scrollable Content */}
            <Drawer.Body className="flex-1 overflow-y-auto overflow-x-hidden px-5 pb-4 space-y-5 scrollbar-none">
              {/* Valor */}
              <div className="flex flex-col gap-1.5">
                <label className="text-secondary/60 text-xs font-bold uppercase tracking-wider">
                  Valor (R$)
                </label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0,00"
                />
              </div>

              {/* Data de Vencimento */}
              <div className="flex flex-col gap-1.5">
                <label className="text-secondary/60 text-xs font-bold uppercase tracking-wider">
                  Data de Vencimento
                </label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
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
                <Input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                />
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
                  ariaLabel="Método de Pagamento"
                  placeholder="Selecione um método"
                  selectedKey={paymentMethod}
                  onSelectionChange={(key) => setPaymentMethod(key as string)}
                  className="w-full"
                >
                  {PAYMENT_METHODS.map((m) => (
                    <SelectItem key={m.key} id={m.key}>
                      {m.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              {/* Status do Pagamento */}
              <div className="flex flex-col gap-1.5">
                <label className="text-secondary/60 text-xs font-bold uppercase tracking-wider">
                  Status do Pagamento
                </label>
                <Select
                  ariaLabel="Status do Pagamento"
                  selectedKey={status}
                  onSelectionChange={(key) => setStatus(key as string)}
                  className="w-full"
                >
                  {PAYMENT_STATUSES.map((s) => (
                    <SelectItem key={s.key} id={s.key}>
                      {s.label}
                    </SelectItem>
                  ))}
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
                  className="w-full bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 shadow-none rounded-[20px] px-4 py-2.5 transition-colors text-base text-zinc-800 placeholder:text-zinc-500 outline-none resize-none"
                />
              </div>
            </Drawer.Body>

            {/* Error message */}
            {error && (
              <div className="px-5 pb-2">
                <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-medium">
                  {error}
                </div>
              </div>
            )}

            {/* Footer */}
            <Drawer.Footer className="px-5 py-4 border-t border-zinc-200">
              <Button
                onPress={handleSubmit}
                isDisabled={isPending || !amount || !dueDate}
                variant="primary"
                className="w-full flex items-center justify-center gap-2"
              >
                <Plus className="size-4" />
                Adicionar Pagamento
              </Button>
            </Drawer.Footer>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  )
}
