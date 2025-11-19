// Style Analysis Service - Extract creative DNA from text
// Phase 6 Implementation - T091-T102

import natural from 'natural';
import compromise from 'compromise';
import { StyleProfile, CreateStyleProfileInput } from '../models/StyleProfile';
import { inMemoryStore } from '../data/in-memory-store';
import { v4 as uuidv4 } from 'uuid';

const TfIdf = natural.TfIdf;
const SentimentAnalyzer = natural.SentimentAnalyzer;
const PorterStemmer = natural.PorterStemmer;

export interface StyleMetrics {
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
}

export class StyleAnalysisService {
  /**
   * T092: Analyze sentence lengths using compromise
   */
  analyzeSentenceLength(text: string): { average: number; variance: number } {
    const doc = compromise(text);
    const sentences = doc.sentences().out('array');

    if (sentences.length === 0) {
      return { average: 0, variance: 0 };
    }

    // Calculate word count per sentence
    const lengths = sentences.map(s => compromise(s).terms().length);

    const average = lengths.reduce((sum, len) => sum + len, 0) / lengths.length;

    // Calculate variance
    const squaredDiffs = lengths.map(len => Math.pow(len - average, 2));
    const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / lengths.length;

    return {
      average: Math.round(average * 10) / 10,
      variance: Math.round(variance * 10) / 10
    };
  }

  /**
   * T093: Calculate vocabulary complexity using TF-IDF
   */
  calculateVocabularyComplexity(text: string): { complexity: number; uniqueRatio: number } {
    const tfidf = new TfIdf();
    tfidf.addDocument(text);

    // Get all terms
    const doc = compromise(text);
    const terms = doc.terms().out('array');
    const totalWords = terms.length;

    if (totalWords === 0) {
      return { complexity: 0, uniqueRatio: 0 };
    }

    // Count unique words
    const uniqueWords = new Set(terms.map(t => t.toLowerCase()));
    const uniqueRatio = uniqueWords.size / totalWords;

    // Calculate complexity score (0-100)
    // Based on unique word ratio and average word length
    const avgWordLength =
      terms.reduce((sum, word) => sum + word.length, 0) / totalWords;

    // Complexity: combination of unique ratio and word length
    // Higher unique ratio + longer words = more complex
    const complexity = Math.min(
      100,
      (uniqueRatio * 60 + (avgWordLength / 10) * 40)
    );

    return {
      complexity: Math.round(complexity * 10) / 10,
      uniqueRatio: Math.round(uniqueRatio * 1000) / 1000
    };
  }

  /**
   * T094: Analyze paragraph structure
   */
  analyzeParagraphs(text: string): { average: number; variance: number } {
    // Split by double newlines or multiple spaces (paragraph indicators)
    const paragraphs = text
      .split(/\n\n+/)
      .filter(p => p.trim().length > 0);

    if (paragraphs.length === 0) {
      return { average: 0, variance: 0 };
    }

    // Count sentences per paragraph
    const sentenceCounts = paragraphs.map(p => {
      const doc = compromise(p);
      return doc.sentences().length;
    });

    const average = sentenceCounts.reduce((sum, count) => sum + count, 0) / sentenceCounts.length;

    // Calculate variance
    const squaredDiffs = sentenceCounts.map(count => Math.pow(count - average, 2));
    const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / sentenceCounts.length;

    return {
      average: Math.round(average * 10) / 10,
      variance: Math.round(variance * 10) / 10
    };
  }

