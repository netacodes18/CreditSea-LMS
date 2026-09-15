import { Request, Response } from 'express';
import { LoanApplication } from '../models/LoanApplication';
import { BorrowerProfile } from '../models/BorrowerProfile';
import { User, Role } from '../models/User';

export const getDashboardMetrics = async (req: Request, res: Response): Promise<void> => {
  try {
    // Basic aggregations for KPIs
    const [
      totalBorrowers,
      loanStatusCounts,
      disbursedVolumeResult,
      appliedBorrowerIds
    ] = await Promise.all([
      User.countDocuments({ role: Role.BORROWER }),
      LoanApplication.aggregate([
        { $group: { _id: '$loanStatus', count: { $sum: 1 } } }
      ]),
      LoanApplication.aggregate([
        { $match: { loanStatus: { $in: ['DISBURSED', 'CLOSED'] } } },
        { $group: { _id: null, totalVolume: { $sum: '$loanAmountPaise' } } }
      ]),
      LoanApplication.distinct('borrowerId')
    ]);

    // Format loan status counts into an easy map
    const statusMap = loanStatusCounts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {} as Record<string, number>);

    // Leads = registered borrowers who have NOT applied for a loan yet (pre-application stage)
    const leadUsers = await User.find({
      role: Role.BORROWER,
      _id: { $nin: appliedBorrowerIds }
    })
      .select('email createdAt')
      .sort({ createdAt: -1 })
      .limit(50);

    const leadProfiles = await BorrowerProfile.find({
      userId: { $in: leadUsers.map((u) => u._id) }
    }).select('userId fullName eligibilityStatus');

    const profileByUserId = new Map(leadProfiles.map((p) => [p.userId.toString(), p]));

    const recentLeads = leadUsers.map((u) => {
      const profile = profileByUserId.get((u._id as any).toString());
      return {
        _id: u._id,
        email: u.email,
        registeredAt: u.createdAt,
        fullName: profile?.fullName || null,
        profileStatus: profile ? profile.eligibilityStatus : 'PROFILE_NOT_STARTED',
      };
    });

    const metrics = {
      totalBorrowers,
      totalApplications: loanStatusCounts.reduce((sum, curr) => sum + curr.count, 0),
      pendingReview: (statusMap['APPLIED'] || 0),
      disbursedCount: (statusMap['DISBURSED'] || 0) + (statusMap['CLOSED'] || 0),
      totalDisbursedVolumePaise: disbursedVolumeResult[0]?.totalVolume || 0,
      totalLeads: recentLeads.length,
      recentLeads
    };

    res.status(200).json({ success: true, data: metrics });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
