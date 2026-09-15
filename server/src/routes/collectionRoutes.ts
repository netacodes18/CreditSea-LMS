import { Router } from 'express';
import { getCollectionLoans, getCollectionLoanDetails, recordCollectionPayment, getCollectionPayments } from '../controllers/collectionController';
import { requireAuth, requireRole } from '../middlewares/auth';
import { Role } from '../models/User';

const router = Router();

// Protect all collection routes
router.use(requireAuth);
router.use(requireRole([Role.ADMIN, Role.COLLECTION]));

router.get('/loans', getCollectionLoans);
router.get('/loans/:id', getCollectionLoanDetails);
router.post('/loans/:id/payments', recordCollectionPayment);
router.get('/loans/:id/payments', getCollectionPayments);

export default router;
