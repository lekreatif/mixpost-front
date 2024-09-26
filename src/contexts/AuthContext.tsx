import { createContext, ReactNode, useCallback } from "react";

import {
  refreshAccessToken,
  setIsRefreshing,
  getIsRefreshing,
  setRefreshPromise,
  getRefreshPromise,
} from "../services/api";
import { useIdleTimer } from "@/hooks/useIdleTimer";


interface AuthContextType {
  refreshToken: () => Promise<void | null>;
  resetIdleTimer: () => void;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const resetIdleTimer = useIdleTimer();

  const handleRefreshToken = useCallback(async () => {
    if (getIsRefreshing()) return getRefreshPromise();

    setIsRefreshing(true);
    const promise = refreshAccessToken()
      .then(() => {
        setIsRefreshing(false);
      })
      .catch(error => {
        setIsRefreshing(false);
        throw error;
      });

    setRefreshPromise(promise);
    return promise;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        refreshToken: handleRefreshToken,
        resetIdleTimer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
