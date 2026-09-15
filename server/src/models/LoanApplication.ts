import mongoose, { Schema, Document } from 'mongoose';

export enum LoanStatus {
  APPLIED = 'APPLIED',
  SANCTION_REJECTED = 'SANCTION_REJECTED',
  SANCTIONED = 'SANCTIONED',
  DISBURSED = 'DISBURSED',
  CLOSED = 'CLOSED',
}

export interface ILoanApplication extends Document {
  borrowerId: mongoose.Types.ObjectId;
  salarySlipDocumentId: mongoose.Types.ObjectId;
  loanAmountPaise: number;
  tenureDays: number;
  interestRateBps: number;
  simpleInterestPaise: number;
  totalRepaymentPaise: number;
  outstandingPaise: number;
  loanStatus: LoanStatus;
  version: number;
  sanctionedBy?: mongoose.Types.ObjectId;
  sanctionedAt?: Date;
  rejectionReason?: string;
  disbursedBy?: mongoose.Types.ObjectId;
  disbursedAt?: Date;
  disbursementReference?: string;
  disbursedAmountPaise?: number;
  closedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LoanApplicationSchema: Schema = new Schema(
  {
    borrowerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    salarySlipDocumentId: { type: Schema.Types.ObjectId, ref: 'Document', required: true },
    loanAmountPaise: { type: Number, required: true },
    tenureDays: { type: Number, required: true },
    interestRateBps: { type: Number, required: true },
    simpleInterestPaise: { type: Number, required: true },
    totalRepaymentPaise: { type: Number, required: true },
    outstandingPaise: { type: Number, required: true },
    loanStatus: {
      type: String,
      enum: Object.values(LoanStatus),
      required: true,
    },
    version: { type: Number, required: true, default: 1 },
    sanctionedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    sanctionedAt: { type: Date },
    rejectionReason: { type: String },
    disbursedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    disbursedAt: { type: Date },
    disbursementReference: { type: String },
    disbursedAmountPaise: { type: Number },
    closedAt: { type: Date },
  },
  { timestamps: true }
);

export const LoanApplication = mongoose.model<ILoanApplication>('LoanApplication', LoanApplicationSchema);
