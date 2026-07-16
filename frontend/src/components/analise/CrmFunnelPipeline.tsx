import React from 'react'

interface CrmFunnelPipelineProps {
  crmFunnel: any[]
  totalClients: number
  conversionRate: number
}

export function CrmFunnelPipeline({
  crmFunnel,
  totalClients,
  conversionRate,
}: CrmFunnelPipelineProps) {
  return (
    <div className="lg:col-span-7 bg-zinc-100 border border-zinc-200 p-6 rounded-3xl flex flex-col justify-between min-h-[300px]">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 w-full mb-4">
        <div>
          <h3 className="font-extrabold text-base text-zinc-800">Pipeline do Funil de Leads</h3>
          <p className="text-xs text-zinc-500">Distribuição e taxa de conversão dos clientes ativos no funil.</p>
        </div>
        <div className="flex items-center gap-6">
          <div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Clientes Totais</span>
            <span className="text-base font-black text-secondary">{totalClients}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Conversão de Leads</span>
            <span className="text-base font-black text-secondary">{conversionRate}%</span>
          </div>
        </div>
      </div>

      {/* Chevrons Render */}
      <div className="flex-1 flex flex-col justify-center w-full px-2 py-4">
        {crmFunnel.length === 0 ? (
          <div className="text-sm text-zinc-400 text-center py-10">Funil vazio.</div>
        ) : (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
            {crmFunnel.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div
                  style={{ borderLeft: `4px solid ${item.color}` }}
                  className="flex-1 bg-white border border-zinc-200/60 p-5 rounded-2xl flex flex-col gap-1 shadow-xs hover:border-zinc-300 transition-colors"
                >
                  <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">{item.stage}</span>
                  <div className="flex justify-between items-baseline mt-2">
                    <span className="text-2xl font-black text-secondary">{item.count}</span>
                    <span
                      style={{ color: item.color, backgroundColor: `${item.color}15` }}
                      className="text-xs font-bold px-2 py-0.5 rounded-lg"
                    >
                      {item.percentage}%
                    </span>
                  </div>
                </div>
                {idx < crmFunnel.length - 1 && (
                  <div className="flex justify-center items-center h-full text-zinc-800 shrink-0 font-black text-xl rotate-90 sm:rotate-0 my-1 sm:my-0">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
