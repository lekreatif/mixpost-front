import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import AdminPage from './pages/AdminPage'
import SettingsPage from './pages/SettingsPage'
import SocialPagesPage from './pages/SocialPagesPage'
import PrivateRoute from './components/PrivateRoute'
import { NotificationProvider } from './contexts/NotificationContext'
import Notifications from './components/Notification'
import IsSuperAdminRoute from './components/IsSuperAdminRoute'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <DashboardPage />
                  </PrivateRoute>
                }
              />

              <Route
                path="/social-pages"
                element={
                  <PrivateRoute>
                    <SocialPagesPage />
                  </PrivateRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <PrivateRoute>
                    <IsSuperAdminRoute>
                      <AdminPage />
                    </IsSuperAdminRoute>
                  </PrivateRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <PrivateRoute>
                    <IsSuperAdminRoute>
                      <SettingsPage />
                    </IsSuperAdminRoute>
                  </PrivateRoute>
                }
              />
            </Routes>
            <Notifications />
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App
