import {
  Rectangles4,
  Layers3Diagonal,
  Persons,
  Folder,
  Calendar,
  ChartMixed,
  Sliders,
  CircleQuestion,
  ArrowRightFromSquare
} from '@gravity-ui/icons'
import { TimerTracker } from './TimerTracker'

interface MenuItemProps {
  icon: React.ComponentType<{ className?: string; width?: string | number; height?: string | number }>
  label: string
  badge?: string
  active?: boolean
}

function MenuItem({ icon: Icon, label, badge, active }: MenuItemProps) {
  return (
    <a href={`/${label.toLowerCase()}`} className="group flex items-center text-secondary gap-2">
      <div className="flex justify-center items-center gap-2">
        <Icon
          className={`text-secondary ${active ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`}
          width={16}
          height={16}
        />
        <span className={`text-secondary font-semibold tracking-tight leading-none ${active ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`}>
          {label}
        </span>
      </div>
      {badge && (
        <span className="w-fit h-[15px] bg-secondary leading-none text-center flex items-center justify-center text-primary-light text-[10px] font-semibold px-1 rounded-xs text-center">
          {badge}
        </span>
      )}
    </a>
  )
}

export function Sidebar() {
  return (
    <aside className="w-fit bg-white h-screen flex flex-col justify-between py-6 px-8 shrink-0 select-none overflow-y-auto gap-10 sidebar-scrollbar">
      {/* Top Section */}
      <div className="flex flex-col gap-10">
        {/* Logo */}
        <div className="flex justify-start items-center">
          <svg
            className="w-7 h-7 text-secondary fill-none"
            viewBox="0 0 28 28"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Custom Leaf sprout path matching the logo */}
            <path d="M14 3C14 3 8.5 7.5 8.5 13.5C8.5 19.5 14 25 14 25C14 25 19.5 19.5 19.5 13.5C19.5 7.5 14 3 14 3Z" />
            <path d="M14 9C14 9 11.5 12 11.5 15.5C11.5 19 14 22 14 22C14 22 16.5 19 16.5 15.5C16.5 12 14 9 14 9Z" />
            <path d="M14 25V17" />
          </svg>
          <span className="text-[21px] font-extrabold text-[#011D00] tracking-tight">
            Devmark
          </span>
        </div>

        {/* Menu Group */}
        <div className='flex flex-col gap-4'>
          <h3 className="text-[10px] font-semibold text-secondary uppercase">
            Menu
          </h3>
          <div className="flex flex-col gap-4">
            <MenuItem icon={Rectangles4} label="Dashboard" active />
            <MenuItem icon={Layers3Diagonal} label="Tarefas" badge="+12" />
            <MenuItem icon={Persons} label="Clientes" />
            <MenuItem icon={Folder} label="Projetos" />
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
            <MenuItem icon={Sliders} label="Configurações" />
            <MenuItem icon={CircleQuestion} label="Ajuda" />
            <MenuItem icon={ArrowRightFromSquare} label="Logout" />
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
