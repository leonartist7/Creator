import { TemplateConfig } from '@/types/templates';

export const newsletterSeriesTemplate: TemplateConfig = {
  id: 'newsletter-series',
  name: 'Newsletter Series',
  description: '4-part email series with strategic storytelling and CTAs',
  icon: '📧',
  category: 'Email Marketing',
  color: 'indigo',
  bgGradient: 'from-indigo-50 to-blue-50',

  inputs: [
    {
      id: 'seriesTopic',
      label: 'Series Topic / Theme',
      type: 'text',
      placeholder: 'e.g., "Launch Your First Online Business"',
      required: true,
    },
    {
      id: 'targetAudience',
      label: 'Target Audience',
      type: 'text',
      placeholder: 'e.g., "Aspiring entrepreneurs with 9-5 jobs"',
      required: true,
    },
    {
      id: 'tone',
      label: 'Tone',
      type: 'select',
      options: [
        { value: 'conversational', label: 'Conversational' },
        { value: 'professional', label: 'Professional' },
        { value: 'friendly', label: 'Friendly & Warm' },
        { value: 'authoritative', label: 'Authoritative' },
        { value: 'inspiring', label: 'Inspiring' },
      ],
      defaultValue: 'conversational',
      required: true,
    },
    {
      id: 'mainCTA',
      label: 'Main Call-to-Action',
      type: 'textarea',
      placeholder: 'What action do you want readers to take? (e.g., "Book a free consultation")',
      required: true,
    },
  ],

  sections: [
    {
      id: 'email1',
      title: 'Email 1: Introduction & Big Idea',
      description: 'Introduce the series and hook readers',
      fields: [
        {
          id: 'email1Focus',
          label: 'Main Focus',
          type: 'textarea',
          placeholder: 'What big idea or problem will you introduce?',
        },
      ],
      aiPromptTemplate: `Write Email 1 of a 4-part newsletter series about "{{seriesTopic}}".

Target Audience: {{targetAudience}}
Tone: {{tone}}
Email Focus: {{email1Focus}}

Structure:
1. SUBJECT LINE: Create 3 compelling options
   - Must have high open rate potential
   - Avoid spam triggers
   - Create curiosity or urgency

2. PREVIEW TEXT: First 50 characters that complement subject

3. EMAIL BODY:
   - Personal, engaging opening
   - Introduce the big idea or problem
   - Explain what this series will cover
   - Build anticipation for Email 2
   - Soft CTA: Encourage them to look for Email 2

Length: 250-400 words
Make it feel personal, like an email from a friend or mentor.`,
    },
    {
      id: 'email2',
      title: 'Email 2: Deep Dive',
      description: 'Go deeper into the concept or solution',
      fields: [
        {
          id: 'email2Focus',
          label: 'Main Focus',
          type: 'textarea',
          placeholder: 'What will you teach or reveal in this email?',
        },
      ],
      aiPromptTemplate: `Write Email 2 of a 4-part newsletter series about "{{seriesTopic}}".

Target Audience: {{targetAudience}}
Tone: {{tone}}
Email Focus: {{email2Focus}}

Structure:
1. SUBJECT LINE: 3 options
   - Reference Email 1 if appropriate
   - Promise value or insight

2. PREVIEW TEXT: 50 characters

3. EMAIL BODY:
   - Quick callback to Email 1
   - Deep dive into the topic
   - Provide actionable insights or framework
   - Share specific strategies or steps
   - Tease Email 3 (story/case study coming)
   - Soft CTA

Length: 350-500 words
Include bullets or numbered lists for scannability.`,
    },
    {
      id: 'email3',
      title: 'Email 3: Case Study / Story',
      description: 'Proof through story or example',
      fields: [
        {
          id: 'email3Focus',
          label: 'Story/Case Study Angle',
          type: 'textarea',
          placeholder: 'What example or story will you share?',
        },
      ],
      aiPromptTemplate: `Write Email 3 of a 4-part newsletter series about "{{seriesTopic}}".

Target Audience: {{targetAudience}}
Tone: {{tone}}
Story Focus: {{email3Focus}}

Structure:
1. SUBJECT LINE: 3 options
   - Story-driven or case study hook
   - Create curiosity

2. PREVIEW TEXT: 50 characters

3. EMAIL BODY:
   - Start with a compelling story or case study
   - Show real-world application of Email 2's concepts
   - Include specific results or outcomes
   - Connect emotionally with the reader
   - Bridge to the action plan (Email 4)
   - Medium CTA: Optional soft sell or resource offer

Length: 400-550 words
Use storytelling techniques - show, don't just tell.`,
    },
    {
      id: 'email4',
      title: 'Email 4: Action Plan & Strong CTA',
      description: 'Clear next steps and main offer',
      fields: [
        {
          id: 'email4Bonus',
          label: 'Bonus Value',
          type: 'textarea',
          placeholder: 'Any bonus tip or resource to include?',
        },
      ],
      aiPromptTemplate: `Write Email 4 (FINAL) of a 4-part newsletter series about "{{seriesTopic}}".

Target Audience: {{targetAudience}}
Tone: {{tone}}
Main CTA: {{mainCTA}}
Bonus: {{email4Bonus}}

Structure:
1. SUBJECT LINE: 3 options
   - Action-oriented
   - Reference the series completion

2. PREVIEW TEXT: 50 characters

3. EMAIL BODY:
   - Recap the journey (Emails 1-3)
   - Present clear action plan
   - Step-by-step next steps
   - Include bonus if provided
   - STRONG CTA: {{mainCTA}}
   - Create urgency or scarcity if appropriate
   - Make the CTA stand out visually
   - Add P.S. to reinforce CTA

Length: 400-600 words

CTA SECTION should:
- Be clear and specific
- Explain the benefit
- Reduce friction
- Include a button or link placeholder: [CTA BUTTON]`,
    },
  ],

  aiConfig: {
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000,
    systemPrompt: `You are an expert email marketer who creates engaging newsletter series.
You understand email psychology, deliverability, and conversion optimization.
Your emails feel personal and valuable, never spammy or pushy.
You structure content for scannability and use proven email copywriting techniques.
You build trust and relationship while driving action.`,
  },

  ui: {
    editorLayout: 'sections',
    showProgress: true,
    customToolbar: [
      'generate',
      'test-subject-line',
      'strengthen-cta',
      'add-ps',
    ],
  },
};
