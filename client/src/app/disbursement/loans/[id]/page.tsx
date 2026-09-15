"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

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

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>Loan not found</div>;

  const { loan, profile } = data;

  return (
    <div className="max-w-4xl space-y-6">
      <Link href="/disbursement/loans" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
        &larr; Back to queue
      </Link>
      
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Loan {loan._id.slice(-6).toUpperCase()}</h1>
        <span className={`inline-flex items-center rounded-md px-3 py-1 text-sm font-medium ring-1 ring-inset ${
          loan.loanStatus === 'SANCTIONED' ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20' :
          loan.loanStatus === 'DISBURSED' ? 'bg-green-50 text-green-700 ring-green-600/20' :
          'bg-gray-50 text-gray-700 ring-gray-600/10'
        }`}>
          {loan.loanStatus.replace(/_/g, ' ')}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
              <dt className="text-gray-500 font-medium">Bank Details / PAN</dt>
              <dd className="text-gray-900 mt-1">{profile.pan}</dd>
            </div>
          </dl>
        </div>

        {/* Loan Financials */}
        <div className="bg-white p-6 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Disbursement Terms</h2>
          <dl className="space-y-4 text-sm">
            <div className="p-3 bg-blue-50 rounded-md border border-blue-100">
              <dt className="text-blue-800 font-semibold uppercase tracking-wide text-xs">Amount to Disburse (Principal Only)</dt>
              <dd className="text-blue-900 mt-1 font-extrabold text-2xl">₹{(loan.loanAmountPaise / 100).toLocaleString()}</dd>
            </div>
            <div className="flex justify-between border-b pb-2">
              <dt className="text-gray-500 font-medium">Interest</dt>
              <dd className="text-gray-900 font-medium text-right">₹{(loan.simpleInterestPaise / 100).toLocaleString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500 font-medium">Total Borrower Repayment</dt>
              <dd className="text-gray-900 font-bold text-right">₹{(loan.totalRepaymentPaise / 100).toLocaleString()}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Action Area */}
      <div className="bg-white p-6 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Record Disbursement</h2>
        
        {loan.loanStatus === 'SANCTIONED' ? (
          <form onSubmit={handleDisburse} className="max-w-md space-y-4">
            {error && <div className="p-3 text-sm text-red-700 bg-red-50 rounded-md">{error}</div>}
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Bank UTR / Transaction Reference</label>
              <input
                type="text"
                required
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                placeholder="e.g. UTR987654321"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:opacity-50"
            >
              {submitting ? 'Processing...' : 'Mark as Disbursed'}
            </button>
          </form>
        ) : loan.loanStatus === 'DISBURSED' ? (
          <div className="p-4 bg-green-50 rounded-md border border-green-100">
            <p className="text-sm text-green-800 font-medium">
              ✅ Funds disbursed successfully. <br/>
              <span className="font-normal text-green-700 mt-1 block">Reference: {loan.disbursementReference}</span>
            </p>
          </div>
        ) : (
          <div className="p-4 bg-gray-50 rounded-md text-gray-500 text-sm">
            This loan is not in a sanctioned state. Current state: {loan.loanStatus}
          </div>
        )}
      </div>
    </div>
  );
}
