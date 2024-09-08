import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react'

import { login, getMe, api, refreshAccessToken } from '../services/api'
import { IUser } from '@/types'

interface AuthContextType {
  accessToken: string | null
  isLoading: boolean
  error: string | null
  setAccessToken: (token: string | null) => void
  setIsLoading: (isLoading: boolean) => void
  setError: (error: string) => void
  user: IUser | null
  setUser: (user: IUser) => void
  login: (email: string, password: string) => void
  logout: () => void
}

export const AuthContext = createContext({} as AuthContextType)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSetUser = (user: IUser) => setUser(user)
  const handleAccessToken = (accessToken: string | null) =>
    setAccessToken(accessToken)
  const handleIsLoading = (isLoading: boolean) => setIsLoading(isLoading)
  const handleError = (error: string) => setError(error)

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true)
    setError('')
    try {
      const response = await login(email, password)
      const { accessToken } = response.data
      setAccessToken(accessToken)
      api.interceptors.request.use((config) => {
        config.headers.Authorization = `Bearer ${accessToken}`
        return config
      })
      const me = (await getMe()).data
      setUser(me)
    } catch (error: unknown) {
      setError('Erreur de connexion. Veuillez vérifier vos identifiants.')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    setAccessToken(null)
    setUser(null)
  }

  const handleRefreshAccessToken = useCallback(async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await refreshAccessToken()
      const { accessToken } = response.data
      setAccessToken(accessToken)
      api.interceptors.request.use((config) => {
        config.headers.Authorization = `Bearer ${accessToken}`
        return config
      })
      if (!user) {
        const me = (await getMe()).data
        setUser(me)
      }
    } catch (error: unknown) {
      setError('Erreur de connexion. Veuillez vérifier vous reconnecter.')
      console.error(error)
      // handleLogout()
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!accessToken) handleRefreshAccessToken()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        accessToken,
        setUser: handleSetUser,
        setAccessToken: handleAccessToken,
        setIsLoading: handleIsLoading,
        setError: handleError,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
