import { TemplateConfig } from '@/types/templates';

export const socialMediaTemplate: TemplateConfig = {
  id: 'social-media',
  name: 'Social Media Post',
  description: 'High-converting social media content optimized by platform',
  icon: '📱',
  category: 'Marketing',
  color: 'pink',
  bgGradient: 'from-pink-50 to-rose-50',

  inputs: [
    {
      id: 'platform',
      label: 'Platform',
      type: 'select',
      options: [
        { value: 'instagram', label: 'Instagram' },
        { value: 'tiktok', label: 'TikTok' },
        { value: 'twitter', label: 'X (Twitter)' },
        { value: 'linkedin', label: 'LinkedIn' },
        { value: 'facebook', label: 'Facebook' },
        { value: 'threads', label: 'Threads' },
      ],
      required: true,
    },
    {
      id: 'subject',
      label: 'Subject / Main Idea',
      type: 'textarea',
      placeholder: 'What is your post about?',
      required: true,
    },
    {
      id: 'goal',
      label: 'Goal',
      type: 'select',
      options: [
        { value: 'awareness', label: 'Brand Awareness' },
        { value: 'engagement', label: 'Engagement' },
        { value: 'traffic', label: 'Drive Traffic' },
        { value: 'leads', label: 'Generate Leads' },
        { value: 'sales', label: 'Direct Sales' },
        { value: 'education', label: 'Educate Audience' },
      ],
      required: true,
    },
    {
      id: 'targetAudience',
      label: 'Target Audience',
      type: 'text',
      placeholder: 'e.g., "Millennial entrepreneurs aged 25-35"',
      required: true,
    },
    {
      id: 'tone',
      label: 'Tone',
      type: 'select',
      options: [
        { value: 'casual', label: 'Casual & Friendly' },
        { value: 'bold', label: 'Bold & Confident' },
        { value: 'professional', label: 'Professional' },
        { value: 'playful', label: 'Playful & Fun' },
        { value: 'inspiring', label: 'Inspiring' },
        { value: 'educational', label: 'Educational' },
        { value: 'authentic', label: 'Authentic & Real' },
      ],
      required: true,
    },
    {
      id: 'includeVariations',
      label: 'Generate A/B Variations',
      type: 'toggle',
      defaultValue: true,
      description: 'Create 3 different versions for testing',
    },
  ],

  sections: [
    {
      id: 'hook',
      title: 'Hook',
      description: 'Attention-grabbing opening',
      aiPromptTemplate: `Create a powerful hook for a {{platform}} post.

Subject: {{subject}}
Goal: {{goal}}
Target Audience: {{targetAudience}}
Tone: {{tone}}

Platform-specific guidelines:
{{#if platform == 'instagram'}}
- First line is critical (visible before "more")
- Use emoji strategically
- Make it visually scannable
{{/if}}
{{#if platform == 'twitter'}}
- First 140 characters must hook
- Consider thread potential
- Be punchy and direct
{{/if}}
{{#if platform == 'linkedin'}}
- Professional but engaging
- Lead with insight or question
- Appeal to business mindset
{{/if}}
{{#if platform == 'tiktok'}}
- Immediate visual/emotional hook
- Relatable or surprising
- Sets up the value
{{/if}}

Generate 1-2 sentence hook that stops the scroll.
Make it human, not robotic.`,
    },
    {
      id: 'body',
      title: 'Body',
      description: 'Main content',
      aiPromptTemplate: `Write the main body for a {{platform}} post.

Subject: {{subject}}
Goal: {{goal}}
Target Audience: {{targetAudience}}
Tone: {{tone}}

Platform-specific formatting:
{{#if platform == 'instagram'}}
- 150-300 words optimal
- Line breaks for readability
- Conversational storytelling
- 3-5 emojis maximum
- No hashtags in caption (comment instead)
{{/if}}
{{#if platform == 'twitter'}}
- 150-280 characters (or thread of 3-5 tweets)
- Concise and impactful
- Each tweet should stand alone
{{/if}}
{{#if platform == 'linkedin'}}
- 150-300 words
- Professional insights
- Data or examples
- Paragraph breaks
- No emoji overload
{{/if}}
{{#if platform == 'tiktok'}}
- 100-150 words
- Video script format
- Clear value proposition
- Call out audience directly
{{/if}}

The body should:
- Deliver on the hook's promise
- Provide value (education, entertainment, inspiration)
- Feel conversational and authentic
- Use storytelling when appropriate
- Build to the CTA

Write like a human, not a marketing robot.`,
    },
    {
      id: 'cta',
      title: 'Call-to-Action',
      description: 'Clear next step',
      aiPromptTemplate: `Create a compelling CTA for this {{platform}} post.

Goal: {{goal}}
Platform: {{platform}}

The CTA should:
- Align with the goal ({{goal}})
- Be specific and actionable
- Feel natural, not pushy
- Match the platform norms

Generate 2-3 CTA options.`,
    },
    {
      id: 'variations',
      title: 'A/B Test Variations',
      description: 'Alternative versions for testing',
      optional: true,
      aiPromptTemplate: `Create 2 alternative versions of this {{platform}} post.

Original subject: {{subject}}
Goal: {{goal}}
Target Audience: {{targetAudience}}

For each variation:
- Change the angle or hook
- Adjust the storytelling approach
- Test different emotional triggers
- Maintain the same core message

Variation 1: [Different hook approach]
Variation 2: [Different emotional angle]

Each variation should be complete (hook + body + CTA).`,
    },
  ],

  aiConfig: {
    model: 'gpt-4',
    temperature: 0.8,
    maxTokens: 1000,
    systemPrompt: `You are a viral social media copywriter who creates authentic, engaging content.
You understand platform algorithms and audience psychology.
Your copy is never robotic or salesy - it feels like a real person sharing value.
You use psychological triggers ethically to drive engagement and conversions.
You adapt your style to each platform's unique culture and format.`,
  },

  ui: {
    editorLayout: 'single',
    showProgress: false,
    customToolbar: [
      'generate',
      'regenerate',
      'add-emoji',
      'shorten',
      'change-angle',
    ],
  },
};
