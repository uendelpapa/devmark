import { createFileRoute } from '@tanstack/react-router'
import { Sidebar } from '../components/Sidebar'
import { TimerTracker, TimerProvider } from '../components/TimerTracker'
import {
  Input,
  Button,
  Avatar,
  Card,
  CardContent
} from '@heroui/react'
import {
  Magnifier,
  Envelope,
  Bell,
  Plus,
  ArrowUpRightFromSquare,
  CircleChevronDown,
  FolderArrowRight,
  Comment,
  CircleChevronUp,
  CircleInfo
} from '@gravity-ui/icons'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  // Mock data for projects
  const projects = [
    { id: 1, name: 'Projeto 1', date: '01/05' },
    { id: 2, name: 'Projeto 2', date: '03/05' },
    { id: 3, name: 'Projeto 3', date: '04/05' },
    { id: 4, name: 'Projeto 4', date: '22/06' },
    { id: 5, name: 'Projeto 5', date: '07/07' },
    { id: 6, name: 'Projeto 6', date: '07/08' },
    { id: 7, name: 'Projeto 7', date: '02/11' },
    { id: 8, name: 'Projeto 8', date: '06/11' },
    { id: 9, name: 'Projeto 9', date: '11/11' },
  ]

  // Mock data for pending payments
  const pendingPayments = [
    { name: 'Bob', email: 'bob@email.com' },
    { name: 'Fred', email: 'fred@email.com' },
    { name: 'Martha', email: 'martha@email.com' },
    { name: 'Alice', email: 'alice@email.com' },
    { name: 'John', email: 'john@email.com' },
    { name: 'Lisa', email: 'lisa@email.com' },
  ]

  return (
    <TimerProvider>
      <div className="flex h-screen w-screen bg-backpage font-sans overflow-hidden select-none">
        {/* Sidebar Component */}
        <Sidebar />

        {/* Right Side Column containing Navbar and Main Content Card */}
        <div className="flex-1 flex flex-col px-4.5 py-2.25 gap-2 h-full min-w-0">
          {/* Top Navbar Card */}
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

          {/* Main Content Dashboard Panel */}
          <div className="bg-white rounded-[24px] p-6 overflow-y-auto min-w-0 max-h-[calc(100vh-100px)] h-fit scrollbar-none">
            {/* Page Heading & Main Actions */}
            <div className="flex justify-between items-start shrink-0 mb-4">
              <div className='space-y-4'>
                <h1 className="text-3xl font-semibold tracking-tight text-secondary leading-none">
                  Dashboard
                </h1>
                <p className="text-secondary leading-none">
                  Planeje, priorize e acompanhe suas tarefas com facilidade.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  className="bg-primary/50 hover:bg-[#a9e278] text-secondary font-bold rounded-full px-6 py-3 cursor-pointer shadow-xs text-[14px] flex items-center gap-1.5 border-none"
                >
                  <Plus className="stroke-[2.5]" width={16} height={16} /> Novo Projeto
                </Button>
                <Button
                  className="bg-[#E5E7EB] hover:bg-neutral-300 text-secondary font-bold rounded-full px-6 py-3 cursor-pointer shadow-xs text-[14px] border-none"
                >
                  Importar Dados
                </Button>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-4 gap-2 mb-2 shrink-0">
              {/* Card 1: Total de Projetos */}
              <Card className="bg-primary/50 border-none shadow-none rounded-[24px] p-6 text-secondary relative">
                <CardContent className='space-y-4'>
                  <div className='flex justify-between'>
                    <h4 className="font-semibold">Total de Projetos</h4>
                    <Button className={"size-10 bg-secondary hover:bg-secondary/80 shadow-md shadow-black/40"} size='lg'>
                      <ArrowUpRightFromSquare width={16} height={16} />
                    </Button>
                  </div>
                  <span className="text-5xl font-semibold leading-none tracking-tight">33</span>
                  <div className="flex items-center gap-2">
                    <CircleChevronDown className="text-secondary" width={16} height={16} />
                    <span className="text-sm">abaixo do mês passado</span>
                  </div>
                </CardContent>
              </Card>

              {/* Card 2: Projetos Finalizados */}
              <Card className="bg-zinc-100 border-none shadow-none rounded-[24px] p-6 text-secondary relative">
                <CardContent className='space-y-4'>
                  <div className='flex justify-between'>
                    <h4 className="font-semibold">Projetos Finalizados</h4>
                    <Button className={"size-10 bg-secondary hover:bg-secondary/80 shadow-md shadow-black/40"} size='lg'>
                      <ArrowUpRightFromSquare width={16} height={16} />
                    </Button>
                  </div>
                  <span className="text-5xl font-semibold leading-none tracking-tight">11</span>
                  <div className="flex items-center gap-2">
                    <CircleChevronUp className="text-secondary" width={16} height={16} />
                    <span className="text-sm">acima do mês passado</span>
                  </div>
                </CardContent>
              </Card>

              {/* Card 3: Projetos Iniciados */}
              <Card className="bg-zinc-100 border-none shadow-none rounded-[24px] p-6 text-secondary relative">
                <CardContent className='space-y-4'>
                  <div className='flex justify-between'>
                    <h4 className="font-semibold">Projetos Iniciados</h4>
                    <Button className={"size-10 bg-secondary hover:bg-secondary/80 shadow-md shadow-black/40"} size='lg'>
                      <ArrowUpRightFromSquare width={16} height={16} />
                    </Button>
                  </div>
                  <span className="text-5xl font-semibold leading-none tracking-tight">2</span>
                  <div className="flex items-center gap-2">
                    <CircleInfo className="text-secondary" width={16} height={16} />
                    <span className="text-sm">poucos projetos iniciados</span>
                  </div>
                </CardContent>
              </Card>

              {/* Card 4: Projetos Pendentes */}
              <Card className="bg-zinc-100 border-none shadow-none rounded-[24px] p-6 text-secondary relative">
                <CardContent className='space-y-4'>
                  <div className='flex justify-between'>
                    <h4 className="font-semibold">Projetos Pendentes</h4>
                    <Button className={"size-10 bg-secondary hover:bg-secondary/80 shadow-md shadow-black/40"} size='lg'>
                      <ArrowUpRightFromSquare width={16} height={16} />
                    </Button>
                  </div>
                  <span className="text-5xl font-semibold leading-none tracking-tight">0</span>
                  <div className="flex items-center gap-2">
                    <CircleInfo className="text-secondary" width={16} height={16} />
                    <span className="text-sm">nenhum projeto pendente</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Lower Rows: Grid with 3 columns */}
            <div className="grid grid-cols-12 gap-2 items-start">
              {/* Left Column: Finanças & Nível de trabalho */}
              <div className="col-span-6 flex flex-col gap-2">
                {/* Finanças Card */}
                <Card className="p-0 bg-zinc-100 border-none shadow-none rounded-[24px]">
                  <CardContent className="space-y-4 p-0 text-secondary">
                    <h3 className="font-semibold px-6 pt-6">Finanças</h3>
                    <div className="flex gap-2 overflow-x-auto px-6 pb-6 scrollbar-none">
                      {/* Item 1: Entrada */}
                      <div className="flex flex-col shrink-0 bg-primary/50 border border-zinc-200/50 space-y-4 px-6 py-4 rounded-[24px]">
                        <span className="font-semibold">Entrada</span>
                        <span className="text-3xl font-bold">R$ 1.500</span>
                        <div className="flex items-center gap-1.5 text-sm font-semibold">
                          <CircleChevronDown className="text-secondary" width={16} height={16} />
                          <span className='font-normal'>abaixo do mês anterior</span>
                        </div>
                      </div>

                      {/* Item 2: Gastos */}
                      <div className="flex flex-col shrink-0 bg-primary/50 border border-zinc-200/50 space-y-4 px-6 py-4 rounded-[24px]">
                        <span className="font-semibold">Gastos c/ ferramentas</span>
                        <span className="text-3xl font-bold">R$ 380</span>
                        <div className="flex items-center gap-1.5 text-sm font-semibold">
                          <CircleChevronUp className="text-secondary" width={16} height={16} />
                          <span className='font-normal'>pouco acima do mês anterior</span>
                        </div>
                      </div>

                      {/* Item 3: A Receber */}
                      <div className="flex flex-col shrink-0 bg-primary/50 border border-zinc-200/50 space-y-4 px-6 py-4 rounded-[24px]">
                        <span className="font-semibold">A Receber</span>
                        <span className="text-3xl font-bold">R$ 4.829</span>
                        <div className="flex items-center gap-1.5 text-sm font-semibold">
                          <CircleChevronUp className="text-secondary" width={16} height={16} />
                          <span className='font-normal'>acima do mês anterior</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Nível de trabalho Card */}
                <Card className="bg-[#F4F4F6] border-none shadow-none rounded-[24px] p-6 text-secondary flex flex-col justify-between">
                  <CardContent className="p-0">
                    <h3 className="font-semibold">Nível de trabalho</h3>
                    {/* Custom Styled Bar Chart */}
                    <div className="w-full flex items-end justify-between gap-3 px-2">
                      {/* Mon */}
                      <div className="flex-1 flex flex-col items-center gap-2">
                        <div className="flex w-full max-w-[256px] h-[108px] bg-[#BAF08A] rounded-full transition-all hover:opacity-90" />
                        <span className="text-xl font-medium">s</span>
                      </div>
                      {/* Tue */}
                      <div className="flex-1 flex flex-col items-center gap-2">
                        <div className="flex w-full max-w-[256px] h-[146px] bg-[#8cb870] rounded-full transition-all hover:opacity-90" />
                        <span className="text-xl font-medium">t</span>
                      </div>
                      {/* Wed */}
                      <div className="flex-1 flex flex-col items-center gap-2">
                        <div className="flex w-full max-w-[256px] h-[88px] bg-[#BAF08A] rounded-full transition-all hover:opacity-90" />
                        <span className="text-xl font-medium">q</span>
                      </div>
                      {/* Thu */}
                      <div className="flex-1 flex flex-col items-center gap-2">
                        {/* Dotted texture using CSS linear-gradients */}
                        <div
                          className="flex w-full max-w-[256px] h-[182px] rounded-full transition-all hover:opacity-90 border-[1.5px] border-secondary"
                          style={{
                            backgroundImage: 'radial-gradient(#8cb870 20%, transparent 20%), radial-gradient(#8cb870 20%, #BAF08A 20%)',
                            backgroundSize: '6px 6px',
                            backgroundPosition: '0 0, 3px 3px'
                          }}
                        />
                        <span className="text-xl font-medium">q</span>
                      </div>
                      {/* Fri */}
                      <div className="flex-1 flex flex-col items-center gap-2">
                        <div className="flex w-full max-w-[256px] h-[120px] bg-[#BAF08A] rounded-full transition-all hover:opacity-90" />
                        <span className="text-xl font-medium">s</span>
                      </div>
                      {/* Sat */}
                      <div className="flex-1 flex flex-col items-center gap-2">
                        <div
                          className="flex w-full max-w-[256px] h-[86px] rounded-full transition-all hover:opacity-90 border-[1.5px] border-secondary"
                          style={{
                            backgroundImage: 'radial-gradient(#8cb870 25%, transparent 25%)',
                            backgroundSize: '8px 8px',
                            backgroundColor: '#BAF08A'
                          }}
                        />
                        <span className="text-xl font-medium">s</span>
                      </div>
                      {/* Sun */}
                      <div className="flex-1 flex flex-col items-center gap-2">
                        <div className="flex w-full max-w-[256px] h-[65px] bg-[#BAF08A] rounded-full transition-all hover:opacity-90" />
                        <span className="text-xl font-medium">d</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Middle Column: Projetos List */}
              <div className="col-span-3">
                <Card className="h-[542px] bg-zinc-100 border-none shadow-none rounded-[24px] p-6 text-secondary">
                  <CardContent className="p-0 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4 shrink-0">
                      <h3 className="font-semibold">Projetos</h3>
                      <Button size='lg' className="size-9 rounded-full bg-secondary text-primary-light flex items-center justify-center cursor-pointer hover:bg-secondary hover:opacity-90 border-none shadow-md shadow-black/40">
                        <Plus width={16} height={16} />
                      </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 scrollbar-none">
                      {projects.map((project) => (
                        <div key={project.id} className="flex items-center justify-between py-1 border-b border-secondary/5 last:border-0">
                          <div className="flex items-center gap-3">
                            <Avatar className='size-9'>
                              <Avatar.Image
                                alt="Blue"
                                src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
                              />
                              <Avatar.Fallback>B</Avatar.Fallback>
                            </Avatar>
                            <div>
                              <p className="font-bold text-[14px] leading-tight">{project.name}</p>
                              <p className="text-[12px] opacity-75 font-semibold mt-0.5">Entregar {project.date}</p>
                            </div>
                          </div>
                          <a href={`/${project.name}`} className="w-8 h-8 rounded-lg hover:bg-secondary/5 flex items-center justify-center cursor-pointer text-secondary/80 hover:text-secondary border-none bg-transparent">
                            <FolderArrowRight width={16} height={16} />
                          </a>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Timer Tracker & Pagamentos Pendentes */}
              <div className="col-span-3 flex flex-col gap-2">
                {/* Embedded Timer Tracker */}
                <div className="w-full">
                  <TimerTracker variant="dashboard" />
                </div>

                {/* Pagamentos Pendentes Card */}
                <Card className="bg-[#F4F4F6] border-none shadow-none rounded-[24px] p-6 text-secondary h-[372px]">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold leading-tight">Pagamentos pendentes</h3>
                      <span className="font-semibold text-secondary/60">5</span>
                    </div>

                    <div className="flex flex-col gap-3 overflow-y-auto h-[300px] scrollbar-none">
                      {pendingPayments.map((person, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className='size-9'>
                              <Avatar.Image
                                alt="Blue"
                                src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
                              />
                              <Avatar.Fallback>B</Avatar.Fallback>
                            </Avatar>
                            <div>
                              <p className="font-bold text-[13px] leading-none">{person.name}</p>
                              <p className="text-[11px] opacity-70 font-semibold leading-none mt-1 text-ellipsis overflow-hidden whitespace-nowrap max-w-[110px]">{person.email}</p>
                            </div>
                          </div>
                          <button className="w-8 h-8 rounded-full hover:bg-secondary/5 flex items-center justify-center cursor-pointer text-secondary/70 hover:text-secondary shrink-0 border-none bg-transparent">
                            <Comment width={16} height={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TimerProvider>
  )
}
