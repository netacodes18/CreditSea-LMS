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
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 className="w-7 h-7 animate-spin text-indigo-500" />
          <p className="text-sm">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-indigo-500 mb-1">Borrower Portal</p>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Applications</h1>
          <p className="mt-2 text-slate-500">Track the status of your loan applications.</p>
        </div>
        <Link
          href="/borrower/apply"
          className="btn-gradient px-5 py-2.5 text-sm inline-flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> New Application
        </Link>
      </div>

      {error && (
        <div className="card-surface p-4 border-rose-100 bg-rose-50/60 text-rose-700 flex items-start gap-2 animate-scale-in">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div className="card-surface overflow-hidden">
        {applications.length === 0 ? (
          <div className="p-10 text-center">
            <FileStack className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-400">You haven't applied for a loan yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/60">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Application ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Tenure</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Repayment</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 font-mono">
                      {app._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900 font-semibold">
                      ₹{((app.loanAmountPaise || 0) / 100).toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                      {app.tenureDays} days
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
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
