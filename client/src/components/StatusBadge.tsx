const STATUS_STYLES: Record<string, string> = {
  APPLIED: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  SANCTIONED: 'bg-violet-50 text-violet-700 ring-violet-600/20',
  SANCTION_REJECTED: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  DISBURSED: 'bg-cyan-50 text-cyan-700 ring-cyan-600/20',
  CLOSED: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  PASSED: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  FAILED: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  NOT_EVALUATED: 'bg-slate-100 text-slate-600 ring-slate-500/15',
  PROFILE_NOT_STARTED: 'bg-slate-100 text-slate-500 ring-slate-500/15',
};

export default function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] || 'bg-slate-100 text-slate-600 ring-slate-500/15';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${style}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {status.replace(/_/g, ' ')}
    </span>
  );
}
