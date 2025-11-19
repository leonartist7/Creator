import { describe, it, expect } from 'vitest'
import { AI_PROMPTS } from '../../../backend/src/services/anthropic.service'

// Note: generateWithClaude and related functions are tested via controller tests
// SDK-level mocking is complex and better suited for integration tests

describe('Anthropic Service', () => {
  describe('AI_PROMPTS', () => {
    it('should generate idea generation prompt', () => {
      const prompt = AI_PROMPTS.ideaGeneration('fitness', 'busy professionals')

      expect(prompt).toContain('fitness')
      expect(prompt).toContain('busy professionals')
      expect(prompt).toContain('JSON array')
    })

    it('should generate chapter outline prompt', () => {
      const prompt = AI_PROMPTS.chapterOutline('My Book', 'Programming', 'beginner-friendly')

      expect(prompt).toContain('My Book')
      expect(prompt).toContain('Programming')
      expect(prompt).toContain('beginner-friendly')
      expect(prompt).toContain('10-12 chapters')
    })

    it('should generate content expansion prompt with default style', () => {
      const prompt = AI_PROMPTS.contentExpansion('- Bullet 1\n- Bullet 2')

      expect(prompt).toContain('Bullet 1')
      expect(prompt).toContain('conversational')
    })

    it('should generate sales copy prompt', () => {
      const benefits = ['Saves time', 'Increases productivity']
      const prompt = AI_PROMPTS.salesCopy('Amazing Tool', 'software', 'developers', benefits)

      expect(prompt).toContain('Amazing Tool')
      expect(prompt).toContain('software')
      expect(prompt).toContain('Saves time')
    })

    it('should generate title generator prompt', () => {
      const prompt = AI_PROMPTS.titleGenerator('cooking', 'ebook')

      expect(prompt).toContain('cooking')
      expect(prompt).toContain('ebook')
      expect(prompt).toContain('10 compelling titles')
    })

    it('should generate improve text prompt', () => {
      const prompt = AI_PROMPTS.improveText('Original text', 'grammar and clarity')

      expect(prompt).toContain('Original text')
      expect(prompt).toContain('grammar and clarity')
    })
  })
})
