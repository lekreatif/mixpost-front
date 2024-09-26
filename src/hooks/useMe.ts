import { getUser } from "@/services/api";
import { useAuthenticatedQuery } from "./useAuthenticatedQuery";

export const useUser = () => useAuthenticatedQuery("getMe", getUser);
