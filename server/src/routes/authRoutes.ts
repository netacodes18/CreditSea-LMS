import { Router } from 'express';
import { register, login, logout, getMe } from '../controllers/authController';
import { requireAuth } from '../middlewares/auth';
import { authRateLimit } from '../middlewares/rateLimit';

const router = Router();

router.post('/register', authRateLimit, register);
router.post('/login', authRateLimit, login);
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, getMe);

export default router;
