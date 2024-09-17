import api from '../services/api'
import { useMutation } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'

export const useUpload = () => {
  const uplaodVideoMutation = useMutation({
    mutationFn: async (
      media: Blob
    ): Promise<AxiosResponse<{ medias: { url: string }[] }>> => {
      const formData = new FormData()
      formData.append('media', media)
      const response = api.post('/upload/single', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response
    },
  })

  const uploadImageMutation = useMutation({
    mutationFn: async (
      media: Blob
    ): Promise<AxiosResponse<{ medias: { url: string }[] }>> => {
      const formData = new FormData()
      formData.append('media', media)
      const response = api.post('/upload/single', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      return response
    },
  })

  const uploadMultipleImagesMutation = useMutation({
    mutationFn: async (
      medias: Blob[]
    ): Promise<AxiosResponse<{ medias: { url: string }[] }>> => {
      const formData = new FormData()
      medias.forEach((media) => formData.append('medias', media))
      const response = api.post('/upload/multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response
    },
  })

  return {
    uplaodVideo: uplaodVideoMutation,
    uploadImage: uploadImageMutation,
    uploadMultipleImages: uploadMultipleImagesMutation,
  }
}
