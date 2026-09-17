import { CheckCircle2, XCircle, Banknote, CheckCheck, History } from 'lucide-react';

interface HistoryEntry {
  _id: string;
  fromStatus?: string;
  toStatus: string;
  action: string;
  actorId?: { email?: string; role?: string } | string;
  reason?: string;
  createdAt: string;
}

const ACTION_STYLE: Record<string, { icon: typeof CheckCircle2; bg: string }> = {
  APPROVE: { icon: CheckCircle2, bg: '#d97706' },
  REJECT: { icon: XCircle, bg: '#dc2626' },
  DISBURSE: { icon: Banknote, bg: '#059669' },
  AUTO_CLOSE: { icon: CheckCheck, bg: '#047857' },
};

const ACTION_LABEL: Record<string, string> = {
  APPROVE: 'Sanctioned',
  REJECT: 'Rejected',
  DISBURSE: 'Disbursed',
  AUTO_CLOSE: 'Closed (fully repaid)',
};

export default function ActivityTimeline({ history }: { history: HistoryEntry[] }) {
  if (history.length === 0) {
    return (
      <p className="text-sm text-[var(--ink)]/60 font-bold flex items-center gap-2">
        <History className="w-4 h-4 text-[var(--ink)]/30" /> No activity recorded yet.
      </p>
    );
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {history.map((entry, idx) => {
          const style = ACTION_STYLE[entry.action] || { icon: History, bg: '#475569' };
          const Icon = style.icon;
          const actor = typeof entry.actorId === 'object' ? entry.actorId?.email : undefined;

          return (
            <li key={entry._id}>
              <div className="relative pb-8">
                {idx !== history.length - 1 && (
                  <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-[var(--ink)]/15" aria-hidden="true" />
                )}
                <div className="relative flex space-x-3">
                  <div>
                    <span
                      className="h-8 w-8 rounded-full flex items-center justify-center border border-[var(--line)]"
                      style={{ backgroundColor: style.bg }}
                    >
                      <Icon className="h-4 w-4 text-white" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-[var(--ink)]/70 font-medium">
                        <span className="font-bold text-[var(--ink)]">{ACTION_LABEL[entry.action] || entry.action}</span>
                        {actor && <span> by {actor}</span>}
                      </p>
                      {entry.reason && (
                        <p className="text-xs text-[var(--ink)]/50 mt-0.5 font-bold">
                          {entry.action === 'REJECT' ? 'Reason' : 'Ref'}: {entry.reason}
                        </p>
                      )}
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-[var(--ink)]/60 font-bold">
                      <time dateTime={entry.createdAt}>{new Date(entry.createdAt).toLocaleDateString()}</time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
