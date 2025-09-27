// src/extension/popup.tsx
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import Extension from './Extension';
import { UserProvider, useUserContext } from '../../context/UserContext';
import { LogIn, Sparkles, User, ExternalLink, Eye, EyeOff, ArrowLeft, Mail, Lock } from 'lucide-react';
import '../globals.css';
import { ConvexProvider } from 'convex/react';
import ConvexClientProvider, { convex } from '../convexClientProvider/page';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

const LoginForm = ({ onBack }: { onBack: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (error) {
        setError(error.message);
      } else if (data.session) {
        console.log('✅ Login successful');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupRedirect = () => {
    const signupUrl = 'https://job-genie-ai-chat-assistant.vercel.app/login';
    
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.create({ url: signupUrl });
      window.close();
    } else {
      window.open(signupUrl, '_blank');
      window.close();
    }
  };

  return (
    <div className="w-80 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="text-center">
        <div className="flex items-center mb-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white hover:bg-opacity-50 rounded-full transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <div className="flex-1 flex items-center justify-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="w-8"></div>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-2">Welcome Back</h1>
        <p className="text-gray-600 text-sm mb-6">
          Sign in to your JobGenie account
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              required
              disabled={isLoading}
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : (
              <LogIn className="w-5 h-5 mr-2" />
            )}
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-3 text-xs text-gray-500">or</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        <button
          onClick={handleSignupRedirect}
          className="w-full bg-white text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200 flex items-center justify-center border border-gray-200 shadow-sm"
        >
          Create New Account
          <ExternalLink className="w-4 h-4 ml-2" />
        </button>

        <p className="text-xs text-gray-500 mt-4">
          By signing in, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
};

const LoginPrompt = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);

  if (showLoginForm) {
    return <LoginForm onBack={() => setShowLoginForm(false)} />;
  }

  return (
    <div className="w-80 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="text-center">
        {/* Logo */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-2">JobGenie AI</h1>
        <p className="text-gray-600 text-sm mb-6">
          Your AI-powered career assistant
        </p>

        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border border-gray-200">
          <ul className="space-y-2 text-sm text-gray-700 text-left">
            <li className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              AI-powered job recommendations
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Smart resume building
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Career insights and tips
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Job application tracking
            </li>
          </ul>
        </div>

        {/* Login Button */}
        <button
          onClick={() => setShowLoginForm(true)}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
        >
          <LogIn className="w-5 h-5 mr-2" />
          Sign In to Continue
        </button>

        {/* Footer */}
        <p className="text-xs text-gray-500 mt-4">
          New to JobGenie? The sign-in form has a signup option
        </p>
      </div>
    </div>
  );
};

// Loading Component
const LoadingState = () => {
  return (
    <div className="w-80 bg-white p-6 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-600 text-sm">Checking authentication...</p>
      </div>
    </div>
  );
};

const DebugInfo = ({ user, loading }: { user: Session['user'] | null; loading: boolean }) => {
  const { signOut } = useUserContext();
  
  const handleManualRefresh = (): void => {
    console.log('🔄 Manual session refresh...');
    window.location.reload();
  };

  const handleCheckStorage = (): void => {
    console.log('🗄️ Checking local storage...');
    console.log('localStorage keys:', Object.keys(localStorage));

    const authKey = Object.keys(localStorage).find(key => 
      key.includes('supabase') || key.includes('auth')
    );
    
    if (authKey) {
      console.log('🔑 Auth key found:', authKey);
      console.log('🔑 Auth value:', localStorage.getItem(authKey));
    } else {
      console.log('❌ No auth keys found in localStorage');
    }

    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(null, (items) => {
        console.log('🔧 Chrome local storage:', items);
      });
    }
  };

  return (
    <div className="w-80 bg-yellow-50 p-4 border border-yellow-200">
      <h3 className="font-bold text-yellow-800 mb-2">Debug Info</h3>
      <div className="text-xs text-yellow-700 space-y-1 mb-3">
        <p>Loading: {loading.toString()}</p>
        <p>User exists: {(!!user).toString()}</p>
        <p>User email: {user?.email || 'null'}</p>
        <p>User ID: {user?.id || 'null'}</p>
        <p>Timestamp: {new Date().toISOString()}</p>
      </div>
      <div className="space-y-2">
        <button 
          onClick={handleManualRefresh}
          className="w-full bg-blue-500 text-white px-2 py-1 rounded text-xs"
        >
          Refresh Session
        </button>
        <button 
          onClick={handleCheckStorage}
          className="w-full bg-green-500 text-white px-2 py-1 rounded text-xs"
        >
          Check Storage
        </button>
        <button 
          onClick={signOut}
          className="w-full bg-red-500 text-white px-2 py-1 rounded text-xs"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

const ExtensionApp = () => {
  const { user, userData, loading } = useUserContext();

  useEffect(() => {
    console.log('ExtensionApp Auth Status:', {
      user: user,
      userExists: !!user,
      userData: userData,
      loading: loading,
      userEmail: user?.email,
      userId: user?.id
    });
  }, [user, userData, loading]);

  const showDebug = process.env.NODE_ENV === 'development';

  if (loading) {
    return (
      <div>
        <LoadingState />
        {showDebug && <DebugInfo user={user} loading={loading} />}
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <LoginPrompt />
        {showDebug && <DebugInfo user={user} loading={loading} />}
      </div>
    );
  }

  return (
    <div className="w-80">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 flex items-center">
        <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
          <User className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">
            {user.email?.split('@')[0] || 'User'}
          </p>
          <p className="text-xs text-blue-100">Connected</p>
        </div>
      </div>

      <Extension />

      {showDebug && <DebugInfo user={user} loading={loading} />}
    </div>
  );
};
const App = () => {
  return (
    <React.StrictMode>
      <ConvexProvider client={convex}>
        <UserProvider>
          <ExtensionApp />
        </UserProvider>
      </ConvexProvider>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);