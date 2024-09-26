import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { FullPageLoader } from "@/components/layout/FullPageLoader";
import { useIsAuthenticated } from "@/hooks/useIsAuthenticated";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { resetIdleTimer } = useAuth();
  const location = useLocation();
  const {
    data,
    isLoading,
  } = useIsAuthenticated();

  useEffect(() => {
    if (data && data.data.isAuthenticated) {
      resetIdleTimer();
    }
  }, [data, location, resetIdleTimer]);

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (!data || !data.data.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
