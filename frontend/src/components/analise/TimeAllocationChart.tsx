import React from 'react'
import { CustomTooltip } from './CustomTooltip'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface TimeAllocationChartProps {
  workedHoursByProject: any[]
}

export function TimeAllocationChart({ workedHoursByProject }: TimeAllocationChartProps) {
  return (
    <div className="lg:col-span-5 bg-zinc-100 border border-zinc-200 p-6 rounded-3xl flex flex-col justify-between min-h-[300px]">
      <div className="flex justify-between items-center w-full mb-4">
        <div>
          <h3 className="font-extrabold text-base text-zinc-800">Alocação de Tempo</h3>
          <p className="text-xs text-zinc-500">Tempo dedicado por projeto (horas).</p>
        </div>
        <span className="text-[10px] font-bold bg-zinc-200 text-zinc-600 px-2 py-0.5 rounded-full uppercase">Semanal</span>
      </div>

      <div className="h-56 w-full mt-2">
        {workedHoursByProject.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-zinc-400">Sem horas registradas.</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={workedHoursByProject} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
              <XAxis dataKey="name" stroke="#a1a1aa" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#a1a1aa" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                name="Horas Trabalhadas"
                dataKey="hours"
                fill="#011D00"
                radius={[6, 6, 0, 0]}
                barSize={16}
              >
                {workedHoursByProject.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#011D00' : '#BAF08A'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
