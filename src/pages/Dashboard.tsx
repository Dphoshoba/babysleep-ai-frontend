import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import type { Database } from '../types/supabase';
import { User } from '@supabase/supabase-js';

// Icons (simple SVGs for demo)
const BabyIcon = () => (
  <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a7.5 7.5 0 0 1 13 0"/></svg>
);
const PlusIcon = () => (
  <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
);
const ActivityIcon = () => (
  <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12h3l3 8 4-16 3 8h4"/></svg>
);

// Types
type Baby = Database['public']['Tables']['babies']['Row'];

export default function Dashboard() {
  const { user } = useAuth();
  const [babies, setBabies] = useState<Baby[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', birth_date: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch babies
  useEffect(() => {
    if (!user) return;
    const fetchBabies = async () => {
      setLoading(true);
      try {
        let { data, error } = await supabase
          .from('babies')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (error) {
          setError(error.message || 'An error occurred fetching babies');
          return;
        }
        setBabies(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchBabies();
  }, [user]);

  // Add baby quick form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    if (!form.name || !form.birth_date) {
      setError('Please fill in all fields.');
      setSubmitting(false);
      return;
    }
    if (!user) {
      setError('User not found. Please log in again.');
      setSubmitting(false);
      return;
    }
    try {
      const { error } = await supabase.from('babies').insert([
        { name: form.name, birth_date: form.birth_date, user_id: user.id }
      ]);
      if (error) {
        setError(error.message);
      } else {
        setSuccess('Baby added!');
        setForm({ name: '', birth_date: '' });
        // Refresh list
        let { data } = await supabase
          .from('babies')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        setBabies(data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  // Recent activity (last 3 babies)
  const recentBabies = babies.slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto p-4 grid gap-6 grid-cols-1 md:grid-cols-2">
      {/* Welcome Widget */}
      <div className="col-span-1 md:col-span-2 bg-white rounded-lg shadow p-6 flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-indigo-700 mb-1">Welcome{user && user.email ? `, ${user.email}` : ''}!</h1>
        <p className="text-gray-700">This is your dashboard. Here you can see a summary of your babies and recent activity.</p>
      </div>

      {/* Babies Summary Widget */}
      <div className="bg-indigo-50 rounded-lg shadow p-6 flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-2">
          <BabyIcon />
          <h2 className="text-xl font-semibold text-indigo-800">Babies Summary</h2>
        </div>
        {loading ? (
          <div className="flex items-center justify-center min-h-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <>
            <p className="mb-2">You have <span className="font-bold">{babies.length}</span> {babies.length === 1 ? 'baby' : 'babies'}.</p>
            <ul className="list-disc list-inside text-gray-800">
              {babies.map((baby) => (
                <li key={baby.id}>{baby.name} <span className="text-sm text-gray-500">({new Date(baby.birth_date).toLocaleDateString()})</span></li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* Recent Activity Widget */}
      <div className="bg-white rounded-lg shadow p-6 flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-2">
          <ActivityIcon />
          <h2 className="text-xl font-semibold text-indigo-800">Recent Activity</h2>
        </div>
        {loading ? (
          <div className="flex items-center justify-center min-h-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : recentBabies.length === 0 ? (
          <div className="text-gray-600">No recent activity.</div>
        ) : (
          <ul className="list-disc list-inside text-gray-800">
            {recentBabies.map((baby) => (
              <li key={baby.id}>{baby.name} <span className="text-sm text-gray-500">({new Date(baby.birth_date).toLocaleDateString()})</span></li>
            ))}
          </ul>
        )}
      </div>

      {/* Add Baby Quick Form Widget */}
      <div className="bg-white rounded-lg shadow p-6 flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-2">
          <PlusIcon />
          <h2 className="text-xl font-semibold text-indigo-800">Add a Baby</h2>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div>
            <label htmlFor="baby-name" className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              id="baby-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
              placeholder="Enter baby's name"
              disabled={!user}
            />
          </div>
          <div>
            <label htmlFor="baby-birth-date" className="block mb-1 font-medium">Birth Date</label>
            <input
              type="date"
              id="baby-birth-date"
              name="birth_date"
              value={form.birth_date}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
              placeholder="YYYY-MM-DD"
              disabled={!user}
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            disabled={submitting || !user}
          >
            {submitting ? 'Adding...' : (<><PlusIcon /> Add Baby</>)}
          </button>
          {error && <div className="text-red-600 mt-2">{error}</div>}
          {success && <div className="text-green-600 mt-2">{success}</div>}
        </form>
      </div>

      {/* Quick Links Widget */}
      <div className="bg-indigo-50 rounded-lg shadow p-6 flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-indigo-800 mb-2">Quick Links</h2>
        <Link to="/babies" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-center">Go to Babies</Link>
        <Link to="/babies" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-center">Add a Baby</Link>
        <Link to="/terms" className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 text-center">Terms</Link>
        <Link to="/privacy" className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 text-center">Privacy</Link>
      </div>
    </div>
  );
}