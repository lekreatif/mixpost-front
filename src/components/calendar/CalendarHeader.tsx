import { BsChevronLeft, BsChevronRight, BsCalendar4Week } from 'react-icons/bs'
import {
  RadioGroup,
  Radio,
  Button,
  Input,
  Field,
  Label,
} from '@headlessui/react'
import { format, parse, startOfDay, isValid } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useRef } from 'react'

type CalendarView = 'day' | 'week' | 'month'

type CalendarHeaderProps = {
  currentDate: Date
  setCurrentDate: (date: Date) => void
  view: CalendarView
  onPrevious: () => void
  onNext: () => void
  onViewChange: (view: CalendarView) => void
  onToday: () => void
  isMobile: boolean
}

const viewOptions: { value: CalendarView; label: string }[] = [
  { value: 'week', label: 'Semaine' },
  { value: 'month', label: 'Mois' },
]

export function CalendarHeader({
  currentDate,
  setCurrentDate,
  view,
  onPrevious,
  onNext,
  onViewChange,
  onToday,
  isMobile,
}: CalendarHeaderProps) {
  const dateInputRef = useRef<HTMLInputElement>(null)
  const formatDate = (date: Date) => {
    if (isMobile) {
      return `${format(date, 'd MMM', { locale: fr })}`
    } else if (view === 'month') {
      return format(date, 'MMM yyyy', { locale: fr })
    } else {
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay())
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      return `${format(weekStart, 'd')} - ${format(weekEnd, 'd MMM yyyy', { locale: fr })}`
    }
  }
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDateString = e.target.value
    if (selectedDateString) {
      const selectedDate = parse(selectedDateString, 'yyyy-MM-dd', new Date())
      if (isValid(selectedDate)) {
        setCurrentDate(startOfDay(selectedDate))
      }
    } else {
      setCurrentDate(startOfDay(new Date()))
    }
  }
  return (
    <div className="flex items-center justify-between md:space-y-0">
      <div className="flex items-center sm:space-x-4">
        <h3 className="text-xs font-light sm:text-sm">
          {formatDate(currentDate)}
        </h3>
        <Field className="flex items-center">
          <Button
            onClick={onPrevious}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <BsChevronLeft />
          </Button>
          <Button
            onClick={onToday}
            className="px-2 py-1 text-xs rounded hover:bg-gray-100 sm:text-sm"
          >
            Aujourd'hui
          </Button>
          <Button
            onClick={onNext}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <BsChevronRight />
          </Button>
        </Field>
      </div>
      <div className="flex items-center">
        {isMobile ? (
          <Field className="flex items-center">
            <Label htmlFor="date" className="sr-only">
              Choisir une date
            </Label>
            <Input
              ref={dateInputRef}
              id="date"
              name="date"
              type="date"
              value={format(currentDate, 'yyyy-MM-dd')}
              onChange={handleDateChange}
              className="px-2 py-1 border rounded sr-only"
            />
            <Button
              className="rounded border p-1.5 text-primary-600"
              onClick={() => dateInputRef.current?.showPicker()}
            >
              <BsCalendar4Week size={16} />
            </Button>
          </Field>
        ) : (
          <RadioGroup
            value={view}
            onChange={onViewChange}
            className="flex space-x-[.15rem] overflow-hidden rounded-md"
          >
            {viewOptions.map((option) => (
              <Radio
                key={option.value}
                value={option.value}
                className={({ checked }) =>
                  `cursor-pointer px-3 py-1 text-sm ${
                    checked
                      ? 'bg-secondary-500 text-primary-50'
                      : 'bg-primary-100'
                  }`
                }
              >
                {({ checked }) => (
                  <span className={checked ? 'font-light' : 'font-thin'}>
                    {option.label}
                  </span>
                )}
              </Radio>
            ))}
          </RadioGroup>
        )}
      </div>
    </div>
  )
}
