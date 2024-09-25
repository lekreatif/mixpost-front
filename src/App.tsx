import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import SettingsPage from "@/pages/SettingsPage";
import PrivateRoute from "@/components/Auth/PrivateRoute";
import { NotificationProvider } from "@/contexts/NotificationContext";
import Notifications from "@/components/Modals/Notification";
import IsSuperAdminRoute from "@/components/Auth/IsSuperAdminRoute";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import CreatePostPage from "@/pages/CreatePost";

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="min-h-screen bg-primary-50">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Layout />
                  </PrivateRoute>
                }
              >
                <Route path="/" element={<DashboardPage />} />
                <Route path="/creer" element={<CreatePostPage />} />

                <Route
                  path="/settings"
                  element={
                    <IsSuperAdminRoute>
                      <SettingsPage />
                    </IsSuperAdminRoute>
                  }
                />
              </Route>
            </Routes>
            <Notifications />
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
