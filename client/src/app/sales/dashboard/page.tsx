"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import StatusBadge from '@/components/StatusBadge';
import { Users, FileStack, Clock, Wallet, Loader2, BarChart3 } from 'lucide-react';

const ACCENT = '#f59e0b';

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
        <div className="card-surface p-16 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: ACCENT }} />
          <p className="text-sm text-slate-400">Loading metrics…</p>
        </div>
      </div>
    );
  }
  if (!metrics) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="card-surface p-16 text-center text-slate-400">Error loading metrics</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md" style={{ backgroundColor: ACCENT }}>
          <BarChart3 className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase mb-0.5" style={{ color: ACCENT }}>Sales</p>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sales Analytics Dashboard</h1>
        </div>
      </div>
      <p className="-mt-4 text-slate-500">High-level view of LMS conversion metrics and active leads.</p>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <KpiTile icon={Users} label="Total Registered Borrowers" value={metrics.totalBorrowers} accent={ACCENT} />
        <KpiTile icon={FileStack} label="Total Applications" value={metrics.totalApplications} accent="#6366f1" />
        <KpiTile icon={Clock} label="Pending Review" value={metrics.pendingReview} accent="#f59e0b" />
        <KpiTile icon={Wallet} label="Disbursed Volume" value={`₹${(metrics.totalDisbursedVolumePaise / 100).toLocaleString()}`} accent="#10b981" />
      </div>

      {/* Leads Table */}
      <div className="card-surface overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Leads (Registered, Not Yet Applied)</h2>
          <p className="mt-1 text-sm text-slate-500">Borrowers who signed up but haven&apos;t submitted a loan application yet.</p>
        </div>

        {metrics.recentLeads.length === 0 ? (
          <div className="p-12 text-center text-slate-400">No pending leads &mdash; every registered borrower has applied.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/60">
                <tr>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Borrower Info</th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Profile Status</th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Registered On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {metrics.recentLeads.map((lead: any) => (
                  <tr key={lead._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-medium text-slate-900">{lead.fullName || 'Profile not started'}</div>
                      <div className="text-sm text-slate-500">{lead.email}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <StatusBadge status={lead.profileStatus} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
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
