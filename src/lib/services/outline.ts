/**
 * Outline-First Workflow Service
 * Generate and approve outlines before writing full content
 */

import { Project, ProjectSection } from '@/types/enhanced';
import { generateContent } from '@/lib/ai/generator';

interface OutlineItem {
  id: string;
  title: string;
  description: string;
  keyPoints: string[];
  estimatedWords: number;
  approved: boolean;
}

interface SectionOutline {
  sectionId: string;
  outline: OutlineItem;
}

class OutlineWorkflowService {
  /**
   * Generate outline for a single section
   */
  async generateSectionOutline(
    section: ProjectSection,
    project: Project,
    provider: 'openai' | 'anthropic' = 'openai'
  ): Promise<OutlineItem> {
    const systemPrompt = `You are an expert content outliner. Create a detailed outline for the requested section.
Return a JSON object with this exact structure:
{
  "title": "Section title",
  "description": "Brief 1-2 sentence overview",
  "keyPoints": ["Point 1", "Point 2", "Point 3"],
  "estimatedWords": 500
}`;

    const userPrompt = `Create an outline for this section:

Section Title: ${section.title}
Project: ${project.title}
${project.globalSettings?.tone ? `Tone: ${project.globalSettings.tone}` : ''}
${project.globalSettings?.persona ? `Target Audience: ${project.globalSettings.persona}` : ''}

Generate a comprehensive outline with 3-5 key points that should be covered in this section.`;

    try {
      const response = await generateContent(
        userPrompt,
        systemPrompt,
        provider,
        0.7,
        500
      );

      // Parse the AI response
      const outlineData = JSON.parse(response.content);

      return {
        id: `outline_${section.id}_${Date.now()}`,
        title: outlineData.title || section.title,
        description: outlineData.description || '',
        keyPoints: outlineData.keyPoints || [],
        estimatedWords: outlineData.estimatedWords || 500,
        approved: false,
      };
    } catch (error) {
      console.error('[OutlineWorkflow] Failed to generate outline:', error);

      // Return a fallback outline structure
      return {
        id: `outline_${section.id}_${Date.now()}`,
        title: section.title,
        description: 'Outline generation failed. Please try again.',
        keyPoints: [],
        estimatedWords: 500,
        approved: false,
      };
    }
  }

  /**
   * Generate outlines for all sections in a project
   */
  async generateProjectOutlines(
    project: Project,
    provider: 'openai' | 'anthropic' = 'openai'
  ): Promise<SectionOutline[]> {
    const outlines: SectionOutline[] = [];

    for (const section of project.sections) {
      const outline = await this.generateSectionOutline(section, project, provider);
      outlines.push({
        sectionId: section.id,
        outline,
      });
    }

    return outlines;
  }

  /**
   * Generate full content from approved outline
   */
  async generateFromOutline(
    outline: OutlineItem,
    section: ProjectSection,
    project: Project,
    provider: 'openai' | 'anthropic' = 'openai'
  ): Promise<string> {
    const systemPrompt = `You are an expert content writer. Write engaging, well-structured content based on the provided outline.

${project.globalSettings?.tone ? `Tone: ${project.globalSettings.tone}` : ''}
${project.globalSettings?.persona ? `Write for: ${project.globalSettings.persona}` : ''}
${project.globalSettings?.brandVoice ? `Brand Voice: ${project.globalSettings.brandVoice.adjectives.join(', ')}` : ''}

Write clear, compelling content that covers all key points from the outline.`;

    const userPrompt = `Write content for this section based on the approved outline:

Title: ${outline.title}
Description: ${outline.description}

Key Points to Cover:
${outline.keyPoints.map((point, i) => `${i + 1}. ${point}`).join('\n')}

Target Word Count: ${outline.estimatedWords} words

Write the complete section content now.`;

    try {
      const response = await generateContent(
        userPrompt,
        systemPrompt,
        provider,
        0.7,
        outline.estimatedWords * 2 // Allow extra tokens for longer content
      );

      return response.content;
    } catch (error) {
      console.error('[OutlineWorkflow] Failed to generate content from outline:', error);
      throw new Error('Failed to generate content from outline');
    }
  }

  /**
   * Edit outline (user modifies key points)
   */
  editOutline(
    outline: OutlineItem,
    changes: Partial<Pick<OutlineItem, 'title' | 'description' | 'keyPoints' | 'estimatedWords'>>
  ): OutlineItem {
    return {
      ...outline,
      ...changes,
      approved: false, // Reset approval when edited
    };
  }

