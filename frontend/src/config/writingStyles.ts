/**
 * Comprehensive Writing Styles & Tones Configuration
 * Used across AI tools for consistent style application
 */

export interface WritingStyle {
  value: string;
  label: string;
  description: string;
  icon: string;
  category: 'business' | 'creative' | 'marketing' | 'educational' | 'personal';
}

export interface WritingTone {
  value: string;
  label: string;
  description: string;
  icon: string;
}

export const WRITING_STYLES: WritingStyle[] = [
  // Business Styles
  {
    value: 'professional',
    label: 'Professional & Formal',
    description: 'Corporate, polished, business-appropriate',
    icon: '💼',
    category: 'business',
  },
  {
    value: 'executive',
    label: 'Executive Brief',
    description: 'Concise, strategic, leadership-focused',
    icon: '🎯',
    category: 'business',
  },
  {
    value: 'technical',
    label: 'Technical & Detailed',
    description: 'Precise, data-driven, expert-level',
    icon: '⚙️',
    category: 'business',
  },
  {
    value: 'report',
    label: 'Report Style',
    description: 'Structured, analytical, evidence-based',
    icon: '📊',
    category: 'business',
  },

  // Creative Styles
  {
    value: 'storytelling',
    label: 'Storytelling & Engaging',
    description: 'Narrative, captivating, emotional connection',
    icon: '📖',
    category: 'creative',
  },
  {
    value: 'conversational',
    label: 'Conversational & Friendly',
    description: 'Warm, approachable, natural dialogue',
    icon: '💬',
    category: 'creative',
  },
  {
    value: 'poetic',
    label: 'Poetic & Expressive',
    description: 'Lyrical, metaphorical, artistic',
    icon: '✨',
    category: 'creative',
  },
  {
    value: 'humorous',
    label: 'Humorous & Witty',
    description: 'Fun, entertaining, light-hearted',
    icon: '😄',
    category: 'creative',
  },

  // Marketing Styles
  {
    value: 'persuasive',
    label: 'Persuasive & Sales-Oriented',
    description: 'Compelling, benefit-focused, action-driven',
    icon: '🚀',
    category: 'marketing',
  },
  {
    value: 'viral',
    label: 'Viral Social Media',
    description: 'Catchy, shareable, attention-grabbing',
    icon: '🔥',
    category: 'marketing',
  },
  {
    value: 'seo',
    label: 'SEO Optimized',
    description: 'Search-friendly, keyword-rich, discoverable',
    icon: '🔍',
    category: 'marketing',
  },
  {
    value: 'landing',
    label: 'Landing Page Copy',
    description: 'Conversion-focused, clear value, urgency',
    icon: '💰',
    category: 'marketing',
  },

  // Educational Styles
  {
    value: 'educational',
    label: 'Educational & Informative',
    description: 'Clear, structured, knowledge-sharing',
    icon: '🎓',
    category: 'educational',
  },
  {
    value: 'tutorial',
    label: 'Tutorial & How-To',
    description: 'Step-by-step, actionable, beginner-friendly',
    icon: '📝',
    category: 'educational',
  },
  {
    value: 'academic',
    label: 'Academic & Scholarly',
    description: 'Research-based, formal, cited',
    icon: '📚',
    category: 'educational',
  },

  // Personal Styles
  {
    value: 'blog',
    label: 'Blog & Opinion',
    description: 'Personal, authentic, thought-provoking',
    icon: '✍️',
    category: 'personal',
  },
  {
    value: 'inspirational',
    label: 'Inspirational & Motivational',
    description: 'Uplifting, empowering, transformative',
    icon: '🌟',
    category: 'personal',
  },
  {
    value: 'minimalist',
    label: 'Minimalist & Clear',
    description: 'Simple, direct, no fluff',
    icon: '⚡',
    category: 'personal',
  },
];

export const WRITING_TONES: WritingTone[] = [
  {
    value: 'neutral',
    label: 'Neutral',
    description: 'Balanced, objective, no strong emotion',
    icon: '⚖️',
  },
  {
    value: 'formal',
    label: 'Formal',
    description: 'Professional, polished, respectful',
    icon: '🎩',
  },
  {
    value: 'casual',
    label: 'Casual',
    description: 'Relaxed, informal, everyday language',
    icon: '👕',
  },
  {
    value: 'friendly',
    label: 'Friendly',
    description: 'Warm, welcoming, personable',
    icon: '🤝',
  },
  {
    value: 'enthusiastic',
    label: 'Enthusiastic',
    description: 'Excited, energetic, passionate',
    icon: '🎉',
  },
  {
    value: 'confident',
    label: 'Confident',
    description: 'Assertive, authoritative, bold',
    icon: '💪',
  },
  {
    value: 'empathetic',
    label: 'Empathetic',
    description: 'Understanding, compassionate, supportive',
    icon: '💙',
  },
  {
    value: 'urgent',
    label: 'Urgent',
    description: 'Time-sensitive, action-oriented, pressing',
    icon: '⏰',
  },
  {
    value: 'playful',
    label: 'Playful',
    description: 'Fun, witty, light-hearted',
    icon: '🎮',
  },
  {
    value: 'serious',
    label: 'Serious',
    description: 'Grave, important, no-nonsense',
    icon: '🔒',
  },
];

export const getStylesByCategory = (category: WritingStyle['category']) => {
  return WRITING_STYLES.filter((style) => style.category === category);
};

export const getStyleByValue = (value: string) => {
  return WRITING_STYLES.find((style) => style.value === value);
};

export const getToneByValue = (value: string) => {
  return WRITING_TONES.find((tone) => tone.value === value);
};

export const STYLE_CATEGORIES = [
  { value: 'business', label: 'Business', icon: '💼' },
  { value: 'creative', label: 'Creative', icon: '🎨' },
  { value: 'marketing', label: 'Marketing', icon: '📢' },
  { value: 'educational', label: 'Educational', icon: '🎓' },
  { value: 'personal', label: 'Personal', icon: '✨' },
] as const;
