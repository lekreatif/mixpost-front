import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

type DayViewProps = {
  currentDate: Date
}

export function DayView({ currentDate }: DayViewProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="py-2 text-center text-xs font-light">
        {format(currentDate, 'EEE ', { locale: fr })}
      </div>
      <div className="flex-grow bg-primary-100"></div>
    </div>
  )
}
