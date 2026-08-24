"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Building2, Sparkles, ShieldCheck, ArrowRight, Cpu, 
  IndianRupee, Calculator, Zap, Award, 
  ChevronRight, Lock
} from "lucide-react";

export default function HomePage() {
  const [loanAmount, setLoanAmount] = useState(3500000);
  const [propertyValue, setPropertyValue] = useState(5000000);
  const [tenureYears, setTenureYears] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);

  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = tenureYears * 12;
  const emi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );

  const ltvRatio = propertyValue > 0 ? ((loanAmount / propertyValue) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-20 pb-0">
      
      {/* SECTION 1: HERO SECTION WITH BACKGROUND MARKETING VIDEO */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4 overflow-hidden rounded-b-[2.5rem] border-b border-slate-800">
        
        {/* Full-Width Background Marketing Video */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-slate-950">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="/hero-backdrop.jpg"
            className="w-full h-full object-cover scale-105 opacity-40 mix-blend-luminosity"
          >
            <source
              src="https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-and-data-41539-large.mp4"
              type="video/mp4"
            />
          </video>

          {/* Ambient Lighting Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/70 to-[#030712] backdrop-blur-[2px]"></div>
          <div className="gradient-glow-indigo"></div>
          <div className="gradient-glow-cyan"></div>
        </div>

        {/* Hero Content Overlay Container */}
        <div className="relative z-10 text-center max-w-4xl mx-auto py-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 text-cyan-300 text-xs font-semibold mb-6 shadow-lg shadow-cyan-500/10 backdrop-blur-md animate-pulse-glow">
            <Sparkles className="w-4 h-4 text-cyan-400" /> Automated Credit Bureau & Database BRE Engine
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-black text-white leading-tight tracking-tight">
            Smart Loan Approvals, <br />
            <span className="text-gradient-cyan">Instant Credit Evaluation</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mt-6 leading-relaxed">
            Evaluate Home Loans & Loans Against Property (LAP) in real-time. Powered by dynamic database rules, CIBIL credit score integration, and zero hardcoding.
          </p>

          {/* Primary Hero CTA */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/apply"
              className="w-full sm:w-auto px-9 py-4.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-cyan-500 to-emerald-400 hover:from-indigo-500 hover:to-cyan-400 text-white font-heading font-black text-base shadow-xl shadow-indigo-600/30 transition-all transform hover:scale-[1.04] flex items-center justify-center gap-2"
            >
              Check Eligibility Now <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/about"
              className="w-full sm:w-auto px-8 py-4.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-heading font-bold text-base border border-slate-700 backdrop-blur-md transition-all flex items-center justify-center gap-2"
            >
              <Cpu className="w-5 h-5 text-indigo-400" /> Explore BRE Specs
            </Link>
          </div>

          {/* Feature Badges */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center gap-3 backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-white text-xs block font-bold">Instant BRE Check</strong>
                <span className="text-[11px] text-slate-400">Sub-second evaluation</span>
              </div>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center gap-3 backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-white text-xs block font-bold">CIBIL API Score</strong>
                <span className="text-[11px] text-slate-400">Live score retrieval</span>
              </div>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center gap-3 backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-white text-xs block font-bold">Zero Duplicate Leads</strong>
                <span className="text-[11px] text-slate-400">Mobile duplicate check</span>
              </div>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center gap-3 backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-white text-xs block font-bold">100% Dynamic Rules</strong>
                <span className="text-[11px] text-slate-400">DB stored parameters</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: INTERACTIVE LIVE CALCULATOR WIDGET */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="glass-panel rounded-3xl p-8 lg:p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            
            {/* Left Inputs */}
            <div className="lg:w-7/12 space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
                  <Calculator className="w-4 h-4" /> Live Eligibility & EMI Simulator
                </div>
                <h2 className="text-2xl sm:text-3xl font-heading font-black text-white">
                  Estimate Your Monthly EMI & LTV
                </h2>
                <p className="text-xs text-slate-400 mt-1">Adjust sliders to see live loan ratio and repayment figures.</p>
              </div>

              {/* Loan Amount Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-semibold">Loan Amount Required</span>
                  <span className="text-cyan-400 font-bold font-mono text-sm">₹{loanAmount.toLocaleString("en-IN")}</span>
                </div>
                <input
                  type="range"
                  min={500000}
                  max={20000000}
                  step={100000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              {/* Property Value Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-semibold">Estimated Property Value</span>
                  <span className="text-emerald-400 font-bold font-mono text-sm">₹{propertyValue.toLocaleString("en-IN")}</span>
                </div>
                <input
                  type="range"
                  min={1000000}
                  max={30000000}
                  step={200000}
                  value={propertyValue}
                  onChange={(e) => setPropertyValue(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Tenure & Rate */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tenure (Years)</label>
                  <select
                    value={tenureYears}
                    onChange={(e) => setTenureYears(Number(e.target.value))}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs bg-slate-900"
                  >
                    <option value={10}>10 Years</option>
                    <option value={15}>15 Years</option>
                    <option value={20}>20 Years</option>
                    <option value={25}>25 Years</option>
                    <option value={30}>30 Years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Interest Rate (% p.a.)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Right Output Summary Card */}
            <div className="lg:w-5/12 bg-slate-950/90 rounded-2xl p-6 border border-slate-800 flex flex-col justify-between space-y-6 shadow-xl">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Estimated Monthly EMI
                </span>
                <div className="text-4xl font-heading font-black text-indigo-400">
                  ₹{emi.toLocaleString("en-IN")} <span className="text-xs font-sans text-slate-400 font-normal">/month</span>
                </div>
              </div>

              <div className="space-y-3 border-t border-slate-800 pt-4 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Loan to Value (LTV) Ratio</span>
                  <span className={`font-bold font-mono ${
                    parseFloat(ltvRatio) <= 80 ? "text-emerald-400" : "text-rose-400"
                  }`}>
                    {ltvRatio}%
                  </span>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      parseFloat(ltvRatio) <= 80 ? "bg-emerald-500" : "bg-rose-500"
                    }`}
                    style={{ width: `${Math.min(100, parseFloat(ltvRatio))}%` }}
                  ></div>
                </div>

                <span className="text-[11px] text-slate-400 block">
                  {parseFloat(ltvRatio) <= 80 
                    ? "✓ Meets maximum 80% LTV rule threshold" 
                    : "⚠️ Exceeds max 80% LTV rule cutoff"}
                </span>
              </div>

              <Link
                href="/apply"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs text-center transition-all shadow-lg shadow-indigo-600/20 block"
              >
                Apply for Loan Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: LOAN PRODUCTS SHOWCASE */}
      <section className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-2">Our Financial Products</span>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-white">Tailored Loan Solutions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Home Loan Card */}
          <div className="glass-panel rounded-3xl p-8 border border-slate-800 glass-panel-hover space-y-6 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Building2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-2xl font-heading font-bold text-white">Home Loan</h3>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                Purchase your dream house with minimal processing time, low interest rates, and flexible tenure options.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-900/80 p-4 rounded-2xl border border-slate-800 font-mono">
              <div>
                <span className="text-slate-400 block text-[11px]">Interest Rate</span>
                <strong className="text-emerald-400 text-sm">8.35% - 9.5% p.a.</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Max Tenure</span>
                <strong className="text-indigo-400 text-sm">30 Years</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Max LTV Limit</span>
                <strong className="text-white text-sm">80% Property</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">BRE Min Income</span>
                <strong className="text-amber-400 text-sm">₹30,000 / mo</strong>
              </div>
            </div>

            <Link
              href="/apply"
              className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300"
            >
              Apply for Home Loan <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Loan Against Property Card */}
          <div className="glass-panel rounded-3xl p-8 border border-slate-800 glass-panel-hover space-y-6 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <IndianRupee className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-2xl font-heading font-bold text-white">Loan Against Property (LAP)</h3>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                Unlock equity from your residential or commercial property for business expansion or personal needs.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-900/80 p-4 rounded-2xl border border-slate-800 font-mono">
              <div>
                <span className="text-slate-400 block text-[11px]">Interest Rate</span>
                <strong className="text-emerald-400 text-sm">9.25% - 10.8% p.a.</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Max Tenure</span>
                <strong className="text-indigo-400 text-sm">15 Years</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Max LTV Limit</span>
                <strong className="text-white text-sm">75% Property</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">BRE Min CIBIL</span>
                <strong className="text-amber-400 text-sm">700 Score</strong>
              </div>
            </div>

            <Link
              href="/apply"
              className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300"
            >
              Apply for LAP Loan <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 4: HOW BRE WORKS WORKFLOW */}
      <section className="max-w-6xl mx-auto px-4 space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-2">Automated Execution Pipeline</span>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-white">How MoneyBeing BRE Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-center space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold font-mono text-sm flex items-center justify-center mx-auto">01</div>
            <h4 className="text-sm font-bold text-white">Submit Details</h4>
            <p className="text-xs text-slate-400">Applicant fills personal & financial application details.</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-center space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white font-bold font-mono text-sm flex items-center justify-center mx-auto">02</div>
            <h4 className="text-sm font-bold text-white">Bureau Fetch</h4>
            <p className="text-xs text-slate-400">System queries Credit Bureau API to fetch customer's credit score.</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-center space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold font-mono text-sm flex items-center justify-center mx-auto">03</div>
            <h4 className="text-sm font-bold text-white">DB BRE Rules</h4>
            <p className="text-xs text-slate-400">Evaluates active DB rules (Age, Income, Credit Score, LTV limit).</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-center space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-bold font-mono text-sm flex items-center justify-center mx-auto">04</div>
            <h4 className="text-sm font-bold text-white">Instant Output</h4>
            <p className="text-xs text-slate-400">Returns Approved or Rejected with specific diagnostic reasons.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
