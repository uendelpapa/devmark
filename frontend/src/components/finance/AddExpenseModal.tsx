import { useState, useEffect } from 'react'
import { Xmark, Plus } from '@gravity-ui/icons'
import type { CreateProjectExpenseData } from '../../services/api'
import { Select, ListBox } from '@heroui/react'

interface AddExpenseModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateProjectExpenseData) => void
  projectId: string
  isPending?: boolean
  error?: string | null
}

const EXPENSE_CATEGORIES = [
  { key: 'AI', label: 'Inteligência Artificial' },
  { key: 'SOFTWARE', label: 'Software' },
  { key: 'DOMAIN', label: 'Domínio' },
  { key: 'HOSTING', label: 'Hospedagem' },
  { key: 'DESIGN', label: 'Design' },
  { key: 'ADS', label: 'Anúncios / Ads' },
  { key: 'FREELANCER', label: 'Freelancer' },
  { key: 'OTHER', label: 'Outros' },
]

export function AddExpenseModal({
  isOpen,
  onClose,
  onSubmit,
  projectId,
  isPending = false,
  error = null,
}: AddExpenseModalProps) {
  const [title, setTitle] = useState('')
  const [value, setValue] = useState('')
  const [category, setCategory] = useState('OTHER')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (!isOpen) {
      setTitle('')
      setValue('')
      setCategory('OTHER')
      setDescription('')
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = () => {
    const numericValue = parseFloat(value)
    if (!title.trim() || isNaN(numericValue) || numericValue <= 0 || !category) return

    onSubmit({
      project_id: projectId,
      title: title.trim(),
      value: numericValue,
      category: category as any,
      description: description.trim() || undefined,
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
          <h2 className="text-lg font-bold text-secondary">Registrar Gasto</h2>
          <button
            onClick={onClose}
            className="size-8 flex items-center justify-center rounded-xl hover:bg-zinc-100 transition-colors cursor-pointer bg-transparent border-none"
          >
            <Xmark className="size-4 text-secondary/60" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-5 pb-4 space-y-5 scrollbar-none">
          {/* Título do Gasto */}
          <div className="flex flex-col gap-1.5">
            <label className="text-secondary/60 text-xs font-bold uppercase tracking-wider">
              Título do Gasto
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Assinatura Vercel Pro, Licença Figma"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-secondary text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/30 transition-all font-medium"
            />
          </div>

          {/* Valor */}
          <div className="flex flex-col gap-1.5">
            <label className="text-secondary/60 text-xs font-bold uppercase tracking-wider">
              Valor (R$)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="0,00"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-secondary text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/30 transition-all font-semibold"
            />
          </div>

          {/* Categoria */}
          <div className="flex flex-col gap-1.5">
            <label className="text-secondary/60 text-xs font-bold uppercase tracking-wider">
              Categoria
            </label>
            <Select
              aria-label="Categoria"
              selectedKey={category}
              onSelectionChange={(key) => setCategory(key as string)}
              className="w-full"
            >
              <Select.Trigger className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-secondary text-sm font-medium w-full flex items-center justify-between">
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover className="bg-white border border-zinc-200 rounded-xl shadow-lg z-[120]">
                <ListBox className="p-1">
                  {EXPENSE_CATEGORIES.map((c) => (
                    <ListBox.Item key={c.key} id={c.key} textValue={c.label} className="px-3 py-1.5 text-sm rounded-lg hover:bg-zinc-100 cursor-pointer">
                      {c.label}
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
          </div>

          {/* Descrição */}
          <div className="flex flex-col gap-1.5">
            <label className="text-secondary/60 text-xs font-bold uppercase tracking-wider">
              Descrição (Opcional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adicione detalhes sobre esta despesa..."
              rows={4}
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
            disabled={isPending || !title.trim() || !value || !category}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer border-none ${
              !title.trim() || !value || !category
                ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                : 'bg-secondary text-white hover:bg-secondary/90 active:scale-[0.98]'
            }`}
          >
            <Plus className="size-4" />
            Adicionar Gasto
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
