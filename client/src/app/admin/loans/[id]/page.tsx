"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import api, { fileUrl } from '@/lib/api';
import Link from 'next/link';
import StatusBadge from '@/components/StatusBadge';
import { ArrowLeft, FileText, Loader2, CheckCircle2, XCircle, Banknote, CheckCheck } from 'lucide-react';

const SANCTION_ACCENT = '#d97706';
const DISBURSEMENT_ACCENT = '#059669';

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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="neo-card p-16 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--ink)]" />
          <p className="text-sm font-bold text-[var(--ink)]/50">Loading loan…</p>
        </div>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="neo-card p-16 text-center text-[var(--ink)]/50 font-bold">Loan not found</div>
      </div>
    );
  }

  const { loan, profile } = data;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/admin/loans" className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--ink)]/60 hover:text-[var(--ink)] transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to all loans
      </Link>

      <div className="flex justify-between items-center flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-[var(--ink)] tracking-tight">Loan {loan._id.slice(-6).toUpperCase()}</h1>
        <StatusBadge status={loan.loanStatus} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Borrower Info */}
        <div className="neo-card p-6">
          <h2 className="text-lg font-bold text-[var(--ink)] mb-4">Borrower Details</h2>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-[var(--ink)]/50 font-bold uppercase text-xs tracking-wide">Name</dt>
              <dd className="text-[var(--ink)] mt-1 font-bold">{profile.fullName}</dd>
            </div>
            <div>
              <dt className="text-[var(--ink)]/50 font-bold uppercase text-xs tracking-wide">Email</dt>
              <dd className="text-[var(--ink)] mt-1 font-bold">{loan.borrowerId?.email}</dd>
            </div>
            <div>
              <dt className="text-[var(--ink)]/50 font-bold uppercase text-xs tracking-wide">PAN</dt>
              <dd className="text-[var(--ink)] mt-1 font-bold">{profile.pan}</dd>
            </div>
            <div>
              <dt className="text-[var(--ink)]/50 font-bold uppercase text-xs tracking-wide">Monthly Salary</dt>
              <dd className="text-[var(--ink)] mt-1 font-bold">₹{(profile.monthlySalaryPaise / 100).toLocaleString()}</dd>
            </div>
          </dl>
        </div>

        {/* Loan Request Info */}
        <div className="neo-card p-6">
          <h2 className="text-lg font-bold text-[var(--ink)] mb-4">Loan Terms</h2>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-[var(--ink)]/50 font-bold uppercase text-xs tracking-wide">Principal Amount</dt>
              <dd className="text-[var(--ink)] mt-1 font-bold text-lg">₹{(loan.loanAmountPaise / 100).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-[var(--ink)]/50 font-bold uppercase text-xs tracking-wide">Tenure</dt>
              <dd className="text-[var(--ink)] mt-1 font-bold">{loan.tenureDays / 30} months</dd>
            </div>
            <div>
              <dt className="text-[var(--ink)]/50 font-bold uppercase text-xs tracking-wide">Interest Rate</dt>
              <dd className="text-[var(--ink)] mt-1 font-bold">{(loan.interestRateBps / 100).toFixed(2)}% p.a.</dd>
            </div>
            <div>
              <dt className="text-[var(--ink)]/50 font-bold uppercase text-xs tracking-wide">Total Repayment Amount</dt>
              <dd className="mt-1 font-bold text-[var(--ink)]">₹{(loan.totalRepaymentPaise / 100).toLocaleString()}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Documents */}
      <div className="neo-card p-6">
        <h2 className="text-lg font-bold text-[var(--ink)] mb-4">Attached Documents</h2>
        {loan.salarySlipDocumentId ? (
          <div className="flex items-center justify-between py-3 border-b-2 border-[var(--ink)]/10">
            <span className="flex items-center gap-2 text-sm font-bold text-[var(--ink)]">
              <FileText className="w-4 h-4 text-[var(--ink)]/40" />
              {loan.salarySlipDocumentId.originalName}
            </span>
            <a
              href={fileUrl(loan.salarySlipDocumentId.storageKey)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold hover:underline text-[var(--ink)]"
            >
              View Document
            </a>
          </div>
        ) : (
          <p className="text-sm text-[var(--ink)]/50 font-bold">No documents attached.</p>
        )}
      </div>

      {/* Actions */}
      <div className="neo-card p-6">
        <h2 className="text-lg font-bold text-[var(--ink)] mb-4">Admin Actions</h2>

        {loan.loanStatus === 'APPLIED' && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 rounded-full border border-[var(--ink)]" style={{ backgroundColor: SANCTION_ACCENT }} />
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--ink)]/60">Sanction Stage</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => handleSanction('APPROVE')}
                disabled={submitting}
                className="neo-btn px-5 py-2.5 text-sm disabled:opacity-50"
                style={{ backgroundColor: SANCTION_ACCENT }}
              >
                <CheckCircle2 className="w-4 h-4" /> Approve Sanction
              </button>
              <button
                onClick={() => handleSanction('REJECT')}
                disabled={submitting}
                className="neo-btn px-5 py-2.5 text-sm text-white disabled:opacity-50"
                style={{ backgroundColor: 'var(--danger)' }}
              >
                <XCircle className="w-4 h-4" /> Reject Application
              </button>
            </div>
          </div>
        )}

        {loan.loanStatus === 'SANCTIONED' && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 rounded-full border border-[var(--ink)]" style={{ backgroundColor: DISBURSEMENT_ACCENT }} />
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--ink)]/60">Disbursement Stage</p>
            </div>
            <p className="text-sm text-[var(--ink)]/60 font-bold mb-4">This loan is approved and awaiting disbursement.</p>
            <button
              onClick={handleDisburse}
              disabled={submitting}
              className="neo-btn px-5 py-2.5 text-sm disabled:opacity-50"
              style={{ backgroundColor: DISBURSEMENT_ACCENT }}
            >
              <Banknote className="w-4 h-4" /> Record Disbursement
            </button>
          </div>
        )}

        {loan.loanStatus === 'DISBURSED' && (
          <div className="neo-card-sm p-4 flex items-start gap-3" style={{ backgroundColor: DISBURSEMENT_ACCENT }}>
            <CheckCheck className="w-5 h-5 mt-0.5 shrink-0 text-[var(--ink)]" />
            <p className="text-sm font-bold text-[var(--ink)]">
              Funds disbursed successfully. <br/>
              Reference: {loan.disbursementReference}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
