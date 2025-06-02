import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

type Baby = {
  id: string;
  name: string;
  birth_date: string;
  created_at: string;
};

export default function Home() {
  const { user } = useAuth();
  const [babies, setBabies] = useState<Baby[]>([]);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const fetchBabies = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('babies')
      .select('*')
      .eq('parent_id', user.id)
      .order('created_at', { ascending: false });

    if (error) console.error(error);
    else setBabies(data);
  };

  const addBaby = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !birthDate) return;

    const { error } = await supabase.from('babies').insert({
      name,
      birth_date: birthDate,
      parent_id: user?.id,
    });

    if (error) console.error(error);
    else {
      setName('');
      setBirthDate('');
      fetchBabies();
    }
  };

  useEffect(() => {
    fetchBabies();
  }, [user]);

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4 text-indigo-600">Your Babies</h1>
      <ul className="mb-6">
        {babies.map(baby => (
          <li key={baby.id} className="border p-2 rounded mb-2">
            <strong>{baby.name}</strong> — born on {baby.birth_date}
          </li>
        ))}
      </ul>

      <form onSubmit={addBaby} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          placeholder="Baby name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="date"
          className="w-full border p-2 rounded"
          value={birthDate}
          onChange={e => setBirthDate(e.target.value)}
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Add Baby
        </button>
      </form>
    </div>
  );
}

  
  