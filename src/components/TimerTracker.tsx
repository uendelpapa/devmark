import { Pause, Play, Stop } from '@gravity-ui/icons'
import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

interface TimerContextType {
  hours: number
  minutes: number
  seconds: number
  isRunning: boolean
  toggleTimer: () => void
  resetTimer: () => void
}

const TimerContext = createContext<TimerContextType>({
  hours: 11,
  minutes: 30,
  seconds: 6,
  isRunning: true,
  toggleTimer: () => { },
  resetTimer: () => { },
})

export function TimerProvider({ children }: { children: ReactNode }) {
  const [seconds, setSeconds] = useState(6)
  const [minutes, setMinutes] = useState(30)
  const [hours, setHours] = useState(11)
  const [isRunning, setIsRunning] = useState(true)

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prevSec) => {
          if (prevSec === 59) {
            setMinutes((prevMin) => {
              if (prevMin === 59) {
                setHours((prevHour) => (prevHour + 1) % 24)
                return 0
              }
              return prevMin + 1
            })
            return 0
          }
          return prevSec + 1
        })
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning])

  const toggleTimer = () => setIsRunning((prev) => !prev)
  const resetTimer = () => {
    setIsRunning(false)
    setHours(0)
    setMinutes(0)
    setSeconds(0)
  }

  return (
    <TimerContext.Provider value={{ hours, minutes, seconds, isRunning, toggleTimer, resetTimer }}>
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
  const { hours, minutes, seconds, isRunning, toggleTimer, resetTimer } = useTimer()

  const formatNumber = (num: number) => {
    return num.toString().padStart(2, '0')
  }

  if (variant === 'dashboard') {
    return (
      <div className="w-full bg-primary/50 rounded-[24px] space-y-4 px-6 py-4 flex flex-col items-center justify-between text-secondary">
        {/* Title */}
        <p className="font-semibold text-center text-secondary leading-tight">Timer Tracker</p>

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
    <div className="w-full bg-primary/50 rounded-[24px] px-6 py-8 space-y-4 flex flex-col items-center justify-between text-secondary">
      {/* Title */}
      <div className="text-center">
        <p className="text-[18px] leading-none font-normal text-secondary">Timer</p>
        <p className="text-[18px] leading-none font-semibold text-secondary">Tracker</p>
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
