import React, { useEffect, useState, useMemo } from 'react'

interface Media {
  blob: Blob
  fileName: string
}

interface ThreeImageDisplayProps {
  medias: Media[]
  containerClassName?: string
  imageClassName?: string
}

const ThreeImageDisplay: React.FC<ThreeImageDisplayProps> = ({
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

  const layout = useMemo(() => {
    if (dimensions.length !== 3) return null

    const aspectRatios = dimensions.map((dim) => dim.width / dim.height)
    const widestIndex = aspectRatios.indexOf(Math.max(...aspectRatios))

    const areSimilar = (ratios: number[]) => {
      const tolerance = 0.2
      const avg = ratios.reduce((sum, ratio) => sum + ratio, 0) / ratios.length
      return ratios.every((ratio) => Math.abs(ratio - avg) < tolerance)
    }

    const areCloseToSquare = (ratios: number[]) => {
      const tolerance = 0.2
      return ratios.every((ratio) => Math.abs(ratio - 1) < tolerance)
    }

    if (areSimilar(aspectRatios) || areCloseToSquare(aspectRatios)) {
      return 'inline'
    } else {
      return widestIndex === 1
        ? 'wideMiddle'
        : widestIndex === 0
          ? 'wideFirst'
          : 'wideLast'
    }
  }, [dimensions])

  if (medias.length !== 3 || !layout) return null

  const renderImage = (index: number) => (
    <img
      key={imageUrls[index]}
      src={imageUrls[index]}
      alt={medias[index].fileName}
      className={`${imageClassName} aspect-auto`}
    />
  )

  return (
    <div className={containerClassName}>
      {layout === 'inline' && (
        <div className="flex gap-[2px]">
          {[0, 1, 2].map((index) => (
            <div key={index} className="w-1/3">
              {renderImage(index)}
            </div>
          ))}
        </div>
      )}
      {layout === 'wideFirst' && (
        <div className="flex flex-col gap-[2px]">
          <div className="w-full">{renderImage(0)}</div>
          <div className="flex gap-[2px]">
            <div className="w-1/2">{renderImage(1)}</div>
            <div className="w-1/2">{renderImage(2)}</div>
          </div>
        </div>
      )}
      {layout === 'wideMiddle' && (
        <div className="flex flex-col gap-[2px]">
          <div className="flex gap-[2px]">
            <div className="w-1/2">{renderImage(0)}</div>
            <div className="w-1/2">{renderImage(2)}</div>
          </div>
          <div className="w-full">{renderImage(1)}</div>
        </div>
      )}
      {layout === 'wideLast' && (
        <div className="flex flex-col gap-[2px]">
          <div className="flex gap-[2px]">
            <div className="w-1/2">{renderImage(0)}</div>
            <div className="w-1/2">{renderImage(1)}</div>
          </div>
          <div className="w-full">{renderImage(2)}</div>
        </div>
      )}
    </div>
  )
}

export default ThreeImageDisplay
