import mongoose, { Schema, Document } from 'mongoose';

export enum IdempotencyStatus {
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
}

export interface IIdempotencyKey extends Document {
  key: string;
  userId: mongoose.Types.ObjectId;
  endpoint: string;
  requestHash: string;
  status: IdempotencyStatus;
  responseStatus?: number;
  responseBody?: unknown;
  createdAt: Date;
  updatedAt: Date;
}

const IdempotencyKeySchema: Schema = new Schema(
  {
    // unique index catches concurrent duplicates
    key: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    endpoint: { type: String, required: true },
    // sha256 of the request body
    requestHash: { type: String, required: true },
    status: { type: String, enum: Object.values(IdempotencyStatus), required: true, default: IdempotencyStatus.PROCESSING },
    responseStatus: { type: Number },
    responseBody: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

// auto-expire keys after 48h
IdempotencyKeySchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 48 });

export const IdempotencyKey = mongoose.model<IIdempotencyKey>('IdempotencyKey', IdempotencyKeySchema);
