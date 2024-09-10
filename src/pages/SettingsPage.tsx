import React, { useState, useEffect, useMemo } from 'react'
import { useAdmin } from '@/hooks/useAdmin'
import Header from '@/components/Header'
import { SocialAccount, IUser } from '@/types'
import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  TabGroup,
  Button,
} from '@headlessui/react'
import SocialAccountsList from '@/components/SocialAccountsList'
import SocialAccountForm from '@/components/SocialAccountForm'
import ConnectedPagesList from '@/components/ConnectedPagesList'
import { useFacebookPages } from '@/hooks/useApi'
import { FaPlus, FaFacebookF } from 'react-icons/fa'
import { AxiosResponse } from 'axios'
import PageDetailsModal from '@/components/PageDetailsModal'
import { Page } from '@/types'

import UsersList from '@/components/UsersList'
import UserForm from '@/components/UserForm'

import Modal from '@/components/Modal'

enum E_MODAL_ACTIONS {
  'HANDLE_PAGE' = 'HANDLE_PAGE',
  'HANDLE_SOCIAL_ACCOUNT' = 'HANDLE_SOCIAL_ACCOUNT',
  'HANDLE_USER' = 'HANDLE_USER',
  'HANDLE_PAGE_DETAILS' = 'HANDLE_PAGE_DETAILS',
}

