import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Store } from '../types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  store: Store | null;
  loading: boolean;
  signUp: (email: string, password: string, storeData: Partial<Store>) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshStore: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchStore(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchStore(session.user.id);
        } else {
          setStore(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchStore = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No store found - this is ok for new users
          console.log('No store found for user:', userId);
          setStore(null);
          return;
        }
        throw error;
      }

      setStore(data);
    } catch (error) {
      console.error('Error fetching store:', error);
      setStore(null);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, storeData: Partial<Store>) => {
    setLoading(true);
    try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    });

    if (authError) throw authError;

    if (authData.user) {
      // Create store record
        const { data: newStore, error: storeError } = await supabase
        .from('stores')
        .insert({
          user_id: authData.user.id,
            name: storeData.name || '',
          email: email,
            phone: storeData.phone || '',
            whatsapp_number: storeData.whatsapp_number || '',
          subscription_status: 'inactive',
          subscription_expires_at: null
        })
        .select()
        .single();

      if (storeError) throw storeError;
      
      // Set the store data immediately if user is confirmed
      if (authData.user.email_confirmed_at) {
          setStore(newStore);
      }
    }
    } catch (error) {
      console.error('SignUp error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
      
      // The auth state change will handle fetching the store
    } catch (error) {
      console.error('SignIn error:', error);
      throw error;
    } finally {
      // Don't set loading to false here - let the auth state change handle it
    }
  };

  const signOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('SignOut error:', error);
      throw error;
    }
    setLoading(false);
  };

  const refreshStore = async () => {
    if (user) {
      setLoading(true);
      await fetchStore(user.id);
    }
  };

  const value = {
    user,
    session,
    store,
    loading,
    signUp,
    signIn,
    signOut,
    refreshStore,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};