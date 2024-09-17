import React, { useEffect, useState, useMemo } from 'react'

interface Media {
  blob: Blob
  fileName: string
}

interface TwoImageDisplayProps {
  medias: Media[]
  landscapeThreshold?: number
  portraitThreshold?: number
  containerClassName?: string
  imageClassName?: string
}

const TwoImageDisplay: React.FC<TwoImageDisplayProps> = ({
  medias,
  landscapeThreshold = 1.2,
  portraitThreshold = 0.8,
  containerClassName = 'w-full max-w-lg mx-auto mt-4',
  imageClassName = 'object-cover',
}) => {
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [dimensions, setDimensions] = useState<
    { width: number; height: number }[]
  >([])

  useEffect(() => {
    const urls = medias.map((m) => URL.createObjectURL(m.blob))
    setImageUrls(urls)

    const imageDimensions = medias.map((m) => {
      return new Promise<{ width: number; height: number }>((resolve) => {
        const img = new Image()
        img.onload = () => resolve({ width: img.width, height: img.height })
        img.src = URL.createObjectURL(m.blob)
      })
    })

    Promise.all(imageDimensions).then(setDimensions)

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [medias])

  const layout = useMemo(() => {
    if (dimensions.length !== 2) return null

    const [dim1, dim2] = dimensions
    const aspectRatio1 = dim1.width / dim1.height
    const aspectRatio2 = dim2.width / dim2.height

    const isLandscape = (ratio: number) => ratio > landscapeThreshold
    const isPortrait = (ratio: number) => ratio < portraitThreshold

    if (isLandscape(aspectRatio1) && isLandscape(aspectRatio2))
      return 'horizontal'
    if (isPortrait(aspectRatio1) && isPortrait(aspectRatio2)) return 'vertical'
    return 'mixed'
  }, [dimensions, landscapeThreshold, portraitThreshold])

  if (medias.length < 2 || !layout) return null

  return (
    <div className={containerClassName}>
      {layout === 'horizontal' && (
        <div className="flex gap-[2px]">
          {imageUrls.map((url, index) => (
            <img
              key={url}
              src={url}
              alt={medias[index].fileName}
              className={`${imageClassName} aspect-auto w-1/2`}
            />
          ))}
        </div>
      )}
      {layout === 'vertical' && (
        <div className="flex flex-col gap-[2px]">
          {imageUrls.map((url, index) => (
            <img
              key={url}
              src={url}
              alt={medias[index].fileName}
              className={`${imageClassName} aspect-auto w-full`}
            />
          ))}
        </div>
      )}
      {layout === 'mixed' && (
        <div className="grid grid-cols-2 gap-[2px]">
          {imageUrls.map((url, index) => (
            <img
              key={url}
              src={url}
              alt={medias[index].fileName}
              className={`${imageClassName} h-full w-full`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default TwoImageDisplay
