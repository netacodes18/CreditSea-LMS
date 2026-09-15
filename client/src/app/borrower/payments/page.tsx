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
        <div className="neo-card flex flex-col items-center gap-3 px-10 py-8">
          <Loader2 className="w-7 h-7 animate-spin text-[var(--ink)]" />
          <p className="text-sm font-bold uppercase tracking-wide text-[var(--ink)]">Loading payments…</p>
        </div>
      </div>
    );
  }

  const selectedLoan = loans.find(l => l._id === selectedLoanId);
  const inputClass = "mt-1.5 block w-full rounded-xl border border-[var(--line)] bg-white py-2.5 px-3.5 text-[var(--ink)] font-medium focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316] transition-all sm:text-sm";
  const inputShadow = { boxShadow: '0 1px 2px rgba(15,32,51,0.06)' };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <p className="text-xs font-bold tracking-widest uppercase text-[var(--ink)]/50 mb-1">Borrower Portal</p>
        <h1 className="text-3xl font-bold text-[var(--ink)] tracking-tight">Payments</h1>
        <p className="mt-2 text-[var(--ink)]/60 font-medium">View your active loans and submit EMI payments.</p>
      </div>

      {error && (
        <div className="neo-card p-4 flex items-start gap-2 animate-scale-in" style={{ backgroundColor: 'var(--danger)', color: '#fff' }}>
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span className="text-sm font-bold">{error}</span>
        </div>
      )}
      {success && (
        <div className="neo-card p-4 flex items-start gap-2 animate-scale-in" style={{ backgroundColor: '#059669', color: 'var(--ink)' }}>
          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
          <span className="text-sm font-bold">{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Make Payment Form */}
        <div className="neo-card p-6 sm:p-8">
          <h2 className="text-lg font-bold text-[var(--ink)] mb-6 flex items-center gap-2">
            <Wallet className="w-5 h-5" style={{ color: '#2563eb' }} /> Make a Payment
          </h2>
          {loans.length === 0 ? (
            <p className="text-sm text-[var(--ink)]/50 font-bold">You have no active disbursed loans requiring payment.</p>
          ) : (
            <form onSubmit={handlePayment} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-[var(--ink)]">Select Loan</label>
                <select
                  value={selectedLoanId}
                  onChange={(e) => setSelectedLoanId(e.target.value)}
                  className={inputClass}
                  style={inputShadow}
                >
                  {loans.map(loan => (
                    <option key={loan._id} value={loan._id}>
                      Loan {loan._id.slice(-6).toUpperCase()} - Bal: ₹{(loan.outstandingPaise / 100).toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              {selectedLoan && (
                <div className="p-4 rounded-xl border border-[var(--line)] space-y-1.5" style={{ backgroundColor: 'var(--paper)' }}>
                  <p className="text-sm text-[var(--ink)] flex justify-between font-medium">
                    <span>Outstanding Balance:</span>
                    <span className="font-bold">₹{(selectedLoan.outstandingPaise / 100).toLocaleString()}</span>
                  </p>
                  <p className="text-sm text-[var(--ink)] flex justify-between font-medium">
                    <span>Expected EMI:</span>
                    <span className="font-bold">₹{(selectedLoan.emiPaise / 100).toLocaleString()}</span>
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-[var(--ink)]">Payment Amount (₹)</label>
                <input
                  type="number"
                  min="1"
                  max={selectedLoan ? selectedLoan.outstandingPaise / 100 : undefined}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className={inputClass}
                  style={inputShadow}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--ink)]">Bank UTR / Reference ID</label>
                <input
                  type="text"
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                  placeholder="e.g. UPI123456789"
                  className={`${inputClass} uppercase`}
                  style={inputShadow}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full neo-btn px-3 py-3 text-sm disabled:opacity-50"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {submitting ? 'Processing...' : 'Submit Payment'}
              </button>
            </form>
          )}
        </div>

        {/* Payment History */}
        <div className="neo-card overflow-hidden flex flex-col">
          <div className="p-6 border-b border-[var(--line)]">
            <h2 className="text-lg font-bold text-[var(--ink)] flex items-center gap-2">
              <Receipt className="w-5 h-5" style={{ color: '#2563eb' }} /> Payment History
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[500px]">
            {payments.length === 0 ? (
              <div className="p-10 text-center">
                <Receipt className="w-8 h-8 text-[var(--ink)]/30 mx-auto mb-2" />
                <p className="text-sm text-[var(--ink)]/50 font-bold">No payment history found.</p>
              </div>
            ) : (
              <ul className="divide-y divide-[var(--line)]">
                {payments.map(p => (
                  <li key={p._id} className="p-6 hover:bg-[var(--paper)] transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-bold text-[var(--ink)]">
                          ₹{(p.amountPaise / 100).toLocaleString()}
                        </p>
                        <p className="text-xs text-[var(--ink)]/60 mt-1 font-medium">Loan: {p.applicationId.slice(-6).toUpperCase()}</p>
                        <p className="text-xs text-[var(--ink)]/60 font-mono mt-1 font-bold">UTR: {p.utr}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-[var(--ink)]/60 font-medium">{new Date(p.paymentDate).toLocaleDateString()}</p>
                        <span className="neo-chip mt-2" style={{ backgroundColor: '#059669', color: 'var(--ink)' }}>
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
