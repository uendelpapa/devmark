import {
  Input,
  Avatar
} from '@heroui/react'
import {
  Magnifier,
  Envelope,
  Bell
} from '@gravity-ui/icons'

export function Header() {
  return (
    <header className="bg-white rounded-[24px] px-6 py-6 flex items-center justify-between shadow-xs shrink-0">
      {/* Search Input */}
      <div className="w-62.5 relative">
        <Magnifier className='size-4 absolute top-1/2 left-3 -translate-y-1/2' />
        <Input type='search' aria-label="Name" className="w-62.5 pl-8 bg-zinc-100 rounded-full" placeholder="Pesquisar" />
      </div>

      {/* User Profile & Notifications */}
      <div className="flex items-center gap-4">
        {/* Mail Button */}
        <button className="size-8 rounded-full bg-primary/50 flex items-center justify-center cursor-pointer hover:bg-primary transition-colors">
          <Envelope className="text-secondary size-4" />
        </button>

        {/* Notification Bell Button */}
        <button className="size-8 rounded-full bg-primary/50 flex items-center justify-center relative cursor-pointer hover:bg-primary transition-colors">
          <Bell className="text-secondary size-4" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-400 rounded-full border border-white" />
        </button>

        {/* User Identity Info */}
        <div className="flex items-center gap-2">
          <Avatar className='size-9'>
            <Avatar.Image
              alt="Blue"
              src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
            />
            <Avatar.Fallback>B</Avatar.Fallback>
          </Avatar>
          <div className="flex flex-col gap-0">
            <p className="font-bold text-[14px] text-secondary leading-none">Uendel Papa</p>
            <p className="text-[11px] text-secondary/70 font-semibold leading-none mt-1">uendelpapa@gmail.com</p>
          </div>
        </div>
      </div>
    </header>
  )
}
