import React from 'react'
import { CustomTooltip } from './CustomTooltip'
import { CATEGORY_COLORS } from './utils'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ExpenseDistributionChartProps {
  costDistribution: any[]
}

export function ExpenseDistributionChart({ costDistribution }: ExpenseDistributionChartProps) {
  return (
    <div className="lg:col-span-4 bg-zinc-100 border border-zinc-200 p-6 rounded-3xl flex flex-col justify-between min-h-[300px]">
      <div className="flex justify-between items-center w-full mb-4">
        <div>
          <h3 className="font-extrabold text-base text-zinc-800">Distribuição de Despesas</h3>
          <p className="text-xs text-zinc-500">Total investido por categoria no período.</p>
        </div>
        <span className="text-[10px] font-bold bg-zinc-200 text-zinc-800 px-2 py-0.5 rounded-full uppercase">Categoria</span>
      </div>

      <div className="h-56 w-full mt-2">
        {costDistribution.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-zinc-800">Sem despesas registradas.</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={costDistribution} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="" />
              <XAxis dataKey="category" stroke="#27272a" fontSize={9} tickLine={false} axisLine={false} />
              <YAxis stroke="#27272a" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                name="Valor Gasto"
                dataKey="value"
                fill="#27272a"
                radius={[6, 6, 0, 0]}
                barSize={16}
              >
                {costDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.category] || '#FB923C'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
