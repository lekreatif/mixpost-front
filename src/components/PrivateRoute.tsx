import { AuthContext } from '@/contexts/AuthContext'
import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'

interface PrivateRouteProps {
  children: React.ReactNode
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { accessToken, isLoading } = useContext(AuthContext)

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!accessToken && !isLoading) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default PrivateRoute
