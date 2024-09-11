import React from 'react'
import { useCreatePost } from '@/hooks/useCreatePost'
import { useFacebookPages } from '@/hooks/useApi'
import { Checkbox, Field } from '@headlessui/react'
import { Page } from '@/types'
import { BsCheckLg } from 'react-icons/bs'

const PageSelection: React.FC = () => {
  const { selectedPages, setSelectedPages } = useCreatePost()
  const { data: pages, isLoading, error } = useFacebookPages()

  if (isLoading) return <div>Chargement des pages...</div>
  if (error) return <div>Erreur : {error.message}</div>

  return (
    <div className="mb-4 rounded-xl border bg-primary-100 p-4">
      <h2 className="mb-2 font-sans text-base font-medium">Publiez sur</h2>
      <div className="flex flex-wrap gap-2">
        {pages.map((page: Page) => (
          <Field key={page.name}>
            <Checkbox
              className="group flex flex-col justify-center"
              checked={selectedPages.some((p) => p.pageId === page.pageId)}
              onChange={(checked) => {
                if (checked) {
                  setSelectedPages([...selectedPages, page])
                } else {
                  setSelectedPages(
                    selectedPages.filter((p) => p.pageId !== page.pageId)
                  )
                }
              }}
            >
              <div className="relative inline-block aspect-square w-9 cursor-pointer rounded-full border-2 border-primary-300 group-data-[checked]:border-secondary-600">
                <img
                  className="pointer-events-none aspect-square w-full touch-none rounded-full object-cover object-center grayscale group-data-[checked]:grayscale-0"
                  src={page.profilePictureUrl}
                  alt={page.name}
                />
                <span className="absolute right-0 top-[20%] hidden h-4 w-4 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border-2 border-secondary-600 bg-primary-50 p-0.5 group-data-[checked]:flex">
                  <BsCheckLg className="inline-block h-full w-full text-secondary-600" />
                </span>
              </div>
              <span className="line-clamp-1 w-12 text-xs font-light text-primary-400 group-data-[checked]:text-primary-600">
                {page.name}
              </span>
            </Checkbox>
          </Field>
        ))}
      </div>
    </div>
  )
}

export default PageSelection
