import {
  createContext,
  ReactNode,
  useCallback,
  useState,
  useEffect,
} from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  login as loginApi,
  logout as logoutApi,
  refreshAccessToken,
  getUser,
  setIsRefreshing,
  getIsRefreshing,
  setRefreshPromise,
  getRefreshPromise,
} from '../services/api'
import { IUser } from '@/types'
import { useIdleTimer } from '@/hooks/useIdleTimer'

interface AuthContextType {
  isLoading: boolean
  error: string | null
  user: IUser | null
  isAuthenticated: boolean
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  setError: (error: string | null) => void
  refreshToken: () => Promise<void | null>
  resetIdleTimer: () => void
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<IUser | null>(null)
  const resetIdleTimer = useIdleTimer()

  const checkAuth = useCallback(async () => {
    setIsLoading(true)
    try {
      const userData = await getUser()
      setUser(userData.data as IUser)
      setIsAuthenticated(true)
      setError(null)
    } catch (err) {
      setIsAuthenticated(false)
      setUser(null)
      setError('Session expirée')
      // si je ne suis pas deja sur la page de login je veux navigate()
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleRefreshToken = useCallback(async () => {
    if (getIsRefreshing()) return getRefreshPromise()

    setIsRefreshing(true)
    const promise = refreshAccessToken()
      .then(() => {
        setIsRefreshing(false)
      })
      .catch((error) => {
        setIsRefreshing(false)
        throw error
      })

    setRefreshPromise(promise)
    return promise
  }, [])

  useEffect(() => {
      checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (isAuthenticated) {
      resetIdleTimer()
    }
  }, [isAuthenticated, resetIdleTimer])

  const handleLogin = useCallback(
    async (email: string, password: string, rememberMe: boolean) => {
      setIsLoading(true)
      try {
        await loginApi(email, password, rememberMe)
        await checkAuth()
      } catch (error) {
        setError('Erreur de connexion')
        setIsAuthenticated(false)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    },
    [checkAuth]
  )

  const handleLogout = useCallback(async () => {
    setIsLoading(true)
    try {
      await logoutApi()
      setIsAuthenticated(false)
      setUser(null)
      queryClient.clear()
    } catch (err) {
      setError('Erreur lors de la déconnexion')
    } finally {
      setIsLoading(false)
    }
  }, [queryClient])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        isAuthenticated,
        login: handleLogin,
        logout: handleLogout,
        checkAuth,
        refreshToken: handleRefreshToken,
        setError,
        resetIdleTimer,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
