import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  const [darkMode, setDarkMode] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  // Toggle dark mode class on html element
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-all">
      <header className="p-4 shadow-md bg-indigo-600 dark:bg-indigo-800 text-white">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">👶 BabySleep AI</h1>

          {/* Desktop nav */}
          <nav className="hidden md:flex gap-4">
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/signup" className="hover:underline">Sign Up</Link>
            <Link to="/privacy" className="hover:underline">Privacy</Link>
            <Link to="/terms" className="hover:underline">Terms</Link>
          </nav>

          {/* Avatar + Dark Mode Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="bg-white text-indigo-600 px-2 py-1 rounded text-sm"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <img
              src="https://api.dicebear.com/6.x/initials/svg?seed=User"
              alt="User"
              className="w-8 h-8 rounded-full hidden md:block"
            />
            <button
              className="md:hidden text-2xl"
              onClick={() => setNavOpen(!navOpen)}
            >
              {navOpen ? '✖' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {navOpen && (
          <div className="md:hidden mt-2 flex flex-col gap-2">
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/signup" className="hover:underline">Sign Up</Link>
            <Link to="/privacy" className="hover:underline">Privacy</Link>
            <Link to="/terms" className="hover:underline">Terms</Link>
          </div>
        )}
      </header>

      <main className="p-6 max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">Welcome to BabySleep AI</h2>
        <p className="text-lg mb-6">Track, log, and optimize your baby’s sleep with ease.</p>
        <Link to="/signup" className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700 transition">Get Started</Link>
      </main>
    </div>
  );
}
