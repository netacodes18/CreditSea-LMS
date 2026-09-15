import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { LoanApplication, LoanStatus } from '../models/LoanApplication';
import { BorrowerProfile } from '../models/BorrowerProfile';
import { Payment } from '../models/Payment';

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

    const profile = await BorrowerProfile.findOne({ userId: loan.borrowerId._id });

    res.status(200).json({ success: true, data: { loan, profile } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const recordCollectionPayment = async (req: Request, res: Response): Promise<void> => {
  // Start a Mongoose session for ACID transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { amountPaise, utr } = req.body;
    const recordedBy = (req as any).user!.id; // Collection executive

    if (!amountPaise || !utr) {
      res.status(400).json({ success: false, message: 'amountPaise and utr are required' });
      await session.abortTransaction();
      session.endSession();
      return;
    }

    if (amountPaise <= 0) {
      res.status(400).json({ success: false, message: 'Payment amount must be greater than 0' });
      await session.abortTransaction();
      session.endSession();
      return;
    }

    // 1. Fetch loan application
    const loan = await LoanApplication.findById(id).session(session);
    if (!loan) {
      res.status(404).json({ success: false, message: 'Loan application not found' });
      await session.abortTransaction();
      session.endSession();
      return;
    }

    // 2. State Guard
    if (loan.loanStatus !== LoanStatus.DISBURSED) {
      res.status(400).json({ success: false, message: `Cannot make payment on loan with status: ${loan.loanStatus}` });
      await session.abortTransaction();
      session.endSession();
      return;
    }

    // 3. Amount Guard
    if (amountPaise > loan.outstandingPaise) {
      res.status(400).json({ success: false, message: `Payment amount exceeds outstanding balance of ₹${loan.outstandingPaise / 100}` });
      await session.abortTransaction();
      session.endSession();
      return;
    }

    // 4. Record Payment
    const payment = new Payment({
      applicationId: loan._id,
      amountPaise,
      utr,
      paymentDate: new Date(),
      recordedBy,
    });
    await payment.save({ session });

    // 5. Deduct Balance
    loan.outstandingPaise -= amountPaise;

    // 6. Check if loan is fully paid
    if (loan.outstandingPaise === 0) {
      loan.loanStatus = LoanStatus.CLOSED;
      loan.closedAt = new Date();
    }

    await loan.save({ session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ success: true, data: payment, outstandingPaise: loan.outstandingPaise });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    // Handle unique UTR constraint error gracefully
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
