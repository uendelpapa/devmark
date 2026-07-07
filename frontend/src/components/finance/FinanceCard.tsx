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
  diffValue?: string
}

export const FinanceCard = memo(function FinanceCard({
  title,
  value,
  indicator,
  diffValue
}: FinanceCardProps) {
  return (
    <div className="flex flex-col shrink-0 bg-primary/50 border border-primary space-y-4 px-6 py-4 rounded-[24px] min-w-[227px]">
      <span className="font-medium text-secondary">{title}</span>
      <span className="text-3xl font-bold text-secondary">{value}</span>
      <div className="flex items-center gap-1">
        {indicator === 'down' && <CircleChevronDown className="text-rose-500" width={16} height={16} />}
        {indicator === 'up' && <CircleChevronUp className="text-[#259E00]" width={16} height={16} />}
        {indicator === 'info' && <CircleInfo className="text-secondary" width={16} height={16} />}
        <span className="text-sm text-secondary tracking-tight leading-none">
          {indicator === 'info' ? (
            'Sem alterações'
          ) : (
            <>
              <span className={`font-semibold ${indicator === 'down' ? 'text-rose-500' : 'text-[#259E00]'}`}>
                {diffValue}{" "}
              </span>
              referente ao mês anterior
            </>
          )}
        </span>
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
