// --- ERD Models matching shared structures ---

export interface Client {
  id: string
  name: string
  company_name: string
  document: string
  email: string
  phone: string
  status: 'LEAD' | 'NEGOTIATING' | 'ACTIVE' | 'INACTIVE' | 'LOST'
  preferred_communication: 'WHATSAPP' | 'EMAIL' | 'PHONE' | 'MEETING'
  preferred_payment_method: 'PIX' | 'BANK_TRANSFER' | 'CREDIT_CARD' | 'CASH'
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  client_id: string
  name: string
  description?: string
  area: 'MARKETING' | 'DEVELOPER'
  status: 'PLANNING' | 'IN_PROGRESS' | 'WAITING_CLIENT' | 'REVIEW' | 'COMPLETED' | 'CANCELED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  project_value: number
  amount_received: number
  amount_pending: number
  estimated_hours?: number
  worked_hours?: number
  start_date?: string
  expected_delivery_date?: string
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  project_id: string
  amount: number
  due_date: string
  payment_date?: string
  payment_method?: 'PIX' | 'BANK_TRANSFER' | 'CREDIT_CARD' | 'CASH'
  status: 'PENDING' | 'OVERDUE' | 'PAID' | 'CANCELED'
  notes?: string
  created_at: string
}

export interface Subtask {
  id: string
  task_id: string
  text: string
  completed: boolean
  created_at?: string
  updated_at?: string
}

export interface Task {
  id: string
  project_id: string
  title: string
  description?: string
  status: 'PENDING' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED' | 'CANCELED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  estimated_hours?: number
  worked_hours?: number
  due_date?: string
  tags?: string[]
  subtasks?: Subtask[]
  created_at: string
}

export interface TimeEntry {
  id: string
  project_id: string
  task_id: string
  description?: string
  start_time: string
  end_time?: string
  duration?: number
  created_at: string
}


export interface ProjectExpense {
  id: string
  project_id: string
  title: string
  description?: string
  category: 'AI' | 'SOFTWARE' | 'DOMAIN' | 'HOSTING' | 'DESIGN' | 'ADS' | 'FREELANCER' | 'OTHER'
  value: number
  created_at: string
}

export interface TaskExpense {
  id: string
  task_id: string
  title: string
  category: 'AI' | 'SOFTWARE' | 'DOMAIN' | 'HOSTING' | 'DESIGN' | 'ADS' | 'FREELANCER' | 'OTHER'
  value: number
  created_at: string
}

// --- API Response Types (clean backend contracts) ---

export interface ProjectSummary {
  total: number
  completed: number
  in_progress: number
  planning: number
}

export interface FinanceSummary {
  total_paid: number
  total_pending: number
  total_expenses: number
}

export interface ProjectListItem {
  id: string
  name: string
  expected_delivery_date: string
}

export interface PendingPaymentItem {
  payment_id: string
  amount: number
  due_date: string
  client_name: string
  client_email: string
}

export interface DashboardData {
  project_summary: ProjectSummary
  prev_project_summary?: ProjectSummary
  finance_summary: FinanceSummary
  prev_finance_summary?: FinanceSummary
  projects: ProjectListItem[]
  pending_payments: PendingPaymentItem[]
  weekly_work_level: number[]
}

export interface ProjectCardData {
  id: string
  name: string
  description: string
  status: Project['status']
  priority: Project['priority']
  expected_delivery_date: string
  client_name: string
  client_email: string
  totalTasks?: number
  completedTasks?: number
}

export interface ProjectDetails extends Project {
  client: { id: string; name: string; email: string }
  tasks: Task[]
  payments: Payment[]
  project_expenses: ProjectExpense[]
}

export interface ClientWithPaymentStatus extends Client {
  hasPendingPayment: boolean
}

export interface Service {
  id: string
  client_id: string
  user_id: string
  title: string
  description?: string
  status: 'PENDING' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED' | 'CANCELED'
  value: number
  amount_received: number
  amount_pending: number
  due_date?: string
  finished_at?: string
  created_at: string
  updated_at: string
  client?: { id: string; name: string; email: string }
}

export interface CreateServiceData {
  client_id: string
  title: string
  description?: string
  status?: Service['status']
  value?: number
  amount_received?: number
  due_date?: string
}

export interface UpdateServiceData extends Partial<CreateServiceData> {}

export interface ClientDetails extends Client {
  projects: {
    id: string
    name: string
    status: Project['status']
    project_value: number
    amount_received: number
  }[]
  services: Service[]
}


export interface TaskCardData extends Task {
  taskId: string
  dueDate: string | null
  description: string
  client: { name: string; email: string; avatar?: string }
}

export interface CreateTaskData {
  project_id: string
  title: string
  description?: string
  status?: Task['status']
  priority?: Task['priority']
  estimated_hours?: number
  due_date?: string
  tags?: string[]
  subtasks?: { text: string; completed?: boolean }[]
}

export interface CreatePaymentData {
  project_id: string
  amount: number
  due_date: string
  payment_date?: string
  payment_method?: Payment['payment_method']
  status?: Payment['status']
  notes?: string
}

export interface CreateProjectExpenseData {
  project_id: string
  title: string
  description?: string
  category: ProjectExpense['category']
  value: number
}

// --- Calendar Types ---

export interface Event {
  id: string
  project_id?: string
  title: string
  description?: string
  start_date: string
  end_date: string
  created_at: string
  project?: { id: string; name: string }
}

export interface CalendarItem {
  id: string
  title: string
  type: 'project' | 'task' | 'event'
  start: Date
  end?: Date
  status?: string
  priority?: string
  projectName?: string
  color: string
}

export type CalendarViewMode = 'day' | 'week' | 'month' | 'year'

// --- Analytics Types ---

export interface KpiItem {
  value: number
  diff: number
  isPositive: boolean
}

export interface AnalyticsKpis {
  revenue: KpiItem
  conversion: KpiItem
  activeProjects: KpiItem
  hours: KpiItem
}

export interface QuickStats {
  totalRecebido: number
  totalDespesas: number
  saldoLiquido: number
}

export interface CrmFunnelItem {
  stage: string
  count: number
  percentage: number
  color: string
}

export interface MonthlyAnalyticsItem {
  month: string
  receita: number
  aReceber: number
  despesas: number
  demandasCriadas: number
  demandasConcluidas: number
}

export interface CostDistributionItem {
  category: 'AI' | 'SOFTWARE' | 'DOMAIN' | 'HOSTING' | 'DESIGN' | 'ADS' | 'FREELANCER' | 'OTHER'
  value: number
  percentage: number
}

export interface TopClientItem {
  id: string
  name: string
  companyName: string
  status: string
  billed: number
  projectsCount: number
  percentage: number
}

export interface WorkedHoursItem {
  id: string
  name: string
  hours: number
}

export interface AnalyticsData {
  kpis: AnalyticsKpis
  quickStats: QuickStats
  monthlyData: MonthlyAnalyticsItem[]
  crmFunnel: CrmFunnelItem[]
  costDistribution: CostDistributionItem[]
  topClients: TopClientItem[]
  workedHoursByProject: WorkedHoursItem[]
}


