import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Sidebar } from '../components/Sidebar'
import { Header } from '../components/Header'
import { TimerProvider } from '../components/TimerTracker'
import { Button } from '@heroui/react'
import { Plus } from '@gravity-ui/icons'
import { useState, useEffect } from 'react'
import { fetchProjects } from '../services/api'
import type { ProjectCardData } from '../services/api'
import { ProjectCard, ProjectCardSkeleton } from '../components/ProjectCard'

export const Route = createFileRoute('/projetos')({
  component: Projetos
})

function Projetos() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<ProjectCardData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    fetchProjects().then((res) => {
      if (isMounted) {
        setProjects(res)
        setIsLoading(false)
      }
    })
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <TimerProvider>
      <div className="flex h-screen w-screen bg-backpage font-sans overflow-hidden select-none">
        {/* Sidebar Component */}
        <Sidebar />

        {/* Right Side Column containing Navbar and Main Content Card */}
        <div className="flex-1 flex flex-col px-4.5 py-2.25 gap-2 h-full min-w-0">
          {/* Top Navbar Card */}
          <Header />

          {/* Main Content Panel */}
          <div className="bg-white rounded-[24px] p-6 overflow-y-auto min-w-0 flex-1 scrollbar-none">
            {/* Page Heading & Action */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-semibold tracking-tight text-secondary leading-none">
                Projetos
              </h1>
              <Button
                size='lg'
                className="bg-primary/50 hover:bg-[#a9e278] text-secondary font-bold rounded-full px-6 py-3 cursor-pointer shadow-xs text-[14px] flex items-center gap-1.5 border-none"
                onPress={() => navigate({ to: '/projetos/novo' })}
              >
                <Plus className="stroke-[2.5]" width={16} height={16} /> Novo Projeto
              </Button>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-3 gap-4">
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
                    />
                  ))}
            </div>
          </div>
        </div>
      </div>
    </TimerProvider>
  )
}
