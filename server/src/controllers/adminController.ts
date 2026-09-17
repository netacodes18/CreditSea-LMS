import { Request, Response } from 'express';
import { LoanApplication, LoanStatus } from '../models/LoanApplication';
import { BorrowerProfile } from '../models/BorrowerProfile';
import { StatusHistory } from '../models/StatusHistory';
import { Role } from '../models/User';
import { computeOverdueInfo } from '../utils/loanMath';

// which statuses each role can see
const VISIBLE_STATUSES: Partial<Record<Role, LoanStatus[]>> = {
  [Role.SANCTION]: [LoanStatus.APPLIED, LoanStatus.SANCTIONED, LoanStatus.SANCTION_REJECTED, LoanStatus.CLOSED],
  [Role.DISBURSEMENT]: [LoanStatus.SANCTIONED, LoanStatus.DISBURSED, LoanStatus.CLOSED],
};

export const getAllLoans = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const visible = VISIBLE_STATUSES[req.user!.role];
    const query = visible ? { loanStatus: { $in: visible } } : {};

    const [loans, total] = await Promise.all([
      LoanApplication.find(query)
        .populate('borrowerId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      LoanApplication.countDocuments(query)
    ]);

    const data = loans.map((loan) => ({
      ...loan.toObject(),
      overdue: computeOverdueInfo(loan.loanStatus, loan.disbursedAt, loan.tenureDays, loan.outstandingPaise),
    }));

    res.status(200).json({ 
      success: true, 
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
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

    const visible = VISIBLE_STATUSES[req.user!.role];
    if (visible && !visible.includes(loan.loanStatus)) {
      res.status(403).json({ success: false, message: 'Forbidden: this loan is outside your module' });
      return;
    }

    const profile = await BorrowerProfile.findOne({ userId: loan.borrowerId._id });
    const overdue = computeOverdueInfo(loan.loanStatus, loan.disbursedAt, loan.tenureDays, loan.outstandingPaise);

    res.status(200).json({ success: true, data: { loan, profile, overdue } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLoanHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const loan = await LoanApplication.findById(id);
    if (!loan) {
      res.status(404).json({ success: false, message: 'Loan not found' });
      return;
    }

    const visible = VISIBLE_STATUSES[req.user!.role];
    if (visible && !visible.includes(loan.loanStatus)) {
      res.status(403).json({ success: false, message: 'Forbidden: this loan is outside your module' });
      return;
    }

    const history = await StatusHistory.find({ applicationId: id } as any)
      .populate('actorId', 'email role')
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, data: history });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sanctionLoan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { action, reason } = req.body; // action: 'APPROVE' or 'REJECT'

    const existing = await LoanApplication.findById(id);
    if (!existing) {
      res.status(404).json({ success: false, message: 'Loan not found' });
      return;
    }

    const nextStatus = action === 'REJECT' ? LoanStatus.SANCTION_REJECTED : LoanStatus.SANCTIONED;
    const update: Record<string, any> = {
      loanStatus: nextStatus,
      sanctionedBy: req.user!.id,
      sanctionedAt: new Date(),
    };
    if (action === 'REJECT') {
      update.rejectionReason = reason;
    }

    // atomic guard: blocks two concurrent sanction requests
    const loan = await LoanApplication.findOneAndUpdate(
      { _id: id, loanStatus: LoanStatus.APPLIED } as any,
      { $set: update } as any,
      { new: true }
    );

    if (!loan) {
      res.status(400).json({ success: false, message: `Cannot sanction loan in status: ${existing.loanStatus}` });
      return;
    }

    await StatusHistory.create({
      applicationId: loan._id,
      fromStatus: LoanStatus.APPLIED,
      toStatus: nextStatus,
      action: action === 'REJECT' ? 'REJECT' : 'APPROVE',
      actorId: req.user!.id,
      reason: action === 'REJECT' ? reason : undefined,
    });

    res.status(200).json({ success: true, data: loan });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const disburseLoan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reference } = req.body;

    const existing = await LoanApplication.findById(id);
    if (!existing) {
      res.status(404).json({ success: false, message: 'Loan not found' });
      return;
    }

    // atomic guard: blocks two concurrent disburse requests
    const loan = await LoanApplication.findOneAndUpdate(
      { _id: id, loanStatus: LoanStatus.SANCTIONED } as any,
      {
        $set: {
          loanStatus: LoanStatus.DISBURSED,
          disbursedBy: req.user!.id,
          disbursedAt: new Date(),
          disbursementReference: reference,
          disbursedAmountPaise: existing.loanAmountPaise,
        },
      } as any,
      { new: true }
    );

    if (!loan) {
      res.status(400).json({ success: false, message: `Cannot disburse loan in status: ${existing.loanStatus}` });
      return;
    }

    await StatusHistory.create({
      applicationId: loan._id,
      fromStatus: LoanStatus.SANCTIONED,
      toStatus: LoanStatus.DISBURSED,
      action: 'DISBURSE',
      actorId: req.user!.id,
      reason: reference,
    });

    res.status(200).json({ success: true, data: loan });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
