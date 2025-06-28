import { useState } from "react";
import {
  Moon,
  Sun,
  User,
  LogOut,
  Mail,
  Lock,
  LayoutDashboard,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { GlassCard } from "../components/ui/GlassCard";
import { NeonGlowButton } from "../components/ui/NeonGlowButton";
import { useTheme } from "../ThemeContext";
import { Modal } from "../components/ui/Modal";
import { useAuth } from "../hooks/useAuth";

export const SettingsPage = () => {
  const { theme, setTheme } = useTheme();

  const { user } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Split account info and security
  const [security, setSecurity] = useState({
    name: user?.name,
    password: "",
  });

  return (
    <div className="min-h-screen dark:bg-background-900 bg-white text-black dark:text-white p-4 lg:p-6 transition-colors duration-300">
      <div className="container-glass mb-8 flex flex-col gap-4">
        <Link
          to="/dashboard"
          className="glass-card-primary px-4 py-2 w-max flex items-center gap-2 hover:shadow-glow transition-all text-black dark:text-white ml-auto md:ml-0"
        >
          <LayoutDashboard className="w-5 h-5 text-primary-500" />
          <span className="font-semibold">Back to Dashboard</span>
        </Link>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="heading-1 text-4xl lg:text-5xl mb-2 ">Settings</h1>
            <p className="body-medium text-gray-500 dark:text-gray-300">
              Manage your preferences and account
            </p>
          </div>
          <NeonGlowButton
            color="secondary"
            className="mt-4 md:mt-0"
            onClick={() => setShowLogoutModal(true)}
          >
            <LogOut className="w-5 h-5 mr-2" /> Log Out
          </NeonGlowButton>
        </div>
      </div>

      {/* Theme section (1x2) */}
      <div className="container-glass mb-8">
        <GlassCard className="p-6">
          <h2 className="heading-3 mb-4 flex items-center gap-2 text-black dark:text-white text-xl md:text-3xl">
            <Sun className="w-5 h-5 text-yellow-400" />
            <Moon className="w-5 h-5 text-primary-500" />
            Theme
          </h2>
          <div className="flex items-center gap-4">
            <NeonGlowButton
              color={theme === "dark" ? "primary" : "secondary"}
              className={`flex-1 ${
                theme === "dark" ? "ring-2 ring-primary-500" : ""
              }`}
              onClick={() => setTheme("dark")}
            >
              <Moon className="w-4 h-4 mr-2" /> Dark
            </NeonGlowButton>
            <NeonGlowButton
              color={theme === "light" ? "accent" : "secondary"}
              className={`flex-1 ${
                theme === "light" ? "ring-2 ring-yellow-400" : ""
              }`}
              onClick={() => setTheme("light")}
            >
              <Sun className="w-4 h-4 mr-2" /> Light
            </NeonGlowButton>
          </div>
        </GlassCard>
      </div>

      {/* Account Info + Security grid (2x1) */}
      <div className="container-glass grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Account Info (read-only) */}
        <GlassCard className="p-6">
          <h2 className="heading-3 mb-4 flex items-center gap-2 text-black dark:text-white text-xl md:text-3xl">
            <User className="w-5 h-5 text-primary-500" /> Account Info
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-black dark:text-white">
                Email
              </label>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary-500" />
                <input
                  type="email"
                  value={user?.email}
                  readOnly
                  className="input-field bg-gray-100 dark:bg-background-700 cursor-not-allowed"
                  autoComplete="email"
                />
              </div>
            </div>
            <div>
              <label className="block mb-1 text-black dark:text-white">
                Username
              </label>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-secondary-500" />
                <input
                  type="text"
                  value={user?.username}
                  readOnly
                  className="input-field bg-gray-100 dark:bg-background-700 cursor-not-allowed"
                  autoComplete="username"
                />
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Account Security (editable) */}
        <GlassCard className="p-6">
          <h2 className="heading-3 mb-4 flex items-center gap-2 text-black dark:text-white text-xl md:text-3xl">
            <Lock className="w-5 h-5 text-primary-500 " />
            Account Security
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block mb-1 text-black dark:text-white">
                Name
              </label>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary-500" />
                <input
                  type="text"
                  value={user?.name}
                  onChange={(e) =>
                    setSecurity((s) => ({ ...s, name: e.target.value }))
                  }
                  className="input-field"
                  autoComplete="name"
                />
              </div>
            </div>
            <div>
              <label className="block mb-1 text-black dark:text-white">
                Change Password
              </label>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary-500" />
                <input
                  type="password"
                  value={security.password}
                  onChange={(e) =>
                    setSecurity((s) => ({ ...s, password: e.target.value }))
                  }
                  className="input-field"
                  autoComplete="new-password"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <NeonGlowButton color="primary" type="submit">
                Save Changes
              </NeonGlowButton>
            </div>
          </form>
        </GlassCard>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Confirm Logout"
      >
        <div className="mb-6 text-black dark:text-white">
          Are you sure you want to log out?
        </div>
        <div className="flex justify-end gap-4">
          <NeonGlowButton
            color="secondary"
            onClick={() => setShowLogoutModal(false)}
          >
            Cancel
          </NeonGlowButton>
          <NeonGlowButton
            color="primary"
            onClick={async () => {
              await logout();
              setShowLogoutModal(false);
              navigate("/login");
            }}
          >
            Log Out
          </NeonGlowButton>
        </div>
      </Modal>
    </div>
  );
};
