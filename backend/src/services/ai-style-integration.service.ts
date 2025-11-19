// AI Studio Style Integration - Apply learned styles to AI generation
// Phase 8 Implementation

import { StyleProfile } from '../models/StyleProfile';
import { inMemoryStore } from '../data/in-memory-store';

export interface StylePrompt {
  systemPrompt: string;
  userGuidance: string;
  styleHints: string[];
  technicalParameters: {
    avgSentenceLength: number;
    complexityLevel: string;
    toneGuidance: string;
    readabilityTarget: string;
  };
}

export interface StyleComparison {
  masterwork1: {
    id: string;
    title: string;
  };
  masterwork2: {
    id: string;
    title: string;
  };
  similarities: Array<{
    metric: string;
    similarity: number; // 0-100%
    description: string;
  }>;
  differences: Array<{
    metric: string;
    delta: number;
    description: string;
  }>;
  overallSimilarity: number; // 0-100%
}

export interface BlendedStyle {
  name: string;
  sourceStyles: Array<{
    masterworkId: string;
    title: string;
    weight: number; // 0-1
  }>;
  blendedMetrics: {
    avgSentenceLength: number;
    vocabComplexity: number;
    dialogueRatio: number;
    toneScore: number;
    readabilityGrade: number;
  };
  prompt: StylePrompt;
}

export class AIStyleIntegrationService {
  /**
   * Generate AI prompt based on a masterwork's style
   */
  async generateStylePrompt(masterworkId: string): Promise<StylePrompt> {
    const styleProfile = inMemoryStore.getStyleProfile(masterworkId);
    const masterwork = inMemoryStore.getMasterwork(masterworkId);

    if (!styleProfile || !masterwork) {
      throw new Error('Style profile or masterwork not found');
    }

    // Analyze style characteristics
    const complexity = this.getComplexityLevel(styleProfile.vocabComplexity);
    const tone = this.getToneDescription(styleProfile.toneScore);
    const readability = this.getReadabilityLevel(styleProfile.fleschKincaidGrade);

    // Build style hints
    const styleHints: string[] = [];

    // Sentence structure hints
    if (styleProfile.avgSentenceLength < 12) {
      styleHints.push('Use short, punchy sentences');
    } else if (styleProfile.avgSentenceLength > 20) {
      styleHints.push('Use longer, more complex sentence structures');
    } else {
      styleHints.push('Use moderate-length sentences');
    }

    // Vocabulary hints
    if (styleProfile.vocabComplexity > 75) {
      styleHints.push('Employ sophisticated vocabulary and complex word choices');
    } else if (styleProfile.vocabComplexity < 40) {
      styleHints.push('Use simple, accessible language');
    } else {
      styleHints.push('Balance between accessible and descriptive vocabulary');
    }

    // Dialogue hints
    if (styleProfile.dialogueRatio > 30) {
      styleHints.push('Incorporate substantial dialogue and character interactions');
    } else if (styleProfile.dialogueRatio > 15) {
      styleHints.push('Include moderate dialogue where appropriate');
    } else {
      styleHints.push('Focus more on narrative and description than dialogue');
    }

    // Tone hints
    if (styleProfile.toneScore > 0.3) {
      styleHints.push('Adopt a conversational, approachable tone');
    } else if (styleProfile.toneScore < -0.3) {
      styleHints.push('Maintain a formal, literary tone');
    } else {
      styleHints.push('Balance formal and conversational elements');
    }

    // Sentiment hints
    if (styleProfile.sentimentScore > 0.3) {
      styleHints.push('Lean toward positive, uplifting language');
    } else if (styleProfile.sentimentScore < -0.3) {
      styleHints.push('Incorporate darker, more serious themes');
    } else {
      styleHints.push('Maintain emotional balance and nuance');
    }

    // Paragraph structure
    if (styleProfile.avgParagraphLength > 6) {
      styleHints.push('Develop longer, more detailed paragraphs');
    } else if (styleProfile.avgParagraphLength < 3) {
      styleHints.push('Keep paragraphs short and focused');
    }

    // Build system prompt
    const systemPrompt = `You are writing in the style of "${masterwork.title}"${
      masterwork.author ? ` by ${masterwork.author}` : ''
    }.

STYLE PROFILE:
- Sentence Length: ${styleProfile.avgSentenceLength.toFixed(1)} words average
- Vocabulary Complexity: ${complexity} (${styleProfile.vocabComplexity.toFixed(1)}/100)
- Tone: ${tone} (${styleProfile.toneScore.toFixed(2)})
- Reading Level: ${readability} (Grade ${styleProfile.fleschKincaidGrade.toFixed(1)})
- Dialogue Ratio: ${styleProfile.dialogueRatio.toFixed(1)}%

WRITING GUIDELINES:
${styleHints.map((hint, i) => `${i + 1}. ${hint}`).join('\n')}

COMMON PATTERNS:
${styleProfile.commonSentencePatterns.slice(0, 3).map((p, i) => `${i + 1}. ${p}`).join('\n')}

TOP VOCABULARY:
${Object.entries(styleProfile.topWords)
  .slice(0, 10)
  .map(([word]) => word)
  .join(', ')}

Match this style closely while creating original content.`;

    const userGuidance = `Write in the style learned from "${masterwork.title}". Focus on:
- ${complexity} vocabulary
- ${tone} tone
- ${this.getSentenceLengthGuidance(styleProfile.avgSentenceLength)}
- ${this.getDialogueGuidance(styleProfile.dialogueRatio)}`;

    return {
      systemPrompt,
      userGuidance,
      styleHints,
      technicalParameters: {
        avgSentenceLength: styleProfile.avgSentenceLength,
        complexityLevel: complexity,
        toneGuidance: tone,
        readabilityTarget: readability
      }
    };
  }

