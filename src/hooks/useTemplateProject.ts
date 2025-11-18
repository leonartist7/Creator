'use client';

import { useState, useCallback } from 'react';
import {
  Project,
  ProjectSection,
  TemplateId,
  AIGenerationRequest,
} from '@/types/templates';
import { getTemplate } from '@/config/templates';
import { generateSectionContent, regenerateSectionContent } from '@/lib/ai/generator';

/**
 * Hook for managing template-based projects
 * Handles project creation, section generation, and content management
 */
export function useTemplateProject() {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  /**
   * Create a new project from a template
   */
  const createProject = useCallback(
    (templateId: TemplateId, title: string, inputs: Record<string, any>) => {
      const template = getTemplate(templateId);

      // Create initial project structure
      const newProject: Project = {
        id: `project_${Date.now()}`,
        templateId,
        title,
        inputs,
        sections: [],
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          totalWords: 0,
          completionPercentage: 0,
          status: 'draft',
        },
        referenceFiles: inputs.referenceFiles || [],
      };

      // Initialize sections from template configuration
      newProject.sections = initializeSections(template.sections, inputs);

      setCurrentProject(newProject);
      setProjects((prev) => [...prev, newProject]);

      return newProject;
    },
    []
  );

  /**
   * Generate content for a specific section
   */
  const generateSection = useCallback(
    async (sectionId: string) => {
      if (!currentProject) {
        throw new Error('No active project');
      }

      setIsGenerating(true);

      try {
        const section = findSection(currentProject.sections, sectionId);
        if (!section) {
          throw new Error(`Section ${sectionId} not found`);
        }

        // Update section status
        updateSectionStatus(sectionId, 'generating');

        const template = getTemplate(currentProject.templateId);
        const sectionConfig = findSectionConfig(
          template.sections,
          section.sectionConfigId
        );

        if (!sectionConfig) {
          throw new Error(`Section config not found`);
        }

        // Prepare AI generation request
        const request: AIGenerationRequest = {
          projectId: currentProject.id,
          sectionId,
          templateId: currentProject.templateId,
          inputs: currentProject.inputs,
          sectionConfig,
          context: {
            previousSections: getPreviousSections(currentProject.sections, sectionId),
            learnedStyle: currentProject.learnedStyle,
          },
        };

        // Generate content
        const response = await generateSectionContent(request);

        // Update section with generated content
        updateSection(sectionId, {
          content: response.content,
          status: 'generated',
          metadata: {
            ...section.metadata,
            wordCount: countWords(response.content),
            generatedAt: response.metadata?.generatedAt,
            aiModel: response.metadata?.model,
          },
        });

        // Recalculate project metadata
        recalculateProjectMetadata();

        return response;
      } catch (error) {
        console.error('Error generating section:', error);
        updateSectionStatus(sectionId, 'pending');
        throw error;
      } finally {
        setIsGenerating(false);
      }
    },
    [currentProject]
  );

  /**
   * Regenerate content for a section with variations
   */
  const regenerateSection = useCallback(
    async (
      sectionId: string,
      variation?: 'expand' | 'shorten' | 'change-tone'
    ) => {
      if (!currentProject) return;

      setIsGenerating(true);

      try {
        const section = findSection(currentProject.sections, sectionId);
        if (!section) return;

        updateSectionStatus(sectionId, 'generating');

        const template = getTemplate(currentProject.templateId);
        const sectionConfig = findSectionConfig(
          template.sections,
          section.sectionConfigId
        );

        if (!sectionConfig) return;

        const request: AIGenerationRequest = {
          projectId: currentProject.id,
          sectionId,
          templateId: currentProject.templateId,
          inputs: currentProject.inputs,
          sectionConfig,
          context: {
            previousSections: getPreviousSections(currentProject.sections, sectionId),
            learnedStyle: currentProject.learnedStyle,
          },
        };

        const response = await regenerateSectionContent(request, variation);

        updateSection(sectionId, {
          content: response.content,
          status: 'generated',
          metadata: {
            ...section.metadata,
            wordCount: countWords(response.content),
            generatedAt: response.metadata?.generatedAt,
            lastEditedAt: new Date(),
          },
        });

        recalculateProjectMetadata();

        return response;
      } catch (error) {
        console.error('Error regenerating section:', error);
        throw error;
      } finally {
        setIsGenerating(false);
      }
    },
    [currentProject]
  );

  /**
   * Update section content manually (user edits)
   */
  const updateSectionContent = useCallback(
    (sectionId: string, content: string) => {
      updateSection(sectionId, {
        content,
        status: 'edited',
        metadata: {
          wordCount: countWords(content),
          lastEditedAt: new Date(),
        },
      });

      recalculateProjectMetadata();
    },
    []
  );

  /**
   * Mark section as completed
   */
  const markSectionComplete = useCallback((sectionId: string) => {
    updateSectionStatus(sectionId, 'completed');
    recalculateProjectMetadata();
  }, []);

  /**
   * Generate all sections sequentially
   */
  const generateAllSections = useCallback(async () => {
    if (!currentProject) return;

    const sectionsToGenerate = currentProject.sections.filter(
      (s) => s.status === 'pending' || s.status === 'generated'
    );

    for (const section of sectionsToGenerate) {
      await generateSection(section.id);
    }
  }, [currentProject, generateSection]);

  // Helper functions

  function updateSection(sectionId: string, updates: Partial<ProjectSection>) {
    setCurrentProject((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        sections: updateSectionInTree(prev.sections, sectionId, updates),
        metadata: {
          ...prev.metadata,
          updatedAt: new Date(),
        },
      };
    });
  }

  function updateSectionStatus(
    sectionId: string,
    status: ProjectSection['status']
  ) {
    updateSection(sectionId, { status });
  }

  function recalculateProjectMetadata() {
    setCurrentProject((prev) => {
      if (!prev) return prev;

      const totalWords = calculateTotalWords(prev.sections);
      const completionPercentage = calculateCompletion(prev.sections);

      return {
        ...prev,
        metadata: {
          ...prev.metadata,
          totalWords,
          completionPercentage,
          updatedAt: new Date(),
        },
      };
    });
  }

  return {
    currentProject,
    projects,
    isGenerating,
    createProject,
    generateSection,
    regenerateSection,
    updateSectionContent,
    markSectionComplete,
    generateAllSections,
  };
}

