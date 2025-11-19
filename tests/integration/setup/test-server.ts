import express, { Express } from 'express'

// Mock implementation - will be replaced with actual app setup
export async function createTestServer(): Promise<Express> {
  const app = express()

  app.use(express.json())

  // Mock routes for testing
  // These will be replaced with actual route imports once we integrate with real backend

  // Auth routes
  app.post('/api/auth/register', (req, res) => {
    res.status(201).json({ id: 'test-user-id', email: req.body.email })
  })

  app.post('/api/auth/login', (req, res) => {
    res.json({ token: 'mock-jwt-token', user: { id: 'test-user-id', email: req.body.email } })
  })

  app.get('/api/auth/me', (req, res) => {
    res.json({ id: 'test-user-id', email: 'test@example.com', name: 'Test User' })
  })

  // Project routes
  app.get('/api/projects', (req, res) => {
    res.json([{ id: '1', name: 'Test Project', type: 'ebook' }])
  })

  app.post('/api/projects', (req, res) => {
    res.status(201).json({ id: 'new-project-id', ...req.body })
  })

  app.get('/api/projects/:id', (req, res) => {
    res.json({ id: req.params.id, name: 'Test Project', type: 'ebook' })
  })

  app.put('/api/projects/:id', (req, res) => {
    res.json({ id: req.params.id, ...req.body })
  })

  app.delete('/api/projects/:id', (req, res) => {
    res.status(204).send()
  })

  // AI routes
  app.post('/api/ai/generate-outline', (req, res) => {
    res.json({ outline: [{ title: 'Chapter 1', summary: 'Introduction' }] })
  })

  app.post('/api/ai/improve-text', (req, res) => {
    res.json({ original: req.body.text, improved: req.body.text + ' (improved)' })
  })

  app.post('/api/ai/generate-ideas', (req, res) => {
    res.json({ ideas: ['Idea 1', 'Idea 2', 'Idea 3'] })
  })

  // Export route
  app.post('/api/export', (req, res) => {
    res.json({ url: 'https://example.com/export/file.pdf', format: req.body.format })
  })

  return app
}
