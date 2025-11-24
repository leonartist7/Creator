import { Request, Response } from 'express';
import { uploadService } from '../services/upload.service';
import Masterwork from '../models/Masterwork';

export class MasterworkController {
  /**
   * Upload a new masterwork
   */
  public async upload(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      // TODO: Get real user ID from auth middleware
      const userId = req.body.userId || 'test-user-id';

      const result = await uploadService.processUpload(
        userId,
        req.file,
        {
          title: req.body.title,
          author: req.body.author
        }
      );

      res.status(201).json(result);
    } catch (error: any) {
      console.error('Upload error:', error);
      res.status(500).json({ error: error.message || 'Upload failed' });
    }
  }

  /**
   * List all masterworks
   */
  public async list(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Get real user ID
      const userId = req.query.userId as string || 'test-user-id';

      const StyleProfile = (await import('../models/StyleProfile')).default;

      const masterworks = await Masterwork.findAll({
        where: { user_id: userId },
        include: [{
          model: StyleProfile,
          as: 'style_profile',
          required: false
        }],
        order: [['upload_date', 'DESC']]
      });

      res.json(masterworks);
    } catch (error: any) {
      console.error('List error:', error);
      res.status(500).json({ error: 'Failed to fetch masterworks' });
    }
  }

  /**
   * Get a single masterwork
   */
  public async get(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const StyleProfile = (await import('../models/StyleProfile')).default;

      const masterwork = await Masterwork.findByPk(id, {
        include: [{
          model: StyleProfile,
          as: 'style_profile',
          required: false
        }]
      });

      if (!masterwork) {
        res.status(404).json({ error: 'Masterwork not found' });
        return;
      }

      res.json(masterwork);
    } catch (error: any) {
      console.error('Get error:', error);
      res.status(500).json({ error: 'Failed to fetch masterwork' });
    }
  }
}

export const masterworkController = new MasterworkController();
