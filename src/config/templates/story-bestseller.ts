import { TemplateConfig } from '@/types/templates';

export const storyBestsellerTemplate: TemplateConfig = {
  id: 'story-bestseller',
  name: 'Story / Bestseller',
  description: 'Creative fiction with character development and narrative structure',
  icon: '📖',
  category: 'Creative Writing',
  color: 'purple',
  bgGradient: 'from-purple-50 to-pink-50',

  inputs: [
    {
      id: 'genre',
      label: 'Genre',
      type: 'select',
      options: [
        { value: 'fantasy', label: 'Fantasy' },
        { value: 'sci-fi', label: 'Science Fiction' },
        { value: 'mystery', label: 'Mystery/Thriller' },
        { value: 'romance', label: 'Romance' },
        { value: 'literary', label: 'Literary Fiction' },
        { value: 'horror', label: 'Horror' },
        { value: 'historical', label: 'Historical Fiction' },
      ],
      required: true,
    },
    {
      id: 'pov',
      label: 'Point of View',
      type: 'select',
      options: [
        { value: 'first-person', label: 'First Person (I, me)' },
        { value: 'third-limited', label: 'Third Person Limited (He, she)' },
        { value: 'third-omniscient', label: 'Third Person Omniscient' },
      ],
      defaultValue: 'third-limited',
      required: true,
    },
    {
      id: 'tense',
      label: 'Tense',
      type: 'select',
      options: [
        { value: 'past', label: 'Past Tense' },
        { value: 'present', label: 'Present Tense' },
      ],
      defaultValue: 'past',
      required: true,
    },
    {
      id: 'tone',
      label: 'Tone',
      type: 'multiselect',
      options: [
        { value: 'dark', label: 'Dark' },
        { value: 'hopeful', label: 'Hopeful' },
        { value: 'witty', label: 'Witty' },
        { value: 'somber', label: 'Somber' },
        { value: 'suspenseful', label: 'Suspenseful' },
        { value: 'romantic', label: 'Romantic' },
        { value: 'humorous', label: 'Humorous' },
      ],
      description: 'Select one or more tones',
    },
    {
      id: 'themes',
      label: 'Themes',
      type: 'textarea',
      placeholder: 'e.g., "Redemption, family bonds, overcoming adversity"',
      description: 'Main themes to explore in your story',
    },
    {
      id: 'referenceFiles',
      label: 'Reference Files (Optional)',
      type: 'file',
      accept: '.pdf,.txt,.docx',
      multiple: true,
      description: 'Upload reference files to learn writing style and direction',
    },
  ],

  sections: [
    {
      id: 'synopsis',
      title: 'Synopsis',
      description: 'Overall story summary',
      aiPromptTemplate: `Create a compelling synopsis for a {{genre}} story.

POV: {{pov}}
Tense: {{tense}}
Tone: {{tone}}
Themes: {{themes}}
{{#if learnedStyle}}
Writing Style Reference: {{learnedStyle.tone}} tone, {{learnedStyle.voice}} voice
Key themes from reference: {{learnedStyle.themes}}
{{/if}}

Generate a 300-500 word synopsis that includes:
- Protagonist introduction
- Central conflict
- Story arc overview
- Emotional journey
- Potential resolution direction

Make it compelling and market-ready.`,
    },
    {
      id: 'characters',
      title: 'Character Profiles',
      description: 'Main character development',
      fields: [
        {
          id: 'characterCount',
          label: 'Number of Main Characters',
          type: 'range',
          min: 1,
          max: 8,
          defaultValue: 3,
        },
      ],
      aiPromptTemplate: `Create detailed character profiles for a {{genre}} story.

Number of Characters: {{characterCount}}
Genre: {{genre}}
Themes: {{themes}}
{{#if learnedStyle}}
Style Reference: Create characters that fit the {{learnedStyle.voice}} voice
{{/if}}

For each character, generate:
- Name and basic demographics
- Physical description
- Personality traits and quirks
- Backstory summary
- Motivations and goals
- Character arc
- Relationships with other characters
- Internal and external conflicts

Make characters complex, relatable, and genre-appropriate.`,
    },
    {
      id: 'worldbuilding',
      title: 'World-Building / Setting',
      description: 'Story setting and atmosphere',
      aiPromptTemplate: `Create world-building and setting details for a {{genre}} story.

Genre: {{genre}}
Tone: {{tone}}
Themes: {{themes}}

Generate:
- Primary setting description
- Time period / era
- Cultural and social context
- Rules of the world (especially for fantasy/sci-fi)
- Atmosphere and mood
- Key locations
- Sensory details (sights, sounds, smells)

Length: 400-600 words`,
    },
    {
      id: 'act1',
      title: 'Act 1: Setup',
      description: 'Beginning - Introduce world and characters',
      fields: [
        {
          id: 'act1Scenes',
          label: 'Number of Scenes',
          type: 'range',
          min: 3,
          max: 10,
          defaultValue: 5,
        },
      ],
      aiPromptTemplate: `Write Act 1 (Setup) for a {{genre}} story.

POV: {{pov}}
Tense: {{tense}}
Tone: {{tone}}
Number of scenes: {{act1Scenes}}
{{#if learnedStyle}}
IMPORTANT: Write in the style of the reference material.
Style notes: {{learnedStyle.sentenceStructure}}
Vocabulary level: {{learnedStyle.vocabulary}}
Voice: {{learnedStyle.voice}}
{{/if}}

Act 1 should:
- Introduce protagonist in their normal world
- Establish relationships and setting
- Present the inciting incident
- Show the protagonist's initial reaction
- End with a commitment to the journey

Length: 2500-4000 words
Include scene breaks and chapter suggestions.`,
    },
    {
      id: 'act2',
      title: 'Act 2: Confrontation',
      description: 'Middle - Rising action and complications',
      fields: [
        {
          id: 'act2Scenes',
          label: 'Number of Scenes',
          type: 'range',
          min: 5,
          max: 15,
          defaultValue: 10,
        },
      ],
      aiPromptTemplate: `Write Act 2 (Confrontation) for a {{genre}} story.

POV: {{pov}}
Tense: {{tense}}
Tone: {{tone}}
Number of scenes: {{act2Scenes}}
{{#if learnedStyle}}
Maintain consistent style from Act 1.
{{/if}}

Act 2 should:
- Develop the main conflict
- Introduce obstacles and complications
- Deepen character relationships
- Include a midpoint shift
- Build to the low point / dark night of the soul
- Create rising tension

Length: 4000-6000 words`,
    },
    {
      id: 'act3',
      title: 'Act 3: Resolution',
      description: 'End - Climax and resolution',
      fields: [
        {
          id: 'act3Scenes',
          label: 'Number of Scenes',
          type: 'range',
          min: 3,
          max: 10,
          defaultValue: 6,
        },
      ],
      aiPromptTemplate: `Write Act 3 (Resolution) for a {{genre}} story.

POV: {{pov}}
Tense: {{tense}}
Tone: {{tone}}
Number of scenes: {{act3Scenes}}
{{#if learnedStyle}}
Maintain consistent style and voice.
{{/if}}

Act 3 should:
- Build to the climax
- Resolve the main conflict
- Show character transformation
- Tie up major plot threads
- Deliver emotional payoff
- Provide satisfying conclusion

Length: 2500-4000 words`,
    },
  ],

  aiConfig: {
    model: 'gpt-4',
    temperature: 0.8,
    maxTokens: 4000,
    systemPrompt: `You are a bestselling fiction author with expertise across multiple genres.
You create vivid, emotionally resonant stories with complex characters and engaging plots.
Your prose is polished, your pacing is tight, and your dialogue feels natural.
You understand story structure, character arcs, and how to keep readers turning pages.`,
  },

  ui: {
    editorLayout: 'sections',
    showProgress: true,
    customToolbar: [
      'generate',
      'rewrite-style',
      'add-scene',
      'enhance-emotion',
      'analyze-pacing',
    ],
  },
};
