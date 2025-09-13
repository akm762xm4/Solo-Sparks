import { useState, type ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ListChecks,
  BookOpen,
  User,
  BarChart3,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  X as CloseIcon,
  ArrowLeft,
  Gift,
} from "lucide-react";

const menu = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { label: "Quests", icon: ListChecks, to: "/quests" },
  { label: "Reflections", icon: BookOpen, to: "/reflections" },
  { label: "Profile", icon: User, to: "/personality" },
  { label: "Analytics", icon: BarChart3, to: "/analytics" },
  { label: "Rewards", icon: Gift, to: "/rewards" },
  { label: "Settings", icon: SettingsIcon, to: "/settings" },
];

export const Sidebar = ({ children }: { children: ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Mobile menu button */}
      <button
        className={`fixed top-4 left-4 z-50 lg:hidden glass-card-primary p-2 rounded-xl shadow-neon-blue bg-white dark:bg-background-900 text-black dark:text-white ${
          location.pathname === "/onboarding" ? "hidden" : ""
        }`}
        onClick={() => setMobileOpen((v) => !v)}
        aria-label="Open sidebar"
      >
        {mobileOpen ? (
          <CloseIcon className=" w-6 h-6 text-primary-500" />
        ) : (
          <MenuIcon className="w-6 h-6 text-primary-500" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 transition-all duration-300
          ${collapsed ? "w-20 min-w-20" : "w-64 min-w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          glass-card backdrop-blur-glass border-r border-black/10 dark:border-white/30 rounded-none
          flex flex-col items-center py-8 px-2 lg:px-4
          shadow-glass
          bg-white dark:bg-background-900/40 text-black dark:text-white backdrop-blur-xl
        `}
        aria-label="Sidebar navigation"
        aria-hidden={!mobileOpen && window.innerWidth < 1024}
      >
        {/* Collapse/Expand button (desktop only) */}
        <button
          className={`hidden lg:block mb-8 text-primary-500 hover:text-accent-500 transition-colors  ${
            !collapsed && "ml-auto"
          } text-black dark:text-white`}
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <MenuIcon className="w-6 h-6 text-black dark:text-white" />
          ) : (
            <ArrowLeft className="w-6 h-6 text-black dark:text-white" />
          )}
        </button>

        {/* Menu Items */}
        <nav
          className={`flex-1 w-full flex flex-col gap-2 ${
            mobileOpen ? "mt-8" : ""
          }`}
        >
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.to);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive: navActive }) =>
                  `flex items-center gap-4 px-4 py-4 rounded-xl font-medium transition-all duration-200 text-lg
                  ${collapsed ? "justify-center px-2" : ""}
                  text-black dark:text-white
                  ${
                    navActive || isActive
                      ? "bg-gradient-to-r from-primary-500/20 to-accent-500/10 text-primary-500 shadow-neon-blue dark:bg-background-700"
                      : "text-text-secondary hover:text-primary-500 hover:shadow-neon-blue dark:hover:bg-background-800 hover:bg-black/5"
                  }
                  hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500/30`
                }
                onClick={() => setMobileOpen(false)}
                tabIndex={mobileOpen || window.innerWidth >= 1024 ? 0 : -1}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="w-6 h-6 text-black dark:text-white" />
                {!collapsed && (
                  <span className="truncate text-base font-semibold drop-shadow-lg text-black dark:text-white">
                    {item.label}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Sidebar overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}
      {/* Spacer for layout */}
      <div
        className={`transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        } hidden lg:block`}
      />

      <main
        className={`ml-0 transition-all duration-300 ${
          collapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        {children}
      </main>
    </>
  );
};
