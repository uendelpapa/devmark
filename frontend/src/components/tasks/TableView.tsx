import { useState, useMemo } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Copy,
  Eye,
  Pencil,
  TrashBin,
  Grip,
  ChevronLeft,
  ChevronRight
} from '@gravity-ui/icons'
import { Table, Checkbox } from '@heroui/react'
import type { Task } from './taskData'
import { UrgencyChip } from './taskData'
import { Link } from '@tanstack/react-router'

const ROWS_PER_PAGE = 7

interface TableViewProps {
  tasks: Task[]
  onTaskStatusChange?: (taskId: string, newStatus: Task['status']) => void
  onTaskReorder?: (tasks: Task[]) => void
  onTaskClick?: (task: Task) => void
  onTaskDelete?: (taskId: string) => void
}

function SortableRow({ task, isFirst, isLast, onStatusChange, onClick, onDelete }: { task: Task, isFirst?: boolean, isLast?: boolean, onStatusChange?: (taskId: string, newStatus: Task['status']) => void, onClick?: (task: Task) => void, onDelete?: (taskId: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isDragging ? { zIndex: 50, position: 'relative' as const, opacity: 0.8 } : {})
  }

  const isDone = task.status === 'COMPLETED'
  const roundedClass = `${isFirst ? 'rounded-t-lg' : ''} ${isLast ? 'rounded-b-lg' : ''}`.trim()

  return (
    <Table.Row ref={setNodeRef} style={style} className={`${isDone ? "opacity-60" : ""} ${roundedClass}`}>
      <Table.Cell className="pr-0 px-4 py-3">
        <div className="flex items-center gap-2">
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 rounded">
            <Grip className="size-4 text-zinc-300 shrink-0 outline-none" />
          </div>
          <Checkbox
            slot={null}
            isSelected={isDone}
            onChange={(checked) => onStatusChange?.(task.id, checked ? 'COMPLETED' : 'PENDING')}
          >
            <Checkbox.Content>
              <Checkbox.Control>
                <Checkbox.Indicator />
              </Checkbox.Control>
            </Checkbox.Content>
          </Checkbox>
        </div>
      </Table.Cell>
      <Table.Cell className="font-bold text-[14px] text-secondary px-4 py-3">
        <div className="flex items-center gap-2">
          {task.taskId}
          <Copy className="size-4 text-zinc-400 cursor-pointer hover:text-secondary transition-colors" />
        </div>
      </Table.Cell>
      <Table.Cell className="font-bold text-[15px] text-secondary px-4 py-3">{task.title}</Table.Cell>
      <Table.Cell className="px-4 py-3">
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
      <Table.Cell className="px-4 py-3">
        <div className="flex items-center gap-2">
          <UrgencyChip dueDate={task.dueDate} />
        </div>
      </Table.Cell>
      <Table.Cell className="text-[13px] font-medium text-secondary px-4 py-3">{task.dueDate}</Table.Cell>
      <Table.Cell className="px-4 py-3">
        <div className="flex items-center gap-2 justify-end">
          <Link to="/tarefas/$taskId" params={{ taskId: task.id }} className="size-8 rounded-full bg-zinc-200 flex items-center justify-center text-secondary hover:bg-zinc-300 transition-colors border-none cursor-pointer">
            <Eye className="size-4" />
          </Link>
          <button onClick={() => onClick?.(task)} className="size-8 rounded-full bg-[#F4D35E] flex items-center justify-center text-[#6E5503] hover:bg-[#E2C355] transition-colors border-none cursor-pointer">
            <Pencil className="size-4" />
          </button>
          <button onClick={() => onDelete?.(task.id)} className="size-8 rounded-full bg-[#96263A] flex items-center justify-center text-white hover:bg-[#7D1F2F] transition-colors border-none cursor-pointer">
            <TrashBin className="size-4" />
          </button>
        </div>
      </Table.Cell>
    </Table.Row >
  )
}

