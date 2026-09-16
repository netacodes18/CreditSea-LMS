import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { LoanApplication, LoanStatus } from '../models/LoanApplication';
import { Payment } from '../models/Payment';

export const recordPayment = async (req: Request, res: Response): Promise<void> => {
  // Start a Mongoose session for ACID transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { applicationId, amountPaise } = req.body;
    const borrowerId = req.user!.id;
    // Normalize so 'utr001', 'UTR001' and ' UTR001 ' are all treated as the same UTR
    const utr = typeof req.body.utr === 'string' ? req.body.utr.trim().toUpperCase() : req.body.utr;

    if (!applicationId || !amountPaise || !utr) {
      res.status(400).json({ success: false, message: 'applicationId, amountPaise, and utr are required' });
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

    if (!Number.isInteger(amountPaise)) {
      res.status(400).json({ success: false, message: 'Payment amount must be a valid amount (max 2 decimal places).' });
      await session.abortTransaction();
      session.endSession();
      return;
    }

    // 1. Fetch loan application
    const loan = await LoanApplication.findOne({ _id: applicationId, borrowerId }).session(session);
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
      recordedBy: borrowerId,
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

export const getPayments = async (req: Request, res: Response): Promise<void> => {
  try {
    const applicationId = req.query.applicationId as string | undefined;
    const borrowerId = req.user!.id;

    // Ensure the borrower actually owns the application they are querying
    const query: any = {};
    if (applicationId) {
      const loan = await LoanApplication.findOne({ _id: applicationId, borrowerId });
      if (!loan) {
        res.status(404).json({ success: false, message: 'Loan application not found' });
        return;
      }
      query.applicationId = applicationId;
    } else {
      // If no specific loan provided, find all loans owned by borrower to fetch payments for all
      const loans = await LoanApplication.find({ borrowerId }).select('_id');
      const loanIds = loans.map(l => l._id);
      query.applicationId = { $in: loanIds };
    }

    const payments = await Payment.find(query).sort({ paymentDate: -1 });
    res.status(200).json({ success: true, data: payments });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
