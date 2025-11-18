'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Project, ProjectMetadata, Section } from '@/types';

interface ProjectContextType {
  currentProject: Project | null;
  projects: Project[];
  createProject: (title: string, template: any) => void;
  updateProjectContent: (content: string) => void;
  updateProjectMetadata: (metadata: Partial<ProjectMetadata>) => void;
  addSection: (section: Section) => void;
  calculateProjectStats: () => void;
  zenMode: boolean;
  toggleZenMode: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [zenMode, setZenMode] = useState(false);

  const createProject = useCallback((title: string, template: any) => {
    const newProject: Project = {
      id: `project_${Date.now()}`,
      title,
      template,
      content: '',
      sections: [],
      metadata: {
        totalWords: 0,
        completionPercentage: 0,
        clarityScore: 0,
        creativityScore: 0,
        coherenceScore: 0,
        readingLevel: 'Intermediate',
        tone: 'Neutral',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setCurrentProject(newProject);
    setProjects((prev) => [...prev, newProject]);
  }, []);

  const updateProjectContent = useCallback((content: string) => {
    if (!currentProject) return;

    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

    setCurrentProject((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        content,
        metadata: {
          ...prev.metadata,
          totalWords: wordCount,
        },
        updatedAt: new Date(),
      };
    });
  }, [currentProject]);

  const updateProjectMetadata = useCallback((metadata: Partial<ProjectMetadata>) => {
    setCurrentProject((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        metadata: {
          ...prev.metadata,
          ...metadata,
        },
      };
    });
  }, []);

  const addSection = useCallback((section: Section) => {
    setCurrentProject((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        sections: [...prev.sections, section],
      };
    });
  }, []);

  const calculateProjectStats = useCallback(() => {
    if (!currentProject) return;

    // Simulate AI analysis scores (in real app, this would call AI API)
    const clarityScore = Math.floor(Math.random() * 30) + 70;
    const creativityScore = Math.floor(Math.random() * 30) + 70;
    const coherenceScore = Math.floor(Math.random() * 30) + 70;

    const totalSections = currentProject.sections.length || 1;
    const completedSections = currentProject.sections.filter(s => s.completed).length;
    const completionPercentage = Math.floor((completedSections / totalSections) * 100);

    updateProjectMetadata({
      clarityScore,
      creativityScore,
      coherenceScore,
      completionPercentage,
    });
  }, [currentProject, updateProjectMetadata]);

  const toggleZenMode = useCallback(() => {
    setZenMode((prev) => !prev);
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        currentProject,
        projects,
        createProject,
        updateProjectContent,
        updateProjectMetadata,
        addSection,
        calculateProjectStats,
        zenMode,
        toggleZenMode,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within ProjectProvider');
  }
  return context;
}
