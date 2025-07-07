import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Component, ErrorInfo, ReactNode } from 'react';

import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Babies from './pages/Babies';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Instructions from './pages/Instructions';
import Dashboard from './pages/Dashboard';
import SleepLogs from './pages/SleepLogs';
import BabyProfile from './pages/BabyProfile';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import SleepSchedule from './pages/SleepSchedule';
import SleepSounds from './components/SleepSounds';
import CryAnalyzer from './components/CryAnalyzer';
import BabyTracker from './components/BabyTracker';
import GrowthTracker from './components/GrowthTracker';
import SleepMonitor from './components/SleepMonitor';
import AIChatbot from './components/AIChatbot';
import SleepAnalytics from './components/SleepAnalytics';
import PremiumSubscription from './components/PremiumSubscription';
import ReferralRewards from './pages/ReferralRewards';
import ParentInformation from './pages/ParentInformation';

import Layout from './components/Layout';

console.log("✅ App.tsx is rendering");

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-4">We're sorry, but there was an error loading the application.</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
}

// Placeholder components for missing routes
function Landing() {
  return <Navigate to="/dashboard" />;
}

function Celebration() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-purple-600 mb-4">🎉 Congratulations!</h1>
        <p className="text-xl text-gray-700 mb-8">You've completed your baby's profile setup!</p>
        <button
          onClick={() => window.history.back()}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Continue to Dashboard
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/celebrate" element={<Celebration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />

          {/* Protected routes inside Layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Landing />} />
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="babies" element={<Babies />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="logs" element={<SleepLogs />} />
            <Route path="profile" element={<BabyProfile />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
            <Route path="schedules" element={<SleepSchedule />} />
            
            {/* Enhanced AI Features */}
            <Route path="sounds" element={<SleepSounds />} />
            <Route path="cry-analyzer" element={<CryAnalyzer />} />
            <Route path="tracker" element={<BabyTracker babyId="" />} />
            <Route path="growth" element={<GrowthTracker babyId="" birthDate="" />} />
            <Route path="monitor" element={<SleepMonitor babyId="" />} />
            <Route path="ai-chatbot" element={<AIChatbot />} />
            <Route path="sleep-analytics" element={<SleepAnalytics babyId="" />} />
            
            {/* Premium & Referral Features */}
            <Route path="premium" element={<PremiumSubscription />} />
            <Route path="referrals" element={<ReferralRewards />} />
            <Route path="parent-info" element={<ParentInformation />} />
            <Route path="instructions" element={<Instructions />} />

            {/* Baby Tracker by ID */}
            <Route path="tracker/:babyId" element={<BabyTrackerWrapper />} />
            <Route path="profile/:babyId" element={<BabyProfile />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ErrorBoundary>
  );
}

// Add this wrapper at the bottom of the file:
function BabyTrackerWrapper() {
  const { babyId } = useParams();
  if (!babyId) return <div>Baby not found.</div>;
  return <BabyTracker babyId={babyId} />;
}







