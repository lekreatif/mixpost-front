import axios, { AxiosResponse } from 'axios'
import { IUser } from '@/types'

const API_URL = '/api'

export const api = axios.create({
  baseURL: API_URL,
})

export const login = async (email: string, password: string) => {
  return api.post('/auth/login', { email, password })
}

export const getMyPages = () => api.get('/pages/my-pages')

export const getMe: () => Promise<AxiosResponse<IUser>> = async () =>
  api.get('/users/me')

export const getFacebookAuthUrl = async (): Promise<string> => {
  return ''
}

export const getFacebookPages = async () => {
  return []
}

export const addFacebookPage = async () => {}

export const getSocialAccounts = async () => {
  return []
}

export const refreshAccessToken = async () => api.post('/auth/refresh')

export default api
