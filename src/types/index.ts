// Core type definitions for AI Writing App

export type Theme = 'light' | 'dark';

export type TemplateType =
  | 'ebook'
  | 'blog'
  | 'social'
  | 'poetry'
  | 'screenplay'
  | 'research'
  | 'newsletter';

export type AIAction =
  | 'brainstorm'
  | 'grammar'
  | 'translate'
  | 'paraphrase'
  | 'expand'
  | 'shorten'
  | 'fun'
  | 'formal'
  | 'academic'
  | 'playful'
  | 'emotional'
  | 'statistical'
  | 'creative'
  | 'tone';

export type WritingPhase = 'drafting' | 'editing' | 'polishing';

export interface TemplateConfig {
  id: TemplateType;
  name: string;
  description: string;
  icon: string;
  color: string;
  bgGradient: string;
  sidebarTools: SidebarTool[];
  aiSuggestions: string[];
}

export interface SidebarTool {
  id: string;
  label: string;
  icon: string;
  action: string;
}

export interface Project {
  id: string;
  title: string;
  template: TemplateType;
  content: string;
  sections: Section[];
  metadata: ProjectMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface Section {
  id: string;
  title: string;
  content: string;
  completed: boolean;
  wordCount: number;
}

export interface ProjectMetadata {
  totalWords: number;
  completionPercentage: number;
  clarityScore: number;
  creativityScore: number;
  coherenceScore: number;
  readingLevel: string;
  suggestedNextSection?: string;
  tone: string;
}

export interface TextSelection {
  text: string;
  startOffset: number;
  endOffset: number;
  position: { x: number; y: number };
}

export interface VoiceToTextSettings {
  enabled: boolean;
  autoImprove: boolean;
  removeFiller: boolean;
  tone: 'neutral' | 'formal' | 'casual' | 'creative';
}
