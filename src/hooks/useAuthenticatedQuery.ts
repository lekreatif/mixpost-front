import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { USER_ROLE } from "@/types";
import { useUser } from "./useMe";
import { useIsAuthenticated } from "./useIsAuthenticated";

export function useAuthenticatedQuery<TData>(
  key: string | string[],
  fetchFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, Error>, "queryKey" | "queryFn">
) {
  const { data: authData, isLoading: isAuthLoading } = useIsAuthenticated();

  return useQuery({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: async () => {
      return fetchFn();
    },
    ...options,
    enabled:
      (!isAuthLoading &&
        authData?.data.isAuthenticated &&
        (options?.enabled ?? true)) ??
      false,
  });
}

export function useAdminQuery<TData>(
  key: string | string[],
  fetchFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, Error>, "queryKey" | "queryFn">
) {
  const { data: userData } = useUser();
  const { data: authData } = useIsAuthenticated();
  const { refreshToken } = useAuth();

  return useQuery({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: async () => {
      if (!authData || !authData.data.isAuthenticated) {
        await refreshToken();
      }
      return fetchFn();
    },
    ...options,
    enabled:
      authData &&
      authData.data.isAuthenticated &&
      (options?.enabled ?? true) &&
      userData &&
      userData.data.role === USER_ROLE.SUPER_ADMIN,
  });
}
