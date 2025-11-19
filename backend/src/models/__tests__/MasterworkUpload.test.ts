// Unit tests for MasterworkUpload model
import { describe, it, expect } from 'vitest';
import {
  MasterworkUploadValidator,
  CreateMasterworkUploadInput,
  UpdateMasterworkUploadInput,
  MasterworkUpload,
  UploadStatus
} from '../MasterworkUpload';

describe('MasterworkUploadValidator', () => {
  describe('validateCreate', () => {
    const validInput: CreateMasterworkUploadInput = {
      userId: 'user-123',
      fileName: 'the-shining.pdf',
      fileSize: 2500000,
      format: 'PDF',
      tempFilePath: '/tmp/uploads/temp-12345.pdf'
    };

    it('should validate a valid upload input', () => {
      const result = MasterworkUploadValidator.validateCreate(validInput);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should require userId', () => {
      const input = { ...validInput, userId: '' };
      const result = MasterworkUploadValidator.validateCreate(input);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('userId is required');
    });

    it('should require fileName', () => {
      const input = { ...validInput, fileName: '' };
      const result = MasterworkUploadValidator.validateCreate(input);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('fileName is required');
    });

    it('should require positive fileSize', () => {
      const input = { ...validInput, fileSize: 0 };
      const result = MasterworkUploadValidator.validateCreate(input);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('fileSize is required and must be positive');
    });

    it('should require format', () => {
      const input = { ...validInput, format: '' as any };
      const result = MasterworkUploadValidator.validateCreate(input);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('format is required');
    });

    it('should reject fileName exceeding 255 characters', () => {
      const input = { ...validInput, fileName: 'a'.repeat(256) + '.pdf' };
      const result = MasterworkUploadValidator.validateCreate(input);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('fileName must not exceed 255 characters');
    });

    it('should reject fileSize exceeding 50MB', () => {
      const input = { ...validInput, fileSize: 52428801 };
      const result = MasterworkUploadValidator.validateCreate(input);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('File size exceeds maximum'))).toBe(true);
    });

    it('should accept fileSize at exactly 50MB', () => {
      const input = { ...validInput, fileSize: 52428800 };
      const result = MasterworkUploadValidator.validateCreate(input);
      expect(result.valid).toBe(true);
    });

    it('should reject invalid format', () => {
      const input = { ...validInput, format: 'INVALID' as any };
      const result = MasterworkUploadValidator.validateCreate(input);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Invalid format'))).toBe(true);
    });

    it('should accept all valid formats', () => {
      const formats = ['PDF', 'EPUB', 'DOCX', 'TXT', 'MD'];
      formats.forEach(format => {
        const input = { ...validInput, format: format as any };
        const result = MasterworkUploadValidator.validateCreate(input);
        expect(result.valid).toBe(true);
      });
    });

    it('should accept optional tempFilePath', () => {
      const input = { ...validInput, tempFilePath: undefined };
      const result = MasterworkUploadValidator.validateCreate(input);
      expect(result.valid).toBe(true);
    });
  });

  describe('validateUpdate', () => {
    it('should validate a valid update input', () => {
      const input: UpdateMasterworkUploadInput = {
        status: 'processing',
        progressPercentage: 75
      };
      const result = MasterworkUploadValidator.validateUpdate(input);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid progressPercentage (< 0)', () => {
      const input: UpdateMasterworkUploadInput = { progressPercentage: -1 };
      const result = MasterworkUploadValidator.validateUpdate(input);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('progressPercentage must be between 0 and 100');
    });

    it('should reject invalid progressPercentage (> 100)', () => {
      const input: UpdateMasterworkUploadInput = { progressPercentage: 101 };
      const result = MasterworkUploadValidator.validateUpdate(input);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('progressPercentage must be between 0 and 100');
    });

    it('should accept progressPercentage at boundaries', () => {
      const validValues = [0, 50, 100];
      validValues.forEach(value => {
        const input: UpdateMasterworkUploadInput = { progressPercentage: value };
        const result = MasterworkUploadValidator.validateUpdate(input);
        expect(result.valid).toBe(true);
      });
    });

    it('should reject invalid status', () => {
      const input: UpdateMasterworkUploadInput = { status: 'invalid' as UploadStatus };
      const result = MasterworkUploadValidator.validateUpdate(input);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Invalid status'))).toBe(true);
    });

    it('should accept all valid statuses', () => {
      const validStatuses: UploadStatus[] = ['uploading', 'processing', 'complete', 'failed'];
      validStatuses.forEach(status => {
        const input: UpdateMasterworkUploadInput = { status };
        const result = MasterworkUploadValidator.validateUpdate(input);
        // Only 'failed' and 'complete' have additional requirements
        if (status !== 'failed' && status !== 'complete') {
          expect(result.valid).toBe(true);
        }
      });
    });

    it('should require errorMessage when status is failed', () => {
      const input: UpdateMasterworkUploadInput = {
        status: 'failed'
      };
      const result = MasterworkUploadValidator.validateUpdate(input);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('errorMessage is required when status is "failed"');
    });

    it('should accept errorMessage with failed status', () => {
      const input: UpdateMasterworkUploadInput = {
        status: 'failed',
        errorMessage: 'File corrupted'
      };
      const result = MasterworkUploadValidator.validateUpdate(input);
      expect(result.valid).toBe(true);
    });

    it('should require masterworkId when status is complete', () => {
      const input: UpdateMasterworkUploadInput = {
        status: 'complete'
      };
      const result = MasterworkUploadValidator.validateUpdate(input);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('masterworkId is required when status is "complete"');
    });

    it('should accept masterworkId with complete status', () => {
      const input: UpdateMasterworkUploadInput = {
        status: 'complete',
        masterworkId: '550e8400-e29b-41d4-a716-446655440001'
      };
      const result = MasterworkUploadValidator.validateUpdate(input);
      expect(result.valid).toBe(true);
    });

    it('should allow partial updates', () => {
      const input: UpdateMasterworkUploadInput = { progressPercentage: 50 };
      const result = MasterworkUploadValidator.validateUpdate(input);
      expect(result.valid).toBe(true);
    });

    it('should allow empty update object', () => {
      const input: UpdateMasterworkUploadInput = {};
      const result = MasterworkUploadValidator.validateUpdate(input);
      expect(result.valid).toBe(true);
    });
  });

  describe('calculateProgressPercentage', () => {
    it('should calculate progress correctly', () => {
      expect(MasterworkUploadValidator.calculateProgressPercentage(0, 1000)).toBe(0);
      expect(MasterworkUploadValidator.calculateProgressPercentage(500, 1000)).toBe(50);
      expect(MasterworkUploadValidator.calculateProgressPercentage(1000, 1000)).toBe(100);
    });

    it('should handle partial progress', () => {
      expect(MasterworkUploadValidator.calculateProgressPercentage(250, 1000)).toBe(25);
      expect(MasterworkUploadValidator.calculateProgressPercentage(750, 1000)).toBe(75);
    });

    it('should round to nearest integer', () => {
      expect(MasterworkUploadValidator.calculateProgressPercentage(333, 1000)).toBe(33);
      expect(MasterworkUploadValidator.calculateProgressPercentage(667, 1000)).toBe(67);
    });

    it('should handle zero totalBytes', () => {
      expect(MasterworkUploadValidator.calculateProgressPercentage(100, 0)).toBe(0);
    });

    it('should cap at 100%', () => {
      expect(MasterworkUploadValidator.calculateProgressPercentage(1500, 1000)).toBe(100);
    });

    it('should floor at 0%', () => {
      expect(MasterworkUploadValidator.calculateProgressPercentage(-100, 1000)).toBe(0);
    });

    it('should handle large file sizes', () => {
      const largeSize = 52428800; // 50MB
      expect(MasterworkUploadValidator.calculateProgressPercentage(largeSize / 2, largeSize)).toBe(50);
      expect(MasterworkUploadValidator.calculateProgressPercentage(largeSize, largeSize)).toBe(100);
    });
  });

  describe('getStatusMessage', () => {
    const baseUpload: MasterworkUpload = {
      id: 'upload-123',
      userId: 'user-123',
      fileName: 'test.pdf',
      fileSize: 1000000,
      format: 'PDF',
      status: 'uploading',
      progressPercentage: 0,
      errorMessage: null,
      tempFilePath: null,
      masterworkId: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    it('should return correct message for uploading status', () => {
      const upload = { ...baseUpload, status: 'uploading' as UploadStatus, progressPercentage: 45 };
      const message = MasterworkUploadValidator.getStatusMessage(upload);
      expect(message).toBe('Uploading test.pdf (45%)');
    });

    it('should return correct message for processing status', () => {
      const upload = { ...baseUpload, status: 'processing' as UploadStatus };
      const message = MasterworkUploadValidator.getStatusMessage(upload);
      expect(message).toBe('Processing test.pdf...');
    });

    it('should return correct message for complete status', () => {
      const upload = { ...baseUpload, status: 'complete' as UploadStatus };
      const message = MasterworkUploadValidator.getStatusMessage(upload);
      expect(message).toBe('Successfully uploaded test.pdf');
    });

    it('should return correct message for failed status with error', () => {
      const upload = {
        ...baseUpload,
        status: 'failed' as UploadStatus,
        errorMessage: 'File corrupted'
      };
      const message = MasterworkUploadValidator.getStatusMessage(upload);
      expect(message).toBe('Failed to upload test.pdf: File corrupted');
    });

    it('should return correct message for failed status without error', () => {
      const upload = { ...baseUpload, status: 'failed' as UploadStatus };
      const message = MasterworkUploadValidator.getStatusMessage(upload);
      expect(message).toBe('Failed to upload test.pdf: Unknown error');
    });

    it('should include progress in uploading message', () => {
      const upload = { ...baseUpload, status: 'uploading' as UploadStatus, progressPercentage: 100 };
      const message = MasterworkUploadValidator.getStatusMessage(upload);
      expect(message).toContain('100%');
    });
  });
});
