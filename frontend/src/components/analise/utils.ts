export function formatCurrency(value: number): string {
  return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

export function getAvatarColor(name: string): string {
  const colors = [
    'bg-[#BAF08A]/30 text-secondary',
    'bg-sky-100 text-sky-700',
    'bg-purple-100 text-purple-700',
    'bg-orange-100 text-orange-700',
    'bg-pink-100 text-pink-700',
    'bg-teal-100 text-teal-700',
  ]
  let sum = 0
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i)
  }
  return colors[sum % colors.length]
}

import { STATUS_STYLES } from '../ui/StatusBadge'

export function getStatusBadgeClass(status: string): string {
  const normalized = status.toUpperCase()
  return STATUS_STYLES[normalized]?.classes || 'text-zinc-700 bg-zinc-100 border border-zinc-200'
}

export function getStatusLabel(status: string): string {
  switch (status.toUpperCase()) {
    case 'ACTIVE':
      return 'Ativo'
    case 'LEAD':
      return 'Lead'
    case 'NEGOTIATING':
      return 'Em Negociação'
    case 'LOST':
      return 'Perdido'
    default:
      return status
  }
}

export const CATEGORY_COLORS: Record<string, string> = {
  AI: '#BAF08A',
  SOFTWARE: '#38BDF8',
  DOMAIN: '#C084FC',
  HOSTING: '#F472B6',
  DESIGN: '#FB923C',
  ADS: '#FACC15',
  FREELANCER: '#2DD4BF',
  OTHER: '#A9A9A9'
}
