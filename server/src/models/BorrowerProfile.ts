import mongoose, { Schema, Document } from 'mongoose';

export enum EmploymentMode {
  SALARIED = 'SALARIED',
  SELF_EMPLOYED = 'SELF_EMPLOYED',
  UNEMPLOYED = 'UNEMPLOYED',
}

export enum EligibilityStatus {
  NOT_EVALUATED = 'NOT_EVALUATED',
  PASSED = 'PASSED',
  FAILED = 'FAILED',
}

export interface IBorrowerProfile extends Document {
  userId: mongoose.Types.ObjectId;
  fullName: string;
  pan: string;
  dob: Date;
  monthlySalaryPaise: number;
  employmentMode: EmploymentMode;
  eligibilityStatus: EligibilityStatus;
  eligibilityReasons?: string[];
  eligibilityEvaluatedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BorrowerProfileSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    fullName: { type: String, required: true },
    pan: { 
      type: String, 
      required: true, 
      unique: true, 
      uppercase: true, 
      match: [/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'Invalid PAN format'] 
    },
    dob: { type: Date, required: true },
    monthlySalaryPaise: { type: Number, required: true },
    employmentMode: {
      type: String,
      enum: Object.values(EmploymentMode),
      required: true,
    },
    eligibilityStatus: {
      type: String,
      enum: Object.values(EligibilityStatus),
      default: EligibilityStatus.NOT_EVALUATED,
    },
    eligibilityReasons: [{ type: String }],
    eligibilityEvaluatedAt: { type: Date },
  },
  { timestamps: true }
);

export const BorrowerProfile = mongoose.model<IBorrowerProfile>('BorrowerProfile', BorrowerProfileSchema);
