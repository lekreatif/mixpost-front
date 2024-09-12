import React, { useRef} from 'react'
import { RadioGroup, Radio, Field, Button, Input } from '@headlessui/react'
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
  onCustomThumbnailSelect,
}) => {
  const customThumbnailInputRef = useRef<HTMLInputElement>(null)
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

      <Field className="relative my-4">
        <Input onChange={(event)=>{
          if (event.target.files)
            onCustomThumbnailSelect(event.target.files[0])
        } } type="file" className="sr-only" ref={customThumbnailInputRef} />
        <Button onClick={()=> {
          if (customThumbnailInputRef.current)
            customThumbnailInputRef.current.click()
          }}>
          Choisir de votre ordinateur
        </Button>
      </Field>
    </div>
  )
}

export default VideoThumbnailSelector
