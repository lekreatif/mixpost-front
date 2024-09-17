import { useMutation } from '@tanstack/react-query'
import { api } from '../services/api'
import { PostData } from '@/types'

export const usePostApi = () => {
  const publishPostMutaion = useMutation({
    mutationFn: (postData: PostData) => {
      return api.post('/post/publish', postData)
    },
  })

  return {
    publish: publishPostMutaion,
  }
}
