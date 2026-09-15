import { Request, Response } from 'express';
import { BorrowerProfile, EligibilityStatus } from '../models/BorrowerProfile';
import { evaluateBorrowerProfile } from '../services/breService';

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const profile = await BorrowerProfile.findOne({ userId });
    if (!profile) {
      res.status(200).json({ success: true, data: null, message: 'Profile not found' });
      return;
    }
    res.status(200).json({ success: true, data: profile });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const upsertProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, pan, dob, monthlySalaryPaise, employmentMode } = req.body;
    
    if (!fullName || !pan || !dob || !monthlySalaryPaise || !employmentMode) {
      res.status(400).json({ success: false, message: 'All fields are required' });
      return;
    }

    const normalizedPan = pan.toUpperCase();
    const userId = req.user!.id;
    
    // Check if PAN is used by someone else
    const existingPan = await BorrowerProfile.findOne({ pan: normalizedPan, userId: { $ne: userId } });
    if (existingPan) {
      res.status(400).json({ success: false, message: 'PAN is already in use' });
      return;
    }

    // Upsert the profile
    const profile = await BorrowerProfile.findOneAndUpdate(
      { userId },
      {
        fullName,
        pan: normalizedPan,
        dob: new Date(dob),
        monthlySalaryPaise,
        employmentMode,
        // Reset eligibility when profile changes
        eligibilityStatus: EligibilityStatus.NOT_EVALUATED,
        eligibilityReasons: [],
        eligibilityEvaluatedAt: null
      },
      { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: profile });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const evaluateEligibility = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const profile = await BorrowerProfile.findOne({ userId });
    if (!profile) {
      res.status(404).json({ success: false, message: 'Profile not found. Please complete profile first.' });
      return;
    }

    const result = evaluateBorrowerProfile(profile as any);

    (profile as any).eligibilityStatus = result.status;
    (profile as any).eligibilityReasons = result.reasons;
    (profile as any).eligibilityEvaluatedAt = new Date();

    await profile.save();

    res.status(200).json({ success: true, data: profile });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
