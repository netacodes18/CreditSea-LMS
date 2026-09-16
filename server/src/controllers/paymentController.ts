import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { LoanApplication } from '../models/LoanApplication';
import { Payment } from '../models/Payment';
import { recordLoanPayment } from '../services/paymentService';

export const recordPayment = async (req: Request, res: Response): Promise<void> => {
  // wrap payment + balance update in a transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { applicationId, amountPaise } = req.body;
    const borrowerId = req.user!.id;
    // normalize UTR so case/whitespace don't create dupes
    const utr = typeof req.body.utr === 'string' ? req.body.utr.trim().toUpperCase() : req.body.utr;

    if (!applicationId) {
      res.status(400).json({ success: false, message: 'applicationId, amountPaise, and utr are required' });
      await session.abortTransaction();
      session.endSession();
      return;
    }

    const result = await recordLoanPayment({
      loanFilter: { _id: applicationId, borrowerId },
      amountPaise,
      utr,
      recordedBy: borrowerId,
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

export const getPayments = async (req: Request, res: Response): Promise<void> => {
  try {
    const applicationId = req.query.applicationId as string | undefined;
    const borrowerId = req.user!.id;

    // only return payments the borrower owns
    const query: any = {};
    if (applicationId) {
      const loan = await LoanApplication.findOne({ _id: applicationId, borrowerId });
      if (!loan) {
        res.status(404).json({ success: false, message: 'Loan application not found' });
        return;
      }
      query.applicationId = applicationId;
    } else {
      // no loanId given: fetch across all of this borrower's loans
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
