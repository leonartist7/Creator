import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import { createTestServer } from '../setup/test-server'
import { Express } from 'express'

describe('Export API', () => {
  let app: Express

  beforeAll(async () => {
    app = await createTestServer()
  })

  describe('POST /api/export', () => {
    it('should generate export file', async () => {
      const response = await request(app)
        .post('/api/export')
        .send({ projectId: '123', format: 'pdf' })
        .expect(200)

      expect(response.body).toHaveProperty('url')
      expect(response.body).toHaveProperty('format')
      expect(response.body.format).toBe('pdf')
    })
  })
})
