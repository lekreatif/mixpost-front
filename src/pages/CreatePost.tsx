import React from 'react'
import { CreatePostProvider } from '@/contexts/CreatePostContext'
import PageSelection from '@/components/CreatePost/PageSelection'
import MediaSelection from '@/components/CreatePost/MediaSelection'
import ContentEditor from '@/components/CreatePost/ContentEditor'
import ScheduleSection from '@/components/CreatePost/ScheduleSection'
import VisibilitySection from '@/components/CreatePost/VisibilitySection'
import ActionButtons from '@/components/CreatePost/ActionButtons'
import Preview from '@/components/CreatePost/Preview'

const CreatePostPage: React.FC = () => {
  return (
    <CreatePostProvider>
      <div className="fixed z-10 hidden w-full max-w-[40rem] bg-primary-50 pb-4 pt-2 md:block">
        Créer une publication
      </div>
      <div className="flex justify-between h-full gap-8 pt-16">
        <div className="flex max-w-[40rem] flex-1 flex-col">
          <div className="relative flex-grow pb-4 space-y-8 overflow-y-auto">
            <PageSelection />
            <MediaSelection />
            <ContentEditor />
            <ScheduleSection />
            <VisibilitySection />
          </div>
          <ActionButtons />
        </div>
        <div className="max-w-[32rem] flex-1 overflow-y-auto p-4">
          <div className="mx-auto max-w-[32rem] overflow-hidden rounded-xl border">
            <Preview />
          </div>
        </div>
      </div>
    </CreatePostProvider>
  )
}

export default CreatePostPage
