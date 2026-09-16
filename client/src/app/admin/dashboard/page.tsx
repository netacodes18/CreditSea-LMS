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
  { name: 'Sanction Queue', href: '/sanction/loans', icon: CheckSquare, accent: '#d97706', desc: 'Review & approve applied loans' },
  { name: 'Disbursement', href: '/disbursement/loans', icon: Banknote, accent: '#059669', desc: 'Release funds for sanctioned loans' },
  { name: 'Collection', href: '/collection/dashboard', icon: HandCoins, accent: '#0891b2', desc: 'Record repayments & track balances' },
  { name: 'Sales', href: '/sales/dashboard', icon: BarChart3, accent: '#f97316', desc: 'Leads & conversion metrics' },
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
        <p className="text-xs font-bold tracking-widest uppercase text-[var(--ink)]/50 mb-1">Operations</p>
        <h1 className="text-3xl font-bold text-[var(--ink)] tracking-tight">Command Center</h1>
        <p className="mt-2 text-[var(--ink)]/60 font-medium">A live cross-module snapshot of every loan moving through the system.</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <KpiTile icon={FileStack} label="Total Loans" value={loading ? '—' : loans.length} accent="#f97316" />
        <KpiTile icon={TrendingUp} label="Awaiting Sanction" value={loading ? '—' : (counts['APPLIED'] || 0)} accent="#d97706" />
        <KpiTile icon={Banknote} label="Sanctioned" value={loading ? '—' : (counts['SANCTIONED'] || 0)} accent="#2563eb" />
        <KpiTile icon={Wallet} label="Total Volume" value={loading ? '—' : `₹${(totalVolume / 100).toLocaleString()}`} accent="#059669" />
      </div>

      {/* Module shortcuts */}
      <div>
        <h2 className="text-sm font-bold text-[var(--ink)]/50 uppercase tracking-widest mb-3">Jump into a module</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {visibleModules.map((m) => (
            <Link
              key={m.name}
              href={m.href as any}
              className="neo-card p-5 group hover:-translate-y-1  transition-all duration-200"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-[var(--ink)] border border-[var(--line)]"
                style={{ backgroundColor: m.accent }}
              >
                <m.icon className="w-5 h-5" />
              </div>
              <p className="font-bold text-[var(--ink)]">{m.name}</p>
              <p className="text-xs text-[var(--ink)]/60 mt-1 font-medium">{m.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="neo-card overflow-hidden">
        <div className="px-6 py-5 border-b border-[var(--line)]">
          <h2 className="text-lg font-bold text-[var(--ink)]">Recent Loan Activity</h2>
        </div>
        {loading ? (
          <div className="p-6 text-center text-[var(--ink)]/50 font-bold">Loading…</div>
        ) : recent.length === 0 ? (
          <div className="p-6 text-center text-[var(--ink)]/50 font-bold">No loans in the system yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--line)]">
              <thead className="bg-[var(--paper)]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[var(--ink)]/60 uppercase tracking-wider">Borrower</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[var(--ink)]/60 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[var(--ink)]/60 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[var(--ink)]/60 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {recent.map((l) => (
                  <tr key={l._id} className="hover:bg-[var(--paper)] transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-[var(--ink)]">{l.borrowerId?.email || 'Unknown'}</td>
                    <td className="px-6 py-4 text-sm font-bold text-[var(--ink)]">₹{(l.loanAmountPaise / 100).toLocaleString()}</td>
                    <td className="px-6 py-4"><StatusBadge status={l.loanStatus} /></td>
                    <td className="px-6 py-4 text-sm text-[var(--ink)]/60 font-medium">{new Date(l.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function KpiTile({ icon: Icon, label, value, accent }: { icon: React.ElementType; label: string; value: string | number; accent: string }) {
  return (
    <div className="neo-card p-5">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 border border-[var(--line)]" style={{ backgroundColor: accent }}>
        <Icon className="w-[18px] h-[18px] text-[var(--ink)]" />
      </div>
      <p className="text-2xl font-bold text-[var(--ink)] tracking-tight">{value}</p>
      <p className="text-xs text-[var(--ink)]/60 mt-1 font-bold uppercase tracking-wide">{label}</p>
    </div>
  );
}
