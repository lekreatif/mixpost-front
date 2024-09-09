import axios, { AxiosResponse } from 'axios'
import { IUser } from '@/types'


const API_URL = '/api'

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important pour envoyer les cookies avec chaque requête
})

export const login = async (email: string, password: string): Promise<void> => {
  await api.post('/auth/login', { email, password })
  // Le serveur gère maintenant la création et l'envoi du cookie
}

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout')
  // Le serveur invalide le token et supprime le cookie
}

export const getMyPages = () => api.get('/pages/my-pages')

export const getUser: () => Promise<AxiosResponse<IUser>> = async () =>
  api.get('/users/me')

export const getFacebookAuthUrl = async (): Promise<string> => {
  const response = await api.get('/auth/facebook/url')
  return response.data.url
}

export const getFacebookPages = async () => {
  const response = await api.get('/facebook/pages')
  return response.data
}

export const addFacebookPage = async (pageId: string) => {
  await api.post('/facebook/pages', { pageId })
}

export const getSocialAccounts = async () => {
  const response = await api.get('/social/accounts')
  return response.data
}

export const refreshAccessToken = async (): Promise<void> => {
  await api.post('/auth/refresh')
}

export default api