const SettingsPage: React.FC = () => {
  const {
    getSocialAccounts,
    editSocialAccount,
    isLoading,
    error,
    addSocialAccountMutation,
    socialAccounts,
    getFacebookAuthUrl,
    useUsers,
    addUserMutation,
    editUserMutation,
    deleteUserMutation,
  } = useAdmin()

  const [selectedAccount, setSelectedAccount] = useState<SocialAccount | null>(
    null
  )
  const { data: pages, isLoading: pagesLoading } = useFacebookPages()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalAction, setModalAction] = useState<E_MODAL_ACTIONS | null>(null)
  const [selectedPage, setSelectedPage] = useState<Page | null>(null)
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null)
  const { data: usersResult, isLoading: usersAreLoading } = useUsers()

  const users = useMemo(() => {
    if (usersResult) {
      return (usersResult as unknown as AxiosResponse).data
    }
    return []
  }, [usersResult])

  useEffect(() => {
    getSocialAccounts.mutateAsync()
  }, [])

  const handleAddAccount = async (account: SocialAccount) => {
    await addSocialAccountMutation.mutateAsync(account)
    setIsModalOpen(false)
    getSocialAccounts.mutateAsync()
  }

  const handleUpdateAccount = async (account: SocialAccount) => {
    await editSocialAccount.mutateAsync(account)
    setIsModalOpen(false)
    getSocialAccounts.mutateAsync()
  }

  const handleAddUser = async (user: User) => {
    await addUserMutation.mutateAsync(user)
    setIsModalOpen(false)
  }

  const handleUpdateUser = async (user: User) => {
    await editUserMutation.mutateAsync(user)
    setIsModalOpen(false)
  }

  const handleDeleteUser = async (userId: number) => {
    await deleteUserMutation.mutateAsync(userId)
  }

  const handleConnectNewPage = async (accountId: number) => {
    try {
      const authUrl = await getFacebookAuthUrl(accountId.toString())
      setIsModalOpen(false)
      window.location.href = authUrl
    } catch (err) {
      console.error(
        "Erreur lors de la récupération de l'URL d'authentification:",
        err
      )
    }
  }

  const handlePageClick = (page: Page) => {
    setSelectedPage(page)
    setIsModalOpen(true)
    setModalAction(E_MODAL_ACTIONS.HANDLE_PAGE_DETAILS)
  }

  const getModalTitle = () => {
    switch (modalAction) {
      case E_MODAL_ACTIONS.HANDLE_USER:
        return 'Ajouter/Modifier un utilisateur'
      case E_MODAL_ACTIONS.HANDLE_SOCIAL_ACCOUNT:
        return 'Ajouter/Modifier un reseau social'
      case E_MODAL_ACTIONS.HANDLE_PAGE:
        return 'Connecter une page'
      case E_MODAL_ACTIONS.HANDLE_PAGE_DETAILS:
        return 'Détails de la page'
      default:
        return ''
    }
  }

  const modalContent = {
    HANDLE_USER: (
      <UserForm
        user={selectedUser || {}}
        onSubmit={selectedUser ? handleUpdateUser : handleAddUser}
        onCancel={() => setIsModalOpen(false)}
      />
    ),
    HANDLE_SOCIAL_ACCOUNT: (
      <SocialAccountForm
        account={selectedAccount || {}}
        onSubmit={selectedAccount ? handleUpdateAccount : handleAddAccount}
        onCancel={() => setIsModalOpen(false)}
      />
    ),
    HANDLE_PAGE: (
      <div className="space-y-4">
        {socialAccounts.map((account) => (
          <Button
            key={account.id}
            onClick={() => handleConnectNewPage(account.id)}
            className="flex w-full items-center justify-between rounded-lg bg-white px-4 py-3 text-left text-sm font-medium text-gray-700 transition-colors duration-200 ease-in-out hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <span className="flex items-center">
              {account.platform === 'facebook' && (
                <FaFacebookF className="mr-3 text-indigo-600" />
              )}
              {account.platform}
            </span>
            <span className="text-indigo-600">&rarr;</span>
          </Button>
        ))}
      </div>
    ),

    HANDLE_PAGE_DETAILS: <PageDetailsModal page={selectedPage} />,
  }

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        Chargement...
      </div>
    )
  if (error)
    return <div className="text-center text-red-500">Erreur : {error}</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-extrabold text-gray-900">
          Paramètres
        </h1>
        <TabGroup>
          <TabList className="mb-8 flex space-x-1 rounded-md bg-gray-900/10 p-1">
            {['Pages', 'Réseaux', 'Utilisateurs'].map((category) => (
              <Tab
                key={category}
                className={({ selected }) =>
                  `w-full rounded-md py-2.5 text-sm font-medium leading-5 text-gray-700 ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2 ${
                    selected
                      ? 'bg-white'
                      : 'text-gray-500 hover:bg-white/[0.12] hover:text-gray-800'
                  }`
                }
              >
                {category}
              </Tab>
            ))}
          </TabList>
          <TabPanels>
            <TabPanel className="rounded-xl bg-white p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Pages Connectées
                </h2>
                <Button
                  onClick={() => {
                    setIsModalOpen(true)
                    setModalAction(E_MODAL_ACTIONS.HANDLE_PAGE)
                  }}
                  className="flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 ease-in-out hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <FaPlus className="mr-2" /> Ajouter
                </Button>
              </div>
              {pagesLoading ? (
                <div className="py-4 text-center">
                  <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-500"></div>
                </div>
              ) : (
                <ConnectedPagesList
                  pages={pages || []}
                  onPageClick={handlePageClick}
                />
              )}
            </TabPanel>
            <TabPanel className="rounded-xl bg-white p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Réseaux Sociaux
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(true)
                    setModalAction(E_MODAL_ACTIONS.HANDLE_SOCIAL_ACCOUNT)
                    setSelectedAccount(null)
                  }}
                  className="flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 ease-in-out hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <FaPlus className="mr-2" /> Ajouter
                </button>
              </div>
              <SocialAccountsList
                accounts={socialAccounts}
                onEdit={(account) => {
                  setSelectedAccount(account)
                  setIsModalOpen(true)
                  setModalAction(E_MODAL_ACTIONS.HANDLE_SOCIAL_ACCOUNT)
                }}
              />
            </TabPanel>

            <TabPanel className="rounded-xl bg-white p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Utilisateurs
                </h2>
                <button
                  onClick={() => {
                    setSelectedUser(null)
                    setIsModalOpen(true)
                    setModalAction(E_MODAL_ACTIONS.HANDLE_USER)
                  }}
                  className="flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 ease-in-out hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <FaPlus className="mr-2" /> Ajouter
                </button>
              </div>
              {!usersAreLoading && users && (
                <UsersList
                  users={users}
                  onEdit={(user) => {
                    setSelectedUser(user)
                    setIsModalOpen(true)
                    setModalAction(E_MODAL_ACTIONS.HANDLE_USER)
                  }}
                  onDelete={handleDeleteUser}
                />
              )}
            </TabPanel>
          </TabPanels>
        </TabGroup>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={getModalTitle()}
        >
          {modalAction ? modalContent[modalAction] : null}
        </Modal>
      </main>
    </div>
  )
}

export default SettingsPage
