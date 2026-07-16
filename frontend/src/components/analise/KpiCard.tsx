import React from 'react'
import { ArrowUp, ArrowDown } from 'lucide-react'

interface KpiCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  diff: number
  isPositive: boolean
  variant?: 'primary' | 'zinc'
  subtext?: string
}

export function KpiCard({
  title,
  value,
  icon,
  diff,
  isPositive,
  variant = 'zinc',
  subtext = 'VS. Período anterior',
}: KpiCardProps) {
  const isPrimary = variant === 'primary'

  return (
    <div
      className={`border rounded-3xl p-5 shadow-xs flex flex-col justify-between min-h-[140px] ${
        isPrimary
          ? 'bg-primary/50 border-primary text-secondary'
          : 'bg-zinc-100 border-zinc-200 text-zinc-800'
      }`}
    >
      <div className="flex items-center justify-between w-full">
        <div className={`p-2.5 rounded-full ${isPrimary ? 'bg-primary text-secondary' : 'bg-zinc-300 text-zinc-800'}`}>
          {icon}
        </div>
        <span
          className={`flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
            isPositive
              ? 'text-secondary bg-primary'
              : 'text-red-700 bg-red-100'
          }`}
        >
          {isPositive ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
          {Math.abs(diff)}%
        </span>
      </div>
      <div className="mt-4">
        <span className={`text-[10px] font-bold uppercase tracking-wider block ${isPrimary ? 'text-secondary' : 'text-zinc-800'}`}>
          {title}
        </span>
        <span className="text-2xl font-extrabold text-secondary tracking-tight">
          {value}
        </span>
      </div>
      <div className={`flex justify-between items-center text-[10px] mt-1 ${isPrimary ? 'text-secondary' : 'text-zinc-500'}`}>
        <span>{subtext}</span>
      </div>
    </div>
  )
}
