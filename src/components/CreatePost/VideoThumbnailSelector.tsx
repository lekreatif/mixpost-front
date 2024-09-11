import React, { useEffect } from 'react'
import { RadioGroup, Radio, Field } from '@headlessui/react'
import { useVideoThumbnails } from '@/hooks/useVideoThumbnails'

interface VideoThumbnailSelectorProps {
  videoFile: File | null
  selectedThumbnail: string | null
  onThumbnailSelect: (thumbnail: string) => void
  onCustomThumbnailSelect: (file: File) => void
  setThumbnails: React.Dispatch<React.SetStateAction<Blob[]>>
  thumbnails: Blob[]
}

const VideoThumbnailSelector: React.FC<VideoThumbnailSelectorProps> = ({
  videoFile,
  setThumbnails,
  thumbnails,
}) => {
  useVideoThumbnails(videoFile, setThumbnails)

  if (!videoFile) return null

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium text-gray-700">Miniatures</h3>
      <Field className="mt-4">
        <RadioGroup className="flex flex-row flex-nowrap gap-2 overflow-x-auto">
          {thumbnails.map((thumbnail, index) => (
            <Radio key={index} value={thumbnail}>
              <img
                src={URL.createObjectURL(thumbnail)}
                alt={`Suggested thumbnail ${index + 1}`}
                className="aspect-auto w-full max-w-28 shrink-0 grow-0 cursor-pointer rounded object-cover"
              />
            </Radio>
          ))}
        </RadioGroup>
      </Field>

      <Field></Field>
    </div>
  )
}

export default VideoThumbnailSelector
