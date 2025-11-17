import { Router } from 'express';
import * as aiController from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All AI routes require authentication
router.use(authenticate);

router.post('/generate-ideas', aiController.generateIdeas);
router.post('/generate-content', aiController.generateContent);
router.post('/generate-outline', aiController.generateOutline);
router.post('/expand-content', aiController.expandContent);
router.post('/improve-text', aiController.improveText);
router.post('/generate-titles', aiController.generateTitles);
router.post('/generate-cover', aiController.generateCover);
router.post('/generate-sales-copy', aiController.generateSalesCopy);

export default router;
