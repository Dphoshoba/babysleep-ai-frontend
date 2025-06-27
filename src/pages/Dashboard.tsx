import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { motion } from 'framer-motion';
import { 
  Baby, 
  Bed, 
  ChartBar, 
  Clock, 
  TrendingUp, 
  Bell, 
  Camera, 
  Brain, 
  Music, 
  Mic, 
  Users, 
  Ruler, 
  Crown, 
  Gift, 
  BookOpen,
  Star,
  Zap,
  Shield,
  Globe
} from 'lucide-react';

interface Baby {
  id: string;
  name: string;
  birth_date: string;
  gender: string;
}

interface SleepLog {
  id: string;
  sleep_time: string;
  wake_time: string;
  duration_hours: number;
  quality_rating: number;
}

interface DashboardStats {
  totalBabies: number;
  totalSleepLogs: number;
  averageSleepDuration: number;
  averageQualityRating: number;
  recentAlerts: number;
  aiInsights: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [babies, setBabies] = useState<Baby[]>([]);
  const [recentSleepLogs, setRecentSleepLogs] = useState<SleepLog[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalBabies: 0,
    totalSleepLogs: 0,
    averageSleepDuration: 0,
    averageQualityRating: 0,
    recentAlerts: 0,
    aiInsights: 0
  });
  const [loading, setLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState<'free' | 'premium'>('free');

  useEffect(() => {
    if (user) {
      loadDashboardData();
      checkSubscriptionStatus();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load babies
      const { data: babiesData, error: babiesError } = await supabase
        .from('babies')
        .select('*')
        .eq('user_id', user?.id);

      if (babiesError) throw babiesError;
      setBabies(babiesData || []);

      // Load recent sleep logs
      const { data: logsData, error: logsError } = await supabase
        .from('sleep_logs')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (logsError) throw logsError;
      setRecentSleepLogs(logsData || []);

      // Calculate stats
      const totalBabies = babiesData?.length || 0;
      const totalSleepLogs = logsData?.length || 0;
      const averageSleepDuration = logsData?.length > 0 
        ? logsData.reduce((sum, log) => sum + (log.duration_hours || 0), 0) / logsData.length 
        : 0;
      const averageQualityRating = logsData?.length > 0 
        ? logsData.reduce((sum, log) => sum + (log.quality_rating || 0), 0) / logsData.length 
        : 0;

      setStats({
        totalBabies,
        totalSleepLogs,
        averageSleepDuration,
        averageQualityRating,
        recentAlerts: 3, // Mock data
        aiInsights: 5 // Mock data
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkSubscriptionStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking subscription:', error);
        return;
      }

      if (data) {
        setCurrentPlan('premium');
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const featureCards = [
    {
      title: 'Sleep Monitor',
      description: 'Real-time AI monitoring with safety alerts',
      icon: <Camera className="w-8 h-8" />,
      color: 'bg-blue-500',
      link: '/monitor',
      premium: true
    },
    {
      title: 'AI Consultant',
      description: '24/7 expert sleep guidance',
      icon: <Brain className="w-8 h-8" />,
      color: 'bg-purple-500',
      link: '/ai-chatbot',
      premium: true
    },
    {
      title: 'Sleep Sounds',
      description: 'Soothing sounds and lullabies',
      icon: <Music className="w-8 h-8" />,
      color: 'bg-green-500',
      link: '/sounds',
      premium: true
    },
    {
      title: 'Cry Analyzer',
      description: 'AI-powered cry interpretation',
      icon: <Mic className="w-8 h-8" />,
      color: 'bg-pink-500',
      link: '/cry-analyzer',
      premium: true
    },
    {
      title: 'Baby Tracker',
      description: 'Comprehensive activity tracking',
      icon: <Users className="w-8 h-8" />,
      color: 'bg-orange-500',
      link: '/tracker',
      premium: true
    },
    {
      title: 'Growth Tracker',
      description: 'Monitor development milestones',
      icon: <Ruler className="w-8 h-8" />,
      color: 'bg-teal-500',
      link: '/growth',
      premium: true
    },
    {
      title: 'Sleep Analytics',
      description: 'Advanced pattern analysis',
      icon: <ChartBar className="w-8 h-8" />,
      color: 'bg-indigo-500',
      link: '/sleep-analytics',
      premium: true
    },
    {
      title: 'Parent Information',
      description: 'Expert guidance and resources',
      icon: <BookOpen className="w-8 h-8" />,
      color: 'bg-yellow-500',
      link: '/parent-info',
      premium: false
    }
  ];

  const premiumFeatures = [
    {
      title: 'Premium Subscription',
      description: 'Unlock all advanced AI features',
      icon: <Crown className="w-8 h-8" />,
      color: 'bg-gradient-to-r from-yellow-500 to-orange-500',
      link: '/premium',
      highlight: true
    },
    {
      title: 'Referral Rewards',
      description: 'Earn rewards by referring friends',
      icon: <Gift className="w-8 h-8" />,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      link: '/referrals',
      highlight: true
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome to BabySleep AI</h1>
            <p className="text-indigo-100 text-lg">
              Advanced AI-powered baby sleep monitoring and guidance
            </p>
          </div>
          <div className="hidden md:flex items-center gap-4">
            {currentPlan === 'premium' ? (
              <div className="flex items-center gap-2 bg-yellow-500 text-yellow-900 px-4 py-2 rounded-full">
                <Crown className="w-5 h-5" />
                <span className="font-semibold">Premium Active</span>
              </div>
            ) : (
              <Link
                to="/premium"
                className="flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-full hover:bg-indigo-50 transition-colors"
              >
                <Crown className="w-5 h-5" />
                <span className="font-semibold">Upgrade to Premium</span>
              </Link>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Babies</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBabies}</p>
            </div>
            <Baby className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Sleep Logs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSleepLogs}</p>
            </div>
            <Bed className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Avg Sleep Duration</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageSleepDuration.toFixed(1)}h</p>
            </div>
            <Clock className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Avg Quality</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageQualityRating.toFixed(1)}/5</p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </motion.div>

      {/* Premium Features Highlight */}
      {currentPlan === 'free' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-yellow-800 mb-2">Unlock Premium Features</h2>
              <p className="text-yellow-700 mb-4">
                Get access to AI monitoring, expert guidance, and advanced analytics for just $9.99/month
              </p>
              <div className="flex items-center gap-4">
                <Link
                  to="/premium"
                  className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors font-semibold"
                >
                  Upgrade Now
                </Link>
                <Link
                  to="/referrals"
                  className="text-yellow-700 hover:text-yellow-800 font-medium"
                >
                  Earn Free Premium →
                </Link>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Zap className="w-8 h-8 text-yellow-600" />
              <Shield className="w-8 h-8 text-yellow-600" />
              <Globe className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureCards.map((card, index) => (
            <Link
              key={card.title}
              to={card.link}
              className={`group relative bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ${
                card.premium && currentPlan === 'free' ? 'opacity-60' : ''
              }`}
            >
              {card.premium && currentPlan === 'free' && (
                <div className="absolute top-2 right-2">
                  <Crown className="w-5 h-5 text-yellow-500" />
                </div>
              )}
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${card.color} text-white mb-4`}>
                {card.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{card.title}</h3>
              <p className="text-sm text-gray-600">{card.description}</p>
              {card.premium && currentPlan === 'free' && (
                <div className="mt-3 text-xs text-yellow-600 font-medium">Premium Feature</div>
              )}
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Premium & Referral Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold mb-6">Premium & Rewards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {premiumFeatures.map((card) => (
            <Link
              key={card.title}
              to={card.link}
              className="group relative bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-yellow-200"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${card.color} text-white mb-4`}>
                {card.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{card.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{card.description}</p>
              <div className="flex items-center gap-2 text-yellow-600 font-medium">
                <span>Learn More</span>
                <TrendingUp className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      {recentSleepLogs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold mb-6">Recent Sleep Activity</h2>
          <div className="space-y-4">
            {recentSleepLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <Bed className="w-6 h-6 text-indigo-500" />
                  <div>
                    <p className="font-medium">
                      {new Date(log.sleep_time).toLocaleDateString()} - {new Date(log.wake_time).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Duration: {log.duration_hours?.toFixed(1)}h | Quality: {log.quality_rating}/5
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < (log.quality_rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* AI Insights Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-8 h-8 text-purple-600" />
          <h2 className="text-2xl font-bold text-purple-800">AI Insights</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold text-purple-700 mb-2">Sleep Pattern</h3>
            <p className="text-sm text-gray-600">Your baby shows consistent sleep patterns with room for optimization.</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold text-purple-700 mb-2">Development</h3>
            <p className="text-sm text-gray-600">Current sleep behavior aligns with age-appropriate expectations.</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold text-purple-700 mb-2">Recommendations</h3>
            <p className="text-sm text-gray-600">Consider adjusting bedtime routine for better sleep quality.</p>
          </div>
        </div>
        <div className="mt-4 text-center">
          <Link
            to="/ai-chatbot"
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Brain className="w-5 h-5" />
            Get Personalized Advice
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

