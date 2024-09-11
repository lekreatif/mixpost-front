import React, { useRef } from 'react'
import { FaImage, FaVideo, FaTimes } from 'react-icons/fa'
import { Button, Field, Input, Label } from '@headlessui/react'
import { useMediaSelection } from '@/hooks/useMediaSelection'
import VideoThumbnailSelector from './VideoThumbnailSelector'

const MediaSelection: React.FC = () => {
  const {
    mediaType,
    setMediaType,
    selectedFiles,
    handleFileSelection,
    removeFile,
    videoTitle,
    setVideoTitle,
    selectedThumbnail,
    setSelectedThumbnail,
    handleCustomThumbnailSelection,
    suggestedThumbnails,
    setSuggestedThumbnails,
  } = useMediaSelection()

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleMediaTypeSelection = (type: 'images' | 'video') => {
    setMediaType(type)
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="mb-4 rounded-xl border bg-primary-100 p-4">
      <h2 className="font-sans text-base font-medium">Média</h2>
      <p className="mb-2 text-xs font-light">
        Partagez des photos ou une vidéo. Vous ne pouvez pas excéder 10 photos.
      </p>
      {selectedFiles.length === 0 && (
        <div className="mt-4 flex space-x-4">
          <Button
            onClick={() => handleMediaTypeSelection('images')}
            className="flex flex-1 items-center justify-center rounded-md bg-primary-100 p-2 text-sm text-primary-500"
          >
            <FaImage className="mr-2" />
            Images
          </Button>
          <Button
            onClick={() => handleMediaTypeSelection('video')}
            className="flex flex-1 items-center justify-center rounded-md bg-primary-100 p-2 text-sm text-primary-500"
          >
            <FaVideo className="mr-2" />
            Vidéo
          </Button>
          <span className="inline-block flex-1"></span>
        </div>
      )}

      {mediaType === 'video' && selectedFiles.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between rounded-md bg-primary-50 p-2">
            <div className="flex items-center">
              {selectedThumbnail && (
                <img
                  src={selectedThumbnail}
                  alt="Video thumbnail"
                  className="mr-2 h-16 w-16 rounded object-cover"
                />
              )}
              <span className="text-sm">{selectedFiles[0].name}</span>
            </div>
            <Button
              onClick={() => removeFile(selectedFiles[0].name)}
              className="text-red-500"
            >
              <FaTimes />
            </Button>
          </div>
          <Field className="mt-4">
            <Label
              htmlFor="videoTitle"
              className="block text-sm font-medium text-primary-700"
            >
              Titre de la vidéo
            </Label>
            <Input
              type="text"
              id="videoTitle"
              value={videoTitle}
              placeholder={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              className="mt-1 block h-10 w-full rounded-md border-primary-300 bg-primary-50 px-4 data-[focus]:border-accent-300 data-[focus]:ring-accent-300 sm:text-sm"
            />
          </Field>
          <VideoThumbnailSelector
            videoFile={selectedFiles[0]}
            selectedThumbnail={selectedThumbnail}
            onThumbnailSelect={setSelectedThumbnail}
            onCustomThumbnailSelect={handleCustomThumbnailSelection}
            setThumbnails={setSuggestedThumbnails}
            thumbnails={suggestedThumbnails}
          />
        </div>
      )}

      {mediaType === 'images' && (
        <div className="mt-4 grid grid-cols-3 gap-4">
          {selectedFiles.map((file, index) => (
            <div key={file.name} className="relative">
              <img
                src={URL.createObjectURL(file)}
                alt={`Selected image ${index + 1}`}
                className="h-32 w-full rounded object-cover"
              />
              <Button
                onClick={() => removeFile(file.name)}
                className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white"
              >
                <FaTimes />
              </Button>
            </div>
          ))}
          {selectedFiles.length > 0 && selectedFiles.length < 10 && (
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-1 items-center justify-center rounded-md bg-primary-100 p-2 text-sm text-primary-500"
            >
              <FaImage className="mr-2" />
              Images
            </Button>
          )}
        </div>
      )}

      <Input
        ref={fileInputRef}
        type="file"
        accept={mediaType === 'images' ? 'image/*' : 'video/*'}
        multiple={mediaType === 'images'}
        onChange={(e) => {
          handleFileSelection(e.target.files)
          e.target.value = ''
        }}
        className="hidden"
      />
    </div>
  )
}

export default MediaSelection
