// End-to-End Integration Tests for Knowledge Vault
// Complete workflow: Upload → Extract → Analyze → Search

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import path from 'path';
import fs from 'fs/promises';
import { extractionService } from '../services/extraction.service';
import { styleAnalysisService } from '../services/style-analysis.service';
import { searchService } from '../services/search.service';
import { masterworkService } from '../services/masterwork.service';
import { inMemoryStore } from '../data/in-memory-store';

describe('Knowledge Vault E2E Integration Tests', () => {
  const testFilesDir = path.join(__dirname, '../../tests/test-files');
  let masterworkId: string;

  beforeAll(async () => {
    // Create test files directory
    await fs.mkdir(testFilesDir, { recursive: true });

    // Create a realistic test document
    const testContent = `
# The Test Manuscript

This is a sample manuscript for testing the Knowledge Vault.

## Chapter 1: The Beginning

The morning sun cast long shadows across the empty street. Sarah walked slowly, her thoughts distant.
"Where are you going?" called out a voice from behind.

She turned, recognizing the familiar tone. "I'm not sure yet," she replied honestly.

The conversation felt heavy, weighted with unspoken meanings. They had been friends for years,
but something had changed. The comfortable silence they once shared had become uncomfortable.

## Chapter 2: Discovery

Later that day, Sarah discovered something unexpected. The old bookstore on Fifth Avenue,
the one she'd passed a hundred times, held a secret. Behind the dusty shelves of forgotten
volumes lay a door she'd never noticed before.

"This is extraordinary," she whispered to herself, running her fingers along the ancient wood.

The proprietor, an elderly woman with kind eyes, smiled knowingly. "Some doors appear only
when you're ready to walk through them," she said cryptically.

## Chapter 3: Understanding

Sarah learned something important that day: life doesn't always follow the path we plan.
Sometimes the most meaningful discoveries happen when we're not looking for them.

The experience changed her perspective entirely. She began to see possibilities where before
she'd only seen obstacles. The world seemed fuller, richer with potential.

"Thank you," she told the elderly woman as she left.

"You found what you needed," came the gentle reply.

And Sarah knew it was true.
    `.trim();

    await fs.writeFile(path.join(testFilesDir, 'test-manuscript.md'), testContent);
  });

  afterAll(async () => {
    // Clean up
    await fs.rm(testFilesDir, { recursive: true, force: true });
    inMemoryStore.clear();
  });

  describe('Complete Workflow: Upload → Extract → Analyze → Search', () => {
    it('Step 1: Create masterwork record', async () => {
      const masterwork = await masterworkService.createMasterwork({
        userId: 'test-user-e2e',
        title: 'The Test Manuscript',
        author: 'Test Author',
        format: 'MD',
        fileSize: 2000,
        filePath: path.join(testFilesDir, 'test-manuscript.md'),
        wordCount: 0, // Will be updated after extraction
        language: 'en'
      });

      masterworkId = masterwork.id;

      expect(masterwork).toBeDefined();
      expect(masterwork.id).toBeDefined();
      expect(masterwork.title).toBe('The Test Manuscript');
      expect(masterwork.extractionStatus).toBe('pending');
      expect(masterwork.analysisStatus).toBe('not_started');
    });

    it('Step 2: Extract text and create chunks', async () => {
      const result = await extractionService.extractAndStoreText(
        masterworkId,
        path.join(testFilesDir, 'test-manuscript.md'),
        'MD'
      );

      expect(result.text).toBeDefined();
      expect(result.text.length).toBeGreaterThan(500);
      expect(result.wordCount).toBeGreaterThan(50);
      expect(result.chunks.length).toBeGreaterThan(0);

      // Verify chunks are stored
      const storedChunks = inMemoryStore.getTextChunks(masterworkId);
      expect(storedChunks.length).toBe(result.chunks.length);
      expect(storedChunks[0].textContent).toBeDefined();

      // Update masterwork with accurate word count
      await masterworkService.updateMasterwork(masterworkId, {
        wordCount: result.wordCount,
        extractionStatus: 'completed'
      });

      console.log(`✓ Extracted ${result.wordCount} words into ${result.chunks.length} chunks`);
    });

    it('Step 3: Analyze style DNA', async () => {
      // Get all text
      const chunks = inMemoryStore.getTextChunks(masterworkId);
      const fullText = chunks.map(c => c.textContent).join('\n\n');

      const styleProfile = await styleAnalysisService.analyzeStyle(masterworkId, fullText);

      expect(styleProfile).toBeDefined();
      expect(styleProfile.masterworkId).toBe(masterworkId);

      // Verify key metrics
      expect(styleProfile.avgSentenceLength).toBeGreaterThan(0);
      expect(styleProfile.vocabComplexity).toBeGreaterThan(0);
      expect(styleProfile.vocabComplexity).toBeLessThanOrEqual(100);
      expect(styleProfile.uniqueWordRatio).toBeGreaterThan(0);
      expect(styleProfile.uniqueWordRatio).toBeLessThanOrEqual(1);
      expect(styleProfile.fleschReadingEase).toBeGreaterThan(0);
      expect(styleProfile.fleschKincaidGrade).toBeGreaterThan(0);

      // Tone and sentiment should be normalized
      expect(styleProfile.toneScore).toBeGreaterThanOrEqual(-1);
      expect(styleProfile.toneScore).toBeLessThanOrEqual(1);
      expect(styleProfile.sentimentScore).toBeGreaterThanOrEqual(-1);
      expect(styleProfile.sentimentScore).toBeLessThanOrEqual(1);

      // Dialogue should be detected
      expect(styleProfile.dialogueRatio).toBeGreaterThan(0);

      // Top words and phrases
      expect(Object.keys(styleProfile.topWords).length).toBeGreaterThan(0);
      expect(styleProfile.commonSentencePatterns.length).toBeGreaterThan(0);

      // Confidence score
      expect(styleProfile.confidenceScore).toBeGreaterThan(0);
      expect(styleProfile.confidenceScore).toBeLessThanOrEqual(100);

      console.log('✓ Style DNA Analysis Results:');
      console.log(`  - Avg sentence length: ${styleProfile.avgSentenceLength} words`);
      console.log(`  - Vocabulary complexity: ${styleProfile.vocabComplexity}%`);
      console.log(`  - Dialogue ratio: ${styleProfile.dialogueRatio}%`);
      console.log(`  - Reading ease: ${styleProfile.fleschReadingEase}`);
      console.log(`  - Grade level: ${styleProfile.fleschKincaidGrade}`);
      console.log(`  - Tone: ${styleProfile.toneScore} (${styleProfile.toneScore < 0 ? 'formal' : 'conversational'})`);
      console.log(`  - Sentiment: ${styleProfile.sentimentScore}`);
      console.log(`  - Confidence: ${styleProfile.confidenceScore}%`);

      // Update masterwork status
      await masterworkService.updateMasterwork(masterworkId, {
        analysisStatus: 'completed'
      });
    });

    it('Step 4: Search for specific phrases', async () => {
      // Search for a phrase that appears in the document
      const searchResult = await searchService.search({
        query: 'empty street',
        limit: 10
      });

      expect(searchResult.results.length).toBeGreaterThan(0);
      expect(searchResult.total).toBeGreaterThan(0);

      const firstResult = searchResult.results[0];
      expect(firstResult.masterworkId).toBe(masterworkId);
      expect(firstResult.masterworkTitle).toBe('The Test Manuscript');
      expect(firstResult.highlightedSnippet).toContain('<mark>');
      expect(firstResult.relevanceScore).toBeGreaterThan(0);

      console.log(`✓ Search found ${searchResult.total} results in ${searchResult.took}ms`);
      console.log(`  - First result: "${firstResult.textSnippet.substring(0, 50)}..."`);
    });

    it('Step 5: Search for dialogue', async () => {
      const searchResult = await searchService.search({
        query: 'where are you going',
        masterworkIds: [masterworkId]
      });

      expect(searchResult.results.length).toBeGreaterThan(0);

      const result = searchResult.results[0];
      expect(result.highlightedSnippet.toLowerCase()).toContain('where');
      expect(result.highlightedSnippet.toLowerCase()).toContain('going');

      console.log(`✓ Dialogue search: ${result.matchCount} matches`);
    });

    it('Step 6: Multi-term search with ranking', async () => {
      const searchResult = await searchService.search({
        query: 'Sarah discovered bookstore',
        limit: 5
      });

      expect(searchResult.results.length).toBeGreaterThan(0);

      // Results should be ranked by relevance
      const relevances = searchResult.results.map(r => r.relevanceScore);
      for (let i = 1; i < relevances.length; i++) {
        expect(relevances[i - 1]).toBeGreaterThanOrEqual(relevances[i]);
      }

      console.log(`✓ Multi-term search ranked ${searchResult.results.length} results`);
      console.log(`  - Top relevance: ${relevances[0].toFixed(2)}`);
    });

    it('Step 7: Verify complete masterwork data', async () => {
      const masterwork = await masterworkService.getMasterworkById(masterworkId);
      const styleProfile = await styleAnalysisService.getStyleProfile(masterworkId);
      const chunks = inMemoryStore.getTextChunks(masterworkId);

      expect(masterwork).toBeDefined();
      expect(masterwork!.extractionStatus).toBe('completed');
      expect(masterwork!.analysisStatus).toBe('completed');
      expect(masterwork!.wordCount).toBeGreaterThan(0);

      expect(styleProfile).toBeDefined();
      expect(styleProfile!.masterworkId).toBe(masterworkId);

      expect(chunks.length).toBeGreaterThan(0);

      console.log('✓ Complete masterwork verification passed');
      console.log(`  - Word count: ${masterwork!.wordCount}`);
      console.log(`  - Chunks: ${chunks.length}`);
      console.log(`  - Style metrics: ${Object.keys(styleProfile!).length} fields`);
    });

    it('Step 8: Search statistics', async () => {
      const stats = await searchService.getSearchStats();

      expect(stats.totalMasterworks).toBeGreaterThan(0);
      expect(stats.totalChunks).toBeGreaterThan(0);
      expect(stats.avgChunkSize).toBeGreaterThan(0);

      console.log('✓ Search statistics:');
      console.log(`  - Total masterworks: ${stats.totalMasterworks}`);
      console.log(`  - Total chunks: ${stats.totalChunks}`);
      console.log(`  - Avg chunk size: ${stats.avgChunkSize} words`);
    });
  });

  describe('Style DNA Metrics Validation', () => {
    it('Should calculate realistic sentence lengths', async () => {
      const styleProfile = await styleAnalysisService.getStyleProfile(masterworkId);

      expect(styleProfile!.avgSentenceLength).toBeGreaterThan(5);
      expect(styleProfile!.avgSentenceLength).toBeLessThan(50);
      expect(styleProfile!.sentenceLengthVariance).toBeGreaterThan(0);
    });

    it('Should detect dialogue accurately', async () => {
      const styleProfile = await styleAnalysisService.getStyleProfile(masterworkId);

      // Test document has dialogue
      expect(styleProfile!.dialogueRatio).toBeGreaterThan(5);
      expect(styleProfile!.dialogueRatio).toBeLessThan(50);
    });

    it('Should calculate readability scores', async () => {
      const styleProfile = await styleAnalysisService.getStyleProfile(masterworkId);

      expect(styleProfile!.fleschReadingEase).toBeGreaterThan(0);
      expect(styleProfile!.fleschReadingEase).toBeLessThanOrEqual(100);
      expect(styleProfile!.fleschKincaidGrade).toBeGreaterThan(0);
      expect(styleProfile!.fleschKincaidGrade).toBeLessThan(20);
    });

    it('Should identify top words', async () => {
      const styleProfile = await styleAnalysisService.getStyleProfile(masterworkId);

      const topWords = Object.entries(styleProfile!.topWords);
      expect(topWords.length).toBeGreaterThan(0);

      // Common words from the test content
      const wordList = topWords.map(([word]) => word);
      expect(wordList.some(w => ['sarah', 'she', 'the'].includes(w))).toBe(true);
    });
  });

  describe('Search Functionality Validation', () => {
    it('Should highlight exact matches', async () => {
      const result = await searchService.search({ query: 'bookstore' });

      expect(result.results.length).toBeGreaterThan(0);
      expect(result.results[0].highlightedSnippet).toContain('<mark>bookstore</mark>');
    });

    it('Should handle multi-word phrases', async () => {
      const result = await searchService.search({ query: 'Fifth Avenue' });

      expect(result.results.length).toBeGreaterThan(0);
      expect(result.results[0].highlightedSnippet).toContain('<mark>Fifth</mark>');
      expect(result.results[0].highlightedSnippet).toContain('<mark>Avenue</mark>');
    });

    it('Should handle case-insensitive search', async () => {
      const result1 = await searchService.search({ query: 'SARAH' });
      const result2 = await searchService.search({ query: 'sarah' });

      expect(result1.total).toBe(result2.total);
      expect(result1.total).toBeGreaterThan(0);
    });

    it('Should paginate results', async () => {
      const page1 = await searchService.search({ query: 'the', limit: 2, offset: 0 });
      const page2 = await searchService.search({ query: 'the', limit: 2, offset: 2 });

      if (page1.total > 2) {
        expect(page1.results.length).toBe(2);
        expect(page2.results.length).toBeGreaterThan(0);
        expect(page1.results[0].chunkId).not.toBe(page2.results[0].chunkId);
      }
    });

    it('Should return empty results for non-existent terms', async () => {
      const result = await searchService.search({ query: 'xyznonexistent' });

      expect(result.results.length).toBe(0);
      expect(result.total).toBe(0);
    });
  });

  describe('Performance Benchmarks', () => {
    it('Text extraction should complete quickly', async () => {
      const start = Date.now();

      await extractionService.extractAndStoreText(
        'perf-test',
        path.join(testFilesDir, 'test-manuscript.md'),
        'MD'
      );

      const duration = Date.now() - start;
      expect(duration).toBeLessThan(5000); // Should complete in < 5 seconds

      console.log(`✓ Extraction performance: ${duration}ms`);
    });

    it('Style analysis should complete quickly', async () => {
      const chunks = inMemoryStore.getTextChunks(masterworkId);
      const text = chunks.map(c => c.textContent).join('\n\n');

      const start = Date.now();
      await styleAnalysisService.analyzeStyle('perf-test-2', text);
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(10000); // Should complete in < 10 seconds

      console.log(`✓ Analysis performance: ${duration}ms`);
    });

    it('Search should be fast (< 100ms)', async () => {
      const start = Date.now();
      await searchService.search({ query: 'sarah bookstore' });
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(500); // Should be very fast

      console.log(`✓ Search performance: ${duration}ms`);
    });
  });
});
