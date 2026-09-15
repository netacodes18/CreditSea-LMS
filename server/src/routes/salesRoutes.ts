import { Router } from 'express';
import { getDashboardMetrics } from '../controllers/salesController';
import { requireAuth, requireRole } from '../middlewares/auth';
import { Role } from '../models/User';

const router = Router();

router.use(requireAuth);
// Allow SALES and ADMIN roles to view analytics
router.use(requireRole([Role.ADMIN, Role.SALES]));

router.get('/dashboard', getDashboardMetrics);

export default router;
