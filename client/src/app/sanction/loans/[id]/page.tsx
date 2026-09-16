"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import api, { fileUrl } from '@/lib/api';
import Link from 'next/link';
import StatusBadge from '@/components/StatusBadge';
import Modal from '@/components/Modal';
import { ArrowLeft, FileText, Loader2, CheckCircle2, XCircle, Banknote, CheckCheck, AlertTriangle } from 'lucide-react';

const SANCTION_ACCENT = '#d97706';
const DISBURSEMENT_ACCENT = '#059669';

export default function AdminLoanDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // dialog state: which action is being confirmed, plus its input and any error
  const [dialog, setDialog] = useState<null | 'APPROVE' | 'REJECT' | 'DISBURSE'>(null);
  const [reason, setReason] = useState('');
  const [reference, setReference] = useState('');
  const [actionError, setActionError] = useState('');

  const closeDialog = () => {
    setDialog(null);
    setReason('');
    setReference('');
    setActionError('');
  };

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
    if (action === 'REJECT' && !reason.trim()) {
      setActionError('A rejection reason is required.');
      return;
    }

    setSubmitting(true);
    setActionError('');
    try {
      const res = await api.post(`/admin/loans/${id}/sanction`, {
        action,
        reason: action === 'REJECT' ? reason.trim() : undefined,
      });
      if (res.data.success) {
        closeDialog();
        fetchLoan();
      }
    } catch (err: any) {
      setActionError(err.response?.data?.message || 'Action failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDisburse = async () => {
    if (!reference.trim()) {
      setActionError('A UTR / transaction reference is required.');
      return;
    }

    setSubmitting(true);
    setActionError('');
    try {
      const res = await api.post(`/admin/loans/${id}/disburse`, { reference: reference.trim() });
      if (res.data.success) {
        closeDialog();
        fetchLoan();
      }
    } catch (err: any) {
      setActionError(err.response?.data?.message || 'Disbursement failed');
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
      <Link href="/sanction/loans"className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--ink)]/60 hover:text-[var(--ink)] transition-colors">
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
        <h2 className="text-lg font-bold text-[var(--ink)] mb-4">Actions</h2>

        {loan.loanStatus === 'APPLIED' && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 rounded-full border border-[var(--ink)]" style={{ backgroundColor: SANCTION_ACCENT }} />
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--ink)]/60">Sanction Stage</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setDialog('APPROVE')}
                disabled={submitting}
                className="neo-btn px-5 py-2.5 text-sm disabled:opacity-50"
                style={{ backgroundColor: SANCTION_ACCENT }}
              >
                <CheckCircle2 className="w-4 h-4" /> Approve Sanction
              </button>
              <button
                onClick={() => setDialog('REJECT')}
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
              onClick={() => setDialog('DISBURSE')}
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

        {loan.loanStatus === 'CLOSED' && (
          <div className="neo-card-sm p-4 flex items-start gap-3" style={{ backgroundColor: '#e6f4ee' }}>
            <CheckCheck className="w-5 h-5 mt-0.5 shrink-0" style={{ color: DISBURSEMENT_ACCENT }} />
            <div className="text-sm font-bold text-[var(--ink)]">
              Disbursed and fully repaid — this loan is now closed.
              {loan.disbursementReference && (
                <p className="font-medium mt-1">Reference: {loan.disbursementReference}</p>
              )}
              {loan.disbursedAt && (
                <p className="font-medium mt-1">Disbursed on: {new Date(loan.disbursedAt).toLocaleDateString()}</p>
              )}
              {loan.closedAt && (
                <p className="font-medium mt-1">Closed on: {new Date(loan.closedAt).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        )}

        {loan.loanStatus === 'SANCTION_REJECTED' && (
          <div className="neo-card-sm p-4 flex items-start gap-3" style={{ backgroundColor: 'var(--danger)' }}>
            <XCircle className="w-5 h-5 mt-0.5 shrink-0 text-white" />
            <div className="text-sm font-bold text-white">
              Application rejected.
              {loan.rejectionReason && (
                <p className="font-medium mt-1">Reason: {loan.rejectionReason}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Approve */}
      <Modal
        open={dialog === 'APPROVE'}
        onClose={closeDialog}
        title="Approve this loan?"
        description={`₹${(loan.loanAmountPaise / 100).toLocaleString()} over ${loan.tenureDays} days will move to SANCTIONED and become available for disbursement.`}
        icon={<DialogIcon color={SANCTION_ACCENT}><CheckCircle2 className="w-5 h-5" style={{ color: SANCTION_ACCENT }} /></DialogIcon>}
        footer={
          <>
            <button onClick={closeDialog} disabled={submitting} className="neo-btn-ghost px-5 py-2.5 text-sm">Cancel</button>
            <button
              onClick={() => handleSanction('APPROVE')}
              disabled={submitting}
              className="neo-btn px-5 py-2.5 text-sm disabled:opacity-60"
              style={{ backgroundColor: SANCTION_ACCENT, borderColor: SANCTION_ACCENT }}
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Approve sanction
            </button>
          </>
        }
      >
        {actionError && <DialogError message={actionError} />}
      </Modal>

      {/* Reject */}
      <Modal
        open={dialog === 'REJECT'}
        onClose={closeDialog}
        title="Reject this application?"
        description="The borrower will see this reason on their application. This cannot be undone."
        icon={<DialogIcon color="var(--danger)"><AlertTriangle className="w-5 h-5" style={{ color: 'var(--danger)' }} /></DialogIcon>}
        footer={
          <>
            <button onClick={closeDialog} disabled={submitting} className="neo-btn-ghost px-5 py-2.5 text-sm">Cancel</button>
            <button
              onClick={() => handleSanction('REJECT')}
              disabled={submitting}
              className="neo-btn px-5 py-2.5 text-sm text-white disabled:opacity-60"
              style={{ backgroundColor: 'var(--danger)', borderColor: 'var(--danger)' }}
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
              Reject application
            </button>
          </>
        }
      >
        <label htmlFor="reject-reason" className="block text-xs font-bold uppercase tracking-wide text-[var(--ink)]/55 mb-1.5">
          Rejection reason
        </label>
        <textarea
          id="reject-reason"
          rows={3}
          value={reason}
          onChange={(e) => { setReason(e.target.value); setActionError(''); }}
          placeholder="e.g. Declared income could not be verified against the salary slip."
          className="w-full rounded-xl border border-[var(--line)] px-3 py-2.5 text-sm text-[var(--ink)] placeholder-[var(--ink)]/35 focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316] transition-all resize-none"
        />
        {actionError && <DialogError message={actionError} />}
      </Modal>

      {/* Disburse */}
      <Modal
        open={dialog === 'DISBURSE'}
        onClose={closeDialog}
        title="Record disbursement"
        description={`Confirm the transfer of ₹${(loan.loanAmountPaise / 100).toLocaleString()} to the borrower. The loan will move to DISBURSED.`}
        icon={<DialogIcon color={DISBURSEMENT_ACCENT}><Banknote className="w-5 h-5" style={{ color: DISBURSEMENT_ACCENT }} /></DialogIcon>}
        footer={
          <>
            <button onClick={closeDialog} disabled={submitting} className="neo-btn-ghost px-5 py-2.5 text-sm">Cancel</button>
            <button
              onClick={handleDisburse}
              disabled={submitting}
              className="neo-btn px-5 py-2.5 text-sm disabled:opacity-60"
              style={{ backgroundColor: DISBURSEMENT_ACCENT, borderColor: DISBURSEMENT_ACCENT }}
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Banknote className="w-4 h-4" />}
              Record disbursement
            </button>
          </>
        }
      >
        <label htmlFor="utr-reference" className="block text-xs font-bold uppercase tracking-wide text-[var(--ink)]/55 mb-1.5">
          UTR / transaction reference
        </label>
        <input
          id="utr-reference"
          type="text"
          value={reference}
          onChange={(e) => { setReference(e.target.value); setActionError(''); }}
          placeholder="e.g. UTR202604180012345"
          className="w-full rounded-xl border border-[var(--line)] px-3 py-2.5 text-sm text-[var(--ink)] placeholder-[var(--ink)]/35 font-mono focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316] transition-all"
        />
        {actionError && <DialogError message={actionError} />}
      </Modal>
    </div>
  );
}

function DialogIcon({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}1a` }}>
      {children}
    </div>
  );
}

function DialogError({ message }: { message: string }) {
  return (
    <p className="mt-3 text-sm font-medium text-[var(--danger)] flex items-start gap-1.5">
      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
      {message}
    </p>
  );
}
