import { TemplateConfig } from '@/types/templates';

export const advertisingTemplate: TemplateConfig = {
  id: 'advertising',
  name: 'Advertising Copy',
  description: 'High-converting ad copy with psychological triggers',
  icon: '📢',
  category: 'Marketing',
  color: 'red',
  bgGradient: 'from-red-50 to-orange-50',

  inputs: [
    {
      id: 'product',
      label: 'Product / Offer',
      type: 'textarea',
      placeholder: 'Describe what you're advertising',
      required: true,
    },
    {
      id: 'targetAudience',
      label: 'Target Audience',
      type: 'text',
      placeholder: 'e.g., "Busy moms aged 30-45 who want to lose weight"',
      required: true,
    },
    {
      id: 'platform',
      label: 'Ad Platform',
      type: 'select',
      options: [
        { value: 'meta', label: 'Meta Ads (Facebook/Instagram)' },
        { value: 'google', label: 'Google Ads' },
        { value: 'youtube', label: 'YouTube Ads' },
        { value: 'tiktok', label: 'TikTok Ads' },
        { value: 'linkedin', label: 'LinkedIn Ads' },
      ],
      required: true,
    },
    {
      id: 'tone',
      label: 'Tone',
      type: 'select',
      options: [
        { value: 'urgent', label: 'Urgent & Direct' },
        { value: 'conversational', label: 'Conversational' },
        { value: 'premium', label: 'Premium & Aspirational' },
        { value: 'empathetic', label: 'Empathetic & Understanding' },
        { value: 'bold', label: 'Bold & Confident' },
        { value: 'educational', label: 'Educational' },
      ],
      required: true,
    },
    {
      id: 'mainBenefit',
      label: 'Main Benefit / USP',
      type: 'textarea',
      placeholder: 'What's the #1 benefit or unique selling proposition?',
      required: true,
    },
    {
      id: 'painPoints',
      label: 'Customer Pain Points',
      type: 'textarea',
      placeholder: 'What problems does your product solve?',
      description: 'Separate multiple pain points with commas',
    },
  ],

  sections: [
    {
      id: 'angle',
      title: 'Angle / Big Idea',
      description: 'The unique hook that makes the ad compelling',
      aiPromptTemplate: `Create 3 unique advertising angles for this product.

Product: {{product}}
Target Audience: {{targetAudience}}
Platform: {{platform}}
Main Benefit: {{mainBenefit}}
Pain Points: {{painPoints}}

For each angle, provide:
- Core hook/idea
- Emotional trigger (fear, desire, curiosity, etc.)
- Why it works for this audience
- Which pain point it addresses

Make angles fresh, not cliché. Think psychologically.`,
    },
    {
      id: 'headlines',
      title: 'Headline Options',
      description: 'Attention-grabbing headlines',
      aiPromptTemplate: `Create 5 high-converting ad headlines.

Product: {{product}}
Target Audience: {{targetAudience}}
Platform: {{platform}}
Tone: {{tone}}
Main Benefit: {{mainBenefit}}
Selected Angle: {{selectedAngle}}

Platform-specific guidelines:
{{#if platform == 'meta'}}
- 40 characters max for primary headline
- 5 variations for A/B testing
- Use numbers, questions, or bold claims
{{/if}}
{{#if platform == 'google'}}
- 30 characters max
- Include key benefit
- Can be more direct/search-intent focused
{{/if}}
{{#if platform == 'youtube'}}
- First 5 words critical
- Can be longer (60 characters)
- Must work as overlay text
{{/if}}

Psychological triggers to use:
- Curiosity gaps
- Specific numbers
- Transformation promises
- Time-bound urgency
- Social proof hints

Make them punchy, benefit-driven, and scroll-stopping.`,
    },
    {
      id: 'primaryText',
      title: 'Primary Text / Ad Copy',
      description: 'Main ad body copy',
      aiPromptTemplate: `Write compelling primary text for this ad.

Product: {{product}}
Target Audience: {{targetAudience}}
Platform: {{platform}}
Tone: {{tone}}
Main Benefit: {{mainBenefit}}
Pain Points: {{painPoints}}

Platform-specific requirements:
{{#if platform == 'meta'}}
- First 125 characters crucial (before "See More")
- Hook → Agitate → Solve structure
- 125-250 words total
- Conversational, not salesy
{{/if}}
{{#if platform == 'google'}}
- 90 characters max for responsive ads
- Focus on benefits over features
- Include keywords naturally
{{/if}}
{{#if platform == 'youtube'}}
- First 3 seconds hook (for video script)
- Can be longer (300-400 words for script)
- Visual descriptions
{{/if}}

Copy structure:
1. HOOK: Address pain point or make bold claim
2. AGITATE: Amplify the problem (empathetically)
3. SOLVE: Present the product as solution
4. BENEFITS: List 3-4 key benefits (bullet format if platform allows)
5. CREDIBILITY: Brief proof element (testimonial quote, stat, guarantee)

Use emotional triggers:
- {{tone}} tone throughout
- Speak directly to pain points
- Paint the "after" picture
- Create desire and urgency

Make it feel authentic, not like an ad.`,
    },
    {
      id: 'bullets',
      title: 'Supporting Bullets (Features/Benefits)',
      description: 'Key selling points',
      aiPromptTemplate: `Create 5-7 benefit-driven bullet points.

Product: {{product}}
Main Benefit: {{mainBenefit}}
Platform: {{platform}}

Each bullet should:
- Lead with benefit, not feature
- Be specific and tangible
- Use power words
- Be scannable (short)

Format as:
✓ [Benefit]: [Specific detail]

Example:
✓ Save 5+ Hours Per Week: Automated scheduling handles all your appointments

Make them results-focused and customer-centric.`,
    },
    {
      id: 'cta',
      title: 'Call-to-Action Variations',
      description: 'Compelling CTAs that drive clicks',
      aiPromptTemplate: `Create 5 high-converting CTA options.

Product: {{product}}
Platform: {{platform}}
Tone: {{tone}}

CTA types to create:
1. Direct action (e.g., "Shop Now", "Get Started")
2. Low-friction (e.g., "Learn More", "See How It Works")
3. Benefit-focused (e.g., "Start Saving Time Today")
4. Urgency-driven (e.g., "Claim Your Discount")
5. Question-based (e.g., "Ready to Transform?")

For each CTA:
- Primary button text (2-4 words)
- Supporting text if needed
- Reasoning for when to use it

Make CTAs action-oriented and benefit-clear.`,
    },
  ],

  aiConfig: {
    model: 'gpt-4',
    temperature: 0.75,
    maxTokens: 1500,
    systemPrompt: `You are a world-class direct response copywriter and advertising expert.
You understand consumer psychology, persuasion principles, and platform-specific best practices.
Your ad copy converts because it speaks to emotions, addresses pain points, and creates desire.
You use psychological triggers ethically and effectively.
You know the difference between features and benefits, and always lead with benefits.
Your copy is never manipulative or misleading - it's authentic and value-driven.`,
  },

  ui: {
    editorLayout: 'sections',
    showProgress: false,
    customToolbar: [
      'generate',
      'test-angles',
      'strengthen-hook',
      'add-urgency',
      'check-char-count',
    ],
  },
};
