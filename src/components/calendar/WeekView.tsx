import { format, isToday } from 'date-fns'
import { fr } from 'date-fns/locale'

type WeekViewProps = {
  weekDays: Date[]
}

export function WeekView({ weekDays }: WeekViewProps) {
  return (
    <div className="grid h-full flex-1 grid-cols-7 gap-1">
      {weekDays.map((day) => (
        <div
          key={day.toISOString()}
          className={`flex h-full flex-col ${isToday(day) ? 'bg-primary-100' : ''}`}
        >
          <div className="py-2 text-center text-xs font-thin">
            {format(day, 'EEE d', { locale: fr })}
          </div>
          <div className="flex-grow"></div>
        </div>
      ))}
    </div>
  )
}
