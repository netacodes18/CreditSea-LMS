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
    // Globally unique so a create() race between two identical requests fails fast on the second one
    key: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    endpoint: { type: String, required: true },
    // sha256 of the request body: a reused key with a different payload is rejected, not replayed
    requestHash: { type: String, required: true },
    status: { type: String, enum: Object.values(IdempotencyStatus), required: true, default: IdempotencyStatus.PROCESSING },
    responseStatus: { type: Number },
    responseBody: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

// Auto-expire records 48h after creation so retries only need to be deduped for a bounded window
// and the collection doesn't grow forever.
IdempotencyKeySchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 48 });

export const IdempotencyKey = mongoose.model<IIdempotencyKey>('IdempotencyKey', IdempotencyKeySchema);
