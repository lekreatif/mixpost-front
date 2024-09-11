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
            <div className="w-10 h-10 mx-auto border-b-2 rounded-full border-secondary-500 animate-spin"></div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:items-center md:gap-4">
            <div className="">
              <h2 className="text-sm font-medium">Vos Pages:</h2>
            </div>
            <div className="flex flex-wrap gap-1">
              {pages.map((page: Page) => (
                <Field key={page.name}>
                  <Checkbox
                    className="data-[checked]:border-secondary-600 border-primary-300 group relative inline-block aspect-square w-9 cursor-pointer rounded-full border-2"
                    // checked={index === 0}
                  >
                    <img
                      className="primaryscale group-data-[checked]:primaryscale-0 pointer-events-none aspect-square w-full touch-none rounded-full object-cover object-center"
                      src={page.profilePictureUrl}
                      alt={page.name}
                    />
                    <span className="border-secondary-600 bg-primary-50 absolute right-0 top-[20%] hidden h-4 w-4 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border-2 p-0.5 group-data-[checked]:flex">
                      <BsCheckLg className="inline-block w-full h-full text-secondary-600" />
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