export function TableView({ tasks, onTaskStatusChange, onTaskReorder, onTaskClick, onTaskDelete }: TableViewProps) {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(tasks.length / ROWS_PER_PAGE)
  const pages = useMemo(() => Array.from({ length: totalPages }, (_, i) => i + 1), [totalPages])

  const paginatedTasks = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE
    return tasks.slice(start, start + ROWS_PER_PAGE)
  }, [page, tasks])

  const start = (page - 1) * ROWS_PER_PAGE + 1
  const end = Math.min(page * ROWS_PER_PAGE, tasks.length)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id && onTaskReorder) {
      const oldIndex = tasks.findIndex(t => t.id === active.id)
      const newIndex = tasks.findIndex(t => t.id === over?.id)
      onTaskReorder(arrayMove(tasks, oldIndex, newIndex))
    }
  }

  const isAllDone = useMemo(() => {
    return paginatedTasks.length > 0 && paginatedTasks.every(t => t.status === 'COMPLETED')
  }, [paginatedTasks])

  const handleToggleAll = (checked: boolean) => {
    const targetStatus = checked ? 'COMPLETED' : 'PENDING'
    paginatedTasks.forEach(t => {
      if (t.status !== targetStatus) {
        onTaskStatusChange?.(t.id, targetStatus)
      }
    })
  }

  return (
    <div className="flex flex-col overflow-hidden shrink-0">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={paginatedTasks.map(t => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="bg-backpage rounded-[20px] overflow-hidden">
            <Table className="bg-backpage border-collapse">
              <Table.ScrollContainer>
                <Table.Content aria-label="Tabela de tarefas" className="w-full min-w-[900px]">
                  <Table.Header className={"bg-transparent border-none"}>
                    <Table.Column className="pr-0 bg-transparent text-zinc-900 font-medium text-xs text-left px-4 py-2 border-none w-16">
                      <Checkbox
                        slot={null}
                        isSelected={isAllDone}
                        onChange={handleToggleAll}
                        aria-label="Selecionar todos"
                      >
                        <Checkbox.Content>
                          <Checkbox.Control>
                            <Checkbox.Indicator />
                          </Checkbox.Control>
                        </Checkbox.Content>
                      </Checkbox>
                    </Table.Column>
                    <Table.Column className="bg-transparent text-zinc-900 font-medium text-xs text-left px-4 py-2">ID</Table.Column>
                    <Table.Column className="bg-transparent text-zinc-900 font-medium text-xs text-left px-4 py-2">Projeto</Table.Column>
                    <Table.Column className="bg-transparent text-zinc-900 font-medium text-xs text-left px-4 py-2">Cliente</Table.Column>
                    <Table.Column className="bg-transparent text-zinc-900 font-medium text-xs text-left px-4 py-2">Tags</Table.Column>
                    <Table.Column className="bg-transparent text-zinc-900 font-medium text-xs text-left px-4 py-2">Data de entrega</Table.Column>
                    <Table.Column className="bg-transparent text-zinc-900 font-medium text-xs text-right px-4 py-2">Ações</Table.Column>
                  </Table.Header>
                  <Table.Body>
                    {paginatedTasks.map((task, index) => (
                      <SortableRow
                        key={task.id}
                        task={task}
                        isFirst={index === 0}
                        isLast={index === paginatedTasks.length - 1}
                        onStatusChange={onTaskStatusChange}
                        onClick={onTaskClick}
                        onDelete={onTaskDelete}
                      />
                    ))}
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>
              <Table.Footer>
                {/* Pagination Footer */}
                <div className="flex items-center justify-between px-4 bg-backpage border-t border-zinc-200/50 w-full">
                  <span className="text-zinc-900 font-medium text-xs">
                    {start} to {end} of {tasks.length} results
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-secondary hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-none bg-transparent cursor-pointer"
                    >
                      <ChevronLeft className="size-3" />
                      Prev
                    </button>
                    {pages.map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`size-8 rounded-lg text-xs font-medium transition-colors border-none cursor-pointer ${p === page
                          ? 'bg-secondary text-white'
                          : 'bg-transparent text-secondary hover:bg-zinc-200'
                          }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-secondary hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-none bg-transparent cursor-pointer"
                    >
                      Next
                      <ChevronRight className="size-3" />
                    </button>
                  </div>
                </div>
              </Table.Footer>
            </Table>
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
