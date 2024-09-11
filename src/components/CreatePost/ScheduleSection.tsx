import React from 'react'
import { useCreatePost } from '@/hooks/useCreatePost'
import { Switch, Field, Label } from '@headlessui/react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const ScheduleSection: React.FC = () => {
  const { isScheduled, setIsScheduled, scheduledDate, setScheduledDate } =
    useCreatePost()

  return (
    <div className="p-4 mb-4 border rounded-xl bg-primary-100">
      <Field>
        <div className="flex items-center justify-between">
          <Label className="mb-2 font-sans text-base font-medium">
            Programmer pour plus tard ?
          </Label>
          <Switch
            checked={isScheduled}
            onChange={setIsScheduled}
            className={`${
              isScheduled ? 'bg-accent-300' : 'bg-gray-200'
            } relative inline-flex h-4 w-9 items-center rounded-full transition-colors focus:outline-none ring-2 ring-primary-500 ring-offset-2`}
          >
            <span
              className={`${
                isScheduled ? 'translate-x-5' : 'translate-x-[0.05rem]'
              } inline-block h-4 w-4 transform rounded-full bg-accent-600 transition-transform`}
            />
          </Switch>
        </div>
      </Field>
      {isScheduled && (
        <div className="mt-4">
          <DatePicker
            selected={scheduledDate}
            onChange={(date: Date) => setScheduledDate(date)}
            showTimeSelect
            dateFormat="Pp"
            minDate={new Date()}
            className="w-full p-2 border border-gray-300 rounded-md focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
      )}
    </div>
  )
}

export default ScheduleSection
