import { useQuery } from '@tanstack/react-query'
import {
  getUser,
  getSocialAccounts,
  getFacebookAuthUrl,
  getAdminFacebookPages,
  getUserFacebookPages,
} from '../services/api'
import { useAuth } from './useAuth'
import { USER_ROLE } from '@/types'

export const useUser = () => {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: ['user'],
    queryFn: getUser,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  })
}

export const useSocialAccounts = () => {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: ['socialAccounts'],
    queryFn: getSocialAccounts,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  })
}

export const useFacebookAuthUrl = () => {
  return useQuery({
    queryKey: ['facebookAuthUrl'],
    queryFn: getFacebookAuthUrl,
    staleTime: Infinity,
  })
}

export const useFacebookPages = () => {
  const { isAuthenticated, user } = useAuth()

  const query = useQuery({
    queryKey: ['facebookPages'],
    queryFn:
      user?.role === USER_ROLE.SUPER_ADMIN
        ? getAdminFacebookPages
        : getUserFacebookPages,
    enabled: isAuthenticated,
  })

  return {
    ...query,
    refetch: () => query.refetch(),
  }
}
