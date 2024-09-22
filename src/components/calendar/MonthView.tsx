import { isToday } from 'date-fns'

type MonthViewProps = {
  monthDays: Date[]
  firstDayOfMonth: number
  weekDays: string[]
}

export function MonthView({
  monthDays,
  firstDayOfMonth,
  weekDays,
}: MonthViewProps) {
  return (
    <div className="gap grid grid-cols-7">
      {weekDays.map((day) => (
        <div key={day} className="py-2 text-center text-xs font-light">
          {day}
        </div>
      ))}
      {Array.from({ length: firstDayOfMonth }).map((_, index) => (
        <div key={`empty-${index}`} className="aspect-square"></div>
      ))}
      {monthDays.map((day) => {
        const dayIsToday = isToday(day)
        return (
          <div
            key={day.toISOString()}
            className={`aspect-square cursor-pointer border p-2 text-center hover:bg-primary-100 ${dayIsToday ? 'bg-secondary-100' : ''}`}
          >
            {day.getDate()}
          </div>
        )
      })}
    </div>
  )
}