  /**
   * Compare two style profiles
   */
  async compareStyles(masterworkId1: string, masterworkId2: string): Promise<StyleComparison> {
    const style1 = inMemoryStore.getStyleProfile(masterworkId1);
    const style2 = inMemoryStore.getStyleProfile(masterworkId2);
    const masterwork1 = inMemoryStore.getMasterwork(masterworkId1);
    const masterwork2 = inMemoryStore.getMasterwork(masterworkId2);

    if (!style1 || !style2 || !masterwork1 || !masterwork2) {
      throw new Error('Style profiles or masterworks not found');
    }

    const similarities: Array<{ metric: string; similarity: number; description: string }> = [];
    const differences: Array<{ metric: string; delta: number; description: string }> = [];

    // Compare sentence length
    const sentenceDiff = Math.abs(style1.avgSentenceLength - style2.avgSentenceLength);
    const sentenceSim = Math.max(0, 100 - (sentenceDiff / 20) * 100);
    similarities.push({
      metric: 'Sentence Length',
      similarity: sentenceSim,
      description: `${style1.avgSentenceLength.toFixed(1)} vs ${style2.avgSentenceLength.toFixed(1)} words`
    });

    // Compare vocabulary complexity
    const vocabDiff = Math.abs(style1.vocabComplexity - style2.vocabComplexity);
    const vocabSim = Math.max(0, 100 - vocabDiff);
    similarities.push({
      metric: 'Vocabulary Complexity',
      similarity: vocabSim,
      description: `${style1.vocabComplexity.toFixed(1)} vs ${style2.vocabComplexity.toFixed(1)}`
    });

    // Compare dialogue ratio
    const dialogueDiff = Math.abs(style1.dialogueRatio - style2.dialogueRatio);
    const dialogueSim = Math.max(0, 100 - dialogueDiff);
    similarities.push({
      metric: 'Dialogue Usage',
      similarity: dialogueSim,
      description: `${style1.dialogueRatio.toFixed(1)}% vs ${style2.dialogueRatio.toFixed(1)}%`
    });

    // Compare tone
    const toneDiff = Math.abs(style1.toneScore - style2.toneScore);
    const toneSim = Math.max(0, 100 - (toneDiff / 2) * 100);
    similarities.push({
      metric: 'Tone',
      similarity: toneSim,
      description: `${this.getToneDescription(style1.toneScore)} vs ${this.getToneDescription(style2.toneScore)}`
    });

    // Compare readability
    const readabilityDiff = Math.abs(style1.fleschKincaidGrade - style2.fleschKincaidGrade);
    const readabilitySim = Math.max(0, 100 - (readabilityDiff / 12) * 100);
    similarities.push({
      metric: 'Readability',
      similarity: readabilitySim,
      description: `Grade ${style1.fleschKincaidGrade.toFixed(1)} vs ${style2.fleschKincaidGrade.toFixed(1)}`
    });

    // Identify significant differences
    if (sentenceDiff > 5) {
      differences.push({
        metric: 'Sentence Length',
        delta: style1.avgSentenceLength - style2.avgSentenceLength,
        description: `${masterwork1.title} uses ${
          sentenceDiff > 0 ? 'longer' : 'shorter'
        } sentences by ${sentenceDiff.toFixed(1)} words`
      });
    }

    if (vocabDiff > 20) {
      differences.push({
        metric: 'Vocabulary',
        delta: style1.vocabComplexity - style2.vocabComplexity,
        description: `${masterwork1.title} has ${
          vocabDiff > 0 ? 'more' : 'less'
        } complex vocabulary`
      });
    }

    if (dialogueDiff > 15) {
      differences.push({
        metric: 'Dialogue',
        delta: style1.dialogueRatio - style2.dialogueRatio,
        description: `${masterwork1.title} uses ${
          dialogueDiff > 0 ? 'more' : 'less'
        } dialogue (${dialogueDiff.toFixed(1)}% difference)`
      });
    }

    // Calculate overall similarity
    const overallSimilarity =
      similarities.reduce((sum, s) => sum + s.similarity, 0) / similarities.length;

    return {
      masterwork1: {
        id: masterworkId1,
        title: masterwork1.title
      },
      masterwork2: {
        id: masterworkId2,
        title: masterwork2.title
      },
      similarities,
      differences,
      overallSimilarity: Math.round(overallSimilarity)
    };
  }

