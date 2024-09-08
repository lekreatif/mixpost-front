import { useQuery, useMutation } from '@tanstack/react-query'

import {
  getFacebookAuthUrl,
  getFacebookPages,
  addFacebookPage,
  getSocialAccounts,
  getMe,
  getMyPages,
} from '../services/api'
import { IUser } from '../types'

export const useMe = () => {
  return useQuery<IUser>({
    queryKey: ['me'],
    queryFn: async () => {
      const { data } = await getMe()
      return data as IUser
    },
  })
}

export const useMyPages = () => {
  return useQuery({
    queryKey: ['myPages'],
    queryFn: () => getMyPages(),
  })
}

export const useSocialAccounts = () => {
  return useQuery({
    queryKey: ['socialAccounts'],
    queryFn: () => getSocialAccounts(),
  })
}

export const useFacebookAuthUrl = () => {
  return useQuery({
    queryKey: ['facebookAuthUrl'],
    queryFn: () => getFacebookAuthUrl(),
  })
}

export const useFacebookPages = () => {
  return useQuery({
    queryKey: ['facebookPages'],
    queryFn: () => getFacebookPages(),
  })
}

export const useAddFacebookPage = () => {
  return useMutation({ mutationFn: addFacebookPage })
}
