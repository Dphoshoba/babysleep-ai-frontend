import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import type { Database } from '../types/supabase';

type Baby = Database['public']['Tables']['babies']['Row'];

export default function Babies() {
  const { user } = useAuth();
  const [babies, setBabies] = useState<Baby[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', birth_date: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchBabies = async () => {
      setLoading(true);
      try {
        let { data, error } = await supabase
          .from('babies')
          .select('*')
          .eq('user_id', user.id);
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
          .eq('user_id', user.id);
        setBabies(data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        <h2 className="text-lg font-semibold mb-2">Database Setup Required</h2>
        <p className="mb-4">Error: {error}</p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">To fix this:</h3>
          <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
            <li>Go to your Supabase Dashboard</li>
            <li>Navigate to SQL Editor</li>
            <li>Run the database_setup.sql script</li>
            <li>Refresh this page</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4 text-indigo-700">Your Babies</h1>
      {!user ? (
        <div className="text-red-600 mb-4">User not found. Please log in again.</div>
      ) : (
        <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow">
          <div className="mb-2">
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
          <div className="mb-2">
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
            {submitting ? 'Adding...' : 'Add Baby'}
          </button>
          {error && <div className="text-red-600 mt-2">{error}</div>}
          {success && <div className="text-green-600 mt-2">{success}</div>}
        </form>
      )}
      {loading ? (
        <div className="flex items-center justify-center min-h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : babies.length === 0 ? (
        <p className="text-gray-600">No babies added yet.</p>
      ) : (
        <ul className="space-y-3">
          {babies.map((baby) => (
            <li key={baby.id} className="p-4 bg-white border rounded-lg shadow-sm">
              <span className="block text-lg font-medium text-gray-800">👶 {baby.name}</span>
              <span className="text-sm text-gray-500">
                Born: {new Date(baby.birth_date).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}



