import axios, { AxiosResponse, AxiosError } from 'axios'
import { IUser, SocialAccount } from '@/types'

const API_URL = '/api'

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: any) => void
}> = []
let refreshPromise: Promise<void> | null = null

const processQueue = (error: Error | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })
  failedQueue = []
}

export const setIsRefreshing = (value: boolean) => {
  isRefreshing = value
}

export const getIsRefreshing = () => isRefreshing

export const setRefreshPromise = (promise: Promise<void> | null) => {
  refreshPromise = promise
}

export const getRefreshPromise = () => refreshPromise

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(() => {
          return api(originalRequest)
        }).catch((err) => {
          return Promise.reject(err)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        await refreshAccessToken()
        processQueue(null)
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError as Error)
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  }
)

export const refreshAccessToken = async (): Promise<void> => {
  try {
    await api.post('/auth/refresh')
  } catch (error) {
    console.error('Failed to refresh token:', error)
    throw error
  }
}

export const login = async (
  email: string,
  password: string,
  rememberMe: boolean
): Promise<void> => {
  await api.post('/auth/login', { email, password, rememberMe })
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

export const getAdminFacebookPages = async () => {
  const response = await api.get('/pages')
  return response.data
}

export const getUserFacebookPages = async () => {
  const response = await api.get('/pages/my-pages')
  return response.data
}

export const addFacebookPage = async (pageId: string) => {
  await api.post('/facebook/pages', { pageId })
}

export const getSocialAccounts = async () => {
  const response = await api.get('/social-accounts')
  return response.data
}

export const createSocialAccount = async (data: SocialAccount) =>
  api.post('/social-accounts', { ...data })

export const updateSocialAccount = async (
  accountData: SocialAccount
): Promise<SocialAccount> => {
  const response = await api.put(
    `/social-accounts/${accountData.id}`,
    accountData
  )
  return response.data as SocialAccount
}

export const createUser = async (data: IUser) => api.post('/users', { ...data })
export const updateUser = async (data: IUser) =>
  api.put(`/users/${data.email}`, data)
export const deleteUser = async (userId: number) =>
  api.delete(`/users/${userId}`)
export const getUsers = async () => api.get('/users')

export const assignUsersToPage = async (pageId: string, userIds: number[]) =>
  api.post(`/pages/assign-users`, { pageId, userIds })

export const resetInactivityTimer = () => {
  // Cette fonction sera appelée à chaque requête API réussie
  // pour réinitialiser le minuteur d'inactivité
  window.dispatchEvent(new Event('user_activity'))
}

api.interceptors.response.use(
  (response) => {
    resetInactivityTimer()
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)
export default api
