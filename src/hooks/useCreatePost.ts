import { useContext } from 'react'
import { CreatePostContext } from '@/contexts/CreatePostContext'

export const useCreatePost = () => {
  const context = useContext(CreatePostContext)
  if (context === undefined) {
    throw new Error('useCreatePost must be used within a CreatePostProvider')
  }
  return context
}
