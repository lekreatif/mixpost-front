import { useState } from 'react'
import api, {
  createUser,
  createSocialAccount,
  deleteUser,
  updateSocialAccount,
  updateUser,
  getUsers,
  assignUsersToPage,
} from '../services/api'
import { useMutation, useQuery } from '@tanstack/react-query'
import { SocialAccount, IUser } from '@/types'
import { useAuth } from './useAuth'
import { AxiosResponse } from 'axios'
import { useFacebookPages } from './useApi'
export const useAdmin = () => {
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { refetch: refetchfacebookPages } = useFacebookPages()

  const getSocialAccounts = useMutation({
    mutationFn: async () => {
      setIsLoading(true)
      try {
        const response = await api.get('/social-accounts')
        setSocialAccounts(response.data)
      } catch (err) {
        setError('Erreur lors de la récupération des comptes sociaux')
      } finally {
        setIsLoading(false)
      }
    },
  })

  const addSocialAccountMutation = useMutation({
    mutationFn: (data: SocialAccount) => createSocialAccount(data),
    onSuccess: () => {
      getSocialAccounts.mutate()
    },
  })

  const editSocialAccount = useMutation({
    mutationFn: (data: SocialAccount) => updateSocialAccount(data),
    onSuccess: () => {
      getSocialAccounts.mutate()
    },
  })

  const getFacebookAuthUrl = async (accountId: string) => {
    try {
      const response = await api.get(`/oauth/facebook/auth/${accountId}`)
      return response.data.url
    } catch (err) {
      setError(
        "Erreur lors de la récupération de l'URL d'authentification Facebook"
      )
    }
  }

  const useUsers = () => {
    const { isAuthenticated } = useAuth()
    return useQuery<Promise<AxiosResponse<IUser[]>>>({
      queryKey: ['users'],
      queryFn: getUsers,
      enabled: isAuthenticated,
    })
  }

  const addUserMutation = useMutation({
    mutationFn: (data: IUser) => createUser(data),
  })

  const editUserMutation = useMutation({
    mutationFn: updateUser,
  })

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
  })

  const assignUsersToPageMutation = useMutation({
    mutationFn: ({
      pageId,
      userIds,
    }: {
      pageId: string
      userIds: number[]
    }) => {
      setIsLoading(true)
      return assignUsersToPage(pageId, userIds)
    },
    onSuccess: () => {
      refetchfacebookPages()
      setIsLoading(false)
    },
  })

  return {
    socialAccounts,
    isLoading,
    error,
    getSocialAccounts,
    addSocialAccountMutation,
    editSocialAccount,
    getFacebookAuthUrl,
    useUsers,
    addUserMutation,
    editUserMutation,
    deleteUserMutation,
    assignUsersToPageMutation,
  }
}
