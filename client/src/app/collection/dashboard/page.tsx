"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import StatusBadge from '@/components/StatusBadge';
import OverdueBadge from '@/components/OverdueBadge';
import { HandCoins, ArrowRight, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

const ACCENT = '#0891b2';

export default function CollectionDashboard() {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);

  useEffect(() => {
    fetchLoans(page);
  }, [page]);

  const fetchLoans = async (currentPage: number) => {
    setLoading(true);
    try {
      const res = await api.get('/collection/loans', { params: { page: currentPage, limit: 50 } });
      if (res.data.success) {
        setLoans(res.data.data);
        if (res.data.pagination) setPagination(res.data.pagination);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    if (page > 1) setPage(p => p - 1);
  };

  const handleNext = () => {
    if (pagination && page < pagination.totalPages) setPage(p => p + 1);
  };

  if (loading && loans.length === 0) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="neo-card p-16 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--ink)]" />
          <p className="text-sm font-bold text-[var(--ink)]/50">Loading collections…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center border border-[var(--line)]" style={{ backgroundColor: ACCENT }}>
          <HandCoins className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-xs font-bold tracking-widest uppercase mb-0.5 text-[var(--ink)]/50">Collection</p>
          <h1 className="text-2xl font-bold text-[var(--ink)] tracking-tight">Active Collections</h1>
        </div>
      </div>

      <div className="neo-card overflow-hidden flex flex-col">
        {loans.length === 0 ? (
          <div className="p-12 text-center text-[var(--ink)]/50 font-bold">No active loans for collection.</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[var(--line)]">
                <thead className="bg-[var(--paper)]">
                  <tr>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-[var(--ink)]/60 uppercase tracking-wider">Loan ID</th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-[var(--ink)]/60 uppercase tracking-wider">Borrower</th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-[var(--ink)]/60 uppercase tracking-wider">Total Repayment</th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-[var(--ink)]/60 uppercase tracking-wider">Outstanding</th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-[var(--ink)]/60 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-[var(--ink)]/60 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line)]">
                  {loans.map((loan) => (
                    <tr key={loan._id} className="hover:bg-[var(--paper)] transition-colors">
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-[var(--ink)]/60 font-mono font-bold">
                        {loan._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-[var(--ink)]">
                        {loan.borrowerId?.email || 'Unknown borrower'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-[var(--ink)]">
                        ₹{(loan.totalRepaymentPaise / 100).toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-bold" style={{ color: 'var(--danger)' }}>
                        ₹{(loan.outstandingPaise / 100).toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={loan.loanStatus} />
                          <OverdueBadge overdue={loan.overdue} />
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                        <Link href={`/collection/loans/${loan._id}`} className="inline-flex items-center gap-1 font-bold hover:gap-1.5 transition-all text-[var(--ink)]">
                          Manage <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {pagination && pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-[var(--line)] bg-[var(--paper)] flex items-center justify-between">
                <p className="text-sm font-medium text-[var(--ink)]/60">
                  Page <span className="font-bold text-[var(--ink)]">{pagination.page}</span> of <span className="font-bold text-[var(--ink)]">{pagination.totalPages}</span>
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevious}
                    disabled={page === 1 || loading}
                    className="neo-btn-ghost px-3 py-1.5 text-sm disabled:opacity-50 flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" /> Prev
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={page === pagination.totalPages || loading}
                    className="neo-btn-ghost px-3 py-1.5 text-sm disabled:opacity-50 flex items-center gap-1"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
