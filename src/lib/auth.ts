// src/lib/auth.ts
import { supabase } from './supabaseClient';
import type { AuthError, User, Session } from '@supabase/supabase-js';

interface AuthResult {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}

export const signUp = async (email: string, password: string): Promise<AuthResult> => {
  const { data, error } = await supabase.auth.signUp({ 
    email, 
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/login`
    }
  });
  return {
    user: data.user,
    session: data.session,
    error
  };
};

export const signIn = async (email: string, password: string, rememberMe: boolean = false): Promise<AuthResult> => {
  const { data, error } = await supabase.auth.signInWithPassword({ 
    email, 
    password
  });
  return {
    user: data.user,
    session: data.session,
    error
  };
};

export const signOut = async (): Promise<{ error: AuthError | null }> => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const signInWithGoogle = async (): Promise<{ error: AuthError | null }> => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/login`
    }
  });
  return { error };
};

export const signInWithGithub = async (): Promise<{ error: AuthError | null }> => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${window.location.origin}/login`
    }
  });
  return { error };
};
