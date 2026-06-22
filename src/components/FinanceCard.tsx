import { memo } from 'react'
import {
  CircleChevronDown,
  CircleChevronUp,
  CircleInfo
} from '@gravity-ui/icons'

interface FinanceCardProps {
  title: string
  value: string
  indicator: 'up' | 'down' | 'info'
  indicatorText: string
}

export const FinanceCard = memo(function FinanceCard({
  title,
  value,
  indicator,
  indicatorText
}: FinanceCardProps) {
  return (
    <div className="flex flex-col shrink-0 bg-primary/50 border border-zinc-200/50 space-y-4 px-6 py-4 rounded-[24px] min-w-[200px]">
      <span className="font-semibold text-secondary">{title}</span>
      <span className="text-3xl font-bold text-secondary">{value}</span>
      <div className="flex items-center gap-1.5 text-sm font-semibold text-secondary">
        {indicator === 'down' && <CircleChevronDown className="text-secondary" width={16} height={16} />}
        {indicator === 'up' && <CircleChevronUp className="text-secondary" width={16} height={16} />}
        {indicator === 'info' && <CircleInfo className="text-secondary" width={16} height={16} />}
        <span className="font-normal opacity-90">{indicatorText}</span>
      </div>
    </div>
  )
})

export function FinanceCardSkeleton() {
  return (
    <div className="flex flex-col shrink-0 bg-primary/20 border border-zinc-200/50 space-y-4 px-6 py-4 rounded-[24px] min-w-[200px] animate-pulse">
      <span className="font-semibold bg-secondary/10 rounded h-4 w-1/2" />
      <span className="text-3xl font-bold bg-secondary/10 rounded h-8 w-2/3" />
      <div className="flex items-center gap-1.5 text-sm font-semibold text-secondary">
        <div className="size-4 bg-secondary/10 rounded-full" />
        <span className="font-normal bg-secondary/10 rounded h-4 w-1/2" />
      </div>
    </div>
  )
}
