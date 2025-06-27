import { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

interface SleepLog {
  id: string;
  baby_id: string;
  start_time: string;
  end_time: string;
}

export default function Analytics() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<SleepLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchSleepLogs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('sleep_logs')
        .select('*')
        .eq('user_id', user.id);

      if (!error && data) setLogs(data);
      setLoading(false);
    };

    fetchSleepLogs();
  }, [user]);

  // Aggregate total sleep per day
  const sleepPerDay: { [date: string]: number } = {};

  logs.forEach(log => {
    const start = new Date(log.start_time);
    const end = new Date(log.end_time);
    const durationHours = (end.getTime() - start.getTime()) / 1000 / 60 / 60;
    const day = start.toISOString().split('T')[0];
    sleepPerDay[day] = (sleepPerDay[day] || 0) + durationHours;
  });

  const labels = Object.keys(sleepPerDay);
  const data = Object.values(sleepPerDay);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Total Sleep per Day (hrs)',
        data,
        backgroundColor: 'rgba(99, 102, 241, 0.6)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Baby Sleep Trends',
      },
    },
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-indigo-700 mb-4">Sleep Analytics</h1>
      {loading ? (
        <p>Loading data...</p>
      ) : logs.length === 0 ? (
        <p>No sleep logs available.</p>
      ) : (
        <>
          <div className="mb-8 bg-white p-4 rounded shadow">
            <Line data={chartData} options={options} />
          </div>
          <div className="bg-white p-4 rounded shadow">
            <Bar data={chartData} options={options} />
          </div>
        </>
      )}
    </div>
  );
}

