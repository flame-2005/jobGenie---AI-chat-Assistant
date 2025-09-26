"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const createUser = useMutation(api.user.createUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let user;
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/onboarding`
          }
        });
        if (error) throw error;
        user = data.user;
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        user = data.user;
      }
      if (!user) throw new Error("User not found");
      await createUser({
        email: user.email!,
        username: user.user_metadata?.name || email.split("@")[0],
      });
      if (user.user_metadata.email_verified === true) {
        router.push('/')
      }
    } catch (err) {
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">JobGenie AI Chat</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-80 bg-white p-6 rounded-lg shadow"
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-2 border rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {loading ? "Processing..." : isSignup ? "Sign Up" : "Login"}
        </button>
        <p
          className="text-sm text-blue-600 cursor-pointer mt-2"
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
        </p>
      </form>
    </div>
  );
}
