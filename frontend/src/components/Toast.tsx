import { useState, useEffect } from 'react'
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastProps {
  id: string
  message: string
  type: ToastType
  duration?: number
}

type ToastListener = (toast: ToastProps) => void

class ToastManager {
  private listeners = new Set<ToastListener>()

  subscribe(listener: ToastListener) {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  notify(message: string, type: ToastType, duration = 4000) {
    const id = Math.random().toString(36).substring(2, 9)
    const toast: ToastProps = { id, message, type, duration }
    this.listeners.forEach((listener) => listener(toast))
  }

  success(message: string, duration?: number) {
    this.notify(message, 'success', duration)
  }

  error(message: string, duration?: number) {
    this.notify(message, 'error', duration)
  }

  warning(message: string, duration?: number) {
    this.notify(message, 'warning', duration)
  }

  info(message: string, duration?: number) {
    this.notify(message, 'info', duration)
  }
}

export const toast = new ToastManager()

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  useEffect(() => {
    return toast.subscribe((newToast) => {
      setToasts((prev) => [...prev, newToast])
    })
  }, [])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-md w-full pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} {...t} onClose={removeToast} />
      ))}
    </div>
  )
}

interface ToastItemProps extends ToastProps {
  onClose: (id: string) => void
}

function ToastItem({ id, message, type, duration = 4500, onClose }: ToastItemProps) {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true)
    }, duration - 200) // Start exit animation slightly before destroying

    const removeTimer = setTimeout(() => {
      onClose(id)
    }, duration)

    return () => {
      clearTimeout(timer)
      clearTimeout(removeTimer)
    }
  }, [id, duration, onClose])

  const handleManualClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      onClose(id)
    }, 200)
  }

  // Visual styles configuration matching a modern, premium dark/glassmorphic aesthetic
  const config = {
    success: {
      bg: 'bg-emerald-950/90 border-emerald-500/30 text-emerald-100',
      icon: <CheckCircle2 className="size-5 text-emerald-400 shrink-0" />,
    },
    error: {
      bg: 'bg-red-950/90 border-red-500/30 text-red-100',
      icon: <XCircle className="size-5 text-red-400 shrink-0" />,
    },
    warning: {
      bg: 'bg-amber-950/90 border-amber-500/30 text-amber-100',
      icon: <AlertTriangle className="size-5 text-amber-400 shrink-0" />,
    },
    info: {
      bg: 'bg-zinc-900/90 border-zinc-700/50 text-zinc-100',
      icon: <Info className="size-5 text-blue-400 shrink-0" />,
    },
  }[type]

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 px-4 py-3.5 rounded-[16px] border backdrop-blur-md shadow-2xl transition-all duration-200 ${
        config.bg
      } ${isExiting ? 'animate-slide-out' : 'animate-slide-in'}`}
      role="alert"
    >
      {config.icon}
      <div className="flex-1 text-[13px] font-medium leading-relaxed select-text">
        {message}
      </div>
      <button
        onClick={handleManualClose}
        className="text-white/40 hover:text-white/80 transition-colors cursor-pointer p-0.5 rounded-md hover:bg-white/5 shrink-0"
        aria-label="Fechar notificação"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}
