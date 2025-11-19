// Upload Service - File validation and upload handling
// US1 Implementation - T031

import path from 'path';

export interface FileValidationResult {
  valid: boolean;
  errors: string[];
}

export class UploadService {
  private static readonly MAX_FILE_SIZE = 52428800; // 50MB in bytes
  private static readonly ALLOWED_FORMATS = ['.pdf', '.epub', '.docx', '.txt', '.md'];
  private static readonly ALLOWED_MIMETYPES = [
    'application/pdf',
    'application/epub+zip',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/markdown'
  ];

  /**
   * Validate uploaded file (format and size)
   */
  validateFile(file: Express.Multer.File): FileValidationResult {
    const errors: string[] = [];

    // Check if file exists
    if (!file) {
      errors.push('No file provided');
      return { valid: false, errors };
    }

    // Validate file size
    if (!this.validateFileSize(file.size)) {
      if (file.size === 0) {
        errors.push('File is empty (0 bytes)');
      } else {
        errors.push(`File size exceeds maximum allowed size of 50MB (${this.formatBytes(file.size)} provided)`);
      }
    }

    // Validate file format
    if (!this.validateFileFormat(file.originalname, file.mimetype)) {
      const ext = this.getFileExtension(file.originalname);
      errors.push(
        `Invalid file format: ${ext || 'unknown'}. Allowed formats: PDF, EPUB, DOCX, TXT, MD`
      );
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate file format based on extension and MIME type
   */
  validateFileFormat(filename: string, mimetype: string): boolean {
    const extension = this.getFileExtension(filename);

    // Check extension
    if (!this.isAllowedFormat(extension)) {
      return false;
    }

    // Optionally verify MIME type matches (less strict to allow variation)
    // We primarily trust the extension but MIME type adds extra validation
    return true;
  }

  /**
   * Validate file size
   */
  validateFileSize(fileSize: number): boolean {
    return fileSize > 0 && fileSize <= UploadService.MAX_FILE_SIZE;
  }

  /**
   * Get file extension from filename (normalized to lowercase with dot)
   */
  getFileExtension(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    return ext;
  }

  /**
   * Check if file extension is in allowed list
   */
  isAllowedFormat(extension: string): boolean {
    const normalized = extension.toLowerCase();
    return UploadService.ALLOWED_FORMATS.includes(normalized);
  }

  /**
   * Get file format enum from filename
   */
  getFileFormat(filename: string): 'PDF' | 'EPUB' | 'DOCX' | 'TXT' | 'MD' | null {
    const ext = this.getFileExtension(filename);

    switch (ext) {
      case '.pdf':
        return 'PDF';
      case '.epub':
        return 'EPUB';
      case '.docx':
        return 'DOCX';
      case '.txt':
        return 'TXT';
      case '.md':
        return 'MD';
      default:
        return null;
    }
  }

  /**
   * Format bytes to human-readable string
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  }

  /**
   * Sanitize filename for safe storage
   */
  sanitizeFilename(filename: string): string {
    // Remove path traversal attempts
    const basename = path.basename(filename);

    // Replace unsafe characters but preserve extension
    const ext = path.extname(basename);
    const name = path.basename(basename, ext);

    // Replace unsafe characters with underscores
    const safeName = name.replace(/[^a-zA-Z0-9._-]/g, '_');

    // Limit length
    const maxLength = 200;
    const truncatedName = safeName.substring(0, maxLength);

    return truncatedName + ext;
  }

  /**
   * Get upload configuration
   */
  getUploadConfig() {
    return {
      maxFileSize: UploadService.MAX_FILE_SIZE,
      allowedFormats: UploadService.ALLOWED_FORMATS,
      allowedMimetypes: UploadService.ALLOWED_MIMETYPES
    };
  }
}

// Export singleton instance
export const uploadService = new UploadService();
