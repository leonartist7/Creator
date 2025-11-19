// Masterwork Controller - Request handlers for Knowledge Vault API
// US1 Implementation - T038-T041

import { Request, Response, NextFunction } from 'express';
import { uploadService } from '../services/upload.service';
import { masterworkService } from '../services/masterwork.service';
import { metadataExtractor } from '../utils/metadata-extractor';
import { getStorage } from '../utils/file-storage';
import { addTextExtractionJob, addStyleAnalysisJob } from '../config/bull';
import { styleAnalysisService } from '../services/style-analysis.service';
import { searchService } from '../services/search.service';
import fs from 'fs/promises';

export class MasterworkController {
  /**
   * T039: POST /api/masterworks/upload - Upload a new masterwork
   */
  async uploadMasterwork(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const file = req.file;

      // Validate file was uploaded
      if (!file) {
        res.status(400).json({
          message: 'No file uploaded',
          errors: ['File is required']
        });
        return;
      }

      // Validate title is provided
      const title = req.body.title;
      if (!title || title.trim().length === 0) {
        // Clean up uploaded file
        await fs.unlink(file.path).catch(() => {});

        res.status(400).json({
          message: 'Title is required',
          errors: ['Title is required']
        });
        return;
      }

      // Validate file using UploadService
      const validation = uploadService.validateFile(file);
      if (!validation.valid) {
        // Clean up uploaded file
        await fs.unlink(file.path).catch(() => {});

        res.status(400).json({
          message: validation.errors.join(', '),
          errors: validation.errors
        });
        return;
      }

      // Get file format
      const format = uploadService.getFileFormat(file.originalname);
      if (!format) {
        await fs.unlink(file.path).catch(() => {});

        res.status(400).json({
          message: 'Invalid file format',
          errors: ['Could not determine file format']
        });
        return;
      }

      // T040: Create upload tracking record
      const uploadTracking = await masterworkService.createUploadTracking({
        userId: req.body.userId || 'user-123', // TODO: Get from auth middleware
        fileName: file.originalname,
        fileSize: file.size,
        format,
        tempFilePath: file.path
      });

      // Extract metadata in background (non-blocking)
      this.processUpload(uploadTracking.id, file, title, req.body).catch(err => {
        console.error('Upload processing error:', err);
      });

      // Return upload ID immediately
      res.status(200).json({
        uploadId: uploadTracking.id,
        message: 'Upload started successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * T040-T041: Process upload in background (metadata extraction, storage, DB save)
   */
  private async processUpload(
    uploadId: string,
    file: Express.Multer.File,
    title: string,
    metadata: any
  ): Promise<void> {
    try {
      // Update progress: processing
      await masterworkService.updateUploadTracking(uploadId, {
        status: 'processing',
        progressPercentage: 25
      });

      // Get file format
      const format = uploadService.getFileFormat(file.originalname)!;

      // Extract metadata from file
      const extractedMetadata = await metadataExtractor.extract(file.path, format);

      // Update progress: 50%
      await masterworkService.updateUploadTracking(uploadId, {
        progressPercentage: 50
      });

      // Move file to permanent storage
      const storage = getStorage();
      const userId = metadata.userId || 'user-123'; // TODO: Get from auth

      const fileStream = require('fs').createReadStream(file.path);
      const uploadResult = await storage.upload(fileStream, {
        userId,
        fileName: file.originalname,
        contentType: file.mimetype
      });

      // Update progress: 75%
      await masterworkService.updateUploadTracking(uploadId, {
        progressPercentage: 75
      });

      // Create masterwork record
      const masterwork = await masterworkService.createMasterwork({
        userId,
        title: title || extractedMetadata.title || file.originalname,
        author: metadata.author || extractedMetadata.author,
        format,
        fileSize: file.size,
        filePath: uploadResult.filePath,
        wordCount: extractedMetadata.wordCount,
        pageCount: metadata.pageCount || extractedMetadata.pageCount,
        coverImageUrl: metadata.coverImageUrl,
        language: metadata.language || extractedMetadata.language || 'en',
        publicationDate: metadata.publicationDate || extractedMetadata.publicationDate,
        isbn: metadata.isbn || extractedMetadata.isbn,
        customTags: metadata.customTags ? JSON.parse(metadata.customTags) : [],
        userNotes: metadata.userNotes,
        rating: metadata.rating ? parseInt(metadata.rating) : undefined
      });

      // Update upload tracking: complete
      await masterworkService.updateUploadTracking(uploadId, {
        status: 'complete',
        progressPercentage: 100,
        masterworkId: masterwork.id
      });

      // Clean up temp file
      await fs.unlink(file.path).catch(() => {});

      // T041: Queue text extraction job (if word count is 0 or needs chunking)
      if (masterwork.wordCount > 0) {
        await addTextExtractionJob({
          masterworkId: masterwork.id,
          filePath: masterwork.filePath,
          format: masterwork.format,
          userId: masterwork.userId
        });
      }
    } catch (error) {
      console.error('Upload processing error:', error);

      // Update upload tracking: failed
      await masterworkService.updateUploadTracking(uploadId, {
        status: 'failed',
        errorMessage: (error as Error).message
      }).catch(() => {});

      // Clean up temp file
      await fs.unlink(file.path).catch(() => {});
    }
  }

  /**
   * GET /api/masterworks/uploads/:uploadId - Get upload progress
   */
  async getUploadProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { uploadId } = req.params;

      const upload = await masterworkService.getUploadTracking(uploadId);

      if (!upload) {
        res.status(404).json({
          message: 'Upload not found'
        });
        return;
      }

      res.status(200).json({
        upload
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/masterworks - List all masterworks for user
   */
  async listMasterworks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.query.userId as string || 'user-123'; // TODO: Get from auth
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 20;
      const sortBy = req.query.sortBy as string || 'uploadDate';
      const sortOrder = (req.query.sortOrder as string || 'desc') as 'asc' | 'desc';

      const result = await masterworkService.listMasterworks(userId, {
        page,
        pageSize,
        sortBy,
        sortOrder
      });

      res.status(200).json({
        masterworks: result.masterworks,
        total: result.total,
        page,
        pageSize
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/masterworks/:id - Get single masterwork
   */
  async getMasterwork(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const masterwork = await masterworkService.getMasterworkById(id);

      if (!masterwork) {
        res.status(404).json({
          message: 'Masterwork not found'
        });
        return;
      }

      // Update last accessed
      await masterworkService.updateLastAccessed(id).catch(() => {});

      res.status(200).json({
        masterwork
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/masterworks/:id - Update masterwork metadata
   */
  async updateMasterwork(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const masterwork = await masterworkService.updateMasterwork(id, req.body);

      res.status(200).json({
        masterwork
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/masterworks/:id - Delete masterwork
   */
  async deleteMasterwork(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      await masterworkService.deleteMasterwork(id);

      res.status(200).json({
        message: 'Masterwork deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/masterworks/:id/extract - Trigger text extraction
   */
  async triggerExtraction(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const masterwork = await masterworkService.getMasterworkById(id);

      if (!masterwork) {
        res.status(404).json({
          message: 'Masterwork not found'
        });
        return;
      }

      // Queue extraction job
      const job = await addTextExtractionJob({
        masterworkId: masterwork.id,
        filePath: masterwork.filePath,
        format: masterwork.format,
        userId: masterwork.userId
      });

      res.status(200).json({
        message: 'Text extraction started',
        jobId: job.id
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/masterworks/:id/analyze - Trigger style analysis
   * T104: Start style DNA analysis
   */
  async triggerAnalysis(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const masterwork = await masterworkService.getMasterworkById(id);

      if (!masterwork) {
        res.status(404).json({
          message: 'Masterwork not found'
        });
        return;
      }

      // Check if text has been extracted
      if (masterwork.extractionStatus !== 'completed') {
        res.status(400).json({
          message: 'Text extraction must be completed before style analysis',
          extractionStatus: masterwork.extractionStatus
        });
        return;
      }

      // Queue style analysis job
      const job = await addStyleAnalysisJob({
        masterworkId: masterwork.id,
        userId: masterwork.userId
      });

      res.status(200).json({
        message: 'Style analysis started',
        jobId: job.id
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/masterworks/:id/style - Get style profile
   * T105: Retrieve style DNA profile
   */
  async getStyleProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const masterwork = await masterworkService.getMasterworkById(id);

      if (!masterwork) {
        res.status(404).json({
          message: 'Masterwork not found'
        });
        return;
      }

      // Get style profile
      const styleProfile = await styleAnalysisService.getStyleProfile(id);

      if (!styleProfile) {
        res.status(404).json({
          message: 'Style profile not found. Run analysis first.',
          analysisStatus: masterwork.analysisStatus
        });
        return;
      }

      res.status(200).json({
        styleProfile
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/masterworks/:id/chunks - Get text chunks
   */
  async getTextChunks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(501).json({
        message: 'Text chunks retrieval not implemented yet (US3)'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/masterworks/search - Search across masterworks
   * T119: Full-text search endpoint
   */
  async searchMasterworks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { query, masterworkIds, limit, offset } = req.body;

      if (!query || query.trim().length === 0) {
        res.status(400).json({
          message: 'Search query is required'
        });
        return;
      }

      const searchResult = await searchService.search({
        query,
        masterworkIds,
        limit: limit || 20,
        offset: offset || 0
      });

      res.status(200).json(searchResult);
    } catch (error) {
      next(error);
    }
  }
}

// Export singleton instance
export const masterworkController = new MasterworkController();
