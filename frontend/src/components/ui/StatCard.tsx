import { memo, useCallback } from 'react'
import { Card, CardContent } from '@heroui/react'
import {
  ArrowUpRightFromSquare,
  CircleChevronDown,
  CircleChevronUp,
  CircleInfo
} from '@gravity-ui/icons'
import { Button } from './Button'

interface StatCardProps {
  title: string
  value: string | number
  indicator?: 'up' | 'down' | 'info'
  diffValue?: string
  variant?: 'primary' | 'zinc'
  onAction?: (title: string) => void
}

export const StatCard = memo(function StatCard({
  title,
  value,
  indicator,
  diffValue,
  variant = 'zinc',
  onAction
}: StatCardProps) {
  const isPrimary = variant === 'primary'

  const handleActionClick = useCallback(() => {
    onAction?.(title)
  }, [onAction, title])

  return (
    <Card className={`${isPrimary ? 'bg-primary/50 border-primary text-secondary' : 'bg-zinc-100 border-zinc-200 text-zinc-700'} border shadow-none rounded-[24px] p-6  relative`}>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold">{title}</h4>
          <Button
            size="lg"
            variant='onlyIcon'
            onClick={handleActionClick}
            aria-label={`Visualizar detalhes de ${title}`}
          >
            <ArrowUpRightFromSquare width={16} height={16} />
          </Button>
        </div>
        <span className="text-5xl font-semibold leading-none tracking-tight block">
          {value}
        </span>
        <div className="flex items-center gap-1">
          {indicator === 'down' && <CircleChevronDown className="text-rose-500" width={16} height={16} />}
          {indicator === 'up' && <CircleChevronUp className="text-emerald-700" width={16} height={16} />}
          {indicator === 'info' && <CircleInfo className="text-zinc-700" width={16} height={16} />}
          <span className="text-sm tracking-tight leading-none">
            {indicator === 'info' ? (
              'sem alterações'
            ) : (
              <>
                <span className={`font-semibold ${indicator === 'down' ? 'text-rose-500' : 'text-emerald-700'}`}>
                  {diffValue}{" "}
                </span>
                referente ao mês anterior
              </>
            )}
          </span>
        </div>
      </CardContent>
    </Card>
  )
})

export function StatCardSkeleton() {
  return (
    <Card className="bg-zinc-100 border-none shadow-none rounded-[24px] p-6 text-secondary relative animate-pulse">
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-5 bg-secondary/10 rounded w-1/2" />
          <div className="size-10 bg-secondary/10 rounded-xl" />
        </div>
        <div className="h-12 bg-secondary/10 rounded w-1/3 my-2" />
        <div className="flex items-center gap-2">
          <div className="size-4 bg-secondary/10 rounded-full" />
          <div className="h-4 bg-secondary/10 rounded w-2/3" />
        </div>
      </CardContent>
    </Card>
  )
}
