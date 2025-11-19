// Unit tests for Masterwork model
import { describe, it, expect } from 'vitest';
import {
  MasterworkValidator,
  CreateMasterworkInput,
  UpdateMasterworkInput,
  FileFormat
} from '../Masterwork';

describe('MasterworkValidator', () => {
  describe('validateCreate', () => {
    const validInput: CreateMasterworkInput = {
      userId: 'user-123',
      title: 'The Shining',
      author: 'Stephen King',
      format: 'PDF',
      fileSize: 2500000,
      filePath: '/uploads/user-123/the-shining.pdf',
      wordCount: 119000,
      language: 'en'
    };

    it('should validate a valid masterwork input', () => {
      const result = MasterworkValidator.validateCreate(validInput);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should require userId', () => {
      const input = { ...validInput, userId: '' };
      const result = MasterworkValidator.validateCreate(input);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('userId is required');
    });

    it('should require title', () => {
      const input = { ...validInput, title: '' };
      const result = MasterworkValidator.validateCreate(input);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('title is required');
    });

    it('should reject title longer than 500 characters', () => {
      const input = { ...validInput, title: 'a'.repeat(501) };
      const result = MasterworkValidator.validateCreate(input);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('title must not exceed 500 characters');
    });

    it('should reject author longer than 200 characters', () => {
      const input = { ...validInput, author: 'a'.repeat(201) };
      const result = MasterworkValidator.validateCreate(input);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('author must not exceed 200 characters');
    });

    it('should reject file size exceeding 50MB', () => {
      const input = { ...validInput, fileSize: 52428801 }; // 50MB + 1 byte
      const result = MasterworkValidator.validateCreate(input);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('fileSize'))).toBe(true);
    });

    it('should accept file size at exactly 50MB', () => {
      const input = { ...validInput, fileSize: 52428800 }; // Exactly 50MB
      const result = MasterworkValidator.validateCreate(input);
      expect(result.valid).toBe(true);
    });

    it('should reject invalid file format', () => {
      const input = { ...validInput, format: 'INVALID' as FileFormat };
      const result = MasterworkValidator.validateCreate(input);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('format'))).toBe(true);
    });

    it('should accept all valid file formats', () => {
      const formats: FileFormat[] = ['PDF', 'EPUB', 'DOCX', 'TXT', 'MD'];
      formats.forEach(format => {
        const input = { ...validInput, format };
        const result = MasterworkValidator.validateCreate(input);
        expect(result.valid).toBe(true);
      });
    });

    it('should require wordCount to be non-negative', () => {
      const input = { ...validInput, wordCount: -1 };
      const result = MasterworkValidator.validateCreate(input);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('wordCount must be non-negative');
    });

    it('should require wordCount when provided', () => {
      const input = { ...validInput, wordCount: 0 };
      const result = MasterworkValidator.validateCreate(input);
      expect(result.valid).toBe(true); // 0 is valid for empty documents
    });

    it('should validate rating range (1-5)', () => {
      const validRatings = [1, 2, 3, 4, 5];
      validRatings.forEach(rating => {
        const input = { ...validInput, rating };
        const result = MasterworkValidator.validateCreate(input);
        expect(result.valid).toBe(true);
      });

      const invalidRatings = [0, 6, -1, 10];
      invalidRatings.forEach(rating => {
        const input = { ...validInput, rating };
        const result = MasterworkValidator.validateCreate(input);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('rating must be between 1 and 5');
      });
    });

    it('should validate pageCount is positive when provided', () => {
      const input = { ...validInput, pageCount: 0 };
      const result = MasterworkValidator.validateCreate(input);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('pageCount must be positive');
    });

    it('should accept null pageCount', () => {
      const input = { ...validInput, pageCount: null };
      const result = MasterworkValidator.validateCreate(input);
      expect(result.valid).toBe(true);
    });

    it('should validate customTags is an array', () => {
      const input = { ...validInput, customTags: ['horror', 'thriller'] };
      const result = MasterworkValidator.validateCreate(input);
      expect(result.valid).toBe(true);
    });
  });

  describe('validateUpdate', () => {
    it('should validate a valid update input', () => {
      const input: UpdateMasterworkInput = {
        title: 'Updated Title',
        userNotes: 'Updated notes',
        rating: 4
      };
      const result = MasterworkValidator.validateUpdate(input);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid rating', () => {
      const input: UpdateMasterworkInput = { rating: 6 };
      const result = MasterworkValidator.validateUpdate(input);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('rating must be between 1 and 5');
    });

    it('should reject title longer than 500 characters', () => {
      const input: UpdateMasterworkInput = { title: 'a'.repeat(501) };
      const result = MasterworkValidator.validateUpdate(input);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('title must not exceed 500 characters');
    });

    it('should allow partial updates', () => {
      const input: UpdateMasterworkInput = { rating: 5 };
      const result = MasterworkValidator.validateUpdate(input);
      expect(result.valid).toBe(true);
    });

    it('should allow empty update object', () => {
      const input: UpdateMasterworkInput = {};
      const result = MasterworkValidator.validateUpdate(input);
      expect(result.valid).toBe(true);
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(MasterworkValidator.formatFileSize(500)).toBe('500 B');
      expect(MasterworkValidator.formatFileSize(1023)).toBe('1023 B');
    });

    it('should format kilobytes correctly', () => {
      expect(MasterworkValidator.formatFileSize(1024)).toBe('1.00 KB');
      expect(MasterworkValidator.formatFileSize(1536)).toBe('1.50 KB');
    });

    it('should format megabytes correctly', () => {
      expect(MasterworkValidator.formatFileSize(1048576)).toBe('1.00 MB');
      expect(MasterworkValidator.formatFileSize(2500000)).toBe('2.38 MB');
    });

    it('should format gigabytes correctly', () => {
      expect(MasterworkValidator.formatFileSize(1073741824)).toBe('1.00 GB');
    });

    it('should handle zero bytes', () => {
      expect(MasterworkValidator.formatFileSize(0)).toBe('0 B');
    });
  });
});
