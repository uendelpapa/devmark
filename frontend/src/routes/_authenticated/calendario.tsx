import { createFileRoute } from '@tanstack/react-router'
import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchCalendarItems, createTask } from '../../services/api'
import type { CalendarViewMode } from '../../services/types'
import type { CreateTaskPayload } from '../../components/tasks/CreateTaskModal'
import { CalendarHeader } from '../../components/calendar/CalendarHeader'
import { MonthView } from '../../components/calendar/MonthView'
import { WeekView } from '../../components/calendar/WeekView'
import { DayView } from '../../components/calendar/DayView'
import { YearView } from '../../components/calendar/YearView'
import { ActivityPanel } from '../../components/calendar/ActivityPanel'
import { CreateTaskModal } from '../../components/tasks/CreateTaskModal'

export const Route = createFileRoute('/_authenticated/calendario')({
  component: Calendario,
})

function Calendario() {
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const queryClient = useQueryClient()

  const { data: items = [] } = useQuery({
    queryKey: ['calendar-items'],
    queryFn: () => fetchCalendarItems(),
  })

  const { mutate: mutateCreate, isPending: isCreating, error: createError, reset: resetCreate } = useMutation({
    mutationFn: (data: CreateTaskPayload) => createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-items'] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      setIsCreateModalOpen(false)
    },
  })

  const handleNavigate = useCallback((direction: 'prev' | 'next' | 'today') => {
    setCurrentDate((prev) => {
      if (direction === 'today') return new Date()

      const d = new Date(prev)
      const delta = direction === 'prev' ? -1 : 1

      switch (viewMode) {
        case 'day':
          d.setDate(d.getDate() + delta)
          break
        case 'week':
          d.setDate(d.getDate() + delta * 7)
          break
        case 'month':
          d.setMonth(d.getMonth() + delta)
          break
        case 'year':
          d.setFullYear(d.getFullYear() + delta)
          break
      }
      return d
    })
  }, [viewMode])

  const handleSelectDate = useCallback((date: Date) => {
    setSelectedDate((prev) => {
      // Toggle off if clicking the same date
      if (prev && prev.getTime() === date.getTime()) return null
      return date
    })
  }, [])

  const handleSelectMonth = useCallback((month: number) => {
    setCurrentDate((prev) => {
      const d = new Date(prev)
      d.setMonth(month)
      return d
    })
    setViewMode('month')
  }, [])

  const handleCreateTaskFromCalendar = useCallback((_date: Date) => {
    setIsCreateModalOpen(true)
  }, [])

  const handleViewModeChange = useCallback((mode: CalendarViewMode) => {
    setViewMode(mode)
    // Clear panel when switching views (except when going to day view from a selected date)
    if (mode === 'day' && selectedDate) {
      setCurrentDate(selectedDate)
    }
  }, [selectedDate])

  // Determine if panel should be visible (month/week views with a selected date)
  const showActivityPanel = selectedDate && (viewMode === 'month' || viewMode === 'week')

  return (
    <div className="bg-white rounded-[24px] p-6 flex flex-col min-w-0 min-h-0 flex-1 overflow-hidden">
      {/* Header */}
      <div className="mb-4">
        <CalendarHeader
          currentDate={currentDate}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          onNavigate={handleNavigate}
          onAddTask={() => setIsCreateModalOpen(true)}
        />
      </div>

      {/* Content Area */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Calendar View */}
        <div className="flex-1 flex flex-col min-h-0 min-w-0">
          {viewMode === 'month' && (
            <MonthView
              currentDate={currentDate}
              items={items}
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
            />
          )}
          {viewMode === 'week' && (
            <WeekView
              currentDate={currentDate}
              items={items}
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
            />
          )}
          {viewMode === 'day' && (
            <DayView
              currentDate={currentDate}
              items={items}
              onCreateTask={handleCreateTaskFromCalendar}
            />
          )}
          {viewMode === 'year' && (
            <YearView
              currentDate={currentDate}
              items={items}
              onSelectMonth={handleSelectMonth}
            />
          )}
        </div>

        {/* Activity Panel (Month/Week views only) */}
        {showActivityPanel && (
          <ActivityPanel
            selectedDate={selectedDate}
            items={items}
            onClose={() => setSelectedDate(null)}
          />
        )}
      </div>

      {/* Create Task Modal (reusing existing component) */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false)
          resetCreate()
        }}
        onSubmit={(data) => mutateCreate(data)}
        isPending={isCreating}
        error={
          createError
            ? Array.isArray((createError as any).response?.data?.message)
              ? (createError as any).response.data.message.join(', ')
              : (createError as any).response?.data?.message || createError.message
            : null
        }
      />
    </div>
  )
}
