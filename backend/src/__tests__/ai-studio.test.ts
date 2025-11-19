// AI Studio Integration Tests
// Phase 8 Implementation - Test all AI Studio endpoints

import { describe, it, expect, beforeEach } from 'vitest';
import { aiStyleIntegrationService } from '../services/ai-style-integration.service';
import { styleAnalysisService } from '../services/style-analysis.service';
import { masterworkService } from '../services/masterwork.service';
import { extractionService } from '../services/extraction.service';
import { inMemoryStore } from '../data/in-memory-store';
import path from 'path';

describe('AI Studio Integration Tests', () => {
  let masterworkId1: string;
  let masterworkId2: string;

  // Sample text for testing - different styles
  const hemingwayStyle = `The sun rose. Birds sang. He walked down the empty street.
    His coat was old. The wind was cold. He did not care.
    The cafe was open. He went inside. Coffee was waiting.`;

  const dickensSty = `It was the best of times, it was the worst of times, it was the age of wisdom,
    it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity,
    it was the season of Light, it was the season of Darkness, it was the spring of hope,
    it was the winter of despair, we had everything before us, we had nothing before us,
    we were all going direct to Heaven, we were all going direct the other way.`;

  beforeEach(async () => {
    // Clear store
    inMemoryStore.clear();

    // Create test masterwork 1 (Hemingway-like)
    const mw1 = await masterworkService.createMasterwork({
      title: 'Test Short Sentences',
      author: 'Test Author 1',
      format: 'TXT',
      userId: 'test-user'
    });
    masterworkId1 = mw1.id;

    // Analyze style
    await styleAnalysisService.analyzeStyle(masterworkId1, hemingwayStyle);
    inMemoryStore.updateMasterwork(masterworkId1, { analysisStatus: 'completed' });

    // Create test masterwork 2 (Dickens-like)
    const mw2 = await masterworkService.createMasterwork({
      title: 'Test Long Sentences',
      author: 'Test Author 2',
      format: 'TXT',
      userId: 'test-user'
    });
    masterworkId2 = mw2.id;

    // Analyze style
    await styleAnalysisService.analyzeStyle(masterworkId2, dickensSty);
    inMemoryStore.updateMasterwork(masterworkId2, { analysisStatus: 'completed' });
  });

  describe('Style Prompt Generation', () => {
    it('should generate AI style prompt with system prompt', async () => {
      const result = await aiStyleIntegrationService.generateStylePrompt(masterworkId1);

      expect(result).toBeDefined();
      expect(result.systemPrompt).toBeTruthy();
      expect(result.systemPrompt).toContain('Test Short Sentences');
      expect(result.systemPrompt).toContain('STYLE PROFILE');
      expect(result.systemPrompt).toContain('Sentence Length');
      expect(result.userGuidance).toBeTruthy();
      expect(result.styleHints).toBeInstanceOf(Array);
      expect(result.styleHints.length).toBeGreaterThan(0);
    });

    it('should include technical parameters', async () => {
      const result = await aiStyleIntegrationService.generateStylePrompt(masterworkId1);

      expect(result.technicalParameters).toBeDefined();
      expect(result.technicalParameters.temperature).toBeGreaterThan(0);
      expect(result.technicalParameters.temperature).toBeLessThanOrEqual(1);
      expect(result.technicalParameters.topP).toBeGreaterThan(0);
      expect(result.technicalParameters.topP).toBeLessThanOrEqual(1);
      expect(result.technicalParameters.maxTokens).toBeGreaterThan(0);
    });

    it('should include style profile metrics in prompt', async () => {
      const result = await aiStyleIntegrationService.generateStylePrompt(masterworkId1);

      expect(result.styleProfile).toBeDefined();
      expect(result.styleProfile.avgSentenceLength).toBeGreaterThan(0);
      expect(result.styleProfile.vocabComplexity).toBeGreaterThanOrEqual(0);
      expect(result.styleProfile.vocabComplexity).toBeLessThanOrEqual(100);
    });

    it('should throw error for non-existent masterwork', async () => {
      await expect(
        aiStyleIntegrationService.generateStylePrompt('non-existent-id')
      ).rejects.toThrow();
    });
  });

  describe('Style Comparison', () => {
    it('should compare two different styles', async () => {
      const result = await aiStyleIntegrationService.compareStyles(
        masterworkId1,
        masterworkId2
      );

      expect(result).toBeDefined();
      expect(result.masterwork1).toBeDefined();
      expect(result.masterwork1.title).toBe('Test Short Sentences');
      expect(result.masterwork2).toBeDefined();
      expect(result.masterwork2.title).toBe('Test Long Sentences');
      expect(result.similarities).toBeInstanceOf(Array);
      expect(result.similarities.length).toBeGreaterThan(0);
      expect(result.differences).toBeInstanceOf(Array);
      expect(result.overallSimilarity).toBeGreaterThanOrEqual(0);
      expect(result.overallSimilarity).toBeLessThanOrEqual(100);
    });

    it('should include metric-by-metric similarities', async () => {
      const result = await aiStyleIntegrationService.compareStyles(
        masterworkId1,
        masterworkId2
      );

      const firstSim = result.similarities[0];
      expect(firstSim).toBeDefined();
      expect(firstSim.metric).toBeTruthy();
      expect(firstSim.similarity).toBeGreaterThanOrEqual(0);
      expect(firstSim.similarity).toBeLessThanOrEqual(100);
      expect(firstSim.description).toBeTruthy();
    });

    it('should identify key differences', async () => {
      const result = await aiStyleIntegrationService.compareStyles(
        masterworkId1,
        masterworkId2
      );

      // These two styles should have differences
      expect(result.differences.length).toBeGreaterThan(0);

      const firstDiff = result.differences[0];
      expect(firstDiff.metric).toBeTruthy();
      expect(firstDiff.delta).toBeDefined();
      expect(firstDiff.description).toBeTruthy();
    });

    it('should throw error for same masterwork comparison', async () => {
      await expect(
        aiStyleIntegrationService.compareStyles(masterworkId1, masterworkId1)
      ).rejects.toThrow('Cannot compare a masterwork with itself');
    });

    it('should throw error for non-existent masterworks', async () => {
      await expect(
        aiStyleIntegrationService.compareStyles('non-existent-1', 'non-existent-2')
      ).rejects.toThrow();
    });
  });

  describe('Style Blending', () => {
    it('should blend two styles with equal weights', async () => {
      const result = await aiStyleIntegrationService.blendStyles([
        { masterworkId: masterworkId1, weight: 50 },
        { masterworkId: masterworkId2, weight: 50 }
      ]);

      expect(result).toBeDefined();
      expect(result.blendedMetrics).toBeDefined();
      expect(result.blendedMetrics.avgSentenceLength).toBeGreaterThan(0);
      expect(result.stylePrompt).toBeDefined();
      expect(result.stylePrompt.systemPrompt).toBeTruthy();
      expect(result.contributingStyles).toHaveLength(2);
    });

    it('should normalize weights correctly', async () => {
      const result = await aiStyleIntegrationService.blendStyles([
        { masterworkId: masterworkId1, weight: 30 },
        { masterworkId: masterworkId2, weight: 70 }
      ]);

      const style1 = result.contributingStyles.find(s => s.masterworkId === masterworkId1);
      const style2 = result.contributingStyles.find(s => s.masterworkId === masterworkId2);

      expect(style1?.normalizedWeight).toBeCloseTo(30, 1);
      expect(style2?.normalizedWeight).toBeCloseTo(70, 1);

      // Total should be 100%
      const total = result.contributingStyles.reduce((sum, s) => sum + s.normalizedWeight, 0);
      expect(total).toBeCloseTo(100, 1);
    });

    it('should blend metrics proportionally', async () => {
      // Get original profiles
      const profile1 = inMemoryStore.getStyleProfile(masterworkId1);
      const profile2 = inMemoryStore.getStyleProfile(masterworkId2);

      expect(profile1).toBeDefined();
      expect(profile2).toBeDefined();

      // Blend with equal weights
      const result = await aiStyleIntegrationService.blendStyles([
        { masterworkId: masterworkId1, weight: 50 },
        { masterworkId: masterworkId2, weight: 50 }
      ]);

      // Blended sentence length should be average of both
      const expectedAvgLength = (profile1!.avgSentenceLength + profile2!.avgSentenceLength) / 2;
      expect(result.blendedMetrics.avgSentenceLength).toBeCloseTo(expectedAvgLength, 1);
    });

    it('should handle 3+ styles', async () => {
      // Create third masterwork
      const mw3 = await masterworkService.createMasterwork({
        title: 'Test Medium Sentences',
        author: 'Test Author 3',
        format: 'TXT',
        userId: 'test-user'
      });

      const text3 = 'This is a medium sentence. It has a moderate length. Not too short, not too long.';
      await styleAnalysisService.analyzeStyle(mw3.id, text3);
      inMemoryStore.updateMasterwork(mw3.id, { analysisStatus: 'completed' });

      const result = await aiStyleIntegrationService.blendStyles([
        { masterworkId: masterworkId1, weight: 33 },
        { masterworkId: masterworkId2, weight: 33 },
        { masterworkId: mw3.id, weight: 34 }
      ]);

      expect(result.contributingStyles).toHaveLength(3);
    });

    it('should throw error for insufficient styles', async () => {
      await expect(
        aiStyleIntegrationService.blendStyles([
          { masterworkId: masterworkId1, weight: 100 }
        ])
      ).rejects.toThrow('At least 2 styles required for blending');
    });

    it('should throw error for invalid weights', async () => {
      await expect(
        aiStyleIntegrationService.blendStyles([
          { masterworkId: masterworkId1, weight: 0 },
          { masterworkId: masterworkId2, weight: 0 }
        ])
      ).rejects.toThrow('Total weight must be greater than 0');
    });
  });

  describe('Writing Tips', () => {
    it('should generate actionable writing tips', async () => {
      const result = await aiStyleIntegrationService.getWritingTips(masterworkId1);

      expect(result).toBeDefined();
      expect(result.masterwork).toBeDefined();
      expect(result.masterwork.title).toBe('Test Short Sentences');
      expect(result.tips).toBeInstanceOf(Array);
      expect(result.tips.length).toBeGreaterThan(0);
    });

    it('should categorize tips', async () => {
      const result = await aiStyleIntegrationService.getWritingTips(masterworkId1);

      const firstTip = result.tips[0];
      expect(firstTip).toBeDefined();
      expect(firstTip.category).toBeTruthy();
      expect(['Structure', 'Vocabulary', 'Tone', 'Dialogue', 'Readability']).toContain(
        firstTip.category
      );
      expect(firstTip.tip).toBeTruthy();
      expect(firstTip.reasoning).toBeTruthy();
    });

    it('should throw error for non-existent masterwork', async () => {
      await expect(
        aiStyleIntegrationService.getWritingTips('non-existent-id')
      ).rejects.toThrow();
    });
  });

  describe('Integration with Style Analysis', () => {
    it('should use actual analyzed metrics for prompts', async () => {
      const profile = inMemoryStore.getStyleProfile(masterworkId1);
      const prompt = await aiStyleIntegrationService.generateStylePrompt(masterworkId1);

      expect(profile).toBeDefined();
      expect(prompt.styleProfile.avgSentenceLength).toBe(profile!.avgSentenceLength);
      expect(prompt.styleProfile.vocabComplexity).toBe(profile!.vocabComplexity);
    });

    it('should reflect style differences in comparisons', async () => {
      const profile1 = inMemoryStore.getStyleProfile(masterworkId1);
      const profile2 = inMemoryStore.getStyleProfile(masterworkId2);
      const comparison = await aiStyleIntegrationService.compareStyles(
        masterworkId1,
        masterworkId2
      );

      expect(profile1).toBeDefined();
      expect(profile2).toBeDefined();

      // Hemingway-style has shorter sentences than Dickens-style
      expect(profile1!.avgSentenceLength).toBeLessThan(profile2!.avgSentenceLength);

      // This should be reflected in the comparison
      const sentenceLengthSim = comparison.similarities.find(
        s => s.metric.toLowerCase().includes('sentence')
      );

      expect(sentenceLengthSim).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle masterworks without style profiles', async () => {
      const mw = await masterworkService.createMasterwork({
        title: 'Not Analyzed',
        format: 'TXT',
        userId: 'test-user'
      });

      await expect(
        aiStyleIntegrationService.generateStylePrompt(mw.id)
      ).rejects.toThrow();
    });

    it('should validate input parameters', async () => {
      await expect(
        aiStyleIntegrationService.blendStyles([])
      ).rejects.toThrow();

      await expect(
        aiStyleIntegrationService.compareStyles('', '')
      ).rejects.toThrow();
    });
  });
});
