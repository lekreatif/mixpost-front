import { getAuthState } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export const useIsAuthenticated = (enabled?: boolean) =>
  useQuery({
    queryKey: ["isAuthenticated"],
    queryFn: () => getAuthState(),
    retry: 0,
    enabled,
    staleTime: 13 * 60 * 1000,
  });
