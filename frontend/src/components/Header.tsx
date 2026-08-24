"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Building2, ShieldCheck, FileText, Sliders, LogIn, 
  LogOut, Sparkles, Cpu, LayoutDashboard, User, Menu, X 
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check local storage for auth credentials
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");
    setToken(storedToken);
    setUsername(storedUser);
    setRole(storedRole);

    // Health check FastAPI backend
    fetch(`${API_BASE_URL}/`)
      .then((res) => {
        if (res.ok) setIsBackendHealthy(true);
        else setIsBackendHealthy(false);
      })
      .catch(() => setIsBackendHealthy(false));
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setToken(null);
    setUsername(null);
    setRole(null);
    router.push("/login");
  };

  const isAdmin = token && (role === "admin" || pathname.startsWith("/admin"));

  return (
    <header className={`sticky top-0 z-50 glass-panel border-b transition-all backdrop-blur-xl ${
      isAdmin ? "border-indigo-500/30 bg-slate-950/90" : "border-slate-800/80"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href={isAdmin ? "/admin/dashboard" : "/"} className="flex items-center gap-3 group">
          <div className={`w-11 h-11 rounded-2xl p-[1.5px] shadow-lg transition-transform group-hover:scale-105 ${
            isAdmin 
              ? "bg-gradient-to-tr from-indigo-600 via-purple-500 to-emerald-400 shadow-indigo-500/30" 
              : "bg-gradient-to-tr from-indigo-600 via-cyan-500 to-emerald-400 shadow-indigo-500/20"
          }`}>
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              {isAdmin ? (
                <ShieldCheck className="w-5 h-5 text-indigo-400 group-hover:text-emerald-400 transition-colors" />
              ) : (
                <Building2 className="w-5 h-5 text-indigo-400 group-hover:text-cyan-400 transition-colors" />
              )}
            </div>
          </div>
          <div>
            <span className="text-2xl font-heading font-black tracking-tight text-white flex items-center gap-1.5">
              MoneyBeing 
              <span className={`text-xs font-sans px-2 py-0.5 rounded-full border font-bold ${
                isAdmin 
                  ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40" 
                  : "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
              }`}>
                {isAdmin ? "Admin Portal" : "Hub"}
              </span>
            </span>
            <span className="block text-[10px] tracking-wider uppercase font-semibold text-slate-400">
              {isAdmin ? "Executive Control & BRE Management" : "Loan Approvals & BRE Engine"}
            </span>
          </div>
        </Link>

        {/* Dynamic Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
          {isAdmin ? (
            /* ADMIN LOGGED-IN HEADER NAV LINKS */
            <>
              <Link
                href="/admin/dashboard"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  pathname === "/admin/dashboard"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" /> Dashboard
              </Link>

              <Link
                href="/admin/leads"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  pathname === "/admin/leads"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-emerald-400" /> Leads Management
              </Link>

              <Link
                href="/admin/rules"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  pathname === "/admin/rules"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-amber-400" /> BRE Management
              </Link>
            </>
          ) : (
            /* PUBLIC / GUEST HEADER NAV LINKS */
            <>
              <Link
                href="/"
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  pathname === "/"
                    ? "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                Home
              </Link>

              <Link
                href="/apply"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  pathname === "/apply"
                    ? "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Apply Now
              </Link>

              <Link
                href="/about"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  pathname === "/about"
                    ? "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Cpu className="w-3.5 h-3.5 text-indigo-400" /> BRE Engine
              </Link>
            </>
          )}
        </nav>

        {/* Header Right Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {/* API Health Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-medium bg-slate-900/90 border border-slate-800">
            {isBackendHealthy === true ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-emerald-400 font-bold">API Online</span>
              </>
            ) : isBackendHealthy === false ? (
              <>
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span className="text-rose-400 font-bold">API Offline</span>
              </>
            ) : (
              <span className="text-slate-400">Connecting...</span>
            )}
          </div>

          {token ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3.5 py-1.5 rounded-xl border flex items-center gap-1.5 bg-indigo-500/20 text-indigo-300 border-indigo-500/40">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Admin: {username || "admin"}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-lg shadow-indigo-500/25 transition-all transform hover:scale-[1.02]"
              >
                <LogIn className="w-3.5 h-3.5" /> Admin Login
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/95 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
          {isAdmin ? (
            <>
              <Link
                href="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-indigo-300 hover:bg-slate-900"
              >
                📊 Dashboard
              </Link>
              <Link
                href="/admin/leads"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-emerald-400 hover:bg-slate-900"
              >
                📋 Leads Management
              </Link>
              <Link
                href="/admin/rules"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-amber-400 hover:bg-slate-900"
              >
                ⚙️ BRE Management
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-900"
              >
                Home
              </Link>
              <Link
                href="/apply"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-cyan-400 hover:bg-slate-900"
              >
                Apply Now
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-indigo-400 hover:bg-slate-900"
              >
                BRE Engine Specs
              </Link>
            </>
          )}

          <div className="pt-3 border-t border-slate-800">
            {token ? (
              <button
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white"
              >
                Admin Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
