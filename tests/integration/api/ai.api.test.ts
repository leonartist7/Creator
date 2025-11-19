import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import { createTestServer } from '../setup/test-server'
import { Express } from 'express'

describe('AI API', () => {
  let app: Express

  beforeAll(async () => {
    app = await createTestServer()
  })

  describe('POST /api/ai/generate-outline', () => {
    it('should return AI-generated outline', async () => {
      const response = await request(app)
        .post('/api/ai/generate-outline')
        .send({ topic: 'Test Topic', chapters: 5 })
        .expect(200)

      expect(response.body).toHaveProperty('outline')
      expect(Array.isArray(response.body.outline)).toBe(true)
    })
  })

  describe('POST /api/ai/improve-text', () => {
    it('should return improved text', async () => {
      const originalText = 'This is a test.'
      const response = await request(app)
        .post('/api/ai/improve-text')
        .send({ text: originalText })
        .expect(200)

      expect(response.body).toHaveProperty('original')
      expect(response.body).toHaveProperty('improved')
      expect(response.body.original).toBe(originalText)
    })
  })

  describe('POST /api/ai/generate-ideas', () => {
    it('should return product ideas', async () => {
      const response = await request(app)
        .post('/api/ai/generate-ideas')
        .send({ niche: 'productivity' })
        .expect(200)

      expect(response.body).toHaveProperty('ideas')
      expect(Array.isArray(response.body.ideas)).toBe(true)
    })
  })
})
