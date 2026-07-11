import { Pause, Play, Stop } from '@gravity-ui/icons'
import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchTasks, startTimeEntry, stopTimeEntry, fetchTimeEntries } from '../../services/api'
import type { TaskCardData } from '../../services/api'
import { toast } from '../../components/ui/Toast'

interface TimerContextType {
  hours: number
  minutes: number
  seconds: number
  isRunning: boolean
  activeTaskId: string | null
  setActiveTaskId: (id: string | null) => void
  toggleTimer: (taskId?: string) => void
  startTimer: (taskId?: string) => void
  pauseTimer: () => void
  resetTimer: () => void
}

const TimerContext = createContext<TimerContextType>({
  hours: 0,
  minutes: 0,
  seconds: 0,
  isRunning: false,
  activeTaskId: null,
  setActiveTaskId: () => { },
  toggleTimer: () => { },
  startTimer: () => { },
  pauseTimer: () => { },
  resetTimer: () => { },
})

export function TimerProvider({ children }: { children: ReactNode }) {
  const [seconds, setSeconds] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [hours, setHours] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  const [activeTimeEntryId, setActiveTimeEntryId] = useState<string | null>(null)
  const [activeStartTime, setActiveStartTime] = useState<string | null>(null)

  // Track the total paused time in seconds for this tracking session
  const [totalPausedSeconds, setTotalPausedSeconds] = useState(0)
  // Track the timestamp (Date.now()) of when the pause was started
  const [pausedAt, setPausedAt] = useState<number | null>(null)
  
  // Guard initial load to prevent localStorage clearing race conditions on mount
  const [isLoaded, setIsLoaded] = useState(false)

  const queryClient = useQueryClient()

  // Save/sync timer state to localStorage whenever it changes, but only after initial load has finished
  useEffect(() => {
    if (!isLoaded) return

    if (activeTimeEntryId) {
      localStorage.setItem('timer_state', JSON.stringify({
        activeTaskId,
        activeTimeEntryId,
        activeStartTime,
        totalPausedSeconds,
        pausedAt,
        isRunning
      }))
    } else {
      localStorage.removeItem('timer_state')
    }
  }, [activeTaskId, activeTimeEntryId, activeStartTime, totalPausedSeconds, pausedAt, isRunning, isLoaded])

  // On mount, check if there's a running timer in the database
  useEffect(() => {
    fetchTimeEntries()
      .then((entries) => {
        const running = entries.find((e) => !e.end_time)
        if (running) {
          // Found running entry in the database. Let's see if we have matching local storage state
          const savedStateStr = localStorage.getItem('timer_state')
          let savedState = null
          if (savedStateStr) {
            try {
              savedState = JSON.parse(savedStateStr)
            } catch {}
          }

          setActiveTaskId(running.task_id)
          setActiveTimeEntryId(running.id)
          setActiveStartTime(running.start_time)

          if (savedState && savedState.activeTimeEntryId === running.id) {
            // Restore from saved local storage state
            const restoredIsRunning = savedState.isRunning
            const restoredTotalPaused = savedState.totalPausedSeconds || 0
            const restoredPausedAt = savedState.pausedAt || null

            setIsRunning(restoredIsRunning)
            setTotalPausedSeconds(restoredTotalPaused)
            setPausedAt(restoredPausedAt)

            const start = new Date(running.start_time).getTime()
            let elapsed = 0

            if (restoredIsRunning) {
              const now = Date.now()
              elapsed = Math.max(Math.floor((now - start) / 1000) - restoredTotalPaused, 0)
            } else {
              const pauseTime = restoredPausedAt || Date.now()
              elapsed = Math.max(Math.floor((pauseTime - start) / 1000) - restoredTotalPaused, 0)
            }

            setHours(Math.floor(elapsed / 3600))
            setMinutes(Math.floor((elapsed % 3600) / 60))
            setSeconds(elapsed % 60)
          } else {
            // No local storage or mismatch: assume running normally
            setIsRunning(true)
            setTotalPausedSeconds(0)
            setPausedAt(null)

            const start = new Date(running.start_time).getTime()
            const now = Date.now()
            const diffSeconds = Math.max(Math.floor((now - start) / 1000), 0)

            setHours(Math.floor(diffSeconds / 3600))
            setMinutes(Math.floor((diffSeconds % 3600) / 60))
            setSeconds(diffSeconds % 60)
          }
        } else {
          // No active database entry, clean up local storage
          localStorage.removeItem('timer_state')
          setIsRunning(false)
          setActiveTaskId(null)
          setActiveTimeEntryId(null)
          setActiveStartTime(null)
          setTotalPausedSeconds(0)
          setPausedAt(null)
          setHours(0)
          setMinutes(0)
          setSeconds(0)
        }
      })
      .catch((err) => console.error('Error fetching running timer:', err))
      .finally(() => setIsLoaded(true))
  }, [])

  // Keep local clock synced — accounts for server start_time and accumulated pause
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined
    if (isRunning && activeStartTime) {
      interval = setInterval(() => {
        const start = new Date(activeStartTime).getTime()
        const now = Date.now()
        // Subtract totalPausedSeconds from absolute elapsed time to get actual active work time
        const totalElapsed = Math.max(
          Math.floor((now - start) / 1000) - totalPausedSeconds,
          0
        )

        setHours(Math.floor(totalElapsed / 3600))
        setMinutes(Math.floor((totalElapsed % 3600) / 60))
        setSeconds(totalElapsed % 60)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, activeStartTime, totalPausedSeconds])

  const toggleTimer = async (explicitTaskId?: string) => {
    if (isRunning) {
      // ─── PAUSE ───
      setIsRunning(false)
      setPausedAt(Date.now())
    } else {
      // ─── RESUME / START ───
      if (activeTimeEntryId && activeStartTime) {
        // Resuming a paused timer
        const currentPausedAt = pausedAt || Date.now()
        const secondsInThisPause = Math.max(Math.floor((Date.now() - currentPausedAt) / 1000), 0)
        setTotalPausedSeconds((prev) => prev + secondsInThisPause)
        setPausedAt(null)
        setIsRunning(true)
        return
      }

      // Starting a brand new timer
      const idToUse = explicitTaskId || activeTaskId
      if (!idToUse) {
        toast.warning('Selecione uma tarefa antes de iniciar o timer.')
        return
      }

      try {
        const tasks = await queryClient.fetchQuery<TaskCardData[]>({
          queryKey: ['tasks'],
          queryFn: fetchTasks
        })
        const task = tasks.find((t) => t.id === idToUse)
        if (!task) {
          toast.error('Tarefa não encontrada.')
          return
        }

        const entry = await startTimeEntry({
          project_id: task.project_id,
          task_id: task.id,
          description: `Trabalhando em: ${task.title}`
        })

        setActiveTimeEntryId(entry.id)
        setActiveStartTime(entry.start_time)
        setTotalPausedSeconds(0)
        setPausedAt(null)
        setIsRunning(true)
      } catch (err) {
        console.error('Error starting timer:', err)
      }
    }
  }

  const startTimer = (explicitTaskId?: string) => {
    if (!isRunning) {
      toggleTimer(explicitTaskId)
    }
  }

  const pauseTimer = () => {
    if (isRunning) {
      toggleTimer()
    }
  }

  const resetTimer = async () => {
    // ─── STOP: finalize the time entry on the server ───
    if (activeTimeEntryId && activeStartTime) {
      try {
        // Compute total active elapsed seconds
        const currentPausedAt = pausedAt || Date.now()
        const currentPausedSeconds = isRunning ? 0 : Math.max(Math.floor((Date.now() - currentPausedAt) / 1000), 0)
        const finalTotalPaused = totalPausedSeconds + currentPausedSeconds

        const start = new Date(activeStartTime).getTime()
        const now = Date.now()
        const actualElapsedSeconds = Math.max(
          Math.floor((now - start) / 1000) - finalTotalPaused,
          0
        )

        // Calculate a virtual endTime based on originalStartTime + actual elapsed time
        const virtualEndTime = new Date(start + actualElapsedSeconds * 1000).toISOString()

        // Call backend with the virtual end time so it saves the correct duration
        await stopTimeEntry(activeTimeEntryId, undefined, virtualEndTime)

        queryClient.invalidateQueries({ queryKey: ['dashboard'] })
        queryClient.invalidateQueries({ queryKey: ['tasks'] })
        queryClient.invalidateQueries({ queryKey: ['projectDetails'] })
      } catch (err) {
        console.error('Error stopping timer:', err)
      }
    }

    localStorage.removeItem('timer_state')
    setIsRunning(false)
    setActiveTimeEntryId(null)
    setActiveStartTime(null)
    setTotalPausedSeconds(0)
    setPausedAt(null)
    setHours(0)
    setMinutes(0)
    setSeconds(0)
  }

  return (
    <TimerContext.Provider value={{ hours, minutes, seconds, isRunning, activeTaskId, setActiveTaskId, toggleTimer, startTimer, pauseTimer, resetTimer }}>
      {children}
    </TimerContext.Provider>
  )
}

export function useTimer() {
  return useContext(TimerContext)
}

interface TimerTrackerProps {
  variant?: 'sidebar' | 'dashboard'
}

export function TimerTracker({ variant = 'sidebar' }: TimerTrackerProps) {
  const { hours, minutes, seconds, isRunning, activeTaskId, toggleTimer, resetTimer } = useTimer()

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks
  })

  const formatNumber = (num: number) => {
    return num.toString().padStart(2, '0')
  }

  const activeTask = tasks.find(t => t.id === activeTaskId)

  if (variant === 'dashboard') {
    return (
      <div className="w-full bg-primary/50 border border-primary rounded-[24px] space-y-4 px-6 py-4 flex flex-col items-center justify-between text-secondary">
        {/* Title & Task */}
        <div className="w-full flex flex-col items-center gap-1">
          <p className="font-semibold text-center text-secondary leading-tight">Timer Tracker</p>
          {activeTask ? (
            <span className="max-w-60 text-secondary font-medium text-sm truncate block w-full text-center px-2">{activeTask.title}</span>
          ) : (
            <span className="text-secondary/50 text-xs italic text-center">Nenhuma tarefa ativa</span>
          )}
        </div>

        {/* Time display (horizontal) */}
        <div className="text-[36px] font-semibold leading-none tracking-tight">
          {formatNumber(hours)}:{formatNumber(minutes)}:{formatNumber(seconds)}
        </div>

        {/* Controls (horizontal) */}
        <div className="flex gap-2 items-center">
          {/* Pause Button */}
          <button
            onClick={() => toggleTimer()}
            className={`w-[40px] h-[40px] rounded-full flex items-center justify-center transition-all cursor-pointer ${isRunning
              ? 'bg-[#8F9E7C] hover:bg-[#7E8C6A]'
              : 'bg-secondary text-[#EAFFE9] hover:bg-[#023c00]'
              }`}
            aria-label={isRunning ? 'Pause' : 'Play'}
          >
            {isRunning ? (
              <Pause className="size-4 text-primary-light" />
            ) : (
              <Play className="size-4 text-primary-light" />
            )}
          </button>

          {/* Stop Button */}
          <button
            onClick={resetTimer}
            className="w-[40px] h-[40px] bg-[#F48C7F] hover:bg-[#e27c6f] rounded-full flex items-center justify-center transition-all cursor-pointer text-white"
            aria-label="Stop"
          >
            <Stop className="size-4 text-primary-light" />
          </button>
        </div>
      </div>
    )
  }

  // Sidebar variant (vertical)
  return (
    <div className="w-full bg-primary/50 border border-primary rounded-[24px] px-4 py-6 space-y-4 flex flex-col items-center justify-between text-secondary">
      {/* Title */}
      <div className="text-center w-full flex flex-col items-center gap-2">
        <div>
          <p className="text-[18px] leading-none font-normal text-secondary">Timer</p>
          <p className="text-[18px] leading-none font-semibold text-secondary">Tracker</p>
        </div>
        {activeTask ? (
          <span className="max-w-24 text-secondary font-bold text-[11px] truncate block w-full text-center px-2 bg-white/40 rounded-full py-1 border border-primary/20">
            {activeTask.title}
          </span>
        ) : (
          <span className="text-secondary/60 text-[11px] italic text-center">Nenhuma tarefa</span>
        )}
      </div>

      {/* Time Stack */}
      <div className="flex flex-col items-center">
        <span className="text-[24px] font-medium leading-none tracking-tight">
          {formatNumber(hours)}
        </span>

        {/* Separator 1 */}
        <div className="flex gap-1 justify-center my-1.5 opacity-60">
          <span className="size-1 rounded-full border-[1.5px] border-secondary block" />
          <span className="size-1 rounded-full border-[1.5px] border-secondary block" />
        </div>

        <span className="text-[24px] font-medium leading-none tracking-tight">
          {formatNumber(minutes)}
        </span>

        {/* Separator 2 */}
        <div className="flex gap-1 justify-center my-1.5 opacity-60">
          <span className="size-1 rounded-full border-[1.5px] border-secondary block" />
          <span className="size-1 rounded-full border-[1.5px] border-secondary block" />
        </div>

        <span className="text-[24px] font-medium leading-none tracking-tight">
          {formatNumber(seconds)}
        </span>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-2 items-center">
        {/* Pause / Play Button */}
        <button
          onClick={() => toggleTimer()}
          className={`size-[40px] rounded-full flex items-center justify-center transition-all cursor-pointer ${isRunning
            ? 'bg-[#8F9E7C] hover:bg-[#7E8C6A]'
            : 'bg-secondary text-[#EAFFE9] hover:bg-[#023c00]'
            }`}
          aria-label={isRunning ? 'Pause' : 'Play'}
        >
          {isRunning ? (
            <Pause className="size-4 text-primary-light" />
          ) : (
            <Play className="size-4 text-primary-light" />
          )}
        </button>

        {/* Stop Button */}
        <button
          onClick={resetTimer}
          className="size-[40px] bg-[#F48C7F] hover:bg-[#e27c6f] rounded-full flex items-center justify-center transition-all cursor-pointer text-white"
          aria-label="Stop"
        >
          <Stop className="size-4 text-primary-light" />
        </button>
      </div>
    </div>
  )
}
