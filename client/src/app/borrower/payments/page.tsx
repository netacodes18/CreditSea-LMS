"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';

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

  if (loading) return <div>Loading...</div>;

  const selectedLoan = loans.find(l => l._id === selectedLoanId);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="mt-2 text-gray-600">View your active loans and submit EMI payments.</p>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200">{error}</div>}
      {success && <div className="p-4 bg-green-50 text-green-700 rounded-md border border-green-200">{success}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Make Payment Form */}
        <div className="bg-white p-6 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Make a Payment</h2>
          {loans.length === 0 ? (
            <p className="text-sm text-gray-500">You have no active disbursed loans requiring payment.</p>
          ) : (
            <form onSubmit={handlePayment} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Loan</label>
                <select
                  value={selectedLoanId}
                  onChange={(e) => setSelectedLoanId(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm ring-1 ring-inset ring-gray-300"
                >
                  {loans.map(loan => (
                    <option key={loan._id} value={loan._id}>
                      Loan {loan._id.slice(-6).toUpperCase()} - Bal: ₹{(loan.outstandingPaise / 100).toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              {selectedLoan && (
                <div className="p-4 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-900 flex justify-between">
                    <span>Outstanding Balance:</span> 
                    <span className="font-bold">₹{(selectedLoan.outstandingPaise / 100).toLocaleString()}</span>
                  </p>
                  <p className="text-sm text-blue-900 flex justify-between mt-1">
                    <span>Expected EMI:</span> 
                    <span className="font-medium">₹{(selectedLoan.emiPaise / 100).toLocaleString()}</span>
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">Payment Amount (₹)</label>
                <input
                  type="number"
                  min="1"
                  max={selectedLoan ? selectedLoan.outstandingPaise / 100 : undefined}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm ring-1 ring-inset ring-gray-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Bank UTR / Reference ID</label>
                <input
                  type="text"
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                  placeholder="e.g. UPI123456789"
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm ring-1 ring-inset ring-gray-300 uppercase"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-md bg-blue-600 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50"
              >
                {submitting ? 'Processing...' : 'Submit Payment'}
              </button>
            </form>
          )}
        </div>

        {/* Payment History */}
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Payment History</h2>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[500px]">
            {payments.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No payment history found.</div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {payments.map(p => (
                  <li key={p._id} className="p-6 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          ₹{(p.amountPaise / 100).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Loan: {p.applicationId.slice(-6).toUpperCase()}</p>
                        <p className="text-xs text-gray-500 font-mono mt-1">UTR: {p.utr}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{new Date(p.paymentDate).toLocaleDateString()}</p>
                        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 mt-2">
                          Success
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
