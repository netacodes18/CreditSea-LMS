"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function SalesDashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const res = await api.get('/sales/dashboard');
      if (res.data.success) {
        setMetrics(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!metrics) return <div>Error loading metrics</div>;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sales Analytics Dashboard</h1>
        <p className="mt-2 text-gray-600">High-level view of LMS conversion metrics and active leads.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-900/5 p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Total Registered Borrowers</dt>
          <dd className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">{metrics.totalBorrowers}</dd>
        </div>
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-900/5 p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Total Applications</dt>
          <dd className="mt-2 text-3xl font-semibold tracking-tight text-indigo-600">{metrics.totalApplications}</dd>
        </div>
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-900/5 p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Pending Review</dt>
          <dd className="mt-2 text-3xl font-semibold tracking-tight text-yellow-600">{metrics.pendingReview}</dd>
        </div>
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-900/5 p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Disbursed Volume</dt>
          <dd className="mt-2 text-3xl font-semibold tracking-tight text-green-600">
            ₹{(metrics.totalDisbursedVolumePaise / 100).toLocaleString()}
          </dd>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden mt-8">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Leads (Registered, Not Yet Applied)</h2>
          <p className="mt-1 text-sm text-gray-500">Borrowers who signed up but haven&apos;t submitted a loan application yet.</p>
        </div>

        {metrics.recentLeads.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No pending leads &mdash; every registered borrower has applied.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3.5 text-left text-sm font-semibold text-gray-900">Borrower Info</th>
                <th scope="col" className="px-6 py-3.5 text-left text-sm font-semibold text-gray-900">Profile Status</th>
                <th scope="col" className="px-6 py-3.5 text-left text-sm font-semibold text-gray-900">Registered On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {metrics.recentLeads.map((lead: any) => (
                <tr key={lead._id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{lead.fullName || 'Profile not started'}</div>
                    <div className="text-sm text-gray-500">{lead.email}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                      lead.profileStatus === 'PASSED' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                      lead.profileStatus === 'FAILED' ? 'bg-red-50 text-red-700 ring-red-600/10' :
                      lead.profileStatus === 'NOT_EVALUATED' ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20' :
                      'bg-gray-50 text-gray-600 ring-gray-500/10'
                    }`}>
                      {lead.profileStatus.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {new Date(lead.registeredAt).toLocaleDateString()}
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
