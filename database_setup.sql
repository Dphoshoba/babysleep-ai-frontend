-- BabySleep AI Database Setup
-- Comprehensive schema for advanced AI-powered baby sleep tracking with premium subscriptions

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (handled by Supabase Auth)
-- This is automatically created by Supabase

-- Babies table
CREATE TABLE IF NOT EXISTS babies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    birth_date DATE NOT NULL,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    weight_at_birth DECIMAL(4,2),
    height_at_birth DECIMAL(4,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sleep logs table
CREATE TABLE IF NOT EXISTS sleep_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    baby_id UUID REFERENCES babies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    sleep_time TIMESTAMP WITH TIME ZONE NOT NULL,
    wake_time TIMESTAMP WITH TIME ZONE,
    duration_hours DECIMAL(4,2),
    quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Sleep Sessions table for AI monitoring
CREATE TABLE IF NOT EXISTS sleep_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    baby_id UUID REFERENCES babies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    duration DECIMAL(6,2), -- in minutes
    quality_score INTEGER CHECK (quality_score >= 0 AND quality_score <= 100),
    movements INTEGER DEFAULT 0,
    cries_detected INTEGER DEFAULT 0,
    safety_alerts INTEGER DEFAULT 0,
    temperature DECIMAL(4,2),
    humidity DECIMAL(4,2),
    position_changes INTEGER DEFAULT 0,
    deep_sleep_percentage DECIMAL(5,2),
    light_sleep_percentage DECIMAL(5,2),
    rem_sleep_percentage DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Safety Alerts table for real-time monitoring
CREATE TABLE IF NOT EXISTS safety_alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    baby_id UUID REFERENCES babies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES sleep_sessions(id) ON DELETE CASCADE,
    alert_type TEXT NOT NULL CHECK (alert_type IN ('face_covered', 'rollover', 'cry_detected', 'movement', 'temperature', 'humidity', 'breathing', 'position')),
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    message TEXT NOT NULL,
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Chatbot Interactions table
CREATE TABLE IF NOT EXISTS ai_chatbot_interactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    baby_id UUID REFERENCES babies(id) ON DELETE CASCADE,
    message_type TEXT NOT NULL CHECK (message_type IN ('user', 'bot')),
    content TEXT NOT NULL,
    topic TEXT,
    age_group TEXT,
    response_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sleep Sounds Usage table
CREATE TABLE IF NOT EXISTS sleep_sounds_usage (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    baby_id UUID REFERENCES babies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    sound_type TEXT NOT NULL,
    duration_minutes INTEGER,
    volume_level INTEGER CHECK (volume_level >= 0 AND volume_level <= 100),
    effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cry Analysis Results table
CREATE TABLE IF NOT EXISTS cry_analysis_results (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    baby_id UUID REFERENCES babies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    recording_duration_seconds INTEGER,
    cry_type TEXT CHECK (cry_type IN ('hunger', 'tired', 'discomfort', 'pain', 'attention', 'gas', 'unknown')),
    confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
    audio_features JSONB,
    ai_analysis TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Baby Activity Tracking table
CREATE TABLE IF NOT EXISTS baby_activities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    baby_id UUID REFERENCES babies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL CHECK (activity_type IN ('feeding', 'diaper', 'sleep', 'play', 'bath', 'medicine', 'milestone')),
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    notes TEXT,
    details JSONB, -- For storing activity-specific data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Growth Measurements table
CREATE TABLE IF NOT EXISTS growth_measurements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    baby_id UUID REFERENCES babies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    measurement_date DATE NOT NULL,
    weight_kg DECIMAL(4,2),
    height_cm DECIMAL(5,2),
    head_circumference_cm DECIMAL(4,2),
    measurement_source TEXT CHECK (measurement_source IN ('manual', 'ai_vision', 'smart_scale')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sleep Schedules table
CREATE TABLE IF NOT EXISTS sleep_schedules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    baby_id UUID REFERENCES babies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    schedule_name TEXT NOT NULL,
    bedtime TIME,
    wake_time TIME,
    nap_times JSONB, -- Array of nap times
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sleep Training Sessions table
CREATE TABLE IF NOT EXISTS sleep_training_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    baby_id UUID REFERENCES babies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    method TEXT NOT NULL CHECK (method IN ('ferber', 'cry_it_out', 'no_tears', 'pick_up_put_down', 'camping_out')),
    start_date DATE NOT NULL,
    end_date DATE,
    success_rating INTEGER CHECK (success_rating >= 1 AND success_rating <= 5),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Environmental Monitoring table
CREATE TABLE IF NOT EXISTS environmental_data (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    baby_id UUID REFERENCES babies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES sleep_sessions(id) ON DELETE CASCADE,
    temperature_celsius DECIMAL(4,2),
    humidity_percentage DECIMAL(4,2),
    light_level INTEGER CHECK (light_level >= 0 AND light_level <= 100),
    noise_level INTEGER CHECK (noise_level >= 0 AND noise_level <= 100),
    air_quality_index INTEGER,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sleep Insights and Recommendations table
CREATE TABLE IF NOT EXISTS sleep_insights (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    baby_id UUID REFERENCES babies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    insight_type TEXT NOT NULL CHECK (insight_type IN ('pattern', 'recommendation', 'alert', 'milestone')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    severity TEXT CHECK (severity IN ('info', 'warning', 'critical')),
    is_read BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    notification_settings JSONB,
    privacy_settings JSONB,
    ai_preferences JSONB,
    theme_preferences JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Premium Subscription Plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(8,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    interval TEXT NOT NULL CHECK (interval IN ('month', 'year')),
    features JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'expired', 'past_due')),
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    amount DECIMAL(8,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    payment_method_id TEXT,
    stripe_subscription_id TEXT,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Referral System tables
CREATE TABLE IF NOT EXISTS user_referrals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    referred_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    referral_code TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'expired')),
    reward_amount DECIMAL(8,2) DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Referral History table
CREATE TABLE IF NOT EXISTS referral_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    referred_email TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'expired')),
    reward_amount DECIMAL(8,2) DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Rewards table
CREATE TABLE IF NOT EXISTS user_rewards (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('referral', 'subscription', 'promotion')),
    amount DECIMAL(8,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT NOT NULL CHECK (status IN ('pending', 'available', 'used', 'expired')),
    expires_at TIMESTAMP WITH TIME ZONE,
    used_at TIMESTAMP WITH TIME ZONE,
    reference_id UUID, -- Links to referral or subscription
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Baby Reminders table
CREATE TABLE IF NOT EXISTS baby_reminders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    baby_id UUID REFERENCES babies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('nap', 'bedtime', 'feeding', 'medicine', 'checkup')),
    title TEXT NOT NULL,
    time TIME NOT NULL,
    frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly')),
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Developmental Insights table
CREATE TABLE IF NOT EXISTS developmental_insights (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    baby_id UUID REFERENCES babies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    age_group TEXT NOT NULL,
    milestone TEXT NOT NULL,
    impact TEXT NOT NULL,
    sleep_adjustment TEXT NOT NULL,
    tips JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_babies_user_id ON babies(user_id);
CREATE INDEX IF NOT EXISTS idx_sleep_logs_baby_id ON sleep_logs(baby_id);
CREATE INDEX IF NOT EXISTS idx_sleep_logs_user_id ON sleep_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_sleep_sessions_baby_id ON sleep_sessions(baby_id);
CREATE INDEX IF NOT EXISTS idx_sleep_sessions_start_time ON sleep_sessions(start_time);
CREATE INDEX IF NOT EXISTS idx_safety_alerts_baby_id ON safety_alerts(baby_id);
CREATE INDEX IF NOT EXISTS idx_safety_alerts_created_at ON safety_alerts(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_chatbot_user_id ON ai_chatbot_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_baby_activities_baby_id ON baby_activities(baby_id);
CREATE INDEX IF NOT EXISTS idx_growth_measurements_baby_id ON growth_measurements(baby_id);
CREATE INDEX IF NOT EXISTS idx_environmental_data_baby_id ON environmental_data(baby_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_referrals_referrer_id ON user_referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_user_referrals_referred_id ON user_referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_user_rewards_user_id ON user_rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_baby_reminders_baby_id ON baby_reminders(baby_id);
CREATE INDEX IF NOT EXISTS idx_developmental_insights_baby_id ON developmental_insights(baby_id);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE babies ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chatbot_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_sounds_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE cry_analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE baby_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE growth_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE environmental_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE baby_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE developmental_insights ENABLE ROW LEVEL SECURITY;

-- Babies policies
CREATE POLICY "Users can view their own babies" ON babies
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own babies" ON babies
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own babies" ON babies
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own babies" ON babies
    FOR DELETE USING (auth.uid() = user_id);

-- Sleep logs policies
CREATE POLICY "Users can view their own sleep logs" ON sleep_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sleep logs" ON sleep_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sleep logs" ON sleep_logs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sleep logs" ON sleep_logs
    FOR DELETE USING (auth.uid() = user_id);

-- Sleep sessions policies
CREATE POLICY "Users can view their own sleep sessions" ON sleep_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sleep sessions" ON sleep_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sleep sessions" ON sleep_sessions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sleep sessions" ON sleep_sessions
    FOR DELETE USING (auth.uid() = user_id);

-- Safety alerts policies
CREATE POLICY "Users can view their own safety alerts" ON safety_alerts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own safety alerts" ON safety_alerts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own safety alerts" ON safety_alerts
    FOR UPDATE USING (auth.uid() = user_id);

-- AI chatbot interactions policies
CREATE POLICY "Users can view their own chatbot interactions" ON ai_chatbot_interactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chatbot interactions" ON ai_chatbot_interactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Baby activities policies
CREATE POLICY "Users can view their own baby activities" ON baby_activities
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own baby activities" ON baby_activities
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own baby activities" ON baby_activities
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own baby activities" ON baby_activities
    FOR DELETE USING (auth.uid() = user_id);

-- Growth measurements policies
CREATE POLICY "Users can view their own growth measurements" ON growth_measurements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own growth measurements" ON growth_measurements
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own growth measurements" ON growth_measurements
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own growth measurements" ON growth_measurements
    FOR DELETE USING (auth.uid() = user_id);

-- Sleep schedules policies
CREATE POLICY "Users can view their own sleep schedules" ON sleep_schedules
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sleep schedules" ON sleep_schedules
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sleep schedules" ON sleep_schedules
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sleep schedules" ON sleep_schedules
    FOR DELETE USING (auth.uid() = user_id);

-- Sleep training sessions policies
CREATE POLICY "Users can view their own sleep training sessions" ON sleep_training_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sleep training sessions" ON sleep_training_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sleep training sessions" ON sleep_training_sessions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sleep training sessions" ON sleep_training_sessions
    FOR DELETE USING (auth.uid() = user_id);

-- Environmental data policies
CREATE POLICY "Users can view their own environmental data" ON environmental_data
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own environmental data" ON environmental_data
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Sleep insights policies
CREATE POLICY "Users can view their own sleep insights" ON sleep_insights
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sleep insights" ON sleep_insights
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sleep insights" ON sleep_insights
    FOR UPDATE USING (auth.uid() = user_id);

-- User preferences policies
CREATE POLICY "Users can view their own preferences" ON user_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" ON user_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON user_preferences
    FOR UPDATE USING (auth.uid() = user_id);

-- User subscriptions policies
CREATE POLICY "Users can view their own subscriptions" ON user_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions" ON user_subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" ON user_subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

-- User referrals policies
CREATE POLICY "Users can view their own referrals" ON user_referrals
    FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "Users can insert their own referrals" ON user_referrals
    FOR INSERT WITH CHECK (auth.uid() = referrer_id);

-- Referral history policies
CREATE POLICY "Users can view their own referral history" ON referral_history
    FOR SELECT USING (auth.uid() = referrer_id);

CREATE POLICY "Users can insert their own referral history" ON referral_history
    FOR INSERT WITH CHECK (auth.uid() = referrer_id);

-- User rewards policies
CREATE POLICY "Users can view their own rewards" ON user_rewards
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own rewards" ON user_rewards
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rewards" ON user_rewards
    FOR UPDATE USING (auth.uid() = user_id);

-- Baby reminders policies
CREATE POLICY "Users can view their own baby reminders" ON baby_reminders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own baby reminders" ON baby_reminders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own baby reminders" ON baby_reminders
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own baby reminders" ON baby_reminders
    FOR DELETE USING (auth.uid() = user_id);

-- Developmental insights policies
CREATE POLICY "Users can view their own developmental insights" ON developmental_insights
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own developmental insights" ON developmental_insights
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Additional policies for other tables
CREATE POLICY "Users can view their own sleep sounds usage" ON sleep_sounds_usage
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sleep sounds usage" ON sleep_sounds_usage
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own cry analysis results" ON cry_analysis_results
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cry analysis results" ON cry_analysis_results
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Functions for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_babies_updated_at BEFORE UPDATE ON babies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sleep_logs_updated_at BEFORE UPDATE ON sleep_logs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sleep_sessions_updated_at BEFORE UPDATE ON sleep_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_baby_activities_updated_at BEFORE UPDATE ON baby_activities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_growth_measurements_updated_at BEFORE UPDATE ON growth_measurements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sleep_schedules_updated_at BEFORE UPDATE ON sleep_schedules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_baby_reminders_updated_at BEFORE UPDATE ON baby_reminders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate sleep duration
CREATE OR REPLACE FUNCTION calculate_sleep_duration()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.wake_time IS NOT NULL AND NEW.sleep_time IS NOT NULL THEN
        NEW.duration_hours = EXTRACT(EPOCH FROM (NEW.wake_time - NEW.sleep_time)) / 3600;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for sleep duration calculation
CREATE TRIGGER calculate_sleep_duration_trigger
    BEFORE INSERT OR UPDATE ON sleep_logs
    FOR EACH ROW EXECUTE FUNCTION calculate_sleep_duration();

-- Function to calculate sleep session duration
CREATE OR REPLACE FUNCTION calculate_session_duration()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.end_time IS NOT NULL AND NEW.start_time IS NOT NULL THEN
        NEW.duration = EXTRACT(EPOCH FROM (NEW.end_time - NEW.start_time)) / 60; -- in minutes
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for session duration calculation
CREATE TRIGGER calculate_session_duration_trigger
    BEFORE INSERT OR UPDATE ON sleep_sessions
    FOR EACH ROW EXECUTE FUNCTION calculate_session_duration();

-- Function to calculate activity duration
CREATE OR REPLACE FUNCTION calculate_activity_duration()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.end_time IS NOT NULL AND NEW.start_time IS NOT NULL THEN
        NEW.duration_minutes = EXTRACT(EPOCH FROM (NEW.end_time - NEW.start_time)) / 60;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for activity duration calculation
CREATE TRIGGER calculate_activity_duration_trigger
    BEFORE INSERT OR UPDATE ON baby_activities
    FOR EACH ROW EXECUTE FUNCTION calculate_activity_duration();

-- Insert default subscription plans
INSERT INTO subscription_plans (name, description, price, interval, features) VALUES
('Free Plan', 'Basic sleep tracking and baby management', 0.00, 'month', '["Basic sleep tracking", "Simple sleep logs", "Basic baby profile", "Limited analytics", "Community support"]'),
('Premium Monthly', 'Advanced AI features and comprehensive monitoring', 9.99, 'month', '["AI Sleep Consultant", "Real-time Sleep Monitoring", "AI Cry Analyzer", "Advanced Sleep Analytics", "Premium Sleep Sounds", "Comprehensive Baby Tracking", "Growth & Development Tracking", "Predictive Alerts", "Environmental Monitoring", "Sleep Pattern Analysis", "Personalized Sleep Coaching", "Bank-level Security", "Multi-device Access", "Family Sharing", "Smart Home Integration", "Expert Community Access", "Health Provider Reports", "Referral Rewards Program"]'),
('Premium Yearly', 'Advanced AI features with 2 months free', 99.99, 'year', '["AI Sleep Consultant", "Real-time Sleep Monitoring", "AI Cry Analyzer", "Advanced Sleep Analytics", "Premium Sleep Sounds", "Comprehensive Baby Tracking", "Growth & Development Tracking", "Predictive Alerts", "Environmental Monitoring", "Sleep Pattern Analysis", "Personalized Sleep Coaching", "Bank-level Security", "Multi-device Access", "Family Sharing", "Smart Home Integration", "Expert Community Access", "Health Provider Reports", "Referral Rewards Program", "2 Months Free", "Priority Support"]')
ON CONFLICT DO NOTHING;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated; 