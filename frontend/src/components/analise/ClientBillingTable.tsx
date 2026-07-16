import React from 'react'
import { formatCurrency, getAvatarColor, getStatusBadgeClass, getStatusLabel } from './utils'

interface ClientBillingTableProps {
  topClients: any[]
}

export function ClientBillingTable({ topClients }: ClientBillingTableProps) {
  return (
    <div className="lg:col-span-4 bg-primary/50 border border-primary p-6 rounded-3xl flex flex-col gap-4">
      <div className="flex justify-between items-center w-full">
        <div>
          <h3 className="font-extrabold text-base text-secondary">Desempenho por Cliente</h3>
          <p className="text-xs text-secondary">
            Clientes mais valiosos ordenados pelo <br /> volume financeiro gerado.
          </p>
        </div>
      </div>

      {topClients.length === 0 ? (
        <div className="text-sm text-zinc-400 text-center py-10 flex-1 flex items-center justify-center">
          Nenhuma receita faturada para clientes neste período.
        </div>
      ) : (
        <div className="overflow-x-auto scrollbar-none flex-1">
          <table className="w-full text-left border-collapse text-xs text-secondary">
            <thead>
              <tr className="border-b border-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-wider">
                <th className="px-4 py-3.5 w-12 text-center">#</th>
                <th className="px-4 py-3.5">Cliente</th>
                <th className="px-4 py-3.5 text-center">Projetos</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-4 py-3.5 text-right">Volume</th>
                <th className="px-4 py-3.5 text-right w-40">Participação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/10 font-medium">
              {topClients.map((client, index) => (
                <tr key={client.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3 text-center text-zinc-800 font-bold">{index + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className={`size-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${getAvatarColor(client.name)}`}>
                        {client.name.charAt(0).toUpperCase()}
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-zinc-800 truncate">{client.name}</span>
                        <span className="text-[10px] text-zinc-800 truncate">{client.companyName}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-zinc-800 font-semibold">{client.projectsCount}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-block ${getStatusBadgeClass(client.status)}`}>
                      {getStatusLabel(client.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-zinc-800 text-nowrap font-bold">{formatCurrency(client.billed)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2.5">
                      <span className="text-zinc-800 font-bold text-[10px]">{client.percentage}%</span>
                      <div className="w-16 h-1.5 bg-white rounded-full overflow-hidden shrink-0">
                        <div className="bg-primary h-full rounded-full" style={{ width: `${client.percentage}%` }} />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
