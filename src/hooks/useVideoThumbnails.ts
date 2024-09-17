import { useEffect, useRef } from 'react'

export const useVideoThumbnails = (
  videoBlob: Blob | null,
  setThumbnails: React.Dispatch<React.SetStateAction<Blob[]>>
) => {
  const videoUrlRef = useRef<string | null>(null)
  useEffect(() => {
    if (!videoBlob) {
      setThumbnails([])
      return
    }

    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    videoUrlRef.current = URL.createObjectURL(videoBlob)
    video.src = videoUrlRef.current

    const captureFrame = (time: number): Promise<Blob> => {
      return new Promise((resolve, reject) => {
        video.currentTime = time
        video.onseeked = () => {
          try {
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
            ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)
            canvas.toBlob((blob) => {
              if (blob) {
                resolve(blob)
              } else {
                reject(new Error('Failed to create blob'))
              }
            }, 'image/jpeg')
          } catch (err) {
            reject(err)
          }
        }
      })
    }

    const generateThumbnails = async () => {
      try {
        await new Promise<void>((resolve) => {
          video.onloadedmetadata = () => resolve()
        })

        const newThumbnails: Blob[] = []
        for (let i = 0; i < 5; i++) {
          const time = (i * video.duration) / 7
          const blob = await captureFrame(time)
          newThumbnails.push(blob)
        }

        setThumbnails(newThumbnails)
      } catch (err) {
        //
      } finally {
        URL.revokeObjectURL(video.src)
      }
    }

    generateThumbnails()

    return () => {
      if (videoUrlRef.current) {
        URL.revokeObjectURL(videoUrlRef.current)
        videoUrlRef.current = null
      }
    }
  }, [videoBlob, setThumbnails])
}
