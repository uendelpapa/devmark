import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import appCss from '../styles.css?url'
import { Outlet } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '../lib/queryClient'
import { ToastContainer } from '../components/ui/Toast'
import { useAuthStore } from '../lib/auth'
import { refreshToken } from '../services/http/auth'
import { useEffect } from 'react'

import { NotFound } from '../components/ui/NotFound'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Devmark — Gestão de Projetos',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  component: RootComponent,
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

function RootComponent() {
  const isLoading = useAuthStore((s) => s.isLoading)
  const setAuth = useAuthStore((s) => s.setAuth)
  const setLoading = useAuthStore((s) => s.setLoading)

  // Session restoration: attempt to refresh on app mount
  useEffect(() => {
    let cancelled = false

    async function restoreSession() {
      try {
        const { user, accessToken } = await refreshToken()
        if (!cancelled) {
          setAuth(user, accessToken)
        }
      } catch {
        // No valid refresh token — user stays unauthenticated
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    restoreSession()

    return () => {
      cancelled = true
    }
  }, [setAuth, setLoading])

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-backpage">
        <div className="flex flex-col items-center gap-4">
          <img src="/logo.svg" alt="Logo" className="w-12 h-auto animate-pulse" />
          <div className="w-6 h-6 border-3 border-secondary/20 border-t-secondary rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return <Outlet />
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
          <ToastContainer />
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
          <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}
