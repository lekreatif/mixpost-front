import React, { useEffect, useState, useMemo } from 'react'

interface Media {
  blob: Blob
  fileName: string
}

interface FourImageDisplayProps {
  medias: Media[]
  containerClassName?: string
  imageClassName?: string
}

const FourImageDisplay: React.FC<FourImageDisplayProps> = ({
  medias,
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

  const { layout, widestIndex } = useMemo(() => {
    if (dimensions.length !== 4) return { layout: null, widestIndex: -1 }

    const aspectRatios = dimensions.map((dim) => dim.width / dim.height)
    const maxRatio = Math.max(...aspectRatios)
    const widestIndex = aspectRatios.indexOf(maxRatio)

    const areCloseToSquare = (ratios: number[]) => {
      const tolerance = 0.2
      return ratios.every((ratio) => Math.abs(ratio - 1) < tolerance)
    }

    const areAllVertical = (ratios: number[]) => {
      return ratios.every((ratio) => ratio < 0.8)
    }

    if (areCloseToSquare(aspectRatios)) {
      return { layout: 'twoByTwo', widestIndex }
    } else if (areAllVertical(aspectRatios)) {
      return { layout: 'inline', widestIndex }
    } else {
      return { layout: widestIndex < 2 ? 'wideTop' : 'wideBottom', widestIndex }
    }
  }, [dimensions])

  if (medias.length !== 4 || !layout) return null

  const renderImage = (index: number, className: string) => (
    <img
      key={imageUrls[index]}
      src={imageUrls[index]}
      alt={medias[index].fileName}
      className={`${imageClassName} ${className}`}
    />
  )

  const renderThreeImages = (indices: number[]) => (
    <div className="flex gap-[2px]">
      {indices.map((index) => renderImage(index, 'w-1/3 aspect-auto'))}
    </div>
  )

  return (
    <div className={containerClassName}>
      {layout === 'twoByTwo' && (
        <div className="flex flex-col gap-[2px]">
          <div className="flex gap-[2px]">
            {renderImage(0, 'w-1/2 aspect-auto')}
            {renderImage(1, 'w-1/2 aspect-auto')}
          </div>
          <div className="flex gap-[2px]">
            {renderImage(2, 'w-1/2 aspect-auto')}
            {renderImage(3, 'w-1/2 aspect-auto')}
          </div>
        </div>
      )}
      {layout === 'inline' && (
        <div className="flex gap-[2px]">
          {[0, 1, 2, 3].map((index) => renderImage(index, 'w-1/4 aspect-auto'))}
        </div>
      )}
      {layout === 'wideTop' && (
        <div className="flex flex-col gap-[2px]">
          {renderImage(widestIndex, 'w-full aspect-auto')}
          {renderThreeImages([0, 1, 2, 3].filter((i) => i !== widestIndex))}
        </div>
      )}
      {layout === 'wideBottom' && (
        <div className="flex flex-col gap-[2px]">
          {renderThreeImages([0, 1, 2, 3].filter((i) => i !== widestIndex))}
          {renderImage(widestIndex, 'w-full aspect-auto')}
        </div>
      )}
    </div>
  )
}

export default FourImageDisplay
