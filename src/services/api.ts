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
  created_at: string
}

export interface Task {
  id: string
  project_id: string
  title: string
  status: 'PENDING' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED' | 'CANCELED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  estimated_hours?: number
  worked_hours?: number
  created_at: string
}

export interface ProjectExpense {
  id: string
  project_id: string
  title: string
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
  finance_summary: FinanceSummary
  projects: ProjectListItem[]
  pending_payments: PendingPaymentItem[]
}

// --- Mock Relational Database ---

const MOCK_CLIENTS: Client[] = [
  { id: 'c1', name: 'Bob', company_name: 'Bob Inc', document: '11.111.111/0001-11', email: 'bob@email.com', phone: '111', status: 'ACTIVE', preferred_communication: 'EMAIL', preferred_payment_method: 'PIX', created_at: '', updated_at: '' },
  { id: 'c2', name: 'Fred', company_name: 'Fred Tech', document: '22.222.222/0001-22', email: 'fred@email.com', phone: '222', status: 'ACTIVE', preferred_communication: 'WHATSAPP', preferred_payment_method: 'BANK_TRANSFER', created_at: '', updated_at: '' },
  { id: 'c3', name: 'Martha', company_name: 'Martha Corp', document: '33.333.333/0001-33', email: 'martha@email.com', phone: '333', status: 'ACTIVE', preferred_communication: 'MEETING', preferred_payment_method: 'CREDIT_CARD', created_at: '', updated_at: '' },
  { id: 'c4', name: 'Alice', company_name: 'Alice Soft', document: '44.444.444/0001-44', email: 'alice@email.com', phone: '444', status: 'ACTIVE', preferred_communication: 'WHATSAPP', preferred_payment_method: 'PIX', created_at: '', updated_at: '' },
  { id: 'c5', name: 'John', company_name: 'John Design', document: '55.555.555/0001-55', email: 'john@email.com', phone: '555', status: 'ACTIVE', preferred_communication: 'PHONE', preferred_payment_method: 'CASH', created_at: '', updated_at: '' },
  { id: 'c6', name: 'Lisa', company_name: 'Lisa Store', document: '66.666.666/0001-66', email: 'lisa@email.com', phone: '666', status: 'ACTIVE', preferred_communication: 'EMAIL', preferred_payment_method: 'PIX', created_at: '', updated_at: '' }
]

const MOCK_PROJECTS: Project[] = Array.from({ length: 33 }, (_, i) => {
  const id = i + 1
  let status: Project['status'] = 'REVIEW'
  if (id <= 11) {
    status = 'COMPLETED'
  } else if (id <= 13) {
    status = 'IN_PROGRESS'
  }

  return {
    id: `p${id}`,
    client_id: `c${(i % 6) + 1}`,
    name: `Projeto ${id}`,
    area: i % 2 === 0 ? 'DEVELOPER' as const : 'MARKETING' as const,
    status,
    priority: 'MEDIUM' as const,
    project_value: 5000,
    amount_received: 2500,
    amount_pending: 2500,
    expected_delivery_date: id === 1 ? '01/05' : id === 2 ? '03/05' : id === 3 ? '04/05' : id === 4 ? '22/06' : id === 5 ? '07/07' : id === 6 ? '07/08' : id === 7 ? '02/11' : id === 8 ? '06/11' : id === 9 ? '11/11' : '30/12',
    created_at: '',
    updated_at: ''
  }
})

const MOCK_PAYMENTS: Payment[] = [
  // Paid payments (Entrada) - Sums up to 1500
  { id: 'pay1', project_id: 'p1', amount: 1000, due_date: '2026-05-01', payment_date: '2026-05-01', status: 'PAID', created_at: '' },
  { id: 'pay2', project_id: 'p2', amount: 500, due_date: '2026-05-03', payment_date: '2026-05-03', status: 'PAID', created_at: '' },

  // Pending payments (A Receber) - Sums up to 4829
  { id: 'pay3', project_id: 'p1', amount: 1200, due_date: '2026-07-01', status: 'PENDING', created_at: '' },
  { id: 'pay4', project_id: 'p2', amount: 1000, due_date: '2026-07-05', status: 'PENDING', created_at: '' },
  { id: 'pay5', project_id: 'p3', amount: 800, due_date: '2026-07-10', status: 'PENDING', created_at: '' },
  { id: 'pay6', project_id: 'p4', amount: 900, due_date: '2026-07-15', status: 'PENDING', created_at: '' },
  { id: 'pay7', project_id: 'p5', amount: 429, due_date: '2026-07-20', status: 'PENDING', created_at: '' },
  { id: 'pay8', project_id: 'p6', amount: 500, due_date: '2026-07-25', status: 'PENDING', created_at: '' }
]

