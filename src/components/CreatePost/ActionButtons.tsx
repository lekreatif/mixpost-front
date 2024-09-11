import React from 'react'
import { useCreatePost } from '@/hooks/useCreatePost'
import { Button } from '@headlessui/react'

const ActionButtons: React.FC = () => {
  const { isScheduled } = useCreatePost()

  const handleCancel = () => {
    // Logique pour annuler
  }

  const handleSaveDraft = () => {
    // Logique pour sauvegarder le brouillon
  }

  const handlePublish = () => {
    // Logique pour publier ou programmer
  }

  return (
    <div className="mt-4 flex justify-end space-x-4">
      <Button
        onClick={handleCancel}
        className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
      >
        Annuler
      </Button>
      <Button
        onClick={handleSaveDraft}
        className="bg-primary-100 text-primary-700 hover:bg-primary-200 rounded-md px-4 py-2"
      >
        Terminer plus tard
      </Button>
      <Button
        onClick={handlePublish}
        className="bg-primary-600 hover:bg-primary-700 rounded-md px-4 py-2 text-white"
      >
        {isScheduled ? 'Programmer' : 'Publier'}
      </Button>
    </div>
  )
}

export default ActionButtons
