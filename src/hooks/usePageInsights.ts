import { useAuthenticatedQuery } from "./useAuthenticatedQuery";
import api from "../services/api";

export const usePageInsights = (pageId: string) => {
  const { data } = useAuthenticatedQuery(`stats-${pageId}`, () => {
    return api.get(`/pages/${pageId}/insights`);
  });

  return data;
};
