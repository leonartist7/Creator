import { test, expect } from '@playwright/test'

test.describe('Project Creation Workflow', () => {
  test('should create new ebook project with complete workflow', async ({ page }) => {
    // Navigate to application
    await page.goto('/')

    // Verify landing page loaded
    await expect(page).toHaveTitle(/Creative Mastery Platform/i)

    // Click "New Project" button
    await page.click('button:has-text("New Project")')

    // Select project type
    await page.click('button[data-type="ebook"]')

    // Fill in project details
    await page.fill('input[name="projectName"]', 'My First Ebook')
    await page.fill('textarea[name="description"]', 'A test ebook project')

    // Submit project creation
    await page.click('button[type="submit"]:has-text("Create Project")')

    // Verify redirect to project editor
    await expect(page).toHaveURL(/\/projects\/[a-zA-Z0-9-]+/)

    // Verify project details are displayed
    await expect(page.locator('h1')).toContainText('My First Ebook')

    // Verify editor is loaded
    await expect(page.locator('.editor-container')).toBeVisible()
  })

  test('should create course project and navigate to course builder', async ({ page }) => {
    await page.goto('/')

    await page.click('button:has-text("New Project")')
    await page.click('button[data-type="course"]')

    await page.fill('input[name="projectName"]', 'Photography Masterclass')
    await page.fill('input[name="duration"]', '8')
    await page.selectOption('select[name="level"]', 'intermediate')

    await page.click('button[type="submit"]:has-text("Create Project")')

    // Should show course builder interface
    await expect(page.locator('.course-builder')).toBeVisible()
    await expect(page.locator('.module-list')).toBeVisible()
  })

  test('should validate required fields before creating project', async ({ page }) => {
    await page.goto('/')

    await page.click('button:has-text("New Project")')
    await page.click('button[data-type="ebook"]')

    // Try to submit without filling required fields
    await page.click('button[type="submit"]:has-text("Create Project")')

    // Should show validation errors
    await expect(page.locator('.error-message')).toBeVisible()
    await expect(page.locator('input[name="projectName"]:invalid')).toBeVisible()
  })
})
