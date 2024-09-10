import { useFacebookPages } from '@/hooks/useApi'
import Header from '../components/Header'
import { Page } from '@/types'
import { Checkbox, Field } from '@headlessui/react'

const DashboardPage = () => {
  const { data: pages, isLoading, error } = useFacebookPages()

  if (isLoading) return <div>Chargement...</div>
  if (error) return <div>Erreur : {error.message}</div>

  return (
    <>
      <Header />
      <main className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="">
          {isLoading ? (
            <div className="py-4 text-center">
              <div className="w-12 h-12 mx-auto border-b-2 border-indigo-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {pages.map((page: Page) => (
                <Field key={page.name}>
                  <Checkbox className="inline-block aspect-square w-14 cursor-pointer rounded-full border-2 border-indigo-300 data-[checked]:border-indigo-600">
                    <img
                      className="pointer-events-none aspect-square w-full touch-none rounded-full object-cover object-center opacity-75 group-data-[checked]:opacity-100"
                      src={page.profilePictureUrl}
                      alt={page.name}
                    />
                  </Checkbox>
                </Field>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}

export default DashboardPage
