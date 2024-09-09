import { createContext, ReactNode, useCallback, useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { login as loginApi, logout as logoutApi, refreshAccessToken, getUser } from '../services/api'
import { IUser } from '@/types'

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthContextType {
  isLoading: boolean
  error: string | null
  user: IUser | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

export const AuthContext = createContext({} as AuthContextType)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<IUser | null>(null)

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => loginApi(credentials.email, credentials.password),
    onSuccess: () => {
      setIsAuthenticated(true)
      setError(null)
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
    onError: () => {
      setError('Erreur de connexion')
      setIsAuthenticated(false)
    },
  })

  const logoutMutation = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      setIsAuthenticated(false)
      setUser(null)
      queryClient.clear()
    },
    onError: () => {
      setError('Erreur lors de la déconnexion')
    },
  })

  const checkAuth = useCallback(async () => {
    try {
      await refreshAccessToken()
      const userData = await getUser()
      setUser(userData.data as unknown as IUser)
      setIsAuthenticated(true)
      setError(null)
    } catch (err) {
      setIsAuthenticated(false)
      setUser(null)
      setError('Session expirée')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const handleLogin = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      await loginMutation.mutateAsync({ email, password })
      await checkAuth()
    } finally {
      setIsLoading(false)
    }
  }, [loginMutation, checkAuth])

  const handleLogout = useCallback(async () => {
    setIsLoading(true)
    try {
      await logoutMutation.mutateAsync()
    } finally {
      setIsLoading(false)
    }
  }, [logoutMutation])

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
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
