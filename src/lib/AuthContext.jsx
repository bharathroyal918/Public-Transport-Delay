/**
 * AuthContext.jsx
 * 
 * Full auth management using Supabase Auth.
 * Falls back to a local guest session when Supabase is not configured.
 * Provides: login, signup, logout, password reset, session state.
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/api/supabaseClient';

const AuthContext = createContext();

const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL || '';
  return url.length > 0 && !url.includes('placeholder') && !url.includes('your-project');
};

const GUEST_USER = {
  id: 'guest',
  email: 'guest@localhost',
  user_metadata: { full_name: 'Guest User' },
  role: 'guest',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [isLoadingPublicSettings] = useState(false);

  const configured = isSupabaseConfigured();

  useEffect(() => {
    if (!configured) {
      // No Supabase → guest mode
      setUser(GUEST_USER);
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session?.user);
      setIsLoadingAuth(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session?.user);
      setAuthError(null);
    });

    return () => subscription.unsubscribe();
  }, [configured]);

  const signUp = async (email, password, fullName) => {
    if (!configured) return { error: new Error('Supabase not configured') };
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    return { data, error };
  };

  const signIn = async (email, password) => {
    if (!configured) return { error: new Error('Supabase not configured') };
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError({ type: 'sign_in_failed', message: error.message });
    return { data, error };
  };

  const signInWithGoogle = async () => {
    if (!configured) return { error: new Error('Supabase not configured') };
    return supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
  };

  const signInWithGithub = async () => {
    if (!configured) return { error: new Error('Supabase not configured') };
    return supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: window.location.origin },
    });
  };

  const logout = async () => {
    if (!configured) {
      setUser(GUEST_USER);
      return;
    }
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
  };

  const resetPassword = async (email) => {
    if (!configured) return { error: new Error('Supabase not configured') };
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  };

  const updatePassword = async (newPassword) => {
    if (!configured) return { error: new Error('Supabase not configured') };
    return supabase.auth.updateUser({ password: newPassword });
  };

  const updateProfile = async (updates) => {
    if (!configured) return { error: new Error('Supabase not configured') };
    const { data, error } = await supabase.auth.updateUser({ data: updates });
    if (!error) setUser(data.user);
    return { data, error };
  };

  const navigateToLogin = () => {
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      configured,
      signUp,
      signIn,
      signInWithGoogle,
      signInWithGithub,
      logout,
      resetPassword,
      updatePassword,
      updateProfile,
      navigateToLogin,
      checkAppState: () => {},
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
