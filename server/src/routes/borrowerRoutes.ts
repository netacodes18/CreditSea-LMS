import { Router } from 'express';
import { getProfile, upsertProfile, evaluateEligibility } from '../controllers/borrowerController';
import { uploadDocument, getMyDocuments } from '../controllers/documentController';
import { createApplication, getMyApplications, getMyLoanHistory } from '../controllers/loanController';
import { recordPayment, getPayments } from '../controllers/paymentController';
import { requireAuth, requireRole } from '../middlewares/auth';
import { uploadSalarySlip } from '../middlewares/upload';
import { idempotency } from '../middlewares/idempotency';
import { Role } from '../models/User';

const router = Router();

// All borrower routes require authentication and the BORROWER role
router.use(requireAuth);
router.use(requireRole([Role.BORROWER]));

router.get('/profile', getProfile);
router.put('/profile', upsertProfile);
router.post('/eligibility/evaluate', evaluateEligibility);

router.post('/documents', uploadSalarySlip, uploadDocument);
router.get('/documents', getMyDocuments);
router.get('/documents/:id/download', requireRole([Role.BORROWER]), (req, res) => {
  const { getDocumentDownloadUrl } = require('../controllers/documentController');
  return getDocumentDownloadUrl(req, res);
});

router.post('/loans', createApplication);
router.get('/loans', getMyApplications);
router.get('/loans/:id/history', getMyLoanHistory);

router.post('/payments', idempotency('borrower.recordPayment'), recordPayment);
router.get('/payments', getPayments);

export default router;