// Helper functions

function initializeSections(
  sectionConfigs: any[],
  inputs: Record<string, any>
): ProjectSection[] {
  const sections: ProjectSection[] = [];

  for (const config of sectionConfigs) {
    // Handle repeatable sections (like chapters)
    if (config.repeatable) {
      const count = inputs[`${config.id}Count`] || config.minInstances || 1;

      for (let i = 0; i < count; i++) {
        const section: ProjectSection = {
          id: `${config.id}_${i}`,
          sectionConfigId: config.id,
          title: config.title.replace('{{index}}', String(i + 1)),
          content: '',
          status: 'pending',
          metadata: {
            wordCount: 0,
          },
        };

        // Handle subsections
        if (config.subSections) {
          section.subSections = initializeSections(config.subSections, inputs);
        }

        sections.push(section);
      }
    }
    // Handle optional sections
    else if (config.optional) {
      const shouldInclude = inputs[`include${capitalize(config.id)}`];

      if (shouldInclude !== false) {
        sections.push({
          id: config.id,
          sectionConfigId: config.id,
          title: config.title,
          content: '',
          status: 'pending',
          metadata: {
            wordCount: 0,
          },
        });
      }
    }
    // Handle regular sections
    else {
      const section: ProjectSection = {
        id: config.id,
        sectionConfigId: config.id,
        title: config.title,
        content: '',
        status: 'pending',
        metadata: {
          wordCount: 0,
        },
      };

      if (config.subSections) {
        section.subSections = initializeSections(config.subSections, inputs);
      }

      sections.push(section);
    }
  }

  return sections;
}

function findSection(
  sections: ProjectSection[],
  sectionId: string
): ProjectSection | null {
  for (const section of sections) {
    if (section.id === sectionId) return section;
    if (section.subSections) {
      const found = findSection(section.subSections, sectionId);
      if (found) return found;
    }
  }
  return null;
}

function findSectionConfig(configs: any[], configId: string): any {
  for (const config of configs) {
    if (config.id === configId) return config;
    if (config.subSections) {
      const found = findSectionConfig(config.subSections, configId);
      if (found) return found;
    }
  }
  return null;
}

function updateSectionInTree(
  sections: ProjectSection[],
  sectionId: string,
  updates: Partial<ProjectSection>
): ProjectSection[] {
  return sections.map((section) => {
    if (section.id === sectionId) {
      return { ...section, ...updates };
    }
    if (section.subSections) {
      return {
        ...section,
        subSections: updateSectionInTree(section.subSections, sectionId, updates),
      };
    }
    return section;
  });
}

function getPreviousSections(
  sections: ProjectSection[],
  currentSectionId: string
): ProjectSection[] {
  const previous: ProjectSection[] = [];

  for (const section of sections) {
    if (section.id === currentSectionId) break;
    if (section.content) {
      previous.push(section);
    }
  }

  return previous;
}

function calculateTotalWords(sections: ProjectSection[]): number {
  let total = 0;

  for (const section of sections) {
    total += section.metadata?.wordCount || 0;
    if (section.subSections) {
      total += calculateTotalWords(section.subSections);
    }
  }

  return total;
}

function calculateCompletion(sections: ProjectSection[]): number {
  let completed = 0;
  let total = 0;

  function count(secs: ProjectSection[]) {
    for (const section of secs) {
      total++;
      if (section.status === 'completed' || section.status === 'generated') {
        completed++;
      }
      if (section.subSections) {
        count(section.subSections);
      }
    }
  }

  count(sections);

  return total > 0 ? Math.round((completed / total) * 100) : 0;
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
