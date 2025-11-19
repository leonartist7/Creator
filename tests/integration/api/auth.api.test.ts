import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import { createTestServer } from '../setup/test-server'
import { Express } from 'express'

describe('Auth API', () => {
  let app: Express

  beforeAll(async () => {
    app = await createTestServer()
  })

  describe('POST /api/auth/register', () => {
    it('should create new user account', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'newuser@test.com', password: 'password123' })
        .expect(201)

      expect(response.body).toHaveProperty('id')
      expect(response.body.email).toBe('newuser@test.com')
    })
  })

  describe('POST /api/auth/login', () => {
    it('should return JWT token on valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password123' })
        .expect(200)

      expect(response.body).toHaveProperty('token')
      expect(response.body).toHaveProperty('user')
      expect(response.body.user.email).toBe('test@example.com')
    })
  })

  describe('GET /api/auth/me', () => {
    it('should return current user', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(200)

      expect(response.body).toHaveProperty('id')
      expect(response.body).toHaveProperty('email')
      expect(response.body).toHaveProperty('name')
    })
  })
})
