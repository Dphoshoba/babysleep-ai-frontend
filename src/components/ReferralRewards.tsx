import React, { useState, useEffect } from 'react';
import { Gift, Share2, Users, Star, TrendingUp, Copy, Check, ExternalLink, Award, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface ReferralStats {
  totalReferrals: number;
  successfulReferrals: number;
  pendingReferrals: number;
  totalRewards: number;
  currentBalance: number;
  referralCode: string;
}

interface ReferralHistory {
  id: string;
  referredEmail: string;
  status: 'pending' | 'completed' | 'expired';
  rewardAmount: number;
  createdAt: string;
  completedAt?: string;
}

interface RewardTier {
  referrals: number;
  reward: number;
  bonus: string;
  icon: React.ReactNode;
  color: string;
}

interface ReferralRewardsProps {
  onClose?: () => void;
}

export default function ReferralRewards({ onClose }: ReferralRewardsProps) {
  const { user } = useAuth();
  const [stats, setStats] = useState<ReferralStats>({
    totalReferrals: 0,
    successfulReferrals: 0,
    pendingReferrals: 0,
    totalRewards: 0,
    currentBalance: 0,
    referralCode: ''
  });
  const [history, setHistory] = useState<ReferralHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const rewardTiers: RewardTier[] = [
    {
      referrals: 1,
      reward: 5,
      bonus: '1 Month Free Premium',
      icon: <Star className="w-6 h-6" />,
      color: 'bg-yellow-500'
    },
    {
      referrals: 3,
      reward: 15,
      bonus: '3 Months Free Premium',
      icon: <Award className="w-6 h-6" />,
      color: 'bg-purple-500'
    },
    {
      referrals: 5,
      reward: 30,
      bonus: '6 Months Free Premium',
      icon: <Crown className="w-6 h-6" />,
      color: 'bg-gradient-to-r from-yellow-500 to-orange-500'
    },
    {
      referrals: 10,
      reward: 75,
      bonus: 'Lifetime Premium Access',
      icon: <Zap className="w-6 h-6" />,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500'
    }
  ];

  useEffect(() => {
    if (user) {
      loadReferralData();
    }
  }, [user]);

  const loadReferralData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Load referral stats
      const { data: statsData, error: statsError } = await supabase
        .from('user_referrals')
        .select('*')
        .eq('referrer_id', user.id);

      if (statsError) throw statsError;

      // Load referral history
      const { data: historyData, error: historyError } = await supabase
        .from('referral_history')
        .select('*')
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false });

      if (historyError) throw historyError;

      // Calculate stats
      const totalReferrals = statsData?.length || 0;
      const successfulReferrals = statsData?.filter(r => r.status === 'completed').length || 0;
      const pendingReferrals = statsData?.filter(r => r.status === 'pending').length || 0;
      const totalRewards = statsData?.reduce((sum, r) => sum + (r.reward_amount || 0), 0) || 0;

      setStats({
        totalReferrals,
        successfulReferrals,
        pendingReferrals,
        totalRewards,
        currentBalance: totalRewards,
        referralCode: user.id.slice(0, 8).toUpperCase()
      });

      setHistory(historyData || []);

    } catch (error) {
      console.error('Error loading referral data:', error);
      toast.error('Failed to load referral data');
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = async () => {
    const referralLink = `${window.location.origin}/signup?ref=${stats.referralCode}`;
    
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success('Referral link copied to clipboard!');
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy referral link');
    }
  };

  const shareReferral = async () => {
    const referralLink = `${window.location.origin}/signup?ref=${stats.referralCode}`;
    const shareText = `Join me on BabySleep AI - the most advanced AI-powered baby sleep monitoring app! Use my referral code ${stats.referralCode} to get started. ${referralLink}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'BabySleep AI - Advanced Baby Sleep Monitoring',
          text: shareText,
          url: referralLink
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to copying
      copyReferralLink();
    }
  };

  const getNextTier = () => {
    const currentTier = rewardTiers.find(tier => stats.successfulReferrals >= tier.referrals);
    const nextTier = rewardTiers.find(tier => stats.successfulReferrals < tier.referrals);
    return { currentTier, nextTier };
  };

  const { currentTier, nextTier } = getNextTier();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <Gift className="w-8 h-8 text-purple-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Referral Rewards
            </h1>
          </motion.div>
          <p className="text-xl text-gray-600">
            Share BabySleep AI with other parents and earn amazing rewards!
          </p>
        </div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{stats.totalReferrals}</div>
            <div className="text-sm text-gray-600">Total Referrals</div>
          </div>
          
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <Check className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{stats.successfulReferrals}</div>
            <div className="text-sm text-gray-600">Successful</div>
          </div>
          
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">${stats.totalRewards}</div>
            <div className="text-sm text-gray-600">Total Rewards</div>
          </div>
          
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <Gift className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">${stats.currentBalance}</div>
            <div className="text-sm text-gray-600">Available Balance</div>
          </div>
        </motion.div>

        {/* Referral Code Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Your Referral Code</h2>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="bg-gray-100 px-6 py-3 rounded-lg font-mono text-xl font-bold">
              {stats.referralCode}
            </div>
            <button
              onClick={copyReferralLink}
              className={`px-4 py-3 rounded-lg font-semibold transition-colors ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-purple-500 text-white hover:bg-purple-600'
              }`}
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={shareReferral}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              Share
            </button>
            
            <a
              href={`${window.location.origin}/signup?ref=${stats.referralCode}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <ExternalLink className="w-5 h-5" />
              View Link
            </a>
          </div>
        </motion.div>

        {/* Reward Tiers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Reward Tiers</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rewardTiers.map((tier, index) => {
              const isCompleted = stats.successfulReferrals >= tier.referrals;
              const isCurrent = stats.successfulReferrals < tier.referrals && 
                               (index === 0 || stats.successfulReferrals >= rewardTiers[index - 1].referrals);
              
              return (
                <div
                  key={tier.referrals}
                  className={`relative p-6 rounded-xl border-2 transition-all ${
                    isCompleted
                      ? 'border-green-500 bg-green-50'
                      : isCurrent
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  {isCompleted && (
                    <div className="absolute -top-2 -right-2">
                      <Check className="w-6 h-6 text-green-500 bg-white rounded-full" />
                    </div>
                  )}
                  
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${tier.color} text-white mb-4`}>
                    {tier.icon}
                  </div>
                  
                  <h3 className="font-bold mb-2">{tier.referrals} Referral{tier.referrals > 1 ? 's' : ''}</h3>
                  <div className="text-2xl font-bold text-green-600 mb-2">${tier.reward}</div>
                  <div className="text-sm text-gray-600">{tier.bonus}</div>
                  
                  {isCurrent && (
                    <div className="mt-3 text-sm text-purple-600 font-semibold">
                      {tier.referrals - stats.successfulReferrals} more to go!
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-semibold mb-2">Share Your Code</h3>
              <p className="text-gray-600">Share your unique referral code with other parents</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="font-semibold mb-2">They Sign Up</h3>
              <p className="text-gray-600">When they sign up using your code, they get a special discount</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="font-semibold mb-2">You Get Rewarded</h3>
              <p className="text-gray-600">Earn cash rewards and premium time when they subscribe</p>
            </div>
          </div>
        </motion.div>

        {/* Referral History */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8"
          >
            <h2 className="text-2xl font-bold mb-6">Referral History</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold">Email</th>
                    <th className="text-center py-3 px-4 font-semibold">Status</th>
                    <th className="text-center py-3 px-4 font-semibold">Reward</th>
                    <th className="text-center py-3 px-4 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((referral) => (
                    <tr key={referral.id} className="border-b border-gray-100">
                      <td className="py-3 px-4">{referral.referredEmail}</td>
                      <td className="text-center py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          referral.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : referral.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                        </span>
                      </td>
                      <td className="text-center py-3 px-4 font-semibold">
                        ${referral.rewardAmount}
                      </td>
                      <td className="text-center py-3 px-4 text-sm text-gray-600">
                        {new Date(referral.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Close Button */}
        {onClose && (
          <div className="text-center">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 