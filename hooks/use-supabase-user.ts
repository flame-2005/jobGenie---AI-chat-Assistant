"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { User } from "@supabase/supabase-js";

export function useSupabaseUser() {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This async function gets the initial user data.
    const getInitialUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
    };

    // Run the function to get the initial user.
    getInitialUser();

    // Set up a listener for any auth changes.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // The cleanup function for the listener.
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  return { user, isLoading };
}