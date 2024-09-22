import { useState, useMemo, useCallback, useEffect } from 'react'
import { useIsMobile } from './isMobile'

type CalendarView = 'day' | 'week' | 'month'

export function useCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<CalendarView>('month')

  const { isMobile } = useIsMobile()

  useEffect(() => {
    if (isMobile) {
      setView('day')
    } else if (view === 'day') {
      setView('week')
    }
  }, [isMobile])

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    return new Date(year, month + 1, 0).getDate()
  }, [currentDate])

  const firstDayOfMonth = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    return new Date(year, month, 1).getDay()
  }, [currentDate])

  const weekDayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']

  const monthDays = useMemo(() => {
    const days = []
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i))
    }
    return days
  }, [currentDate, daysInMonth])

  const weekDays = useMemo(() => {
    const startOfWeek = new Date(currentDate)
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      return day
    })
  }, [currentDate])

  const navigateToPreviousPeriod = useCallback(() => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate)
      if (view === 'month') newDate.setMonth(prevDate.getMonth() - 1)
      else if (view === 'week') newDate.setDate(prevDate.getDate() - 7)
      else newDate.setDate(prevDate.getDate() - 1)
      return newDate
    })
  }, [view])

  const navigateToNextPeriod = useCallback(() => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate)
      if (view === 'month') newDate.setMonth(prevDate.getMonth() + 1)
      else if (view === 'week') newDate.setDate(prevDate.getDate() + 7)
      else newDate.setDate(prevDate.getDate() + 1)
      return newDate
    })
  }, [view])

  const navigateToToday = useCallback(() => {
    setCurrentDate(new Date())
  }, [])

  return {
    currentDate,
    view,
    setView,
    weekDayNames,
    weekDays,
    monthDays,
    firstDayOfMonth,
    navigateToPreviousPeriod,
    navigateToNextPeriod,
    navigateToToday,
    isMobile,
    setCurrentDate,
  }
}
