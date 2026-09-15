import { Router } from 'express';
import { getProfile, upsertProfile, evaluateEligibility } from '../controllers/borrowerController';
import { uploadDocument, getMyDocuments } from '../controllers/documentController';
import { createApplication, getMyApplications } from '../controllers/loanController';
import { recordPayment, getPayments } from '../controllers/paymentController';
import { requireAuth, requireRole } from '../middlewares/auth';
import { upload } from '../middlewares/upload';
import { Role } from '../models/User';

const router = Router();

// All borrower routes require authentication and the BORROWER role
router.use(requireAuth);
router.use(requireRole([Role.BORROWER]));

router.get('/profile', getProfile);
router.put('/profile', upsertProfile);
router.post('/eligibility/evaluate', evaluateEligibility);

router.post('/documents', upload.single('file'), uploadDocument);
router.get('/documents', getMyDocuments);

router.post('/loans', createApplication);
router.get('/loans', getMyApplications);

router.post('/payments', recordPayment);
router.get('/payments', getPayments);

export default router;
