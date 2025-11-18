/**
 * Smart Suggestions Service
 * Provides context-aware suggestions to improve productivity and content quality
 */

import { Project, ProjectSection, SmartSuggestion } from '@/types/enhanced';

class SmartSuggestionsService {
  /**
   * Generate smart suggestions based on project state
   */
  generateSuggestions(
    project: Project,
    currentSection?: ProjectSection
  ): SmartSuggestion[] {
    const suggestions: SmartSuggestion[] = [];

    // Check for empty sections
    const emptySections = this.getEmptySections(project);
    if (emptySections.length > 0) {
      suggestions.push({
        id: `empty_sections_${Date.now()}`,
        type: 'next-action',
        priority: 'high',
        title: 'Complete empty sections',
        description: `You have ${emptySections.length} section(s) without content. Generate content to improve project completion.`,
        action: {
          label: 'Generate First Section',
          callback: 'navigate_to_empty_section',
          data: { sectionId: emptySections[0].id },
        },
      });
    }

    // Check project completion
    const completionPercentage = this.calculateCompletion(project);
    if (completionPercentage > 0 && completionPercentage < 100) {
      suggestions.push({
        id: `completion_${Date.now()}`,
        type: 'optimization',
        priority: 'medium',
        title: `Project ${completionPercentage}% complete`,
        description: `Keep going! You're making great progress on "${project.title}".`,
      });
    }

    // Suggest outline creation if no content exists
    if (this.isProjectEmpty(project)) {
      suggestions.push({
        id: `outline_${Date.now()}`,
        type: 'next-action',
        priority: 'high',
        title: 'Start with an outline',
        description: 'Generate a comprehensive outline before writing full content. This helps maintain structure and consistency.',
        action: {
          label: 'Generate Outline',
          callback: 'generate_outline',
        },
      });
    }

    // Check for long sections that could be split
    const longSections = this.findLongSections(project);
    if (longSections.length > 0) {
      suggestions.push({
        id: `long_sections_${Date.now()}`,
        type: 'optimization',
        priority: 'low',
        title: 'Consider splitting long sections',
        description: `${longSections.length} section(s) are quite long. Consider breaking them into smaller, more digestible parts.`,
      });
    }

    // Suggest saving snippets for frequently used content
    if (currentSection && this.hasReusableContent(currentSection)) {
      suggestions.push({
        id: `snippet_${Date.now()}`,
        type: 'productivity',
        priority: 'low',
        title: 'Save as snippet',
        description: 'This content looks reusable. Save it as a snippet for future projects.',
        action: {
          label: 'Create Snippet',
          callback: 'create_snippet',
          data: { sectionId: currentSection.id },
        },
      });
    }

    // Suggest tone consistency check
    if (project.globalSettings?.tone && this.hasMixedContent(project)) {
      suggestions.push({
        id: `tone_check_${Date.now()}`,
        type: 'quality',
        priority: 'medium',
        title: 'Check tone consistency',
        description: `Your project uses "${project.globalSettings.tone}" tone. Review all sections to ensure consistency.`,
        action: {
          label: 'Review Tone',
          callback: 'check_tone_consistency',
        },
      });
    }

    // Suggest version control for edited sections
    const editedSections = this.getEditedSections(project);
    if (editedSections.length > 0 && !project.autosaveConfig?.enabled) {
      suggestions.push({
        id: `autosave_${Date.now()}`,
        type: 'productivity',
        priority: 'medium',
        title: 'Enable autosave',
        description: "You've made several edits. Turn on autosave to never lose your work.",
        action: {
          label: 'Enable Autosave',
          callback: 'enable_autosave',
        },
      });
    }

    // Suggest export when project is complete
    if (completionPercentage === 100) {
      suggestions.push({
        id: `export_${Date.now()}`,
        type: 'next-action',
        priority: 'high',
        title: 'Project complete! Ready to export',
        description: 'All sections are complete. Export your work as PDF, DOCX, or Markdown.',
        action: {
          label: 'Export Now',
          callback: 'export_project',
        },
      });
    }

    // Suggest related templates
    if (this.shouldSuggestRelatedTemplates(project)) {
      suggestions.push({
        id: `related_${Date.now()}`,
        type: 'inspiration',
        priority: 'low',
        title: 'Create related content',
        description: `Based on your ${project.templateId}, you might want to create a newsletter or social media posts.`,
        action: {
          label: 'Browse Templates',
          callback: 'navigate_to_templates',
        },
      });
    }

    return suggestions.sort((a, b) => this.priorityWeight(a.priority) - this.priorityWeight(b.priority));
  }

  /**
   * Get sections without content
   */
  private getEmptySections(project: Project): ProjectSection[] {
    return project.sections.filter((s) => !s.content || s.content.trim().length === 0);
  }

  /**
   * Calculate project completion percentage
   */
  private calculateCompletion(project: Project): number {
    if (project.sections.length === 0) return 0;

    const completedSections = project.sections.filter(
      (s) => s.status === 'completed' || (s.content && s.content.trim().length > 0)
    );

    return Math.round((completedSections.length / project.sections.length) * 100);
  }

  /**
   * Check if project has no content
   */
  private isProjectEmpty(project: Project): boolean {
    return project.sections.every((s) => !s.content || s.content.trim().length === 0);
  }

  /**
   * Find sections with excessive word count
   */
  private findLongSections(project: Project, threshold: number = 2000): ProjectSection[] {
    return project.sections.filter((s) => {
      const wordCount = s.content ? s.content.split(/\s+/).length : 0;
      return wordCount > threshold;
    });
  }

  /**
   * Check if section has reusable content patterns
   */
  private hasReusableContent(section: ProjectSection): boolean {
    if (!section.content) return false;

    // Check for hooks, CTAs, or other common patterns
    const reusablePatterns = [
      /^(Imagine|Picture this|What if)/i, // Hooks
      /(Click here|Sign up|Get started|Learn more)/i, // CTAs
      /^(In conclusion|To summarize|The bottom line)/i, // Conclusions
    ];

    return reusablePatterns.some((pattern) => pattern.test(section.content));
  }

  /**
   * Check if project has mixed content (some generated, some edited)
   */
  private hasMixedContent(project: Project): boolean {
    const generatedCount = project.sections.filter((s) => s.status === 'generated').length;
    const editedCount = project.sections.filter((s) => s.status === 'edited').length;

    return generatedCount > 0 && editedCount > 0;
  }

  /**
   * Get sections that have been edited by user
   */
  private getEditedSections(project: Project): ProjectSection[] {
    return project.sections.filter((s) => s.status === 'edited');
  }

  /**
   * Determine if we should suggest related templates
   */
  private shouldSuggestRelatedTemplates(project: Project): boolean {
    const completionPercentage = this.calculateCompletion(project);
    return completionPercentage > 50;
  }

  /**
   * Convert priority to numeric weight for sorting
   */
  private priorityWeight(priority: 'low' | 'medium' | 'high'): number {
    const weights = { high: 1, medium: 2, low: 3 };
    return weights[priority];
  }

  /**
   * Filter suggestions by type
   */
  filterByType(
    suggestions: SmartSuggestion[],
    types: SmartSuggestion['type'][]
  ): SmartSuggestion[] {
    return suggestions.filter((s) => types.includes(s.type));
  }

  /**
   * Dismiss a suggestion (mark as seen)
   */
  dismissSuggestion(suggestions: SmartSuggestion[], suggestionId: string): SmartSuggestion[] {
    return suggestions.filter((s) => s.id !== suggestionId);
  }
}

// Export singleton instance
export const smartSuggestionsService = new SmartSuggestionsService();
