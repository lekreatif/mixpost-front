import React, { useState } from 'react'
import { useCreatePost } from '@/hooks/useCreatePost'
import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useNavigate } from 'react-router-dom'
import { useNotification } from '@/contexts/NotificationContext'
import { useUpload } from '@/hooks/useUpload'
import { AxiosResponse } from 'axios'
import { MediaType, PostData } from '@/types'
import { usePostApi } from '@/hooks/usePostApi'

const ActionButtons: React.FC = () => {
  const { isScheduled, clearStoredData } = useCreatePost()
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const navigate = useNavigate()
  const { addNotification } = useNotification()
  const {
    medias,
    mediaType,
    selectedPages,
    content,
    isPublic,
    isLoading,
    setIsLoading,
    videoTitle,
    thumbnail,
  } = useCreatePost()

  const { publish } = usePostApi()

  const { uplaodVideo, uploadMultipleImages, uploadImage } = useUpload()

  const handleCancel = () => {
    setIsConfirmOpen(true)
  }

  const handleConfirmCancel = async () => {
    try {
      await clearStoredData()
      addNotification('success', 'Votre brouillon a été supprimé avec succès.')
      navigate('/')
    } catch (error: unknown) {
      addNotification(
        'error',
        'Une erreur est survenue lors de la suppression du brouillon.'
      )
    } finally {
      setIsConfirmOpen(false)
    }
  }

  const handleSaveDraft = () => {
    // Logique pour sauvegarder le brouillon
  }

  const sendPostData = async (
    res: AxiosResponse<{ medias: { url: string }[] }>,
    thumbnailUrl: string | null = null
  ) => {
    const {
      data: { medias },
    } = res
    const postData: PostData = {
      description: content,
      medias,
      pagesIds: selectedPages.map((p) => p.pageId),
      isPublic,
      mediaType,
      thumbnailUrl: thumbnailUrl ?? undefined,
    }
    if (mediaType === MediaType.VIDEO) {
      postData.videoTitle = videoTitle
    }
    return publish.mutateAsync(postData)
  }

  const handlePublish = () => {
    setIsLoading(true)
    if (mediaType === MediaType.VIDEO)
      Promise.all([
        uplaodVideo.mutateAsync(medias[0].blob),
        thumbnail ? uploadImage.mutateAsync(thumbnail) : null,
      ])
        .then(([mediaRes, thumbnailRes]) => {
          let thumbnailUrl = null
          if (thumbnailRes) {
            thumbnailUrl = thumbnailRes.data.medias[0].url
          }
          return sendPostData(mediaRes, thumbnailUrl)
        })
        .then((res) => {
          const { data } = res
          console.log(data)
        })
        .catch((err) => {
          console.log(err.response.data)
        })
        .finally(() => {
          setIsLoading(false)
        })

    if (mediaType === MediaType.IMAGE)
      uploadMultipleImages
        .mutateAsync(medias.map((media) => media.blob))
        .then(sendPostData)
        .catch((err) => {
          console.log(err.response.data)
        })
        .finally(() => {
          setIsLoading(false)
        })
  }

  return (
    <>
      <div className="trasition-all mt-4 flex justify-end space-x-4">
        <Button
          onClick={handleCancel}
          disabled={isLoading}
          className="me-auto ms-0 rounded-md border bg-error-200 px-4 py-2 text-xs font-light text-gray-700 transition-all duration-300 ease-in-out hover:border-error-500 hover:bg-error-50 hover:text-error-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Annuler
        </Button>
        <Button
          onClick={handleSaveDraft}
          disabled={isLoading}
          className="rounded-md border border-primary-950 px-4 py-2 text-xs font-light text-primary-950 transition-all duration-300 ease-in-out hover:bg-primary-950 hover:text-primary-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Enregistrer comme brouillon
        </Button>
        <Button
          disabled={isLoading}
          onClick={handlePublish}
          className="rounded-md border bg-secondary-600 px-4 py-2 text-primary-50 transition-all duration-300 ease-in-out hover:border-secondary-500 hover:bg-transparent hover:text-secondary-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? 'En cours...' : isScheduled ? 'Programmer' : 'Publier'}
        </Button>
      </div>

      <Dialog
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
            <DialogTitle
              as="h3"
              className="text-lg font-medium leading-6 text-gray-900"
            >
              Confirmer l'annulation
            </DialogTitle>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Êtes-vous sûr de vouloir annuler ? Toutes les modifications non
                enregistrées seront perdues.
              </p>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <Button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                onClick={() => setIsConfirmOpen(false)}
              >
                Annuler
              </Button>
              <Button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                onClick={handleConfirmCancel}
              >
                Confirmer
              </Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}

export default ActionButtons
