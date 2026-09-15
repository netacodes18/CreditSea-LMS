"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

export default function AdminLoanDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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

  const handleSanction = async (action: 'APPROVE' | 'REJECT') => {
    if (!confirm(`Are you sure you want to ${action} this loan?`)) return;
    
    setSubmitting(true);
    try {
      const reason = action === 'REJECT' ? prompt("Enter rejection reason:") : undefined;
      const res = await api.post(`/admin/loans/${id}/sanction`, { action, reason });
      if (res.data.success) {
        fetchLoan();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Action failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDisburse = async () => {
    const reference = prompt("Enter UTR/Transaction Reference number:");
    if (!reference) return;
    
    setSubmitting(true);
    try {
      const res = await api.post(`/admin/loans/${id}/disburse`, { reference });
      if (res.data.success) {
        fetchLoan();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Disbursement failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>Loan not found</div>;

  const { loan, profile } = data;

  return (
    <div className="max-w-4xl space-y-6">
      <Link href="/admin/loans" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
        &larr; Back to all loans
      </Link>
      
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Loan {loan._id.slice(-6).toUpperCase()}</h1>
        <span className={`inline-flex items-center rounded-md px-3 py-1 text-sm font-medium ring-1 ring-inset ${
          loan.loanStatus === 'APPLIED' ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20' :
          loan.loanStatus === 'SANCTIONED' ? 'bg-blue-50 text-blue-700 ring-blue-700/10' :
          loan.loanStatus === 'DISBURSED' ? 'bg-green-50 text-green-700 ring-green-600/20' :
          'bg-red-50 text-red-700 ring-red-600/10'
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
              <dt className="text-gray-500 font-medium">PAN</dt>
              <dd className="text-gray-900 mt-1">{profile.pan}</dd>
            </div>
            <div>
              <dt className="text-gray-500 font-medium">Monthly Salary</dt>
              <dd className="text-gray-900 mt-1">₹{(profile.monthlySalaryPaise / 100).toLocaleString()}</dd>
            </div>
          </dl>
        </div>

        {/* Loan Request Info */}
        <div className="bg-white p-6 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Loan Terms</h2>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-gray-500 font-medium">Principal Amount</dt>
              <dd className="text-gray-900 mt-1 font-bold text-lg">₹{(loan.loanAmountPaise / 100).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-gray-500 font-medium">Tenure</dt>
              <dd className="text-gray-900 mt-1">{loan.tenureDays / 30} months</dd>
            </div>
            <div>
              <dt className="text-gray-500 font-medium">Interest Rate</dt>
              <dd className="text-gray-900 mt-1">{(loan.interestRateBps / 100).toFixed(2)}% p.a.</dd>
            </div>
            <div>
              <dt className="text-gray-500 font-medium">Total Repayment Amount</dt>
              <dd className="text-gray-900 mt-1 font-bold text-indigo-600">₹{(loan.totalRepaymentPaise / 100).toLocaleString()}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white p-6 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Attached Documents</h2>
        {loan.salarySlipDocumentId ? (
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-700">{loan.salarySlipDocumentId.originalName}</span>
            <a 
              href={`http://localhost:5000${loan.salarySlipDocumentId.storageKey}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
            >
              View Document
            </a>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No documents attached.</p>
        )}
      </div>

      {/* Actions */}
      <div className="bg-gray-50 p-6 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Admin Actions</h2>
        
        {loan.loanStatus === 'APPLIED' && (
          <div className="flex gap-4">
            <button
              onClick={() => handleSanction('APPROVE')}
              disabled={submitting}
              className="rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
            >
              Approve Sanction
            </button>
            <button
              onClick={() => handleSanction('REJECT')}
              disabled={submitting}
              className="rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-50 disabled:opacity-50"
            >
              Reject Application
            </button>
          </div>
        )}

        {loan.loanStatus === 'SANCTIONED' && (
          <div>
            <p className="text-sm text-gray-500 mb-4">This loan is approved and awaiting disbursement.</p>
            <button
              onClick={handleDisburse}
              disabled={submitting}
              className="rounded-md bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 disabled:opacity-50"
            >
              Record Disbursement
            </button>
          </div>
        )}

        {loan.loanStatus === 'DISBURSED' && (
          <div className="p-4 bg-green-50 rounded-md">
            <p className="text-sm text-green-700 font-medium">
              Funds disbursed successfully. <br/>
              Reference: {loan.disbursementReference}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
