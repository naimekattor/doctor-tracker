import { Router } from 'express';
import { getDashboardStats } from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', protect, getDashboardStats);

export default router;
