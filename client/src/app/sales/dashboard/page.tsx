"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import StatusBadge from '@/components/StatusBadge';
import { Users, FileStack, Clock, Wallet, Loader2, BarChart3 } from 'lucide-react';

const ACCENT = '#f97316';

export default function SalesDashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const res = await api.get('/sales/dashboard');
      if (res.data.success) {
        setMetrics(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="neo-card p-16 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--ink)]" />
          <p className="text-sm font-bold text-[var(--ink)]/50">Loading metrics…</p>
        </div>
      </div>
    );
  }
  if (!metrics) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="neo-card p-16 text-center text-[var(--ink)]/50 font-bold">Error loading metrics</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center border border-[var(--line)]" style={{ backgroundColor: ACCENT }}>
          <BarChart3 className="w-5 h-5 text-[var(--ink)]" />
        </div>
        <div>
          <p className="text-xs font-bold tracking-widest uppercase mb-0.5 text-[var(--ink)]/50">Sales</p>
          <h1 className="text-2xl font-bold text-[var(--ink)] tracking-tight">Sales Analytics Dashboard</h1>
        </div>
      </div>
      <p className="-mt-4 text-[var(--ink)]/60 font-medium">High-level view of LMS conversion metrics and active leads.</p>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <KpiTile icon={Users} label="Total Registered Borrowers" value={metrics.totalBorrowers} accent={ACCENT} />
        <KpiTile icon={FileStack} label="Total Applications" value={metrics.totalApplications} accent="#d97706" />
        <KpiTile icon={Clock} label="Pending Review" value={metrics.pendingReview} accent="#2563eb" />
        <KpiTile icon={Wallet} label="Disbursed Volume" value={`₹${(metrics.totalDisbursedVolumePaise / 100).toLocaleString()}`} accent="#059669" />
      </div>

      {/* Leads Table */}
      <div className="neo-card overflow-hidden">
        <div className="px-6 py-5 border-b border-[var(--line)]">
          <h2 className="text-lg font-bold text-[var(--ink)]">Leads (Registered, Not Yet Applied)</h2>
          <p className="mt-1 text-sm text-[var(--ink)]/60 font-medium">Borrowers who signed up but haven&apos;t submitted a loan application yet.</p>
        </div>

        {metrics.recentLeads.length === 0 ? (
          <div className="p-12 text-center text-[var(--ink)]/50 font-bold">No pending leads &mdash; every registered borrower has applied.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--line)]">
              <thead className="bg-[var(--paper)]">
                <tr>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-[var(--ink)]/60 uppercase tracking-wider">Borrower Info</th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-[var(--ink)]/60 uppercase tracking-wider">Profile Status</th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-[var(--ink)]/60 uppercase tracking-wider">Registered On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {metrics.recentLeads.map((lead: any) => (
                  <tr key={lead._id} className="hover:bg-[var(--paper)] transition-colors">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-bold text-[var(--ink)]">{lead.fullName || 'Profile not started'}</div>
                      <div className="text-sm text-[var(--ink)]/60 font-medium">{lead.email}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <StatusBadge status={lead.profileStatus} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-[var(--ink)]/60 font-medium">
                      {new Date(lead.registeredAt).toLocaleDateString()}
                    </td>
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
