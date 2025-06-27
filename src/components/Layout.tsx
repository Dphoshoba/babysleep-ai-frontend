import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div>
      <nav className="bg-indigo-600 text-white p-4 flex gap-4">
        <Link to="/babies" className="hover:underline">Babies</Link>
        <Link to="/terms" className="hover:underline">Terms</Link>
        <Link to="/privacy" className="hover:underline">Privacy</Link>
        {/* Add more links as needed */}
      </nav>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}