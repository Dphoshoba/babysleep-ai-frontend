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

  useEffect(() => {
    if (!user) return;

    const fetchBabies = async () => {
      try {
        const { data, error } = await supabase
          .from('babies')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;
        setBabies(data || []);
      } catch (err) {
        console.error('Error fetching babies:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBabies();
  }, [user]);

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
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4 text-indigo-700">Your Babies</h1>

      {babies.length === 0 ? (
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


