import Link from "next/link";
import { Cpu, ShieldCheck, Database, Zap, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

export default function AboutBREPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 space-y-16">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          <Cpu className="w-4 h-4 text-indigo-400" /> Business Rule Engine Architecture
        </div>
        <h1 className="text-4xl md:text-6xl font-heading font-black text-white leading-tight">
          How the <span className="text-gradient-cyan">BRE Engine</span> Powers Instant Approvals
        </h1>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed">
          Discover how MoneyBeing evaluates loan eligibility in milliseconds using dynamic database-driven rules, automated credit score retrieval, and zero hardcoded logic.
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 glass-panel-hover space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Database className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-heading font-bold text-white">Database-Driven Rules</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Rules are stored dynamically in the <code className="text-indigo-300">bre_rules</code> DB table. Risk managers can update parameters without editing backend code or redeploying.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-slate-800 glass-panel-hover space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-heading font-bold text-white">Automated Bureau Fetch</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Integrates with Credit Bureau APIs (CIBIL equivalent) with failover simulation logic to retrieve live credit scores for each applicant.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-slate-800 glass-panel-hover space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-heading font-bold text-white">Detailed Rejection Feedback</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            When an application is rejected, BRE returns exact diagnostic messages pinpointing which rule threshold failed (e.g. LTV &gt; 80% or Income &lt; ₹30,000).
          </p>
        </div>
      </div>

      {/* Default Active Rules Table Overview */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-heading font-bold text-white">Live Standard Rule Specs</h3>
            <p className="text-xs text-slate-400 mt-1">Pre-configured baseline rules evaluated during applicant submission</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            5 Active Rules
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-semibold">Minimum & Maximum Applicant Age</strong>
              <span className="text-slate-400">Applicant must be between 21 and 60 years old at time of application.</span>
            </div>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-semibold">Minimum Monthly Income</strong>
              <span className="text-slate-400">Net monthly income must be at least ₹30,000 INR.</span>
            </div>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-semibold">Minimum Credit Score</strong>
              <span className="text-slate-400">Credit bureau score must meet or exceed 700.</span>
            </div>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-semibold">Loan-to-Value (LTV) Cap</strong>
              <span className="text-slate-400">Requested loan amount cannot exceed 80% of estimated property value.</span>
            </div>
          </div>
        </div>

        <div className="pt-4 text-center">
          <Link
            href="/apply"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all"
          >
            Test Your Eligibility Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