  /**
   * Approve outline (user confirms outline is good)
   */
  approveOutline(outline: OutlineItem): OutlineItem {
    return {
      ...outline,
      approved: true,
    };
  }

  /**
   * Expand outline with more detail
   */
  async expandOutline(
    outline: OutlineItem,
    provider: 'openai' | 'anthropic' = 'openai'
  ): Promise<OutlineItem> {
    const systemPrompt = `You are an expert content outliner. Expand the provided outline with more detailed key points.
Return a JSON object with the same structure but with more comprehensive key points.`;

    const userPrompt = `Expand this outline with more detailed key points:

Title: ${outline.title}
Current Description: ${outline.description}
Current Key Points:
${outline.keyPoints.map((point, i) => `${i + 1}. ${point}`).join('\n')}

Add 2-3 more key points with specific details and subtopics.`;

    try {
      const response = await generateContent(
        userPrompt,
        systemPrompt,
        provider,
        0.7,
        500
      );

      const expandedData = JSON.parse(response.content);

      return {
        ...outline,
        keyPoints: expandedData.keyPoints || outline.keyPoints,
        description: expandedData.description || outline.description,
        estimatedWords: expandedData.estimatedWords || outline.estimatedWords,
        approved: false, // Reset approval after expansion
      };
    } catch (error) {
      console.error('[OutlineWorkflow] Failed to expand outline:', error);
      return outline; // Return original on error
    }
  }

  /**
   * Generate outline summary for entire project
   */
  generateProjectSummary(outlines: SectionOutline[]): {
    totalSections: number;
    approvedSections: number;
    totalEstimatedWords: number;
    completionPercentage: number;
  } {
    const totalSections = outlines.length;
    const approvedSections = outlines.filter((o) => o.outline.approved).length;
    const totalEstimatedWords = outlines.reduce((sum, o) => sum + o.outline.estimatedWords, 0);
    const completionPercentage = totalSections > 0
      ? Math.round((approvedSections / totalSections) * 100)
      : 0;

    return {
      totalSections,
      approvedSections,
      totalEstimatedWords,
      completionPercentage,
    };
  }

  /**
   * Batch approve all outlines
   */
  approveAllOutlines(outlines: SectionOutline[]): SectionOutline[] {
    return outlines.map((sectionOutline) => ({
      ...sectionOutline,
      outline: this.approveOutline(sectionOutline.outline),
    }));
  }

  /**
   * Generate content for all approved outlines
   */
  async generateAllApprovedContent(
    outlines: SectionOutline[],
    project: Project,
    provider: 'openai' | 'anthropic' = 'openai',
    onProgress?: (sectionId: string, content: string) => void
  ): Promise<Map<string, string>> {
    const contentMap = new Map<string, string>();

    const approvedOutlines = outlines.filter((o) => o.outline.approved);

    for (const sectionOutline of approvedOutlines) {
      const section = project.sections.find((s) => s.id === sectionOutline.sectionId);

      if (!section) continue;

      try {
        const content = await this.generateFromOutline(
          sectionOutline.outline,
          section,
          project,
          provider
        );

        contentMap.set(sectionOutline.sectionId, content);

        // Call progress callback if provided
        if (onProgress) {
          onProgress(sectionOutline.sectionId, content);
        }
      } catch (error) {
        console.error(`[OutlineWorkflow] Failed to generate content for section ${sectionOutline.sectionId}:`, error);
      }
    }

    return contentMap;
  }

  /**
   * Validate outline completeness
   */
  validateOutline(outline: OutlineItem): { valid: boolean; issues: string[] } {
    const issues: string[] = [];

    if (!outline.title || outline.title.trim().length === 0) {
      issues.push('Title is required');
    }

    if (!outline.description || outline.description.trim().length < 10) {
      issues.push('Description should be at least 10 characters');
    }

    if (outline.keyPoints.length < 2) {
      issues.push('At least 2 key points are required');
    }

    if (outline.estimatedWords < 100) {
      issues.push('Estimated word count should be at least 100 words');
    }

    return {
      valid: issues.length === 0,
      issues,
    };
  }
}

// Export singleton instance
export const outlineWorkflowService = new OutlineWorkflowService();
