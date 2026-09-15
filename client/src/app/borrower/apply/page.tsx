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

  // Simple Interest: SI = (P x R x T) / (365 x 100), R = 12% p.a., T in days
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
        <p className="text-xs font-semibold tracking-widest uppercase text-indigo-500 mb-1">Borrower Portal</p>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Apply for a Loan</h1>
        <p className="mt-2 text-slate-500">Select your required loan amount and repayment tenure.</p>
      </div>

      {error && (
        <div className="card-surface p-4 border-rose-100 bg-rose-50/60 text-rose-700 flex items-start gap-2 animate-scale-in">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div className="card-surface p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-9">

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                <IndianRupee className="w-4 h-4 text-indigo-500" /> Loan Amount
              </label>
              <span className="text-xl font-extrabold text-gradient-static">₹{amount.toLocaleString()}</span>
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
            <div className="flex justify-between text-xs text-slate-400 mt-2">
              <span>₹50,000</span>
              <span>₹5,00,000</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                <CalendarDays className="w-4 h-4 text-indigo-500" /> Tenure (Days)
              </label>
              <span className="text-xl font-extrabold text-gradient-static">{tenureDays} days</span>
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
            <div className="flex justify-between text-xs text-slate-400 mt-2">
              <span>30 days</span>
              <span>365 days</span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl p-[1.5px] bg-gradient-to-br from-violet-400 via-fuchsia-400 to-indigo-400">
            <div className="rounded-2xl bg-white p-6 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-indigo-500 mb-1">
                <Sparkles className="w-3.5 h-3.5" /> Repayment Summary
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>Principal</span>
                <span className="font-medium text-slate-900">₹{P.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>Interest (12% p.a., Simple Interest)</span>
                <span className="font-medium text-slate-900">₹{simpleInterest.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total Repayment</span>
                <span className="text-2xl font-extrabold text-gradient-static">₹{totalRepayment.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full btn-gradient px-3 py-3.5 text-sm inline-flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}
