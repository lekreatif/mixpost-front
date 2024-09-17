import React from 'react'
import { useCreatePost } from '@/hooks/useCreatePost'
import { Radio, RadioGroup } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { FaGlobe, FaLock } from 'react-icons/fa'

const VisibilitySection: React.FC = () => {
  const { isPublic, setIsPublic } = useCreatePost()

  const visibilityOptions = [
    {
      id: 'public',
      label: 'Public',
      description: 'Visible par tout le monde',
      icon: FaGlobe,
    },
    {
      id: 'private',
      label: 'Privé',
      description: 'Visible uniquement pour vous',
      icon: FaLock,
    },
  ]

  return (
    <div className="p-4 mb-4 border rounded-xl bg-primary-100">
      <h2 className="mb-2 font-sans text-base font-medium">Visibilité</h2>
      <RadioGroup
        value={isPublic ? 'public' : 'private'}
        onChange={(value) => setIsPublic(value === 'public')}
        className="space-y-2"
      >
        {visibilityOptions.map((option) => (
          <Radio
            key={option.id}
            value={option.id}
            className="group relative flex cursor-pointer rounded-lg bg-primary-100 px-5 py-4 text-primary-900 transition focus:outline-none data-[checked]:border data-[checked]:bg-primary-50 data-[focus]:outline-1 data-[focus]:outline-primary-500"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <option.icon className="w-6 h-6 mr-3 text-primary-400" />
                <div className="text-sm">
                  <p className="font-semibold">{option.label}</p>
                  <p className="font-light text-primary-500">
                    {option.description}
                  </p>
                </div>
              </div>
              <CheckCircleIcon className="h-6 w-6 text-secondary-600 opacity-0 transition group-data-[checked]:opacity-100" />
            </div>
          </Radio>
        ))}
      </RadioGroup>
    </div>
  )
}

export default VisibilitySection
