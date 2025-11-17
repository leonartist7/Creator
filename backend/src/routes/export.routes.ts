import { Router } from 'express';
import * as exportController from '../controllers/export.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All export routes require authentication
router.use(authenticate);

router.post('/pdf', exportController.exportToPDF);
router.post('/epub', exportController.exportToEPUB);
router.post('/docx', exportController.exportToDOCX);

export default router;
