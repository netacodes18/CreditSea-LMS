import { Router } from 'express';
import { getAllLoans, getLoanDetails, getLoanHistory, sanctionLoan, disburseLoan } from '../controllers/adminController';
import { requireAuth, requireRole } from '../middlewares/auth';
import { Role } from '../models/User';

const router = Router();

router.use(requireAuth);
// Allow ADMIN, SANCTION, and DISBURSEMENT roles
router.use(requireRole([Role.ADMIN, Role.SANCTION, Role.DISBURSEMENT]));

router.get('/loans', getAllLoans);
router.get('/loans/:id', getLoanDetails);
router.get('/loans/:id/history', getLoanHistory);
router.post('/loans/:id/sanction', requireRole([Role.ADMIN, Role.SANCTION]), sanctionLoan);
router.post('/loans/:id/disburse', requireRole([Role.ADMIN, Role.DISBURSEMENT]), disburseLoan);
router.get('/documents/:id/download', (req, res) => {
  const { getDocumentDownloadUrl } = require('../controllers/documentController');
  return getDocumentDownloadUrl(req, res);
});


export default router;
