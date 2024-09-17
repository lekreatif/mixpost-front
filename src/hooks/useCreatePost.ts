import { useContext } from 'react'
import { CreatePostContext } from '@/contexts/CreatePostContext'
import localforage from 'localforage'

export const useCreatePost = () => {
  const context = useContext(CreatePostContext)
  if (context === undefined) {
    throw new Error('useCreatePost must be used within a CreatePostProvider')
  }

  const clearStoredData = async () => {
    // Réinitialiser tous les états
    context.setSelectedPages([])
    context.setContent('')
    context.setMediaType(null)
    context.setMedias([])
    context.setIsScheduled(false)
    context.setScheduledDate(null)
    context.setIsPublic(true)

    // Effacer les données de localForage
    await localforage.clear()
  }

  return {
    ...context,
    clearStoredData,
  }
}
