import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Baby, TrendingUp, Bell, Lightbulb, Calendar, Target, Users, MessageCircle, FileText, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

interface SleepGuideline {
  ageGroup: string;
  ageRange: string;
  totalSleep: string;
  nightSleep: string;
  naps: string;
  napDuration: string;
  wakeWindows: string;
  tips: string[];
  milestones: string[];
  challenges: string[];
  solutions: string[];
}

interface Reminder {
  id: string;
  type: 'nap' | 'bedtime' | 'feeding' | 'medicine' | 'checkup';
  title: string;
  time: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  isActive: boolean;
  babyId: string;
}

interface DevelopmentalInsight {
  id: string;
  ageGroup: string;
  milestone: string;
  impact: string;
  sleepAdjustment: string;
  tips: string[];
}

interface ParentInformationProps {
  babyId?: string;
  babyAge?: number;
}

export default function ParentInformation({ babyId, babyAge }: ParentInformationProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('guidelines');
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [insights, setInsights] = useState<DevelopmentalInsight[]>([]);
  const [loading, setLoading] = useState(true);

  const sleepGuidelines: SleepGuideline[] = [
    {
      ageGroup: 'Newborn (0-2 months)',
      ageRange: '0-2 months',
      totalSleep: '15.5-16 hours',
      nightSleep: '8-9 hours',
      naps: '4-5 naps',
      napDuration: '30 min – 2 hours',
      wakeWindows: '45-60 minutes',
      tips: [
        'Feed on demand every 2-3 hours',
        'Keep baby close for comfort and security',
        'Swaddle for a secure, womb-like feeling',
        'Use white noise to mimic womb sounds',
        'Day/night confusion is normal - be patient',
        'Follow baby\'s cues rather than strict schedules'
      ],
      milestones: [
        'Lifting head during tummy time',
        'Following objects with eyes',
        'Making cooing sounds',
        'Smiling responsively'
      ],
      challenges: [
        'Frequent night wakings for feeding',
        'Day/night confusion',
        'Difficulty settling to sleep',
        'Short sleep cycles'
      ],
      solutions: [
        'Establish day/night routines',
        'Use gentle rocking and shushing',
        'Keep room dark and quiet at night',
        'Respond promptly to feeding cues'
      ]
    },
    {
      ageGroup: '3-5 months',
      ageRange: '3-5 months',
      totalSleep: '14.5-15 hours',
      nightSleep: '9-10 hours',
      naps: '3-4 naps',
      napDuration: '1-2 hours',
      wakeWindows: '1.5-2.5 hours',
      tips: [
        'Start establishing a consistent bedtime routine',
        'Introduce regular nap times',
        'Watch for sleep cues (rubbing eyes, yawning)',
        'Consider gentle sleep training methods',
        'Keep room dark and quiet for sleep',
        'Use consistent sleep associations'
      ],
      milestones: [
        'Rolling over (tummy to back)',
        'Reaching for objects',
        'Babbling and making sounds',
        'Laughing and showing joy'
      ],
      challenges: [
        'Sleep regression around 4 months',
        'Difficulty falling asleep independently',
        'Short naps during the day',
        'Separation anxiety beginning'
      ],
      solutions: [
        'Maintain consistent routines',
        'Gradually reduce sleep associations',
        'Practice self-soothing techniques',
        'Provide comfort during regressions'
      ]
    },
    {
      ageGroup: '6-8 months',
      ageRange: '6-8 months',
      totalSleep: '14 hours',
      nightSleep: '10-11 hours',
      naps: '2-3 naps',
      napDuration: '1-2 hours',
      wakeWindows: '2-3 hours',
      tips: [
        'Establish a solid bedtime routine',
        'Be consistent with wake-up times',
        'Consider dropping the third nap',
        'Help develop self-soothing skills',
        'Address separation anxiety gently',
        'Maintain consistent sleep environment'
      ],
      milestones: [
        'Sitting without support',
        'Crawling or scooting',
        'Responding to name',
        'Playing peek-a-boo'
      ],
      challenges: [
        'Separation anxiety affecting sleep',
        'Difficulty with nap transitions',
        'Night wakings due to milestones',
        'Resistance to bedtime'
      ],
      solutions: [
        'Provide extra comfort during anxiety',
        'Gradually adjust nap schedules',
        'Be patient during developmental leaps',
        'Maintain consistent boundaries'
      ]
    },
    {
      ageGroup: '9-12 months',
      ageRange: '9-12 months',
      totalSleep: '13-14 hours',
      nightSleep: '11-12 hours',
      naps: '2 naps',
      napDuration: '1-2 hours',
      wakeWindows: '3-4 hours',
      tips: [
        'Maintain two-nap schedule consistently',
        'Address separation anxiety with patience',
        'Keep bedtime routine predictable',
        'Limit screen time before bed',
        'Introduce comfort objects',
        'Be consistent with sleep rules'
      ],
      milestones: [
        'Pulling to stand',
        'Cruising along furniture',
        'Saying first words',
        'Understanding simple commands'
      ],
      challenges: [
        'Separation anxiety peaks',
        'Resistance to bedtime',
        'Night wakings for comfort',
        'Difficulty with nap transitions'
      ],
      solutions: [
        'Provide reassurance and comfort',
        'Maintain consistent routines',
        'Gradually reduce night interventions',
        'Be patient with developmental changes'
      ]
    },
    {
      ageGroup: '1-2 years',
      ageRange: '12-24 months',
      totalSleep: '11-14 hours',
      nightSleep: '10-12 hours',
      naps: '1-2 naps',
      napDuration: '1-2 hours',
      wakeWindows: '4-6 hours',
      tips: [
        'Transition to one nap around 15-18 months',
        'Set clear and consistent boundaries',
        'Maintain bedtime routine',
        'Limit caffeine and sugar',
        'Create a calm sleep environment',
        'Address fears and anxieties'
      ],
      milestones: [
        'Walking independently',
        'Saying 10-20 words',
        'Following simple instructions',
        'Showing independence'
      ],
      challenges: [
        'Nap transition difficulties',
        'Bedtime resistance',
        'Night fears and anxieties',
        'Testing boundaries'
      ],
      solutions: [
        'Gradually adjust nap schedules',
        'Set firm but loving boundaries',
        'Address fears with comfort',
        'Maintain consistent routines'
      ]
    },
    {
      ageGroup: '3-5 years',
      ageRange: '3-5 years',
      totalSleep: '10-13 hours',
      nightSleep: '10-12 hours',
      naps: '0-1 nap',
      napDuration: '~1 hour',
      wakeWindows: '6-8 hours',
      tips: [
        'Most children drop naps by age 4',
        'Establish consistent bedtime routine',
        'Limit screen time before bed',
        'Create a sleep-friendly environment',
        'Address fears and anxieties',
        'Encourage independence'
      ],
      milestones: [
        'Running and jumping',
        'Speaking in sentences',
        'Playing with others',
        'Understanding rules'
      ],
      challenges: [
        'Bedtime resistance',
        'Night fears and nightmares',
        'Difficulty falling asleep',
        'Early morning wakings'
      ],
      solutions: [
        'Use positive reinforcement',
        'Address fears with comfort',
        'Maintain consistent routines',
        'Provide security objects'
      ]
    }
  ];

  const getCurrentGuideline = (): SleepGuideline => {
    if (!babyAge) return sleepGuidelines[0];
    
    if (babyAge <= 2) return sleepGuidelines[0];
    if (babyAge <= 5) return sleepGuidelines[1];
    if (babyAge <= 8) return sleepGuidelines[2];
    if (babyAge <= 12) return sleepGuidelines[3];
    if (babyAge <= 24) return sleepGuidelines[4];
    return sleepGuidelines[5];
  };

  const currentGuideline = getCurrentGuideline();

  useEffect(() => {
    if (babyId) {
      loadReminders();
      loadInsights();
    }
    setLoading(false);
  }, [babyId]);

  const loadReminders = async () => {
    if (!babyId || !user) return;

    try {
      const { data, error } = await supabase
        .from('baby_reminders')
        .select('*')
        .eq('baby_id', babyId)
        .eq('user_id', user.id)
        .order('time', { ascending: true });

      if (error) throw error;
      setReminders(data || []);
    } catch (error) {
      console.error('Error loading reminders:', error);
    }
  };

  const loadInsights = async () => {
    if (!babyId || !user) return;

    try {
      const { data, error } = await supabase
        .from('developmental_insights')
        .select('*')
        .eq('baby_id', babyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInsights(data || []);
    } catch (error) {
      console.error('Error loading insights:', error);
    }
  };

  const tabs = [
    { id: 'guidelines', label: 'Sleep Guidelines', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'reminders', label: 'Reminders', icon: <Bell className="w-5 h-5" /> },
    { id: 'insights', label: 'Developmental Insights', icon: <Lightbulb className="w-5 h-5" /> },
    { id: 'resources', label: 'Resources', icon: <FileText className="w-5 h-5" /> }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-indigo-600 mb-2">Parent Information & Support</h1>
        <p className="text-gray-600">Expert guidance, age-based recommendations, and personalized insights</p>
      </div>

      {/* Age-Based Header */}
      {babyAge && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Baby className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-bold text-blue-800">
              {currentGuideline.ageGroup} Guidelines
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{currentGuideline.totalSleep}</div>
              <div className="text-sm text-gray-600">Total Sleep</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{currentGuideline.nightSleep}</div>
              <div className="text-sm text-gray-600">Night Sleep</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{currentGuideline.naps}</div>
              <div className="text-sm text-gray-600">Naps</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{currentGuideline.wakeWindows}</div>
              <div className="text-sm text-gray-600">Wake Windows</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'guidelines' && (
              <motion.div
                key="guidelines"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Sleep Guidelines */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Sleep Goals
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Total Sleep:</span>
                        <span className="font-semibold">{currentGuideline.totalSleep}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Night Sleep:</span>
                        <span className="font-semibold">{currentGuideline.nightSleep}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Naps:</span>
                        <span className="font-semibold">{currentGuideline.naps}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Wake Windows:</span>
                        <span className="font-semibold">{currentGuideline.wakeWindows}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5" />
                      Expert Tips
                    </h3>
                    <ul className="space-y-2">
                      {currentGuideline.tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Star className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Developmental Milestones */}
                <div className="bg-purple-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Developmental Milestones
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-purple-700 mb-2">Current Milestones</h4>
                      <ul className="space-y-1">
                        {currentGuideline.milestones.map((milestone, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                            {milestone}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-700 mb-2">Sleep Impact</h4>
                      <ul className="space-y-1">
                        {currentGuideline.challenges.map((challenge, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                            {challenge}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Solutions */}
                <div className="bg-orange-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Solutions & Strategies
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentGuideline.solutions.map((solution, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{solution}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'reminders' && (
              <motion.div
                key="reminders"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Smart Reminders</h3>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    Add Reminder
                  </button>
                </div>

                {reminders.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Bell className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>No reminders set yet</p>
                    <p className="text-sm">Set up reminders for naps, bedtime, and important activities</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {reminders.map((reminder) => (
                      <div key={reminder.id} className="bg-white border rounded-lg p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{reminder.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            reminder.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {reminder.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{reminder.time}</p>
                        <p className="text-xs text-gray-500 capitalize">{reminder.frequency}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'insights' && (
              <motion.div
                key="insights"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-semibold">Developmental Insights</h3>
                
                {insights.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Lightbulb className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>No insights available yet</p>
                    <p className="text-sm">AI will generate insights based on your baby's development</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {insights.map((insight) => (
                      <div key={insight.id} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
                        <h4 className="font-semibold text-purple-800 mb-2">{insight.milestone}</h4>
                        <p className="text-sm text-gray-700 mb-3">{insight.impact}</p>
                        <div className="bg-white rounded p-3 mb-3">
                          <h5 className="font-medium text-purple-700 mb-1">Sleep Adjustment:</h5>
                          <p className="text-sm">{insight.sleepAdjustment}</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-purple-700 mb-1">Tips:</h5>
                          <ul className="space-y-1">
                            {insight.tips.map((tip, index) => (
                              <li key={index} className="text-sm flex items-start gap-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'resources' && (
              <motion.div
                key="resources"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-semibold">Parent Resources</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Sleep Guides
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Newborn Sleep Basics</li>
                      <li>• Sleep Training Methods</li>
                      <li>• Nap Transition Guide</li>
                      <li>• Sleep Regression Help</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 rounded-lg p-6">
                    <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Community
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Parent Forums</li>
                      <li>• Expert Q&A Sessions</li>
                      <li>• Success Stories</li>
                      <li>• Support Groups</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-6">
                    <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      Expert Support
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Live Chat with Experts</li>
                      <li>• Video Consultations</li>
                      <li>• Personalized Plans</li>
                      <li>• Emergency Support</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
} 