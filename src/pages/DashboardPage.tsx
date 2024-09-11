import { useFacebookPages } from '@/hooks/useApi'
import { Page } from '@/types'
import { Checkbox, Field } from '@headlessui/react'
import { BsCheckLg } from 'react-icons/bs'

const DashboardPage = () => {
  const { data: pages, isLoading, error } = useFacebookPages()

  if (isLoading) return <div>Chargement...</div>
  if (error) return <div>Erreur : {error.message}</div>

  return (
    <>
      <div className="pt-12 md:py-0">
        {isLoading ? (
          <div className="py-4 text-center">
            <div className="border-secondary-500 mx-auto h-10 w-10 animate-spin rounded-full border-b-2"></div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:items-center md:gap-4">
            <div className="">
              <h2 className="text-sm font-medium">Vos Pages:</h2>
            </div>
            <div className="flex flex-wrap gap-1">
              {pages.map((page: Page) => (
                <Field key={page.name}>
                  <Checkbox className="group flex flex-col justify-center">
                    <div className="group-data-[checked]:border-secondary-600 border-primary-300 relative inline-block aspect-square w-9 cursor-pointer rounded-full border-2">
                      <img
                        className="pointer-events-none aspect-square w-full touch-none rounded-full object-cover object-center grayscale group-data-[checked]:grayscale-0"
                        src={page.profilePictureUrl}
                        alt={page.name}
                      />
                      <span className="border-secondary-600 bg-primary-50 absolute right-0 top-[20%] hidden h-4 w-4 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border-2 p-0.5 group-data-[checked]:flex">
                        <BsCheckLg className="text-secondary-600 inline-block h-full w-full" />
                      </span>
                    </div>
                    <span className="text-primary-400 group-data-[checked]:text-primary-600 line-clamp-1 w-12 text-xs font-light">
                      {page.name}
                    </span>
                  </Checkbox>
                </Field>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default DashboardPage
