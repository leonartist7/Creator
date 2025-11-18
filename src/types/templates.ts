// Enhanced Template System Types

export type TemplateId =
  | 'ebook'
  | 'online-course'
  | 'how-to-guide'
  | 'story-bestseller'
  | 'social-media'
  | 'newsletter-series'
  | 'advertising';

export type InputType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'multiselect'
  | 'toggle'
  | 'range'
  | 'file';

export interface TemplateInput {
  id: string;
  label: string;
  type: InputType;
  placeholder?: string;
  description?: string;
  required?: boolean;
  defaultValue?: any;
  options?: Array<{ value: string; label: string }>;
  min?: number;
  max?: number;
  accept?: string; // For file inputs
  multiple?: boolean; // For file inputs
  validation?: (value: any) => boolean | string;
}

export interface SectionConfig {
  id: string;
  title: string;
  description?: string;
  optional?: boolean;
  aiPromptTemplate: string; // Template for AI generation
  fields?: TemplateInput[]; // Additional fields specific to this section
  subSections?: SectionConfig[]; // For nested structures
  repeatable?: boolean; // Can create multiple instances (e.g., chapters)
  minInstances?: number;
  maxInstances?: number;
}

export interface TemplateConfig {
  id: TemplateId;
  name: string;
  description: string;
  icon: string;
  category: string;
  color: string;
  bgGradient: string;

  // User inputs shown in the project creation form
  inputs: TemplateInput[];

  // Structure definition
  sections: SectionConfig[];

  // AI behavior configuration
  aiConfig: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    systemPrompt: string;
  };

  // UI customization
  ui?: {
    editorLayout?: 'single' | 'split' | 'sections';
    showProgress?: boolean;
    customToolbar?: string[];
  };
}

export interface ProjectSection {
  id: string;
  sectionConfigId: string;
  title: string;
  content: string;
  status: 'pending' | 'generating' | 'generated' | 'edited' | 'completed';
  metadata?: {
    wordCount: number;
    generatedAt?: Date;
    lastEditedAt?: Date;
    aiModel?: string;
  };
  subSections?: ProjectSection[];
}

export interface Project {
  id: string;
  templateId: TemplateId;
  title: string;

  // User input values
  inputs: Record<string, any>;

  // Generated structure
  sections: ProjectSection[];

  // Project metadata
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    totalWords: number;
    completionPercentage: number;
    status: 'draft' | 'in-progress' | 'completed';
  };

  // Optional: Reference files (for Story template)
  referenceFiles?: UploadedFile[];

  // Optional: Learned style (from reference analysis)
  learnedStyle?: {
    tone: string;
    voice: string;
    themes: string[];
    vocabulary: string[];
    sentenceStructure: string;
  };
}

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: Date;
  analysis?: {
    extractedText?: string;
    style?: string;
    tone?: string;
    themes?: string[];
  };
}

export interface AIGenerationRequest {
  projectId: string;
  sectionId: string;
  templateId: TemplateId;
  inputs: Record<string, any>;
  sectionConfig: SectionConfig;
  context?: {
    previousSections?: ProjectSection[];
    learnedStyle?: Project['learnedStyle'];
  };
}

export interface AIGenerationResponse {
  content: string;
  metadata?: {
    model: string;
    tokensUsed: number;
    generatedAt: Date;
  };
}

export type GenerateContentFunction = (
  request: AIGenerationRequest
) => Promise<AIGenerationResponse>;

export type AnalyzeFileFunction = (
  file: File
) => Promise<UploadedFile['analysis']>;
