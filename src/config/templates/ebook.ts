import { TemplateConfig } from '@/types/templates';

export const ebookTemplate: TemplateConfig = {
  id: 'ebook',
  name: 'E-Book',
  description: 'Comprehensive book with structured chapters and professional formatting',
  icon: '📚',
  category: 'Long-form Content',
  color: 'amber',
  bgGradient: 'from-amber-50 to-orange-50',

  inputs: [
    {
      id: 'subject',
      label: 'Book Subject / Main Topic',
      type: 'text',
      placeholder: 'e.g., "The Ultimate Guide to Digital Marketing"',
      description: 'The main subject or topic of your book',
      required: true,
    },
    {
      id: 'targetAudience',
      label: 'Target Audience',
      type: 'text',
      placeholder: 'e.g., "Small business owners and entrepreneurs"',
      description: 'Who is this book for?',
      required: true,
    },
    {
      id: 'tone',
      label: 'Tone & Style',
      type: 'select',
      options: [
        { value: 'professional', label: 'Professional' },
        { value: 'conversational', label: 'Conversational' },
        { value: 'academic', label: 'Academic' },
        { value: 'inspiring', label: 'Inspiring' },
        { value: 'practical', label: 'Practical' },
      ],
      defaultValue: 'professional',
      required: true,
    },
    {
      id: 'chapterCount',
      label: 'Number of Chapters',
      type: 'range',
      min: 3,
      max: 20,
      defaultValue: 8,
      description: 'How many chapters should your book have?',
      required: true,
    },
    {
      id: 'includeIntroduction',
      label: 'Include Introduction',
      type: 'toggle',
      defaultValue: true,
      description: 'Add an introduction section to your book',
    },
    {
      id: 'includeConclusion',
      label: 'Include Conclusion',
      type: 'toggle',
      defaultValue: true,
      description: 'Add a conclusion section to your book',
    },
  ],

  sections: [
    {
      id: 'introduction',
      title: 'Introduction',
      description: 'Opening section that hooks the reader',
      optional: true,
      aiPromptTemplate: `Write a compelling introduction for an ebook about {{subject}}.
Target audience: {{targetAudience}}
Tone: {{tone}}

The introduction should:
- Hook the reader with an engaging opening
- Explain what the book covers
- Set expectations for what readers will learn
- Establish credibility and relevance

Length: 800-1200 words`,
    },
    {
      id: 'chapters',
      title: 'Chapter {{index}}',
      description: 'Main content chapters',
      repeatable: true,
      minInstances: 3,
      maxInstances: 20,
      fields: [
        {
          id: 'chapterTitle',
          label: 'Chapter Title',
          type: 'text',
          placeholder: 'Enter chapter title',
        },
        {
          id: 'chapterFocus',
          label: 'Chapter Focus',
          type: 'textarea',
          placeholder: 'What should this chapter cover?',
        },
      ],
      aiPromptTemplate: `Write Chapter {{index}} for an ebook about {{subject}}.

Chapter Title: {{chapterTitle}}
Chapter Focus: {{chapterFocus}}
Target Audience: {{targetAudience}}
Tone: {{tone}}

The chapter should:
- Have a clear introduction
- Cover the main points in depth
- Include practical examples or case studies
- End with key takeaways
- Flow naturally to the next chapter

Length: 2000-3000 words`,
    },
    {
      id: 'conclusion',
      title: 'Conclusion',
      description: 'Closing section that summarizes key points',
      optional: true,
      aiPromptTemplate: `Write a powerful conclusion for an ebook about {{subject}}.
Target audience: {{targetAudience}}
Tone: {{tone}}

The conclusion should:
- Summarize the key points from all chapters
- Reinforce the main message
- Provide actionable next steps
- End with an inspiring call-to-action

Length: 600-900 words`,
    },
  ],

  aiConfig: {
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 3000,
    systemPrompt: `You are an expert book writer who creates engaging, well-structured content.
Your writing is clear, informative, and tailored to the target audience.
You use examples, stories, and practical insights to make concepts memorable.`,
  },

  ui: {
    editorLayout: 'sections',
    showProgress: true,
    customToolbar: ['generate', 'expand', 'shorten', 'rewrite-tone'],
  },
};
