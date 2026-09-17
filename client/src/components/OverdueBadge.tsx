import { AlertTriangle } from 'lucide-react';

interface OverdueInfo {
  isOverdue: boolean;
  daysOverdue: number;
  penaltyInterestPaise: number;
}

export default function OverdueBadge({ overdue }: { overdue?: OverdueInfo | null }) {
  if (!overdue?.isOverdue) return null;

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide border"
      style={{ backgroundColor: '#fef2f2', color: '#b91c1c', borderColor: '#fca5a5' }}
      title={`Penalty interest so far: ₹${(overdue.penaltyInterestPaise / 100).toLocaleString()}`}
    >
      <AlertTriangle className="h-3 w-3" />
      {overdue.daysOverdue} {overdue.daysOverdue === 1 ? 'day' : 'days'} overdue
    </span>
  );
}
