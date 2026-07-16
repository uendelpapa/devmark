import React from 'react'
import { Select, SelectItem } from '../../components/ui/Select'
import { formatCurrency } from './utils'
import { CustomTooltip } from './CustomTooltip'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface FinancePerformanceChartProps {
  months: string
  setMonths: (val: string) => void
  isLoadingChart: boolean
  isFetchingChart: boolean
  quickStats: {
    totalRecebido: number
    totalDespesas: number
    saldoLiquido: number
  }
  monthlyData: any[]
}

export function FinancePerformanceChart({
  months,
  setMonths,
  isLoadingChart,
  isFetchingChart,
  quickStats,
  monthlyData,
}: FinancePerformanceChartProps) {
  const isLoading = isLoadingChart || isFetchingChart

  return (
    <div className="group relative lg:col-span-7 bg-primary/50 border border-primary p-6 rounded-3xl flex flex-col justify-between min-h-[300px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full mb-4">
        <div>
          <h3 className="font-extrabold text-base text-secondary">Desempenho Financeiro</h3>
          <p className="text-xs text-secondary">Fluxo histórico de receitas recebidas mensais.</p>
        </div>

        {isLoading ? (
          <div className="hidden sm:flex items-center gap-6">
            <div className="h-10 w-20 bg-primary rounded-2xl animate-pulse" />
            <div className="h-10 w-20 bg-primary rounded-2xl animate-pulse" />
            <div className="h-10 w-20 bg-primary rounded-2xl animate-pulse" />
          </div>
        ) : (
          <div className="flex items-center gap-6 text-left">
            <div>
              <span className="text-[10px] font-semibold text-secondary uppercase tracking-wider block">Total Recebido</span>
              <span className="text-sm font-bold text-secondary">{formatCurrency(quickStats.totalRecebido)}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-secondary uppercase tracking-wider block">Despesas</span>
              <span className="text-sm font-bold text-orange-600">{formatCurrency(quickStats.totalDespesas)}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-secondary uppercase tracking-wider block">Saldo Líquido</span>
              <span className="text-sm font-bold text-lime-600">{formatCurrency(quickStats.saldoLiquido)}</span>
            </div>
          </div>
        )}

        {/* Time Filter Select */}
        <Select
          selectedKey={months}
          onSelectionChange={(key) => setMonths(key as string)}
          ariaLabel="Filtrar histórico"
          variant="primary"
          className="absolute bottom-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto"
          triggerClassName="!text-xs"
        >
          <SelectItem id="3" textValue="Mensal: 3M">Mensal: 3M</SelectItem>
          <SelectItem id="6" textValue="Mensal: 6M">Mensal: 6M</SelectItem>
          <SelectItem id="12" textValue="Mensal: 12M">Mensal: 12M</SelectItem>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex-1 flex flex-col justify-between gap-4 animate-pulse w-full">
          <div className="flex items-center gap-6 text-left sm:hidden mb-2">
            <div className="h-10 w-20 bg-zinc-100 rounded-md" />
            <div className="h-10 w-20 bg-zinc-100 rounded-md" />
            <div className="h-10 w-20 bg-zinc-100 rounded-md" />
          </div>

          <div className="flex-1 bg-zinc-50/50 border border-zinc-100 rounded-2xl h-56 w-full flex items-center justify-center">
            <div className="w-11/12 h-5/6 flex items-end justify-between px-4 pb-4">
              <div className="w-full h-full border-b-2 border-l-2 border-dashed border-zinc-200/60 relative">
                <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-zinc-400">
                  Carregando dados...
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-56 w-full mt-2">
          {monthlyData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-secondary">Sem dados históricos.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenuePerformance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#011D00" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#011D00" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="" />
                <XAxis dataKey="month" stroke="#011d00" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#011d00" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  name="Receitas"
                  dataKey="receita"
                  stroke="#011D00"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenuePerformance)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      )}
    </div>
  )
}
