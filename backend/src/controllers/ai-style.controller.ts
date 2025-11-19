// AI Style Controller - API endpoints for AI style integration
// Phase 8 Implementation

import { Request, Response, NextFunction } from 'express';
import { aiStyleIntegrationService } from '../services/ai-style-integration.service';

export class AIStyleController {
  /**
   * POST /api/ai-studio/style-prompt/:id - Generate AI prompt from masterwork style
   */
  async generateStylePrompt(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const prompt = await aiStyleIntegrationService.generateStylePrompt(id);

      res.status(200).json({
        prompt
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/ai-studio/compare - Compare two style profiles
   */
  async compareStyles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { masterworkId1, masterworkId2 } = req.body;

      if (!masterworkId1 || !masterworkId2) {
        res.status(400).json({
          message: 'Both masterworkId1 and masterworkId2 are required'
        });
        return;
      }

      const comparison = await aiStyleIntegrationService.compareStyles(
        masterworkId1,
        masterworkId2
      );

      res.status(200).json({
        comparison
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/ai-studio/blend - Blend multiple styles
   */
  async blendStyles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { styles } = req.body;

      if (!styles || !Array.isArray(styles) || styles.length < 2) {
        res.status(400).json({
          message: 'At least 2 styles required for blending'
        });
        return;
      }

      // Validate style inputs
      const invalidInputs = styles.filter(
        s => !s.masterworkId || typeof s.weight !== 'number' || s.weight <= 0
      );

      if (invalidInputs.length > 0) {
        res.status(400).json({
          message: 'Each style must have masterworkId and positive weight'
        });
        return;
      }

      const blended = await aiStyleIntegrationService.blendStyles(styles);

      res.status(200).json({
        blended
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/ai-studio/tips/:id - Get writing tips for a style
   */
  async getWritingTips(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      // Get style profile from store
      const { inMemoryStore } = await import('../data/in-memory-store');
      const styleProfile = inMemoryStore.getStyleProfile(id);

      if (!styleProfile) {
        res.status(404).json({
          message: 'Style profile not found'
        });
        return;
      }

      const tips = aiStyleIntegrationService.getWritingTips(styleProfile);

      res.status(200).json({
        tips
      });
    } catch (error) {
      next(error);
    }
  }
}

// Export singleton
export const aiStyleController = new AIStyleController();
