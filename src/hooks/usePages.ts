import { getMyPages } from "../services/api";
import { useAuthenticatedQuery } from "./useAuthenticatedQuery";

export const usePages = () => {
  const {
    data: res,
    isLoading,
    refetch,
    isRefetching,
    error,
  } = useAuthenticatedQuery("userPages", getMyPages);

  return {
    pages: res ? res.data : null,
    isLoading,
    refetch,
    isRefetching,
    error,
  };
};
