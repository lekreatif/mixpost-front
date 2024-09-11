import React from 'react'
import { useCreatePost } from '@/hooks/useCreatePost'
import { Page } from '@/types'

const Preview: React.FC = () => {
  const { selectedPages, content, mediaType, isPublic } = useCreatePost()

  const renderMediaPreview = () => {
    if (!mediaType) return null

    if (mediaType === 'images') {
      return (
        <div className="mb-2 flex h-40 items-center justify-center bg-gray-200">
          <span className="text-gray-500">Aperçu des images</span>
        </div>
      )
    }

    if (mediaType === 'video') {
      return (
        <div className="mb-2 flex h-40 items-center justify-center bg-gray-200">
          <span className="text-gray-500">Aperçu de la vidéo</span>
        </div>
      )
    }
  }

  const renderPagePreview = (page: Page) => (
    <div key={page.pageId} className="mb-4 rounded-lg bg-white p-4 shadow-md">
      <div className="mb-2 flex items-center">
        <img
          src={page.profilePictureUrl}
          alt={page.name}
          className="mr-2 h-10 w-10 rounded-full"
        />
        <div>
          <h3 className="font-semibold">{page.name}</h3>
          <p className="text-xs text-gray-500">
            {isPublic ? 'Public' : 'Privé'} • Juste maintenant
          </p>
        </div>
      </div>
      {renderMediaPreview()}
      <p className="text-sm">{content}</p>
    </div>
  )

  return (
    <div className="rounded-lg bg-primary-50 p-4">
      <h2 className="mb-4 text-lg font-semibold">Aperçu</h2>
      {selectedPages.length === 0 ? (
        <p className="text-gray-500">
          Sélectionnez au moins une page pour voir l'aperçu.
        </p>
      ) : (
        <div className="space-y-4">{selectedPages.map(renderPagePreview)}</div>
      )}
    </div>
  )
}

export default Preview
