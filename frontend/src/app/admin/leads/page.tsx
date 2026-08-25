"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, Filter, FileSpreadsheet, ChevronLeft, ChevronRight, 
  FileText, CheckCircle, XCircle, Eye, RefreshCw, X, ShieldCheck 
} from "lucide-react";
import { apiFetch, API_BASE_URL } from "@/lib/api";

interface Lead {
  id: number;
  full_name: string;
  mobile: string;
  email: string;
  dob: string;
  city: string;
  pincode: string;
  loan_type: string;
  employment_type: string;
  monthly_income: number;
  loan_amount: number;
  property_value: number;
  credit_score: number;
  bre_status: string;
  rejection_reasons: string[];
  created_at: string;
}

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [loanTypeFilter, setLoanTypeFilter] = useState("");
  const [breStatusFilter, setBreStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });

      if (search) params.append("search", search);
      if (loanTypeFilter) params.append("loan_type", loanTypeFilter);
      if (breStatusFilter) params.append("bre_status", breStatusFilter);

      const res = await apiFetch(`/api/leads?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLeads(data.data);
        setTotalPages(data.total_pages);
        setTotalLeads(data.total);
      }
    } catch (err) {
      console.error("Failed to fetch leads", err);
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
    fetchLeads();
  }, [page, search, loanTypeFilter, breStatusFilter, router]);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-heading font-black text-white flex items-center gap-3">
            <FileText className="w-8 h-8 text-emerald-400" /> Leads Management Portal
          </h1>
          <p className="text-slate-400 text-sm mt-1">Review, filter, and inspect applicant credit score evaluations & BRE decisions</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Excel Export Button */}
          <button
            onClick={handleExportExcel}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all transform hover:scale-[1.02] disabled:opacity-50"
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

          <button
            onClick={fetchLeads}
            className="p-2.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800 transition-colors"
            title="Refresh Leads Table"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Module 5 Search & Filter Controls */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search by name, mobile or city..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full glass-input pl-10 pr-3 py-2.5 rounded-xl text-xs"
          />
        </div>

        {/* Filter Loan Type */}
        <div>
          <select
            value={loanTypeFilter}
            onChange={(e) => { setLoanTypeFilter(e.target.value); setPage(1); }}
            className="w-full glass-input px-3 py-2.5 rounded-xl text-xs bg-slate-950"
          >
            <option value="">All Loan Types</option>
            <option value="Home Loan">Home Loan</option>
            <option value="Loan Against Property (LAP)">Loan Against Property (LAP)</option>
          </select>
        </div>

        {/* Filter BRE Status */}
        <div>
          <select
            value={breStatusFilter}
            onChange={(e) => { setBreStatusFilter(e.target.value); setPage(1); }}
            className="w-full glass-input px-3 py-2.5 rounded-xl text-xs bg-slate-950"
          >
            <option value="">All BRE Statuses</option>
            <option value="Eligible">Eligible Only</option>
            <option value="Not Eligible">Not Eligible Only</option>
          </select>
        </div>
      </div>

      {/* Module 5 Leads Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/90 text-slate-300 text-[11px] font-bold uppercase tracking-wider border-b border-slate-800">
                <th className="py-4 px-4">Lead ID</th>
                <th className="py-4 px-4">Customer Details</th>
                <th className="py-4 px-4">Loan Details</th>
                <th className="py-4 px-4">Monthly Income</th>
                <th className="py-4 px-4">Credit Score</th>
                <th className="py-4 px-4">BRE Status</th>
                <th className="py-4 px-4">Submitted Date</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin mx-auto mb-2" />
                    Loading leads database...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No leads matching criteria found.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-indigo-400">
                      #{lead.id}
                    </td>

                    <td className="py-4 px-4">
                      <strong className="text-white font-bold block text-sm">{lead.full_name}</strong>
                      <span className="text-slate-400 text-[11px] block">{lead.mobile} • {lead.city}</span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-semibold text-slate-200 block">{lead.loan_type}</span>
                      <span className="text-slate-400 text-[11px] block font-mono">
                        ₹{lead.loan_amount.toLocaleString("en-IN")}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-mono font-medium text-slate-300">
                      ₹{lead.monthly_income.toLocaleString("en-IN")}
                    </td>

                    <td className="py-4 px-4 font-mono font-bold">
                      <span className={`px-2.5 py-1 rounded-lg text-xs border ${
                        lead.credit_score >= 750 
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" 
                          : lead.credit_score >= 700 
                          ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30" 
                          : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                      }`}>
                        {lead.credit_score} Score
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${
                        lead.bre_status === "Eligible"
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          : "bg-rose-500/20 text-rose-300 border-rose-500/40"
                      }`}>
                        {lead.bre_status === "Eligible" ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-400" />
                        )}
                        {lead.bre_status}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(lead.created_at).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric"
                      })}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="View Full Lead Details"
                      >
                        <Eye className="w-4 h-4 text-cyan-400" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Module 5 Pagination Controls */}
        <div className="bg-slate-900/90 p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Showing {leads.length} of {totalLeads} total leads</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-xl bg-slate-800 disabled:opacity-50 text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-white px-2">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-xl bg-slate-800 disabled:opacity-50 text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-xl glass-panel p-6 rounded-3xl border border-slate-800 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Lead Specification #{selectedLead.id}</h3>
                <span className="text-xs text-slate-400">{selectedLead.full_name}</span>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block">Mobile</span>
                <strong className="text-white text-sm">{selectedLead.mobile}</strong>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block">Email</span>
                <strong className="text-white text-sm">{selectedLead.email}</strong>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block">City / Pincode</span>
                <strong className="text-white text-sm">{selectedLead.city} - {selectedLead.pincode}</strong>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block">Credit Bureau Score</span>
                <strong className="text-cyan-400 text-sm">{selectedLead.credit_score} CIBIL</strong>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block">Loan Amount Required</span>
                <strong className="text-emerald-400 text-sm">₹{selectedLead.loan_amount.toLocaleString("en-IN")}</strong>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block">Estimated Property Value</span>
                <strong className="text-indigo-400 text-sm">₹{selectedLead.property_value.toLocaleString("en-IN")}</strong>
              </div>
            </div>

            {selectedLead.rejection_reasons && selectedLead.rejection_reasons.length > 0 && (
              <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-2xl space-y-2">
                <strong className="text-xs text-rose-400 font-bold uppercase tracking-wider block">
                  BRE Rejection Diagnostics
                </strong>
                <ul className="space-y-1 text-xs text-rose-300 list-disc list-inside">
                  {selectedLead.rejection_reasons.map((r, idx) => (
                    <li key={idx}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