  /**
   * Blend multiple styles together
   */
  async blendStyles(
    styleInputs: Array<{ masterworkId: string; weight: number }>
  ): Promise<BlendedStyle> {
    // Normalize weights
    const totalWeight = styleInputs.reduce((sum, input) => sum + input.weight, 0);
    const normalizedInputs = styleInputs.map(input => ({
      ...input,
      weight: input.weight / totalWeight
    }));

    // Get all style profiles
    const styles = normalizedInputs.map(input => {
      const profile = inMemoryStore.getStyleProfile(input.masterworkId);
      const masterwork = inMemoryStore.getMasterwork(input.masterworkId);
      if (!profile || !masterwork) {
        throw new Error(`Style profile not found for ${input.masterworkId}`);
      }
      return { profile, masterwork, weight: input.weight };
    });

    // Calculate blended metrics
    const blendedMetrics = {
      avgSentenceLength: styles.reduce(
        (sum, s) => sum + s.profile.avgSentenceLength * s.weight,
        0
      ),
      vocabComplexity: styles.reduce(
        (sum, s) => sum + s.profile.vocabComplexity * s.weight,
        0
      ),
      dialogueRatio: styles.reduce((sum, s) => sum + s.profile.dialogueRatio * s.weight, 0),
      toneScore: styles.reduce((sum, s) => sum + s.profile.toneScore * s.weight, 0),
      readabilityGrade: styles.reduce(
        (sum, s) => sum + s.profile.fleschKincaidGrade * s.weight,
        0
      )
    };

    // Generate blend name
    const name =
      styles.length === 2
        ? `${styles[0].masterwork.title} + ${styles[1].masterwork.title} Blend`
        : `${styles.length}-Style Blend`;

    // Generate prompt for blended style
    const complexity = this.getComplexityLevel(blendedMetrics.vocabComplexity);
    const tone = this.getToneDescription(blendedMetrics.toneScore);
    const readability = this.getReadabilityLevel(blendedMetrics.readabilityGrade);

    const systemPrompt = `You are writing in a blended style combining elements from:
${styles.map((s, i) => `${i + 1}. "${s.masterwork.title}"${s.masterwork.author ? ` by ${s.masterwork.author}` : ''} (${Math.round(s.weight * 100)}%)`).join('\n')}

BLENDED STYLE PROFILE:
- Sentence Length: ${blendedMetrics.avgSentenceLength.toFixed(1)} words average
- Vocabulary Complexity: ${complexity} (${blendedMetrics.vocabComplexity.toFixed(1)}/100)
- Tone: ${tone} (${blendedMetrics.toneScore.toFixed(2)})
- Reading Level: ${readability} (Grade ${blendedMetrics.readabilityGrade.toFixed(1)})
- Dialogue Ratio: ${blendedMetrics.dialogueRatio.toFixed(1)}%

Create content that harmoniously combines these styles.`;

    const prompt: StylePrompt = {
      systemPrompt,
      userGuidance: `Write in a blended style combining ${styles.map(s => `"${s.masterwork.title}"`).join(' and ')}`,
      styleHints: [
        `Use ${complexity} vocabulary`,
        `Maintain a ${tone} tone`,
        `Average ${blendedMetrics.avgSentenceLength.toFixed(1)} words per sentence`,
        `Include ${blendedMetrics.dialogueRatio.toFixed(1)}% dialogue`
      ],
      technicalParameters: {
        avgSentenceLength: blendedMetrics.avgSentenceLength,
        complexityLevel: complexity,
        toneGuidance: tone,
        readabilityTarget: readability
      }
    };

    return {
      name,
      sourceStyles: normalizedInputs.map(input => {
        const masterwork = inMemoryStore.getMasterwork(input.masterworkId)!;
        return {
          masterworkId: input.masterworkId,
          title: masterwork.title,
          weight: input.weight
        };
      }),
      blendedMetrics,
      prompt
    };
  }

