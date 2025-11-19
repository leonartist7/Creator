/**
 * Content Analytics Service
 * Analyzes content for readability, quality, and engagement metrics
 */

import { ContentAnalytics, ProjectSection } from '@/types/enhanced';

class AnalyticsService {
  /**
   * Perform comprehensive content analysis
   */
  analyzeContent(content: string): ContentAnalytics {
    const words = this.getWords(content);
    const sentences = this.getSentences(content);
    const paragraphs = this.getParagraphs(content);

    return {
      wordCount: words.length,
      characterCount: content.length,
      sentenceCount: sentences.length,
      paragraphCount: paragraphs.length,
      readingTimeMinutes: this.calculateReadingTime(words.length),
      readabilityScore: this.calculateReadabilityScore(content, words, sentences),
      sentiment: this.detectSentiment(content),
      keyPhrases: this.extractKeyPhrases(content, words),
      tone: this.detectTone(content),
      avgWordsPerSentence: sentences.length > 0 ? Math.round(words.length / sentences.length) : 0,
      avgSentencesPerParagraph:
        paragraphs.length > 0 ? Math.round(sentences.length / paragraphs.length) : 0,
    };
  }

  /**
   * Calculate Flesch Reading Ease score (0-100, higher is easier)
   */
  private calculateReadabilityScore(content: string, words: string[], sentences: string[]): number {
    if (words.length === 0 || sentences.length === 0) return 0;

    const totalSyllables = words.reduce((sum, word) => sum + this.countSyllables(word), 0);
    const avgSyllablesPerWord = totalSyllables / words.length;
    const avgWordsPerSentence = words.length / sentences.length;

    // Flesch Reading Ease formula
    const score = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;

    // Clamp between 0-100
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Count syllables in a word (simplified algorithm)
   */
  private countSyllables(word: string): number {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (word.length <= 3) return 1;

    // Count vowel groups
    const vowelGroups = word.match(/[aeiouy]+/g);
    let count = vowelGroups ? vowelGroups.length : 1;

    // Adjust for silent 'e'
    if (word.endsWith('e') && count > 1) {
      count--;
    }

    return Math.max(1, count);
  }

  /**
   * Calculate estimated reading time (average 200 words per minute)
   */
  private calculateReadingTime(wordCount: number): number {
    const wordsPerMinute = 200;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  /**
   * Detect overall sentiment (positive, negative, neutral)
   */
  private detectSentiment(content: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = [
      'good',
      'great',
      'excellent',
      'amazing',
      'wonderful',
      'fantastic',
      'love',
      'best',
      'perfect',
      'happy',
      'success',
      'achieve',
      'win',
      'benefit',
      'advantage',
      'easy',
      'simple',
      'powerful',
      'effective',
      'innovative',
    ];

    const negativeWords = [
      'bad',
      'terrible',
      'awful',
      'poor',
      'hate',
      'worst',
      'difficult',
      'hard',
      'problem',
      'issue',
      'fail',
      'lose',
      'disadvantage',
      'risk',
      'danger',
      'complex',
      'complicated',
      'confusing',
      'weak',
    ];

    const words = this.getWords(content.toLowerCase());

    const positiveCount = words.filter((word) => positiveWords.includes(word)).length;
    const negativeCount = words.filter((word) => negativeWords.includes(word)).length;

    const sentimentScore = positiveCount - negativeCount;

    if (sentimentScore > 2) return 'positive';
    if (sentimentScore < -2) return 'negative';
    return 'neutral';
  }

  /**
   * Detect tone of content
   */
  private detectTone(content: string): string {
    const lowerContent = content.toLowerCase();

    // Educational tone indicators
    if (
      /\b(learn|understand|discover|explore|knowledge|study|guide)\b/.test(lowerContent) &&
      /\b(step|process|method|technique|approach)\b/.test(lowerContent)
    ) {
      return 'educational';
    }

    // Professional/formal tone indicators
    if (
      /\b(therefore|furthermore|consequently|moreover|thus|hence)\b/.test(lowerContent) ||
      /\b(implement|utilize|facilitate|demonstrate|establish)\b/.test(lowerContent)
    ) {
      return 'professional';
    }

    // Casual/conversational tone indicators
    if (
      /\b(you'll|we'll|let's|gonna|wanna|hey|yeah)\b/.test(lowerContent) ||
      /[!]{2,}/.test(content) ||
      content.includes('?!')
    ) {
      return 'casual';
    }

    // Persuasive/sales tone indicators
    if (
      /\b(guaranteed|proven|exclusive|limited|act now|don't miss|imagine|transform)\b/.test(
        lowerContent
      ) ||
      /\b(you deserve|you need|you must|get started|join now)\b/.test(lowerContent)
    ) {
      return 'persuasive';
    }

    // Storytelling tone indicators
    if (
      /\b(once upon|in the beginning|it was|there was|imagine)\b/.test(lowerContent) ||
      /(suddenly|meanwhile|finally|at last)/.test(lowerContent)
    ) {
      return 'narrative';
    }

    return 'neutral';
  }

  /**
   * Extract key phrases from content
   */
  private extractKeyPhrases(content: string, words: string[]): string[] {
    // Remove common stop words
    const stopWords = new Set([
      'the',
      'a',
      'an',
      'and',
      'or',
      'but',
      'in',
      'on',
      'at',
      'to',
      'for',
      'of',
      'with',
      'by',
      'from',
      'as',
      'is',
      'was',
      'are',
      'been',
      'be',
      'have',
      'has',
      'had',
      'do',
      'does',
      'did',
      'will',
      'would',
      'could',
      'should',
      'may',
      'might',
      'can',
      'this',
      'that',
      'these',
      'those',
      'i',
      'you',
      'he',
      'she',
      'it',
      'we',
      'they',
    ]);

    // Filter and count word frequency
    const wordFrequency = new Map<string, number>();

    words.forEach((word) => {
      const cleaned = word.toLowerCase().replace(/[^a-z]/g, '');
      if (cleaned.length > 3 && !stopWords.has(cleaned)) {
        wordFrequency.set(cleaned, (wordFrequency.get(cleaned) || 0) + 1);
      }
    });

    // Get top 5 most frequent words
    return Array.from(wordFrequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map((entry) => entry[0]);
  }

  /**
   * Split content into words
   */
  private getWords(content: string): string[] {
    return content.match(/\b[\w']+\b/g) || [];
  }

  /**
   * Split content into sentences
   */
  private getSentences(content: string): string[] {
    return content.match(/[^.!?]+[.!?]+/g) || [];
  }

  /**
   * Split content into paragraphs
   */
  private getParagraphs(content: string): string[] {
    return content.split(/\n\n+/).filter((p) => p.trim().length > 0);
  }

  /**
   * Compare analytics between two sections
   */
  compareAnalytics(
    analytics1: ContentAnalytics,
    analytics2: ContentAnalytics
  ): {
    wordCountDiff: number;
    readabilityDiff: number;
    sentimentChange: boolean;
    toneChange: boolean;
  } {
    return {
      wordCountDiff: analytics2.wordCount - analytics1.wordCount,
      readabilityDiff: analytics2.readabilityScore - analytics1.readabilityScore,
      sentimentChange: analytics1.sentiment !== analytics2.sentiment,
      toneChange: analytics1.tone !== analytics2.tone,
    };
  }

  /**
   * Get readability level description
   */
  getReadabilityLevel(score: number): string {
    if (score >= 90) return 'Very Easy (5th grade)';
    if (score >= 80) return 'Easy (6th grade)';
    if (score >= 70) return 'Fairly Easy (7th grade)';
    if (score >= 60) return 'Standard (8th-9th grade)';
    if (score >= 50) return 'Fairly Difficult (10th-12th grade)';
    if (score >= 30) return 'Difficult (College level)';
    return 'Very Difficult (College graduate)';
  }

  /**
   * Check if content meets target criteria
   */
  checkQualityCriteria(
    analytics: ContentAnalytics,
    criteria: {
      minWords?: number;
      maxWords?: number;
      minReadability?: number;
      targetSentiment?: 'positive' | 'negative' | 'neutral';
    }
  ): { passed: boolean; issues: string[] } {
    const issues: string[] = [];

    if (criteria.minWords && analytics.wordCount < criteria.minWords) {
      issues.push(`Content is too short (${analytics.wordCount} words, minimum ${criteria.minWords})`);
    }

    if (criteria.maxWords && analytics.wordCount > criteria.maxWords) {
      issues.push(`Content is too long (${analytics.wordCount} words, maximum ${criteria.maxWords})`);
    }

    if (criteria.minReadability && analytics.readabilityScore < criteria.minReadability) {
      issues.push(
        `Content may be too difficult to read (score: ${analytics.readabilityScore}, minimum: ${criteria.minReadability})`
      );
    }

    if (criteria.targetSentiment && analytics.sentiment !== criteria.targetSentiment) {
      issues.push(
        `Sentiment mismatch (current: ${analytics.sentiment}, target: ${criteria.targetSentiment})`
      );
    }

    return {
      passed: issues.length === 0,
      issues,
    };
  }

  /**
   * Analyze entire project
   */
  analyzeProject(sections: ProjectSection[]): {
    totalWords: number;
    totalReadingTime: number;
    avgReadability: number;
    dominantTone: string;
    overallSentiment: 'positive' | 'negative' | 'neutral';
  } {
    const allAnalytics = sections
      .filter((s) => s.content && s.content.trim().length > 0)
      .map((s) => this.analyzeContent(s.content));

    const totalWords = allAnalytics.reduce((sum, a) => sum + a.wordCount, 0);
    const totalReadingTime = allAnalytics.reduce((sum, a) => sum + a.readingTimeMinutes, 0);
    const avgReadability =
      allAnalytics.length > 0
        ? Math.round(allAnalytics.reduce((sum, a) => sum + a.readabilityScore, 0) / allAnalytics.length)
        : 0;

    // Find dominant tone
    const toneFrequency = new Map<string, number>();
    allAnalytics.forEach((a) => {
      toneFrequency.set(a.tone, (toneFrequency.get(a.tone) || 0) + 1);
    });
    const dominantTone =
      Array.from(toneFrequency.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral';

    // Calculate overall sentiment
    const sentimentCounts = {
      positive: allAnalytics.filter((a) => a.sentiment === 'positive').length,
      negative: allAnalytics.filter((a) => a.sentiment === 'negative').length,
      neutral: allAnalytics.filter((a) => a.sentiment === 'neutral').length,
    };

    let overallSentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    if (sentimentCounts.positive > sentimentCounts.negative && sentimentCounts.positive > sentimentCounts.neutral) {
      overallSentiment = 'positive';
    } else if (sentimentCounts.negative > sentimentCounts.positive) {
      overallSentiment = 'negative';
    }

    return {
      totalWords,
      totalReadingTime,
      avgReadability,
      dominantTone,
      overallSentiment,
    };
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();
