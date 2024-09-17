import React from 'react'
import { useCreatePost } from '@/hooks/useCreatePost'
import { Switch, Field, Label, Input } from '@headlessui/react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline'

const ScheduleSection: React.FC = () => {
  const { isScheduled, setIsScheduled, scheduledDate, setScheduledDate } =
    useCreatePost()

  const minDate = new Date(Date.now() + 30 * 60 * 1000)
  const maxDate = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)

  return (
    <div className="mb-4 rounded-xl border bg-primary-100 p-4">
      <Field>
        <div className="flex items-center justify-between">
          <Label className="mb-2 font-sans text-base font-medium">
            Programmer pour plus tard ?
          </Label>
          <Switch
            checked={isScheduled}
            onChange={setIsScheduled}
            className={`${
              isScheduled ? 'bg-secondary-300' : 'bg-gray-200'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
          >
            <span
              className={`${
                isScheduled ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
        </div>
      </Field>
      {isScheduled && (
        <div className="mt-4">
          <DatePicker
            selected={scheduledDate}
            onChange={(date: Date | null) => date && setScheduledDate(date)}
            showTimeSelect
            dateFormat="Pp"
            minDate={minDate}
            maxDate={maxDate}
            className="h-10 w-96 rounded-md border border-primary-600 bg-transparent px-4 text-sm focus:border-secondary-500 focus:outline-none"
          />
        </div>
      )}
    </div>
  )
}

export default ScheduleSection
