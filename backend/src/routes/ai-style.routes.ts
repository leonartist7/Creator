// AI Style Routes - API endpoints for AI Studio integration
// Phase 8 Implementation

import { Router } from 'express';
import { aiStyleController } from '../controllers/ai-style.controller';

const router = Router();

// Generate AI prompt from masterwork style
router.post('/style-prompt/:id', aiStyleController.generateStylePrompt);

// Compare two style profiles
router.post('/compare', aiStyleController.compareStyles);

// Blend multiple styles
router.post('/blend', aiStyleController.blendStyles);

// Get writing tips for a style
router.get('/tips/:id', aiStyleController.getWritingTips);

export default router;
