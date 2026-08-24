import Link from "next/link";
import { Building2, ArrowUpRight } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

export default function Footer() {
  const docsUrl = `${API_BASE_URL}/docs`;

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-xl mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 text-xs text-slate-400">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-cyan-500 to-emerald-400 p-[1px]">
                <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-indigo-400" />
                </div>
              </div>
              <span className="text-lg font-heading font-black text-white">MoneyBeing</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Automated Loan Eligibility Evaluation & Lead Management Module powered by dynamic database BRE & credit bureau integration.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <strong className="text-white block mb-3 font-heading font-bold uppercase text-[11px] tracking-wider">
              Quick Navigation
            </strong>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-cyan-400 transition-colors">Home Page</Link></li>
              <li><Link href="/apply" className="hover:text-cyan-400 transition-colors">Apply for Loan</Link></li>
              <li><Link href="/about" className="hover:text-cyan-400 transition-colors">About BRE Engine</Link></li>
              <li><Link href="/admin/dashboard" className="hover:text-cyan-400 transition-colors">Admin Dashboard</Link></li>
            </ul>
          </div>

          {/* Technology Stack */}
          <div>
            <strong className="text-white block mb-3 font-heading font-bold uppercase text-[11px] tracking-wider">
              System Architecture
            </strong>
            <ul className="space-y-2">
              <li>FastAPI (Python 3.13)</li>
              <li>Next.js 14 & Tailwind CSS</li>
              <li>Supabase PostgreSQL Database</li>
              <li>JWT Bearer Authentication</li>
            </ul>
          </div>

          {/* API Docs & Specs */}
          <div>
            <strong className="text-white block mb-3 font-heading font-bold uppercase text-[11px] tracking-wider">
              API Documentation
            </strong>
            <p className="text-slate-400 text-xs mb-3 leading-relaxed">
              Interactive OpenAPI Swagger documentation endpoints available live on backend server.
            </p>
            <a
              href={docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30 font-bold transition-all"
            >
              Swagger Docs (/docs) <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Copyright Footer Bar */}
        <div className="border-t border-slate-800/80 pt-4 pb-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <span>© 2026 MoneyBeing Private Limited. All rights reserved.</span>
          <span className="text-slate-400">Python Full Stack Intern Assessment Solution</span>
        </div>
      </div>
    </footer>
  );
}
