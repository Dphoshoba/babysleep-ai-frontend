import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { format, parseISO } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import type { Database } from '../types/supabase';

export default function SleepLogs() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [babies, setBabies] = useState<Database['public']['Tables']['babies']['Row'][]>([]);
  const [form, setForm] = useState({ baby_id: '', sleep_time: '', wake_time: '', quality_rating: 3 });
  const [submitting, setSubmitting] = useState(false);

  const fetchLogs = async () => {
    const { data, error } = await supabase.from('sleep_logs').select('*');
    if (error) console.error(error);
    else setLogs(data || []);
  };

  const deleteLog = async (id: string) => {
    const { error } = await supabase.from('sleep_logs').delete().eq('id', id);
    if (!error) fetchLogs();
  };

  const updateLog = async (id: string) => {
    const newSleepTime = prompt('Enter new sleep time (e.g. 2025-06-27T20:00:00):');
    const newWakeTime = prompt('Enter new wake time (e.g. 2025-06-28T06:00:00):');
    if (!newSleepTime || !newWakeTime) return;

    const { error } = await supabase.from('sleep_logs').update({
      sleep_time: newSleepTime,
      wake_time: newWakeTime,
    }).eq('id', id);

    if (!error) fetchLogs();
  };

  const addSleepLog = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    if (!form.baby_id || !form.sleep_time || !form.wake_time) {
      setSubmitting(false);
      return;
    }
    await supabase.from('sleep_logs').insert([
      {
        baby_id: form.baby_id,
        sleep_time: form.sleep_time,
        wake_time: form.wake_time,
        quality_rating: form.quality_rating,
        user_id: user?.id
      }
    ]);
    setForm({ baby_id: '', sleep_time: '', wake_time: '', quality_rating: 3 });
    setSubmitting(false);
    fetchLogs();
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchBabies = async () => {
      const { data, error } = await supabase.from('babies').select('*').eq('user_id', user.id);
      if (!error) setBabies(data || []);
    };
    fetchBabies();
  }, [user]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Sleep Logs</h2>
      {/* Add Sleep Log Form */}
      <form onSubmit={addSleepLog} className="mb-6 bg-white p-4 rounded shadow flex flex-wrap gap-4 items-end">
        <div>
          <label className="block mb-1 font-medium">Baby</label>
          <select
            className="border rounded px-2 py-1"
            value={form.baby_id}
            onChange={e => setForm(f => ({ ...f, baby_id: e.target.value }))}
            required
          >
            <option value="">Select baby</option>
            {babies.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Sleep Time</label>
          <input
            type="datetime-local"
            className="border rounded px-2 py-1"
            value={form.sleep_time}
            onChange={e => setForm(f => ({ ...f, sleep_time: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Wake Time</label>
          <input
            type="datetime-local"
            className="border rounded px-2 py-1"
            value={form.wake_time}
            onChange={e => setForm(f => ({ ...f, wake_time: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Quality</label>
          <select
            className="border rounded px-2 py-1"
            value={form.quality_rating}
            onChange={e => setForm(f => ({ ...f, quality_rating: Number(e.target.value) }))}
          >
            {[1,2,3,4,5].map(q => (
              <option key={q} value={q}>{q}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          disabled={submitting}
        >
          {submitting ? 'Logging...' : 'Add Sleep Log'}
        </button>
      </form>
      <table className="min-w-full table-auto border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Baby ID</th>
            <th className="p-2">Sleep Time</th>
            <th className="p-2">Wake Time</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="border-t">
              <td className="p-2">{log.baby_id}</td>
              <td className="p-2">{format(parseISO(log.sleep_time), 'Pp')}</td>
              <td className="p-2">{format(parseISO(log.wake_time), 'Pp')}</td>
              <td className="p-2 flex gap-2">
                <button onClick={() => updateLog(log.id)} className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
                <button onClick={() => deleteLog(log.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}



