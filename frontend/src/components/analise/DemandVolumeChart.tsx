import React from 'react'
import { CustomTooltip } from './CustomTooltip'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface DemandVolumeChartProps {
  monthlyData: any[]
}

export function DemandVolumeChart({ monthlyData }: DemandVolumeChartProps) {
  return (
    <div className="lg:col-span-4 bg-zinc-100 border border-zinc-200 p-6 rounded-3xl flex flex-col justify-between min-h-[300px]">
      <div className="flex justify-between items-center w-full mb-4">
        <div>
          <h3 className="font-extrabold text-base text-zinc-800">Volume de Serviço</h3>
          <p className="text-xs text-zinc-500">Histórico de demandas criadas e concluídas por mês.</p>
        </div>

        {/* Quick Legend indicators */}
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded bg-secondary" />
            <span className="text-[10px] font-bold text-zinc-600 uppercase">Criadas</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded bg-primary" />
            <span className="text-[10px] font-bold text-zinc-600 uppercase">Concluídas</span>
          </div>
        </div>
      </div>

      <div className="h-56 w-full mt-2">
        {monthlyData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-zinc-500">Sem histórico de demandas.</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
              <XAxis dataKey="month" stroke="#a1a1aa" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#a1a1aa" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                name="Criadas"
                dataKey="demandasCriadas"
                fill="#011D00"
                radius={[4, 4, 0, 0]}
                barSize={14}
              />
              <Bar
                name="Concluídas"
                dataKey="demandasConcluidas"
                fill="#BAF08A"
                radius={[4, 4, 0, 0]}
                barSize={14}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
