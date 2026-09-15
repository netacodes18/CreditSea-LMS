import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

export enum DocumentState {
  CURRENT = 'CURRENT',
  REPLACED = 'REPLACED',
}

export interface IDocument extends MongooseDocument {
  borrowerId: mongoose.Types.ObjectId;
  applicationId?: mongoose.Types.ObjectId;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  storageKey: string;
  state: DocumentState;
  replacedByDocumentId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema: Schema = new Schema(
  {
    borrowerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    applicationId: { type: Schema.Types.ObjectId, ref: 'LoanApplication' },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    sizeBytes: { type: Number, required: true },
    storageKey: { type: String, required: true },
    state: {
      type: String,
      enum: Object.values(DocumentState),
      required: true,
    },
    replacedByDocumentId: { type: Schema.Types.ObjectId, ref: 'Document' },
  },
  { timestamps: true }
);

export const DocumentModel = mongoose.model<IDocument>('Document', DocumentSchema);
