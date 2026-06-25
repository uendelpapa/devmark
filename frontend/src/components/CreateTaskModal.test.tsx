// @vitest-environment jsdom
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { CreateTaskModal } from './CreateTaskModal'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as api from '../services/api'

// Mock the API calls
vi.mock('../services/api', () => ({
  fetchProjects: vi.fn(),
  fetchTasks: vi.fn(),
}))

if (typeof CSS === 'undefined') {
  (global as any).CSS = {};
}
if (!CSS.escape) {
  CSS.escape = (v: string) => v;
}

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('CreateTaskModal', () => {
  afterEach(() => {
    cleanup()
  })
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(api.fetchProjects).mockResolvedValue([
      {
        id: 'proj-123',
        name: 'Projeto Teste',
        description: 'Mock',
        status: 'PLANNING',
        priority: 'MEDIUM',
        expected_delivery_date: '2026-12-31',
        client_name: 'Bob',
        client_email: 'bob@test.com'
      }
    ])
    vi.mocked(api.fetchTasks).mockResolvedValue([])
  })

  it('renders correctly when open', () => {
    render(
      <CreateTaskModal 
        isOpen={true} 
        onClose={vi.fn()} 
        onSubmit={vi.fn()} 
      />,
      { wrapper: createWrapper() }
    )
    
    expect(screen.getByPlaceholderText('Nome da tarefa')).toBeDefined()
    expect(screen.getByText('Criar Tarefa')).toBeDefined()
  })

  it('does not render when closed', () => {
    const { container } = render(
      <CreateTaskModal 
        isOpen={false} 
        onClose={vi.fn()} 
        onSubmit={vi.fn()} 
      />,
      { wrapper: createWrapper() }
    )
    expect(container.firstChild).toBeNull()
  })

  it('submits correct payload', async () => {
    const handleSubmit = vi.fn()
    
    render(
      <CreateTaskModal 
        isOpen={true} 
        onClose={vi.fn()} 
        onSubmit={handleSubmit} 
      />,
      { wrapper: createWrapper() }
    )

    // Wait for projects query to resolve
    await waitFor(() => {
      expect(api.fetchProjects).toHaveBeenCalled()
    })

    // Fill in the title
    const titleInput = screen.getByPlaceholderText('Nome da tarefa')
    fireEvent.change(titleInput, { target: { value: 'Minha Nova Tarefa' } })

    // Select "Projeto Teste" in the native select element
    const projectSelect = screen.getByRole('combobox', { name: /projeto/i })
    fireEvent.change(projectSelect, { target: { value: 'proj-123' } })

    // Add a description
    const descInput = screen.getByPlaceholderText('Adicione uma descrição para esta tarefa...')
    fireEvent.change(descInput, { target: { value: 'Test description' } })

    // Change status to IN_PROGRESS
    const inProgressBtn = screen.getByRole('button', { name: 'Fazendo' })
    fireEvent.click(inProgressBtn)

    // Add a subtask
    const subtaskInput = screen.getByPlaceholderText('Nova subtask...')
    fireEvent.change(subtaskInput, { target: { value: 'Fazer testes' } })
    fireEvent.keyDown(subtaskInput, { key: 'Enter', code: 'Enter' })

    // Submit the form
    const submitBtn = screen.getByRole('button', { name: 'Criar Tarefa' })
    expect(submitBtn.hasAttribute('disabled')).toBeFalsy() // should not be disabled
    
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1)
      const payload = handleSubmit.mock.calls[0][0]
      expect(payload).toMatchObject({
        title: 'Minha Nova Tarefa',
        project_id: 'proj-123',
        description: 'Test description',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        subtasks: [{ text: 'Fazer testes' }]
      })
    })
  })
})
