import React from 'react'
import { RiDraggable } from 'react-icons/ri'
import { FaRegTrashAlt } from 'react-icons/fa'
import { Button } from '@headlessui/react'

interface DraggableImageListProps {
  medias: { blob: Blob; fileName: string }[]
  removeFile: (index: number) => void
}

const DraggableImage = ({
  blob,
  index,
  removeFile,
}: {
  blob: Blob
  index: number
  removeFile: (index: number) => void
}) => {
  return (
    // <Draggable
    //   key={`image-${index}`}
    //   draggableId={`image-${index}`}
    //   index={index}
    // >
    //   {(provided) => (
    <div
      // ref={provided.innerRef}
      // {...provided.draggableProps}
      // {...provided.dragHandleProps}
      className="relative flex items-center justify-start"
    >
      <RiDraggable className="mr-2 text-primary-500" />
      <img
        src={URL.createObjectURL(blob)}
        alt={`Selected image ${index + 1}`}
        className="aspect-auto-md w-16 overflow-hidden rounded border object-cover"
      />
      <Button
        onClick={() => removeFile(index)}
        className="bg-primary-50-md ml-auto mr-0 rounded border p-1.5 text-red-500"
      >
        <FaRegTrashAlt />
      </Button>
    </div>
    //   )}
    // </Draggable>
  )
}

const DraggableImageList: React.FC<DraggableImageListProps> = ({
  medias,
  removeFile,
}) => {
  return (
    <div className="mt-4 flex flex-col gap-4">
      {medias.map((media, index) => (
        <DraggableImage
          key={`image-${index}`}
          blob={media.blob}
          index={index}
          removeFile={removeFile}
        />
      ))}
    </div>
  )
}

export default DraggableImageList
