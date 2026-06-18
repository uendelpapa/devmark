import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '@heroui/react'
import { Plus } from '@gravity-ui/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchProjects, deleteProject, updateProject } from '../services/api'
import { useState } from 'react'
import { ProjectCard, ProjectCardSkeleton } from '../components/ProjectCard'
import { DeleteProjectModal, ChangeProjectStatusModal } from '../components/ProjectActionsModals'

export const Route = createFileRoute('/projetos')({
  component: Projetos
})

function Projetos() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<{ id: string; name: string } | null>(null)

  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [projectToChangeStatus, setProjectToChangeStatus] = useState<{ id: string; currentStatus: string } | null>(null)

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects
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
    <div className="bg-white rounded-[24px] p-6 overflow-y-auto min-w-0 h-fit max-h-[calc(100vh-100px)] scrollbar-none">
      {/* Page Heading & Action */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-medium tracking-tight text-secondary leading-none">
          Projetos
        </h1>
        <Button
          size='lg'
          className="bg-primary/50 hover:bg-[#a9e278] text-secondary font-bold rounded-full px-6 py-3 cursor-pointer shadow-xs text-[14px] flex items-center gap-1.5 border-none"
          onPress={() => navigate({ to: '/projetos/novo' })}
        >
          <Plus className="stroke-[2.5]" width={16} height={16} />
          Novo Projeto
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: 9 }).map((_, i) => <ProjectCardSkeleton key={i} />)
          : projects.map((project) => (
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
            />
          ))}
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
