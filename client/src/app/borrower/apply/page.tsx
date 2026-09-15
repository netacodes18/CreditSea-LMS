"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

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
        <h1 className="text-2xl font-bold text-gray-900">Apply for a Loan</h1>
        <p className="mt-2 text-gray-600">Select your required loan amount and repayment tenure.</p>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200">{error}</div>}

      <div className="bg-white p-6 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
        <form onSubmit={handleSubmit} className="space-y-8">

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Loan Amount</label>
              <span className="text-lg font-bold text-blue-600">₹{amount.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="50000"
              max="500000"
              step="5000"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>₹50,000</span>
              <span>₹5,00,000</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Tenure (Days)</label>
              <span className="text-lg font-bold text-blue-600">{tenureDays} days</span>
            </div>
            <input
              type="range"
              min="30"
              max="365"
              step="5"
              value={tenureDays}
              onChange={(e) => setTenureDays(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>30 days</span>
              <span>365 days</span>
            </div>
          </div>

          <div className="p-6 bg-blue-50 rounded-lg border border-blue-100 space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Principal</span>
              <span className="font-medium text-gray-900">₹{P.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Interest (12% p.a., Simple Interest)</span>
              <span className="font-medium text-gray-900">₹{simpleInterest.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-blue-200 pt-3">
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Repayment</span>
              <span className="text-2xl font-extrabold text-blue-900">₹{totalRepayment.toLocaleString()}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-blue-600 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 transition-colors"
          >
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}
