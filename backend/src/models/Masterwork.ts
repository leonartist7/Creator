// Masterwork Model
// Represents an uploaded document in the Knowledge Vault

export type FileFormat = 'PDF' | 'EPUB' | 'DOCX' | 'TXT' | 'MD';
export type ExtractionStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type AnalysisStatus = 'not_started' | 'processing' | 'completed' | 'failed';

export interface Masterwork {
  id: string;
  userId: string;
  title: string;
  author: string | null;
  format: FileFormat;
  fileSize: number;
  filePath: string;
  coverImageUrl: string | null;

  // Metadata
  pageCount: number | null;
  wordCount: number;
  language: string;
  publicationDate: Date | null;
  isbn: string | null;

  // User annotations
  customTags: string[];
  userNotes: string | null;
  rating: number | null;

  // Processing status
  extractionStatus: ExtractionStatus;
  extractionError: string | null;
  analysisStatus: AnalysisStatus;

  // Timestamps
  uploadDate: Date;
  lastAccessed: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMasterworkInput {
  userId: string;
  title: string;
  author?: string;
  format: FileFormat;
  fileSize: number;
  filePath: string;
  coverImageUrl?: string;
  pageCount?: number;
  wordCount?: number;
  language?: string;
  publicationDate?: Date;
  isbn?: string;
  customTags?: string[];
  userNotes?: string;
  rating?: number;
}

export interface UpdateMasterworkInput {
  title?: string;
  author?: string;
  customTags?: string[];
  userNotes?: string;
  rating?: number;
}

export class MasterworkValidator {
  static readonly MAX_FILE_SIZE = 52428800; // 50MB
  static readonly ALLOWED_FORMATS: FileFormat[] = ['PDF', 'EPUB', 'DOCX', 'TXT', 'MD'];
  static readonly MAX_TITLE_LENGTH = 500;
  static readonly MAX_AUTHOR_LENGTH = 200;
  static readonly MIN_RATING = 1;
  static readonly MAX_RATING = 5;

  static validateCreate(input: CreateMasterworkInput): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields
    if (!input.userId) errors.push('userId is required');
    if (!input.title || input.title.trim().length === 0) errors.push('title is required');
    if (!input.format) errors.push('format is required');
    if (!input.fileSize) errors.push('fileSize is required');
    if (!input.filePath) errors.push('filePath is required');

    // Format validation
    if (input.format && !this.ALLOWED_FORMATS.includes(input.format)) {
      errors.push(`format must be one of: ${this.ALLOWED_FORMATS.join(', ')}`);
    }

    // Size validation
    if (input.fileSize && input.fileSize > this.MAX_FILE_SIZE) {
      errors.push(`fileSize must not exceed ${this.MAX_FILE_SIZE} bytes (50MB)`);
    }
    if (input.fileSize && input.fileSize <= 0) {
      errors.push('fileSize must be greater than 0');
    }

    // Length validation
    if (input.title && input.title.length > this.MAX_TITLE_LENGTH) {
      errors.push(`title must not exceed ${this.MAX_TITLE_LENGTH} characters`);
    }
    if (input.author && input.author.length > this.MAX_AUTHOR_LENGTH) {
      errors.push(`author must not exceed ${this.MAX_AUTHOR_LENGTH} characters`);
    }

    // Word count validation
    if (input.wordCount !== undefined && input.wordCount < 0) {
      errors.push('wordCount must be non-negative');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  static validateUpdate(input: UpdateMasterworkInput): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Length validation
    if (input.title && input.title.length > this.MAX_TITLE_LENGTH) {
      errors.push(`title must not exceed ${this.MAX_TITLE_LENGTH} characters`);
    }
    if (input.author && input.author.length > this.MAX_AUTHOR_LENGTH) {
      errors.push(`author must not exceed ${this.MAX_AUTHOR_LENGTH} characters`);
    }

    // Rating validation
    if (input.rating !== undefined) {
      if (input.rating < this.MIN_RATING || input.rating > this.MAX_RATING) {
        errors.push(`rating must be between ${this.MIN_RATING} and ${this.MAX_RATING}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  static sanitizeTitle(title: string): string {
    return title.trim().substring(0, this.MAX_TITLE_LENGTH);
  }

  static sanitizeAuthor(author: string): string {
    return author.trim().substring(0, this.MAX_AUTHOR_LENGTH);
  }
}
