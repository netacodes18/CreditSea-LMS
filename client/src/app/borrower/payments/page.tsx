"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { AlertCircle, CheckCircle2, Wallet, Receipt, Loader2, CheckCircle } from 'lucide-react';

export default function PaymentsPage() {
  const [loans, setLoans] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Payment Form State
  const [selectedLoanId, setSelectedLoanId] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [utr, setUtr] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [loansRes, paymentsRes] = await Promise.all([
        api.get('/borrower/loans'),
        api.get('/borrower/payments')
      ]);

      if (loansRes.data.success) {
        // Only show loans that are disbursed and have outstanding balance
        const activeLoans = loansRes.data.data.filter(
          (l: any) => l.loanStatus === 'DISBURSED' && l.outstandingPaise > 0
        );
        setLoans(activeLoans);
        if (activeLoans.length > 0) setSelectedLoanId(activeLoans[0]._id);
      }

      if (paymentsRes.data.success) {
        setPayments(paymentsRes.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoanId || !amount || !utr) return;

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.post('/borrower/payments', {
        applicationId: selectedLoanId,
        amountPaise: Number(amount) * 100,
        utr
      });

      if (res.data.success) {
        setSuccess('Payment recorded successfully!');
        setAmount('');
        setUtr('');
        fetchData(); // Refresh balances and history
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Payment failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 className="w-7 h-7 animate-spin text-indigo-500" />
          <p className="text-sm">Loading payments...</p>
        </div>
      </div>
    );
  }

  const selectedLoan = loans.find(l => l._id === selectedLoanId);
  const inputClass = "mt-1.5 block w-full rounded-xl border-0 py-2.5 px-3.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm transition-shadow";

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-indigo-500 mb-1">Borrower Portal</p>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Payments</h1>
        <p className="mt-2 text-slate-500">View your active loans and submit EMI payments.</p>
      </div>

      {error && (
        <div className="card-surface p-4 border-rose-100 bg-rose-50/60 text-rose-700 flex items-start gap-2 animate-scale-in">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}
      {success && (
        <div className="card-surface p-4 border-emerald-100 bg-emerald-50/60 text-emerald-700 flex items-start gap-2 animate-scale-in">
          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
          <span className="text-sm">{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Make Payment Form */}
        <div className="card-surface p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-indigo-500" /> Make a Payment
          </h2>
          {loans.length === 0 ? (
            <p className="text-sm text-slate-400">You have no active disbursed loans requiring payment.</p>
          ) : (
            <form onSubmit={handlePayment} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700">Select Loan</label>
                <select
                  value={selectedLoanId}
                  onChange={(e) => setSelectedLoanId(e.target.value)}
                  className={inputClass}
                >
                  {loans.map(loan => (
                    <option key={loan._id} value={loan._id}>
                      Loan {loan._id.slice(-6).toUpperCase()} - Bal: ₹{(loan.outstandingPaise / 100).toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              {selectedLoan && (
                <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-1.5">
                  <p className="text-sm text-indigo-900 flex justify-between">
                    <span>Outstanding Balance:</span>
                    <span className="font-bold">₹{(selectedLoan.outstandingPaise / 100).toLocaleString()}</span>
                  </p>
                  <p className="text-sm text-indigo-900 flex justify-between">
                    <span>Expected EMI:</span>
                    <span className="font-medium">₹{(selectedLoan.emiPaise / 100).toLocaleString()}</span>
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700">Payment Amount (₹)</label>
                <input
                  type="number"
                  min="1"
                  max={selectedLoan ? selectedLoan.outstandingPaise / 100 : undefined}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Bank UTR / Reference ID</label>
                <input
                  type="text"
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                  placeholder="e.g. UPI123456789"
                  className={`${inputClass} uppercase`}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-gradient px-3 py-3 text-sm inline-flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {submitting ? 'Processing...' : 'Submit Payment'}
              </button>
            </form>
          )}
        </div>

        {/* Payment History */}
        <div className="card-surface overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-indigo-500" /> Payment History
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[500px]">
            {payments.length === 0 ? (
              <div className="p-10 text-center">
                <Receipt className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-400">No payment history found.</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {payments.map(p => (
                  <li key={p._id} className="p-6 hover:bg-slate-50/60 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          ₹{(p.amountPaise / 100).toLocaleString()}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">Loan: {p.applicationId.slice(-6).toUpperCase()}</p>
                        <p className="text-xs text-slate-500 font-mono mt-1">UTR: {p.utr}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-500">{new Date(p.paymentDate).toLocaleDateString()}</p>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 mt-2">
                          <CheckCircle className="w-3 h-3" /> Success
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
