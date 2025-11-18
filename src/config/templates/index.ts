import { TemplateConfig, TemplateId } from '@/types/templates';
import { ebookTemplate } from './ebook';
import { onlineCourseTemplate } from './online-course';
import { howToGuideTemplate } from './how-to-guide';
import { storyBestsellerTemplate } from './story-bestseller';
import { socialMediaTemplate } from './social-media';
import { newsletterSeriesTemplate } from './newsletter-series';
import { advertisingTemplate } from './advertising';

/**
 * Central template registry
 * All templates are defined here for easy access and type safety
 */
export const TEMPLATES: Record<TemplateId, TemplateConfig> = {
  'ebook': ebookTemplate,
  'online-course': onlineCourseTemplate,
  'how-to-guide': howToGuideTemplate,
  'story-bestseller': storyBestsellerTemplate,
  'social-media': socialMediaTemplate,
  'newsletter-series': newsletterSeriesTemplate,
  'advertising': advertisingTemplate,
};

/**
 * Get a template configuration by ID
 */
export function getTemplate(id: TemplateId): TemplateConfig {
  const template = TEMPLATES[id];
  if (!template) {
    throw new Error(`Template with ID "${id}" not found`);
  }
  return template;
}

/**
 * Get all available templates
 */
export function getAllTemplates(): TemplateConfig[] {
  return Object.values(TEMPLATES);
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: string): TemplateConfig[] {
  return getAllTemplates().filter((t) => t.category === category);
}

/**
 * Get all unique categories
 */
export function getCategories(): string[] {
  const categories = new Set(getAllTemplates().map((t) => t.category));
  return Array.from(categories);
}
