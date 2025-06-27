import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { format, parseISO } from 'date-fns';

export default function SleepLogs() {
  const [logs, setLogs] = useState<any[]>([]);

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

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Sleep Logs</h2>
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



