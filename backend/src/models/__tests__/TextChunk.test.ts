// Unit tests for TextChunk model
import { describe, it, expect } from 'vitest';
import {
  TextChunkValidator,
  CreateTextChunkInput
} from '../TextChunk';

describe('TextChunkValidator', () => {
  describe('validateCreate', () => {
    const validInput: CreateTextChunkInput = {
      masterworkId: '550e8400-e29b-41d4-a716-446655440001',
      chunkIndex: 0,
      textContent: 'This is a test chunk with enough words to pass validation. '.repeat(20),
      wordCount: 240,
      pageNumber: 1,
      locationReference: 'Chapter 1: Introduction'
    };

    it('should validate a valid text chunk input', () => {
      const result = TextChunkValidator.validateCreate(validInput);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should require masterworkId', () => {
      const input = { ...validInput, masterworkId: '' };
      const result = TextChunkValidator.validateCreate(input);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('masterworkId is required');
    });

    it('should require chunkIndex', () => {
      const input = { ...validInput, chunkIndex: undefined as any };
      const result = TextChunkValidator.validateCreate(input);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('chunkIndex is required');
    });

    it('should accept chunkIndex of 0', () => {
      const input = { ...validInput, chunkIndex: 0 };
      const result = TextChunkValidator.validateCreate(input);
      expect(result.valid).toBe(true);
    });

    it('should require textContent', () => {
      const input = { ...validInput, textContent: '' };
      const result = TextChunkValidator.validateCreate(input);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('textContent is required and cannot be empty');
    });

    it('should reject negative chunkIndex', () => {
      const input = { ...validInput, chunkIndex: -1 };
      const result = TextChunkValidator.validateCreate(input);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('chunkIndex must be non-negative');
    });

    it('should reject negative wordCount', () => {
      const input = { ...validInput, wordCount: -5 };
      const result = TextChunkValidator.validateCreate(input);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('wordCount must be non-negative');
    });

    it('should reject negative pageNumber', () => {
      const input = { ...validInput, pageNumber: -1 };
      const result = TextChunkValidator.validateCreate(input);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('pageNumber must be non-negative');
    });

    it('should accept null pageNumber', () => {
      const input = { ...validInput, pageNumber: undefined };
      const result = TextChunkValidator.validateCreate(input);
      expect(result.valid).toBe(true);
    });

    it('should reject wordCount exceeding maximum chunk size', () => {
      const input = { ...validInput, wordCount: 5001 };
      const result = TextChunkValidator.validateCreate(input);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('wordCount exceeds maximum chunk size of 5000 words');
    });

    it('should reject wordCount below minimum chunk size', () => {
      const input = {
        ...validInput,
        textContent: 'Too few words here.',
        wordCount: 50
      };
      const result = TextChunkValidator.validateCreate(input);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('wordCount below minimum chunk size of 100 words');
    });

    it('should reject locationReference exceeding 100 characters', () => {
      const input = { ...validInput, locationReference: 'a'.repeat(101) };
      const result = TextChunkValidator.validateCreate(input);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('locationReference must not exceed 100 characters');
    });

    it('should accept locationReference at exactly 100 characters', () => {
      const input = { ...validInput, locationReference: 'a'.repeat(100) };
      const result = TextChunkValidator.validateCreate(input);
      expect(result.valid).toBe(true);
    });

    it('should reject wordCount mismatch with textContent', () => {
      const input = {
        ...validInput,
        textContent: 'This has exactly ten words in this sentence here now.',
        wordCount: 500 // Mismatch
      };
      const result = TextChunkValidator.validateCreate(input);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('wordCount mismatch'))).toBe(true);
    });

    it('should allow small wordCount variations (within 10% tolerance)', () => {
      const text = 'word '.repeat(100); // Exactly 100 words
      const input = {
        ...validInput,
        textContent: text,
        wordCount: 105 // 5% difference - within tolerance
      };
      const result = TextChunkValidator.validateCreate(input);
      expect(result.valid).toBe(true);
    });
  });

  describe('countWords', () => {
    it('should count words correctly', () => {
      expect(TextChunkValidator.countWords('Hello world')).toBe(2);
      expect(TextChunkValidator.countWords('One two three four five')).toBe(5);
    });

    it('should handle multiple spaces', () => {
      expect(TextChunkValidator.countWords('Hello    world')).toBe(2);
      expect(TextChunkValidator.countWords('  One  two  three  ')).toBe(3);
    });

    it('should handle empty string', () => {
      expect(TextChunkValidator.countWords('')).toBe(0);
      expect(TextChunkValidator.countWords('   ')).toBe(0);
    });

    it('should handle newlines and tabs', () => {
      expect(TextChunkValidator.countWords('Hello\nworld')).toBe(2);
      expect(TextChunkValidator.countWords('One\ttwo\tthree')).toBe(3);
    });

    it('should count complex text accurately', () => {
      const text = 'The quick brown fox jumps over the lazy dog.';
      expect(TextChunkValidator.countWords(text)).toBe(9);
    });
  });

  describe('calculateOptimalChunkSize', () => {
    it('should return 500 for short works (< 5,000 words)', () => {
      expect(TextChunkValidator.calculateOptimalChunkSize(1000)).toBe(500);
      expect(TextChunkValidator.calculateOptimalChunkSize(4999)).toBe(500);
    });

    it('should return 1000 for medium works (5,000 - 50,000 words)', () => {
      expect(TextChunkValidator.calculateOptimalChunkSize(5000)).toBe(1000);
      expect(TextChunkValidator.calculateOptimalChunkSize(25000)).toBe(1000);
      expect(TextChunkValidator.calculateOptimalChunkSize(49999)).toBe(1000);
    });

    it('should return 2000 for long works (> 50,000 words)', () => {
      expect(TextChunkValidator.calculateOptimalChunkSize(50000)).toBe(2000);
      expect(TextChunkValidator.calculateOptimalChunkSize(100000)).toBe(2000);
      expect(TextChunkValidator.calculateOptimalChunkSize(500000)).toBe(2000);
    });

    it('should handle edge cases', () => {
      expect(TextChunkValidator.calculateOptimalChunkSize(0)).toBe(500);
      expect(TextChunkValidator.calculateOptimalChunkSize(5000)).toBe(1000);
      expect(TextChunkValidator.calculateOptimalChunkSize(50000)).toBe(2000);
    });
  });
});
