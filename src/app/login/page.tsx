"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import Image from "next/image";

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
    <div className="min-h-screen relative flex items-center justify-start p-8 md:py-24 md:pr-24 md:pl-40 lg:pl-48">
      {/* Background Image */}
      <Image 
        src="/login/login_bg.png" 
        alt="Login Background" 
        fill 
        priority
        className="object-cover z-0"
      />

      {/* Overlay to ensure readability */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm z-0"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-lg">
        <div className="bg-transparent backdrop-blur-3xl rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] p-8 md:p-10 border border-white/10 border-t-white/30 border-l-white/30">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="text-5xl font-black text-yellow-500 font-['Outfit'] mb-2">SHIFTERZ</div>
            <p className="text-gray-400 text-sm">Professional Car Care Management</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/50 border border-red-500/50 rounded-lg p-4 mb-6">
              <p className="text-red-200 text-sm font-medium">⚠️ {error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username Field */}
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wide mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-3 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-white/5 backdrop-blur-md text-white placeholder-gray-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] transition-colors"
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wide mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-white/5 backdrop-blur-md text-white placeholder-gray-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] transition-colors"
                disabled={isLoading}
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-600 text-gray-900 font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
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
          <div className="mt-6 p-4 bg-white/5 backdrop-blur-md rounded-lg border border-white/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">
            <p className="text-xs text-yellow-500 mb-2 font-semibold">📝 Demo Credentials:</p>
            <p className="text-xs text-gray-300">Username: <span className="font-mono bg-white/5 border border-white/10 px-2 py-1 rounded shadow-inner">admin</span></p>
            <p className="text-xs text-gray-300">Password: <span className="font-mono bg-white/5 border border-white/10 px-2 py-1 rounded shadow-inner">admin123</span></p>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-800 text-center">
            <p className="text-xs text-gray-500">
              Shifterz Pro Suite v1.0
            </p>
            <p className="text-xs text-gray-600 mt-1">
              © 2026 Shifterz. All rights reserved.
            </p>
          </div>
        </div>

        {/* Connection Status */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400 opacity-70">
            🔗 Connecting to backend at localhost:5000
          </p>
        </div>
      </div>

    </div>
  );
}
