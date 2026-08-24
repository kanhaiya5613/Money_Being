"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Sliders, Plus, Edit2, Trash2, CheckCircle2, 
  AlertCircle, RefreshCw, X, ShieldAlert, Sparkles 
} from "lucide-react";
import { apiFetch } from "@/lib/api";

interface BRERule {
  id: number;
  rule_name: string;
  field_name: string;
  operator: string;
  target_field?: string;
  value: string;
  error_message: string;
  is_active: boolean;
  created_at: string;
}

export default function AdminRulesPage() {
  const router = useRouter();
  const [rules, setRules] = useState<BRERule[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<BRERule | null>(null);
  const [formData, setFormData] = useState({
    rule_name: "",
    field_name: "credit_score",
    operator: ">=",
    target_field: "",
    value: "",
    error_message: "",
    is_active: true,
  });

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const fetchRules = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/rules");
      if (res.ok) {
        const data = await res.json();
        setRules(data);
      } else {
        showNotification("error", "Failed to fetch BRE rules from backend.");
      }
    } catch (err) {
      showNotification("error", "Network error connecting to API server.");
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
    fetchRules();
  }, [router]);

  const handleOpenAddModal = () => {
    setEditingRule(null);
    setModalError(null);
    setFormData({
      rule_name: "",
      field_name: "credit_score",
      operator: ">=",
      target_field: "",
      value: "",
      error_message: "",
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (rule: BRERule) => {
    setEditingRule(rule);
    setModalError(null);
    setFormData({
      rule_name: rule.rule_name,
      field_name: rule.field_name,
      operator: rule.operator,
      target_field: rule.target_field || "",
      value: rule.value,
      error_message: rule.error_message,
      is_active: rule.is_active,
    });
    setIsModalOpen(true);
  };

  // Toggle Active State Button Action
  const handleToggleActive = async (rule: BRERule) => {
    try {
      const res = await apiFetch(`/api/rules/${rule.id}`, {
        method: "PUT",
        body: JSON.stringify({ is_active: !rule.is_active }),
      });
      if (res.ok) {
        showNotification("success", `Rule "${rule.rule_name}" is now ${!rule.is_active ? "Active" : "Inactive"}.`);
        fetchRules();
      } else {
        showNotification("error", "Failed to update rule status.");
      }
    } catch (err) {
      showNotification("error", "Network error updating rule status.");
    }
  };

  // Delete Rule Button Action
  const handleDeleteRule = async (id: number, ruleName: string) => {
    if (!confirm(`Are you sure you want to delete BRE Rule "${ruleName}"?`)) return;
    try {
      const res = await apiFetch(`/api/rules/${id}`, { method: "DELETE" });
      if (res.ok) {
        showNotification("success", `BRE Rule "${ruleName}" deleted successfully.`);
        fetchRules();
      } else {
        showNotification("error", "Failed to delete BRE rule.");
      }
    } catch (err) {
      showNotification("error", "Network error deleting rule.");
    }
  };

  // Submit Modal (Add / Edit Button Action)
  const handleSubmitModal = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setModalError(null);

    try {
      const payload = {
        ...formData,
        target_field: formData.operator === "<=_pct_of" ? (formData.target_field || "property_value") : null,
      };

      const url = editingRule ? `/api/rules/${editingRule.id}` : "/api/rules";
      const method = editingRule ? "PUT" : "POST";

      const res = await apiFetch(url, {
        method,
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        showNotification(
          "success", 
          editingRule 
            ? `BRE Rule "${formData.rule_name}" updated successfully.` 
            : `New BRE Rule "${formData.rule_name}" added successfully.`
        );
        fetchRules();
      } else {
        const errorData = await res.json().catch(() => ({}));
        let errMsg = "Failed to save BRE Rule.";
        if (typeof errorData.detail === "string") {
          errMsg = errorData.detail;
        } else if (Array.isArray(errorData.detail) && errorData.detail.length > 0) {
          errMsg = errorData.detail.map((d: any) => d.msg || d.detail).join("; ");
        }
        setModalError(errMsg);
        showNotification("error", errMsg);
      }
    } catch (err) {
      setModalError("Network error saving BRE Rule");
      showNotification("error", "Network error saving BRE Rule");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-heading font-black text-white flex items-center gap-3">
            <Sliders className="w-8 h-8 text-amber-400" /> BRE Management Engine
          </h1>
          <p className="text-slate-400 text-sm mt-1">Configure live eligibility rules stored in Supabase DB (Zero code changes required!)</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all transform hover:scale-[1.02] self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New BRE Rule
        </button>
      </div>

      {/* Dynamic Toast Feedback Notification */}
      {notification && (
        <div className={`p-4 rounded-2xl border flex items-center gap-3 text-xs font-semibold shadow-xl animate-fade-in ${
          notification.type === "success" 
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" 
            : "bg-rose-500/10 border-rose-500/30 text-rose-300"
        }`}>
          {notification.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span className="flex-grow">{notification.message}</span>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Live Policy Info Alert */}
      <div className="bg-indigo-950/40 border border-indigo-500/30 p-4 rounded-2xl flex items-center gap-3 text-xs text-indigo-200">
        <ShieldAlert className="w-5 h-5 text-indigo-400 shrink-0" />
        <span>
          <strong>Live Evaluation Engine:</strong> Additions, Updates, and Deletions take immediate effect on all upcoming customer loan applications without modifying backend code or restarting services.
        </span>
      </div>

      {/* BRE Rules Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-4 px-4">Rule Name</th>
                <th className="py-4 px-4">Target Field</th>
                <th className="py-4 px-4">Operator</th>
                <th className="py-4 px-4">Threshold Value</th>
                <th className="py-4 px-4">Rejection Error Message</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-400" /> Loading Live BRE Rules...
                  </td>
                </tr>
              ) : rules.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No BRE rules configured in database. Click "Add New BRE Rule" above to create one.
                  </td>
                </tr>
              ) : (
                rules.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-4 font-bold text-white">{r.rule_name}</td>
                    <td className="py-4 px-4 font-mono text-indigo-300">{r.field_name}</td>
                    <td className="py-4 px-4 font-mono font-bold text-amber-400">{r.operator}</td>
                    <td className="py-4 px-4 font-mono font-semibold text-emerald-400">
                      {r.operator === "<=_pct_of" ? `${r.value}% of ${r.target_field || "property_value"}` : r.value}
                    </td>
                    <td className="py-4 px-4 text-slate-300 max-w-xs truncate" title={r.error_message}>
                      {r.error_message}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleToggleActive(r)}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                          r.is_active 
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30" 
                            : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700"
                        }`}
                        title="Click to toggle active status"
                      >
                        {r.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(r)}
                          className="p-2 rounded-xl bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 border border-indigo-500/30 transition-colors"
                          title="Edit Rule Parameters"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRule(r.id, r.rule_name)}
                          className="p-2 rounded-xl bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30 transition-colors"
                          title="Delete BRE Rule"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Rule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 border border-slate-700 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-xl bg-slate-900 border border-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-heading font-black text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              {editingRule ? "Edit BRE Rule" : "Create New BRE Rule"}
            </h3>

            {modalError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitModal} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Rule Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Minimum Credit Score"
                  value={formData.rule_name}
                  onChange={(e) => setFormData({ ...formData, rule_name: e.target.value })}
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Evaluation Field</label>
                  <select
                    value={formData.field_name}
                    onChange={(e) => setFormData({ ...formData, field_name: e.target.value })}
                    className="w-full glass-input px-3 py-2.5 rounded-xl bg-slate-900 text-xs"
                  >
                    <option value="age">Age (computed from DOB)</option>
                    <option value="monthly_income">Monthly Income</option>
                    <option value="credit_score">Credit Score</option>
                    <option value="loan_amount">Loan Amount</option>
                    <option value="employment_type">Employment Type</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Operator</label>
                  <select
                    value={formData.operator}
                    onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
                    className="w-full glass-input px-3 py-2.5 rounded-xl bg-slate-900 text-xs"
                  >
                    <option value=">=">&gt;= (At least)</option>
                    <option value="<=">&lt;= (At most)</option>
                    <option value=">">&gt; (Greater than)</option>
                    <option value="<">&lt; (Less than)</option>
                    <option value="==">== (Equals)</option>
                    <option value="!=">!= (Not Equals)</option>
                    <option value="<=_pct_of">&lt;= % of Target Field (LTV)</option>
                  </select>
                </div>
              </div>

              {formData.operator === "<=_pct_of" && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Base Field</label>
                  <input
                    type="text"
                    placeholder="property_value"
                    value={formData.target_field}
                    onChange={(e) => setFormData({ ...formData, target_field: e.target.value })}
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Threshold Value {formData.operator === "<=_pct_of" && "(Percentage)"}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 700 or 30000 or 80"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Rejection Error Message</label>
                <input
                  type="text"
                  required
                  placeholder="Credit Score below minimum requirement (700)"
                  value={formData.error_message}
                  onChange={(e) => setFormData({ ...formData, error_message: e.target.value })}
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="is_active" className="text-slate-300 font-semibold cursor-pointer text-xs">
                  Activate this rule immediately for live eligibility checks
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2"
                >
                  {actionLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Saving Rule...
                    </>
                  ) : editingRule ? (
                    "Update Rule"
                  ) : (
                    "Create Rule"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
