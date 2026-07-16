import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchAnalyticsData } from '../../services/api'
import { CircleDollar, Clock, Folder, Persons } from '@gravity-ui/icons'
import { Download, Plus } from 'lucide-react'
import { Button } from '#/components/ui/Button'
import { formatCurrency } from '../../components/analise/utils'
import { KpiCard } from '../../components/analise/KpiCard'
import { FinancePerformanceChart } from '../../components/analise/FinancePerformanceChart'
import { TimeAllocationChart } from '../../components/analise/TimeAllocationChart'
import { CrmFunnelPipeline } from '../../components/analise/CrmFunnelPipeline'
import { ClientBillingTable } from '../../components/analise/ClientBillingTable'
import { DemandVolumeChart } from '../../components/analise/DemandVolumeChart'
import { ExpenseDistributionChart } from '../../components/analise/ExpenseDistributionChart'

export const Route = createFileRoute('/_authenticated/analise')({
  component: AnalisePage,
})

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
        {/* KPI Grid (Top Left - 5 columns) */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <KpiCard
            title="Receita Total"
            value={formatCurrency(kpis.revenue.value)}
            icon={<CircleDollar className="size-4" />}
            diff={kpis.revenue.diff}
            isPositive={kpis.revenue.isPositive}
            variant="primary"
          />
          <KpiCard
            title="Taxa de Conversão"
            value={`${kpis.conversion.value}%`}
            icon={<Persons className="size-4" />}
            diff={kpis.conversion.diff}
            isPositive={kpis.conversion.isPositive}
          />
          <KpiCard
            title="Projetos Ativos"
            value={kpis.activeProjects.value}
            icon={<Folder className="size-4" />}
            diff={kpis.activeProjects.diff}
            isPositive={kpis.activeProjects.isPositive}
          />
          <KpiCard
            title="Horas Trabalhadas"
            value={`${kpis.hours.value}h`}
            icon={<Clock className="size-4" />}
            diff={kpis.hours.diff}
            isPositive={kpis.hours.isPositive}
          />
        </div>

        {/* Large Line/Area Chart Card (Right - 7 columns) */}
        <FinancePerformanceChart
          months={months}
          setMonths={setMonths}
          isLoadingChart={isLoadingChart}
          isFetchingChart={isFetchingChart}
          quickStats={quickStats}
          monthlyData={monthlyData}
        />
      </div>

      {/* Row 2: Worked Hours Bar Chart (Left 5 columns) + Funnel CRM (Right 7 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 items-stretch">
        <TimeAllocationChart workedHoursByProject={workedHoursByProject} />
        <CrmFunnelPipeline
          crmFunnel={crmFunnel}
          totalClients={totalClients}
          conversionRate={kpis.conversion.value}
        />
      </div>

      {/* Row 3: Client Billing Table (Left 4 columns) + Demand Volume Chart (Middle 4 columns) + Expense Categories Bar Chart (Right 4 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 items-stretch">
        <ClientBillingTable topClients={topClients} />
        <DemandVolumeChart monthlyData={monthlyData} />
        <ExpenseDistributionChart costDistribution={costDistribution} />
      </div>
    </div>
  )
}
