import React from 'react'

export type StatusType =
  | 'PENDING' | 'IN_PROGRESS' | 'WAITING_CLIENT' | 'REVIEW' | 'COMPLETED' | 'CANCELED'
  | 'PLANNING' | 'ACTIVE' | 'LEAD' | 'NEGOTIATING' | 'INACTIVE' | 'LOST'
  | 'PAID' | 'OVERDUE' | string

interface StatusBadgeProps {
  status: StatusType
  label?: string
  className?: string
  children?: React.ReactNode
}

export const STATUS_STYLES: Record<string, { label: string; classes: string }> = {
  // Task, Project, Service Statuses
  PENDING: { label: 'Pendente', classes: 'bg-zinc-200 text-zinc-700 border border-zinc-300' },
  PLANNING: { label: 'Planejamento', classes: 'bg-zinc-200 text-zinc-700 border border-zinc-300' },
  IN_PROGRESS: { label: 'Em Andamento', classes: 'bg-amber-50 text-amber-700 border border-amber-200/60' },
  WAITING_CLIENT: { label: 'Aguardando Cliente', classes: 'bg-purple-50 text-purple-700 border border-purple-200/60' },
  REVIEW: { label: 'Em Revisão', classes: 'bg-blue-50 text-blue-700 border border-blue-200/60' },
  COMPLETED: { label: 'Concluído', classes: 'bg-primary/50 text-secondary border border-primary' },
  CANCELED: { label: 'Cancelado', classes: 'bg-red-50 text-red-700 border border-red-200/60' },

  // Client Statuses
  ACTIVE: { label: 'Ativo', classes: 'bg-primary/50 text-secondary border border-primary' },
  LEAD: { label: 'Lead', classes: 'bg-blue-50 text-blue-700 border border-blue-200/60' },
  NEGOTIATING: { label: 'Em Negociação', classes: 'bg-amber-50 text-amber-700 border border-amber-200/60' },
  INACTIVE: { label: 'Inativo', classes: 'bg-zinc-100 text-zinc-500 border border-zinc-200' },
  LOST: { label: 'Perdido', classes: 'bg-red-50 text-red-700 border border-red-200/60' },

  // Payment/Finance Statuses
  PAID: { label: 'Pago', classes: 'bg-primary/50 text-secondary border border-primary' },
  OVERDUE: { label: 'Atrasado', classes: 'bg-red-50 text-red-700 border border-red-200/60' },
}

export function StatusBadge({ status, label, className = '', children }: StatusBadgeProps) {
  const normalized = status.toUpperCase()
  const config = STATUS_STYLES[normalized] || {
    label: status,
    classes: 'bg-zinc-100 text-zinc-600 border border-zinc-200'
  }

  return (
    <span className={`inline-flex items-center gap-1.5 py-1 px-2 rounded-full text-xs font-semibold ${config.classes} ${className}`}>
      {children || label || config.label}
    </span>
  )
}
