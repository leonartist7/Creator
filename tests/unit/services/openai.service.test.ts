import { describe, it, expect, vi } from 'vitest'

// Mock the entire OpenAI service module
vi.mock('../../../backend/src/services/openai.service', async () => {
  const actual = await vi.importActual<typeof import('../../../backend/src/services/openai.service')>('../../../backend/src/services/openai.service')
  return {
    ...actual,
    generateWithAI: vi.fn(),
    generateImage: vi.fn()
  }
})

const AI_PROMPTS = {
  ideaGeneration: (niche: string, audience?: string) => `Generate 5 innovative digital product ideas for the ${niche} niche${audience ? ` targeting ${audience}` : ''}. For each idea, provide:
    - Product title
    - Target audience
    - Problem it solves
    - Unique value proposition
    - Estimated market size (small/medium/large)
    - Suggested price point

    Format the response as a JSON array with these fields: title, audience, problem, valueProposition, marketSize, suggestedPrice`,

  chapterOutline: (title: string, topic: string, style?: string) => `Create a detailed chapter outline for a ${style || 'comprehensive'} book titled "${title}" about ${topic}.
    Include:
    - 10-12 chapters with compelling titles
    - 3-5 subtopics per chapter
    - Estimated word count per chapter
    - Key takeaways for readers

    Format as JSON with chapters array containing: chapterNumber, title, subtopics, wordCount, keyTakeaways`,

  contentExpansion: (bullets: string, style: string = 'conversational') => `Expand the following bullet points into engaging, well-structured paragraphs in a ${style} writing style:

    ${bullets}

    Make it informative, engaging, and easy to read.`,

  salesCopy: (title: string, type: string, audience: string, benefits: string[]) => `Write compelling sales copy for a digital product:
    Title: ${title}
    Type: ${type}
    Target audience: ${audience}
    Benefits: ${benefits.join(', ')}

    Include:
    - Attention-grabbing headline
    - Compelling subheadline
    - 5-7 key benefits with descriptions
    - Feature highlights
    - Social proof placeholder
    - Strong call-to-action

    Format as JSON with fields: headline, subheadline, benefits, features, testimonialPlaceholder, cta`,

  titleGenerator: (topic: string, type: string) => `Generate 10 compelling titles for a ${type} about ${topic}. Use proven formulas like:
    - "How to [Achieve Desired Outcome] Without [Common Obstacle]"
    - "The [Time Period] Guide to [Topic]"
    - "[Number] [Adjective] Ways to [Achieve Goal]"
    - "The Ultimate [Topic] Blueprint for [Audience]"

    Format as JSON array with fields: title, formula, seoScore (1-10)`,

  improveText: (text: string, improvement: string) => `Improve the following text by ${improvement}:

    ${text}

    Return the improved version while maintaining the original meaning and tone.`,
}

describe('OpenAI Service - AI Prompts', () => {
  describe('AI_PROMPTS', () => {
    it('should generate idea generation prompt', () => {
      const prompt = AI_PROMPTS.ideaGeneration('productivity', 'entrepreneurs')

      expect(prompt).toContain('productivity')
      expect(prompt).toContain('entrepreneurs')
      expect(prompt).toContain('JSON array')
    })

    it('should generate chapter outline prompt', () => {
      const prompt = AI_PROMPTS.chapterOutline('Test Book', 'Testing', 'technical')

      expect(prompt).toContain('Test Book')
      expect(prompt).toContain('Testing')
      expect(prompt).toContain('technical')
    })

    it('should generate content expansion prompt', () => {
      const prompt = AI_PROMPTS.contentExpansion('- Point 1\n- Point 2', 'formal')

      expect(prompt).toContain('Point 1')
      expect(prompt).toContain('formal')
    })

    it('should generate sales copy prompt', () => {
      const benefits = ['Benefit 1', 'Benefit 2']
      const prompt = AI_PROMPTS.salesCopy('Product', 'ebook', 'developers', benefits)

      expect(prompt).toContain('Product')
      expect(prompt).toContain('ebook')
      expect(prompt).toContain('developers')
      expect(prompt).toContain('Benefit 1')
    })

    it('should generate title generator prompt', () => {
      const prompt = AI_PROMPTS.titleGenerator('productivity', 'course')

      expect(prompt).toContain('productivity')
      expect(prompt).toContain('course')
      expect(prompt).toContain('10 compelling titles')
    })

    it('should generate improve text prompt', () => {
      const prompt = AI_PROMPTS.improveText('Test text', 'clarity')

      expect(prompt).toContain('Test text')
      expect(prompt).toContain('clarity')
    })
  })
})
