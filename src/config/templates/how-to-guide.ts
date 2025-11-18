import { TemplateConfig } from '@/types/templates';

export const howToGuideTemplate: TemplateConfig = {
  id: 'how-to-guide',
  name: 'How-To Guide',
  description: 'Step-by-step instructional guide with tips and tricks',
  icon: '📝',
  category: 'Instructional',
  color: 'green',
  bgGradient: 'from-green-50 to-emerald-50',

  inputs: [
    {
      id: 'title',
      label: 'Guide Title (How to...)',
      type: 'text',
      placeholder: 'e.g., "How to Build a Website from Scratch"',
      required: true,
    },
    {
      id: 'targetAudience',
      label: 'Target Audience',
      type: 'text',
      placeholder: 'e.g., "Complete beginners with no coding experience"',
      required: true,
    },
    {
      id: 'stepCount',
      label: 'Number of Steps',
      type: 'range',
      min: 3,
      max: 15,
      defaultValue: 7,
      description: 'How many main steps are in your guide?',
      required: true,
    },
    {
      id: 'difficulty',
      label: 'Difficulty Level',
      type: 'select',
      options: [
        { value: 'beginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' },
      ],
      defaultValue: 'beginner',
    },
  ],

  sections: [
    {
      id: 'introduction',
      title: 'Introduction',
      description: 'Overview of what readers will learn',
      aiPromptTemplate: `Write an introduction for a how-to guide titled "{{title}}".
Target Audience: {{targetAudience}}
Difficulty: {{difficulty}}

The introduction should:
- Explain what the guide will teach
- Mention who it's for and what they'll achieve
- List any prerequisites or requirements
- Set expectations for time and effort needed

Length: 200-350 words`,
    },
    {
      id: 'steps',
      title: 'Step {{index}}',
      description: 'Individual step instructions',
      repeatable: true,
      minInstances: 3,
      maxInstances: 15,
      fields: [
        {
          id: 'stepTitle',
          label: 'Step Title',
          type: 'text',
          placeholder: 'Enter step title',
        },
        {
          id: 'stepDescription',
          label: 'What does this step accomplish?',
          type: 'textarea',
          placeholder: 'Brief description of this step',
        },
      ],
      aiPromptTemplate: `Write Step {{index}} for the guide "{{title}}".

Step Title: {{stepTitle}}
Step Description: {{stepDescription}}
Target Audience: {{targetAudience}}
Difficulty: {{difficulty}}

Generate:
- Clear, numbered sub-steps if needed
- Detailed explanations for each action
- What the result should look like
- Common mistakes to avoid
- Visual cues or screenshots needed (just describe where they'd go)

Length: 300-500 words per step
Use clear, action-oriented language.`,
    },
    {
      id: 'tips',
      title: 'Tips & Tricks',
      description: 'Pro tips and best practices',
      aiPromptTemplate: `Create a "Tips & Tricks" section for the guide "{{title}}".
Target Audience: {{targetAudience}}

Generate:
- 5-8 practical tips that enhance the process
- Best practices for better results
- Time-saving shortcuts
- Expert recommendations
- Troubleshooting advice

Format as a bulleted list with brief explanations for each tip.`,
    },
    {
      id: 'conclusion',
      title: 'Conclusion & Next Steps',
      description: 'Wrap-up and future directions',
      aiPromptTemplate: `Write a conclusion for the guide "{{title}}".

The conclusion should:
- Recap what was accomplished
- Provide next steps or advanced techniques to explore
- Encourage readers with the skills they've gained
- Suggest related resources or guides

Length: 150-250 words`,
    },
  ],

  aiConfig: {
    model: 'gpt-4',
    temperature: 0.5,
    maxTokens: 1500,
    systemPrompt: `You are an expert instructional writer who creates clear, actionable how-to guides.
Your instructions are precise, easy to follow, and anticipate common questions.
You use simple language and break down complex processes into manageable steps.
You always consider the user's experience level and provide context.`,
  },

  ui: {
    editorLayout: 'sections',
    showProgress: true,
    customToolbar: ['generate', 'add-screenshot-note', 'clarify', 'expand'],
  },
};
