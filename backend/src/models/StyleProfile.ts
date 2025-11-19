// StyleProfile Model
// Represents analyzed writing style metrics for a masterwork

export interface StyleProfile {
  id: string;
  masterworkId: string;

  // Core style metrics
  avgSentenceLength: number;
  sentenceLengthVariance: number;
  vocabComplexity: number; // 0-100
  uniqueWordRatio: number; // 0-1
  avgParagraphLength: number;
  paragraphVariance: number;
  dialogueRatio: number; // 0-100

  // Readability scores
  fleschReadingEase: number;
  fleschKincaidGrade: number;

  // Tone and style
  toneScore: number; // -1 (formal) to 1 (conversational)
  sentimentScore: number; // -1 (negative) to 1 (positive)

  // Patterns
  topWords: Record<string, number>;
  topPhrases: Record<string, number>;
  commonSentencePatterns: string[];

  // Metadata
  confidenceScore: number; // 0-100
  analysisDate: Date;
  analysisDurationMs: number;

  createdAt: Date;
  updatedAt: Date;
}

export interface CreateStyleProfileInput {
  masterworkId: string;
  avgSentenceLength: number;
  sentenceLengthVariance: number;
  vocabComplexity: number;
  uniqueWordRatio: number;
  avgParagraphLength: number;
  paragraphVariance: number;
  dialogueRatio: number;
  fleschReadingEase: number;
  fleschKincaidGrade: number;
  toneScore: number;
  sentimentScore: number;
  topWords: Record<string, number>;
  topPhrases: Record<string, number>;
  commonSentencePatterns: string[];
  confidenceScore: number;
  analysisDurationMs: number;
}

export class StyleProfileValidator {
  static validateCreate(input: CreateStyleProfileInput): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields
    if (!input.masterworkId) errors.push('masterworkId is required');

    // Range validation for percentages (0-100)
    if (input.vocabComplexity < 0 || input.vocabComplexity > 100) {
      errors.push('vocabComplexity must be between 0 and 100');
    }
    if (input.dialogueRatio < 0 || input.dialogueRatio > 100) {
      errors.push('dialogueRatio must be between 0 and 100');
    }
    if (input.confidenceScore < 0 || input.confidenceScore > 100) {
      errors.push('confidenceScore must be between 0 and 100');
    }

    // Range validation for ratios (0-1)
    if (input.uniqueWordRatio < 0 || input.uniqueWordRatio > 1) {
      errors.push('uniqueWordRatio must be between 0 and 1');
    }

    // Range validation for tone/sentiment (-1 to 1)
    if (input.toneScore < -1 || input.toneScore > 1) {
      errors.push('toneScore must be between -1 and 1');
    }
    if (input.sentimentScore < -1 || input.sentimentScore > 1) {
      errors.push('sentimentScore must be between -1 and 1');
    }

    // Non-negative validation
    if (input.avgSentenceLength < 0) errors.push('avgSentenceLength must be non-negative');
    if (input.sentenceLengthVariance < 0) errors.push('sentenceLengthVariance must be non-negative');
    if (input.avgParagraphLength < 0) errors.push('avgParagraphLength must be non-negative');
    if (input.paragraphVariance < 0) errors.push('paragraphVariance must be non-negative');
    if (input.analysisDurationMs < 0) errors.push('analysisDurationMs must be non-negative');

    // Validate topWords and topPhrases are objects
    if (typeof input.topWords !== 'object' || Array.isArray(input.topWords)) {
      errors.push('topWords must be an object');
    }
    if (typeof input.topPhrases !== 'object' || Array.isArray(input.topPhrases)) {
      errors.push('topPhrases must be an object');
    }

    // Validate commonSentencePatterns is an array
    if (!Array.isArray(input.commonSentencePatterns)) {
      errors.push('commonSentencePatterns must be an array');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  static calculateConfidenceScore(wordCount: number): number {
    // Confidence based on text length
    // < 1,000 words: 25-50% confidence
    // 1,000-10,000 words: 50-80% confidence
    // > 10,000 words: 80-100% confidence

    if (wordCount < 1000) {
      return Math.round(25 + (wordCount / 1000) * 25);
    } else if (wordCount < 10000) {
      return Math.round(50 + ((wordCount - 1000) / 9000) * 30);
    } else {
      const score = 80 + Math.min(20, (wordCount - 10000) / 10000 * 20);
      return Math.round(Math.min(100, score));
    }
  }
}
