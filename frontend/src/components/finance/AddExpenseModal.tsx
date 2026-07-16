import { useState, useEffect } from 'react'
import { Xmark, Plus } from '@gravity-ui/icons'
import type { CreateProjectExpenseData } from '../../services/api'
import { Select, SelectItem } from '../ui/Select'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { Drawer } from '@heroui/react'

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
    <Drawer isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Drawer.Backdrop className="bg-black/30 backdrop-blur-sm">
        <Drawer.Content placement='right'>
          <Drawer.Dialog className="bg-white h-full w-[440px] max-w-[100vw] flex flex-col shadow-2xl outline-none">
            {/* Header Controls */}
            <Drawer.Header className="flex items-center justify-between px-5 pt-5 pb-3 border-none bg-transparent">
              <h2 className="text-lg font-bold text-secondary">Registrar Gasto</h2>
              <button
                onClick={onClose}
                className="size-8 flex items-center justify-center rounded-xl hover:bg-zinc-100 transition-colors cursor-pointer bg-transparent border-none"
              >
                <Xmark className="size-4 text-secondary/60" />
              </button>
            </Drawer.Header>

            {/* Scrollable Content */}
            <Drawer.Body className="flex-1 overflow-y-auto overflow-x-hidden px-5 pb-4 space-y-5 scrollbar-none">
              {/* Título do Gasto */}
              <div className="flex flex-col gap-1.5">
                <label className="text-secondary/60 text-xs font-bold uppercase tracking-wider">
                  Título do Gasto
                </label>
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Assinatura Vercel Pro, Licença Figma"
                />
              </div>

              {/* Valor */}
              <div className="flex flex-col gap-1.5">
                <label className="text-secondary/60 text-xs font-bold uppercase tracking-wider">
                  Valor (R$)
                </label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="0,00"
                />
              </div>

              {/* Categoria */}
              <div className="flex flex-col gap-1.5">
                <label className="text-secondary/60 text-xs font-bold uppercase tracking-wider">
                  Categoria
                </label>
                <Select
                  ariaLabel="Categoria"
                  selectedKey={category}
                  onSelectionChange={(key) => setCategory(key as string)}
                  className="w-full"
                >
                  {EXPENSE_CATEGORIES.map((c) => (
                    <SelectItem key={c.key} id={c.key}>
                      {c.label}
                    </SelectItem>
                  ))}
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
                isDisabled={isPending || !title.trim() || !value || !category}
                variant="primary"
                className="w-full flex items-center justify-center gap-2"
              >
                <Plus className="size-4" />
                Adicionar Gasto
              </Button>
            </Drawer.Footer>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  )
}
