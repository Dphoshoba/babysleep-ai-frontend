import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, Ruler, Weight, Activity, Calendar, Edit, Trash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

interface GrowthRecord {
  id: string;
  baby_id: string;
  date: string;
  weight?: number;
  height?: number;
  head_circumference?: number;
  notes?: string;
  created_at: string;
}

interface GrowthTrackerProps {
  babyId: string;
  birthDate: string;
}

export default function GrowthTracker({ babyId, birthDate }: GrowthTrackerProps) {
  const { user } = useAuth();
  const [records, setRecords] = useState<GrowthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<GrowthRecord | null>(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    height: '',
    head_circumference: '',
    notes: ''
  });

  useEffect(() => {
    if (babyId) {
      fetchGrowthRecords();
    }
  }, [babyId]);

  const fetchGrowthRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('growth_records')
        .select('*')
        .eq('baby_id', babyId)
        .order('date', { ascending: true });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error('Error fetching growth records:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const recordData = {
        baby_id: babyId,
        date: formData.date,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        head_circumference: formData.head_circumference ? parseFloat(formData.head_circumference) : null,
        notes: formData.notes || null,
        user_id: user.id
      };

      if (editingRecord) {
        const { error } = await supabase
          .from('growth_records')
          .update(recordData)
          .eq('id', editingRecord.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('growth_records')
          .insert([recordData]);

        if (error) throw error;
      }

      setShowForm(false);
      setEditingRecord(null);
      resetForm();
      fetchGrowthRecords();
    } catch (error) {
      console.error('Error saving growth record:', error);
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      const { error } = await supabase
        .from('growth_records')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchGrowthRecords();
    } catch (error) {
      console.error('Error deleting growth record:', error);
    }
  };

  const editRecord = (record: GrowthRecord) => {
    setEditingRecord(record);
    setFormData({
      date: record.date,
      weight: record.weight?.toString() || '',
      height: record.height?.toString() || '',
      head_circumference: record.head_circumference?.toString() || '',
      notes: record.notes || ''
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      weight: '',
      height: '',
      head_circumference: '',
      notes: ''
    });
  };

  const calculateAge = (date: string) => {
    const birth = new Date(birthDate);
    const measurement = new Date(date);
    const diffTime = Math.abs(measurement.getTime() - birth.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.floor(diffDays / 30.44);
    const days = diffDays % 30;
    return { months, days };
  };

  const getLatestRecord = () => {
    return records.length > 0 ? records[records.length - 1] : null;
  };

  const getGrowthTrend = (type: 'weight' | 'height' | 'head_circumference') => {
    if (records.length < 2) return null;
    
    const recent = records.slice(-2);
    const current = recent[1][type];
    const previous = recent[0][type];
    
    if (!current || !previous) return null;
    
    const change = current - previous;
    const daysDiff = (new Date(recent[1].date).getTime() - new Date(recent[0].date).getTime()) / (1000 * 60 * 60 * 24);
    const dailyChange = change / daysDiff;
    
    return {
      change,
      dailyChange,
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
    };
  };

  const latestRecord = getLatestRecord();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-indigo-600">Growth Tracker</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Measurement
        </button>
      </div>

      {/* Current Stats */}
      {latestRecord && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Weight className="w-6 h-6 text-blue-600" />
              <h3 className="font-semibold text-blue-800">Weight</h3>
            </div>
            <div className="text-2xl font-bold text-blue-800">
              {latestRecord.weight} kg
            </div>
            {getGrowthTrend('weight') && (
              <div className="text-sm text-blue-600">
                {getGrowthTrend('weight')!.trend === 'up' ? '↗' : '↘'} 
                {Math.abs(getGrowthTrend('weight')!.change).toFixed(2)} kg
              </div>
            )}
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Ruler className="w-6 h-6 text-green-600" />
              <h3 className="font-semibold text-green-800">Height</h3>
            </div>
            <div className="text-2xl font-bold text-green-800">
              {latestRecord.height} cm
            </div>
            {getGrowthTrend('height') && (
              <div className="text-sm text-green-600">
                {getGrowthTrend('height')!.trend === 'up' ? '↗' : '↘'} 
                {Math.abs(getGrowthTrend('height')!.change).toFixed(1)} cm
              </div>
            )}
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-6 h-6 text-purple-600" />
              <h3 className="font-semibold text-purple-800">Head Circumference</h3>
            </div>
            <div className="text-2xl font-bold text-purple-800">
              {latestRecord.head_circumference} cm
            </div>
            {getGrowthTrend('head_circumference') && (
              <div className="text-sm text-purple-600">
                {getGrowthTrend('head_circumference')!.trend === 'up' ? '↗' : '↘'} 
                {Math.abs(getGrowthTrend('head_circumference')!.change).toFixed(1)} cm
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {editingRecord ? 'Edit Measurement' : 'Add Measurement'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingRecord(null);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={saveRecord} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="0.0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Height (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Head Circumference (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.head_circumference}
                    onChange={(e) => setFormData({ ...formData, head_circumference: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="0.0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes (optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                  placeholder="Add any notes about this measurement..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {editingRecord ? 'Update' : 'Save'} Measurement
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingRecord(null);
                    resetForm();
                  }}
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Growth History */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Growth History</h2>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No growth records yet. Add your first measurement!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Age</th>
                  <th className="text-left py-3 px-4">Weight (kg)</th>
                  <th className="text-left py-3 px-4">Height (cm)</th>
                  <th className="text-left py-3 px-4">Head (cm)</th>
                  <th className="text-left py-3 px-4">Notes</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => {
                  const age = calculateAge(record.date);
                  return (
                    <tr key={record.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        {age.months}m {age.days}d
                      </td>
                      <td className="py-3 px-4">
                        {record.weight ? `${record.weight} kg` : '-'}
                      </td>
                      <td className="py-3 px-4">
                        {record.height ? `${record.height} cm` : '-'}
                      </td>
                      <td className="py-3 px-4">
                        {record.head_circumference ? `${record.head_circumference} cm` : '-'}
                      </td>
                      <td className="py-3 px-4">
                        {record.notes || '-'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => editRecord(record)}
                            className="text-blue-500 hover:text-blue-700 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteRecord(record.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Growth Tips */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">💡 Growth Tracking Tips</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Measure at the same time of day for consistency</li>
          <li>• Use the same scale and measuring tools</li>
          <li>• Track measurements monthly for the first year</li>
          <li>• Consult your pediatrician about growth percentiles</li>
          <li>• Every baby grows at their own pace</li>
        </ul>
      </div>
    </div>
  );
} 