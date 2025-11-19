import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import { createTestServer } from '../setup/test-server'
import { Express } from 'express'

describe('Projects API', () => {
  let app: Express

  beforeAll(async () => {
    app = await createTestServer()
  })

  describe('GET /api/projects', () => {
    it('should list all projects', async () => {
      const response = await request(app)
        .get('/api/projects')
        .expect(200)

      expect(Array.isArray(response.body)).toBe(true)
    })
  })

  describe('POST /api/projects', () => {
    it('should create new project', async () => {
      const response = await request(app)
        .post('/api/projects')
        .send({ name: 'New Project', type: 'ebook' })
        .expect(201)

      expect(response.body).toHaveProperty('id')
      expect(response.body.name).toBe('New Project')
      expect(response.body.type).toBe('ebook')
    })
  })

  describe('GET /api/projects/:id', () => {
    it('should return single project', async () => {
      const response = await request(app)
        .get('/api/projects/123')
        .expect(200)

      expect(response.body).toHaveProperty('id')
      expect(response.body).toHaveProperty('name')
    })
  })

  describe('PUT /api/projects/:id', () => {
    it('should update project', async () => {
      const response = await request(app)
        .put('/api/projects/123')
        .send({ name: 'Updated Project' })
        .expect(200)

      expect(response.body.name).toBe('Updated Project')
    })
  })

  describe('DELETE /api/projects/:id', () => {
    it('should delete project', async () => {
      await request(app)
        .delete('/api/projects/123')
        .expect(204)
    })
  })
})
