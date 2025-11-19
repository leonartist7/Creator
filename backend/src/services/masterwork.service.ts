// Masterwork Service - Business logic for masterwork operations
// US1 Implementation - T032

import { v4 as uuidv4 } from 'uuid';
import {
  Masterwork,
  CreateMasterworkInput,
  UpdateMasterworkInput,
  MasterworkValidator
} from '../models/Masterwork';
import {
  MasterworkUpload,
  CreateMasterworkUploadInput,
  UpdateMasterworkUploadInput,
  MasterworkUploadValidator
} from '../models/MasterworkUpload';
import { getStorage } from '../utils/file-storage';
import { inMemoryStore } from '../data/in-memory-store';

export interface CreateMasterworkFromUploadInput {
  userId: string;
  title: string;
  author?: string;
  format: 'PDF' | 'EPUB' | 'DOCX' | 'TXT' | 'MD';
  fileSize: number;
  filePath: string;
  wordCount: number;
  pageCount?: number;
  coverImageUrl?: string;
  language?: string;
  publicationDate?: Date;
  isbn?: string;
  customTags?: string[];
  userNotes?: string;
  rating?: number;
}

export class MasterworkService {
  /**
   * Create a new masterwork from uploaded file
   */
  async createMasterwork(input: CreateMasterworkInput): Promise<Masterwork> {
    // Validate input
    const validation = MasterworkValidator.validateCreate(input);
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Generate ID and timestamps
    const now = new Date();
    const masterwork: Masterwork = {
      id: uuidv4(),
      userId: input.userId,
      title: input.title,
      author: input.author || null,
      format: input.format,
      fileSize: input.fileSize,
      filePath: input.filePath,
      coverImageUrl: input.coverImageUrl || null,
      pageCount: input.pageCount || null,
      wordCount: input.wordCount,
      language: input.language || 'en',
      publicationDate: input.publicationDate || null,
      isbn: input.isbn || null,
      customTags: input.customTags || [],
      userNotes: input.userNotes || null,
      rating: input.rating || null,
      extractionStatus: 'pending',
      extractionError: null,
      analysisStatus: 'not_started',
      uploadDate: now,
      lastAccessed: now,
      createdAt: now,
      updatedAt: now
    };

    // Save to in-memory store
    inMemoryStore.saveMasterwork(masterwork);
    return masterwork;
  }

  /**
   * Update an existing masterwork
   */
  async updateMasterwork(id: string, input: UpdateMasterworkInput): Promise<Masterwork> {
    // Validate update input
    const validation = MasterworkValidator.validateUpdate(input);
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Update in store
    const updated = inMemoryStore.updateMasterwork(id, input);
    if (!updated) {
      throw new Error('Masterwork not found');
    }

    return updated;
  }

  /**
   * Get masterwork by ID
   */
  async getMasterworkById(id: string): Promise<Masterwork | null> {
    return inMemoryStore.getMasterwork(id);
  }

