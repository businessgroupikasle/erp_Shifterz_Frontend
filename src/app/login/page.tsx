"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!username || !password) {
        setError("Username and password are required");
        setIsLoading(false);
        return;
      }

      // Call backend login endpoint
      const response = await login(username, password);

      if (response.token) {
        // Token is automatically stored in localStorage by login function
        // Redirect to dashboard
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Invalid username or password");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-500 flex items-center justify-center p-4">
      {/* Background shapes */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="text-5xl font-black text-yellow-500 font-['Outfit'] mb-2">SHIFTERZ</div>
            <p className="text-gray-600 text-sm">Professional Car Care Management</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 text-sm font-medium">⚠️ {error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username Field */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50 transition-colors"
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50 transition-colors"
                disabled={isLoading}
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-300 text-gray-900 font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="inline-block animate-spin">⏳</span>
                  Logging in...
                </>
              ) : (
                <>
                  <span>→</span>
                  Login
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials Info */}
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-xs text-gray-600 mb-2 font-semibold">📝 Demo Credentials:</p>
            <p className="text-xs text-gray-600">Username: <span className="font-mono bg-gray-100 px-2 py-1 rounded">admin</span></p>
            <p className="text-xs text-gray-600">Password: <span className="font-mono bg-gray-100 px-2 py-1 rounded">admin123</span></p>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              Shifterz Pro Suite v1.0
            </p>
            <p className="text-xs text-gray-400 mt-1">
              © 2026 Shifterz. All rights reserved.
            </p>
          </div>
        </div>

        {/* Connection Status */}
        <div className="mt-4 text-center">
          <p className="text-xs text-white opacity-70">
            🔗 Connecting to backend at localhost:5000
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
