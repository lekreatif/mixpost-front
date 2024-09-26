import { useQuery, UseQueryOptions } from "@tanstack/react-query";
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
    queryFn: async () => fetchFn(),
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
  const { data: userData, isLoading: isUserLoading } = useUser();
  const { data: authData, isLoading: isAuthLoading } = useIsAuthenticated();

  return useQuery({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: async () => fetchFn(),
    ...options,
    enabled:
      (!isAuthLoading &&
        authData?.data.isAuthenticated &&
        (options?.enabled ?? true) &&
        !isUserLoading &&
        userData?.data.role === USER_ROLE.SUPER_ADMIN) ??
      false,
  });
}