  /**
   * T095: Detect dialogue using quotation marks and POS tagging
   */
  detectDialogue(text: string): number {
    // Count characters in dialogue (text within quotes)
    const dialogueRegex = /"([^"]*)"|'([^']*)'/g;
    let dialogueChars = 0;
    let match;

    while ((match = dialogueRegex.exec(text)) !== null) {
      dialogueChars += (match[1] || match[2] || '').length;
    }

    const totalChars = text.length;

    if (totalChars === 0) {
      return 0;
    }

    // Return as percentage
    return Math.round((dialogueChars / totalChars) * 100 * 10) / 10;
  }

  /**
   * T096: Calculate Flesch-Kincaid readability scores
   */
  calculateReadability(text: string): { ease: number; grade: number } {
    const doc = compromise(text);
    const sentences = doc.sentences().out('array');
    const words = doc.terms().out('array');

    if (sentences.length === 0 || words.length === 0) {
      return { ease: 0, grade: 0 };
    }

    // Count syllables (approximation)
    const syllableCount = words.reduce((sum, word) => sum + this.countSyllables(word), 0);

    const avgWordsPerSentence = words.length / sentences.length;
    const avgSyllablesPerWord = syllableCount / words.length;

    // Flesch Reading Ease: 206.835 - 1.015 * (words/sentences) - 84.6 * (syllables/words)
    const ease = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;

    // Flesch-Kincaid Grade Level: 0.39 * (words/sentences) + 11.8 * (syllables/words) - 15.59
    const grade = 0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59;

    return {
      ease: Math.round(Math.max(0, Math.min(100, ease)) * 10) / 10,
      grade: Math.round(Math.max(0, grade) * 10) / 10
    };
  }

  /**
   * Count syllables in a word (approximation)
   */
  private countSyllables(word: string): number {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;

    // Remove silent e
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');

    // Count vowel groups
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
  }

  /**
   * T097: Analyze tone (formal vs conversational)
   */
  analyzeTone(text: string): number {
    const doc = compromise(text);

    // Indicators of formality
    const formalIndicators = {
      // Passive voice (approximation using past participles)
      passiveVoice: doc.match('#Verb (was|were|been) #PastTense').length,
      // Complex vocabulary (words > 8 letters)
      complexWords: doc.terms().filter(t => t.text().length > 8).length,
      // Formal conjunctions
      formalConjunctions: doc.match('(however|moreover|furthermore|therefore|nevertheless)').length
    };

    // Indicators of conversational tone
    const conversationalIndicators = {
      // Contractions
      contractions: doc.match('#Contraction').length,
      // Questions
      questions: doc.sentences().filter(s => s.text().endsWith('?')).length,
      // Short sentences (< 10 words)
      shortSentences: doc.sentences().filter(s => s.terms().length < 10).length
    };

    const totalSentences = doc.sentences().length;

    if (totalSentences === 0) {
      return 0;
    }

    // Calculate scores
    const formalScore =
      (formalIndicators.passiveVoice +
        formalIndicators.complexWords / 10 +
        formalIndicators.formalConjunctions * 2) /
      totalSentences;

    const conversationalScore =
      (conversationalIndicators.contractions * 2 +
        conversationalIndicators.questions +
        conversationalIndicators.shortSentences / 2) /
      totalSentences;

    // Normalize to -1 (formal) to 1 (conversational)
    const toneScore = (conversationalScore - formalScore) / (conversationalScore + formalScore + 1);

    return Math.round(Math.max(-1, Math.min(1, toneScore)) * 100) / 100;
  }

  /**
   * T098: Analyze sentiment using natural
   */
  analyzeSentiment(text: string): number {
    const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');
    const tokenizer = new natural.WordTokenizer();
    const tokens = tokenizer.tokenize(text);

    if (!tokens || tokens.length === 0) {
      return 0;
    }

    const sentiment = analyzer.getSentiment(tokens);

    // Normalize to -1 (negative) to 1 (positive)
    // AFINN typically ranges from -5 to 5 per word
    const normalized = Math.max(-1, Math.min(1, sentiment / 5));

    return Math.round(normalized * 100) / 100;
  }

  /**
   * T099: Extract top words and phrases
   */
  extractTopTerms(text: string, topN: number = 20): {
    topWords: Record<string, number>;
    topPhrases: Record<string, number>;
  } {
    const doc = compromise(text);

    // Get top words (excluding common stop words)
    const allWords = doc
      .terms()
      .not('#Pronoun')
      .not('#Preposition')
      .not('#Determiner')
      .not('#Conjunction')
      .out('array');

    const wordFreq: Record<string, number> = {};
    allWords.forEach(word => {
      const normalized = word.toLowerCase();
      wordFreq[normalized] = (wordFreq[normalized] || 0) + 1;
    });

    // Sort and get top N
    const topWords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN)
      .reduce((obj, [word, count]) => {
        obj[word] = count;
        return obj;
      }, {} as Record<string, number>);

    // Extract top phrases (2-3 word phrases)
    const phrases = doc.match('#Noun+ #Noun').out('array');
    const phraseFreq: Record<string, number> = {};

    phrases.forEach(phrase => {
      const normalized = phrase.toLowerCase();
      phraseFreq[normalized] = (phraseFreq[normalized] || 0) + 1;
    });

    const topPhrases = Object.entries(phraseFreq)
      .filter(([_, count]) => count > 1) // Only phrases that appear more than once
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN)
      .reduce((obj, [phrase, count]) => {
        obj[phrase] = count;
        return obj;
      }, {} as Record<string, number>);

    return { topWords, topPhrases };
  }

  /**
   * T100: Identify common sentence patterns using POS tags
   */
  identifyCommonPatterns(text: string, topN: number = 10): string[] {
    const doc = compromise(text);
    const sentences = doc.sentences().out('array');

    const patternFreq: Record<string, number> = {};

    sentences.forEach(sentence => {
      const sentDoc = compromise(sentence);

      // Get POS pattern (simplified)
      const pattern = sentDoc
        .terms()
        .out('array')
        .slice(0, 5) // First 5 words of sentence
        .map(term => {
          const t = compromise(term);
          if (t.nouns().length > 0) return 'NOUN';
          if (t.verbs().length > 0) return 'VERB';
          if (t.adjectives().length > 0) return 'ADJ';
          if (t.adverbs().length > 0) return 'ADV';
          if (t.match('#Pronoun').length > 0) return 'PRON';
          if (t.match('#Determiner').length > 0) return 'DET';
          return 'OTHER';
        })
        .join(' ');

      patternFreq[pattern] = (patternFreq[pattern] || 0) + 1;
    });

    // Get top patterns
    return Object.entries(patternFreq)
      .filter(([_, count]) => count > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN)
      .map(([pattern]) => pattern);
  }

  /**
   * Complete style analysis pipeline
   */
  async analyzeStyle(masterworkId: string, text: string): Promise<StyleProfile> {
    console.log(`Starting style analysis for masterwork ${masterworkId}...`);
    const startTime = Date.now();

    // Run all analyses
    const sentenceAnalysis = this.analyzeSentenceLength(text);
    const vocabAnalysis = this.calculateVocabularyComplexity(text);
    const paragraphAnalysis = this.analyzeParagraphs(text);
    const dialogueRatio = this.detectDialogue(text);
    const readability = this.calculateReadability(text);
    const tone = this.analyzeTone(text);
    const sentiment = this.analyzeSentiment(text);
    const { topWords, topPhrases } = this.extractTopTerms(text);
    const patterns = this.identifyCommonPatterns(text);

    // T101: Calculate confidence score based on text length
    const wordCount = compromise(text).terms().length;
    let confidenceScore = 50;
    if (wordCount < 1000) {
      confidenceScore = 25 + (wordCount / 1000) * 25;
    } else if (wordCount < 10000) {
      confidenceScore = 50 + ((wordCount - 1000) / 9000) * 30;
    } else {
      confidenceScore = Math.min(100, 80 + ((wordCount - 10000) / 10000) * 20);
    }

    const duration = Date.now() - startTime;

    const styleProfile: StyleProfile = {
      id: uuidv4(),
      masterworkId,
      avgSentenceLength: sentenceAnalysis.average,
      sentenceLengthVariance: sentenceAnalysis.variance,
      vocabComplexity: vocabAnalysis.complexity,
      uniqueWordRatio: vocabAnalysis.uniqueRatio,
      avgParagraphLength: paragraphAnalysis.average,
      paragraphVariance: paragraphAnalysis.variance,
      dialogueRatio,
      fleschReadingEase: readability.ease,
      fleschKincaidGrade: readability.grade,
      toneScore: tone,
      sentimentScore: sentiment,
      topWords,
      topPhrases,
      commonSentencePatterns: patterns,
      confidenceScore: Math.round(confidenceScore),
      analysisDate: new Date(),
      analysisDurationMs: duration,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // T102: Store in database
    inMemoryStore.saveStyleProfile(styleProfile);

    console.log(`Style analysis completed in ${duration}ms with ${confidenceScore}% confidence`);

    return styleProfile;
  }

  /**
   * Get style profile for a masterwork
   */
  async getStyleProfile(masterworkId: string): Promise<StyleProfile | null> {
    return inMemoryStore.getStyleProfile(masterworkId);
  }
}

// Export singleton
export const styleAnalysisService = new StyleAnalysisService();
