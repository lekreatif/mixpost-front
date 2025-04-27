import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { FullPageLoader } from "@/components/layout/FullPageLoader";
import { useIsAuthenticated } from "@/hooks/useIsAuthenticated";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const location = useLocation();
  const { data: res, isLoading } = useIsAuthenticated();

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (!res?.data?.data?.isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