  /**
   * List masterworks for a user
   * T051: Pagination, T052: Sorting, T053: Filtering
   */
  async listMasterworks(userId: string, options?: {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    filters?: {
      format?: string;
      analysisStatus?: string;
      tags?: string[];
    };
  }): Promise<{ masterworks: Masterwork[]; total: number }> {
    let masterworks = inMemoryStore.listMasterworks(userId);

    // T053: Apply filters
    if (options?.filters) {
      if (options.filters.format) {
        masterworks = masterworks.filter(m => m.format === options.filters!.format);
      }

      if (options.filters.analysisStatus) {
        masterworks = masterworks.filter(m => m.analysisStatus === options.filters!.analysisStatus);
      }

      if (options.filters.tags && options.filters.tags.length > 0) {
        masterworks = masterworks.filter(m =>
          options.filters!.tags!.some(tag => m.customTags.includes(tag))
        );
      }
    }

    const total = masterworks.length;

    // T052: Apply sorting
    const sortBy = options?.sortBy || 'uploadDate';
    const sortOrder = options?.sortOrder || 'desc';

    masterworks.sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (sortBy) {
        case 'title':
          aVal = a.title.toLowerCase();
          bVal = b.title.toLowerCase();
          break;
        case 'author':
          aVal = (a.author || '').toLowerCase();
          bVal = (b.author || '').toLowerCase();
          break;
        case 'uploadDate':
          aVal = a.uploadDate.getTime();
          bVal = b.uploadDate.getTime();
          break;
        case 'wordCount':
          aVal = a.wordCount;
          bVal = b.wordCount;
          break;
        case 'rating':
          aVal = a.rating || 0;
          bVal = b.rating || 0;
          break;
        default:
          aVal = a.uploadDate.getTime();
          bVal = b.uploadDate.getTime();
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    // T051: Apply pagination
    const page = options?.page || 1;
    const pageSize = options?.pageSize || 20;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedMasterworks = masterworks.slice(startIndex, endIndex);

    return {
      masterworks: paginatedMasterworks,
      total
    };
  }

  /**
   * Delete a masterwork
   * T056: Delete endpoint with file cleanup
   */
  async deleteMasterwork(id: string): Promise<void> {
    const masterwork = inMemoryStore.getMasterwork(id);
    if (!masterwork) {
      throw new Error('Masterwork not found');
    }

    // Delete associated file from storage
    try {
      const storage = getStorage();
      await storage.delete(masterwork.filePath);
    } catch (error) {
      console.error('Failed to delete file from storage:', error);
      // Continue with deletion even if file delete fails
    }

    // Delete from store
    const deleted = inMemoryStore.deleteMasterwork(id);
    if (!deleted) {
      throw new Error('Failed to delete masterwork');
    }
  }

  /**
   * Update last accessed timestamp
   * T054: Detail view with access tracking
   */
  async updateLastAccessed(id: string): Promise<void> {
    const masterwork = inMemoryStore.getMasterwork(id);
    if (!masterwork) {
      return; // Silently fail if not found
    }

    inMemoryStore.updateMasterwork(id, {
      lastAccessed: new Date()
    });
  }

  /**
   * Create upload tracking record
   */
  async createUploadTracking(input: CreateMasterworkUploadInput): Promise<MasterworkUpload> {
    // Validate input
    const validation = MasterworkUploadValidator.validateCreate(input);
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    const now = new Date();
    const upload: MasterworkUpload = {
      id: uuidv4(),
      userId: input.userId,
      fileName: input.fileName,
      fileSize: input.fileSize,
      format: input.format,
      status: 'uploading',
      progressPercentage: 0,
      errorMessage: null,
      tempFilePath: input.tempFilePath || null,
      masterworkId: null,
      createdAt: now,
      updatedAt: now
    };

    // Save to in-memory store
    inMemoryStore.saveUpload(upload);
    return upload;
  }

  /**
   * Update upload tracking record
   */
  async updateUploadTracking(
    id: string,
    input: UpdateMasterworkUploadInput
  ): Promise<MasterworkUpload> {
    // Validate update
    const validation = MasterworkUploadValidator.validateUpdate(input);
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Update in store
    const updated = inMemoryStore.updateUpload(id, input);
    if (!updated) {
      throw new Error('Upload tracking record not found');
    }

    return updated;
  }

  /**
   * Get upload tracking by ID
   */
  async getUploadTracking(id: string): Promise<MasterworkUpload | null> {
    return inMemoryStore.getUpload(id);
  }

  /**
   * Calculate word count estimate from file size and format
   * Used as initial estimate before actual extraction
   */
  estimateWordCount(fileSize: number, format: string): number {
    // Rough estimates based on format
    // These will be replaced with actual counts during text extraction
    const bytesPerWord: Record<string, number> = {
      PDF: 20, // PDFs are usually compressed
      EPUB: 15,
      DOCX: 12,
      TXT: 6, // Plain text is most efficient
      MD: 8
    };

    const divisor = bytesPerWord[format] || 15;
    return Math.round(fileSize / divisor);
  }

  /**
   * Validate masterwork ownership
   */
  async validateOwnership(masterworkId: string, userId: string): Promise<boolean> {
    // TODO: Fetch masterwork and check userId
    throw new Error('Not implemented yet - database integration pending');
  }
}

// Export singleton instance
export const masterworkService = new MasterworkService();
