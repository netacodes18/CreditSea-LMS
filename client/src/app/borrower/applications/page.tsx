"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import StatusBadge from '@/components/StatusBadge';
import { AlertCircle, FileStack, Plus, Loader2 } from 'lucide-react';

interface LoanApplication {
  _id: string;
  loanAmountPaise: number;
  tenureDays: number;
  interestRateBps: number;
  totalRepaymentPaise: number;
  loanStatus: string;
  createdAt: string;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/borrower/loans');
      if (res.data.success) {
        setApplications(res.data.data);
      }
    } catch (err: any) {
      setError('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto flex items-center justify-center py-24">
        <div className="neo-card flex flex-col items-center gap-3 px-10 py-8">
          <Loader2 className="w-7 h-7 animate-spin text-[var(--ink)]" />
          <p className="text-sm font-bold uppercase tracking-wide text-[var(--ink)]">Loading applications…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-widest uppercase text-[var(--ink)]/50 mb-1">Borrower Portal</p>
          <h1 className="text-3xl font-bold text-[var(--ink)] tracking-tight">My Applications</h1>
          <p className="mt-2 text-[var(--ink)]/60 font-medium">Track the status of your loan applications.</p>
        </div>
        <Link
          href="/borrower/apply"
          className="neo-btn px-5 py-2.5 text-sm inline-flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> New Application
        </Link>
      </div>

      {error && (
        <div className="neo-card p-4 flex items-start gap-2 animate-scale-in" style={{ backgroundColor: 'var(--danger)', color: '#fff' }}>
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span className="text-sm font-bold">{error}</span>
        </div>
      )}

      <div className="neo-card overflow-hidden">
        {applications.length === 0 ? (
          <div className="p-10 text-center">
            <FileStack className="w-8 h-8 text-[var(--ink)]/30 mx-auto mb-2" />
            <p className="text-sm text-[var(--ink)]/50 font-bold">You haven't applied for a loan yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--line)]">
              <thead className="bg-[var(--paper)]">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-[var(--ink)]/60 uppercase tracking-wider">Application ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-[var(--ink)]/60 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-[var(--ink)]/60 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-[var(--ink)]/60 uppercase tracking-wider">Tenure</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-[var(--ink)]/60 uppercase tracking-wider">Total Repayment</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-[var(--ink)]/60 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-[var(--paper)] transition-colors">
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-[var(--ink)]/70 font-mono font-bold">
                      {app._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-[var(--ink)]/60 font-medium">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-[var(--ink)] font-bold">
                      ₹{((app.loanAmountPaise || 0) / 100).toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-[var(--ink)]/60 font-medium">
                      {app.tenureDays} days
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-[var(--ink)]/60 font-medium">
                      ₹{((app.totalRepaymentPaise || 0) / 100).toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <StatusBadge status={app.loanStatus} />
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
