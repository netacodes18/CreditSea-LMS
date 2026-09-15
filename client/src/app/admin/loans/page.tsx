"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

export default function AdminLoansPage() {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const res = await api.get('/admin/loans');
      if (res.data.success) {
        setLoans(res.data.data);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">All Loan Applications</h1>
      
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
        {loans.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No applications found.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">ID</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Borrower</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Tenure</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loans.map((loan) => (
                <tr key={loan._id}>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 font-mono">
                    {loan._id.slice(-6).toUpperCase()}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                    {loan.borrowerId?.name || 'Unknown'} <br/>
                    <span className="text-xs text-gray-500">{loan.borrowerId?.email}</span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                    ₹{(loan.loanAmountPaise / 100).toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {loan.tenureDays / 30} mo
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                      loan.loanStatus === 'APPLIED' ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20' :
                      loan.loanStatus === 'SANCTIONED' ? 'bg-blue-50 text-blue-700 ring-blue-700/10' :
                      loan.loanStatus === 'DISBURSED' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                      'bg-red-50 text-red-700 ring-red-600/10'
                    }`}>
                      {loan.loanStatus.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm font-medium">
                    <Link href={`/admin/loans/${loan._id}`} className="text-indigo-600 hover:text-indigo-900">
                      Review &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
