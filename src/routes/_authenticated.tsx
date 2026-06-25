import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { Sidebar } from '../components/Sidebar'
import { Header } from '../components/Header'
import { TimerProvider } from '../components/TimerTracker'
import { useAuthStore } from '../lib/auth'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: () => {
    const { isAuthenticated, isLoading } = useAuthStore.getState()

    // If still loading (session restore in progress), allow through —
    // the RootComponent will show a spinner
    if (isLoading) return

    if (!isAuthenticated) {
      throw redirect({ to: '/login' })
    }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return (
    <TimerProvider>
      <div className="flex h-screen w-screen bg-backpage font-sans overflow-hidden select-none">
        <Sidebar />
        <div className="flex-1 flex flex-col px-4.5 py-2.25 gap-2 h-full min-w-0 min-h-0">
          <Header />
          <Outlet />
        </div>
      </div>
    </TimerProvider>
  )
}
