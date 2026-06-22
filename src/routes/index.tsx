import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { TimerTracker } from '../components/TimerTracker'
import {
  Button,
  Card,
  CardContent,
  Tooltip
} from '@heroui/react'
import { FilePlus, Plus } from '@gravity-ui/icons'
import { useCallback, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchDashboardData } from '../services/api'
import type { DashboardData } from '../services/api'
import { StatCard, StatCardSkeleton } from '../components/StatCard'
import { FinanceCard, FinanceCardSkeleton } from '../components/FinanceCard'
import { ProjectListItem, ProjectListItemSkeleton } from '../components/ProjectListItem'
import { PaymentListItem, PaymentListItemSkeleton } from '../components/PaymentListItem'
// Removed ProjectDetailsModal and useState for it

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
  const prev = data.prev_project_summary || { total: 0, completed: 0, in_progress: 0, planning: 0 }

  // 1. Total
  const totalDiff = total - prev.total
  const totalIndicator = totalDiff > 0 ? ('up' as const) : totalDiff < 0 ? ('down' as const) : ('info' as const)
  const totalText = totalDiff > 0 
    ? `+${totalDiff} referente ao mês passado` 
    : totalDiff < 0 
      ? `${totalDiff} referente ao mês passado` 
      : 'Sem alterações'

  // 2. Completed
  const completedDiff = completed - prev.completed
  const completedIndicator = completedDiff > 0 ? ('up' as const) : completedDiff < 0 ? ('down' as const) : ('info' as const)
  const completedText = completedDiff > 0 
    ? `+${completedDiff} referente ao mês passado` 
    : completedDiff < 0 
      ? `${completedDiff} referente ao mês passado` 
      : 'Sem alterações'

  // 3. In Progress
  const inProgressDiff = in_progress - prev.in_progress
  const inProgressIndicator = inProgressDiff > 0 ? ('up' as const) : inProgressDiff < 0 ? ('down' as const) : ('info' as const)
  const inProgressText = inProgressDiff > 0 
    ? `+${inProgressDiff} referente ao mês passado` 
    : inProgressDiff < 0 
      ? `${inProgressDiff} referente ao mês passado` 
      : 'Sem alterações'

  // 4. Planning (Pending)
  const planningDiff = planning - prev.planning
  const planningIndicator = planningDiff > 0 ? ('down' as const) : planningDiff < 0 ? ('up' as const) : ('info' as const)
  const planningText = planningDiff > 0 
    ? `+${planningDiff} referente ao mês passado` 
    : planningDiff < 0 
      ? `${planningDiff} referente ao mês passado` 
      : 'Sem alterações'

  return [
    {
      title: 'Total de Projetos',
      value: total,
      indicator: totalIndicator,
      indicatorText: totalText,
      variant: 'primary' as const
    },
    {
      title: 'Projetos Finalizados',
      value: completed,
      indicator: completedIndicator,
      indicatorText: completedText,
      variant: 'zinc' as const
    },
    {
      title: 'Projetos Iniciados',
      value: in_progress,
      indicator: inProgressIndicator,
      indicatorText: inProgressText,
      variant: 'zinc' as const
    },
    {
      title: 'Projetos Pendentes',
      value: planning,
      indicator: planningIndicator,
      indicatorText: planningText,
      variant: 'zinc' as const
    }
  ]
}

