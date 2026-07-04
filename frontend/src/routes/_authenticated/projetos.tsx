import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Select, SelectItem } from '../../components/ui/Select'
import { Plus } from '@gravity-ui/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchProjects, deleteProject, updateProject } from '../../services/api'
import { useState, useEffect } from 'react'
import { ProjectCard, ProjectCardSkeleton } from '../../components/projects/ProjectCard'
import { DeleteProjectModal, ChangeProjectStatusModal } from '../../components/projects/ProjectActionsModals'
import { Button } from '#/components/ui/Button'

const PROJECT_STATUSES = [
  { key: 'PLANNING', label: 'Planejamento' },
  { key: 'IN_PROGRESS', label: 'Em Andamento' },
  { key: 'WAITING_CLIENT', label: 'Aguardando Cliente' },
  { key: 'REVIEW', label: 'Revisão' },
  { key: 'COMPLETED', label: 'Concluído' },
  { key: 'CANCELED', label: 'Cancelado' }
]

export const Route = createFileRoute('/_authenticated/projetos')({
  component: Projetos,
  validateSearch: (search: Record<string, unknown>): { status?: string } => {
    return {
      status: typeof search.status === 'string' ? search.status : undefined
    }
  }
})

function Projetos() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const search = Route.useSearch()

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<{ id: string; name: string } | null>(null)

  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [projectToChangeStatus, setProjectToChangeStatus] = useState<{ id: string; currentStatus: string } | null>(null)

  const [selectedStatus, setSelectedStatus] = useState(search.status || 'ALL')
  const [selectedPriority, setSelectedPriority] = useState('ALL')

  useEffect(() => {
    if (search.status) {
      setSelectedStatus(search.status)
    } else {
      setSelectedStatus('ALL')
    }
  }, [search.status])

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects
  })

  const filteredProjects = projects.filter((project) => {
    const matchesStatus = selectedStatus === 'ALL' || project.status === selectedStatus
    const matchesPriority = selectedPriority === 'ALL' || project.priority === selectedPriority

    return matchesStatus && matchesPriority
  })

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      setDeleteModalOpen(false)
    }
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: any }) => updateProject(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      setStatusModalOpen(false)
    }
  })


  const handleEdit = (id: string) => {
    navigate({ to: '/projetos/$projectId/editar', params: { projectId: id } })
  }

  const handleDelete = (id: string, name: string) => {
    setProjectToDelete({ id, name })
    setDeleteModalOpen(true)
  }

  const handleChangeStatus = (id: string, currentStatus: string) => {
    setProjectToChangeStatus({ id, currentStatus })
    setStatusModalOpen(true)
  }

  return (
    <div className="bg-white rounded-[24px] p-6 overflow-y-auto min-w-0 h-fit max-h-[calc(100vh-100px)] scrollbar-none flex flex-col gap-8">
      {/* Page Heading & Action */}
      <div className="flex justify-between items-center shrink-0">
        <h1 className="text-3xl font-medium tracking-tight text-secondary leading-none">
          Projetos
        </h1>
        {/* Filters Bar */}
        <div className="flex gap-4 shrink-0 flex-wrap items-center">

          {/* Status Filter */}
          <Select
            ariaLabel="Filtrar por Status"
            selectedKey={selectedStatus}
            onSelectionChange={(key) => setSelectedStatus(key as string)}
            variant="zinc"
            triggerClassName="text-sm font-semibold w-fit py-2"
          >
            <SelectItem id="ALL" textValue="Todos os Status">
              Todos os Status
            </SelectItem>
            {PROJECT_STATUSES.map((s) => (
              <SelectItem key={s.key} id={s.key} textValue={s.label}>
                {s.label}
              </SelectItem>
            ))}
          </Select>

          {/* Priority Filter */}
          <Select
            ariaLabel="Filtrar por Prioridade"
            selectedKey={selectedPriority}
            onSelectionChange={(key) => setSelectedPriority(key as string)}
            variant="zinc"
            triggerClassName="text-sm font-semibold w-full py-2"
          >
            <SelectItem id="ALL" textValue="Todas as Prioridades">
              Todas as Prioridades
            </SelectItem>
            <SelectItem id="LOW" textValue="Baixa">
              Baixa
            </SelectItem>
            <SelectItem id="MEDIUM" textValue="Média">
              Média
            </SelectItem>
            <SelectItem id="HIGH" textValue="Alta">
              Alta
            </SelectItem>
            <SelectItem id="URGENT" textValue="Urgente">
              Urgente
            </SelectItem>
          </Select>

          <Button
            size='lg'
            onPress={() => navigate({ to: '/projetos/novo' })}
          >
            <Plus className="stroke-[2.5]" width={16} height={16} />
            Novo Projeto
          </Button>
        </div>
      </div>


      {/* Projects Grid */}
      <div className="grid grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: 9 }).map((_, i) => <ProjectCardSkeleton key={i} />)
          : filteredProjects.length > 0
            ? filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                name={project.name}
                description={project.description}
                status={project.status}
                priority={project.priority}
                expected_delivery_date={project.expected_delivery_date}
                client_name={project.client_name}
                client_email={project.client_email}
                onPress={(projectId) => navigate({ to: '/projetos/$projectId', params: { projectId } })}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onChangeStatus={handleChangeStatus}
                onMarkCompleted={(id) => updateStatusMutation.mutate({ id, status: 'COMPLETED' })}
              />
            ))
            : (
              <div className="col-span-3 py-12 text-center text-secondary/50 font-medium bg-zinc-50 border border-dashed border-zinc-200 rounded-[20px]">
                Nenhum projeto encontrado para os filtros selecionados.
              </div>
            )
        }
      </div>

      <DeleteProjectModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        projectName={projectToDelete?.name || ''}
        isPending={deleteMutation.isPending}
        onConfirm={() => {
          if (projectToDelete) deleteMutation.mutate(projectToDelete.id)
        }}
      />

      <ChangeProjectStatusModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        currentStatus={projectToChangeStatus?.currentStatus || 'PLANNING'}
        isPending={updateStatusMutation.isPending}
        onConfirm={(newStatus) => {
          if (projectToChangeStatus) {
            updateStatusMutation.mutate({ id: projectToChangeStatus.id, status: newStatus })
          }
        }}
      />
    </div>
  )
}
