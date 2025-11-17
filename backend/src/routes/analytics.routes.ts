import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All analytics routes require authentication
router.use(authenticate);

router.get('/dashboard', analyticsController.getDashboard);
router.get('/project/:id', analyticsController.getProjectAnalytics);

export default router;
