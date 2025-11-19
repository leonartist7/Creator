import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Request, Response, NextFunction } from 'express'
import {
  generateIdeasController,
  generateContentController,
  generateOutlineController,
  expandContentController,
  improveTextController,
  generateTitlesController,
  generateSalesCopyController
} from '../../../backend/src/controllers/ai.controller'
import { AuthRequest } from '../../../backend/src/middleware/auth'

// Mock services
vi.mock('../../../backend/src/services/anthropic.service', () => ({
  generateIdeas: vi.fn(),
  generateOutline: vi.fn(),
  expandContent: vi.fn(),
  improveText: vi.fn(),
  generateTitles: vi.fn(),
  generateSalesCopy: vi.fn(),
  generateWithClaude: vi.fn()
}))

// Mock supabase
vi.mock('../../../backend/src/config/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn()
          }))
        }))
      })),
      insert: vi.fn()
    }))
  }
}))

describe('AI Controller', () => {
  let mockReq: Partial<AuthRequest>
  let mockRes: Partial<Response>
  let mockNext: NextFunction
  let jsonSpy: any
  let statusSpy: any

  beforeEach(() => {
    vi.clearAllMocks()
    jsonSpy = vi.fn()
    statusSpy = vi.fn(() => ({ json: jsonSpy }))

    mockReq = {
      body: {},
      user: { userId: 'test-user-123' }
    }
    mockRes = {
      json: jsonSpy,
      status: statusSpy
    }
    mockNext = vi.fn()
  })

  describe('generateIdeasController', () => {
    it('should generate ideas successfully', async () => {
      const mockIdeas = [
        { title: 'Idea 1', audience: 'developers' },
        { title: 'Idea 2', audience: 'designers' }
      ]

      mockReq.body = { niche: 'productivity', audience: 'professionals' }

      const { generateIdeas } = await import('../../../backend/src/services/anthropic.service')
      ;(generateIdeas as any).mockResolvedValue({
        content: mockIdeas,
        tokensUsed: 200,
        model: 'claude-3-5-sonnet-20241022'
      })

      await generateIdeasController(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      )

      expect(jsonSpy).toHaveBeenCalledWith({
        success: true,
        data: mockIdeas,
        meta: {
          tokensUsed: 200,
          model: 'claude-3-5-sonnet-20241022'
        }
      })
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should return error if niche is missing', async () => {
      mockReq.body = { audience: 'professionals' }

      await generateIdeasController(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      )

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Niche is required' })
      )
    })

    it('should handle service errors', async () => {
      mockReq.body = { niche: 'productivity' }

      const { generateIdeas } = await import('../../../backend/src/services/anthropic.service')
      ;(generateIdeas as any).mockRejectedValue(new Error('API error'))

      await generateIdeasController(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      )

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error))
    })
  })

  describe('generateContentController', () => {
    it('should generate content for valid project', async () => {
      mockReq.body = {
        projectId: 'project-123',
        prompt: 'Write about productivity',
        options: { temperature: 0.8 }
      }

      const { supabase } = await import('../../../backend/src/config/supabase')
      ;(supabase.from as any).mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({
                data: { id: 'project-123' },
                error: null
              })
            }))
          }))
        })),
        insert: vi.fn()
      })

      const { generateWithClaude } = await import('../../../backend/src/services/anthropic.service')
      ;(generateWithClaude as any).mockResolvedValue({
        content: 'Generated content',
        tokensUsed: 300,
        model: 'claude-3-5-sonnet-20241022'
      })

      await generateContentController(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      )

      expect(jsonSpy).toHaveBeenCalledWith({
        success: true,
        data: 'Generated content',
        meta: {
          tokensUsed: 300,
          model: 'claude-3-5-sonnet-20241022'
        }
      })
    })

    it('should return error if projectId is missing', async () => {
      mockReq.body = { prompt: 'Test' }

      await generateContentController(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      )

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Project ID and prompt are required' })
      )
    })

    it('should return error if project not found', async () => {
      mockReq.body = { projectId: 'invalid', prompt: 'Test' }

      const { supabase } = await import('../../../backend/src/config/supabase')
      ;(supabase.from as any).mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { message: 'Not found' }
              })
            }))
          }))
        }))
      })

      await generateContentController(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      )

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Project not found' })
      )
    })
  })

  describe('generateOutlineController', () => {
    it('should generate outline successfully', async () => {
      const mockOutline = {
        chapters: [
          { chapterNumber: 1, title: 'Introduction' },
          { chapterNumber: 2, title: 'Core Concepts' }
        ]
      }

      mockReq.body = { title: 'Test Book', topic: 'Testing', style: 'technical' }

      const { generateOutline } = await import('../../../backend/src/services/anthropic.service')
      ;(generateOutline as any).mockResolvedValue({
        content: mockOutline,
        tokensUsed: 250,
        model: 'claude-3-5-sonnet-20241022'
      })

      await generateOutlineController(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      )

      expect(jsonSpy).toHaveBeenCalledWith({
        success: true,
        data: mockOutline,
        meta: {
          tokensUsed: 250,
          model: 'claude-3-5-sonnet-20241022'
        }
      })
    })

    it('should return error if title or topic is missing', async () => {
      mockReq.body = { title: 'Test Book' }

      await generateOutlineController(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      )

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Title and topic are required' })
      )
    })
  })

  describe('expandContentController', () => {
    it('should expand content successfully', async () => {
      mockReq.body = { bullets: '- Point 1\n- Point 2', style: 'formal' }

      const { expandContent } = await import('../../../backend/src/services/anthropic.service')
      ;(expandContent as any).mockResolvedValue({
        content: 'Expanded paragraph content.',
        tokensUsed: 150,
        model: 'claude-3-5-sonnet-20241022'
      })

      await expandContentController(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      )

      expect(jsonSpy).toHaveBeenCalledWith({
        success: true,
        data: 'Expanded paragraph content.',
        meta: {
          tokensUsed: 150,
          model: 'claude-3-5-sonnet-20241022'
        }
      })
    })

    it('should return error if bullets are missing', async () => {
      mockReq.body = { style: 'formal' }

      await expandContentController(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      )

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Bullet points are required' })
      )
    })
  })

  describe('improveTextController', () => {
    it('should improve text successfully', async () => {
      mockReq.body = { text: 'Original text', improvement: 'clarity' }

      const { improveText } = await import('../../../backend/src/services/anthropic.service')
      ;(improveText as any).mockResolvedValue({
        content: 'Improved text version.',
        tokensUsed: 100,
        model: 'claude-3-5-sonnet-20241022'
      })

      await improveTextController(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      )

      expect(jsonSpy).toHaveBeenCalledWith({
        success: true,
        data: 'Improved text version.',
        meta: {
          tokensUsed: 100,
          model: 'claude-3-5-sonnet-20241022'
        }
      })
    })

    it('should return error if text or improvement is missing', async () => {
      mockReq.body = { text: 'Original text' }

      await improveTextController(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      )

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Text and improvement type are required' })
      )
    })
  })

  describe('generateTitlesController', () => {
    it('should generate titles successfully', async () => {
      const mockTitles = [
        { title: 'Title 1', formula: 'How to', seoScore: 8 },
        { title: 'Title 2', formula: 'Guide', seoScore: 9 }
      ]

      mockReq.body = { topic: 'productivity', type: 'ebook' }

      const { generateTitles } = await import('../../../backend/src/services/anthropic.service')
      ;(generateTitles as any).mockResolvedValue({
        content: mockTitles,
        tokensUsed: 180,
        model: 'claude-3-5-sonnet-20241022'
      })

      await generateTitlesController(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      )

      expect(jsonSpy).toHaveBeenCalledWith({
        success: true,
        data: mockTitles,
        meta: {
          tokensUsed: 180,
          model: 'claude-3-5-sonnet-20241022'
        }
      })
    })

    it('should return error if topic or type is missing', async () => {
      mockReq.body = { topic: 'productivity' }

      await generateTitlesController(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      )

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Topic and type are required' })
      )
    })
  })

  describe('generateSalesCopyController', () => {
    it('should generate sales copy successfully', async () => {
      const mockSalesCopy = {
        headline: 'Transform Your Life',
        subheadline: 'In 30 Days',
        benefits: [],
        features: [],
        cta: 'Buy Now'
      }

      mockReq.body = {
        title: 'Product',
        type: 'course',
        audience: 'students',
        benefits: ['Benefit 1', 'Benefit 2']
      }

      const { generateSalesCopy } = await import('../../../backend/src/services/anthropic.service')
      ;(generateSalesCopy as any).mockResolvedValue({
        content: mockSalesCopy,
        tokensUsed: 220,
        model: 'claude-3-5-sonnet-20241022'
      })

      await generateSalesCopyController(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      )

      expect(jsonSpy).toHaveBeenCalledWith({
        success: true,
        data: mockSalesCopy,
        meta: {
          tokensUsed: 220,
          model: 'claude-3-5-sonnet-20241022'
        }
      })
    })

    it('should use empty array if benefits not provided', async () => {
      mockReq.body = {
        title: 'Product',
        type: 'course',
        audience: 'students'
      }

      const { generateSalesCopy } = await import('../../../backend/src/services/anthropic.service')
      ;(generateSalesCopy as any).mockResolvedValue({
        content: {},
        tokensUsed: 200,
        model: 'claude-3-5-sonnet-20241022'
      })

      await generateSalesCopyController(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      )

      expect(generateSalesCopy).toHaveBeenCalledWith('Product', 'course', 'students', [])
    })

    it('should return error if required fields are missing', async () => {
      mockReq.body = { title: 'Product' }

      await generateSalesCopyController(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      )

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Title, type, and audience are required' })
      )
    })
  })
})
