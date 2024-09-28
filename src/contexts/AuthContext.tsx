import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  refreshAccessToken,
  setIsRefreshing,
  getIsRefreshing,
  setRefreshPromise,
  getRefreshPromise,
  resetInactivityTimer,
} from "../services/api";
import { useIdleTimer } from "@/hooks/useIdleTimer";

const REFRESH_INTERVAL = 840000; // 14 minutes en millisecondes (légèrement inférieur à ACCESS_TOKEN_EXPIRY)

interface AuthContextType {
  refreshToken: () => Promise<void | null>;
  resetIdleTimer: () => void;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const resetIdleTimer = useIdleTimer();
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleRefreshToken = useCallback(async () => {
    if (getIsRefreshing()) return getRefreshPromise();

    setIsRefreshing(true);
    const promise = refreshAccessToken()
      .then(() => {
        setIsRefreshing(false);
        resetInactivityTimer();
      })
      .catch(error => {
        setIsRefreshing(false);
        throw error;
      });

    setRefreshPromise(promise);
    return promise;
  }, []);

  useEffect(() => {
    const startRefreshInterval = () => {
      refreshIntervalRef.current = setInterval(
        handleRefreshToken,
        REFRESH_INTERVAL
      );
    };

    startRefreshInterval();

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [handleRefreshToken]);

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
