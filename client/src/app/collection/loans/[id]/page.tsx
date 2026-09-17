"use client";

import { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { createIdempotencyKey } from '@/lib/idempotency';
import Link from 'next/link';
import StatusBadge from '@/components/StatusBadge';
import OverdueBadge from '@/components/OverdueBadge';
import ActivityTimeline from '@/components/ActivityTimeline';
import { ArrowLeft, Loader2, CheckCircle2, ReceiptText } from 'lucide-react';

const ACCENT = '#0891b2';

export default function CollectionLoanDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [data, setData] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Payment Form State
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentUtr, setPaymentUtr] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  // idempotency key, reused across retries of the same attempt
  const idempotencyKeyRef = useRef<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [loanRes, paymentsRes, historyRes] = await Promise.all([
        api.get(`/collection/loans/${id}`),
        api.get(`/collection/loans/${id}/payments`),
        api.get(`/collection/loans/${id}/history`)
      ]);

      if (loanRes.data.success) setData(loanRes.data.data);
      if (paymentsRes.data.success) setPayments(paymentsRes.data.data);
      if (historyRes.data.success) setHistory(historyRes.data.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentAmount || !paymentUtr) return;

    setSubmitting(true);
    setPaymentError('');

    if (!idempotencyKeyRef.current) idempotencyKeyRef.current = createIdempotencyKey();

    try {
      const res = await api.post(
        `/collection/loans/${id}/payments`,
        {
          amountPaise: Math.round(Number(paymentAmount) * 100),
          utr: paymentUtr
        },
        { headers: { 'Idempotency-Key': idempotencyKeyRef.current } }
      );
      if (res.data.success) {
        idempotencyKeyRef.current = null; // next payment gets a fresh key
        setPaymentAmount('');
        setPaymentUtr('');
        fetchData();
      }
    } catch (err: any) {
      if (err.response?.status === 422) {
        // key was tied to different data — start fresh
        idempotencyKeyRef.current = null;
      }
      setPaymentError(err.response?.data?.message || 'Failed to record payment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="neo-card p-16 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--ink)]" />
          <p className="text-sm font-bold text-[var(--ink)]/50">Loading loan…</p>
        </div>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="neo-card p-16 text-center text-[var(--ink)]/50 font-bold">Loan not found</div>
      </div>
    );
  }

  const { loan, profile, overdue } = data;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link href="/collection/dashboard" className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--ink)]/60 hover:text-[var(--ink)] transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to active loans
      </Link>

      <div className="flex justify-between items-center flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-[var(--ink)] tracking-tight">Loan {loan._id.slice(-6).toUpperCase()}</h1>
        <div className="flex items-center gap-2">
          <OverdueBadge overdue={overdue} />
          <StatusBadge status={loan.loanStatus} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
              <dt className="text-[var(--ink)]/50 font-bold uppercase text-xs tracking-wide">PAN</dt>
              <dd className="text-[var(--ink)] mt-1 font-bold">{profile.pan}</dd>
            </div>
          </dl>
        </div>

        {/* Financial Snapshot */}
        <div className="neo-card p-6 md:col-span-2">
          <h2 className="text-lg font-bold text-[var(--ink)] mb-4">Financial Snapshot</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="neo-card-sm p-4">
              <p className="text-xs font-bold text-[var(--ink)]/50 uppercase tracking-wide">Principal</p>
              <p className="mt-1 text-lg font-bold text-[var(--ink)]">₹{(loan.loanAmountPaise / 100).toLocaleString()}</p>
            </div>
            <div className="neo-card-sm p-4">
              <p className="text-xs font-bold text-[var(--ink)]/50 uppercase tracking-wide">Interest</p>
              <p className="mt-1 text-lg font-bold text-[var(--ink)]">₹{(loan.simpleInterestPaise / 100).toLocaleString()}</p>
            </div>
            <div className="neo-card-sm p-4" style={{ backgroundColor: ACCENT }}>
              <p className="text-xs font-bold uppercase tracking-wide text-white">Total Repayment</p>
              <p className="mt-1 text-lg font-bold text-white">₹{(loan.totalRepaymentPaise / 100).toLocaleString()}</p>
            </div>
            <div className="neo-card-sm p-4" style={{ backgroundColor: 'var(--danger)' }}>
              <p className="text-xs font-bold uppercase tracking-wide text-white">Outstanding Balance</p>
              <p className="mt-1 text-xl font-bold text-white">₹{(loan.outstandingPaise / 100).toLocaleString()}</p>
            </div>
          </div>
          {overdue?.isOverdue && (
            <div className="mt-4 neo-card-sm p-4 flex items-center justify-between flex-wrap gap-2" style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5' }}>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide" style={{ color: '#b91c1c' }}>
                  {overdue.daysOverdue} {overdue.daysOverdue === 1 ? 'day' : 'days'} past due date
                </p>
                <p className="text-[11px] text-[var(--ink)]/60 font-medium mt-0.5">
                  Due {new Date(overdue.dueDate).toLocaleDateString()} · penalty interest at 2% p.a. on the outstanding balance
                </p>
              </div>
              <p className="text-lg font-bold" style={{ color: '#b91c1c' }}>+₹{(overdue.penaltyInterestPaise / 100).toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Record Payment Form */}
        <div className="neo-card p-6">
          <h2 className="text-lg font-bold text-[var(--ink)] mb-4">Record Payment</h2>

          {loan.loanStatus === 'CLOSED' ? (
            <div className="neo-card-sm p-4 flex items-center gap-2 text-sm font-bold text-[var(--ink)]" style={{ backgroundColor: '#059669' }}>
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              This loan is fully paid and closed. No further payments can be recorded.
            </div>
          ) : (
            <form onSubmit={handleRecordPayment} className="space-y-4">
              {paymentError && (
                <div className="neo-card-sm p-3 text-sm font-bold text-white" style={{ backgroundColor: 'var(--danger)' }}>
                  {paymentError}
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-[var(--ink)]">Payment Amount (₹)</label>
                <div className="mt-1 flex gap-2 items-center">
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    max={loan.outstandingPaise / 100}
                    required
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="block w-full rounded-lg border border-[var(--line)] py-2 px-3 text-[var(--ink)] font-bold outline-none focus:ring-0"
                    placeholder="Enter amount"
                  />
                  <button
                    type="button"
                    onClick={() => setPaymentAmount((loan.outstandingPaise / 100).toString())}
                    className="text-xs font-bold whitespace-nowrap hover:underline text-[var(--ink)]"
                  >
                    Pay Full
                  </button>
                </div>
                <p className="mt-1 text-xs text-[var(--ink)]/60 font-bold">Max allowed: ₹{(loan.outstandingPaise / 100).toLocaleString()}</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--ink)]">UTR / Reference Number</label>
                <input
                  type="text"
                  required
                  value={paymentUtr}
                  onChange={(e) => setPaymentUtr(e.target.value.toUpperCase())}
                  className="mt-1 block w-full rounded-lg border border-[var(--line)] py-2 px-3 text-[var(--ink)] font-bold outline-none focus:ring-0"
                  placeholder="e.g. UTR123456789"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="neo-btn w-full px-3 py-2.5 text-sm disabled:opacity-50"
                style={{ backgroundColor: ACCENT, color: '#fff' }}
              >
                {submitting ? 'Processing...' : 'Confirm Payment'}
              </button>
            </form>
          )}
        </div>

        {/* Payment History */}
        <div className="neo-card p-6">
          <h2 className="text-lg font-bold text-[var(--ink)] mb-4">Payment History</h2>

          {payments.length === 0 ? (
            <p className="text-sm text-[var(--ink)]/60 font-bold flex items-center gap-2">
              <ReceiptText className="w-4 h-4 text-[var(--ink)]/30" /> No payments recorded yet.
            </p>
          ) : (
            <div className="flow-root">
              <ul className="-mb-8">
                {payments.map((payment, paymentIdx) => (
                  <li key={payment._id}>
                    <div className="relative pb-8">
                      {paymentIdx !== payments.length - 1 ? (
                        <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-[var(--ink)]/15" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full flex items-center justify-center border border-[var(--line)]" style={{ backgroundColor: ACCENT }}>
                            <CheckCircle2 className="h-5 w-5 text-white" aria-hidden="true" />
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-[var(--ink)]/70 font-medium">
                              Payment of <span className="font-bold text-[var(--ink)]">₹{(payment.amountPaise / 100).toLocaleString()}</span>
                            </p>
                            <p className="text-xs text-[var(--ink)]/50 mt-0.5 font-bold">Ref: {payment.utr}</p>
                          </div>
                          <div className="whitespace-nowrap text-right text-sm text-[var(--ink)]/60 font-bold">
                            <time dateTime={payment.paymentDate}>
                              {new Date(payment.paymentDate).toLocaleDateString()}
                            </time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Activity */}
      <div className="neo-card p-6">
        <h2 className="text-lg font-bold text-[var(--ink)] mb-4">Activity</h2>
        <ActivityTimeline history={history} />
      </div>
    </div>
  );
}
