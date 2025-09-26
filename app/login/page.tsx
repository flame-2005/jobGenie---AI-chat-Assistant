"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const createUser = useMutation(api.user.createUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  // Password validation
  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return "Password must be at least 8 characters long";
    }
    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter";
    }
    if (!hasLowerCase) {
      return "Password must contain at least one lowercase letter";
    }
    if (!hasNumbers) {
      return "Password must contain at least one number";
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one special character";
    }
    return "";
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (value && errors.email) {
      const emailError = validateEmail(value);
      setErrors(prev => ({ ...prev, email: emailError }));
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (value && errors.password && isSignup) {
      const passwordError = validatePassword(value);
      setErrors(prev => ({ ...prev, password: passwordError }));
    }
    if (confirmPassword && value !== confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
    } else if (confirmPassword && value === confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: "" }));
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (value !== password) {
      setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
    } else {
      setErrors(prev => ({ ...prev, confirmPassword: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;

    if (isSignup) {
      const passwordError = validatePassword(password);
      if (passwordError) newErrors.password = passwordError;

      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    } else {
      if (!password) newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setErrors(prev => ({ ...prev, general: "" }));

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

      if (!user) throw new Error("Authentication failed");

      await createUser({
        email: user.email!,
        username: user.user_metadata?.name || email.split("@")[0],
      });

      if (user.user_metadata.email_verified === true) {
        router.push('/');
      } else if (isSignup) {
        setErrors(prev => ({
          ...prev,
          general: "Please check your email and click the verification link to complete registration."
        }));
      }
    } catch (err: unknown) {
      console.error("Authentication error:", err);

      let errorMessage = "An unexpected error occurred";

      // ✅ Narrowing to check if `err` is an object and has a string `message`
      if (err && typeof err === "object" && "message" in err) {
        const message = String((err as { message: unknown }).message);

        if (message.includes("Invalid login credentials")) {
          errorMessage = "Invalid email or password";
        } else if (message.includes("Email not confirmed")) {
          errorMessage = "Please verify your email address before signing in";
        } else if (message.includes("User already registered")) {
          errorMessage = "An account with this email already exists";
        } else if (message.includes("Password should be at least")) {
          errorMessage = "Password does not meet requirements";
        } else if (message.includes("Signup requires")) {
          errorMessage = "Email signup is currently disabled";
        } else {
          errorMessage = message;
        }
      }

      setErrors(prev => ({ ...prev, general: errorMessage }));
    }
    finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setErrors({});
    setPassword("");
    setConfirmPassword("");
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">JobGenie AI Chat</h1>
          <p className="text-gray-600">
            {isSignup ? "Create your account to get started" : "Welcome back! Please sign in"}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Error */}
            {errors.general && (
              <div className={`flex items-center gap-3 p-4 rounded-lg ${errors.general.includes("verification") || errors.general.includes("verify")
                  ? "bg-blue-50 border border-blue-200"
                  : "bg-red-50 border border-red-200"
                }`}>
                {errors.general.includes("verification") || errors.general.includes("verify") ? (
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                )}
                <p className={`text-sm ${errors.general.includes("verification") || errors.general.includes("verify")
                    ? "text-blue-700"
                    : "text-red-700"
                  }`}>
                  {errors.general}
                </p>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.email ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                  required
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={isSignup ? "Create a strong password" : "Enter your password"}
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.password ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </p>
              )}

              {/* Password Strength Indicator (only for signup) */}
              {isSignup && password && (
                <div className="space-y-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-2 rounded-full flex-1 ${level <= passwordStrength
                            ? strengthColors[passwordStrength - 1]
                            : "bg-gray-200"
                          }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600">
                    Password strength: {passwordStrength > 0 ? strengthLabels[passwordStrength - 1] : "Too weak"}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password Field (only for signup) */}
            {isSignup && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.confirmPassword ? "border-red-300 bg-red-50" : "border-gray-300"
                      }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : (
                isSignup ? "Create Account" : "Sign In"
              )}
            </button>
          </form>

          {/* Toggle between login and signup */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={toggleMode}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              {isSignup ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>

        {/* Password Requirements (only shown during signup) */}
        {isSignup && (
          <div className="mt-4 bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</h3>
            <ul className="space-y-1 text-xs text-gray-600">
              <li className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`} />
                At least 8 characters long
              </li>
              <li className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                One uppercase letter
              </li>
              <li className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${/[a-z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                One lowercase letter
              </li>
              <li className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${/\d/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                One number
              </li>
              <li className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                One special character
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}