  /**
   * Get content generation tips based on style
   */
  getWritingTips(styleProfile: StyleProfile): string[] {
    const tips: string[] = [];

    // Sentence variation tip
    if (styleProfile.sentenceLengthVariance < 20) {
      tips.push('Vary sentence length more for better rhythm');
    } else if (styleProfile.sentenceLengthVariance > 80) {
      tips.push('Consider more consistent sentence lengths for smoother flow');
    }

    // Vocabulary tip
    if (styleProfile.uniqueWordRatio < 0.3) {
      tips.push('Expand vocabulary to avoid repetition');
    } else if (styleProfile.uniqueWordRatio > 0.6) {
      tips.push('Consider repeating key terms for emphasis');
    }

    // Dialogue tip
    if (styleProfile.dialogueRatio > 40) {
      tips.push('Heavy dialogue use - ensure narrative balance');
    } else if (styleProfile.dialogueRatio < 10) {
      tips.push('Low dialogue - consider adding character voices');
    }

    // Readability tip
    if (styleProfile.fleschKincaidGrade > 12) {
      tips.push('Complex writing - ensure clarity for target audience');
    } else if (styleProfile.fleschKincaidGrade < 6) {
      tips.push('Simple writing - opportunity for more sophisticated language');
    }

    return tips;
  }

  // Helper methods
  private getComplexityLevel(score: number): string {
    if (score < 30) return 'Simple';
    if (score < 50) return 'Moderate';
    if (score < 70) return 'Advanced';
    return 'Sophisticated';
  }

  private getToneDescription(score: number): string {
    if (score < -0.5) return 'Very Formal';
    if (score < -0.2) return 'Formal';
    if (score >= -0.2 && score <= 0.2) return 'Neutral';
    if (score < 0.5) return 'Conversational';
    return 'Very Conversational';
  }

  private getReadabilityLevel(grade: number): string {
    if (grade <= 6) return 'Elementary';
    if (grade <= 8) return 'Middle School';
    if (grade <= 12) return 'High School';
    if (grade <= 16) return 'College';
    return 'Graduate';
  }

  private getSentenceLengthGuidance(avg: number): string {
    if (avg < 12) return 'Short, punchy sentences';
    if (avg > 20) return 'Longer, complex sentences';
    return 'Moderate sentence length';
  }

  private getDialogueGuidance(ratio: number): string {
    if (ratio > 30) return 'Heavy dialogue use';
    if (ratio > 15) return 'Moderate dialogue';
    return 'Narrative-focused with minimal dialogue';
  }
}

// Export singleton
export const aiStyleIntegrationService = new AIStyleIntegrationService();
