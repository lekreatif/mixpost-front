import { useState } from 'react'
import api, { createSocialAccount, updateSocialAccount } from '../services/api'
import { useMutation } from '@tanstack/react-query' 
import { SocialAccount } from '@/types'

export const useAdmin = () => {
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSocialAccounts = useMutation({
    mutationFn: async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/social-accounts');
        setSocialAccounts(response.data);
      } catch (err) {
        setError('Erreur lors de la récupération des comptes sociaux');
      } finally {
        setIsLoading(false);
      }
    }
  });

  const addSocialAccountMutation = useMutation({
    mutationFn: (data: SocialAccount) => createSocialAccount(data),
    onSuccess: () => {
      getSocialAccounts.mutate();
    },
  });

  const editSocialAccount = useMutation({
    mutationFn: (data: SocialAccount) => updateSocialAccount(data),
    onSuccess: () => {
      getSocialAccounts.mutate();
    },
  });

  const getFacebookAuthUrl = async (accountId: string) => {
    try {
      const response = await api.get(`/oauth/facebook/auth/${accountId}`);
      return response.data.url;
    } catch (err) {
      setError("Erreur lors de la récupération de l'URL d'authentification Facebook");
    }
  };

  return {
    socialAccounts,
    isLoading,
    error,
    getSocialAccounts,
    addSocialAccountMutation,
    editSocialAccount,
    getFacebookAuthUrl,
  };
};
