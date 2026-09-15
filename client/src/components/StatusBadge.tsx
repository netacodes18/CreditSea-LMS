const STATUS_STYLES: Record<string, { bg: string; fg: string; bd: string }> = {
  APPLIED: { bg: '#fffbeb', fg: '#b45309', bd: '#fcd34d' },
  SANCTIONED: { bg: '#eff6ff', fg: '#1d4ed8', bd: '#93c5fd' },
  SANCTION_REJECTED: { bg: '#fef2f2', fg: '#b91c1c', bd: '#fca5a5' },
  DISBURSED: { bg: '#ecfeff', fg: '#0e7490', bd: '#67e8f9' },
  CLOSED: { bg: '#ecfdf5', fg: '#047857', bd: '#6ee7b7' },
  PASSED: { bg: '#ecfdf5', fg: '#047857', bd: '#6ee7b7' },
  FAILED: { bg: '#fef2f2', fg: '#b91c1c', bd: '#fca5a5' },
  NOT_EVALUATED: { bg: '#f8fafc', fg: '#475569', bd: '#cbd5e1' },
  PROFILE_NOT_STARTED: { bg: '#f8fafc', fg: '#475569', bd: '#cbd5e1' },
};

export default function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] || { bg: '#f8fafc', fg: '#475569', bd: '#cbd5e1' };
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide border"
      style={{ backgroundColor: s.bg, color: s.fg, borderColor: s.bd }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.fg }} />
      {status.replace(/_/g, ' ')}
    </span>
  );
}
