"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

interface LoanApplication {
  _id: string;
  loanAmountPaise: number;
  tenureDays: number;
  interestRateBps: number;
  totalRepaymentPaise: number;
  loanStatus: string;
  createdAt: string;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/borrower/loans');
      if (res.data.success) {
        setApplications(res.data.data);
      }
    } catch (err: any) {
      setError('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading applications...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
          <p className="mt-2 text-gray-600">Track the status of your loan applications.</p>
        </div>
        <Link
          href="/borrower/apply"
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
        >
          New Application
        </Link>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200">{error}</div>}

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
        {applications.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            You haven't applied for a loan yet.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Application ID</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Tenure</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total Repayment</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {applications.map((app) => (
                <tr key={app._id}>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 font-mono">
                    {app._id.slice(-6).toUpperCase()}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 font-medium">
                    ₹{((app.loanAmountPaise || 0) / 100).toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {app.tenureDays} days
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    ₹{((app.totalRepaymentPaise || 0) / 100).toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                      app.loanStatus === 'SUBMITTED' ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20' :
                      app.loanStatus === 'DISBURSED' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                      app.loanStatus === 'REJECTED' ? 'bg-red-50 text-red-700 ring-red-600/10' :
                      'bg-blue-50 text-blue-700 ring-blue-700/10'
                    }`}>
                      {app.loanStatus.replace(/_/g, ' ')}
                    </span>
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
