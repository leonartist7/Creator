// Enhanced Types with New Features

export type Theme = 'light' | 'dark';

export type TemplateId =
  | 'ebook'
  | 'online-course'
  | 'how-to-guide'
  | 'story-bestseller'
  | 'social-media'
  | 'newsletter-series'
  | 'advertising';

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

export type WritingPhase = 'outline' | 'drafting' | 'editing' | 'polishing';

export type ProjectStatus = 'draft' | 'in-progress' | 'completed' | 'archived';

export type SectionStatus = 'pending' | 'generating' | 'generated' | 'edited' | 'completed';

// ============================================
// TEMPLATE PRESETS
// ============================================
export interface TemplatePreset {
  id: string;
  templateId: TemplateId;
  name: string;
  description: string;
  icon: string;
  prefilledInputs: Record<string, any>;
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// ============================================
// GLOBAL PROJECT SETTINGS
// ============================================
export interface GlobalProjectSettings {
  tone: 'mentor' | 'friend' | 'professor' | 'storyteller' | 'expert' | 'casual' | 'professional';
  persona: string; // Custom persona description
  targetAudience: string;
  primaryGoal: string;
  brandVoice?: {
    adjectives: string[];
    avoidWords: string[];
    exampleSentences: string[];
  };
}

// ============================================
// AUTOSAVE & VERSIONING
// ============================================
export interface AutosaveConfig {
  enabled: boolean;
  intervalSeconds: number;
  maxVersions: number;
}

export interface ContentVersion {
  id: string;
  sectionId: string;
  content: string;
  createdAt: Date;
  createdBy: 'user' | 'ai';
  metadata?: {
    aiProvider?: string;
    tokensUsed?: number;
    prompt?: string;
  };
}

export interface VersionHistory {
  sectionId: string;
  versions: ContentVersion[];
  currentVersionId: string;
}

// ============================================
// SNIPPET LIBRARY
// ============================================
export interface Snippet {
  id: string;
  userId: string;
  title: string;
  content: string;
  category: 'hook' | 'cta' | 'paragraph' | 'headline' | 'transition' | 'custom';
  tags: string[];
  useCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// SMART SUGGESTIONS
// ============================================
export interface SmartSuggestion {
  id: string;
  type: 'next-action' | 'improvement' | 'consistency' | 'seo' | 'tone';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action?: {
    label: string;
    handler: string; // Function name to call
    params?: any;
  };
  dismissible: boolean;
}

export interface ProjectSuggestions {
  projectId: string;
  suggestions: SmartSuggestion[];
  generatedAt: Date;
}

// ============================================
// ANALYTICS & INSIGHTS
// ============================================
export interface ContentAnalytics {
  wordCount: number;
  characterCount: number;
  paragraphCount: number;
  sentenceCount: number;
  readingTime: number; // minutes
  readabilityScore: number; // 0-100
  readingLevel: string;
  sentiment: 'positive' | 'neutral' | 'negative' | 'mixed';
  toneConsistency: number; // 0-100
  keyPhrases: string[];
  improvements: string[];
}

// ============================================
// ENHANCED TEMPLATE CONFIG
// ============================================
export interface InputType {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'multiselect' | 'toggle' | 'range' | 'file';
  placeholder?: string;
  description?: string;
  required?: boolean;
  defaultValue?: any;
  options?: Array<{ value: string; label: string }>;
  min?: number;
  max?: number;
  accept?: string;
  multiple?: boolean;
  validation?: (value: any) => boolean | string;
  group?: string; // For grouping inputs in forms
  conditional?: {
    dependsOn: string;
    showWhen: (value: any) => boolean;
  };
}

export interface SectionConfig {
  id: string;
  title: string;
  description?: string;
  optional?: boolean;
  aiPromptTemplate: string;
  fields?: InputType[];
  subSections?: SectionConfig[];
  repeatable?: boolean;
  minInstances?: number;
  maxInstances?: number;
  generateOutlineFirst?: boolean; // New: outline-first workflow
  dependencies?: string[]; // Section IDs that must be completed first
}

export interface TemplateConfig {
  id: TemplateId;
  name: string;
  description: string;
  icon: string;
  category: string;
  color: string;
  bgGradient: string;
  inputs: InputType[];
  sections: SectionConfig[];
  aiConfig: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    systemPrompt: string;
  };
  ui?: {
    editorLayout?: 'single' | 'split' | 'sections';
    showProgress?: boolean;
    customToolbar?: string[];
  };
  presets?: TemplatePreset[]; // Pre-configured presets
  supportsOutlineMode?: boolean; // Can generate outline first
  smartSuggestions?: (project: any) => SmartSuggestion[]; // Dynamic suggestions
}

// ============================================
// ENHANCED PROJECT
// ============================================
export interface Project {
  id: string;
  templateId: TemplateId;
  title: string;
  inputs: Record<string, any>;
  sections: ProjectSection[];
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    lastSavedAt?: Date; // For autosave
    totalWords: number;
    completionPercentage: number;
    status: ProjectStatus;
    phase: WritingPhase; // New: current phase
  };
  globalSettings: GlobalProjectSettings; // New: project-wide settings
  referenceFiles?: UploadedFile[];
  learnedStyle?: {
    tone: string;
    voice: string;
    themes: string[];
    vocabulary: string[];
    sentenceStructure: string;
  };
  versionHistory?: VersionHistory[]; // New: version control
  analytics?: ContentAnalytics; // New: analytics
  linkedProjects?: string[]; // New: related projects
  tags?: string[]; // New: organization
  isFavorite?: boolean; // New: quick access
}

export interface ProjectSection {
  id: string;
  sectionConfigId: string;
  title: string;
  content: string;
  outline?: string; // New: AI-generated outline
  status: SectionStatus;
  metadata?: {
    wordCount: number;
    generatedAt?: Date;
    lastEditedAt?: Date;
    aiModel?: string;
    currentVersionId?: string; // Link to version history
  };
  subSections?: ProjectSection[];
  notes?: string; // New: user notes per section
  locked?: boolean; // New: prevent accidental edits
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

// ============================================
// EXPORT OPTIONS
// ============================================
export interface ExportOptions {
  format: 'pdf' | 'docx' | 'markdown' | 'html' | 'txt';
  includeTOC?: boolean;
  includeMetadata?: boolean;
  templateStyle?: string;
  fontSize?: number;
  fontFamily?: string;
}

export interface ExportResult {
  success: boolean;
  downloadUrl?: string;
  error?: string;
}

// ============================================
// UI STATE MANAGEMENT
// ============================================
export interface UIState {
  activeSection: string | null;
  editMode: boolean;
  zenMode: boolean;
  showSuggestions: boolean;
  showVersionHistory: boolean;
  showSnippetLibrary: boolean;
  showAnalytics: boolean;
  sidebarCollapsed: boolean;
}

// ============================================
// COLLABORATION (Future)
// ============================================
export interface Comment {
  id: string;
  sectionId: string;
  userId: string;
  content: string;
  resolved: boolean;
  createdAt: Date;
  replies?: Comment[];
}

export interface CollaborationSettings {
  enabled: boolean;
  shareLink?: string;
  permissions: 'view' | 'comment' | 'edit';
  collaborators: Array<{
    userId: string;
    role: 'owner' | 'editor' | 'viewer';
  }>;
}
