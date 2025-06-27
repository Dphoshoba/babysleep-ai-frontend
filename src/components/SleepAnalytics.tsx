import React, { useState, useEffect } from 'react';
import { Bar, Line, Doughnut, Radar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, PointElement, LineElement, ArcElement, RadialLinearScale } from 'chart.js';
import { TrendingUp, TrendingDown, Clock, Activity, Moon, Sun, Calendar, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

ChartJS.register(
  BarElement, CategoryScale, LinearScale, Tooltip, Legend,
  PointElement, LineElement, ArcElement, RadialLinearScale
);

interface SleepSession {
  id: string;
  baby_id: string;
  start_time: string;
  end_time?: string;
  duration?: number;
  quality_score?: number;
  movements: number;
  cries_detected: number;
  safety_alerts: number;
  temperature: number;
  humidity: number;
  position_changes: number;
  deep_sleep_percentage?: number;
  light_sleep_percentage?: number;
  rem_sleep_percentage?: number;
}

interface SleepAnalyticsProps {
  babyId: string;
  timeRange?: '7d' | '30d' | '90d';
}

export default function SleepAnalytics({ babyId, timeRange = '7d' }: SleepAnalyticsProps) {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<SleepSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);

  useEffect(() => {
    if (babyId) {
      fetchSleepSessions();
    }
  }, [babyId, selectedTimeRange]);

  const fetchSleepSessions = async () => {
    try {
      const days = selectedTimeRange === '7d' ? 7 : selectedTimeRange === '30d' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('sleep_sessions')
        .select('*')
        .eq('baby_id', babyId)
        .gte('start_time', startDate.toISOString())
        .order('start_time', { ascending: true });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sleep sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    if (sessions.length === 0) return null;

    const totalSessions = sessions.length;
    const totalSleepHours = sessions.reduce((sum, session) => sum + (session.duration || 0), 0) / 60;
    const avgQuality = sessions.reduce((sum, session) => sum + (session.quality_score || 0), 0) / totalSessions;
    const avgMovements = sessions.reduce((sum, session) => sum + session.movements, 0) / totalSessions;
    const totalCries = sessions.reduce((sum, session) => sum + session.cries_detected, 0);
    const totalAlerts = sessions.reduce((sum, session) => sum + session.safety_alerts, 0);

    const recentSessions = sessions.slice(-7);
    const recentAvgQuality = recentSessions.reduce((sum, session) => sum + (session.quality_score || 0), 0) / recentSessions.length;
    const qualityTrend = recentAvgQuality > avgQuality ? 'up' : 'down';

    return {
      totalSessions,
      totalSleepHours,
      avgQuality,
      avgMovements,
      totalCries,
      totalAlerts,
      qualityTrend,
      recentAvgQuality
    };
  };

  const getSleepQualityColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSleepQualityLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  const generateSleepDurationChart = () => {
    const labels = sessions.map(session => 
      new Date(session.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    );
    const data = sessions.map(session => (session.duration || 0) / 60); // Convert to hours

    return {
      labels,
      datasets: [{
        label: 'Sleep Duration (hours)',
        data,
        backgroundColor: 'rgba(99, 102, 241, 0.6)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        tension: 0.4
      }]
    };
  };

  const generateQualityTrendChart = () => {
    const labels = sessions.map(session => 
      new Date(session.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    );
    const data = sessions.map(session => session.quality_score || 0);

    return {
      labels,
      datasets: [{
        label: 'Sleep Quality Score',
        data,
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
        tension: 0.4
      }]
    };
  };

  const generateSleepStagesChart = () => {
    const avgDeepSleep = sessions.reduce((sum, session) => sum + (session.deep_sleep_percentage || 0), 0) / sessions.length;
    const avgLightSleep = sessions.reduce((sum, session) => sum + (session.light_sleep_percentage || 0), 0) / sessions.length;
    const avgRemSleep = sessions.reduce((sum, session) => sum + (session.rem_sleep_percentage || 0), 0) / sessions.length;

    return {
      labels: ['Deep Sleep', 'Light Sleep', 'REM Sleep'],
      datasets: [{
        data: [avgDeepSleep, avgLightSleep, avgRemSleep],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)'
        ],
        borderColor: [
          'rgba(99, 102, 241, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(251, 191, 36, 1)'
        ],
        borderWidth: 2
      }]
    };
  };

  const generateMovementChart = () => {
    const labels = sessions.map(session => 
      new Date(session.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    );
    const movements = sessions.map(session => session.movements);
    const cries = sessions.map(session => session.cries_detected);

    return {
      labels,
      datasets: [
        {
          label: 'Movements',
          data: movements,
          backgroundColor: 'rgba(59, 130, 246, 0.6)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2
        },
        {
          label: 'Cries Detected',
          data: cries,
          backgroundColor: 'rgba(239, 68, 68, 0.6)',
          borderColor: 'rgba(239, 68, 68, 1)',
          borderWidth: 2
        }
      ]
    };
  };

  const generateEnvironmentalChart = () => {
    const labels = sessions.map(session => 
      new Date(session.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    );
    const temperatures = sessions.map(session => session.temperature);
    const humidity = sessions.map(session => session.humidity);

    return {
      labels,
      datasets: [
        {
          label: 'Temperature (°C)',
          data: temperatures,
          backgroundColor: 'rgba(251, 191, 36, 0.6)',
          borderColor: 'rgba(251, 191, 36, 1)',
          borderWidth: 2,
          yAxisID: 'y'
        },
        {
          label: 'Humidity (%)',
          data: humidity,
          backgroundColor: 'rgba(59, 130, 246, 0.6)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
          yAxisID: 'y1'
        }
      ]
    };
  };

  const generateInsights = () => {
    if (sessions.length === 0) return [];

    const stats = calculateStats();
    if (!stats) return [];

    const insights = [];

    // Sleep duration insights
    const avgSleepHours = stats.totalSleepHours / stats.totalSessions;
    if (avgSleepHours < 10) {
      insights.push({
        type: 'warning',
        icon: <Clock className="w-5 h-5" />,
        title: 'Sleep Duration',
        message: 'Average sleep duration is below recommended levels for this age group.'
      });
    } else if (avgSleepHours > 16) {
      insights.push({
        type: 'info',
        icon: <Clock className="w-5 h-5" />,
        title: 'Sleep Duration',
        message: 'Sleep duration is within healthy range.'
      });
    }

    // Quality insights
    if (stats.avgQuality < 60) {
      insights.push({
        type: 'warning',
        icon: <Target className="w-5 h-5" />,
        title: 'Sleep Quality',
        message: 'Sleep quality could be improved. Consider reviewing bedtime routine and environment.'
      });
    }

    // Movement insights
    if (stats.avgMovements > 20) {
      insights.push({
        type: 'info',
        icon: <Activity className="w-5 h-5" />,
        title: 'Movement Patterns',
        message: 'High movement during sleep may indicate discomfort or developmental milestones.'
      });
    }

    // Environmental insights
    const avgTemp = sessions.reduce((sum, session) => sum + session.temperature, 0) / sessions.length;
    if (avgTemp < 18 || avgTemp > 22) {
      insights.push({
        type: 'warning',
        icon: <Sun className="w-5 h-5" />,
        title: 'Room Temperature',
        message: 'Room temperature is outside optimal range (18-22°C).'
      });
    }

    return insights;
  };

  const stats = calculateStats();
  const insights = generateInsights();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-indigo-600 mb-2">Sleep Analytics</h1>
        <p className="text-gray-600">Comprehensive sleep pattern analysis and insights</p>
      </div>

      {/* Time Range Selector */}
      <div className="flex justify-center">
        <div className="bg-white rounded-lg shadow p-2">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setSelectedTimeRange(range)}
              className={`px-4 py-2 rounded-md transition-colors ${
                selectedTimeRange === range
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sleep</p>
                <p className="text-2xl font-bold">{stats.totalSleepHours.toFixed(1)}h</p>
              </div>
              <Moon className="w-8 h-8 text-indigo-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Quality</p>
                <p className={`text-2xl font-bold ${getSleepQualityColor(stats.avgQuality)}`}>
                  {stats.avgQuality.toFixed(0)}%
                </p>
                <p className="text-sm text-gray-500">{getSleepQualityLabel(stats.avgQuality)}</p>
              </div>
              <Target className="w-8 h-8 text-green-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sessions</p>
                <p className="text-2xl font-bold">{stats.totalSessions}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Movements</p>
                <p className="text-2xl font-bold">{stats.avgMovements.toFixed(0)}</p>
              </div>
              <Activity className="w-8 h-8 text-orange-600" />
            </div>
          </motion.div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sleep Duration Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Sleep Duration Trend</h3>
          <Line data={generateSleepDurationChart()} options={{
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                title: { display: true, text: 'Hours' }
              }
            }
          }} />
        </div>

        {/* Quality Trend Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Sleep Quality Trend</h3>
          <Line data={generateQualityTrendChart()} options={{
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                title: { display: true, text: 'Quality Score' }
              }
            }
          }} />
        </div>

        {/* Sleep Stages Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Sleep Stages Distribution</h3>
          <Doughnut data={generateSleepStagesChart()} options={{
            responsive: true,
            plugins: {
              legend: { position: 'bottom' }
            }
          }} />
        </div>

        {/* Movement and Cries Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Movements & Cries</h3>
          <Bar data={generateMovementChart()} options={{
            responsive: true,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }} />
        </div>
      </div>

      {/* Environmental Monitoring */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Environmental Conditions</h3>
        <Line data={generateEnvironmentalChart()} options={{
          responsive: true,
          scales: {
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              title: { display: true, text: 'Temperature (°C)' }
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              title: { display: true, text: 'Humidity (%)' },
              grid: { drawOnChartArea: false }
            }
          }
        }} />
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">AI Insights</h3>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-l-4 ${
                  insight.type === 'warning' 
                    ? 'bg-yellow-50 border-yellow-500 text-yellow-800'
                    : 'bg-blue-50 border-blue-500 text-blue-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  {insight.icon}
                  <div>
                    <p className="font-semibold">{insight.title}</p>
                    <p className="text-sm">{insight.message}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">For Better Sleep Quality:</h4>
            <ul className="text-sm space-y-1">
              <li>• Maintain consistent bedtime routine</li>
              <li>• Keep room temperature between 18-22°C</li>
              <li>• Ensure room is dark and quiet</li>
              <li>• Avoid screens 1 hour before bedtime</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">For Sleep Training:</h4>
            <ul className="text-sm space-y-1">
              <li>• Choose a method that fits your family</li>
              <li>• Be consistent for at least 1-2 weeks</li>
              <li>• Consult pediatrician before starting</li>
              <li>• Trust your instincts as a parent</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 