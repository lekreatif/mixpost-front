import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { USER_ROLE } from "@/types";

export function useAuthenticatedQuery<TData>(
  key: string | string[],
  fetchFn: () => Promise<TData>,
  isAdminQuery: boolean = false,
  options?: Omit<UseQueryOptions<TData, Error>, "queryKey" | "queryFn">
) {
  const { isAuthenticated, refreshToken, user } = useAuth();

  return useQuery({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: async () => {
      if (!isAuthenticated) {
        await refreshToken();
      }
      return fetchFn();
    },
    ...options,
    enabled:
      isAuthenticated &&
      (options?.enabled ?? true) &&
      (!isAdminQuery || (isAdminQuery && user?.role === USER_ROLE.SUPER_ADMIN)),
  });
}
