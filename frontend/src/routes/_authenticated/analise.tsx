import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchAnalyticsData } from '../../services/api'
import { Select, SelectItem } from '../../components/ui/Select'
import { CircleDollar, Clock, Folder, Persons } from '@gravity-ui/icons'
import { ArrowDown, ArrowUp, Download, Plus } from 'lucide-react'
import { Button } from '#/components/ui/Button'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts'

export const Route = createFileRoute('/_authenticated/analise')({
  component: AnalisePage,
})

function formatCurrency(value: number): string {
  return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

function getAvatarColor(name: string): string {
  const colors = [
    'bg-[#BAF08A]/30 text-secondary',
    'bg-sky-100 text-sky-700',
    'bg-purple-100 text-purple-700',
    'bg-orange-100 text-orange-700',
    'bg-pink-100 text-pink-700',
    'bg-teal-100 text-teal-700',
  ]
  let sum = 0
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i)
  }
  return colors[sum % colors.length]
}

function getStatusBadgeClass(status: string): string {
  switch (status.toUpperCase()) {
    case 'ACTIVE':
      return 'text-secondary bg-primary border border-lime-200'
    case 'LEAD':
      return 'text-sky-700 bg-sky-100 border border-sky-200'
    case 'NEGOTIATING':
      return 'text-purple-700 bg-purple-100 border border-purple-200'
    case 'LOST':
      return 'text-red-700 bg-red-100 border border-red-200'
    default:
      return 'text-zinc-700 bg-zinc-100 border border-zinc-200'
  }
}

function getStatusLabel(status: string): string {
  switch (status.toUpperCase()) {
    case 'ACTIVE':
      return 'Ativo'
    case 'LEAD':
      return 'Lead'
    case 'NEGOTIATING':
      return 'Em Negociação'
    case 'LOST':
      return 'Perdido'
    default:
      return status
  }
}

const CATEGORY_COLORS: Record<string, string> = {
  AI: '#BAF08A',
  SOFTWARE: '#38BDF8',
  DOMAIN: '#C084FC',
  HOSTING: '#F472B6',
  DESIGN: '#FB923C',
  ADS: '#FACC15',
  FREELANCER: '#2DD4BF',
  OTHER: '#A9A9A9'
}

