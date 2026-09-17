// SI = (P x R x T) / (365 x 100), rate in basis points, T in days
export const computeSimpleInterestPaise = (principalPaise: number, rateBps: number, tenureDays: number): number => {
  return Math.round(principalPaise * (rateBps / 10000) * (tenureDays / 365));
};

const PENALTY_RATE_BPS = 200; // 2% p.a., on top of the regular rate, applied to the outstanding balance
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export interface OverdueInfo {
  dueDate: Date | null;
  daysOverdue: number;
  isOverdue: boolean;
  penaltyInterestPaise: number;
  totalDuePaise: number;
}

// Informational only — does not change outstandingPaise or any payment guard, so it can't affect
// existing repayment behavior. Only meaningful for a loan that's DISBURSED with a balance left.
export const computeOverdueInfo = (
  loanStatus: string,
  disbursedAt: Date | null | undefined,
  tenureDays: number,
  outstandingPaise: number,
  now: Date = new Date()
): OverdueInfo => {
  if (loanStatus !== 'DISBURSED' || !disbursedAt || outstandingPaise <= 0) {
    return { dueDate: null, daysOverdue: 0, isOverdue: false, penaltyInterestPaise: 0, totalDuePaise: outstandingPaise };
  }

  const dueDate = new Date(disbursedAt.getTime() + tenureDays * MS_PER_DAY);
  const daysOverdue = Math.max(0, Math.floor((now.getTime() - dueDate.getTime()) / MS_PER_DAY));
  const penaltyInterestPaise = daysOverdue > 0
    ? computeSimpleInterestPaise(outstandingPaise, PENALTY_RATE_BPS, daysOverdue)
    : 0;

  return {
    dueDate,
    daysOverdue,
    isOverdue: daysOverdue > 0,
    penaltyInterestPaise,
    totalDuePaise: outstandingPaise + penaltyInterestPaise,
  };
};
