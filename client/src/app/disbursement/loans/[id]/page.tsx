"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import StatusBadge from '@/components/StatusBadge';
import { ArrowLeft, Loader2, CheckCheck, Banknote } from 'lucide-react';

const ACCENT = '#059669';

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
        <div className="neo-card p-16 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--ink)]" />
          <p className="text-sm font-bold text-[var(--ink)]/50">Loading loan…</p>
        </div>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="neo-card p-16 text-center text-[var(--ink)]/50 font-bold">Loan not found</div>
      </div>
    );
  }

  const { loan, profile } = data;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/disbursement/loans" className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--ink)]/60 hover:text-[var(--ink)] transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to queue
      </Link>

      <div className="flex justify-between items-center flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-[var(--ink)] tracking-tight">Loan {loan._id.slice(-6).toUpperCase()}</h1>
        <StatusBadge status={loan.loanStatus} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Borrower Info */}
        <div className="neo-card p-6">
          <h2 className="text-lg font-bold text-[var(--ink)] mb-4">Borrower Details</h2>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-[var(--ink)]/50 font-bold uppercase text-xs tracking-wide">Name</dt>
              <dd className="text-[var(--ink)] mt-1 font-bold">{profile.fullName}</dd>
            </div>
            <div>
              <dt className="text-[var(--ink)]/50 font-bold uppercase text-xs tracking-wide">Email</dt>
              <dd className="text-[var(--ink)] mt-1 font-bold">{loan.borrowerId?.email}</dd>
            </div>
            <div>
              <dt className="text-[var(--ink)]/50 font-bold uppercase text-xs tracking-wide">Bank Details / PAN</dt>
              <dd className="text-[var(--ink)] mt-1 font-bold">{profile.pan}</dd>
            </div>
          </dl>
        </div>

        {/* Loan Financials */}
        <div className="neo-card p-6">
          <h2 className="text-lg font-bold text-[var(--ink)] mb-4">Disbursement Terms</h2>
          <dl className="space-y-4 text-sm">
            <div className="neo-card-sm p-3" style={{ backgroundColor: ACCENT }}>
              <dt className="font-bold uppercase tracking-wide text-xs text-[var(--ink)]">Amount to Disburse (Principal Only)</dt>
              <dd className="mt-1 font-bold text-2xl text-[var(--ink)]">₹{(loan.loanAmountPaise / 100).toLocaleString()}</dd>
            </div>
            <div className="flex justify-between border-b-2 border-[var(--ink)]/10 pb-2">
              <dt className="text-[var(--ink)]/50 font-bold uppercase text-xs tracking-wide">Interest</dt>
              <dd className="text-[var(--ink)] font-bold text-right">₹{(loan.simpleInterestPaise / 100).toLocaleString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--ink)]/50 font-bold uppercase text-xs tracking-wide">Total Borrower Repayment</dt>
              <dd className="text-[var(--ink)] font-bold text-right">₹{(loan.totalRepaymentPaise / 100).toLocaleString()}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Action Area */}
      <div className="neo-card p-6">
        <h2 className="text-lg font-bold text-[var(--ink)] mb-4">Record Disbursement</h2>

        {loan.loanStatus === 'SANCTIONED' ? (
          <form onSubmit={handleDisburse} className="max-w-md space-y-4">
            {error && (
              <div className="neo-card-sm p-3 text-sm font-bold text-white" style={{ backgroundColor: 'var(--danger)' }}>
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-[var(--ink)]">Bank UTR / Transaction Reference</label>
              <input
                type="text"
                required
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-[var(--line)] py-2 px-3 text-[var(--ink)] font-bold outline-none focus:ring-0"
                placeholder="e.g. UTR987654321"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="neo-btn w-full px-3 py-2.5 text-sm disabled:opacity-50"
              style={{ backgroundColor: ACCENT }}
            >
              <Banknote className="w-4 h-4" /> {submitting ? 'Processing...' : 'Mark as Disbursed'}
            </button>
          </form>
        ) : loan.loanStatus === 'DISBURSED' ? (
          <div className="neo-card-sm p-4 flex items-start gap-3" style={{ backgroundColor: ACCENT }}>
            <CheckCheck className="w-5 h-5 mt-0.5 shrink-0 text-[var(--ink)]" />
            <div className="text-sm font-bold text-[var(--ink)]">
              Funds disbursed successfully.
              <p className="font-medium mt-1">Reference: {loan.disbursementReference}</p>
              {loan.disbursedAt && (
                <p className="font-medium mt-1">Disbursed on: {new Date(loan.disbursedAt).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        ) : loan.loanStatus === 'CLOSED' ? (
          <div className="neo-card-sm p-4 flex items-start gap-3" style={{ backgroundColor: '#e6f4ee' }}>
            <CheckCheck className="w-5 h-5 mt-0.5 shrink-0" style={{ color: ACCENT }} />
            <div className="text-sm font-bold text-[var(--ink)]">
              Disbursed and fully repaid — this loan is now closed.
              {loan.disbursementReference && (
                <p className="font-medium mt-1">Reference: {loan.disbursementReference}</p>
              )}
              {loan.disbursedAt && (
                <p className="font-medium mt-1">Disbursed on: {new Date(loan.disbursedAt).toLocaleDateString()}</p>
              )}
              {loan.closedAt && (
                <p className="font-medium mt-1">Closed on: {new Date(loan.closedAt).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="neo-card-sm p-4 text-[var(--ink)]/60 text-sm font-bold">
            This loan is not in a sanctioned state. Current state: {loan.loanStatus}
          </div>
        )}
      </div>
    </div>
  );
}
