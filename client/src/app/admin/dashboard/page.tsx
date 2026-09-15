"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import StatusBadge from '@/components/StatusBadge';
import { CheckSquare, Banknote, HandCoins, BarChart3, TrendingUp, Wallet, FileStack } from 'lucide-react';

interface Loan {
  _id: string;
  loanAmountPaise: number;
  totalRepaymentPaise: number;
  loanStatus: string;
  createdAt: string;
  borrowerId?: { email?: string };
}

const MODULE_LINKS = [
  { name: 'Sanction Queue', href: '/admin/loans', icon: CheckSquare, accent: '#8b5cf6', desc: 'Review & approve applied loans' },
  { name: 'Disbursement', href: '/disbursement/loans', icon: Banknote, accent: '#10b981', desc: 'Release funds for sanctioned loans' },
  { name: 'Collection', href: '/collection/dashboard', icon: HandCoins, accent: '#06b6d4', desc: 'Record repayments & track balances' },
  { name: 'Sales', href: '/sales/dashboard', icon: BarChart3, accent: '#f59e0b', desc: 'Leads & conversion metrics' },
];

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/loans')
      .then((res) => { if (res.data.success) setLoans(res.data.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalVolume = loans.reduce((s, l) => s + l.loanAmountPaise, 0);
  const counts = loans.reduce((acc: Record<string, number>, l) => {
    acc[l.loanStatus] = (acc[l.loanStatus] || 0) + 1;
    return acc;
  }, {});
  const recent = [...loans].slice(0, 6);

  const visibleModules = user?.role === 'ADMIN'
    ? MODULE_LINKS
    : MODULE_LINKS.filter((m) =>
        (user?.role === 'SANCTION' && m.name === 'Sanction Queue') ||
        (user?.role === 'DISBURSEMENT' && m.name === 'Disbursement')
      );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-violet-500 mb-1">Operations</p>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Command Center</h1>
        <p className="mt-2 text-slate-500">A live cross-module snapshot of every loan moving through the system.</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <KpiTile icon={FileStack} label="Total Loans" value={loading ? '—' : loans.length} accent="#7c3aed" />
        <KpiTile icon={TrendingUp} label="Awaiting Sanction" value={loading ? '—' : (counts['APPLIED'] || 0)} accent="#f59e0b" />
        <KpiTile icon={Banknote} label="Sanctioned" value={loading ? '—' : (counts['SANCTIONED'] || 0)} accent="#8b5cf6" />
        <KpiTile icon={Wallet} label="Total Volume" value={loading ? '—' : `₹${(totalVolume / 100).toLocaleString()}`} accent="#10b981" />
      </div>

      {/* Module shortcuts */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-3">Jump into a module</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {visibleModules.map((m) => (
            <Link
              key={m.name}
              href={m.href as any}
              className="card-surface p-5 group hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden"
            >
              <div
                className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"
                style={{ backgroundColor: m.accent }}
              />
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-white shadow-md"
                style={{ backgroundColor: m.accent }}
              >
                <m.icon className="w-5 h-5" />
              </div>
              <p className="font-semibold text-slate-900">{m.name}</p>
              <p className="text-xs text-slate-500 mt-1">{m.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="card-surface overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Recent Loan Activity</h2>
        </div>
        {loading ? (
          <div className="p-6 text-center text-slate-400">Loading…</div>
        ) : recent.length === 0 ? (
          <div className="p-6 text-center text-slate-400">No loans in the system yet.</div>
        ) : (
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/60">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Borrower</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recent.map((l) => (
                <tr key={l._id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-700">{l.borrowerId?.email || 'Unknown'}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">₹{(l.loanAmountPaise / 100).toLocaleString()}</td>
                  <td className="px-6 py-4"><StatusBadge status={l.loanStatus} /></td>
                  <td className="px-6 py-4 text-sm text-slate-500">{new Date(l.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function KpiTile({ icon: Icon, label, value, accent }: { icon: React.ElementType; label: string; value: string | number; accent: string }) {
  return (
    <div className="card-surface p-5 relative overflow-hidden">
      <div
        className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-[0.08]"
        style={{ backgroundColor: accent }}
      />
      <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: `${accent}1a` }}>
        <Icon className="w-[18px] h-[18px]" style={{ color: accent }} />
      </div>
      <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{label}</p>
    </div>
  );
}
