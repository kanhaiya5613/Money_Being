"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Users, CheckCircle, XCircle, Award, TrendingUp, 
  BarChart3, ShieldCheck, RefreshCw, Activity, ArrowUpRight, 
  FileSpreadsheet, Sliders, Radio, Sparkles, AlertTriangle 
} from "lucide-react";
import { apiFetch, API_BASE_URL } from "@/lib/api";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell 
} from "recharts";

interface StatsData {
  total_leads: number;
  eligible_leads: number;
  rejected_leads: number;
  avg_credit_score: number;
  loan_type_breakdown: Record<string, number>;
  rejection_reasons_breakdown: Record<string, number>;
}

interface RecentLead {
  id: number;
  full_name: string;
  mobile: string;
  city: string;
  loan_type: string;
  credit_score: number;
  bre_status: string;
  created_at: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Stats
      const resStats = await apiFetch("/api/leads/stats");
      if (resStats.ok) {
        const data = await resStats.json();
        setStats(data);
      }

      // 2. Fetch Recent Leads Ticker Data
      const resLeads = await apiFetch("/api/leads?page=1&limit=6");
      if (resLeads.ok) {
        const dataLeads = await resLeads.json();
        setRecentLeads(dataLeads.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchDashboardData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
        <span className="text-xs text-slate-400 font-semibold">Loading Live Executive Dashboard...</span>
      </div>
    );
  }

  const eligibilityRate = stats && stats.total_leads > 0 
    ? ((stats.eligible_leads / stats.total_leads) * 100).toFixed(1) 
    : "0";

  // Risk Radar Calculations
  const lowRiskCount = recentLeads.filter(l => l.credit_score >= 750).length;
  const modRiskCount = recentLeads.filter(l => l.credit_score >= 700 && l.credit_score < 750).length;
  const highRiskCount = recentLeads.filter(l => l.credit_score < 700).length;
  const totalRecent = recentLeads.length || 1;

  // Chart Data
  const loanTypeChartData = stats ? Object.entries(stats.loan_type_breakdown).map(([name, count]) => ({
    name,
    count,
  })) : [];

  const rejectionChartData = stats ? Object.entries(stats.rejection_reasons_breakdown).map(([name, count]) => ({
    name: name.length > 35 ? name.substring(0, 32) + "..." : name,
    fullName: name,
    count,
  })) : [];

  const BAR_COLORS = ["#6366f1", "#06b6d4", "#10b981", "#f59e0b"];

  const [exporting, setExporting] = useState(false);

