import { useQuery } from "@tanstack/react-query";
import {
  getUser,
  getSocialAccounts,
  getFacebookAuthUrl,
} from "../services/api";
import { useAuthenticatedQuery } from "./useAuthenticatedQuery";
import { useIsAuthenticated } from "./useIsAuthenticated";

export const useUser = () => useAuthenticatedQuery(["user"], getUser);

export const useSocialAccounts = () => {
  const { data } = useIsAuthenticated();

  return useQuery({
    queryKey: ["socialAccounts"],
    queryFn: getSocialAccounts,
    enabled: data?.data.data?.isAuthenticated,
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
