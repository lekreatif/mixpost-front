import { useState, useCallback } from 'react'
import { MediaType } from '@/types'
import { usePostCreation } from '@/hooks/usePostCreation';

export const useMediaSelection = () => {
  const {
    mediaType,
    setMediaType,
    medias,
    setMedias,
    videoTitle,
    setVideoTitle,
    thumbnail,
    setThumbnail,
  } = usePostCreation()

  const [customThumbnail, setCustomThumbnail] = useState<Blob | null>(null)
  const [suggestedThumbnails, setSuggestedThumbnails] = useState<Blob[]>([])

  const handleFileSelection = useCallback(
    (files: FileList | null) => {
      if (!files) return

      const newFiles = Array.from(files).filter(
        (file) => !medias.some((media) => media.fileName === file.name)
      )

      if (newFiles.length === 0) return

      const readFilesAsBlobs = async (
        fileList: File[]
      ): Promise<{ blob: Blob; fileName: string }[]> => {
        const promises = fileList.map(
          (file) =>
            new Promise<{ blob: Blob; fileName: string }>((resolve, reject) => {
              const reader = new FileReader()
              const fileName = file.name
              reader.onload = () => {
                if (reader.result) {
                  const blob = new Blob([reader.result], { type: file.type })
                  resolve({ fileName, blob })
                }
              }
              reader.onerror = () => reject(reader.error)
              reader.readAsArrayBuffer(file)
            })
        )
        return Promise.all(promises)
      }

      readFilesAsBlobs(newFiles).then(
        (blobs: { blob: Blob; fileName: string }[]) => {
          if (mediaType === MediaType.VIDEO) {
            setMedias([blobs[0]])
            setVideoTitle(newFiles[0].name.split('.').slice(0, -1).join('.'))
          } else setMedias((prev) => [...prev, ...blobs])
        }
      )
    },
    [setMedias, mediaType, medias, setVideoTitle]
  )

  const removeFile = useCallback(
    (blobIndex: number) => {
      if (mediaType === MediaType.VIDEO) {
        setMedias([])
        setVideoTitle('')
        setSuggestedThumbnails([])
        setThumbnail(null)
      } else {
        setMedias((prev) => prev.filter((_, index) => index !== blobIndex))
      }
    },
    [mediaType, setMedias, setVideoTitle]
  )

  const handleThumbnailSelection = useCallback(
    (file: File | null) => setCustomThumbnail(file),
    []
  )

  const handleCustomThumbnailSelection = useCallback((file: File) => {
    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = () => {
      const arrayBuffer = reader.result
      if (arrayBuffer) {
        const blob = new Blob([arrayBuffer], { type: file.type })
        setCustomThumbnail(blob)
        setThumbnail(blob)
      }
    }
  }, [])

  return {
    mediaType,
    setMediaType,
    handleFileSelection,
    removeFile,
    videoTitle,
    setVideoTitle,
    customThumbnail,
    handleThumbnailSelection,
    suggestedThumbnails,
    thumbnail,
    setThumbnail,
    handleCustomThumbnailSelection,
    setSuggestedThumbnails,
    medias,
  }
}
