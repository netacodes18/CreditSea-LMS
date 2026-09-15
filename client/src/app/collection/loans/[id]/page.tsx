"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

export default function CollectionLoanDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [data, setData] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Payment Form State
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentUtr, setPaymentUtr] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [loanRes, paymentsRes] = await Promise.all([
        api.get(`/collection/loans/${id}`),
        api.get(`/collection/loans/${id}/payments`)
      ]);
      
      if (loanRes.data.success) setData(loanRes.data.data);
      if (paymentsRes.data.success) setPayments(paymentsRes.data.data);
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

    try {
      const res = await api.post(`/collection/loans/${id}/payments`, { 
        amountPaise: Number(paymentAmount) * 100,
        utr: paymentUtr
      });
      if (res.data.success) {
        setPaymentAmount('');
        setPaymentUtr('');
        fetchData();
      }
    } catch (err: any) {
      setPaymentError(err.response?.data?.message || 'Failed to record payment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>Loan not found</div>;

  const { loan, profile } = data;

  return (
    <div className="max-w-5xl space-y-6">
      <Link href="/collection/dashboard" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
        &larr; Back to active loans
      </Link>
      
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Loan {loan._id.slice(-6).toUpperCase()}</h1>
        <span className={`inline-flex items-center rounded-md px-3 py-1 text-sm font-medium ring-1 ring-inset ${
          loan.loanStatus === 'DISBURSED' ? 'bg-blue-50 text-blue-700 ring-blue-700/10' :
          loan.loanStatus === 'CLOSED' ? 'bg-green-50 text-green-700 ring-green-600/20' :
          'bg-gray-50 text-gray-700 ring-gray-600/10'
        }`}>
          {loan.loanStatus.replace(/_/g, ' ')}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Borrower Info */}
        <div className="bg-white p-6 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Borrower Details</h2>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-gray-500 font-medium">Name</dt>
              <dd className="text-gray-900 mt-1">{profile.fullName}</dd>
            </div>
            <div>
              <dt className="text-gray-500 font-medium">Email</dt>
              <dd className="text-gray-900 mt-1">{loan.borrowerId?.email}</dd>
            </div>
            <div>
              <dt className="text-gray-500 font-medium">PAN</dt>
              <dd className="text-gray-900 mt-1">{profile.pan}</dd>
            </div>
          </dl>
        </div>

        {/* Financial Snapshot */}
        <div className="bg-white p-6 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Financial Snapshot</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="text-xs font-medium text-gray-500 uppercase">Principal</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">₹{(loan.loanAmountPaise / 100).toLocaleString()}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="text-xs font-medium text-gray-500 uppercase">Interest</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">₹{(loan.simpleInterestPaise / 100).toLocaleString()}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-md">
              <p className="text-xs font-medium text-blue-600 uppercase">Total Repayment</p>
              <p className="mt-1 text-lg font-bold text-blue-900">₹{(loan.totalRepaymentPaise / 100).toLocaleString()}</p>
            </div>
            <div className="p-4 bg-red-50 rounded-md ring-1 ring-red-100">
              <p className="text-xs font-medium text-red-600 uppercase">Outstanding Balance</p>
              <p className="mt-1 text-xl font-extrabold text-red-700">₹{(loan.outstandingPaise / 100).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Record Payment Form */}
        <div className="bg-white p-6 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Record Payment</h2>
          
          {loan.loanStatus === 'CLOSED' ? (
            <div className="p-4 bg-green-50 text-green-700 rounded-md">
              This loan is fully paid and closed. No further payments can be recorded.
            </div>
          ) : (
            <form onSubmit={handleRecordPayment} className="space-y-4">
              {paymentError && (
                <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
                  {paymentError}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Payment Amount (₹)</label>
                <div className="mt-1 flex gap-2 items-center">
                  <input
                    type="number"
                    min="1"
                    max={loan.outstandingPaise / 100}
                    required
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                    placeholder="Enter amount"
                  />
                  <button 
                    type="button" 
                    onClick={() => setPaymentAmount((loan.outstandingPaise / 100).toString())}
                    className="text-xs text-indigo-600 font-medium whitespace-nowrap hover:text-indigo-800"
                  >
                    Pay Full
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">Max allowed: ₹{(loan.outstandingPaise / 100).toLocaleString()}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">UTR / Reference Number</label>
                <input
                  type="text"
                  required
                  value={paymentUtr}
                  onChange={(e) => setPaymentUtr(e.target.value)}
                  className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                  placeholder="e.g. UTR123456789"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
              >
                {submitting ? 'Processing...' : 'Confirm Payment'}
              </button>
            </form>
          )}
        </div>

        {/* Payment History */}
        <div className="bg-white p-6 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Payment History</h2>
          
          {payments.length === 0 ? (
            <p className="text-sm text-gray-500">No payments recorded yet.</p>
          ) : (
            <div className="flow-root">
              <ul className="-mb-8">
                {payments.map((payment, paymentIdx) => (
                  <li key={payment._id}>
                    <div className="relative pb-8">
                      {paymentIdx !== payments.length - 1 ? (
                        <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                            <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                            </svg>
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-gray-500">
                              Payment of <span className="font-medium text-gray-900">₹{(payment.amountPaise / 100).toLocaleString()}</span>
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">Ref: {payment.utr}</p>
                          </div>
                          <div className="whitespace-nowrap text-right text-sm text-gray-500">
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
    </div>
  );
}
