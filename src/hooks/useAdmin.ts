import { useState } from 'react'
import api from '../services/api'

interface User {
  id: number
  email: string
  role: string
}

export const useAdmin = () => {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.get('/users')
      setUsers(response.data)
    } catch (err) {
      setError('Erreur lors de la récupération des utilisateurs')
    } finally {
      setIsLoading(false)
    }
  }

  const getSocialAccounts = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.get('/social-accounts')
      return response.data
    } catch (err) {
      setError('Erreur lors de la récupération des comptes sociaux')
    } finally {
      setIsLoading(false)
    }
  }

  const addSocialAccount = async (accountData: {
    platform: string
    appClientId: string
    appClientSecret: string
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.post('/social-accounts', accountData)
      return response.data
    } catch (err) {
      setError("Erreur lors de l'ajout du compte social")
    } finally {
      setIsLoading(false)
    }
  }

  const updateSocialAccount = async (
    id: string,
    accountData: Partial<{
      platform: string
      appClientId: string
      appClientSecret: string
    }>
  ) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.put(`/social-accounts/${id}`, accountData)
      return response.data
    } catch (err) {
      setError('Erreur lors de la mise à jour du compte social')
    } finally {
      setIsLoading(false)
    }
  }

  const getFacebookAuthUrl = async (socialAccountId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.get(`/oauth/facebook/auth/${socialAccountId}`)
      return response.data.url
    } catch (err) {
      setError(
        "Erreur lors de la récupération de l'URL d'authentification Facebook"
      )
    } finally {
      setIsLoading(false)
    }
  }

  const getFacebookPages = async (socialAccountId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.get(`/oauth/facebook/pages/${socialAccountId}`)
      return response.data
    } catch (err) {
      setError('Erreur lors de la récupération des pages Facebook')
    } finally {
      setIsLoading(false)
    }
  }

  const addFacebookPage = async (
    pageId: string,
    name: string,
    accessToken: string
  ) => {
    setIsLoading(true)
    setError(null)
    try {
      await api.post('/pages', { pageId, name, accessToken })
    } catch (err) {
      setError("Erreur lors de l'ajout de la page Facebook")
    } finally {
      setIsLoading(false)
    }
  }

  const assignPageToUser = async (pageId: number, userId: number) => {
    setIsLoading(true)
    setError(null)
    try {
      await api.post('/pages/assign', { pageId, userId })
    } catch (err) {
      setError("Erreur lors de l'assignation de la page à l'utilisateur")
    } finally {
      setIsLoading(false)
    }
  }

  return {
    users,
    fetchUsers,
    getSocialAccounts,
    addSocialAccount,
    updateSocialAccount,
    getFacebookAuthUrl,
    getFacebookPages,
    addFacebookPage,
    assignPageToUser,
    isLoading,
    error,
  }
}