  const handleExportExcel = async () => {
    setExporting(true);
    try {
      const res = await apiFetch("/api/leads/export/excel");
      if (!res.ok) {
        alert("Failed to export Excel report.");
        return;
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Loan_Leads_Report.xlsx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Export failed", err);
      alert("Error downloading Excel file.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Executive Header & Control Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold mb-2">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" /> Live Bureau & BRE Telemetry Stream
          </div>
          <h1 className="text-3xl font-heading font-black text-white flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-indigo-400" /> Executive Analytics & Telemetry Radar
          </h1>
          <p className="text-slate-400 text-sm mt-1">Real-time Lead Activity, Risk Distribution Radar & Business Rule Engine metrics</p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleExportExcel}
            disabled={exporting}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50"
          >
            {exporting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Exporting...
              </>
            ) : (
              <>
                <FileSpreadsheet className="w-4 h-4" /> Export Excel (.xlsx)
              </>
            )}
          </button>

          <Link
            href="/admin/rules"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700 font-bold text-xs transition-all"
          >
            <Sliders className="w-4 h-4 text-amber-400" /> Manage Rules
          </Link>

          <button
            onClick={fetchDashboardData}
            className="p-2.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800 transition-colors"
            title="Refresh Dashboard Metrics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Module 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Leads */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 glass-panel-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Leads</span>
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-heading font-black text-white mt-3">{stats?.total_leads || 0}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Accumulated applications</span>
        </div>

        {/* Eligible Leads */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 glass-panel-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Eligible Leads</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-heading font-black text-emerald-400 mt-3">{stats?.eligible_leads || 0}</div>
          <span className="text-[11px] text-emerald-400/80 font-bold mt-1 block">
            {eligibilityRate}% Approval Rate
          </span>
        </div>

        {/* Rejected Leads */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 glass-panel-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Rejected Leads</span>
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-heading font-black text-rose-400 mt-3">{stats?.rejected_leads || 0}</div>
          <span className="text-[11px] text-rose-400/80 font-bold mt-1 block">BRE Rule Cutoff Rejections</span>
        </div>

        {/* Average Credit Score */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 glass-panel-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg CIBIL Score</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-heading font-black text-amber-400 mt-3">{stats?.avg_credit_score || 0}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Bureau Score Average</span>
        </div>
      </div>

      {/* LIVE LEAD ACTIVITY TICKER & RISK RADAR TIER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Live Activity Ticker Stream */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400 animate-pulse" /> Live Application Ticker Stream
            </h3>
            <Link
              href="/admin/leads"
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              View Full Table <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentLeads.length > 0 ? (
              recentLeads.map((lead) => (
                <div 
                  key={lead.id} 
                  className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      lead.bre_status === "Eligible" 
                        ? "bg-emerald-400 shadow-md shadow-emerald-400/50 animate-pulse" 
                        : "bg-rose-500 shadow-md shadow-rose-500/50"
                    }`}></div>
                    <div>
                      <strong className="text-white font-bold block text-sm">{lead.full_name}</strong>
                      <span className="text-slate-400 text-[11px]">{lead.city} • {lead.loan_type}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto font-mono">
                    <div className="text-right">
                      <span className="text-slate-400 text-[10px] block">Fetched CIBIL</span>
                      <strong className={`text-xs ${
                        lead.credit_score >= 750 
                          ? "text-emerald-400" 
                          : lead.credit_score >= 700 
                          ? "text-cyan-400" 
                          : "text-rose-400"
                      }`}>
                        {lead.credit_score} Score
                      </strong>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${
                      lead.bre_status === "Eligible"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        : "bg-rose-500/20 text-rose-300 border-rose-500/40"
                    }`}>
                      {lead.bre_status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-xs text-slate-500">No application activity recorded yet.</div>
            )}
          </div>
        </div>

        {/* Right 1 Col: CIBIL Risk Radar Tier Distribution */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-heading font-bold text-white flex items-center gap-2 mb-1">
              <TrendingUp className="w-5 h-5 text-indigo-400" /> Credit Risk Tier Radar
            </h3>
            <p className="text-xs text-slate-400">Bureau Score Risk Category Breakdown</p>
          </div>

          <div className="space-y-4">
            {/* Low Risk Tier */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between font-semibold">
                <span className="text-emerald-400 flex items-center gap-1">
                  🟢 Low Risk (750+ CIBIL)
                </span>
                <span className="text-white font-mono">{Math.round((lowRiskCount / totalRecent) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <div 
                  className="bg-emerald-500 h-full transition-all"
                  style={{ width: `${Math.round((lowRiskCount / totalRecent) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Moderate Risk Tier */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between font-semibold">
                <span className="text-cyan-400 flex items-center gap-1">
                  🟡 Moderate Risk (700-749)
                </span>
                <span className="text-white font-mono">{Math.round((modRiskCount / totalRecent) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <div 
                  className="bg-cyan-500 h-full transition-all"
                  style={{ width: `${Math.round((modRiskCount / totalRecent) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* High Risk Tier */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between font-semibold">
                <span className="text-rose-400 flex items-center gap-1">
                  🔴 High Risk (&lt; 700 CIBIL)
                </span>
                <span className="text-white font-mono">{Math.round((highRiskCount / totalRecent) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <div 
                  className="bg-rose-500 h-full transition-all"
                  style={{ width: `${Math.round((highRiskCount / totalRecent) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 text-[11px] text-slate-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>BRE evaluates low & moderate risk tiers against dynamic LTV and income cutoffs.</span>
          </div>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Applications by Loan Type */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-400" /> Applications Distribution by Loan Type
          </h3>
          <div className="h-64 w-full">
            {loanTypeChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={loanTypeChartData}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", color: "#fff" }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {loanTypeChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">No lead data recorded yet</div>
            )}
          </div>
        </div>

        {/* Chart 2: Top Rejection Reasons Breakdown */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" /> Top Rejection Reasons Breakdown
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {rejectionChartData.length > 0 ? (
              rejectionChartData.map((item, idx) => (
                <div key={idx} className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium truncate max-w-[80%]" title={item.fullName}>
                    {item.fullName}
                  </span>
                  <span className="bg-rose-500/20 text-rose-300 font-black px-2.5 py-1 rounded-full border border-rose-500/30">
                    {item.count} hits
                  </span>
                </div>
              ))
            ) : (
              <div className="h-48 flex items-center justify-center text-xs text-slate-500">No rejection records found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
