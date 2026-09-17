import { Request, Response } from 'express';
import { LoanApplication, LoanStatus } from '../models/LoanApplication';
import { BorrowerProfile, EligibilityStatus } from '../models/BorrowerProfile';
import { DocumentModel, DocumentState } from '../models/Document';
import { StatusHistory } from '../models/StatusHistory';
import { computeSimpleInterestPaise, computeOverdueInfo } from '../utils/loanMath';

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

    // 2. only one active application at a time
    const activeLoan = await LoanApplication.findOne({
      borrowerId,
      loanStatus: { $nin: [LoanStatus.SANCTION_REJECTED, LoanStatus.CLOSED] }
    });
    
    if (activeLoan) {
      res.status(400).json({ success: false, message: 'You already have an active loan application.' });
      return;
    }

    // 3. attach the borrower's salary slip
    const doc = await DocumentModel.findOne({ borrowerId, state: DocumentState.CURRENT });
    if (!doc) {
      res.status(400).json({ success: false, message: 'At least one document (salary slip) must be uploaded before applying.' });
      return;
    }

    const P = amountPaise;
    const rateBps = 1200; // 12%
    const simpleInterestPaise = computeSimpleInterestPaise(P, rateBps, tenureDays);
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
    if (error.code === 11000) {
      res.status(400).json({ success: false, message: 'You already have an active loan application.' });
      return;
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const applications = await LoanApplication.find({ borrowerId: req.user!.id }).sort({ createdAt: -1 });
    const data = applications.map((loan) => ({
      ...loan.toObject(),
      overdue: computeOverdueInfo(loan.loanStatus, loan.disbursedAt, loan.tenureDays, loan.outstandingPaise),
    }));
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyLoanHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const loan = await LoanApplication.findOne({ _id: id, borrowerId: req.user!.id } as any);
    if (!loan) {
      res.status(404).json({ success: false, message: 'Loan not found' });
      return;
    }

    const history = await StatusHistory.find({ applicationId: id } as any).sort({ createdAt: 1 });
    res.status(200).json({ success: true, data: history });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
