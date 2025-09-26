"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/UserContext";
import Chat from "@/components/chat/Chat";
import { 
  MessageSquare, 
  FileText, 
  LogOut, 
  User, 
  Sparkles, 
  Plus,
  Briefcase,
  Target,
  TrendingUp,
  Bell,
  Settings,
  Loader2
} from "lucide-react";

export default function Home() {
  const { user, loading, signOut } = useUserContext();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const handleCreateResume = () => {
    router.push("/resume");
  };

  useEffect(() => {
    if ((!user) && !loading) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading your workspace...</h2>
          <p className="text-gray-600">Please wait while we set everything up</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Redirecting to login...</h2>
          <p className="text-gray-600">Taking you to the sign-in page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">JobGenie AI</h1>
                  <p className="text-xs text-gray-500">Your Career Assistant</p>
                </div>
              </div>
            </div>

            {/* Navigation & User Menu */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Settings */}
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>

              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">Premium Member</p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Sign Out Button */}
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-2">
                  Welcome back, {user.email?.split('@')[0] || 'there'}! 
                  <Sparkles className="inline-block w-8 h-8 text-yellow-300 ml-2" />
                </h2>
                <p className="text-blue-100 text-lg mb-6">
                  Your AI-powered career assistant is ready to help you land your dream job
                </p>
                
                {/* Quick Actions */}
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={handleCreateResume}
                    className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add resume
                  </button>
                  
                  <button className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-400 transition-colors">
                    <Target className="w-5 h-5 mr-2" />
                    Find Jobs
                  </button>
                  
                  <button className="inline-flex items-center px-6 py-3 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Career Insights
                  </button>
                </div>
              </div>
              
              {/* Illustration/Stats */}
              <div className="hidden lg:block ml-8">
                <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1">85%</div>
                    <div className="text-sm text-blue-100">Success Rate</div>
                  </div>
                  <div className="mt-4 flex space-x-4">
                    <div className="text-center">
                      <div className="text-xl font-semibold">12k+</div>
                      <div className="text-xs text-blue-100">Resumes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-semibold">5k+</div>
                      <div className="text-xs text-blue-100">Jobs Found</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">90% Faster</h3>
                <p className="text-sm text-gray-600">Ready to apply</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">24 Job Matches</h3>
                <p className="text-sm text-gray-600">Based on your profile</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">78% Match Rate</h3>
                <p className="text-sm text-gray-600">Above average</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 px-8 py-6">
            <div className="flex items-center">
              <MessageSquare className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">AI Career Assistant</h3>
                <p className="text-gray-600">Ask me anything about your career, job search, or resume</p>
              </div>
            </div>
          </div>
          
          <div className="p-0">
            <Chat />
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6">
            <h4 className="text-lg font-semibold text-green-900 mb-3">📚 Career Resources</h4>
            <ul className="space-y-2 text-green-800">
              <li>• Interview preparation guides</li>
              <li>• Salary negotiation tips</li>
              <li>• Industry insights and trends</li>
              <li>• Networking strategies</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
            <h4 className="text-lg font-semibold text-blue-900 mb-3">🚀 Recent Updates</h4>
            <ul className="space-y-2 text-blue-800">
              <li>• Enhanced AI resume analysis</li>
              <li>• New job matching algorithm</li>
              <li>• Cover letter templates added</li>
              <li>• Mobile app improvements</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}