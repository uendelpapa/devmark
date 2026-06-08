import { createFileRoute } from '@tanstack/react-router'
import { Sidebar } from '../components/Sidebar'
import { Header } from '../components/Header'
import { TimerTracker, TimerProvider } from '../components/TimerTracker'
import {
  Button,
  Card,
  CardContent
} from '@heroui/react'
import { Plus } from '@gravity-ui/icons'
import { useCallback, useMemo, useState, useEffect } from 'react'
import { fetchDashboardData } from '../services/api'
import type { DashboardData } from '../services/api'
import { StatCard, StatCardSkeleton } from '../components/StatCard'
import { FinanceCard, FinanceCardSkeleton } from '../components/FinanceCard'
import { ProjectListItem, ProjectListItemSkeleton } from '../components/ProjectListItem'
import { PaymentListItem, PaymentListItemSkeleton } from '../components/PaymentListItem'

export const Route = createFileRoute('/')(
{
  component: Home
})

// --- Presentation helpers (frontend responsibility) ---

function formatCurrency(value: number): string {
  return `R$ ${value.toLocaleString('pt-BR')}`
}

function mapProjectSummaryToStatCards(data: DashboardData) {
  const { total, completed, in_progress, planning } = data.project_summary
  return [
    {
      title: 'Total de Projetos',
      value: total,
      indicator: 'down' as const,
      indicatorText: 'abaixo do mês passado',
      variant: 'primary' as const
    },
    {
      title: 'Projetos Finalizados',
      value: completed,
      indicator: 'up' as const,
      indicatorText: 'acima do mês passado',
      variant: 'zinc' as const
    },
    {
      title: 'Projetos Iniciados',
      value: in_progress,
      indicator: 'info' as const,
      indicatorText: 'poucos projetos iniciados',
      variant: 'zinc' as const
    },
    {
      title: 'Projetos Pendentes',
      value: planning,
      indicator: 'info' as const,
      indicatorText: 'nenhum projeto pendente',
      variant: 'zinc' as const
    }
  ]
}

function mapFinanceSummaryToCards(data: DashboardData) {
  const { total_paid, total_expenses, total_pending } = data.finance_summary
  return [
    {
      title: 'Entrada',
      value: formatCurrency(total_paid),
      indicator: 'down' as const,
      indicatorText: 'abaixo do mês anterior'
    },
    {
      title: 'Gastos c/ ferramentas',
      value: formatCurrency(total_expenses),
      indicator: 'up' as const,
      indicatorText: 'pouco acima do mês anterior'
    },
    {
      title: 'A Receber',
      value: formatCurrency(total_pending),
      indicator: 'up' as const,
      indicatorText: 'acima do mês anterior'
    }
  ]
}

