"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, KeyRound, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Invalid admin credentials");
      } else {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("role", data.role);

        // Redirect Admin directly to List Leads Page
        router.push("/admin/leads");
      }
    } catch (err: any) {
      setError("Unable to connect to authentication server.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFillAdmin = () => {
    setUsername("admin");
    setPassword("admin123");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md glass-panel rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        
        {/* Top Glowing Orb */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3 text-indigo-400 shadow-lg shadow-indigo-500/10">
            <ShieldCheck className="w-7 h-7 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-heading font-black text-white">Admin Authentication Portal</h2>
          <p className="text-xs text-slate-400 mt-1">Sign in with administrator credentials to manage leads and BRE rules</p>
        </div>

        {error && (
          <div className="mb-6 bg-rose-500/10 border border-rose-500/30 p-3.5 rounded-2xl flex items-center gap-2 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Admin Username</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full glass-input pl-10 pr-3 py-3 rounded-xl text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Admin Password</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass-input pl-10 pr-3 py-3 rounded-xl text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 transform hover:scale-[1.01]"
          >
            {loading ? "Authenticating..." : <>Sign In to Admin Panel <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        {/* Quick Fill Admin Button */}
        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <button
            onClick={handleQuickFillAdmin}
            className="text-xs text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 px-4 py-2 rounded-xl border border-indigo-500/30 font-medium inline-flex items-center gap-1.5 transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Auto-fill Demo Admin Credentials (admin / admin123)
          </button>
        </div>
      </div>
    </div>
  );
}
