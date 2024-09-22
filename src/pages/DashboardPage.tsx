import { useFacebookPages } from '@/hooks/useApi'
import { useCalendar } from '@/hooks/useCalendar'
import { Page } from '@/types'
import { Checkbox, Field } from '@headlessui/react'
import { BsCheckLg } from 'react-icons/bs'
import { CalendarHeader } from '@/components/calendar/CalendarHeader'
import { MonthView } from '@/components/calendar/MonthView'
import { WeekView } from '@/components/calendar/WeekView'
import { DayView } from '@/components/calendar/DayView'
import { FullPageLoader } from '@/components/layout/FullPageLoader'

const DashboardPage = () => {
  const { data: pages, isLoading, error } = useFacebookPages()
  const {
    currentDate,
    view,
    setView,
    weekDays,
    monthDays,
    firstDayOfMonth,
    navigateToPreviousPeriod,
    navigateToNextPeriod,
    navigateToToday,
    weekDayNames,
    setCurrentDate,
    isMobile,
  } = useCalendar()

  if (isLoading) return <div>Chargement...</div>
  if (error) return <div>Erreur : {error.message}</div>

  return (
    <>
      <div className="flex min-h-full flex-col pt-12 md:py-0">
        {isLoading ? (
          <FullPageLoader />
        ) : (
          <div className="flex h-full flex-1 flex-col">
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:gap-4">
              <div className="">
                <h2 className="text-sm font-medium">Vos Pages:</h2>
              </div>
              <div className="flex flex-wrap gap-1">
                {pages.map((page: Page) => (
                  <Field key={page.name}>
                    <Checkbox className="group flex flex-col justify-center">
                      <div className="relative inline-block aspect-square w-9 cursor-pointer rounded-full border-2 border-primary-300 group-data-[checked]:border-secondary-600">
                        <img
                          className="pointer-events-none aspect-square w-full touch-none rounded-full object-cover object-center grayscale group-data-[checked]:grayscale-0"
                          src={page.profilePictureUrl}
                          alt={page.name}
                        />
                        <span className="absolute right-0 top-[20%] hidden h-4 w-4 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border-2 border-secondary-600 bg-primary-50 p-0.5 group-data-[checked]:flex">
                          <BsCheckLg className="inline-block h-full w-full text-secondary-600" />
                        </span>
                      </div>
                      <span className="line-clamp-1 w-12 text-xs font-light text-primary-400 group-data-[checked]:text-primary-600">
                        {page.name}
                      </span>
                    </Checkbox>
                  </Field>
                ))}
              </div>
            </div>
            <div className="flex flex-1 flex-col rounded-lg border bg-primary-50 p-1 md:p-6">
              <CalendarHeader
                isMobile={isMobile}
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                view={view}
                onPrevious={navigateToPreviousPeriod}
                onNext={navigateToNextPeriod}
                onViewChange={setView}
                onToday={navigateToToday}
              />
              {isMobile ? (
                <DayView currentDate={currentDate} />
              ) : view === 'month' ? (
                <MonthView
                  monthDays={monthDays}
                  firstDayOfMonth={firstDayOfMonth}
                  weekDays={weekDayNames}
                />
              ) : (
                <WeekView weekDays={weekDays} />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default DashboardPage
