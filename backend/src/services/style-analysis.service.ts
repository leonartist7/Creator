import Masterwork from '../models/Masterwork';
import StyleProfile from '../models/StyleProfile';
import TextChunk from '../models/TextChunk';
import natural from 'natural';
// @ts-ignore
import compromise from 'compromise';

export class StyleAnalysisService {
  /**
   * Analyze a masterwork and generate a style profile
   */
  public async analyzeMasterwork(masterworkId: string): Promise<void> {
    const startTime = Date.now();
    const masterwork = await Masterwork.findByPk(masterworkId);
    if (!masterwork) throw new Error('Masterwork not found');

    try {
      masterwork.analysis_status = 'processing';
      await masterwork.save();

      // Fetch all text chunks
      const chunks = await TextChunk.findAll({
        where: { masterwork_id: masterworkId },
        order: [['chunk_index', 'ASC']]
      });

      const fullText = chunks.map(c => c.text_content).join('\n');

      if (!fullText) {
        throw new Error('No text content to analyze');
      }

      // Perform analysis
      const metrics = this.calculateMetrics(fullText);

      // Save profile
      await StyleProfile.create({
        masterwork_id: masterworkId,
        ...metrics,
        analysis_date: new Date(),
        analysis_duration_ms: Date.now() - startTime
      });

      masterwork.analysis_status = 'completed';
      await masterwork.save();

    } catch (error: any) {
      console.error(`Analysis failed for ${masterworkId}:`, error);
      masterwork.analysis_status = 'failed';
      await masterwork.save();
      throw error;
    }
  }

  private calculateMetrics(text: string) {
    const tokenizer = new natural.SentenceTokenizer([]);
    const sentences = tokenizer.tokenize(text);
    const wordTokenizer = new natural.WordTokenizer();
    const words = wordTokenizer.tokenize(text);

    // 1. Sentence Length
    const sentenceLengths = sentences.map(s => s.split(/\s+/).length);
    const avg_sentence_length = this.average(sentenceLengths);
    const sentence_length_variance = this.variance(sentenceLengths);

    // 2. Vocabulary
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    const unique_word_ratio = uniqueWords.size / words.length;
    const vocab_complexity = Math.min(100, (uniqueWords.size / Math.sqrt(words.length)) * 10); // Simple TTR proxy

    // 3. Paragraphs (approximate by newlines)
    const paragraphs = text.split(/\n\s*\n/);
    const paragraphLengths = paragraphs.map(p => tokenizer.tokenize(p).length);
    const avg_paragraph_length = this.average(paragraphLengths);
    const paragraph_variance = this.variance(paragraphLengths);

    // 4. Dialogue (approximate by quotes)
    const dialogueMatches = text.match(/"[^"]*"/g) || [];
    const dialogueLength = dialogueMatches.join(' ').length;
    const dialogue_ratio = (dialogueLength / text.length) * 100;

    // 5. Readability
    // Simple Flesch-Kincaid approximation
    const syllableCount = words.reduce((acc, word) => acc + this.countSyllables(word), 0);
    const flesch_reading_ease = 206.835 - (1.015 * avg_sentence_length) - (84.6 * (syllableCount / words.length));
    const flesch_kincaid_grade = (0.39 * avg_sentence_length) + (11.8 * (syllableCount / words.length)) - 15.59;

    // 6. Tone & Sentiment
    const Analyzer = natural.SentimentAnalyzer;
    const stemmer = natural.PorterStemmer;
    const analyzer = new Analyzer("English", stemmer, "afinn");
    const sentiment_score = analyzer.getSentiment(words);

    // Tone is harder without advanced NLP, we'll use a simple heuristic based on sentence length and formality
    // Short sentences + simple words = conversational (1)
    // Long sentences + complex words = formal (-1)
    const tone_score = Math.max(-1, Math.min(1,
      (15 - avg_sentence_length) / 10 + (0.5 - unique_word_ratio)
    ));

    // 7. Top Words/Phrases
    const tfidf = new natural.TfIdf();
    tfidf.addDocument(text);
    const top_words = JSON.stringify(
      tfidf.listTerms(0 /* doc index */)
        .slice(0, 20)
        .reduce((acc: any, item) => ({ ...acc, [item.term]: item.tfidf }), {})
    );

    // Phrases (n-grams)
    const ngrams = natural.NGrams.bigrams(words);
    const phraseFreq: Record<string, number> = {};
    ngrams.forEach(gram => {
      const phrase = gram.join(' ');
      phraseFreq[phrase] = (phraseFreq[phrase] || 0) + 1;
    });
    const top_phrases = JSON.stringify(
      Object.entries(phraseFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .reduce((acc: any, [key, val]) => ({ ...acc, [key]: val }), {})
    );

    return {
      avg_sentence_length,
      sentence_length_variance,
      vocab_complexity,
      unique_word_ratio,
      avg_paragraph_length,
      paragraph_variance,
      dialogue_ratio,
      flesch_reading_ease,
      flesch_kincaid_grade,
      tone_score,
      sentiment_score,
      top_words,
      top_phrases,
      common_sentence_patterns: '[]', // Placeholder
      confidence_score: 85 // Placeholder
    };
  }

  private average(arr: number[]) {
    return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  }

  private variance(arr: number[]) {
    const avg = this.average(arr);
    return this.average(arr.map(n => Math.pow(n - avg, 2)));
  }

  private countSyllables(word: string) {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    return word.match(/[aeiouy]{1,2}/g)?.length || 1;
  }
}

export const styleAnalysisService = new StyleAnalysisService();
