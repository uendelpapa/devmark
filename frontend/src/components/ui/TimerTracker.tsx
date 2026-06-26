import { Pause, Play, Stop } from '@gravity-ui/icons'
import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchTasks, startTimeEntry, stopTimeEntry, fetchTimeEntries } from '../../services/api'
import type { TaskCardData } from '../../services/api'

interface TimerContextType {
  hours: number
  minutes: number
  seconds: number
  isRunning: boolean
  activeTaskId: string | null
  setActiveTaskId: (id: string | null) => void
  toggleTimer: () => void
  startTimer: () => void
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

  const queryClient = useQueryClient()

  // On mount, check if there's a running timer in the database
  useEffect(() => {
    fetchTimeEntries()
      .then((entries) => {
        const running = entries.find((e) => !e.end_time)
        if (running) {
          setActiveTaskId(running.task_id)
          setActiveTimeEntryId(running.id)
          setActiveStartTime(running.start_time)
          setIsRunning(true)

          const start = new Date(running.start_time).getTime()
          const now = Date.now()
          const diffSeconds = Math.max(Math.floor((now - start) / 1000), 0)

          setHours(Math.floor(diffSeconds / 3600))
          setMinutes(Math.floor((diffSeconds % 3600) / 60))
          setSeconds(diffSeconds % 60)
        }
      })
      .catch((err) => console.error('Error fetching running timer:', err))
  }, [])

  // Keep local clock synced with actual start time to prevent drift or suspend issues
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined
    if (isRunning && activeStartTime) {
      interval = setInterval(() => {
        const start = new Date(activeStartTime).getTime()
        const now = Date.now()
        const diffSeconds = Math.max(Math.floor((now - start) / 1000), 0)

        setHours(Math.floor(diffSeconds / 3600))
        setMinutes(Math.floor((diffSeconds % 3600) / 60))
        setSeconds(diffSeconds % 60)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, activeStartTime])

  const toggleTimer = async () => {
    if (isRunning) {
      // Stop/pause timer
      if (activeTimeEntryId) {
        try {
          await stopTimeEntry(activeTimeEntryId)
          queryClient.invalidateQueries({ queryKey: ['dashboard'] })
          queryClient.invalidateQueries({ queryKey: ['tasks'] })
          queryClient.invalidateQueries({ queryKey: ['projectDetails'] })
        } catch (err) {
          console.error('Error stopping timer:', err)
        }
      }
      setIsRunning(false)
      setActiveTimeEntryId(null)
      setActiveStartTime(null)
    } else {
      // Start timer
      if (!activeTaskId) {
        alert('Selecione uma tarefa antes de iniciar o timer.')
        return
      }

      try {
        const tasks = await queryClient.fetchQuery<TaskCardData[]>({
          queryKey: ['tasks'],
          queryFn: fetchTasks
        })
        const task = tasks.find((t) => t.id === activeTaskId)
        if (!task) {
          alert('Tarefa não encontrada.')
          return
        }

        const entry = await startTimeEntry({
          project_id: task.project_id,
          task_id: task.id,
          description: `Trabalhando em: ${task.title}`
        })

        setActiveTimeEntryId(entry.id)
        setActiveStartTime(entry.start_time)
        setIsRunning(true)
      } catch (err) {
        console.error('Error starting timer:', err)
      }
    }
  }

  const startTimer = () => {
    if (!isRunning) {
      toggleTimer()
    }
  }

  const pauseTimer = () => {
    if (isRunning) {
      toggleTimer()
    }
  }

  const resetTimer = async () => {
    if (activeTimeEntryId) {
      try {
        await stopTimeEntry(activeTimeEntryId)
        queryClient.invalidateQueries({ queryKey: ['dashboard'] })
        queryClient.invalidateQueries({ queryKey: ['tasks'] })
        queryClient.invalidateQueries({ queryKey: ['projectDetails'] })
      } catch (err) {
        console.error('Error resetting timer:', err)
      }
    }
    setIsRunning(false)
    setActiveTimeEntryId(null)
    setActiveStartTime(null)
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
      <div className="w-full bg-primary/50 rounded-[24px] space-y-4 px-6 py-4 flex flex-col items-center justify-between text-secondary">
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
            onClick={toggleTimer}
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
    <div className="w-full bg-primary/50 rounded-[24px] px-4 py-6 space-y-4 flex flex-col items-center justify-between text-secondary">
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
          onClick={toggleTimer}
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
