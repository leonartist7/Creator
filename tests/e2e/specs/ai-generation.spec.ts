import { test, expect } from '@playwright/test'

test.describe('AI Generation Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: Navigate to app and create a test project
    await page.goto('/')
    await page.click('button:has-text("New Project")')
    await page.click('button[data-type="ebook"]')
    await page.fill('input[name="projectName"]', 'AI Test Project')
    await page.click('button[type="submit"]:has-text("Create Project")')
    await page.waitForURL(/\/projects\/[a-zA-Z0-9-]+/)
  })

  test('should generate book outline using AI', async ({ page }) => {
    // Open AI tools panel
    await page.click('button[aria-label="AI Tools"]')

    // Select "Generate Outline" tool
    await page.click('button:has-text("Generate Outline")')

    // Fill in outline parameters
    await page.fill('input[name="topic"]', 'Mastering Photography')
    await page.fill('input[name="chapters"]', '10')
    await page.selectOption('select[name="tone"]', 'professional')

    // Generate outline
    await page.click('button:has-text("Generate")')

    // Wait for AI generation
    await expect(page.locator('.loading-indicator')).toBeVisible()
    await expect(page.locator('.loading-indicator')).toBeHidden({ timeout: 30000 })

    // Verify outline was generated
    await expect(page.locator('.outline-preview')).toBeVisible()
    await expect(page.locator('.chapter-item')).toHaveCount(10)

    // Insert outline into project
    await page.click('button:has-text("Insert Outline")')

    // Verify outline inserted into editor
    await expect(page.locator('.editor-container')).toContainText('Chapter 1')
  })

  test('should improve text using AI', async ({ page }) => {
    // Type some text in editor
    await page.locator('.editor-container').fill('This is a basic sentence that needs improvement.')

    // Select the text
    await page.locator('.editor-container').click()
    await page.keyboard.press('Control+A')

    // Open AI tools
    await page.click('button[aria-label="AI Tools"]')
    await page.click('button:has-text("Improve Text")')

    // Generate improved version
    await page.click('button:has-text("Enhance")')

    // Wait for AI response
    await expect(page.locator('.improved-text-preview')).toBeVisible({ timeout: 30000 })

    // Verify improved text is different from original
    const improvedText = await page.locator('.improved-text-preview').textContent()
    expect(improvedText).not.toBe('This is a basic sentence that needs improvement.')

    // Apply improved text
    await page.click('button:has-text("Apply")')

    // Verify text was replaced in editor
    await expect(page.locator('.editor-container')).toContainText(improvedText || '')
  })

  test('should generate product ideas for different niches', async ({ page }) => {
    // Open AI brainstorming tool
    await page.click('button[aria-label="AI Tools"]')
    await page.click('button:has-text("Generate Ideas")')

    // Select niche
    await page.fill('input[name="niche"]', 'productivity')

    // Generate ideas
    await page.click('button:has-text("Generate Ideas")')

    // Wait for results
    await expect(page.locator('.ideas-list')).toBeVisible({ timeout: 30000 })

    // Verify multiple ideas generated
    await expect(page.locator('.idea-card')).toHaveCount(5)

    // Select an idea
    await page.locator('.idea-card').first().click()

    // Verify idea details shown
    await expect(page.locator('.idea-details')).toBeVisible()
    await expect(page.locator('.idea-details')).toContainText('productivity')
  })

  test('should handle AI generation errors gracefully', async ({ page }) => {
    // Open AI tools
    await page.click('button[aria-label="AI Tools"]')
    await page.click('button:has-text("Generate Outline")')

    // Leave required fields empty
    await page.click('button:has-text("Generate")')

    // Should show validation error
    await expect(page.locator('.error-message')).toBeVisible()
    await expect(page.locator('.error-message')).toContainText('required')
  })
})
