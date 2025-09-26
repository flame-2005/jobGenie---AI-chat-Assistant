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
  signOut: async () => { },
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const userData = useQuery(
    api.user.getUser,
    user?.email ? { email: user.email } : "skip"
  );
  


  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ user, userData, loading, signOut }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext);
