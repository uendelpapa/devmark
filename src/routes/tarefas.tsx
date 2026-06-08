import { createFileRoute } from '@tanstack/react-router'
import { Sidebar } from '../components/Sidebar'
import { Header } from '../components/Header'
import { TimerProvider } from '../components/TimerTracker'
import { Button } from '@heroui/react'
import { useState } from 'react'
import {
  Plus,
  LayoutHeaderCells,
  ListUl,
  LayoutRows
} from '@gravity-ui/icons'
import { mockTasks } from '../components/tarefas/taskData'
import { KanbanView } from '../components/tarefas/KanbanView'
import { ListView } from '../components/tarefas/ListView'
import { TableView } from '../components/tarefas/TableView'

export const Route = createFileRoute('/tarefas')({
  component: Tarefas
})

type ViewMode = 'kanban' | 'list' | 'table'

const viewButtons: { key: ViewMode; label: string; icon: typeof LayoutHeaderCells }[] = [
  { key: 'kanban', label: 'Kanban', icon: LayoutHeaderCells },
  { key: 'list', label: 'List', icon: ListUl },
  { key: 'table', label: 'Table', icon: LayoutRows }
]

function Tarefas() {
  const [view, setView] = useState<ViewMode>('table')

  const todoTasks = mockTasks.filter(t => t.status === 'TODO')
  const doingTasks = mockTasks.filter(t => t.status === 'DOING')
  const doneTasks = mockTasks.filter(t => t.status === 'DONE')

  return (
    <TimerProvider>
      <div className="flex h-screen w-screen bg-backpage font-sans overflow-hidden select-none">
        <Sidebar />
        <div className="flex-1 flex flex-col px-4.5 py-2.25 gap-2 h-full min-w-0">
          <Header />

          <div className="bg-white rounded-[24px] p-8 overflow-hidden min-w-0 flex-1 flex flex-col">

            {/* Action Bar */}
            <div className="flex items-center justify-between mb-8 shrink-0">
              <div className="flex items-center gap-8">
                <h1 className="text-[32px] font-bold tracking-tight text-secondary leading-none">
                  Tarefas
                </h1>

                <div className="flex items-center gap-2">
                  {viewButtons.map(({ key, label, icon: Icon }) => (
                    <Button
                      key={key}
                      onPress={() => setView(key)}
                      className={`${
                        view === key
                          ? 'bg-[#D4E9C6] text-[#334621] hover:bg-[#C2E0AF]'
                          : 'bg-[#13311E] text-white hover:bg-[#1C462C]'
                      } font-bold rounded-full px-5 h-10 border-none text-[14px] transition-colors flex items-center gap-2`}
                    >
                      <Icon className="size-4" />
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  className="bg-[#D4E9C6] hover:bg-[#C2E0AF] text-[#334621] font-bold rounded-full px-6 h-10 border-none text-[14px] transition-colors flex items-center gap-2"
                >
                  <Plus className="size-4" />
                  Adicionar Tarefa
                </Button>
                <Button
                  className="bg-zinc-200 hover:bg-zinc-300 text-secondary font-bold rounded-full px-6 h-10 border-none text-[14px] transition-colors"
                >
                  Importar Dados
                </Button>
              </div>
            </div>

            {/* Content Views */}
            {view === 'kanban' && (
              <KanbanView todoTasks={todoTasks} doingTasks={doingTasks} doneTasks={doneTasks} />
            )}
            {view === 'list' && (
              <ListView todoTasks={todoTasks} doingTasks={doingTasks} doneTasks={doneTasks} />
            )}
            {view === 'table' && (
              <TableView tasks={mockTasks} />
            )}

          </div>
        </div>
      </div>
    </TimerProvider>
  )
}
