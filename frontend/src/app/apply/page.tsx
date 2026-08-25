"use client";

import { useState } from "react";
import { 
  Building2, User, Phone, Mail, Calendar, MapPin, 
  IndianRupee, Briefcase, CheckCircle2, XCircle, AlertTriangle, 
  ArrowRight, ShieldCheck, RefreshCw, Calculator, Sparkles
} from "lucide-react";

import { API_BASE_URL } from "@/lib/api";

interface BREOutput {
  status: string;
  lead_id?: number;
  credit_score?: number;
  bre_status?: string;
  rejection_reasons?: string[];
  message?: string;
}

export default function ApplyPage() {
  const [formData, setFormData] = useState({
    full_name: "",
    mobile: "",
    email: "",
    dob: "",
    city: "",
    pincode: "",
    loan_type: "Home Loan",
    employment_type: "Salaried",
    monthly_income: "",
    loan_amount: "",
    property_value: "",
    consent: true,
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<BREOutput | null>(null);

  // Live Loan-to-Value (LTV) Calculation
  const loanAmt = parseFloat(formData.loan_amount) || 0;
  const propVal = parseFloat(formData.property_value) || 0;
  const ltvRatio = propVal > 0 ? ((loanAmt / propVal) * 100).toFixed(1) : "0";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          monthly_income: parseFloat(formData.monthly_income),
          loan_amount: parseFloat(formData.loan_amount),
          property_value: parseFloat(formData.property_value),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Module 8: Handle Duplicate Lead or validation errors
        setErrorMessage(data.detail || data.message || "Failed to submit loan application");
      } else {
        setResult(data);
      }
    } catch (err: any) {
      setErrorMessage(`Network error: Unable to reach API server at ${API_BASE_URL}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header Banner */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
          <Sparkles className="w-4 h-4 text-cyan-400" /> Automated Credit Bureau & BRE Evaluation
        </div>
        <h1 className="text-3xl md:text-5xl font-heading font-black text-white">
          Apply for Instant Loan Approval
        </h1>
        <p className="text-slate-400 mt-2 text-sm md:text-base max-w-2xl mx-auto">
          Fill in your parameters below to evaluate eligibility against active Business Rules & CIBIL score.
        </p>
      </div>

      {/* Result Card Modal / View */}
      {result ? (
        <div className="glass-panel rounded-3xl p-6 md:p-10 border border-slate-700/80 shadow-2xl animate-pulse-glow max-w-3xl mx-auto">
          {result.bre_status === "Eligible" ? (
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-500/20 border-2 border-emerald-500/50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400 shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                APPLICATION APPROVED
              </span>
              <h2 className="text-3xl font-heading font-black text-white mt-3">You are Eligible 🎉</h2>
              <p className="text-slate-300 text-sm mt-2">
                Your loan application successfully passed all active Business Rules & Credit Bureau cutoffs.
              </p>

              {/* Stat Pills */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
                  <span className="text-xs text-slate-400 font-medium">Lead Reference ID</span>
                  <div className="text-2xl font-black text-indigo-400 mt-1">#{result.lead_id}</div>
                </div>
                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
                  <span className="text-xs text-slate-400 font-medium">Fetched Credit Score</span>
                  <div className="text-2xl font-black text-emerald-400 mt-1">{result.credit_score}</div>
                </div>
                <div className="col-span-2 md:col-span-1 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
                  <span className="text-xs text-slate-400 font-medium">BRE Status</span>
                  <div className="text-2xl font-black text-emerald-400 mt-1">Eligible</div>
                </div>
              </div>

              <div className="bg-emerald-950/40 border border-emerald-500/30 p-4 rounded-2xl text-left text-xs text-emerald-200 mb-6">
                <strong className="block text-emerald-400 font-semibold mb-1">Next Steps:</strong>
                Our partner banking executive will contact you within 24 hours to collect physical income documents.
              </div>

              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold mx-auto transition-all shadow-lg shadow-indigo-600/30"
              >
                <RefreshCw className="w-4 h-4" /> Submit Another Application
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 bg-rose-500/20 border-2 border-rose-500/50 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-400 shadow-lg shadow-rose-500/20">
                <XCircle className="w-10 h-10" />
              </div>
              <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40">
                NOT ELIGIBLE
              </span>
              <h2 className="text-3xl font-heading font-black text-white mt-3">Loan Application Rejected</h2>
              <p className="text-slate-300 text-sm mt-2">
                Your application did not satisfy active Business Rule Engine criteria.
              </p>

              {/* Credit Score Pill */}
              <div className="my-6 inline-flex items-center gap-4 bg-slate-900/90 px-6 py-3 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400 font-medium">Fetched Credit Score:</span>
                <span className="text-2xl font-black text-amber-400">{result.credit_score}</span>
              </div>

              {/* Rejection Reasons Box */}
              <div className="bg-rose-950/30 border border-rose-500/40 p-5 rounded-2xl text-left mb-6">
                <h4 className="text-sm font-bold text-rose-300 flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-rose-400" /> Rejection Reasons Breakdown:
                </h4>
                <ul className="space-y-2 text-xs text-rose-200">
                  {result.rejection_reasons?.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-rose-900/20 p-2.5 rounded-xl border border-rose-800/40">
                      <span className="text-rose-400 font-bold">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold mx-auto transition-all border border-slate-700"
              >
                <RefreshCw className="w-4 h-4" /> Edit & Re-evaluate Application
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Loan Form */
        <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-800 shadow-2xl">
          
          {errorMessage && (
            <div className="mb-6 bg-rose-500/10 border border-rose-500/40 p-4 rounded-2xl flex items-center gap-3 text-rose-300 text-sm">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <div>
                <strong className="font-semibold block">Submission Notice</strong>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Section 1: Customer Details */}
          <div className="mb-8">
            <h3 className="text-base font-heading font-bold text-cyan-400 flex items-center gap-2 border-b border-slate-800 pb-2 mb-4">
              <User className="w-4 h-4" /> 1. Customer Personal Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="full_name"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full glass-input pl-9 pr-3 py-2.5 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Number *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="tel"
                    name="mobile"
                    required
                    pattern="[6-9][0-9]{9}"
                    placeholder="10-digit Mobile (e.g. 9876543210)"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="w-full glass-input pl-9 pr-3 py-2.5 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email ID *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="rahul@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full glass-input pl-9 pr-3 py-2.5 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Date of Birth *</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="date"
                    name="dob"
                    required
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full glass-input pl-9 pr-3 py-2.5 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">City *</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="e.g. Mumbai"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full glass-input pl-9 pr-3 py-2.5 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Pincode *</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="pincode"
                    required
                    pattern="[0-9]{6}"
                    placeholder="6-digit Pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="w-full glass-input pl-9 pr-3 py-2.5 rounded-xl text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Loan Details */}
          <div className="mb-8">
            <h3 className="text-base font-heading font-bold text-cyan-400 flex items-center gap-2 border-b border-slate-800 pb-2 mb-4">
              <Building2 className="w-4 h-4" /> 2. Loan & Financial Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Loan Type *</label>
                <select
                  name="loan_type"
                  value={formData.loan_type}
                  onChange={handleChange}
                  className="w-full glass-input px-3 py-2.5 rounded-xl text-sm bg-slate-900"
                >
                  <option value="Home Loan">Home Loan</option>
                  <option value="Loan Against Property (LAP)">Loan Against Property (LAP)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Employment Type *</label>
                <select
                  name="employment_type"
                  value={formData.employment_type}
                  onChange={handleChange}
                  className="w-full glass-input px-3 py-2.5 rounded-xl text-sm bg-slate-900"
                >
                  <option value="Salaried">Salaried</option>
                  <option value="Self Employed">Self Employed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Monthly Net Income (₹) *</label>
                <div className="relative">
                  <IndianRupee className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="number"
                    name="monthly_income"
                    required
                    min="1"
                    placeholder="e.g. 50000"
                    value={formData.monthly_income}
                    onChange={handleChange}
                    className="w-full glass-input pl-9 pr-3 py-2.5 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Loan Amount Required (₹) *</label>
                <div className="relative">
                  <IndianRupee className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="number"
                    name="loan_amount"
                    required
                    min="1"
                    placeholder="e.g. 3000000"
                    value={formData.loan_amount}
                    onChange={handleChange}
                    className="w-full glass-input pl-9 pr-3 py-2.5 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Property Value (₹) *</label>
                <div className="relative">
                  <IndianRupee className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="number"
                    name="property_value"
                    required
                    min="1"
                    placeholder="e.g. 5000000"
                    value={formData.property_value}
                    onChange={handleChange}
                    className="w-full glass-input pl-9 pr-3 py-2.5 rounded-xl text-sm"
                  />
                </div>
              </div>

              {/* Live LTV Calculator Indicator */}
              <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                    <Calculator className="w-3.5 h-3.5 text-cyan-400" /> Live LTV Ratio
                  </span>
                  <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                    parseFloat(ltvRatio) <= 80 ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                  }`}>
                    {ltvRatio}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 my-2 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      parseFloat(ltvRatio) <= 80 ? "bg-emerald-500" : "bg-rose-500"
                    }`} 
                    style={{ width: `${Math.min(100, parseFloat(ltvRatio))}%` }}
                  ></div>
                </div>
                <span className="text-[11px] text-slate-400">
                  {parseFloat(ltvRatio) <= 80 
                    ? "✓ Within max LTV limit (≤ 80%)" 
                    : "⚠️ Exceeds 80% LTV rule limit"}
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Consent & Submission */}
          <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 mb-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="consent"
                checked={formData.consent}
                onChange={handleChange}
                className="mt-1 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              <span className="text-xs text-slate-300 leading-relaxed">
                I hereby grant consent to <strong>MoneyBeing Private Limited</strong> to fetch my Credit Score and evaluate my application against partner bank rules.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-cyan-500 to-emerald-400 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-base shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" /> Querying Bureau & Evaluating Rules...
              </>
            ) : (
              <>
                Evaluate Loan Eligibility <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
