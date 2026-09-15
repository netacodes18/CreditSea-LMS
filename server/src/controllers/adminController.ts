import { Request, Response } from 'express';
import { LoanApplication, LoanStatus } from '../models/LoanApplication';
import { BorrowerProfile } from '../models/BorrowerProfile';

export const getAllLoans = async (req: Request, res: Response): Promise<void> => {
  try {
    const loans = await LoanApplication.find()
      .populate('borrowerId', 'name email')
      .sort({ createdAt: -1 });
      
    res.status(200).json({ success: true, data: loans });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLoanDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const loan = await LoanApplication.findById(id)
      .populate('borrowerId', 'name email')
      .populate('salarySlipDocumentId');

    if (!loan) {
      res.status(404).json({ success: false, message: 'Loan not found' });
      return;
    }

    const profile = await BorrowerProfile.findOne({ userId: loan.borrowerId._id });

    res.status(200).json({ success: true, data: { loan, profile } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sanctionLoan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { action, reason } = req.body; // action: 'APPROVE' or 'REJECT'

    const loan = await LoanApplication.findById(id);
    if (!loan) {
      res.status(404).json({ success: false, message: 'Loan not found' });
      return;
    }

    if (loan.loanStatus !== LoanStatus.APPLIED) {
      res.status(400).json({ success: false, message: `Cannot sanction loan in status: ${loan.loanStatus}` });
      return;
    }

    if (action === 'REJECT') {
      loan.loanStatus = LoanStatus.SANCTION_REJECTED;
      loan.rejectionReason = reason;
    } else {
      loan.loanStatus = LoanStatus.SANCTIONED;
    }

    loan.sanctionedBy = req.user!.id as any;
    loan.sanctionedAt = new Date();
    await loan.save();

    res.status(200).json({ success: true, data: loan });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const disburseLoan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reference } = req.body;

    const loan = await LoanApplication.findById(id);
    if (!loan) {
      res.status(404).json({ success: false, message: 'Loan not found' });
      return;
    }

    if (loan.loanStatus !== LoanStatus.SANCTIONED) {
      res.status(400).json({ success: false, message: `Cannot disburse loan in status: ${loan.loanStatus}` });
      return;
    }

    loan.loanStatus = LoanStatus.DISBURSED;
    loan.disbursedBy = req.user!.id as any;
    loan.disbursedAt = new Date();
    loan.disbursementReference = reference;
    loan.disbursedAmountPaise = loan.loanAmountPaise;

    await loan.save();

    res.status(200).json({ success: true, data: loan });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
