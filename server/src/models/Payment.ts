import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  applicationId: mongoose.Types.ObjectId;
  amountPaise: number;
  utr: string;
  paymentDate: Date;
  recordedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema = new Schema(
  {
    applicationId: { type: Schema.Types.ObjectId, ref: 'LoanApplication', required: true },
    amountPaise: { type: Number, required: true },
    utr: { type: String, required: true, unique: true },
    paymentDate: { type: Date, required: true },
    recordedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
