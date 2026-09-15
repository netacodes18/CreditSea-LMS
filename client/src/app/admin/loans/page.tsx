"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import StatusBadge from '@/components/StatusBadge';
import { CheckSquare, ArrowRight, Loader2 } from 'lucide-react';

const ACCENT = '#8b5cf6';

export default function AdminLoansPage() {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const res = await api.get('/admin/loans');
      if (res.data.success) {
        setLoans(res.data.data);
      }
    } catch (err: any) {
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
          <p className="text-sm text-slate-400">Loading applications…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md" style={{ backgroundColor: ACCENT }}>
          <CheckSquare className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase mb-0.5" style={{ color: ACCENT }}>Sanction</p>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">All Loan Applications</h1>
        </div>
      </div>

      <div className="card-surface overflow-hidden">
        {loans.length === 0 ? (
          <div className="p-12 text-center text-slate-400">No applications found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/60">
                <tr>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Borrower</th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Tenure</th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loans.map((loan) => (
                  <tr key={loan._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 font-mono">
                      {loan._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                      {loan.borrowerId?.email || 'Unknown borrower'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">
                      ₹{(loan.loanAmountPaise / 100).toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                      {loan.tenureDays / 30} mo
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <StatusBadge status={loan.loanStatus} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                      <Link href={`/admin/loans/${loan._id}`} className="inline-flex items-center gap-1 font-semibold hover:gap-1.5 transition-all" style={{ color: ACCENT }}>
                        Review <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
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
