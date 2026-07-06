import { Avatar } from '@heroui/react'
import { Magnifier } from '@gravity-ui/icons'
import { Input } from '../ui/Input'
import { useQuery } from '@tanstack/react-query'
import { fetchProjects, fetchClients, fetchTasks } from '../../services/api'
import { useNavigate, Link } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'
import { useAuthStore } from '../../lib/auth'

export function Header() {
  const user = useAuthStore((s) => s.user)
  const [searchQuery, setSearchQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fetch data only when search is active/focused
  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    enabled: isOpen
  })

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
    enabled: isOpen
  })

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
    enabled: isOpen
  })

  const query = searchQuery.trim().toLowerCase()

  const matchedProjects = query
    ? projects.filter(p =>
      p.name.toLowerCase().includes(query) ||
      (p.description && p.description.toLowerCase().includes(query))
    )
    : []

  const matchedClients = query
    ? clients.filter(c =>
      c.name.toLowerCase().includes(query) ||
      (c.company_name && c.company_name.toLowerCase().includes(query)) ||
      (c.email && c.email.toLowerCase().includes(query))
    )
    : []

  const matchedTasks = query
    ? tasks.filter(t =>
      t.title.toLowerCase().includes(query) ||
      (t.description && t.description.toLowerCase().includes(query))
    )
    : []

  const hasResults = matchedProjects.length > 0 || matchedClients.length > 0 || matchedTasks.length > 0

  return (
    <header className="bg-white rounded-[24px] px-6 py-6 flex items-center justify-between shadow-xs shrink-0 relative z-30">
      {/* Search Input with Popover */}
      <div className="w-90 relative" ref={searchRef}>
        <Input
          type='text'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Pesquisar projetos, clientes ou tarefas..."
          variant="zinc"
          icon={<Magnifier className="text-zinc-500 size-4" />}
          className="w-[370px]"
        />

        {isOpen && query && (
          <div className="absolute left-0 top-full mt-2 w-96 max-h-[360px] overflow-y-auto bg-white rounded-2xl shadow-xl border border-zinc-150 py-3 z-50 flex flex-col gap-3 scrollbar-none">
            {hasResults ? (
              <>
                {/* Projects Section */}
                {matchedProjects.length > 0 && (
                  <div className="flex flex-col">
                    <span className="px-4 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                      Projetos
                    </span>
                    {matchedProjects.slice(0, 4).map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          navigate({ to: '/projetos/$projectId', params: { projectId: p.id } })
                          setIsOpen(false)
                          setSearchQuery('')
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-zinc-50 flex flex-col gap-0.5 border-none bg-transparent cursor-pointer transition-colors"
                      >
                        <span className="text-sm font-semibold text-secondary truncate">{p.name}</span>
                        {p.client_name && (
                          <span className="text-xs text-secondary/60 truncate">Cliente: {p.client_name}</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Clients Section */}
                {matchedClients.length > 0 && (
                  <div className="flex flex-col">
                    {matchedProjects.length > 0 && <div className="h-px bg-zinc-100 my-1 mx-4" />}
                    <span className="px-4 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                      Clientes
                    </span>
                    {matchedClients.slice(0, 4).map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          navigate({ to: '/clientes' })
                          setIsOpen(false)
                          setSearchQuery('')
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-zinc-50 flex flex-col gap-0.5 border-none bg-transparent cursor-pointer transition-colors"
                      >
                        <span className="text-sm font-semibold text-secondary truncate">{c.name}</span>
                        {c.company_name && (
                          <span className="text-xs text-secondary/60 truncate">{c.company_name}</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Tasks Section */}
                {matchedTasks.length > 0 && (
                  <div className="flex flex-col">
                    {(matchedProjects.length > 0 || matchedClients.length > 0) && <div className="h-px bg-zinc-100 my-1 mx-4" />}
                    <span className="px-4 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                      Tarefas
                    </span>
                    {matchedTasks.slice(0, 4).map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          navigate({ to: '/tarefas/$taskId', params: { taskId: t.id } })
                          setIsOpen(false)
                          setSearchQuery('')
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-zinc-50 flex flex-col gap-0.5 border-none bg-transparent cursor-pointer transition-colors"
                      >
                        <span className="text-sm font-semibold text-secondary truncate">{t.title}</span>
                        {t.client?.name && (
                          <span className="text-xs text-secondary/60 truncate">Projeto: {t.client.name}</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="px-4 py-3 text-center text-secondary/50 text-xs font-semibold">
                Nenhum resultado encontrado para "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* User Profile & Notifications */}
      <div className="flex items-center gap-4">
        {/* Mail Button */}
        {/* <button className="size-8 rounded-full bg-primary/50 flex items-center justify-center cursor-pointer hover:bg-primary transition-colors">
          <Envelope className="text-secondary size-4" />
        </button> */}

        {/* Notification Bell Button */}
        {/* <button className="size-8 rounded-full bg-primary/50 flex items-center justify-center relative cursor-pointer hover:bg-primary transition-colors">
          <Bell className="text-secondary size-4" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-400 rounded-full border border-white" />
        </button> */}

        {/* User Identity Info */}
        <Link to="/configuracoes" className="flex items-center gap-2 hover:bg-zinc-100 p-1.5 rounded-xl transition-colors cursor-pointer border-none no-underline">
          <Avatar className='size-9'>
            <Avatar.Fallback className="bg-primary/50 text-secondary font-bold text-sm">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar.Fallback>
          </Avatar>
          <div className="flex flex-col gap-0">
            <p className="font-bold text-[14px] text-secondary leading-none">{user?.name || 'Usuário'}</p>
            <p className="text-[11px] text-secondary/70 font-semibold leading-none mt-1">{user?.email || ''}</p>
          </div>
        </Link>
      </div>
    </header>
  )
}
