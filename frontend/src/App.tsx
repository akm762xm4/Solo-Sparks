import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthPage } from "./pages/AuthPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { PersonalityEditPage } from "./pages/PersonalityEditPage";
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
import { useGetProfileQuery } from "./api/profileApi";
import { ThemeProvider } from "./ThemeContext";
import { CustomToaster } from "./components/ui/CustomToaster";
import { Suspense } from "react";

function ProtectedLayout() {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return (
    <Sidebar>
      <Outlet />
    </Sidebar>
  );
}

function OnboardingCheck() {
  const location = useLocation();
  const { data: profileData, isLoading } = useGetProfileQuery();

  if (isLoading) return null;

  // If onboarding is complete and user is on onboarding page, redirect to dashboard
  if (
    profileData?.data?.isOnboardingComplete &&
    (location.pathname === "/onboarding" || location.pathname === "/")
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
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
            <Route
              element={
                <Suspense
                  fallback={
                    <div className="min-h-screen flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent" />
                    </div>
                  }
                >
                  <OnboardingCheck />
                </Suspense>
              }
            >
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/quests" element={<QuestsPage />} />
              <Route path="/reflections" element={<ReflectionsPage />} />
              <Route path="/personality" element={<PersonalityProfilePage />} />
              <Route
                path="/personality/edit"
                element={<PersonalityEditPage />}
              />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/rewards" element={<RewardsPage />} />
              <Route path="/" element={<OnboardingPage />} />
            </Route>
          </Route>
          <Route path="/login" element={<Navigate to="/auth" replace />} />
          <Route path="/register" element={<Navigate to="/auth" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
