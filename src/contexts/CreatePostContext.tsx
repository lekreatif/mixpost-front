import React, { createContext, useState } from 'react'
import { Page } from '@/types'

interface CreatePostContextType {
  selectedPages: Page[]
  setSelectedPages: (pages: Page[]) => void
  mediaType: 'video' | 'images' | null
  setMediaType: (type: 'video' | 'images' | null) => void
  content: string
  setContent: (content: string) => void
  isScheduled: boolean
  setIsScheduled: (isScheduled: boolean) => void
  scheduledDate: Date | null
  setScheduledDate: (date: Date | null) => void
  isPublic: boolean
  setIsPublic: (isPublic: boolean) => void
}

export const CreatePostContext = createContext<
  CreatePostContextType | undefined
>(undefined)

export const CreatePostProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedPages, setSelectedPages] = useState<Page[]>([])
  const [mediaType, setMediaType] = useState<'video' | 'images' | null>(null)
  const [content, setContent] = useState('')
  const [isScheduled, setIsScheduled] = useState(false)
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null)
  const [isPublic, setIsPublic] = useState(true)

  return (
    <CreatePostContext.Provider
      value={{
        selectedPages,
        setSelectedPages,
        mediaType,
        setMediaType,
        content,
        setContent,
        isScheduled,
        setIsScheduled,
        scheduledDate,
        setScheduledDate,
        isPublic,
        setIsPublic,
      }}
    >
      {children}
    </CreatePostContext.Provider>
  )
}
