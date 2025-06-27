import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div>
      <nav className="bg-indigo-600 text-white p-4 flex gap-4 items-center">
        <Link to="/babies" className="hover:underline">Babies</Link>
        <Link to="/dashboard" className="hover:underline">Dashboard</Link>
        <Link to="/terms" className="hover:underline">Terms</Link>
        <Link to="/privacy" className="hover:underline">Privacy</Link>
        {user && (
          <button
            onClick={handleLogout}
            className="ml-auto bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        )}
      </nav>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}