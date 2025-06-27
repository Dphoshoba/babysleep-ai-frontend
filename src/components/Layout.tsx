import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon, MoonIcon, SunIcon, UserCircleIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/24/outline';
import useDarkMode from '../hooks/useDarkMode';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/babies', label: 'Babies', icon: '👶' },
    { to: '/logs', label: 'Sleep Logs', icon: '📝' },
    { to: '/monitor', label: 'Sleep Monitor', icon: '📹' },
    { to: '/sounds', label: 'Sleep Sounds', icon: '🎵' },
    { to: '/cry-analyzer', label: 'Cry Analyzer', icon: '🧠' },
    { to: '/ai-chatbot', label: 'AI Consultant', icon: '🤖' },
    { to: '/tracker', label: 'Baby Tracker', icon: '📱' },
    { to: '/growth', label: 'Growth Tracker', icon: '📏' },
    { to: '/sleep-analytics', label: 'Sleep Analytics', icon: '📈' },
    { to: '/parent-info', label: 'Parent Info', icon: '📚' },
    { to: '/premium', label: 'Premium', icon: '👑' },
    { to: '/referrals', label: 'Referrals', icon: '🎁' },
    { to: '/profile', label: 'Baby Profile', icon: '👤' },
    { to: '/analytics', label: 'Analytics', icon: '📊' },
    { to: '/schedules', label: 'Schedules', icon: '🕒' },
    { to: '/settings', label: 'Settings', icon: '⚙️' },
    { to: '/terms', label: 'Terms', icon: '📃' },
    { to: '/privacy', label: 'Privacy', icon: '🔐' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar for desktop */}
      <nav className={`hidden md:flex flex-col ${sidebarCollapsed ? 'w-20' : 'w-64'} bg-indigo-700 text-white p-4 transition-all duration-300 overflow-y-auto`}>
        <div className="flex items-center justify-between mb-4">
          {!sidebarCollapsed && <h2 className="text-lg font-bold">BabySleep AI</h2>}
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            {sidebarCollapsed ? <ChevronDoubleRightIcon className="h-5 w-5" /> : <ChevronDoubleLeftIcon className="h-5 w-5" />}
          </button>
        </div>
        <div className="space-y-2 flex-1">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded hover:bg-indigo-600 transition-colors ${isActive ? 'bg-indigo-800 font-semibold' : ''}`
              }
            >
              <span className="text-lg">{icon}</span>
              {!sidebarCollapsed && <span className="text-sm">{label}</span>}
            </NavLink>
          ))}
        </div>
        <div className="mt-auto flex flex-col gap-4 pt-4 border-t border-indigo-600">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-2 px-3 py-2 rounded bg-indigo-600 hover:bg-indigo-500 transition-colors"
          >
            {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            {!sidebarCollapsed && (darkMode ? 'Light Mode' : 'Dark Mode')}
          </button>
          {user && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded bg-red-500 hover:bg-red-600 transition-colors"
            >
              {!sidebarCollapsed && 'Logout'}
            </button>
          )}
        </div>
      </nav>

      {/* Mobile top nav */}
      <div className="md:hidden w-full bg-indigo-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">BabySleep AI</h1>
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>

      {/* Slide-down mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-indigo-500 text-white p-4 space-y-2 max-h-screen overflow-y-auto">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 rounded hover:bg-indigo-600 transition-colors"
            >
              <span className="mr-2 text-lg">{icon}</span> {label}
            </NavLink>
          ))}
          <button onClick={() => setDarkMode(!darkMode)} className="block px-3 py-2 rounded hover:bg-indigo-600 transition-colors">
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          {user && (
            <button onClick={handleLogout} className="block px-3 py-2 rounded bg-red-500 hover:bg-red-600 transition-colors">
              Logout
            </button>
          )}
        </div>
      )}

      {/* Page content */}
      <main className="flex-1 p-4 dark:bg-gray-900 dark:text-white overflow-y-auto">
        {/* Avatar at top right (desktop only) */}
        {user && (
          <div className="hidden md:flex justify-end mb-4">
            <div className="flex items-center gap-2">
              <UserCircleIcon className="h-8 w-8 text-indigo-700 dark:text-indigo-300" />
              <span className="font-medium">{user.email}</span>
            </div>
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
}




