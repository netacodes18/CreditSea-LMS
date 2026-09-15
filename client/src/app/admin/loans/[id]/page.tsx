"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import StatusBadge from '@/components/StatusBadge';
import { ArrowLeft, FileText, Loader2, CheckCircle2, XCircle, Banknote, CheckCheck } from 'lucide-react';

const SANCTION_ACCENT = '#8b5cf6';
const DISBURSEMENT_ACCENT = '#10b981';

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
        <div className="card-surface p-16 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: SANCTION_ACCENT }} />
          <p className="text-sm text-slate-400">Loading loan…</p>
        </div>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card-surface p-16 text-center text-slate-400">Loan not found</div>
      </div>
    );
  }

  const { loan, profile } = data;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/admin/loans" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to all loans
      </Link>

      <div className="flex justify-between items-center flex-wrap gap-3">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Loan {loan._id.slice(-6).toUpperCase()}</h1>
        <StatusBadge status={loan.loanStatus} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Borrower Info */}
        <div className="card-surface p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Borrower Details</h2>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-slate-500 font-medium">Name</dt>
              <dd className="text-slate-900 mt-1">{profile.fullName}</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Email</dt>
              <dd className="text-slate-900 mt-1">{loan.borrowerId?.email}</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">PAN</dt>
              <dd className="text-slate-900 mt-1">{profile.pan}</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Monthly Salary</dt>
              <dd className="text-slate-900 mt-1">₹{(profile.monthlySalaryPaise / 100).toLocaleString()}</dd>
            </div>
          </dl>
        </div>

        {/* Loan Request Info */}
        <div className="card-surface p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Loan Terms</h2>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-slate-500 font-medium">Principal Amount</dt>
              <dd className="text-slate-900 mt-1 font-bold text-lg">₹{(loan.loanAmountPaise / 100).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Tenure</dt>
              <dd className="text-slate-900 mt-1">{loan.tenureDays / 30} months</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Interest Rate</dt>
              <dd className="text-slate-900 mt-1">{(loan.interestRateBps / 100).toFixed(2)}% p.a.</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Total Repayment Amount</dt>
              <dd className="mt-1 font-bold text-gradient-static">₹{(loan.totalRepaymentPaise / 100).toLocaleString()}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Documents */}
      <div className="card-surface p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Attached Documents</h2>
        {loan.salarySlipDocumentId ? (
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <FileText className="w-4 h-4 text-slate-400" />
              {loan.salarySlipDocumentId.originalName}
            </span>
            <a
              href={`http://localhost:5000${loan.salarySlipDocumentId.storageKey}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold hover:underline"
              style={{ color: SANCTION_ACCENT }}
            >
              View Document
            </a>
          </div>
        ) : (
          <p className="text-sm text-slate-500">No documents attached.</p>
        )}
      </div>

      {/* Actions */}
      <div className="card-surface p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Admin Actions</h2>

        {loan.loanStatus === 'APPLIED' && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: SANCTION_ACCENT }} />
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: SANCTION_ACCENT }}>Sanction Stage</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => handleSanction('APPROVE')}
                disabled={submitting}
                className="btn-gradient px-5 py-2.5 text-sm inline-flex items-center gap-2 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" /> Approve Sanction
              </button>
              <button
                onClick={() => handleSanction('REJECT')}
                disabled={submitting}
                className="rounded-xl bg-rose-600 hover:bg-rose-700 px-5 py-2.5 text-sm font-semibold text-white inline-flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" /> Reject Application
              </button>
            </div>
          </div>
        )}

        {loan.loanStatus === 'SANCTIONED' && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: DISBURSEMENT_ACCENT }} />
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: DISBURSEMENT_ACCENT }}>Disbursement Stage</p>
            </div>
            <p className="text-sm text-slate-500 mb-4">This loan is approved and awaiting disbursement.</p>
            <button
              onClick={handleDisburse}
              disabled={submitting}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white inline-flex items-center gap-2 shadow-md transition-transform hover:-translate-y-0.5 disabled:opacity-50"
              style={{ backgroundColor: DISBURSEMENT_ACCENT }}
            >
              <Banknote className="w-4 h-4" /> Record Disbursement
            </button>
          </div>
        )}

        {loan.loanStatus === 'DISBURSED' && (
          <div className="p-4 rounded-xl flex items-start gap-3" style={{ backgroundColor: `${DISBURSEMENT_ACCENT}1a` }}>
            <CheckCheck className="w-5 h-5 mt-0.5 shrink-0" style={{ color: DISBURSEMENT_ACCENT }} />
            <p className="text-sm font-medium" style={{ color: DISBURSEMENT_ACCENT }}>
              Funds disbursed successfully. <br/>
              Reference: {loan.disbursementReference}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
