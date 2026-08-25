"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, KeyRound, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
        router.push("/admin/dashboard");
      }
    } catch (err: any) {
      setError("Unable to connect to authentication service.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    setUsername("admin");
    setPassword("admin123");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md glass-panel rounded-2xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3 text-indigo-400">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-white">Admin Login Portal</h2>
          <p className="text-xs text-slate-400 mt-1">Access MoneyBeing Lead & BRE Control Panel</p>
        </div>

        {error && (
          <div className="mb-6 bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl flex items-center gap-2 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Username</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full glass-input pl-9 pr-3 py-2.5 rounded-xl text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass-input pl-9 pr-3 py-2.5 rounded-xl text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
          >
            {loading ? "Authenticating..." : <>Login to Admin Panel <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        {/* Demo Quick-Fill Pill */}
        <div className="mt-6 pt-6 border-t border-slate-800 text-center">
          <button
            onClick={handleQuickFill}
            className="text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20 font-medium inline-flex items-center gap-1.5 transition-all"
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Auto-fill Demo Credentials (admin / admin123)
          </button>
        </div>
      </div>
    </div>
  );
}
