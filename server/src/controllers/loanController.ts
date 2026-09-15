import { Request, Response } from 'express';
import { LoanApplication, LoanStatus } from '../models/LoanApplication';
import { BorrowerProfile, EligibilityStatus } from '../models/BorrowerProfile';
import { DocumentModel, DocumentState } from '../models/Document';

const MIN_LOAN_AMOUNT_PAISE = 50_000 * 100;
const MAX_LOAN_AMOUNT_PAISE = 500_000 * 100;
const MIN_TENURE_DAYS = 30;
const MAX_TENURE_DAYS = 365;

export const createApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const { amountPaise, tenureDays } = req.body;
    const borrowerId = req.user!.id;

    if (!amountPaise || !tenureDays) {
      res.status(400).json({ success: false, message: 'Amount and tenure are required' });
      return;
    }

    if (amountPaise < MIN_LOAN_AMOUNT_PAISE || amountPaise > MAX_LOAN_AMOUNT_PAISE) {
      res.status(400).json({ success: false, message: 'Loan amount must be between ₹50,000 and ₹5,00,000' });
      return;
    }

    if (tenureDays < MIN_TENURE_DAYS || tenureDays > MAX_TENURE_DAYS) {
      res.status(400).json({ success: false, message: 'Tenure must be between 30 and 365 days' });
      return;
    }

    // 1. Check if profile exists and passed BRE
    const profile = await BorrowerProfile.findOne({ userId: borrowerId });
    if (!profile) {
      res.status(400).json({ success: false, message: 'Profile not found' });
      return;
    }
    if (profile.eligibilityStatus !== EligibilityStatus.PASSED) {
      res.status(400).json({ success: false, message: 'Cannot apply for a loan unless BRE status is PASSED.' });
      return;
    }

    // 2. Only allow one active application.
    const activeLoan = await LoanApplication.findOne({
      borrowerId,
      loanStatus: { $nin: [LoanStatus.SANCTION_REJECTED, LoanStatus.CLOSED] }
    });
    
    if (activeLoan) {
      res.status(400).json({ success: false, message: 'You already have an active loan application.' });
      return;
    }

    // 3. Find a salary slip document to attach (required by schema)
    const doc = await DocumentModel.findOne({ borrowerId, state: DocumentState.CURRENT });
    if (!doc) {
      res.status(400).json({ success: false, message: 'At least one document (salary slip) must be uploaded before applying.' });
      return;
    }

    // Simple Interest: SI = (P x R x T) / (365 x 100), T in days
    const P = amountPaise;
    const rateBps = 1200; // 12%
    const simpleInterestPaise = Math.round(P * (rateBps / 10000) * (tenureDays / 365));
    const totalRepaymentPaise = P + simpleInterestPaise;

    const application = await LoanApplication.create({
      borrowerId,
      salarySlipDocumentId: doc._id,
      loanAmountPaise: P,
      tenureDays,
      interestRateBps: rateBps,
      simpleInterestPaise,
      totalRepaymentPaise,
      outstandingPaise: totalRepaymentPaise,
      loanStatus: LoanStatus.APPLIED,
    });

    res.status(201).json({ success: true, data: application });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const applications = await LoanApplication.find({ borrowerId: req.user!.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: applications });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
