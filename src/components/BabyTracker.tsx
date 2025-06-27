import React, { useState, useEffect } from 'react';
import { Plus, Baby, Milk, Droplets, Moon, TrendingUp, Calendar, Clock, Edit, Trash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

interface Activity {
  id: string;
  baby_id: string;
  type: 'feeding' | 'diaper' | 'sleep' | 'milestone';
  timestamp: Date;
  duration?: number;
  notes?: string;
  amount?: number;
  unit?: string;
  diaper_type?: 'wet' | 'dirty' | 'both';
  milestone_type?: string;
  created_at: Date;
}

interface BabyTrackerProps {
  babyId: string;
}

export default function BabyTracker({ babyId }: BabyTrackerProps) {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<Activity['type']>('feeding');
  const [formData, setFormData] = useState({
    duration: '',
    notes: '',
    amount: '',
    unit: 'ml',
    diaper_type: 'wet' as Activity['diaper_type'],
    milestone_type: ''
  });

  useEffect(() => {
    if (babyId) {
      fetchActivities();
    }
  }, [babyId]);

  const fetchActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('baby_activities')
        .select('*')
        .eq('baby_id', babyId)
        .order('timestamp', { ascending: false });

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const addActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const activityData = {
        baby_id: babyId,
        type: formType,
        timestamp: new Date().toISOString(),
        duration: formData.duration ? parseInt(formData.duration) : null,
        notes: formData.notes || null,
        amount: formData.amount ? parseFloat(formData.amount) : null,
        unit: formData.unit || null,
        diaper_type: formType === 'diaper' ? formData.diaper_type : null,
        milestone_type: formType === 'milestone' ? formData.milestone_type : null,
        user_id: user.id
      };

      const { error } = await supabase
        .from('baby_activities')
        .insert([activityData]);

      if (error) throw error;

      setShowForm(false);
      setFormData({ duration: '', notes: '', amount: '', unit: 'ml', diaper_type: 'wet', milestone_type: '' });
      fetchActivities();
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  };

  const deleteActivity = async (id: string) => {
    try {
      const { error } = await supabase
        .from('baby_activities')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchActivities();
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'feeding': return <Milk className="w-5 h-5" />;
      case 'diaper': return <Droplets className="w-5 h-5" />;
      case 'sleep': return <Moon className="w-5 h-5" />;
      case 'milestone': return <TrendingUp className="w-5 h-5" />;
      default: return <Baby className="w-5 h-5" />;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'feeding': return 'bg-blue-100 text-blue-800';
      case 'diaper': return 'bg-yellow-100 text-yellow-800';
      case 'sleep': return 'bg-purple-100 text-purple-800';
      case 'milestone': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const stats = {
    feeding: activities.filter(a => a.type === 'feeding').length,
    diaper: activities.filter(a => a.type === 'diaper').length,
    sleep: activities.filter(a => a.type === 'sleep').length,
    milestone: activities.filter(a => a.type === 'milestone').length
  };

  const todayActivities = activities.filter(a => {
    const today = new Date();
    const activityDate = new Date(a.timestamp);
    return activityDate.toDateString() === today.toDateString();
  });

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-indigo-600">Baby Tracker</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Activity
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <Milk className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-800">{stats.feeding}</div>
          <div className="text-sm text-blue-600">Feedings</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 text-center">
          <Droplets className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-yellow-800">{stats.diaper}</div>
          <div className="text-sm text-yellow-600">Diaper Changes</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <Moon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-800">{stats.sleep}</div>
          <div className="text-sm text-purple-600">Sleep Sessions</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-800">{stats.milestone}</div>
          <div className="text-sm text-green-600">Milestones</div>
        </div>
      </div>

      {/* Add Activity Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Add Activity</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={addActivity} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Activity Type</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {(['feeding', 'diaper', 'sleep', 'milestone'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormType(type)}
                      className={`p-3 rounded-lg border transition-colors ${
                        formType === type
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {getActivityIcon(type)}
                        <span className="capitalize">{type}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {formType === 'feeding' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Amount</label>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Unit</label>
                    <select
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="ml">ml</option>
                      <option value="oz">oz</option>
                    </select>
                  </div>
                </div>
              )}

              {formType === 'diaper' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Diaper Type</label>
                  <div className="flex gap-4">
                    {(['wet', 'dirty', 'both'] as const).map((type) => (
                      <label key={type} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="diaper_type"
                          value={type}
                          checked={formData.diaper_type === type}
                          onChange={(e) => setFormData({ ...formData, diaper_type: e.target.value as Activity['diaper_type'] })}
                        />
                        <span className="capitalize">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {formType === 'sleep' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="0"
                  />
                </div>
              )}

              {formType === 'milestone' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Milestone</label>
                  <input
                    type="text"
                    value={formData.milestone_type}
                    onChange={(e) => setFormData({ ...formData, milestone_type: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="e.g., First smile, Rolling over"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Notes (optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                  placeholder="Add any additional notes..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Add Activity
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Today's Activities */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Today's Activities</h2>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        ) : todayActivities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No activities recorded today
          </div>
        ) : (
          <div className="space-y-3">
            {todayActivities.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div>
                    <div className="font-medium capitalize">{activity.type}</div>
                    <div className="text-sm text-gray-600">
                      {activity.amount && `${activity.amount} ${activity.unit}`}
                      {activity.duration && ` • ${formatTime(activity.duration)}`}
                      {activity.diaper_type && ` • ${activity.diaper_type}`}
                      {activity.milestone_type && ` • ${activity.milestone_type}`}
                    </div>
                    {activity.notes && (
                      <div className="text-sm text-gray-500 mt-1">{activity.notes}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {getTimeAgo(activity.timestamp)}
                  </span>
                  <button
                    onClick={() => deleteActivity(activity.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No activities recorded yet
          </div>
        ) : (
          <div className="space-y-2">
            {activities.slice(0, 10).map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 border-b last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className={`p-1 rounded ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div>
                    <div className="font-medium capitalize">{activity.type}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteActivity(activity.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 