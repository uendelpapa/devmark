import React from 'react'
import { formatCurrency } from './utils'

export const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-secondary/20 backdrop-blur-sm text-primary-light p-4 rounded-[20px] shadow-2xl border border-secondary/5 text-xs font-semibold space-y-1.5 z-50">
        <p className="mb-1 text-secondary font-bold">{label}</p>
        {payload.map((pld: any, index: number) => {
          const isHours = pld.name.includes('Horas')
          const isCount = pld.name === 'Criadas' || pld.name === 'Concluídas' || pld.name.includes('Demandas')
          const displayValue = isHours
            ? `${pld.value}h`
            : isCount
              ? pld.value
              : formatCurrency(pld.value)

          return (
            <div key={index} className="flex items-center gap-2">
              <span className="size-2 rounded-full" style={{ backgroundColor: pld.color || pld.fill }} />
              <span className="text-secondary">
                {pld.name}: {displayValue}
              </span>
            </div>
          )
        })}
      </div>
    )
  }
  return null
}
