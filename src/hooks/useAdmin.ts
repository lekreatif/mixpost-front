import { useState } from "react";
import api, {
  createUser,
  createSocialAccount,
  deleteUser,
  updateSocialAccount,
  updateUser,
  getUsers,
  assignUsersToPage,
  getSocialAccounts,
} from "../services/api";
import { useMutation } from "@tanstack/react-query";
import { SocialAccount, IUser } from "@/types";
import { usePages } from "./usePages";
import { useAdminQuery } from "./useAuthenticatedQuery";

export const useAdmin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refetch: refetchMyPages } = usePages();

  const useSocialAccounts = () => {
    const {
      data: res,
      isLoading,
      isRefetching,
      error,
      refetch,
    } = useAdminQuery("socialAccounts", getSocialAccounts);

    return {
      socialAccounts: res ? res.data : null,
      isLoading,
      refetch,
      isRefetching,
      error,
    };
  };
  const { refetch: refetchSocialAccounts } = useSocialAccounts();

  const addSocialAccountMutation = useMutation({
    mutationFn: (data: SocialAccount) => createSocialAccount(data),
    onSuccess: () => {
      refetchSocialAccounts();
    },
  });

  const editSocialAccount = useMutation({
    mutationFn: (data: SocialAccount) => updateSocialAccount(data),
    onSuccess: () => refetchSocialAccounts(),
  });

  const getFacebookAuthUrl = async (accountId: string) => {
    try {
      const response = await api.get(`/oauth/facebook/auth/${accountId}`);
      return response.data.url;
    } catch (err) {
      console.log((err as Error).message);
      setError(
        "Erreur lors de la récupération de l'URL d'authentification Facebook"
      );
    }
  };

  const useUsers = () => useAdminQuery("getUsers", getUsers);

  const { refetch: refetchUsers } = useUsers();

  const addUserMutation = useMutation({
    mutationFn: (data: IUser) => createUser(data),
    onSuccess: () => {
      refetchUsers();
    },
  });

  const editUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      refetchUsers();
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      refetchUsers();
    },
  });

  const assignUsersToPageMutation = useMutation({
    mutationFn: ({
      pageId,
      userIds,
    }: {
      pageId: string;
      userIds: number[];
    }) => {
      setIsLoading(true);
      return assignUsersToPage(pageId, userIds);
    },
    onSuccess: () => {
      refetchMyPages();
      setIsLoading(false);
    },
  });

  return {
    isLoading,
    error,
    useSocialAccounts,
    addSocialAccountMutation,
    editSocialAccount,
    getFacebookAuthUrl,
    useUsers,
    addUserMutation,
    editUserMutation,
    deleteUserMutation,
    assignUsersToPageMutation,
  };
};
