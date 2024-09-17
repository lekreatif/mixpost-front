import React, { useRef, useMemo } from 'react'
import {
  RadioGroup,
  Radio,
  Field,
  Button,
  Input,
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@headlessui/react'
import { useVideoThumbnails } from '@/hooks/useVideoThumbnails'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

interface VideoThumbnailSelectorProps {
  media: { blob: Blob; fileName: string }
  selectedThumbnail: Blob | null
  onThumbnailSelect: (thumbnail: Blob) => void
  onCustomThumbnailSelect: (file: File) => void
  setThumbnails: React.Dispatch<React.SetStateAction<Blob[]>>
  thumbnails: Blob[]
  customThumbnail: Blob | null
}

const VideoThumbnailSelector: React.FC<VideoThumbnailSelectorProps> = ({
  media,
  setThumbnails,
  thumbnails,
  onCustomThumbnailSelect,
  selectedThumbnail,
  onThumbnailSelect,
  customThumbnail,
}) => {
  const customThumbnailInputRef = useRef<HTMLInputElement>(null)
  useVideoThumbnails(media.blob, setThumbnails)

  const renderedThumbnails = useMemo(
    () =>
      thumbnails.map((thumbnail, index) => (
        <Radio
          key={index}
          value={thumbnail}
          className="group relative flex shrink-0 grow-0 cursor-pointer rounded-lg transition focus:outline-none data-[checked]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-primary-300"
        >
          <div className="relative flex w-full items-center justify-between py-2">
            <div className="relative overflow-hidden rounded-md group-data-[checked]:border-2 group-data-[checked]:border-primary-600">
              <img
                src={URL.createObjectURL(thumbnail)}
                alt={`Suggested thumbnail ${index + 1}`}
                className="relative z-10 aspect-auto w-full max-w-28 shrink-0 grow cursor-pointer rounded object-cover"
              />
              <div className="absolute inset-0 z-20 hidden bg-primary-50/50 group-data-[checked]:block"></div>
              <CheckCircleIcon className="absolute left-1 top-1 z-30 size-4 fill-secondary-600 opacity-0 transition group-data-[checked]:opacity-100" />
            </div>
          </div>
        </Radio>
      )),
    [thumbnails]
  )

  if (!media.blob) return null

  return (
    <div className="">
      <h2 className="mb-4 text-sm font-medium text-gray-700">Miniatures</h2>
      <TabGroup>
        <TabList className="flex gap-0 bg-primary-200">
          <Tab className="w-1/2 px-3 py-1 text-sm/6 font-light text-primary-800 focus:outline-none data-[hover]:bg-secondary-100 data-[selected]:bg-secondary-200 data-[selected]:data-[hover]:bg-secondary-300 data-[focus]:outline-1 data-[focus]:outline-secondary-600">
            Suggestions
          </Tab>
          <Tab className="w-1/2 px-3 py-1 text-sm/6 font-light text-primary-800 focus:outline-none data-[hover]:bg-secondary-100 data-[selected]:bg-secondary-200 data-[selected]:data-[hover]:bg-secondary-300 data-[focus]:outline-1 data-[focus]:outline-secondary-600">
            Télécharger
          </Tab>
        </TabList>
        <TabPanels className="mt-3">
          <TabPanel>
            <RadioGroup value={selectedThumbnail} onChange={onThumbnailSelect}>
              <Field className="relative flex flex-row flex-nowrap gap-3 overflow-x-auto">
                {renderedThumbnails}
              </Field>
            </RadioGroup>
          </TabPanel>
          <TabPanel>
            <Field className="pointer-events-none relative my-4 touch-none">
              <Input
                onChange={(event) => {
                  if (event.target.files)
                    onCustomThumbnailSelect(event.target.files[0])
                }}
                accept="image/*"
                multiple={false}
                type="file"
                className="sr-only"
                ref={customThumbnailInputRef}
              />
              <Button
                className="pointer-events-auto flex flex-1 touch-auto items-center justify-center rounded-md border border-primary-300 bg-primary-50 p-2 text-sm text-primary-500 data-[hover]:border-secondary-300 data-[hover]:bg-primary-300"
                onClick={() => {
                  if (customThumbnailInputRef.current) {
                    customThumbnailInputRef.current.value = ''
                    customThumbnailInputRef.current.click()
                  }
                }}
              >
                Choisir de votre ordinateur
              </Button>
            </Field>
            {customThumbnail && (
              <RadioGroup
                value={selectedThumbnail}
                onChange={onThumbnailSelect}
              >
                <Radio
                  value={customThumbnail}
                  className="group relative flex shrink-0 grow-0 cursor-pointer rounded-lg transition focus:outline-none data-[checked]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-primary-300"
                >
                  <div className="relative flex w-full items-center justify-between py-2">
                    <div className="relative overflow-hidden rounded-md group-data-[checked]:border-2 group-data-[checked]:border-primary-600">
                      <img
                        src={URL.createObjectURL(customThumbnail)}
                        alt={`Custom thumbnail`}
                        className="relative z-10 aspect-auto w-full max-w-28 shrink-0 grow cursor-pointer rounded object-cover"
                      />
                      <div className="absolute inset-0 z-20 hidden bg-primary-50/50 group-data-[checked]:block"></div>
                      <CheckCircleIcon className="absolute left-1 top-1 z-30 size-4 fill-secondary-600 opacity-0 transition group-data-[checked]:opacity-100" />
                    </div>
                  </div>
                </Radio>
              </RadioGroup>
            )}
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  )
}

export default VideoThumbnailSelector
