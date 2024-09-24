import { useQuery } from "@tanstack/react-query";
import {
  getUser,
  getSocialAccounts,
  getFacebookAuthUrl,
} from "../services/api";
import { useAuth } from "./useAuth";
import { useAuthenticatedQuery } from "./useAuthenticatedQuery";

export const useUser = () => useAuthenticatedQuery(["user"], getUser);

export const useSocialAccounts = () => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ["socialAccounts"],
    queryFn: getSocialAccounts,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
};

export const useFacebookAuthUrl = () => {
  return useQuery({
    queryKey: ["facebookAuthUrl"],
    queryFn: getFacebookAuthUrl,
    staleTime: Infinity,
  });
};
