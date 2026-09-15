"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import StatusBadge from '@/components/StatusBadge';
import { ArrowLeft, Loader2, CheckCheck, Banknote } from 'lucide-react';

const ACCENT = '#10b981';

export default function DisbursementLoanDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLoan();
  }, [id]);

  const fetchLoan = async () => {
    try {
      const res = await api.get(`/admin/loans/${id}`);
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDisburse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference) return;

    setSubmitting(true);
    setError('');

    try {
      const res = await api.post(`/admin/loans/${id}/disburse`, { reference });
      if (res.data.success) {
        fetchLoan();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Disbursement failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card-surface p-16 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: ACCENT }} />
          <p className="text-sm text-slate-400">Loading loan…</p>
        </div>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card-surface p-16 text-center text-slate-400">Loan not found</div>
      </div>
    );
  }

  const { loan, profile } = data;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/disbursement/loans" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to queue
      </Link>

      <div className="flex justify-between items-center flex-wrap gap-3">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Loan {loan._id.slice(-6).toUpperCase()}</h1>
        <StatusBadge status={loan.loanStatus} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Borrower Info */}
        <div className="card-surface p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Borrower Details</h2>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-slate-500 font-medium">Name</dt>
              <dd className="text-slate-900 mt-1">{profile.fullName}</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Email</dt>
              <dd className="text-slate-900 mt-1">{loan.borrowerId?.email}</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Bank Details / PAN</dt>
              <dd className="text-slate-900 mt-1">{profile.pan}</dd>
            </div>
          </dl>
        </div>

        {/* Loan Financials */}
        <div className="card-surface p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Disbursement Terms</h2>
          <dl className="space-y-4 text-sm">
            <div className="p-3 rounded-xl" style={{ backgroundColor: `${ACCENT}1a` }}>
              <dt className="font-semibold uppercase tracking-wide text-xs" style={{ color: ACCENT }}>Amount to Disburse (Principal Only)</dt>
              <dd className="mt-1 font-extrabold text-2xl" style={{ color: ACCENT }}>₹{(loan.loanAmountPaise / 100).toLocaleString()}</dd>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <dt className="text-slate-500 font-medium">Interest</dt>
              <dd className="text-slate-900 font-medium text-right">₹{(loan.simpleInterestPaise / 100).toLocaleString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 font-medium">Total Borrower Repayment</dt>
              <dd className="text-slate-900 font-bold text-right">₹{(loan.totalRepaymentPaise / 100).toLocaleString()}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Action Area */}
      <div className="card-surface p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Record Disbursement</h2>

        {loan.loanStatus === 'SANCTIONED' ? (
          <form onSubmit={handleDisburse} className="max-w-md space-y-4">
            {error && <div className="p-3 text-sm text-rose-700 bg-rose-50 rounded-xl">{error}</div>}

            <div>
              <label className="block text-sm font-medium text-slate-700">Bank UTR / Transaction Reference</label>
              <input
                type="text"
                required
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="mt-1 block w-full rounded-xl border-0 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 px-3 outline-none"
                style={{ ['--tw-ring-color' as any]: ACCENT }}
                placeholder="e.g. UTR987654321"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl px-3 py-2.5 text-sm font-semibold text-white shadow-md inline-flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5 disabled:opacity-50"
              style={{ backgroundColor: ACCENT }}
            >
              <Banknote className="w-4 h-4" /> {submitting ? 'Processing...' : 'Mark as Disbursed'}
            </button>
          </form>
        ) : loan.loanStatus === 'DISBURSED' ? (
          <div className="p-4 rounded-xl flex items-start gap-3" style={{ backgroundColor: `${ACCENT}1a` }}>
            <CheckCheck className="w-5 h-5 mt-0.5 shrink-0" style={{ color: ACCENT }} />
            <p className="text-sm font-medium" style={{ color: ACCENT }}>
              Funds disbursed successfully. <br/>
              <span className="font-normal mt-1 block">Reference: {loan.disbursementReference}</span>
            </p>
          </div>
        ) : (
          <div className="p-4 bg-slate-50 rounded-xl text-slate-500 text-sm">
            This loan is not in a sanctioned state. Current state: {loan.loanStatus}
          </div>
        )}
      </div>
    </div>
  );
}
