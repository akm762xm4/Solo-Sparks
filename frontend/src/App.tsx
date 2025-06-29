import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import { AuthPage } from "./pages/AuthPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { QuestsPage } from "./pages/QuestsPage";
import { ReflectionsPage } from "./pages/ReflectionsPage";
import { PersonalityProfilePage } from "./pages/PersonalityProfilePage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { RewardsPage } from "./pages/RewardsPage";
import { useAuthStore } from "./store/authStore";
import { Sidebar } from "./components/Sidebar";
import { useEffect } from "react";
import { useGetCurrentUserQuery } from "./api/authApi";
import { ThemeProvider } from "./ThemeContext";
import { CustomToaster } from "./components/ui/CustomToaster";

function ProtectedLayout() {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return (
    <Sidebar>
      <Outlet />
    </Sidebar>
  );
}

function App() {
  const { token, setUser } = useAuthStore();
  const { data: userData } = useGetCurrentUserQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (userData?.data) {
      setUser(userData.data);
    }
  }, [userData, setUser]);

  return (
    <ThemeProvider>
      <CustomToaster />
      <Router>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route element={<ProtectedLayout />}>
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/quests" element={<QuestsPage />} />
            <Route path="/reflections" element={<ReflectionsPage />} />
            <Route path="/personality" element={<PersonalityProfilePage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/rewards" element={<RewardsPage />} />
            <Route path="/" element={<OnboardingPage />} />
          </Route>
          <Route path="/login" element={<Navigate to="/auth" replace />} />
          <Route path="/register" element={<Navigate to="/auth" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
