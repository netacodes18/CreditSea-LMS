import mongoose, { Schema, Document } from 'mongoose';

export interface IStatusHistory extends Document {
  applicationId: mongoose.Types.ObjectId;
  fromStatus?: string;
  toStatus: string;
  action: string;
  actorId: mongoose.Types.ObjectId;
  reason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const StatusHistorySchema: Schema = new Schema(
  {
    applicationId: { type: Schema.Types.ObjectId, ref: 'LoanApplication', required: true },
    fromStatus: { type: String },
    toStatus: { type: String, required: true },
    action: { type: String, required: true },
    actorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String },
  },
  { timestamps: true }
);

export const StatusHistory = mongoose.model<IStatusHistory>('StatusHistory', StatusHistorySchema);
