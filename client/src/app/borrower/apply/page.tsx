"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { AlertCircle, Loader2, IndianRupee, CalendarDays, Sparkles } from 'lucide-react';

export default function ApplyPage() {
  const [amount, setAmount] = useState(50000); // 50,000 INR
  const [tenureDays, setTenureDays] = useState(90); // days
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  // SI = (P x R x T) / (365 x 100)
  const R = 12;
  const P = amount;
  const simpleInterest = Math.round((P * R * tenureDays) / (365 * 100));
  const totalRepayment = P + simpleInterest;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await api.post('/borrower/loans', {
        amountPaise: amount * 100,
        tenureDays,
      });

      if (res.data.success) {
        router.push('/borrower/applications');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit loan application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <p className="text-xs font-bold tracking-widest uppercase text-[var(--ink)]/50 mb-1">Borrower Portal</p>
        <h1 className="text-3xl font-bold text-[var(--ink)] tracking-tight">Apply for a Loan</h1>
        <p className="mt-2 text-[var(--ink)]/60 font-medium">Select your required loan amount and repayment tenure.</p>
      </div>

      {error && (
        <div className="neo-card p-4 flex items-start gap-2 animate-scale-in" style={{ backgroundColor: 'var(--danger)', color: '#fff' }}>
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span className="text-sm font-bold">{error}</span>
        </div>
      )}

      <div className="neo-card p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-9">

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="flex items-center gap-1.5 text-sm font-bold text-[var(--ink)]">
                <IndianRupee className="w-4 h-4" style={{ color: '#2563eb' }} /> Loan Amount
              </label>
              <span className="text-xl font-bold text-[var(--ink)]">₹{amount.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="50000"
              max="500000"
              step="5000"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="brand-range w-full cursor-pointer"
            />
            <div className="flex justify-between text-xs text-[var(--ink)]/50 mt-2 font-bold">
              <span>₹50,000</span>
              <span>₹5,00,000</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="flex items-center gap-1.5 text-sm font-bold text-[var(--ink)]">
                <CalendarDays className="w-4 h-4" style={{ color: '#2563eb' }} /> Tenure (Days)
              </label>
              <span className="text-xl font-bold text-[var(--ink)]">{tenureDays} days</span>
            </div>
            <input
              type="range"
              min="30"
              max="365"
              step="5"
              value={tenureDays}
              onChange={(e) => setTenureDays(Number(e.target.value))}
              className="brand-range w-full cursor-pointer"
            />
            <div className="flex justify-between text-xs text-[var(--ink)]/50 mt-2 font-bold">
              <span>30 days</span>
              <span>365 days</span>
            </div>
          </div>

          <div className="neo-card p-6 space-y-3" style={{ backgroundColor: 'var(--paper)' }}>
            <div className="flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-[var(--ink)]/60 mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Repayment Summary
            </div>
            <div className="flex justify-between text-sm text-[var(--ink)]/70 font-medium">
              <span>Principal</span>
              <span className="font-bold text-[var(--ink)]">₹{P.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-[var(--ink)]/70 font-medium">
              <span>Interest (12% p.a., Simple Interest)</span>
              <span className="font-bold text-[var(--ink)]">₹{simpleInterest.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center rounded-xl border border-[var(--line)] px-4 py-3 mt-1" style={{ backgroundColor: 'var(--primary)' }}>
              <span className="text-sm font-bold text-[var(--ink)] uppercase tracking-wide">Total Repayment</span>
              <span className="text-2xl font-bold text-[var(--ink)]">₹{totalRepayment.toLocaleString()}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full neo-btn px-3 py-3.5 text-sm disabled:opacity-50"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}
