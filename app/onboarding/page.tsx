"use client";

import { useEffect } from "react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../convex/_generated/api";
import { useUserContext } from "@/context/UserContext";
import { ResumeForm } from "@/components/resumeForm/Resume";
import { FileText, CheckCircle, Loader2, Sparkles } from "lucide-react";

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Setting things up...</h2>
          <p className="text-gray-600">Please wait while we prepare your workspace</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header Section */}
      <div className="pt-12 pb-8">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Logo/Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6 shadow-lg">
              <FileText className="w-10 h-10 text-white" />
            </div>
            
            {/* Welcome Message */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to JobGenie AI! 
              <Sparkles className="inline-block w-8 h-8 text-yellow-500 ml-2" />
            </h1>
            
            <div className="max-w-2xl mx-auto">
              <p className="text-xl text-gray-600 mb-2">
                You&apos;re just one step away from unlocking your career potential
              </p>
              <p className="text-gray-500">
                Let&apos;s create your professional profile to get personalized job recommendations and AI-powered career insights
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center justify-center mt-8 mb-8">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">Account Created</span>
                </div>
                
                <div className="w-12 h-0.5 bg-gray-300"></div>
                
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center animate-pulse">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <span className="ml-2 text-sm font-medium text-blue-600">Profile Setup</span>
                </div>
                
                <div className="w-12 h-0.5 bg-gray-300"></div>
                
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-500">Get Started</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-12">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          {/* Form Container */}


            {/* Form Content */}
            <div className="p-8">
              <ResumeForm handleCompleteOnboarding={handleCompleteOnboarding} />
            </div>

          {/* Benefits Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Matching</h3>
              <p className="text-sm text-gray-600">
                Get personalized job recommendations based on your skills and experience
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Smart Resume Building</h3>
              <p className="text-sm text-gray-600">
                Create tailored resumes for different positions with AI assistance
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Career Insights</h3>
              <p className="text-sm text-gray-600">
                Receive actionable advice to advance your career and land your dream job
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              🔒 Your information is secure and will only be used to improve your job search experience
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}