function mapFinanceSummaryToCards(data: DashboardData) {
  const { total_paid, total_expenses, total_pending } = data.finance_summary
  const prev = data.prev_finance_summary || { total_paid: 0, total_expenses: 0, total_pending: 0 }

  // 1. Paid
  const paidDiff = total_paid - prev.total_paid
  const paidIndicator = paidDiff > 0 ? ('up' as const) : paidDiff < 0 ? ('down' as const) : ('info' as const)
  const paidText = paidDiff > 0 
    ? `+${formatCurrency(paidDiff)} referente ao mês passado` 
    : paidDiff < 0 
      ? `-${formatCurrency(Math.abs(paidDiff))} referente ao mês passado` 
      : 'Sem alterações'

  // 2. Expenses
  const expensesDiff = total_expenses - prev.total_expenses
  const expensesIndicator = expensesDiff > 0 ? ('down' as const) : expensesDiff < 0 ? ('up' as const) : ('info' as const)
  const expensesText = expensesDiff > 0 
    ? `+${formatCurrency(expensesDiff)} referente ao mês passado` 
    : expensesDiff < 0 
      ? `-${formatCurrency(Math.abs(expensesDiff))} referente ao mês passado` 
      : 'Sem alterações'

  // 3. Pending
  const pendingDiff = total_pending - prev.total_pending
  const pendingIndicator = pendingDiff > 0 ? ('up' as const) : pendingDiff < 0 ? ('down' as const) : ('info' as const)
  const pendingText = pendingDiff > 0 
    ? `+${formatCurrency(pendingDiff)} referente ao mês passado` 
    : pendingDiff < 0 
      ? `-${formatCurrency(Math.abs(pendingDiff))} referente ao mês passado` 
      : 'Sem alterações'

  return [
    {
      title: 'Entrada',
      value: formatCurrency(total_paid),
      indicator: paidIndicator,
      indicatorText: paidText
    },
    {
      title: 'Gastos c/ ferramentas',
      value: formatCurrency(total_expenses),
      indicator: expensesIndicator,
      indicatorText: expensesText
    },
    {
      title: 'A Receber',
      value: formatCurrency(total_pending),
      indicator: pendingIndicator,
      indicatorText: pendingText
    }
  ]
}

