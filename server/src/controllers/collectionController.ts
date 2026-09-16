import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { LoanApplication, LoanStatus } from '../models/LoanApplication';
import { BorrowerProfile } from '../models/BorrowerProfile';
import { Payment } from '../models/Payment';
import { Role } from '../models/User';
import { recordLoanPayment } from '../services/paymentService';

// statuses visible to the Collection role
const COLLECTION_VISIBLE_STATUSES = [LoanStatus.DISBURSED, LoanStatus.CLOSED];

export const getCollectionLoans = async (req: Request, res: Response): Promise<void> => {
  try {
    const loans = await LoanApplication.find({ loanStatus: { $in: [LoanStatus.DISBURSED, LoanStatus.CLOSED] } })
      .populate('borrowerId', 'name email')
      .sort({ disbursedAt: -1, createdAt: -1 });

    res.status(200).json({ success: true, data: loans });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCollectionLoanDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const loan = await LoanApplication.findById(id)
      .populate('borrowerId', 'name email');

    if (!loan) {
      res.status(404).json({ success: false, message: 'Loan not found' });
      return;
    }

    // restrict Collection role to its own loans
    if (req.user!.role !== Role.ADMIN && !COLLECTION_VISIBLE_STATUSES.includes(loan.loanStatus)) {
      res.status(403).json({ success: false, message: 'Forbidden: this loan is outside your module' });
      return;
    }

    const profile = await BorrowerProfile.findOne({ userId: loan.borrowerId._id });

    res.status(200).json({ success: true, data: { loan, profile } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const recordCollectionPayment = async (req: Request, res: Response): Promise<void> => {
  // wrap payment + balance update in a transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { amountPaise } = req.body;
    const recordedBy = (req as any).user!.id; // Collection executive
    // normalize UTR so case/whitespace don't create dupes
    const utr = typeof req.body.utr === 'string' ? req.body.utr.trim().toUpperCase() : req.body.utr;

    const result = await recordLoanPayment({
      loanFilter: { _id: id },
      amountPaise,
      utr,
      recordedBy,
      notFoundMessage: 'Loan application not found',
      session,
    });

    if (!result.ok) {
      res.status(result.status).json({ success: false, message: result.message });
      await session.abortTransaction();
      session.endSession();
      return;
    }

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ success: true, data: result.payment, outstandingPaise: result.outstandingPaise });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    // handle duplicate UTR
    if (error.code === 11000) {
      res.status(400).json({ success: false, message: 'This UTR has already been used for a payment.' });
    } else {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

export const getCollectionPayments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const payments = await Payment.find({ applicationId: id as any })
      .populate('recordedBy', 'name email role')
      .sort({ paymentDate: -1 });

    res.status(200).json({ success: true, data: payments });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
