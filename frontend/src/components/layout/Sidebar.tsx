import {
  Rectangles4,
  Layers3Diagonal,
  Persons,
  Folder,
  Calendar,
  ChartMixed,
  Sliders,
  CircleQuestion,
  ArrowRightFromSquare,
  Briefcase
} from '@gravity-ui/icons'
import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { TimerTracker } from '../ui/TimerTracker'
import { useQuery } from '@tanstack/react-query'
import { fetchTasks, logoutUser } from '../../services/api'
import { useAuthStore } from '../../lib/auth'
import { useState } from 'react'

interface MenuItemProps {
  icon: React.ComponentType<{ className?: string; width?: string | number; height?: string | number }>
  label: string
  badge?: string
  href?: string
  onClick?: () => void
}

function MenuItem({ icon: Icon, label, badge, href, onClick }: MenuItemProps) {
  const location = useLocation()
  const targetPath = href || `/${label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`
  const active = targetPath === '/' ? location.pathname === '/' : location.pathname.startsWith(targetPath)

  const isLogout = label === 'Logout'
  const hoverColor = isLogout ? 'group-hover:text-red-500' : 'group-hover:text-secondary/75'

  if (onClick) {
    return (
      <button onClick={onClick} className="group flex items-center gap-2 bg-transparent border-none p-0 cursor-pointer">
        <div className="flex justify-center items-center gap-2">
          <Icon
            className={`text-secondary ${hoverColor} transition-colors duration-100 ease-in-out`}
            width={16}
            height={16}
          />
          <span className={`font-semibold text-secondary ${hoverColor} transition-colors duration-100 ease-in-out`}>
            {label}
          </span>
        </div>
      </button>
    )
  }

  return (
    <Link to={targetPath} className={`${active ? 'border-l-4 border-l-primary rounded-l-full pl-2' : 'border-l-0 border-l-transparent'} group flex items-center gap-2 transition-all duration-100 ease-in-out`}>
      <div className="flex justify-center items-center gap-2">
        <Icon
          className={`${active ? 'text-secondary' : `text-secondary ${hoverColor}`} transition-colors duration-100 ease-in-out`}
          width={16}
          height={16}
        />
        <span className={`font-semibold ${active ? 'text-secondary' : `text-secondary ${hoverColor}`} transition-colors duration-100 ease-in-out`}>
          {label}
        </span>
      </div>
      {badge && (
        <span className="w-fit h-[15px] bg-secondary leading-none flex items-center justify-center text-primary-light text-[10px] font-semibold px-1 rounded-xs text-center">
          {badge}
        </span>
      )}
    </Link>
  )
}

export function Sidebar() {
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks
  })

  const activeCount = tasks.filter((t: any) => t.status !== 'COMPLETED' && t.status !== 'CANCELED').length
  const tasksBadge = activeCount > 0 ? `+${activeCount}` : undefined

  const handleLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    try {
      await logoutUser()
    } catch {
      // Even if API fails, clear local state
    } finally {
      logout()
      navigate({ to: '/login' })
    }
  }

  return (
    <aside className="w-fit bg-white h-screen flex flex-col justify-between py-6 px-8 shrink-0 select-none overflow-y-auto gap-10 sidebar-scrollbar">
      {/* Top Section */}
      <div className="flex flex-col gap-10">
        {/* Logo */}
        <div className="flex justify-center items-center gap-1">
          <img src="/logo.svg" alt="Logo" />
          <span className="text-xl font-semibold text-secondary tracking-tight mt-1">
            Devmark
          </span>
        </div>

        {/* Menu Group */}
        <div className='flex flex-col gap-4'>
          <h3 className="text-[10px] font-semibold text-secondary uppercase">
            Menu
          </h3>
          <div className="flex flex-col gap-4">
            <MenuItem icon={Rectangles4} label="Dashboard" href="/" />
            <MenuItem icon={Layers3Diagonal} label="Tarefas" badge={tasksBadge} />
            <MenuItem icon={Persons} label="Clientes" />
            <MenuItem icon={Folder} label="Projetos" />
            <MenuItem icon={Briefcase} label="Serviços" />
            <MenuItem icon={Calendar} label="Calendario" />
            <MenuItem icon={ChartMixed} label="Análise" />
          </div>
        </div>

        {/* General Group */}
        <div className='flex flex-col gap-4'>
          <h3 className="text-[10px] font-semibold text-secondary uppercase">
            Geral
          </h3>
          <div className="flex flex-col gap-4">
            <MenuItem icon={Sliders} label="Configurações" href="/configuracoes" />
            <MenuItem icon={CircleQuestion} label="Ajuda" />
            <MenuItem icon={ArrowRightFromSquare} label="Logout" onClick={handleLogout} />
          </div>
        </div>
      </div>

      {/* Bottom Section - Timer Tracker */}
      <div className="flex justify-center">
        <TimerTracker />
      </div>
    </aside>
  )
}
