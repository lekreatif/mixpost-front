import { useState, useCallback, useEffect } from 'react'
import { useCreatePost } from './useCreatePost'

export const useMediaSelection = () => {
  const { mediaType, setMediaType } = useCreatePost()
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [videoTitle, setVideoTitle] = useState('')
  const [thumbnailType, setThumbnailType] = useState<'suggested' | 'custom'>(
    'suggested'
  )
  const [customThumbnail, setCustomThumbnail] = useState<File | null>(null)
  const [suggestedThumbnails, setSuggestedThumbnails] = useState<Blob[]>([])
  const [selectedThumbnail, setSelectedThumbnail] = useState<string | null>(
    null
  )

  const handleFileSelection = useCallback(
    (files: FileList | null) => {
      if (!files) return

      const newFiles = Array.from(files).filter(
        (file) =>
          !selectedFiles.some((selectedFile) => selectedFile.name === file.name)
      )

      setSelectedFiles((prev) => [...prev, ...newFiles])
      if (mediaType === 'video' && newFiles.length > 0) {
        // without the extension
        setVideoTitle(newFiles[0].name.split('.').slice(0, -1).join('.'))
      }
    },
    [selectedFiles, mediaType]
  )

  const removeFile = useCallback(
    (fileToRemoveName: string) => {
      setSelectedFiles((prev) =>
        prev.filter((file) => file.name !== fileToRemoveName)
      )
      if (mediaType === 'video') {
        setVideoTitle('')
        setSuggestedThumbnails([])
        setSelectedThumbnail(null)
      }
    },
    [mediaType]
  )

  const handleThumbnailSelection = useCallback((file: File | null) => {
    setCustomThumbnail(file)
    setThumbnailType('custom')
  }, [])

  const handleCustomThumbnailSelection = useCallback((file: File) => {
    setCustomThumbnail(file)
    setThumbnailType('custom')
    setSelectedThumbnail(URL.createObjectURL(file))
  }, [])

  useEffect(() => {
    if (selectedFiles.length === 0) {
      setMediaType(null)
    }
  }, [selectedFiles, setMediaType])

  return {
    mediaType,
    setMediaType,
    selectedFiles,
    handleFileSelection,
    removeFile,
    videoTitle,
    setVideoTitle,
    thumbnailType,
    setThumbnailType,
    customThumbnail,
    handleThumbnailSelection,
    suggestedThumbnails,
    selectedThumbnail,
    setSelectedThumbnail,
    handleCustomThumbnailSelection,
    setSuggestedThumbnails,
  }
}