function Home() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    fetchDashboardData().then((res) => {
      if (isMounted) {
        setData(res)
        setIsLoading(false)
      }
    })
    return () => {
      isMounted = false
    }
  }, [])

  // Derive presentation data from raw API response
  const stats = useMemo(() => data ? mapProjectSummaryToStatCards(data) : [], [data])
  const finances = useMemo(() => data ? mapFinanceSummaryToCards(data) : [], [data])
  const projects = data?.projects || []
  const pendingPayments = data?.pending_payments || []

  const handleStatCardAction = useCallback((title: string) => {
    console.log(`Visualizar detalhes de: ${title}`)
  }, [])

  const handleProjectAction = useCallback((projectName: string) => {
    console.log(`Abrir pasta do projeto: ${projectName}`)
  }, [])

  const handlePaymentAction = useCallback((personName: string) => {
    console.log(`Enviar comentário para: ${personName}`)
  }, [])

  return (
    <TimerProvider>
      <div className="flex h-screen w-screen bg-backpage font-sans overflow-hidden select-none">
        {/* Sidebar Component */}
        <Sidebar />

        {/* Right Side Column containing Navbar and Main Content Card */}
        <div className="flex-1 flex flex-col px-4.5 py-2.25 gap-2 h-full min-w-0">
          {/* Top Navbar Card */}
          <Header />

          {/* Main Content Dashboard Panel */}
          <div className="bg-white rounded-[24px] p-6 overflow-y-auto min-w-0 max-h-[calc(100vh-100px)] h-fit scrollbar-none">
            {/* Page Heading & Main Actions */}
            <div className="flex justify-between items-start shrink-0 mb-4">
              <div className='space-y-4'>
                <h1 className="text-3xl font-semibold tracking-tight text-secondary leading-none">
                  Dashboard
                </h1>
                <p className="text-secondary leading-none">
                  Planeje, priorize e acompanhe suas tarefas com facilidade.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  size='lg'
                  className="bg-primary/50 hover:bg-[#a9e278] text-secondary font-bold rounded-full px-6 py-3 cursor-pointer shadow-xs text-[14px] flex items-center gap-1.5 border-none"
                >
                  <Plus className="stroke-[2.5]" width={16} height={16} /> Novo Projeto
                </Button>
                <Button
                  size='lg'
                  className="bg-[#E5E7EB] hover:bg-neutral-300 text-secondary font-bold rounded-full px-6 py-3 cursor-pointer shadow-xs text-[14px] border-none"
                >
                  Importar Dados
                </Button>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-4 gap-2 mb-2 shrink-0">
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
                : stats.map((stat) => (
                    <StatCard
                      key={stat.title}
                      title={stat.title}
                      value={stat.value}
                      indicator={stat.indicator}
                      indicatorText={stat.indicatorText}
                      variant={stat.variant}
                      onAction={handleStatCardAction}
                    />
                  ))}
            </div>

            {/* Lower Rows: Grid with 3 columns */}
            <div className="grid grid-cols-12 gap-2 items-start">
              {/* Left Column: Finanças & Nível de trabalho */}
              <div className="col-span-6 flex flex-col gap-2">
                {/* Finanças Card */}
                <Card className="p-0 bg-zinc-100 border-none shadow-none rounded-[24px]">
                  <CardContent className="space-y-4 p-0 text-secondary">
                    <h3 className="font-semibold px-6 pt-6">Finanças</h3>
                    <div className="flex gap-2 overflow-x-auto px-6 pb-6 scrollbar-none">
                      {isLoading
                        ? Array.from({ length: 3 }).map((_, i) => <FinanceCardSkeleton key={i} />)
                        : finances.map((finance) => (
                            <FinanceCard
                              key={finance.title}
                              title={finance.title}
                              value={finance.value}
                              indicator={finance.indicator}
                              indicatorText={finance.indicatorText}
                            />
                          ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Nível de trabalho Card */}
                <Card className="bg-[#F4F4F6] border-none shadow-none rounded-[24px] p-6 text-secondary flex flex-col justify-between">
                  <CardContent className="p-0">
                    <h3 className="font-semibold">Nível de trabalho</h3>
                    {/* Custom Styled Bar Chart */}
                    <div className="w-full flex items-end justify-between gap-3 px-2">
                      {/* Mon */}
                      <div className="flex-1 flex flex-col items-center gap-2">
                        <div className="flex w-full max-w-[256px] h-[108px] bg-[#BAF08A] rounded-full transition-all hover:opacity-90" />
                        <span className="text-xl font-medium">s</span>
                      </div>
                      {/* Tue */}
                      <div className="flex-1 flex flex-col items-center gap-2">
                        <div className="flex w-full max-w-[256px] h-[146px] bg-[#8cb870] rounded-full transition-all hover:opacity-90" />
                        <span className="text-xl font-medium">t</span>
                      </div>
                      {/* Wed */}
                      <div className="flex-1 flex flex-col items-center gap-2">
                        <div className="flex w-full max-w-[256px] h-[88px] bg-[#BAF08A] rounded-full transition-all hover:opacity-90" />
                        <span className="text-xl font-medium">q</span>
                      </div>
                      {/* Thu */}
                      <div className="flex-1 flex flex-col items-center gap-2">
                        {/* Dotted texture using CSS linear-gradients */}
                        <div
                          className="flex w-full max-w-[256px] h-[182px] rounded-full transition-all hover:opacity-90 border-[1.5px] border-secondary"
                          style={{
                            backgroundImage: 'radial-gradient(#8cb870 20%, transparent 20%), radial-gradient(#8cb870 20%, #BAF08A 20%)',
                            backgroundSize: '6px 6px',
                            backgroundPosition: '0 0, 3px 3px'
                          }}
                        />
                        <span className="text-xl font-medium">q</span>
                      </div>
                      {/* Fri */}
                      <div className="flex-1 flex flex-col items-center gap-2">
                        <div className="flex w-full max-w-[256px] h-[120px] bg-[#BAF08A] rounded-full transition-all hover:opacity-90" />
                        <span className="text-xl font-medium">s</span>
                      </div>
                      {/* Sat */}
                      <div className="flex-1 flex flex-col items-center gap-2">
                        <div
                          className="flex w-full max-w-[256px] h-[86px] rounded-full transition-all hover:opacity-90 border-[1.5px] border-secondary"
                          style={{
                            backgroundImage: 'radial-gradient(#8cb870 25%, transparent 25%)',
                            backgroundSize: '8px 8px',
                            backgroundColor: '#BAF08A'
                          }}
                        />
                        <span className="text-xl font-medium">s</span>
                      </div>
                      {/* Sun */}
                      <div className="flex-1 flex flex-col items-center gap-2">
                        <div className="flex w-full max-w-[256px] h-[65px] bg-[#BAF08A] rounded-full transition-all hover:opacity-90" />
                        <span className="text-xl font-medium">d</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Middle Column: Projetos List */}
              <div className="col-span-3">
                <Card className="h-[542px] bg-zinc-100 border-none shadow-none rounded-[24px] p-6 text-secondary">
                  <CardContent className="p-0 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4 shrink-0">
                      <h3 className="font-semibold">Projetos</h3>
                      <Button size='lg' className="size-9 rounded-full bg-secondary text-primary-light flex items-center justify-center cursor-pointer hover:bg-secondary hover:opacity-90 border-none shadow-md shadow-black/40">
                        <Plus width={16} height={16} />
                      </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 scrollbar-none">
                      {isLoading
                        ? Array.from({ length: 5 }).map((_, i) => <ProjectListItemSkeleton key={i} />)
                        : projects.map((project) => (
                            <ProjectListItem
                              key={project.id}
                              name={project.name}
                              date={project.expected_delivery_date}
                              onAction={handleProjectAction}
                            />
                          ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Timer Tracker & Pagamentos Pendentes */}
              <div className="col-span-3 flex flex-col gap-2">
                {/* Embedded Timer Tracker */}
                <div className="w-full">
                  <TimerTracker variant="dashboard" />
                </div>

                {/* Pagamentos Pendentes Card */}
                <Card className="bg-[#F4F4F6] border-none shadow-none rounded-[24px] p-6 text-secondary h-[372px]">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold leading-tight">Pagamentos pendentes</h3>
                      <span className="font-semibold text-secondary/60">{isLoading ? '...' : pendingPayments.length}</span>
                    </div>

                    <div className="flex flex-col gap-3 overflow-y-auto h-[300px] scrollbar-none">
                      {isLoading
                        ? Array.from({ length: 5 }).map((_, i) => <PaymentListItemSkeleton key={i} />)
                        : pendingPayments.map((person) => (
                            <PaymentListItem
                              key={person.payment_id}
                              name={person.client_name}
                              email={person.client_email}
                              onAction={handlePaymentAction}
                            />
                          ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TimerProvider>
  )
}
