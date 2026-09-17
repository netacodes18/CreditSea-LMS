import { computeSimpleInterestPaise, computeOverdueInfo } from '../loanMath';

describe('computeSimpleInterestPaise', () => {
  it('matches the worked example from the assignment: ₹1,00,000 over 90 days at 12%', () => {
    // SI = (10000000 * 12 * 90) / (365 * 100) = 295890.41 paise -> rounds to 295890 (₹2,958.90)
    expect(computeSimpleInterestPaise(100000 * 100, 1200, 90)).toBe(295890);
  });

  it('matches ₹50,000 over 30 days', () => {
    // SI = (5000000 * 12 * 30) / 36500 = 49315.07 paise -> rounds to 49315 (₹493.15)
    expect(computeSimpleInterestPaise(50000 * 100, 1200, 30)).toBe(49315);
  });

  it('matches ₹5,00,000 over 365 days (a full year at 12%)', () => {
    expect(computeSimpleInterestPaise(500000 * 100, 1200, 365)).toBe(60000 * 100);
  });

  it('returns 0 interest for 0 days', () => {
    expect(computeSimpleInterestPaise(100000 * 100, 1200, 0)).toBe(0);
  });
});

describe('computeOverdueInfo', () => {
  it('is not overdue if the loan is not DISBURSED', () => {
    const info = computeOverdueInfo('APPLIED', null, 30, 5000000);
    expect(info.isOverdue).toBe(false);
    expect(info.penaltyInterestPaise).toBe(0);
  });

  it('is not overdue if fully repaid', () => {
    const disbursedAt = new Date(Date.now() - 100 * 24 * 60 * 60 * 1000);
    const info = computeOverdueInfo('CLOSED', disbursedAt, 30, 0);
    expect(info.isOverdue).toBe(false);
  });

  it('is not overdue before the due date', () => {
    const disbursedAt = new Date(); // just disbursed, 30-day tenure
    const info = computeOverdueInfo('DISBURSED', disbursedAt, 30, 5000000);
    expect(info.isOverdue).toBe(false);
    expect(info.daysOverdue).toBe(0);
    expect(info.penaltyInterestPaise).toBe(0);
    expect(info.totalDuePaise).toBe(5000000);
  });

  it('flags a loan 10 days past its due date and adds a penalty', () => {
    const disbursedAt = new Date(Date.now() - 40 * 24 * 60 * 60 * 1000); // 40 days ago, 30-day tenure
    const info = computeOverdueInfo('DISBURSED', disbursedAt, 30, 5000000);
    expect(info.isOverdue).toBe(true);
    expect(info.daysOverdue).toBe(10);
    // 2% p.a. on ₹50,000 for 10 days = (5000000 * 200 * 10) / (10000 * 365) ≈ 2740 paise
    expect(info.penaltyInterestPaise).toBeGreaterThan(0);
    expect(info.totalDuePaise).toBe(5000000 + info.penaltyInterestPaise);
  });
});
