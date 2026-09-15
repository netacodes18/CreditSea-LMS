import { IBorrowerProfile, EmploymentMode, EligibilityStatus } from '../models/BorrowerProfile';

export interface BREResult {
  status: EligibilityStatus;
  reasons: string[];
}

export const evaluateBorrowerProfile = (profile: IBorrowerProfile): BREResult => {
  const reasons: string[] = [];

  // 1. Age Rule: 23 to 50 inclusive
  const today = new Date();
  let age = today.getFullYear() - profile.dob.getFullYear();
  const m = today.getMonth() - profile.dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < profile.dob.getDate())) {
    age--;
  }
  
  if (age < 23 || age > 50) {
    reasons.push(`Age must be between 23 and 50. Current age is ${age}.`);
  }

  // 2. Salary Rule: >= ₹25,000 (2500000 paise)
  if (profile.monthlySalaryPaise < 2500000) {
    reasons.push('Monthly salary must be at least ₹25,000.');
  }

  // 3. PAN Regex Rule
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
  if (!panRegex.test(profile.pan)) {
    reasons.push('Invalid PAN format.');
  }

  // 4. Employment Rule: Must not be UNEMPLOYED
  if (profile.employmentMode === EmploymentMode.UNEMPLOYED) {
    reasons.push('Unemployed individuals are not eligible.');
  }

  return {
    status: reasons.length === 0 ? EligibilityStatus.PASSED : EligibilityStatus.FAILED,
    reasons,
  };
};
