/**
 * Template Presets
 * Pre-configured templates for quick-start project creation
 */

import { TemplatePreset } from '@/types/enhanced';

export const templatePresets: TemplatePreset[] = [
  // E-Book Presets
  {
    id: 'ebook-beginner-guide',
    templateId: 'ebook',
    name: 'Beginner\'s Guide (5 Chapters)',
    description: 'Perfect for introductory guides and tutorials',
    prefilledInputs: {
      tone: 'friendly',
      targetAudience: 'Beginners with no prior experience',
      numChapters: 5,
      includeIntroduction: true,
      includeConclusion: true,
    },
    estimatedTime: '2-3 hours',
    difficulty: 'beginner',
    category: 'ebook',
  },
  {
    id: 'ebook-comprehensive',
    templateId: 'ebook',
    name: 'Comprehensive Book (12 Chapters)',
    description: 'In-depth coverage for complete guides',
    prefilledInputs: {
      tone: 'professional',
      targetAudience: 'Intermediate learners',
      numChapters: 12,
      includeIntroduction: true,
      includeConclusion: true,
    },
    estimatedTime: '6-8 hours',
    difficulty: 'intermediate',
    category: 'ebook',
  },
  {
    id: 'ebook-quick-read',
    templateId: 'ebook',
    name: 'Quick Read (3 Chapters)',
    description: 'Short, focused content for specific topics',
    prefilledInputs: {
      tone: 'casual',
      targetAudience: 'Busy professionals',
      numChapters: 3,
      includeIntroduction: false,
      includeConclusion: true,
    },
    estimatedTime: '1 hour',
    difficulty: 'beginner',
    category: 'ebook',
  },

  // Online Course Presets
  {
    id: 'course-mini',
    templateId: 'online-course',
    name: 'Mini Course (3 Modules)',
    description: 'Quick skill-building course',
    prefilledInputs: {
      tone: 'mentor',
      targetAudience: 'Beginners',
      numModules: 3,
      lessonsPerModule: 3,
      includeExercises: true,
      includeResources: false,
    },
    estimatedTime: '2 hours',
    difficulty: 'beginner',
    category: 'online-course',
  },
  {
    id: 'course-complete',
    templateId: 'online-course',
    name: 'Complete Course (8 Modules)',
    description: 'Comprehensive professional training',
    prefilledInputs: {
      tone: 'professor',
      targetAudience: 'Professionals',
      numModules: 8,
      lessonsPerModule: 5,
      includeExercises: true,
      includeResources: true,
    },
    estimatedTime: '8-10 hours',
    difficulty: 'advanced',
    category: 'online-course',
  },

  // How-To Guide Presets
  {
    id: 'howto-simple',
    templateId: 'how-to-guide',
    name: 'Simple Tutorial (5 Steps)',
    description: 'Quick step-by-step instructions',
    prefilledInputs: {
      tone: 'friendly',
      targetAudience: 'Beginners',
      numSteps: 5,
      includeTroubleshooting: false,
      difficulty: 'beginner',
    },
    estimatedTime: '30 minutes',
    difficulty: 'beginner',
    category: 'how-to-guide',
  },
  {
    id: 'howto-detailed',
    templateId: 'how-to-guide',
    name: 'Detailed Guide (10 Steps)',
    description: 'Comprehensive instructions with troubleshooting',
    prefilledInputs: {
      tone: 'professional',
      targetAudience: 'Intermediate users',
      numSteps: 10,
      includeTroubleshooting: true,
      difficulty: 'intermediate',
    },
    estimatedTime: '1.5 hours',
    difficulty: 'intermediate',
    category: 'how-to-guide',
  },

  // Story Presets
  {
    id: 'story-short',
    templateId: 'story-bestseller',
    name: 'Short Story',
    description: 'Focused narrative with single plotline',
    prefilledInputs: {
      genre: 'literary-fiction',
      tone: 'storyteller',
      pov: 'third-person-limited',
      tense: 'past',
      targetWordCount: 5000,
      includeWorldBuilding: false,
    },
    estimatedTime: '2 hours',
    difficulty: 'beginner',
    category: 'story-bestseller',
  },
  {
    id: 'story-novel',
    templateId: 'story-bestseller',
    name: 'Full Novel',
    description: 'Complete novel with three-act structure',
    prefilledInputs: {
      genre: 'mystery-thriller',
      tone: 'storyteller',
      pov: 'first-person',
      tense: 'present',
      targetWordCount: 80000,
      includeWorldBuilding: true,
    },
    estimatedTime: '20+ hours',
    difficulty: 'advanced',
    category: 'story-bestseller',
  },

  // Social Media Presets
  {
    id: 'social-instagram',
    templateId: 'social-media',
    name: 'Instagram Post',
    description: 'Engaging visual-first content',
    prefilledInputs: {
      platform: 'instagram',
      tone: 'casual',
      includeHashtags: true,
      includeEmojis: true,
      variations: 3,
    },
    estimatedTime: '15 minutes',
    difficulty: 'beginner',
    category: 'social-media',
  },
  {
    id: 'social-linkedin',
    templateId: 'social-media',
    name: 'LinkedIn Post',
    description: 'Professional thought leadership',
    prefilledInputs: {
      platform: 'linkedin',
      tone: 'professional',
      includeHashtags: true,
      includeEmojis: false,
      variations: 2,
    },
    estimatedTime: '20 minutes',
    difficulty: 'beginner',
    category: 'social-media',
  },
  {
    id: 'social-twitter',
    templateId: 'social-media',
    name: 'Twitter Thread',
    description: 'Engaging multi-tweet storytelling',
    prefilledInputs: {
      platform: 'twitter',
      tone: 'casual',
      includeHashtags: true,
      includeEmojis: true,
      threadLength: 5,
      variations: 3,
    },
    estimatedTime: '25 minutes',
    difficulty: 'intermediate',
    category: 'social-media',
  },

  // Newsletter Presets
  {
    id: 'newsletter-welcome',
    templateId: 'newsletter-series',
    name: 'Welcome Series',
    description: 'Onboarding sequence for new subscribers',
    prefilledInputs: {
      tone: 'friendly',
      seriesGoal: 'Welcome and onboard new subscribers',
      targetAudience: 'New subscribers',
      emailFrequency: 'Every 2 days',
    },
    estimatedTime: '2 hours',
    difficulty: 'beginner',
    category: 'newsletter-series',
  },
  {
    id: 'newsletter-nurture',
    templateId: 'newsletter-series',
    name: 'Lead Nurture Campaign',
    description: 'Educational content leading to conversion',
    prefilledInputs: {
      tone: 'expert',
      seriesGoal: 'Educate and convert leads',
      targetAudience: 'Qualified leads',
      emailFrequency: 'Weekly',
    },
    estimatedTime: '3 hours',
    difficulty: 'intermediate',
    category: 'newsletter-series',
  },

  // Advertising Presets
  {
    id: 'ad-facebook',
    templateId: 'advertising',
    name: 'Facebook/Instagram Ad',
    description: 'Scroll-stopping Meta ads',
    prefilledInputs: {
      platform: 'facebook-instagram',
      tone: 'persuasive',
      adObjective: 'conversions',
      targetAudience: 'Cold audience',
      headlineVariations: 5,
      ctaVariations: 5,
    },
    estimatedTime: '1 hour',
    difficulty: 'intermediate',
    category: 'advertising',
  },
  {
    id: 'ad-google',
    templateId: 'advertising',
    name: 'Google Search Ad',
    description: 'Intent-based search advertising',
    prefilledInputs: {
      platform: 'google-search',
      tone: 'professional',
      adObjective: 'conversions',
      targetAudience: 'High-intent searchers',
      headlineVariations: 10,
      ctaVariations: 3,
    },
    estimatedTime: '45 minutes',
    difficulty: 'beginner',
    category: 'advertising',
  },
  {
    id: 'ad-landing-page',
    templateId: 'advertising',
    name: 'Landing Page Copy',
    description: 'High-converting sales page',
    prefilledInputs: {
      platform: 'landing-page',
      tone: 'persuasive',
      adObjective: 'conversions',
      targetAudience: 'Warm audience',
      headlineVariations: 7,
      ctaVariations: 5,
      includeBenefits: true,
      includeTestimonials: true,
    },
    estimatedTime: '2.5 hours',
    difficulty: 'advanced',
    category: 'advertising',
  },
];

/**
 * Get presets for a specific template
 */
export function getPresetsForTemplate(templateId: string): TemplatePreset[] {
  return templatePresets.filter((preset) => preset.templateId === templateId);
}

/**
 * Get preset by ID
 */
export function getPresetById(presetId: string): TemplatePreset | undefined {
  return templatePresets.find((preset) => preset.id === presetId);
}

/**
 * Get presets by difficulty
 */
export function getPresetsByDifficulty(
  difficulty: 'beginner' | 'intermediate' | 'advanced'
): TemplatePreset[] {
  return templatePresets.filter((preset) => preset.difficulty === difficulty);
}

/**
 * Get presets by category
 */
export function getPresetsByCategory(category: string): TemplatePreset[] {
  return templatePresets.filter((preset) => preset.category === category);
}
