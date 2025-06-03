import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Babies from './pages/Babies';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import { useAuth } from './contexts/AuthContext';

console.log("✅ App.tsx is rendering");

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route
            path="/babies"
            element={
              <ProtectedRoute>
                <Babies />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/babies" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}






