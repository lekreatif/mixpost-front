import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  useUser,
  useSocialAccounts,
  useFacebookAuthUrl,
  useFacebookPages,
  useAddFacebookPage,
} from '../hooks/useApi'
import { useNotification } from '../contexts/NotificationContext'
import Header from '../components/Header'
import { SocialAccount } from '@/types'

interface FacebookPage {
  id: string
  name: string
  access_token: string
}

const SocialPagesPage: React.FC = () => {
  const { addNotification } = useNotification()

  const { data: user } = useUser()
  const { data: socialAccounts, isLoading, error } = useSocialAccounts()
  const { data: facebookPages } = useFacebookPages()
  const { mutateAsync: addFacebookPage } = useAddFacebookPage()

  

  const handleGetFacebookPages = async (accountId: string) => {
  console.log(facebookPages)
  }

  if (isLoading) return <div>Chargement...</div>
  if (error) return <div>Erreur : {error.message}</div>

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">
          Pages sociales
        </h1>

        <div className="mb-6 overflow-hidden bg-white p-6 shadow sm:rounded-lg">
          <h2 className="mb-4 text-xl font-semibold">
            Comptes sociaux connectés
          </h2>
          {socialAccounts?.map((account: SocialAccount) => (
            <div key={account.id} className="mb-4 rounded border p-4">
              <h3 className="font-semibold">{account.platform}</h3>
              {account.accessToken ? (
                <button
                  onClick={() => handleGetFacebookPages(account.id + '')}
                  className="mt-2 rounded bg-blue-500 px-4 py-2 text-white"
                >
                  Récupérer les pages
                </button>
              ) : (
                <button
                  onClick={() => {}}
                  className="mt-2 rounded bg-green-500 px-4 py-2 text-white"
                >
                  Connecter le compte
                </button>
              )}
            </div>
          ))}
        </div>

        {facebookPages && facebookPages.length > 0 ? (
          <div className="overflow-hidden bg-white p-6 shadow sm:rounded-lg">
            <h2 className="mb-4 text-xl font-semibold">
              Pages Facebook disponibles
            </h2>
            <ul>
              {facebookPages.map((page: FacebookPage) => (
                <li
                  key={page.id}
                  className="mb-2 flex items-center justify-between rounded border p-2"
                >
                  <span>{page.name}</span>
                  <button
                    onClick={()=>{}}
                    className="rounded bg-green-500 px-4 py-2 text-white"
                  >
                    Ajouter
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </main>
    </>
  )
}

export default SocialPagesPage
