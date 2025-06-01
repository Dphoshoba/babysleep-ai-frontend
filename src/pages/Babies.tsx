import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

interface Baby {
  id: string;
  name: string;
  birth_date: string;
}

export default function Babies() {
  const { user } = useAuth();
  const [babies, setBabies] = useState<Baby[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchBabies = async () => {
      const { data, error } = await supabase
        .from('babies')
        .select('*')
        .eq('user_id', user.id);

      if (error) console.error(error.message);
      else setBabies(data || []);
      setLoading(false);
    };

    fetchBabies();
  }, [user]);

  if (loading) return <p>Loading babies...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Your Babies</h1>
      <ul className="space-y-2">
        {babies.map(b => (
          <li key={b.id} className="p-3 bg-white rounded shadow">
            👶 {b.name} (Born: {b.birth_date})
          </li>
        ))}
      </ul>
    </div>
  );
}