const MOCK_PROJECT_EXPENSES: ProjectExpense[] = [
  { id: 'exp1', project_id: 'p1', title: 'Domínio', category: 'DOMAIN', value: 80, created_at: '' },
  { id: 'exp2', project_id: 'p2', title: 'Hospedagem', category: 'HOSTING', value: 200, created_at: '' },
  { id: 'exp3', project_id: 'p3', title: 'Licença Software', category: 'SOFTWARE', value: 100, created_at: '' }
]

const MOCK_TASK_EXPENSES: TaskExpense[] = []

// --- API Endpoint ---

export async function fetchDashboardData(): Promise<DashboardData> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // 1. Aggregate project counts by status
  const project_summary: ProjectSummary = {
    total: MOCK_PROJECTS.length,
    completed: MOCK_PROJECTS.filter((p) => p.status === 'COMPLETED').length,
    in_progress: MOCK_PROJECTS.filter((p) => p.status === 'IN_PROGRESS').length,
    planning: MOCK_PROJECTS.filter((p) => p.status === 'PLANNING').length
  }

  // 2. Aggregate financial totals
  const finance_summary: FinanceSummary = {
    total_paid: MOCK_PAYMENTS
      .filter((p) => p.status === 'PAID')
      .reduce((sum, p) => sum + p.amount, 0),
    total_pending: MOCK_PAYMENTS
      .filter((p) => p.status === 'PENDING')
      .reduce((sum, p) => sum + p.amount, 0),
    total_expenses: MOCK_PROJECT_EXPENSES.reduce((sum, e) => sum + e.value, 0) +
                    MOCK_TASK_EXPENSES.reduce((sum, e) => sum + e.value, 0)
  }

  // 3. List of projects (first 9 for dashboard display)
  const projects: ProjectListItem[] = MOCK_PROJECTS.slice(0, 9).map((p) => ({
    id: p.id,
    name: p.name,
    expected_delivery_date: p.expected_delivery_date || '30/12'
  }))

  // 4. Pending payments with client info (joined via project)
  const pending_payments: PendingPaymentItem[] = MOCK_PAYMENTS
    .filter((p) => p.status === 'PENDING')
    .map((payment) => {
      const project = MOCK_PROJECTS.find((proj) => proj.id === payment.project_id)
      const client = MOCK_CLIENTS.find((c) => c.id === project?.client_id)
      return {
        payment_id: payment.id,
        amount: payment.amount,
        due_date: payment.due_date,
        client_name: client?.name || 'Cliente Oculto',
        client_email: client?.email || 'email@dominio.com'
      }
    })

  return {
    project_summary,
    finance_summary,
    projects,
    pending_payments
  }
}

// --- Projects Page Endpoint ---

export interface ProjectCardData {
  id: string
  name: string
  description: string
  status: Project['status']
  priority: Project['priority']
  expected_delivery_date: string
  client_name: string
  client_email: string
}

export async function fetchProjects(): Promise<ProjectCardData[]> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Status sort order: active work first, completed last
  const STATUS_ORDER: Record<Project['status'], number> = {
    IN_PROGRESS: 0,
    WAITING_CLIENT: 1,
    REVIEW: 2,
    PLANNING: 3,
    COMPLETED: 4,
    CANCELED: 5
  }

  return MOCK_PROJECTS.map((p) => {
    const client = MOCK_CLIENTS.find((c) => c.id === p.client_id)
    return {
      id: p.id,
      name: p.name,
      description: p.description || `Descrição do projeto ${p.name}`,
      status: p.status,
      priority: p.priority,
      expected_delivery_date: p.expected_delivery_date || '30/12',
      client_name: client?.name || 'Cliente Oculto',
      client_email: client?.email || 'email@dominio.com'
    }
  }).sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status])
}
