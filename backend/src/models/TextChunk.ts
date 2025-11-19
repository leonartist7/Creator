// TextChunk Model
// Represents searchable text segments extracted from a masterwork

export interface TextChunk {
  id: string;
  masterworkId: string;

  chunkIndex: number;
  textContent: string;
  wordCount: number;

  pageNumber: number | null;
  locationReference: string | null;

  createdAt: Date;
}

export interface CreateTextChunkInput {
  masterworkId: string;
  chunkIndex: number;
  textContent: string;
  wordCount: number;
  pageNumber?: number;
  locationReference?: string;
}

export class TextChunkValidator {
  static readonly MAX_CHUNK_SIZE = 5000; // words per chunk
  static readonly MIN_CHUNK_SIZE = 100; // minimum meaningful chunk size

  static validateCreate(input: CreateTextChunkInput): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields
    if (!input.masterworkId) errors.push('masterworkId is required');
    if (input.chunkIndex === undefined || input.chunkIndex === null) {
      errors.push('chunkIndex is required');
    }
    if (!input.textContent || input.textContent.trim().length === 0) {
      errors.push('textContent is required and cannot be empty');
    }

    // Non-negative validation
    if (input.chunkIndex < 0) {
      errors.push('chunkIndex must be non-negative');
    }
    if (input.wordCount < 0) {
      errors.push('wordCount must be non-negative');
    }
    if (input.pageNumber !== undefined && input.pageNumber !== null && input.pageNumber < 0) {
      errors.push('pageNumber must be non-negative');
    }

    // Word count validation
    if (input.wordCount > this.MAX_CHUNK_SIZE) {
      errors.push(`wordCount exceeds maximum chunk size of ${this.MAX_CHUNK_SIZE} words`);
    }
    if (input.wordCount < this.MIN_CHUNK_SIZE) {
      errors.push(`wordCount below minimum chunk size of ${this.MIN_CHUNK_SIZE} words`);
    }

    // Validate word count matches text content
    const actualWordCount = this.countWords(input.textContent);
    const tolerance = 0.1; // 10% tolerance for counting variations
    if (Math.abs(actualWordCount - input.wordCount) > actualWordCount * tolerance) {
      errors.push(
        `wordCount mismatch: provided ${input.wordCount}, actual ~${actualWordCount}`
      );
    }

    // Location reference length check
    if (input.locationReference && input.locationReference.length > 100) {
      errors.push('locationReference must not exceed 100 characters');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  static countWords(text: string): number {
    // Simple word counting: split on whitespace and filter empty strings
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  static calculateOptimalChunkSize(totalWordCount: number): number {
    // Calculate optimal chunk size based on total word count
    // Aim for 50-100 chunks for most works

    if (totalWordCount < 5000) {
      // Short works: smaller chunks (500 words)
      return 500;
    } else if (totalWordCount < 50000) {
      // Medium works: standard chunks (1000 words)
      return 1000;
    } else {
      // Long works: larger chunks (2000 words)
      return 2000;
    }
  }
}
