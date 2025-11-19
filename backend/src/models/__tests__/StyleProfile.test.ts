// Unit tests for StyleProfile model
import { describe, it, expect } from 'vitest';
import {
  StyleProfileValidator,
  CreateStyleProfileInput
} from '../StyleProfile';

describe('StyleProfileValidator', () => {
  describe('validateCreate', () => {
    const validInput: CreateStyleProfileInput = {
      masterworkId: '550e8400-e29b-41d4-a716-446655440001',
      avgSentenceLength: 15.3,
      sentenceLengthVariance: 8.2,
      vocabComplexity: 72.5,
      uniqueWordRatio: 0.42,
      avgParagraphLength: 4.8,
      paragraphVariance: 2.1,
      dialogueRatio: 35.7,
      fleschReadingEase: 78.5,
      fleschKincaidGrade: 6.8,
      toneScore: 0.6,
      sentimentScore: -0.3,
      topWords: { the: 5432, and: 3210, was: 2987 },
      topPhrases: { 'the overlook hotel': 145 },
      commonSentencePatterns: ['DET NOUN VERB', 'PRON VERB ADV'],
      confidenceScore: 95,
      analysisDurationMs: 45000
    };

    it('should validate a valid style profile input', () => {
      const result = StyleProfileValidator.validateCreate(validInput);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should require masterworkId', () => {
      const input = { ...validInput, masterworkId: '' };
      const result = StyleProfileValidator.validateCreate(input);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('masterworkId is required');
    });

    describe('percentage validation (0-100)', () => {
      it('should validate vocabComplexity range', () => {
        const validValues = [0, 50, 100];
        validValues.forEach(value => {
          const input = { ...validInput, vocabComplexity: value };
          const result = StyleProfileValidator.validateCreate(input);
          expect(result.valid).toBe(true);
        });

        const invalidValues = [-1, 101, 150];
        invalidValues.forEach(value => {
          const input = { ...validInput, vocabComplexity: value };
          const result = StyleProfileValidator.validateCreate(input);
          expect(result.valid).toBe(false);
          expect(result.errors).toContain('vocabComplexity must be between 0 and 100');
        });
      });

      it('should validate dialogueRatio range', () => {
        const input = { ...validInput, dialogueRatio: 101 };
        const result = StyleProfileValidator.validateCreate(input);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('dialogueRatio must be between 0 and 100');
      });

      it('should validate confidenceScore range', () => {
        const input = { ...validInput, confidenceScore: -5 };
        const result = StyleProfileValidator.validateCreate(input);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('confidenceScore must be between 0 and 100');
      });
    });

    describe('ratio validation (0-1)', () => {
      it('should validate uniqueWordRatio range', () => {
        const validValues = [0, 0.5, 1];
        validValues.forEach(value => {
          const input = { ...validInput, uniqueWordRatio: value };
          const result = StyleProfileValidator.validateCreate(input);
          expect(result.valid).toBe(true);
        });

        const invalidValues = [-0.1, 1.1, 2];
        invalidValues.forEach(value => {
          const input = { ...validInput, uniqueWordRatio: value };
          const result = StyleProfileValidator.validateCreate(input);
          expect(result.valid).toBe(false);
          expect(result.errors).toContain('uniqueWordRatio must be between 0 and 1');
        });
      });
    });

    describe('tone/sentiment validation (-1 to 1)', () => {
      it('should validate toneScore range', () => {
        const validValues = [-1, 0, 1];
        validValues.forEach(value => {
          const input = { ...validInput, toneScore: value };
          const result = StyleProfileValidator.validateCreate(input);
          expect(result.valid).toBe(true);
        });

        const invalidValues = [-1.1, 1.5];
        invalidValues.forEach(value => {
          const input = { ...validInput, toneScore: value };
          const result = StyleProfileValidator.validateCreate(input);
          expect(result.valid).toBe(false);
          expect(result.errors).toContain('toneScore must be between -1 and 1');
        });
      });

      it('should validate sentimentScore range', () => {
        const input = { ...validInput, sentimentScore: -1.5 };
        const result = StyleProfileValidator.validateCreate(input);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('sentimentScore must be between -1 and 1');
      });
    });

    describe('non-negative validation', () => {
      it('should require avgSentenceLength to be non-negative', () => {
        const input = { ...validInput, avgSentenceLength: -1 };
        const result = StyleProfileValidator.validateCreate(input);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('avgSentenceLength must be non-negative');
      });

      it('should require sentenceLengthVariance to be non-negative', () => {
        const input = { ...validInput, sentenceLengthVariance: -5 };
        const result = StyleProfileValidator.validateCreate(input);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('sentenceLengthVariance must be non-negative');
      });

      it('should require avgParagraphLength to be non-negative', () => {
        const input = { ...validInput, avgParagraphLength: -1 };
        const result = StyleProfileValidator.validateCreate(input);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('avgParagraphLength must be non-negative');
      });

      it('should require paragraphVariance to be non-negative', () => {
        const input = { ...validInput, paragraphVariance: -1 };
        const result = StyleProfileValidator.validateCreate(input);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('paragraphVariance must be non-negative');
      });

      it('should require analysisDurationMs to be non-negative', () => {
        const input = { ...validInput, analysisDurationMs: -100 };
        const result = StyleProfileValidator.validateCreate(input);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('analysisDurationMs must be non-negative');
      });
    });

    describe('object/array validation', () => {
      it('should require topWords to be an object', () => {
        const input = { ...validInput, topWords: ['array'] as any };
        const result = StyleProfileValidator.validateCreate(input);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('topWords must be an object');
      });

      it('should require topPhrases to be an object', () => {
        const input = { ...validInput, topPhrases: null as any };
        const result = StyleProfileValidator.validateCreate(input);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('topPhrases must be an object');
      });

      it('should require commonSentencePatterns to be an array', () => {
        const input = { ...validInput, commonSentencePatterns: 'string' as any };
        const result = StyleProfileValidator.validateCreate(input);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('commonSentencePatterns must be an array');
      });

      it('should accept empty objects and arrays', () => {
        const input = {
          ...validInput,
          topWords: {},
          topPhrases: {},
          commonSentencePatterns: []
        };
        const result = StyleProfileValidator.validateCreate(input);
        expect(result.valid).toBe(true);
      });
    });
  });

  describe('calculateConfidenceScore', () => {
    it('should return 25-50% for works under 1,000 words', () => {
      expect(StyleProfileValidator.calculateConfidenceScore(0)).toBe(25);
      expect(StyleProfileValidator.calculateConfidenceScore(500)).toBe(38);
      expect(StyleProfileValidator.calculateConfidenceScore(999)).toBe(50);
    });

    it('should return 50-80% for works between 1,000-10,000 words', () => {
      expect(StyleProfileValidator.calculateConfidenceScore(1000)).toBe(50);
      expect(StyleProfileValidator.calculateConfidenceScore(5500)).toBe(65);
      expect(StyleProfileValidator.calculateConfidenceScore(9999)).toBe(80);
    });

    it('should return 80-100% for works over 10,000 words', () => {
      expect(StyleProfileValidator.calculateConfidenceScore(10000)).toBe(80);
      expect(StyleProfileValidator.calculateConfidenceScore(50000)).toBe(88);
      expect(StyleProfileValidator.calculateConfidenceScore(100000)).toBe(100);
      expect(StyleProfileValidator.calculateConfidenceScore(200000)).toBe(100); // Capped at 100
    });

    it('should handle edge case of exactly 1,000 words', () => {
      const score = StyleProfileValidator.calculateConfidenceScore(1000);
      expect(score).toBeGreaterThanOrEqual(50);
      expect(score).toBeLessThanOrEqual(51);
    });

    it('should handle edge case of exactly 10,000 words', () => {
      const score = StyleProfileValidator.calculateConfidenceScore(10000);
      expect(score).toBeGreaterThanOrEqual(80);
      expect(score).toBeLessThanOrEqual(81);
    });

    it('should never return score below 25 or above 100', () => {
      const wordCounts = [0, 100, 1000, 10000, 100000, 1000000];
      wordCounts.forEach(count => {
        const score = StyleProfileValidator.calculateConfidenceScore(count);
        expect(score).toBeGreaterThanOrEqual(25);
        expect(score).toBeLessThanOrEqual(100);
      });
    });
  });
});
