import { evaluateBorrowerProfile } from '../breService';
import { EmploymentMode, EligibilityStatus, IBorrowerProfile } from '../../models/BorrowerProfile';

const daysAgoYears = (years: number): Date => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - years);
  return d;
};

const baseProfile = (overrides: Partial<IBorrowerProfile> = {}): IBorrowerProfile =>
  ({
    dob: daysAgoYears(30),
    monthlySalaryPaise: 3000000, // ₹30,000
    pan: 'ABCDE1234F',
    employmentMode: EmploymentMode.SALARIED,
    ...overrides,
  } as IBorrowerProfile);

describe('breService.evaluateBorrowerProfile', () => {
  it('passes a profile that meets every rule', () => {
    const result = evaluateBorrowerProfile(baseProfile());
    expect(result.status).toBe(EligibilityStatus.PASSED);
    expect(result.reasons).toHaveLength(0);
  });

  it('rejects age just under 23', () => {
    const result = evaluateBorrowerProfile(baseProfile({ dob: daysAgoYears(22) }));
    expect(result.status).toBe(EligibilityStatus.FAILED);
    expect(result.reasons.some((r) => r.includes('Age'))).toBe(true);
  });

  it('passes age exactly 23', () => {
    const result = evaluateBorrowerProfile(baseProfile({ dob: daysAgoYears(23) }));
    expect(result.reasons.some((r) => r.includes('Age'))).toBe(false);
  });

  it('passes age exactly 50', () => {
    const result = evaluateBorrowerProfile(baseProfile({ dob: daysAgoYears(50) }));
    expect(result.reasons.some((r) => r.includes('Age'))).toBe(false);
  });

  it('rejects age just over 50', () => {
    const result = evaluateBorrowerProfile(baseProfile({ dob: daysAgoYears(51) }));
    expect(result.reasons.some((r) => r.includes('Age'))).toBe(true);
  });

  it('rejects salary below ₹25,000', () => {
    const result = evaluateBorrowerProfile(baseProfile({ monthlySalaryPaise: 2499999 }));
    expect(result.status).toBe(EligibilityStatus.FAILED);
    expect(result.reasons.some((r) => r.includes('salary'))).toBe(true);
  });

  it('passes salary at exactly ₹25,000', () => {
    const result = evaluateBorrowerProfile(baseProfile({ monthlySalaryPaise: 2500000 }));
    expect(result.reasons.some((r) => r.includes('salary'))).toBe(false);
  });

  it('rejects an invalid PAN format', () => {
    const result = evaluateBorrowerProfile(baseProfile({ pan: 'ABC123' }));
    expect(result.status).toBe(EligibilityStatus.FAILED);
    expect(result.reasons.some((r) => r.includes('PAN'))).toBe(true);
  });

  it('rejects unemployed applicants', () => {
    const result = evaluateBorrowerProfile(baseProfile({ employmentMode: EmploymentMode.UNEMPLOYED }));
    expect(result.status).toBe(EligibilityStatus.FAILED);
    expect(result.reasons.some((r) => r.includes('Unemployed'))).toBe(true);
  });

  it('collects every failing reason, not just the first', () => {
    const result = evaluateBorrowerProfile(
      baseProfile({ dob: daysAgoYears(15), monthlySalaryPaise: 100000, pan: 'BAD', employmentMode: EmploymentMode.UNEMPLOYED })
    );
    expect(result.reasons).toHaveLength(4);
  });
});
