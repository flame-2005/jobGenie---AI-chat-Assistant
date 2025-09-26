"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/UserContext";
import Chat from "@/components/chat/Chat";

export default function Home() {
  const { user, loading, signOut } = useUserContext(); // Add signOut here if available
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(); // Sign out the user
      router.push("/login"); // Redirect to login page
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };
  useEffect(() => {
    if ((!user ) && !loading) {
      router.push("/login"); // Redirect to login if not logged in
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center mt-20">Redirecting to login...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold underline">Welcome to best AI assistant for all you job needs
        </h1>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>
      <Chat />
    </div>
  );
}
