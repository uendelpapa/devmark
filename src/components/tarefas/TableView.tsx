import { useState, useMemo } from 'react'
import { Table, Checkbox, Pagination } from '@heroui/react'
import {
  Copy,
  Eye,
  Pencil,
  TrashBin,
  Dots9
} from '@gravity-ui/icons'
import type { Task } from './taskData'
import { UrgencyChip, WebTagChip } from './taskData'

const ROWS_PER_PAGE = 5

interface TableViewProps {
  tasks: Task[]
}

export function TableView({ tasks }: TableViewProps) {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(tasks.length / ROWS_PER_PAGE)
  const pages = useMemo(() => Array.from({ length: totalPages }, (_, i) => i + 1), [totalPages])

  const paginatedTasks = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE
    return tasks.slice(start, start + ROWS_PER_PAGE)
  }, [page, tasks])

  const start = (page - 1) * ROWS_PER_PAGE + 1
  const end = Math.min(page * ROWS_PER_PAGE, tasks.length)

  return (
    <div className="flex flex-col bg-[#B5C2AA] rounded-[24px] p-4 gap-0 overflow-hidden shrink-0">
      <Table className="[--table-border-color:transparent]">
        <Table.ScrollContainer>
          <Table.Content
            aria-label="Tabela de Tarefas"
            className="min-w-[900px] [&_.table__header-row]:bg-transparent [&_.table__row]:bg-white [&_.table__row:hover]:bg-zinc-50 [&_.table]:bg-white [&_.table]:rounded-[20px] [&_.table]:overflow-hidden"
          >
            <Table.Header className="bg-transparent">
              <Table.Column className="pr-0 bg-transparent text-[#4C5E41] font-semibold text-[13px]">
                <Checkbox aria-label="Selecionar todos" slot="selection">
                  <Checkbox.Control>
                    <Checkbox.Indicator />
                  </Checkbox.Control>
                </Checkbox>
              </Table.Column>
              <Table.Column isRowHeader className="bg-transparent text-[#4C5E41] font-semibold text-[13px]">ID</Table.Column>
              <Table.Column className="bg-transparent text-[#4C5E41] font-semibold text-[13px]">Projeto</Table.Column>
              <Table.Column className="bg-transparent text-[#4C5E41] font-semibold text-[13px]">Cliente</Table.Column>
              <Table.Column className="bg-transparent text-[#4C5E41] font-semibold text-[13px]">Tags</Table.Column>
              <Table.Column className="bg-transparent text-[#4C5E41] font-semibold text-[13px]">Data de entrega</Table.Column>
              <Table.Column className="bg-transparent text-[#4C5E41] font-semibold text-[13px] text-end">Ações</Table.Column>
            </Table.Header>
            <Table.Body>
              {paginatedTasks.map((task) => (
                <Table.Row key={task.id} id={task.id}>
                  <Table.Cell className="pr-0">
                    <div className="flex items-center gap-2">
                      <Dots9 className="size-4 text-zinc-300 shrink-0" />
                      <Checkbox aria-label={`Selecionar ${task.title}`} slot="selection" variant="secondary">
                        <Checkbox.Control>
                          <Checkbox.Indicator />
                        </Checkbox.Control>
                      </Checkbox>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="font-bold text-[14px] text-secondary">
                    <div className="flex items-center gap-2">
                      {task.taskId}
                      <Copy className="size-4 text-zinc-400 cursor-pointer hover:text-secondary transition-colors" />
                    </div>
                  </Table.Cell>
                  <Table.Cell className="font-bold text-[15px] text-secondary">{task.title}</Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-3">
                      <img
                        src={task.client.avatar}
                        alt={task.client.name}
                        className="size-8 rounded-full border border-zinc-200 bg-zinc-200 object-cover"
                      />
                      <div className="flex flex-col">
                        <span className="text-[13px] font-semibold text-secondary leading-tight">{task.client.name}</span>
                        <span className="text-[12px] text-secondary/60 leading-tight">{task.client.email}</span>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <UrgencyChip dueDate={task.dueDate} />
                      <WebTagChip />
                    </div>
                  </Table.Cell>
                  <Table.Cell className="text-[13px] font-medium text-secondary">{task.dueDate}</Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-2 justify-end">
                      <button className="size-8 rounded-full bg-zinc-200 flex items-center justify-center text-secondary hover:bg-zinc-300 transition-colors">
                        <Eye className="size-4" />
                      </button>
                      <button className="size-8 rounded-full bg-[#F4D35E] flex items-center justify-center text-[#6E5503] hover:bg-[#E2C355] transition-colors">
                        <Pencil className="size-4" />
                      </button>
                      <button className="size-8 rounded-full bg-[#96263A] flex items-center justify-center text-white hover:bg-[#7D1F2F] transition-colors">
                        <TrashBin className="size-4" />
                      </button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>

        <Table.Footer className="bg-transparent border-none">
          <Pagination size="sm">
            <Pagination.Summary className="text-[#4C5E41] font-semibold text-[13px]">
              {start} to {end} of {tasks.length} results
            </Pagination.Summary>
            <Pagination.Content>
              <Pagination.Item>
                <Pagination.Previous
                  isDisabled={page === 1}
                  onPress={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <Pagination.PreviousIcon />
                  Prev
                </Pagination.Previous>
              </Pagination.Item>
              {pages.map((p) => (
                <Pagination.Item key={p}>
                  <Pagination.Link isActive={p === page} onPress={() => setPage(p)}>
                    {p}
                  </Pagination.Link>
                </Pagination.Item>
              ))}
              <Pagination.Item>
                <Pagination.Next
                  isDisabled={page === totalPages}
                  onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                  <Pagination.NextIcon />
                </Pagination.Next>
              </Pagination.Item>
            </Pagination.Content>
          </Pagination>
        </Table.Footer>
      </Table>
    </div>
  )
}
