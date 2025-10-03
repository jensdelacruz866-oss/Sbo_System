import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'President' | 'Auditor' | 'Secretary';

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  student_id: string | null;
  role: UserRole | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signInWithOAuth: (provider: 'google' | 'facebook') => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  assignRole: (role: UserRole) => Promise<{ error: any }>;
  fetchUserRole: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile fetch to avoid deadlock
          setTimeout(() => {
            fetchUserProfile(session.user.id);
            fetchUserRole(); // Also fetch user role
          }, 0);
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );
    
    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
        fetchUserRole(); // Also fetch user role
      }
      setIsLoading(false);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      
      // If profile doesn't exist yet, create it
      if (!data && user) {
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            user_id: userId,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            student_id: null,
            role: null
          })
          .select()
          .single();
        
        if (insertError) {
          console.error('Error creating profile:', insertError);
          return;
        }
        
        setProfile(newProfile);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  // NEW: Function to fetch user role from user_roles table
  const fetchUserRole = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching user role:', error);
        return;
      }
      
      // Update profile with role
      if (data && profile) {
        setProfile({
          ...profile,
          role: data.role
        });
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  // NEW: Function to refresh profile and role
  const refreshProfile = async () => {
    if (!user) return;
    
    await fetchUserProfile(user.id);
    await fetchUserRole();
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      },
    });
    return { error };
  };

  // NEW: Function for OAuth sign in
  const signInWithOAuth = async (provider: 'google' | 'facebook') => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectUrl,
      }
    });
    
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  const hasRole = (role: UserRole): boolean => {
    return profile?.role === role;
  };

  // NEW: Function to assign a role to the user
  const assignRole = async (role: UserRole) => {
    if (!user) return { error: { message: 'No user found' } };

    try {
      // Try INSERT first
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({ user_id: user.id, role });

      if (insertError) {
        // If duplicate (already has a row), fallback to UPDATE
        const duplicate =
          (insertError as any).code === '23505' ||
          /duplicate key|unique constraint/i.test((insertError as any).message || '');

        if (!duplicate) {
          return { error: insertError };
        }

        const { error: updateError } = await supabase
          .from('user_roles')
          .update({ role })
          .eq('user_id', user.id);

        if (updateError) {
          return { error: updateError };
        }
      }

      // Refresh profile to get the updated role
      await refreshProfile();
      return { error: null };
    } catch (error) {
      return { error } as any;
    }
  };

  const value = {
    user,
    session,
    profile,
    isAuthenticated: !!session,
    isLoading,
    signIn,
    signUp,
    signInWithOAuth,
    signOut,
    hasRole,
    assignRole,
    fetchUserRole,
    refreshProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}