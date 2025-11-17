import { Router } from 'express';
import * as aiController from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All AI routes require authentication
router.use(authenticate);

router.post('/generate-ideas', aiController.generateIdeasController);
router.post('/generate-content', aiController.generateContentController);
router.post('/generate-outline', aiController.generateOutlineController);
router.post('/expand-content', aiController.expandContentController);
router.post('/improve-text', aiController.improveTextController);
router.post('/generate-titles', aiController.generateTitlesController);
router.post('/generate-sales-copy', aiController.generateSalesCopyController);

export default router;
