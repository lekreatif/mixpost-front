import { getAuthState } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export const useIsAuthenticated = () =>
  useQuery({
    queryKey: ["isAuthenticated"],
    queryFn: () => getAuthState(),
    retry: 0,
  });
