"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { User } from "@supabase/supabase-js";
import { Id } from "@/convex/_generated/dataModel";

type ConvexUser = {
  _id: Id<"users">;
  _creationTime: number;
  email: string;
  username: string;
  isOnboarded: boolean;
  createdAt: number;
} | null;

type UserContextType = {
  user: User | null;
  userData: ConvexUser | undefined;
  loading: boolean;
  signOut: () => Promise<void>;
};

const UserContext = createContext<UserContextType>({
  user: null,
  userData: undefined,
  loading: true,
  signOut: async () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    const restoreSession = async () => {
      try {
        console.log('🔍 Checking session...');
        console.log('🌐 Current URL:', window.location.href);
        // Add timeout to prevent infinite loading
        timeoutId = setTimeout(() => {
          console.warn('⏰ Session check timeout');
          if (mounted) {
            setUser(null);
            setSessionChecked(true);
            setLoading(false);
          }
        }, 10000);

        const { data, error } = await supabase.auth.getSession();
        
        clearTimeout(timeoutId);

        console.log('📋 Raw session data:', {
          session: data?.session,
          user: data?.session?.user,
          accessToken: data?.session?.access_token ? 'exists' : 'null',
          refreshToken: data?.session?.refresh_token ? 'exists' : 'null'
        });

        if (error) {
          console.error("❌ Error restoring session:", error);
        }

        if (mounted) {
          const sessionUser = data?.session?.user ?? null;
          console.log('👤 Setting user:', sessionUser?.email || 'null');
          console.log('🕐 Session expires at:', data?.session?.expires_at ? new Date(data.session.expires_at * 1000) : 'null');
          setUser(sessionUser);
          setSessionChecked(true);
        }
      } catch (err) {
        console.error("💥 Failed to get session:", err);
        if (mounted) {
          setUser(null);
          setSessionChecked(true);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Check if we're in an extension environment
    const isExtension = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id;
    console.log('🔧 Environment:', isExtension ? 'Extension' : 'Web');

    restoreSession();

    // Set up auth state listener
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event, session?.user?.email || 'null');
      
      if (mounted) {
        setUser(session?.user || null);
        
        // In extension environment, we might need to refresh the popup
        if (isExtension && event === 'SIGNED_IN') {
          console.log('✅ User signed in, refreshing extension...');
          // Optional: Close and reopen popup or send message to background script
        }
      }
    });

    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
      listener.subscription.unsubscribe();
    };
  }, []);

  // Use query with proper skip condition
  const userData = useQuery(
    api.user.getUser,
    user?.email && sessionChecked ? { email: user.email } : "skip"
  );

  const signOut = async () => {
    console.log('🚪 Signing out...');
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      console.log('✅ Signed out successfully');
    } catch (error) {
      console.error("❌ Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add debug logging
  useEffect(() => {
    console.log('UserContext state:', {
      user: user?.email || 'null',
      userData: userData?._id || 'null',
      loading,
      sessionChecked
    });
  }, [user, userData, loading, sessionChecked]);

  return (
    <UserContext.Provider value={{ user, userData, loading, signOut }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext);