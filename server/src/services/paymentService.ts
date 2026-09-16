import { ClientSession } from 'mongoose';
import { LoanApplication, LoanStatus } from '../models/LoanApplication';
import { Payment, IPayment } from '../models/Payment';
import { StatusHistory } from '../models/StatusHistory';

interface RecordPaymentArgs {
  loanFilter: Record<string, any>;
  amountPaise: number;
  utr: string;
  recordedBy: string;
  notFoundMessage: string;
  session: ClientSession;
}

type RecordPaymentResult =
  | { ok: false; status: number; message: string }
  | { ok: true; payment: IPayment; outstandingPaise: number };

// shared by borrower self-payment and Collection payment endpoints
export async function recordLoanPayment(args: RecordPaymentArgs): Promise<RecordPaymentResult> {
  const { loanFilter, amountPaise, utr, recordedBy, notFoundMessage, session } = args;

  if (!amountPaise || !utr) {
    return { ok: false, status: 400, message: 'amountPaise and utr are required' };
  }

  if (amountPaise <= 0) {
    return { ok: false, status: 400, message: 'Payment amount must be greater than 0' };
  }

  if (!Number.isInteger(amountPaise)) {
    return { ok: false, status: 400, message: 'Payment amount must be a valid amount (max 2 decimal places).' };
  }

  // 1. Fetch loan application
  const loan = await LoanApplication.findOne(loanFilter).session(session);
  if (!loan) {
    return { ok: false, status: 404, message: notFoundMessage };
  }

  // 2. State Guard
  if (loan.loanStatus !== LoanStatus.DISBURSED) {
    return { ok: false, status: 400, message: `Cannot make payment on loan with status: ${loan.loanStatus}` };
  }

  // 3. Amount Guard
  if (amountPaise > loan.outstandingPaise) {
    return { ok: false, status: 400, message: `Payment amount exceeds outstanding balance of ₹${loan.outstandingPaise / 100}` };
  }

  // 4. Record Payment
  const payment = new Payment({
    applicationId: loan._id,
    amountPaise,
    utr,
    paymentDate: new Date(),
    recordedBy,
  });
  await payment.save({ session });

  // 5. Deduct Balance
  loan.outstandingPaise -= amountPaise;

  // 6. Check if loan is fully paid
  if (loan.outstandingPaise === 0) {
    loan.loanStatus = LoanStatus.CLOSED;
    loan.closedAt = new Date();
    await StatusHistory.create(
      [{
        applicationId: loan._id,
        fromStatus: LoanStatus.DISBURSED,
        toStatus: LoanStatus.CLOSED,
        action: 'AUTO_CLOSE',
        actorId: recordedBy,
        reason: 'Outstanding balance fully repaid',
      }],
      { session }
    );
  }

  await loan.save({ session });

  return { ok: true, payment, outstandingPaise: loan.outstandingPaise };
}
