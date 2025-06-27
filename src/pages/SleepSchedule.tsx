import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function SleepSchedule() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [babyId, setBabyId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [note, setNote] = useState('');

  const fetchSchedules = async () => {
    const { data, error } = await supabase.from('sleep_schedules').select('*');
    if (!error) setSchedules(data || []);
  };

  const addSchedule = async () => {
    const { error } = await supabase.from('sleep_schedules').insert({
      baby_id: babyId,
      start_time: startTime,
      end_time: endTime,
      note,
    });
    if (!error) {
      setBabyId('');
      setStartTime('');
      setEndTime('');
      setNote('');
      fetchSchedules();
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Sleep Schedule</h2>

      <div className="mb-4 space-y-2">
        <input
          placeholder="Baby ID"
          value={babyId}
          onChange={(e) => setBabyId(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          placeholder="Start Time (e.g. 2025-06-27T20:00:00)"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          placeholder="End Time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          placeholder="Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button onClick={addSchedule} className="bg-green-600 text-white px-4 py-2 rounded">
          Add Schedule
        </button>
      </div>

      <ul>
        {schedules.map((schedule) => (
          <li key={schedule.id} className="border p-2 mb-2 rounded shadow">
            <strong>Baby:</strong> {schedule.baby_id} | <strong>From:</strong> {schedule.start_time} | <strong>To:</strong> {schedule.end_time} <br />
            {schedule.note && <em>Note: {schedule.note}</em>}
          </li>
        ))}
      </ul>
    </div>
  );
}
