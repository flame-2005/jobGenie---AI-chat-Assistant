"use client";

import { useEffect } from "react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../convex/_generated/api";
import { useUserContext } from "@/context/UserContext";
import { ResumeForm } from "@/components/resumeForm/Resume";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, userData, loading } = useUserContext();
  const setOnboarded = useMutation(api.user.setOnboarded);

  // Redirect if user is already onboarded
  useEffect(() => {
    if (!loading && user && userData?.isOnboarded) {
      router.push("/"); // Already onboarded → go to home
    }
  }, [user, userData, loading, router]);

  const handleCompleteOnboarding = async () => {
    if (!user?.email) {
      console.error("User email is not available.");
      return;
    }

    try {
      await setOnboarded({ email: user.email });
      router.push("/"); // Redirect to home after completing onboarding
    } catch (error) {
      console.error("Failed to complete onboarding", error);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">One Last Step!</h1>
      <ResumeForm handleCompleteOnboarding={handleCompleteOnboarding}/>
    </div>
  );
}
