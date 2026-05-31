"use client";

import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { KeyRound, User, Lock, AlertCircle, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("sz_token");
    if (token) window.location.href = "/";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await api.login(username, password);
      localStorage.setItem("sz_token", response.token);
      setTimeout(() => { window.location.href = "/"; }, 500);
    } catch (err: any) {
      setError(err.message || "Failed to log in. Please check your credentials.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: "#06060c" }}>
      {/* Ambient glow blobs */}
      <div
        className="absolute top-1/4 left-1/4 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full blur-[120px] opacity-[0.15] pointer-events-none"
        style={{
          background: "radial-gradient(circle, var(--accent) 0%, rgba(240,165,0,0) 70%)",
          animation: "ambientPulse 10s infinite alternate ease-in-out",
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] rounded-full blur-[100px] opacity-[0.12] pointer-events-none"
        style={{
          background: "radial-gradient(circle, #3b82f6 0%, rgba(59,130,246,0) 70%)",
          animation: "ambientPulse 12s infinite alternate-reverse ease-in-out",
        }}
      />

      {/* Dot-grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Full-viewport bordered panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-3 sm:inset-5 z-10 rounded-2xl sm:rounded-3xl border flex flex-col items-center justify-center overflow-auto"
        style={{
          background: "rgba(10, 10, 18, 0.82)",
          borderColor: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          boxShadow: "0 0 0 1px rgba(255,255,255,0.03) inset, 0 32px 80px rgba(0,0,0,0.5)",
        }}
      >
        <div className="w-full max-w-sm px-6 py-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center text-center gap-3 mb-8"
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm relative overflow-hidden group cursor-default"
              style={{ background: "var(--accent-gradient)", color: "#05050a" }}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
              <KeyRound size={20} className="relative z-10" />
            </div>
            <div className="mt-1">
              <h1
                className="text-2xl font-black tracking-tight text-white uppercase"
                style={{ fontFamily: "var(--font-syne)" }}
              >
                Shifterz Pro
              </h1>
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase mt-0.5" style={{ color: "var(--text3)" }}>
                Workshop Operations Suite
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            <hr className="border-t border-dashed mb-8" style={{ borderColor: "var(--border)" }} />

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Username */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text3)" }}>
                  Admin Username
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--text3)" }}>
                    <User size={15} />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                    className="w-full rounded-xl border text-sm transition-all focus:border-(--accent)"
                    style={{
                      background: "rgba(12,12,18,0.5)",
                      borderColor: "rgba(255,255,255,0.08)",
                      paddingLeft: "2.5rem",
                      paddingRight: "1rem",
                      paddingTop: "0.625rem",
                      paddingBottom: "0.625rem",
                    }}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text3)" }}>
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--text3)" }}>
                    <Lock size={15} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full rounded-xl border text-sm transition-all focus:border-(--accent)"
                    style={{
                      background: "rgba(12,12,18,0.5)",
                      borderColor: "rgba(255,255,255,0.08)",
                      paddingLeft: "2.5rem",
                      paddingRight: "2.5rem",
                      paddingTop: "0.625rem",
                      paddingBottom: "0.625rem",
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors hover:text-white"
                    style={{ color: "var(--text3)" }}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    key="err"
                    initial={{ opacity: 0, height: 0, y: -8 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs border"
                      style={{
                        background: "rgba(239,68,68,0.05)",
                        borderColor: "rgba(239,68,68,0.15)",
                        color: "var(--danger)",
                      }}
                    >
                      <AlertCircle size={14} className="shrink-0" />
                      <span>{error}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full h-11 rounded-xl flex items-center justify-center gap-2 text-sm font-bold cursor-pointer relative overflow-hidden transition-all bg-(--accent) text-black"
                style={{ boxShadow: "0 4px 20px rgba(240,165,0,0.2)" }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    <span>Access Terminal</span>
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-[10px] mt-8" style={{ color: "var(--text3)" }}>
              Authorized personnel only. Access logging is active.
            </p>
          </motion.div>
        </div>
      </motion.div>

      <style jsx global>{`
        @keyframes ambientPulse {
          0% { transform: scale(1) translate(0px, 0px); }
          100% { transform: scale(1.1) translate(20px, -20px); }
        }
      `}</style>
    </div>
  );
}