function Home() {
  const navigate = useNavigate()
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData
  })

  // Derive presentation data from raw API response
  const stats = useMemo(() => data ? mapProjectSummaryToStatCards(data) : [], [data])
  const finances = useMemo(() => data ? mapFinanceSummaryToCards(data) : [], [data])
  const projects = data?.projects || []
  const pendingPayments = data?.pending_payments || []

  const weeklyWorkLevel = useMemo(() => data?.weekly_work_level || [0, 0, 0, 0, 0, 0, 0], [data])
  const maxHours = useMemo(() => Math.max(...weeklyWorkLevel, 0), [weeklyWorkLevel])

  const getBarHeight = useCallback((hours: number, defaultHeight: number) => {
    if (maxHours === 0) return defaultHeight
    const computed = Math.round((hours / maxHours) * 182)
    return Math.max(computed, 20)
  }, [maxHours])

  const handleStatCardAction = useCallback((title: string) => {
    let status = 'ALL'
    if (title === 'Projetos Finalizados') {
      status = 'COMPLETED'
    } else if (title === 'Projetos Iniciados') {
      status = 'IN_PROGRESS'
    } else if (title === 'Projetos Pendentes') {
      status = 'PLANNING'
    }
    navigate({ to: '/projetos', search: { status } })
  }, [navigate])

  const handleProjectAction = useCallback((projectId: string) => {
    navigate({ to: '/projetos/$projectId', params: { projectId } })
  }, [navigate])

  const handlePaymentAction = useCallback((personName: string) => {
    console.log(`Enviar comentário para: ${personName}`)
  }, [])

  return (
    <div className="bg-white rounded-[24px] p-6 overflow-y-auto min-w-0 max-h-[calc(100vh-100px)] h-fit scrollbar-none">
      {/* Page Heading & Main Actions */}
      <div className="flex justify-between items-start shrink-0 mb-4">
        <div className='space-y-4'>
          <h1 className="text-3xl font-medium tracking-tight text-secondary leading-none">
            Dashboard
          </h1>
          <p className="text-secondary leading-none">
            Planeje, priorize e acompanhe suas tarefas com facilidade.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            size='lg'
            className="bg-[#E5E7EB] hover:bg-neutral-300 text-secondary font-bold rounded-full px-6 py-3 cursor-pointer shadow-xs text-[14px] border-none"
          >
            Importar Dados
          </Button>
          <Button
            size='lg'
            onPress={() => navigate({ to: '/projetos/novo' })}
            className="bg-primary/50 hover:bg-primary text-secondary font-bold rounded-full cursor-pointer shadow-xs text-[14px] flex items-center gap-1.5 border-none"
          >
            <FilePlus className="stroke-[2.5]" width={16} height={16} /> Novo Projeto
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
                  <Tooltip>
                    <Tooltip.Trigger className="w-full flex justify-center items-end">
                      <div
                        style={{
                          height: `${getBarHeight(weeklyWorkLevel[0], 108)}px`,
                          animationDelay: '0ms'
                        }}
                        className="flex w-full max-w-[256px] bg-[#BAF08A] rounded-full chart-bar animate-grow-up"
                      />
                    </Tooltip.Trigger>
                    <Tooltip.Content
                      showArrow
                      placement="top"
                      className="bg-secondary text-primary-light font-semibold text-xs py-2 px-3.5 rounded-xl shadow-lg border border-primary/10"
                    >
                      Segunda-feira: {weeklyWorkLevel[0]}h
                    </Tooltip.Content>
                  </Tooltip>
                  <span className="text-xl font-medium">s</span>
                </div>
                {/* Tue */}
                <div className="flex-1 flex flex-col items-center gap-2">
                  <Tooltip>
                    <Tooltip.Trigger className="w-full flex justify-center items-end">
                      <div
                        style={{
                          height: `${getBarHeight(weeklyWorkLevel[1], 146)}px`,
                          animationDelay: '60ms'
                        }}
                        className="flex w-full max-w-[256px] bg-[#8cb870] rounded-full chart-bar animate-grow-up"
                      />
                    </Tooltip.Trigger>
                    <Tooltip.Content
                      showArrow
                      placement="top"
                      className="bg-secondary text-primary-light font-semibold text-xs py-2 px-3.5 rounded-xl shadow-lg border border-primary/10"
                    >
                      Terça-feira: {weeklyWorkLevel[1]}h
                    </Tooltip.Content>
                  </Tooltip>
                  <span className="text-xl font-medium">t</span>
                </div>
                {/* Wed */}
                <div className="flex-1 flex flex-col items-center gap-2">
                  <Tooltip>
                    <Tooltip.Trigger className="w-full flex justify-center items-end">
                      <div
                        style={{
                          height: `${getBarHeight(weeklyWorkLevel[2], 88)}px`,
                          animationDelay: '120ms'
                        }}
                        className="flex w-full max-w-[256px] bg-[#BAF08A] rounded-full chart-bar animate-grow-up"
                      />
                    </Tooltip.Trigger>
                    <Tooltip.Content
                      showArrow
                      placement="top"
                      className="bg-secondary text-primary-light font-semibold text-xs py-2 px-3.5 rounded-xl shadow-lg border border-primary/10"
                    >
                      Quarta-feira: {weeklyWorkLevel[2]}h
                    </Tooltip.Content>
                  </Tooltip>
                  <span className="text-xl font-medium">q</span>
                </div>
                {/* Thu */}
                <div className="flex-1 flex flex-col items-center gap-2">
                  <Tooltip>
                    <Tooltip.Trigger className="w-full flex justify-center items-end">
                      {/* Dotted texture using CSS linear-gradients */}
                      <div
                        className="flex w-full max-w-[256px] rounded-full border-[1.5px] border-secondary chart-bar animate-grow-up"
                        style={{
                          height: `${getBarHeight(weeklyWorkLevel[3], 182)}px`,
                          backgroundImage: 'radial-gradient(#8cb870 20%, transparent 20%), radial-gradient(#8cb870 20%, #BAF08A 20%)',
                          backgroundSize: '6px 6px',
                          backgroundPosition: '0 0, 3px 3px',
                          animationDelay: '180ms'
                        }}
                      />
                    </Tooltip.Trigger>
                    <Tooltip.Content
                      showArrow
                      placement="top"
                      className="bg-secondary text-primary-light font-semibold text-xs py-2 px-3.5 rounded-xl shadow-lg border border-primary/10"
                    >
                      Quinta-feira: {weeklyWorkLevel[3]}h
                    </Tooltip.Content>
                  </Tooltip>
                  <span className="text-xl font-medium">q</span>
                </div>
                {/* Fri */}
                <div className="flex-1 flex flex-col items-center gap-2">
                  <Tooltip>
                    <Tooltip.Trigger className="w-full flex justify-center items-end">
                      <div
                        style={{
                          height: `${getBarHeight(weeklyWorkLevel[4], 120)}px`,
                          animationDelay: '240ms'
                        }}
                        className="flex w-full max-w-[256px] bg-[#BAF08A] rounded-full chart-bar animate-grow-up"
                      />
                    </Tooltip.Trigger>
                    <Tooltip.Content
                      showArrow
                      placement="top"
                      className="bg-secondary text-primary-light font-semibold text-xs py-2 px-3.5 rounded-xl shadow-lg border border-primary/10"
                    >
                      Sexta-feira: {weeklyWorkLevel[4]}h
                    </Tooltip.Content>
                  </Tooltip>
                  <span className="text-xl font-medium">s</span>
                </div>
                {/* Sat */}
                <div className="flex-1 flex flex-col items-center gap-2">
                  <Tooltip>
                    <Tooltip.Trigger className="w-full flex justify-center items-end">
                      <div
                        className="flex w-full max-w-[256px] rounded-full border-[1.5px] border-secondary chart-bar animate-grow-up"
                        style={{
                          height: `${getBarHeight(weeklyWorkLevel[5], 86)}px`,
                          backgroundImage: 'radial-gradient(#8cb870 25%, transparent 25%)',
                          backgroundSize: '8px 8px',
                          backgroundColor: '#BAF08A',
                          animationDelay: '300ms'
                        }}
                      />
                    </Tooltip.Trigger>
                    <Tooltip.Content
                      showArrow
                      placement="top"
                      className="bg-secondary text-primary-light font-semibold text-xs py-2 px-3.5 rounded-xl shadow-lg border border-primary/10"
                    >
                      Sábado: {weeklyWorkLevel[5]}h
                    </Tooltip.Content>
                  </Tooltip>
                  <span className="text-xl font-medium">s</span>
                </div>
                {/* Sun */}
                <div className="flex-1 flex flex-col items-center gap-2">
                  <Tooltip>
                    <Tooltip.Trigger className="w-full flex justify-center items-end">
                      <div
                        style={{
                          height: `${getBarHeight(weeklyWorkLevel[6], 65)}px`,
                          animationDelay: '360ms'
                        }}
                        className="flex w-full max-w-[256px] bg-[#BAF08A] rounded-full chart-bar animate-grow-up"
                      />
                    </Tooltip.Trigger>
                    <Tooltip.Content
                      showArrow
                      placement="top"
                      className="bg-secondary text-primary-light font-semibold text-xs py-2 px-3.5 rounded-xl shadow-lg border border-primary/10"
                    >
                      Domingo: {weeklyWorkLevel[6]}h
                    </Tooltip.Content>
                  </Tooltip>
                  <span className="text-xl font-medium">d</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle Column: Projetos List */}
        <div className="col-span-3">
          <Card className="h-[542px] bg-zinc-100 border-none shadow-none rounded-[24px] p-6 text-secondary">
            <CardContent className="p-0 flex flex-col w-full h-full">
              <div className="flex items-center justify-between mb-4 shrink-0">
                <h3 className="font-semibold">Projetos</h3>
                <Button 
                  size='lg' 
                  onPress={() => navigate({ to: '/projetos/novo' })}
                  className="size-9 rounded-full bg-secondary text-primary-light flex items-center justify-center cursor-pointer hover:bg-secondary hover:opacity-90 border-none shadow-md shadow-black/40"
                >
                  <Plus width={16} height={16} />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 scrollbar-none">
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => <ProjectListItemSkeleton key={i} />)
                  : projects.map((project) => (
                    <ProjectListItem
                      key={project.id}
                      id={project.id}
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
          <Card className="bg-[#F4F4F6] border-none shadow-none rounded-[24px] p-6 text-secondary h-[352px]">
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
  )
}
