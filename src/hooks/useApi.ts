import { useQuery, useMutation } from '@tanstack/react-query'
import { getUser, getSocialAccounts, getFacebookAuthUrl, getFacebookPages, addFacebookPage } from '../services/api'
import { useAuth } from './useAuth'

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
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: ['facebookPages'],
    queryFn: getFacebookPages,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  })
}

export const useAddFacebookPage = () => {
  return useMutation(addFacebookPage)
}
