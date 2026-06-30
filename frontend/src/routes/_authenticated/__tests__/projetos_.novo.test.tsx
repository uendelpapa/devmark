import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Route } from '../projetos_.novo'
import { api } from '../../../lib/axios'
import { toast } from '../../../components/ui/Toast'
import { createProject, createProjectWithTasks } from '../../../services/api'

// Mocks
const navigateMock = vi.fn()
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => navigateMock,
  createFileRoute: () => (config: any) => ({
    options: config,
    ...config
  })
}))

vi.mock('../../../lib/axios', () => ({
  api: { post: vi.fn(), get: vi.fn() }
}))

vi.mock('../../../services/api', () => ({
  createProject: vi.fn(),
  createProjectWithTasks: vi.fn(),
  fetchClients: vi.fn().mockResolvedValue([
    { id: 'c1', name: 'Bob Inc' },
    { id: 'c2', name: 'Fred Tech' }
  ]),
}))

vi.mock('../../../components/ui/Toast', () => ({
  toast: { success: vi.fn(), error: vi.fn(), info: vi.fn() }
}))

let currentMockData: any = {}

vi.mock('react-hook-form', async () => {
  const actual = await vi.importActual('react-hook-form')
  return {
    ...actual,
    useForm: () => ({
      control: {},
      handleSubmit: (fn: any) => (e: any) => {
        e?.preventDefault()
        fn(currentMockData)
      },
      trigger: vi.fn().mockResolvedValue(true)
    }),
    Controller: ({ render }: any) => render({ 
      field: { name: 'test', value: '', onChange: vi.fn() }, 
      fieldState: { error: undefined } 
    })
  }
})

const queryClient = new QueryClient()
const Component = Route.options.component as any

describe('NovoProjeto Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    currentMockData = {
      client_id: 'c1',
      name: 'Test Project',
      area: 'DEVELOPER',
      specialty: 'FRONTEND',
      project_value: 1000,
      amount_received: 500,
      start_date: '2023-01-01',
      expected_delivery_date: '2023-12-31',
      estimated_hours: 100,
      priority: 'HIGH',
      status: 'PLANNING',
      create_tasks_ai: false
    }
  })

  it('deve criar projeto sem tarefas de IA quando create_tasks_ai for false', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Component />
      </QueryClientProvider>
    )
    
    const steps = ['Área de Atuação', 'Financeiro', 'Datas', 'Planejamento', 'Status']
    for (const stepTitle of steps) {
      fireEvent.click(screen.getByText('Próximo'))
      await waitFor(() => {
        expect(screen.getByText(stepTitle)).toBeTruthy()
      })
    }
    
    fireEvent.click(screen.getByText('Criar Projeto'))

    await waitFor(() => {
      const { create_tasks_ai, ...expectedData } = currentMockData
      expect(createProject).toHaveBeenCalledWith(expectedData)
      expect(toast.success).toHaveBeenCalledWith('Projeto criado com sucesso!')
      expect(navigateMock).toHaveBeenCalledWith({ to: '/projetos' })
    })
  })

  it('deve chamar a IA e criar projeto com tarefas quando create_tasks_ai for true', async () => {
    currentMockData.create_tasks_ai = true
    
    // Mock AI response
    const mockTasks = [{ title: 'Task 1', description: 'Desc 1', estimated_hours: 10 }]
    vi.mocked(api.post).mockResolvedValueOnce({
      data: { is_complete: true, tasks: mockTasks }
    })

    render(
      <QueryClientProvider client={queryClient}>
        <Component />
      </QueryClientProvider>
    )
    
    const steps = ['Área de Atuação', 'Financeiro', 'Datas', 'Planejamento', 'Status']
    for (const stepTitle of steps) {
      fireEvent.click(screen.getByText('Próximo'))
      await waitFor(() => {
        expect(screen.getByText(stepTitle)).toBeTruthy()
      })
    }
    
    fireEvent.click(screen.getByText('Criar Projeto'))

    await waitFor(() => {
      const { create_tasks_ai, ...expectedData } = currentMockData
      expect(api.post).toHaveBeenCalledWith('/ai/chat', expect.any(Object))
      expect(createProjectWithTasks).toHaveBeenCalledWith(expectedData, mockTasks)
      expect(toast.success).toHaveBeenCalledWith('Projeto e tarefas criados com sucesso!')
      expect(navigateMock).toHaveBeenCalledWith({ to: '/projetos' })
    })
  })

  it('deve fazer fallback para criação simples se a IA não retornar tarefas', async () => {
    currentMockData.create_tasks_ai = true
    
    // Mock AI response empty
    vi.mocked(api.post).mockResolvedValueOnce({
      data: { is_complete: false, tasks: [] }
    })

    render(
      <QueryClientProvider client={queryClient}>
        <Component />
      </QueryClientProvider>
    )
    
    const steps = ['Área de Atuação', 'Financeiro', 'Datas', 'Planejamento', 'Status']
    for (const stepTitle of steps) {
      fireEvent.click(screen.getByText('Próximo'))
      await waitFor(() => {
        expect(screen.getByText(stepTitle)).toBeTruthy()
      })
    }
    
    fireEvent.click(screen.getByText('Criar Projeto'))

    await waitFor(() => {
      const { create_tasks_ai, ...expectedData } = currentMockData
      expect(api.post).toHaveBeenCalledWith('/ai/chat', expect.any(Object))
      expect(createProject).toHaveBeenCalledWith(expectedData)
      expect(toast.success).toHaveBeenCalledWith('Projeto criado, mas não foi possível gerar tarefas.')
    })
  })
})
