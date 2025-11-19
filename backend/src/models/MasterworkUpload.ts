// MasterworkUpload Model
// Represents temporary upload progress tracking

import { FileFormat } from './Masterwork';

export type UploadStatus = 'uploading' | 'processing' | 'complete' | 'failed';

export interface MasterworkUpload {
  id: string;
  userId: string;

  fileName: string;
  fileSize: number;
  format: FileFormat;

  status: UploadStatus;
  progressPercentage: number;
  errorMessage: string | null;

  tempFilePath: string | null;
  masterworkId: string | null;

  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMasterworkUploadInput {
  userId: string;
  fileName: string;
  fileSize: number;
  format: FileFormat;
  tempFilePath?: string;
}

export interface UpdateMasterworkUploadInput {
  status?: UploadStatus;
  progressPercentage?: number;
  errorMessage?: string;
  tempFilePath?: string;
  masterworkId?: string;
}

export class MasterworkUploadValidator {
  static readonly MAX_FILE_SIZE = 52428800; // 50MB
  static readonly ALLOWED_FORMATS: FileFormat[] = ['PDF', 'EPUB', 'DOCX', 'TXT', 'MD'];
  static readonly MAX_FILENAME_LENGTH = 255;

  static validateCreate(input: CreateMasterworkUploadInput): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields
    if (!input.userId) errors.push('userId is required');
    if (!input.fileName || input.fileName.trim().length === 0) {
      errors.push('fileName is required');
    }
    if (!input.fileSize || input.fileSize <= 0) {
      errors.push('fileSize is required and must be positive');
    }
    if (!input.format) {
      errors.push('format is required');
    }

    // File name validation
    if (input.fileName && input.fileName.length > this.MAX_FILENAME_LENGTH) {
      errors.push(`fileName must not exceed ${this.MAX_FILENAME_LENGTH} characters`);
    }

    // File size validation
    if (input.fileSize && input.fileSize > this.MAX_FILE_SIZE) {
      errors.push(
        `File size exceeds maximum allowed size of ${this.MAX_FILE_SIZE / 1024 / 1024}MB`
      );
    }

    // Format validation
    if (input.format && !this.ALLOWED_FORMATS.includes(input.format)) {
      errors.push(
        `Invalid format: ${input.format}. Allowed formats: ${this.ALLOWED_FORMATS.join(', ')}`
      );
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  static validateUpdate(input: UpdateMasterworkUploadInput): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Progress percentage validation
    if (
      input.progressPercentage !== undefined &&
      (input.progressPercentage < 0 || input.progressPercentage > 100)
    ) {
      errors.push('progressPercentage must be between 0 and 100');
    }

    // Status validation
    if (
      input.status &&
      !['uploading', 'processing', 'complete', 'failed'].includes(input.status)
    ) {
      errors.push(`Invalid status: ${input.status}`);
    }

    // Validation logic: failed status requires error message
    if (input.status === 'failed' && !input.errorMessage) {
      errors.push('errorMessage is required when status is "failed"');
    }

    // Validation logic: complete status requires masterworkId
    if (input.status === 'complete' && !input.masterworkId) {
      errors.push('masterworkId is required when status is "complete"');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  static calculateProgressPercentage(bytesUploaded: number, totalBytes: number): number {
    if (totalBytes <= 0) return 0;
    const percentage = (bytesUploaded / totalBytes) * 100;
    return Math.min(100, Math.max(0, Math.round(percentage)));
  }

  static getStatusMessage(upload: MasterworkUpload): string {
    switch (upload.status) {
      case 'uploading':
        return `Uploading ${upload.fileName} (${upload.progressPercentage}%)`;
      case 'processing':
        return `Processing ${upload.fileName}...`;
      case 'complete':
        return `Successfully uploaded ${upload.fileName}`;
      case 'failed':
        return `Failed to upload ${upload.fileName}: ${upload.errorMessage || 'Unknown error'}`;
      default:
        return `Upload status: ${upload.status}`;
    }
  }
}
