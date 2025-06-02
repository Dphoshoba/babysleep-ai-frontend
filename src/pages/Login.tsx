import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAuth = async () => {
    setError('');
    const { error } = isSigningUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) setError(error.message);
    else navigate('/dashboard');
  };

  return (
    <div className="max-w-sm mx-auto mt-12 p-6 border rounded shadow">
      <h2 className="text-xl font-bold text-center mb-4">
        {isSigningUp ? 'Sign Up' : 'Login'}
      </h2>
      <input
        className="w-full p-2 border mb-3"
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        className="w-full p-2 border mb-3"
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        onClick={handleAuth}
        className="w-full bg-blue-600 text-white py-2 rounded mt-3"
      >
        {isSigningUp ? 'Create Account' : 'Login'}
      </button>
      <p
        className="mt-4 text-sm text-center text-blue-600 cursor-pointer"
        onClick={() => setIsSigningUp(!isSigningUp)}
      >
        {isSigningUp ? 'Already have an account? Login' : 'New? Create an account'}
      </p>
    </div>
  );
}


