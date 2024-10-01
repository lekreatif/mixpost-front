import { createContext, ReactNode } from "react";
import { useIdleTimer } from "@/hooks/useIdleTimer";

interface AuthContextType {
  isAuthenticated?: boolean;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  useIdleTimer();
  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};
