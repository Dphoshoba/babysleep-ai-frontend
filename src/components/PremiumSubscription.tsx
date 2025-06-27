import React, { useState, useEffect } from 'react';
import { Check, Star, Crown, Zap, Shield, Users, Brain, Camera, ChartBar, Bell, Lock, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
  color: string;
}

interface PremiumSubscriptionProps {
  onClose?: () => void;
}

export default function PremiumSubscription({ onClose }: PremiumSubscriptionProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<'free' | 'premium'>('free');
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');

  const plans: SubscriptionPlan[] = [
    {
      id: 'free',
      name: 'Free Plan',
      price: 0,
      interval: 'month',
      features: [
        'Basic sleep tracking',
        'Simple sleep logs',
        'Basic baby profile',
        'Limited analytics',
        'Community support'
      ],
      icon: <Star className="w-6 h-6" />,
      color: 'bg-gray-500'
    },
    {
      id: 'premium-monthly',
      name: 'Premium Monthly',
      price: 9.99,
      interval: 'month',
      features: [
        '🤖 AI Sleep Consultant (24/7)',
        '📹 Real-time Sleep Monitoring',
        '🧠 AI Cry Analyzer',
        '📊 Advanced Sleep Analytics',
        '🎵 Premium Sleep Sounds',
        '📱 Comprehensive Baby Tracking',
        '📏 Growth & Development Tracking',
        '🔔 Predictive Alerts & Reminders',
        '🌡️ Environmental Monitoring',
        '📈 Sleep Pattern Analysis',
        '🎯 Personalized Sleep Coaching',
        '🔒 Bank-level Security',
        '📱 Multi-device Access',
        '👨‍👩‍👧‍👦 Family Sharing (up to 8 users)',
        '🏠 Smart Home Integration',
        '💬 Expert Community Access',
        '📋 Health Provider Reports',
        '🎁 Referral Rewards Program'
      ],
      popular: true,
      icon: <Crown className="w-6 h-6" />,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500'
    },
    {
      id: 'premium-yearly',
      name: 'Premium Yearly',
      price: 99.99,
      interval: 'year',
      features: [
        '🤖 AI Sleep Consultant (24/7)',
        '📹 Real-time Sleep Monitoring',
        '🧠 AI Cry Analyzer',
        '📊 Advanced Sleep Analytics',
        '🎵 Premium Sleep Sounds',
        '📱 Comprehensive Baby Tracking',
        '📏 Growth & Development Tracking',
        '🔔 Predictive Alerts & Reminders',
        '🌡️ Environmental Monitoring',
        '📈 Sleep Pattern Analysis',
        '🎯 Personalized Sleep Coaching',
        '🔒 Bank-level Security',
        '📱 Multi-device Access',
        '👨‍👩‍👧‍👦 Family Sharing (up to 8 users)',
        '🏠 Smart Home Integration',
        '💬 Expert Community Access',
        '📋 Health Provider Reports',
        '🎁 Referral Rewards Program',
        '💰 2 Months Free (Save $19.98)',
        '🎉 Priority Support'
      ],
      icon: <Crown className="w-6 h-6" />,
      color: 'bg-gradient-to-r from-yellow-500 to-orange-500'
    }
  ];

  const currentPlanData = plans.find(p => p.id === 'free');
  const monthlyPlan = plans.find(p => p.id === 'premium-monthly');
  const yearlyPlan = plans.find(p => p.id === 'premium-yearly');

  useEffect(() => {
    checkCurrentSubscription();
  }, [user]);

  const checkCurrentSubscription = async () => {
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

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      toast.error('Please log in to subscribe');
      return;
    }

    setLoading(true);

    try {
      // In a real implementation, you would integrate with Stripe or another payment processor
      // For now, we'll simulate the subscription process
      
      const plan = plans.find(p => p.id === planId);
      if (!plan) throw new Error('Plan not found');

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create subscription record
      const { error } = await supabase
        .from('user_subscriptions')
        .insert([{
          user_id: user.id,
          plan_id: planId,
          status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + (plan.interval === 'month' ? 30 : 365) * 24 * 60 * 60 * 1000).toISOString(),
          amount: plan.price,
          currency: 'USD'
        }]);

      if (error) throw error;

      setCurrentPlan('premium');
      toast.success(`Successfully subscribed to ${plan.name}!`);
      
      // Redirect to premium features
      if (onClose) onClose();
      
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to process subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!user) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({ status: 'cancelled' })
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (error) throw error;

      setCurrentPlan('free');
      toast.success('Subscription cancelled successfully');
      
    } catch (error) {
      console.error('Cancellation error:', error);
      toast.error('Failed to cancel subscription');
    } finally {
      setLoading(false);
    }
  };

  const featureComparison = [
    {
      feature: 'AI Sleep Consultant',
      free: false,
      premium: true,
      description: '24/7 expert guidance and personalized advice'
    },
    {
      feature: 'Real-time Sleep Monitoring',
      free: false,
      premium: true,
      description: 'Live video monitoring with AI safety alerts'
    },
    {
      feature: 'AI Cry Analyzer',
      free: false,
      premium: true,
      description: 'Advanced cry interpretation and analysis'
    },
    {
      feature: 'Advanced Analytics',
      free: false,
      premium: true,
      description: 'Comprehensive sleep pattern analysis'
    },
    {
      feature: 'Environmental Monitoring',
      free: false,
      premium: true,
      description: 'Temperature, humidity, and air quality tracking'
    },
    {
      feature: 'Predictive Alerts',
      free: false,
      premium: true,
      description: 'AI-powered sleep predictions and reminders'
    },
    {
      feature: 'Family Sharing',
      free: false,
      premium: true,
      description: 'Up to 8 family members can access the app'
    },
    {
      feature: 'Smart Home Integration',
      free: false,
      premium: true,
      description: 'Connect with smart lights, thermostats, and more'
    },
    {
      feature: 'Health Provider Reports',
      free: false,
      premium: true,
      description: 'Professional reports for pediatricians'
    },
    {
      feature: 'Referral Rewards',
      free: false,
      premium: true,
      description: 'Earn rewards for referring other parents'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <Crown className="w-8 h-8 text-yellow-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Upgrade to Premium
            </h1>
          </motion.div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock the full power of AI-powered baby sleep monitoring with our comprehensive premium features
          </p>
        </div>

        {/* Current Plan Status */}
        {currentPlan === 'premium' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Check className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-800">Premium Active</h3>
                  <p className="text-green-600">You have access to all premium features</p>
                </div>
              </div>
              <button
                onClick={handleCancelSubscription}
                disabled={loading}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Cancel Subscription'}
              </button>
            </div>
          </motion.div>
        )}

        {/* Plan Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-white rounded-2xl shadow-xl p-8 border-2 ${
                plan.popular ? 'border-purple-500 scale-105' : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${plan.color} text-white mb-4`}>
                  {plan.icon}
                </div>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-500">/{plan.interval}</span>
                </div>
                {plan.id === 'premium-yearly' && (
                  <p className="text-green-600 font-semibold">Save $19.98 annually!</p>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.id === 'free' ? (
                <div className="text-center text-gray-500">
                  <p>Current Plan</p>
                </div>
              ) : (
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading || currentPlan === 'premium'}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                      : 'bg-gray-800 text-white hover:bg-gray-900'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading ? 'Processing...' : currentPlan === 'premium' ? 'Already Subscribed' : 'Subscribe Now'}
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {/* Feature Comparison */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold">Feature</th>
                  <th className="text-center py-4 px-4 font-semibold">Free</th>
                  <th className="text-center py-4 px-4 font-semibold">Premium</th>
                </tr>
              </thead>
              <tbody>
                {featureComparison.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium">{item.feature}</div>
                        <div className="text-sm text-gray-500">{item.description}</div>
                      </div>
                    </td>
                    <td className="text-center py-4 px-4">
                      {item.free ? (
                        <Check className="w-6 h-6 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="text-center py-4 px-4">
                      {item.premium ? (
                        <Check className="w-6 h-6 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Why Upgrade */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 text-center shadow-lg"
          >
            <Brain className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">AI-Powered Insights</h3>
            <p className="text-sm text-gray-600">Advanced AI analysis and personalized recommendations</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 text-center shadow-lg"
          >
            <Camera className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Real-time Monitoring</h3>
            <p className="text-sm text-gray-600">Live video monitoring with safety alerts</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 text-center shadow-lg"
          >
            <ChartBar className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Advanced Analytics</h3>
            <p className="text-sm text-gray-600">Comprehensive sleep pattern analysis</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 text-center shadow-lg"
          >
            <Users className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Family Sharing</h3>
            <p className="text-sm text-gray-600">Share with up to 8 family members</p>
          </motion.div>
        </div>

        {/* Trust Indicators */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-6">Trusted by Parents Worldwide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-center gap-3">
              <Shield className="w-8 h-8 text-green-500" />
              <div className="text-left">
                <div className="font-semibold">Bank-Level Security</div>
                <div className="text-sm text-gray-600">Your data is encrypted and secure</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Globe className="w-8 h-8 text-blue-500" />
              <div className="text-left">
                <div className="font-semibold">24/7 Support</div>
                <div className="text-sm text-gray-600">Expert help whenever you need it</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Lock className="w-8 h-8 text-purple-500" />
              <div className="text-left">
                <div className="font-semibold">Privacy First</div>
                <div className="text-sm text-gray-600">Your privacy is our priority</div>
              </div>
            </div>
          </div>
        </div>

        {/* Close Button */}
        {onClose && (
          <div className="text-center mt-8">
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