function AnalisePage() {
  const navigate = useNavigate()
  const [months, setMonths] = useState<string>('6')
  const monthsCount = parseInt(months, 10) || 6

  // 1. Query para os dados gerais da página (fixado em 6 meses)
  const { data: pageData, isLoading: isLoadingPage } = useQuery({
    queryKey: ['analyticsPage'],
    queryFn: () => fetchAnalyticsData(6),
  })

  // 2. Query para o gráfico de desempenho financeiro (dinâmico conforme dropdown)
  const { data: chartData, isLoading: isLoadingChart, isFetching: isFetchingChart } = useQuery({
    queryKey: ['analyticsChart', monthsCount],
    queryFn: () => fetchAnalyticsData(monthsCount),
  })

  const kpis = useMemo(() => pageData?.kpis || {
    revenue: { value: 0, diff: 0, isPositive: true },
    conversion: { value: 0, diff: 0, isPositive: true },
    activeProjects: { value: 0, diff: 0, isPositive: true },
    hours: { value: 0, diff: 0, isPositive: true }
  }, [pageData])

  const quickStats = useMemo(() => chartData?.quickStats || { totalRecebido: 0, totalDespesas: 0, saldoLiquido: 0 }, [chartData])
  const monthlyData = useMemo(() => chartData?.monthlyData || [], [chartData])
  const crmFunnel = useMemo(() => pageData?.crmFunnel || [], [pageData])
  const totalClients = useMemo(() => crmFunnel.reduce((acc, curr) => acc + curr.count, 0), [crmFunnel])
  const costDistribution = useMemo(() => pageData?.costDistribution || [], [pageData])
  const topClients = useMemo(() => pageData?.topClients || [], [pageData])
  const workedHoursByProject = useMemo(() => pageData?.workedHoursByProject || [], [pageData])

  // Custom tooltips to fit the Devmark theme
  const CustomTooltip = ({ active, payload, label }: any) => {
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
                <span className='text-secondary'>
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

  if (isLoadingPage) {
    return (
      <div className="bg-white rounded-[24px] p-6 overflow-y-auto min-w-0 max-h-[calc(100vh-100px)] h-fit scrollbar-none flex flex-col gap-2">
        <div className="flex justify-between items-center animate-pulse">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-zinc-200 rounded-lg" />
            <div className="h-4 w-72 bg-zinc-200 rounded-lg" />
          </div>
          <div className="h-10 w-44 bg-zinc-200 rounded-full" />
        </div>

        <div className="grid grid-cols-12 gap-4 animate-pulse">
          <div className="col-span-4 grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 bg-zinc-100 border border-zinc-200 rounded-[24px]" />
            ))}
          </div>
          <div className="col-span-8 h-64 bg-zinc-50 border border-zinc-200 rounded-[24px]" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-[24px] p-6 overflow-y-auto min-w-0 max-h-[calc(100vh-100px)] h-fit scrollbar-none flex flex-col gap-2">
      {/* Title Header with Export/New Action Buttons */}
      <div className="flex justify-between items-center shrink-0 mb-6">
        <div>
          <h1 className="text-3xl font-medium tracking-tight text-secondary leading-none">
            Análise
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="lg"
            variant="zinc"
            className="flex items-center gap-1.5"
            onPress={() => console.log('Exportar Relatório')}
          >
            <Download className="size-4" /> Exportar
          </Button>
          <Button
            size="lg"
            onPress={() => navigate({ to: '/clientes/novo' })}
            className="flex items-center gap-1.5"
          >
            <Plus className="size-4" /> Novo Cliente
          </Button>
        </div>
      </div>

      {/* Main Grid: Row 1 (2x2 KPI + Line Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 items-stretch">
        {/* KPI Grid (Top Left - 4 columns) */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Card 1: Revenue */}
          <div className="bg-primary/50 border border-primary rounded-3xl p-5 shadow-xs flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center justify-between w-full">
              <div className="p-2.5 rounded-full bg-primary text-secondary">
                <CircleDollar className="size-4" />
              </div>
              <span className={`flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${kpis.revenue.isPositive ? 'text-secondary bg-primary' : 'text-red-700 bg-red-100'
                }`}>
                {kpis.revenue.isPositive ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
                {Math.abs(kpis.revenue.diff)}%
              </span>
            </div>
            <div className="mt-4">
              <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Receita Total</span>
              <span className="text-2xl font-extrabold text-secondary tracking-tight">{formatCurrency(kpis.revenue.value)}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] text-secondary mt-1">
              <span>VS. Período anterior</span>
            </div>
          </div>

          {/* Card 2: Conversion Rate */}
          <div className="bg-zinc-100 border border-zinc-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center justify-between w-full">
              <div className="p-2.5 rounded-full bg-zinc-300 text-zinc-800">
                <Persons className="size-4" />
              </div>
              <span className={`flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${kpis.conversion.isPositive ? 'text-secondary bg-primary' : 'text-red-700 bg-red-100'
                }`}>
                {kpis.conversion.isPositive ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
                {Math.abs(kpis.conversion.diff)}%
              </span>
            </div>
            <div className="mt-4">
              <span className="text-[10px] font-bold text-zinc-800 uppercase tracking-wider block">Taxa de Conversão</span>
              <span className="text-2xl font-extrabold text-zinc-800 tracking-tight">{kpis.conversion.value}%</span>
            </div>
            <div className="flex justify-between items-center text-[10px] text-zinc-500 mt-1">
              <span>VS. Período anterior</span>
            </div>
          </div>

          {/* Card 3: Active Projects */}
          <div className="bg-zinc-100 border border-zinc-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center justify-between w-full">
              <div className="p-2.5 rounded-full bg-zinc-300 text-zinc-800">
                <Folder className="size-4" />
              </div>
              <span className={`flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${kpis.activeProjects.isPositive ? 'text-secondary bg-primary' : 'text-red-700 bg-red-100'
                }`}>
                {kpis.activeProjects.isPositive ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
                {Math.abs(kpis.activeProjects.diff)}%
              </span>
            </div>
            <div className="mt-4">
              <span className="text-[10px] font-bold text-zinc-800 uppercase tracking-wider block">Projetos Ativos</span>
              <span className="text-2xl font-extrabold text-secondary tracking-tight">{kpis.activeProjects.value}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] text-zinc-500 mt-1">
              <span>VS. Período anterior</span>
            </div>
          </div>

          {/* Card 4: Hours Worked */}
          <div className="bg-zinc-100 border border-zinc-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center justify-between w-full">
              <div className="p-2.5 rounded-full bg-zinc-300 text-zinc-800">
                <Clock className="size-4" />
              </div>
              <span className={`flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${kpis.hours.isPositive ? 'text-secondary bg-primary' : 'text-red-700 bg-red-100'
                }`}>
                {kpis.hours.isPositive ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
                {Math.abs(kpis.hours.diff)}%
              </span>
            </div>
            <div className="mt-4">
              <span className="text-[10px] font-bold text-zinc-800 uppercase tracking-wider block">Horas Trabalhadas</span>
              <span className="text-2xl font-extrabold text-zinc-800 tracking-tight">{kpis.hours.value}h</span>
            </div>
            <div className="flex justify-between items-center text-[10px] text-zinc-500 mt-1">
              <span>VS. Período anterior</span>
            </div>
          </div>
        </div>

        {/* Large Line/Area Chart Card (Right - 8 columns) */}
        <div className="group relative lg:col-span-7 bg-primary/50 border border-primary p-6 rounded-3xl flex flex-col justify-between min-h-[300px]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full mb-4">
            <div>
              <h3 className="font-extrabold text-base text-secondary">Desempenho Financeiro</h3>
              <p className="text-xs text-secondary">Fluxo histórico de receitas recebidas mensais.</p>
            </div>

            {/* Quick Metrics in the Middle Header */}
            {isLoadingChart || isFetchingChart ? (
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

          {isLoadingChart || isFetchingChart ? (
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
      </div>

      {/* Row 2: Worked Hours Bar Chart (Left 4 columns) + Funnel CRM (Right 8 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 items-stretch">
        {/* Worked Hours Bar Chart */}
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

        {/* Funnel CRM Chevron Pipeline */}
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
                <span className="text-base font-black text-secondary">{kpis.conversion.value}%</span>
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
      </div>

      {/* Row 3: Client Billing Table (Left 8 columns) + Expense Categories Bar Chart (Right 4 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 items-stretch">
        {/* Table of top clients */}
        <div className="lg:col-span-4 bg-primary/50 border border-primary p-6 rounded-3xl flex flex-col gap-4">
          <div className="flex justify-between items-center w-full">
            <div>
              <h3 className="font-extrabold text-base text-secondary">Desempenho por Cliente</h3>
              <p className="text-xs text-secondary ">Clientes mais valiosos ordenados pelo <br /> volume financeiro gerado.</p>
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
                          <span className={`size-9 rounded-full flex items-center justify-center  font-bold text-xs shrink-0 ${getAvatarColor(client.name)}`}>
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

        {/* Expense Categories Bar Chart */}
        <div className="lg:col-span-4 bg-zinc-100 border border-zinc-200 p-6 rounded-3xl flex flex-col justify-between min-h-[300px]">
          <div className="flex justify-between items-center w-full mb-4">
            <div>
              <h3 className="font-extrabold text-base text-secondary">Distribuição de Despesas</h3>
              <p className="text-xs text-secondary">Total investido por categoria no período.</p>
            </div>
            <span className="text-[10px] font-bold bg-primary text-secondary px-2 py-0.5 rounded-full uppercase">Categoria</span>
          </div>

          <div className="h-56 w-full mt-2">
            {costDistribution.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-secondary">Sem despesas registradas.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costDistribution} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="" />
                  <XAxis dataKey="category" stroke="#011d00" fontSize={9} tickLine={false} axisLine={false} />
                  <YAxis stroke="#011d00" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    name="Valor Gasto"
                    dataKey="value"
                    fill="#FB923C"
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
      </div>
    </div>
  )
}
