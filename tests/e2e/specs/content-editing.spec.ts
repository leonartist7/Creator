import { test, expect } from '@playwright/test'

test.describe('Content Editing Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: Navigate to app and create a test project
    await page.goto('/')
    await page.click('button:has-text("New Project")')
    await page.click('button[data-type="ebook"]')
    await page.fill('input[name="projectName"]', 'Editing Test Project')
    await page.click('button[type="submit"]:has-text("Create Project")')
    await page.waitForURL(/\/projects\/[a-zA-Z0-9-]+/)
  })

  test('should edit content using rich text editor', async ({ page }) => {
    const editor = page.locator('.editor-container')

    // Type content
    await editor.fill('Chapter 1: Introduction\n\nThis is the opening paragraph.')

    // Format text as bold
    await page.keyboard.press('Control+A')
    await page.click('button[aria-label="Bold"]')

    // Verify formatting applied
    await expect(page.locator('strong')).toContainText('Chapter 1: Introduction')

    // Add italic formatting
    await editor.click()
    await page.keyboard.press('Control+A')
    await page.click('button[aria-label="Italic"]')

    // Verify italic applied
    await expect(page.locator('em')).toBeVisible()
  })

  test('should create and manage chapters', async ({ page }) => {
    // Add first chapter
    await page.click('button:has-text("Add Chapter")')
    await page.fill('input[placeholder="Chapter Title"]', 'Chapter 1: The Beginning')
    await page.keyboard.press('Enter')

    // Verify chapter appears in sidebar
    await expect(page.locator('.chapter-list')).toContainText('Chapter 1: The Beginning')

    // Add second chapter
    await page.click('button:has-text("Add Chapter")')
    await page.fill('input[placeholder="Chapter Title"]', 'Chapter 2: The Journey')
    await page.keyboard.press('Enter')

    // Verify both chapters present
    await expect(page.locator('.chapter-item')).toHaveCount(2)

    // Reorder chapters using drag and drop
    const chapter2 = page.locator('.chapter-item:has-text("Chapter 2")')
    const chapter1 = page.locator('.chapter-item:has-text("Chapter 1")')

    await chapter2.dragTo(chapter1)

    // Verify order changed
    const firstChapter = page.locator('.chapter-item').first()
    await expect(firstChapter).toContainText('Chapter 2')
  })

  test('should autosave content changes', async ({ page }) => {
    const editor = page.locator('.editor-container')

    // Type content
    await editor.fill('This content should be autosaved.')

    // Wait for autosave indicator
    await expect(page.locator('.autosave-indicator')).toContainText('Saved', { timeout: 5000 })

    // Reload page
    await page.reload()

    // Verify content persisted
    await expect(editor).toContainText('This content should be autosaved.')
  })

  test('should use command palette for quick actions', async ({ page }) => {
    // Open command palette
    await page.keyboard.press('Control+K')

    // Verify palette opened
    await expect(page.locator('.command-palette')).toBeVisible()

    // Type command
    await page.fill('input[placeholder*="command"]', 'bold')

    // Select "Toggle Bold" command
    await page.locator('.command-item:has-text("Bold")').click()

    // Verify bold formatting applied
    await expect(page.locator('strong')).toBeVisible()
  })

  test('should insert images into content', async ({ page }) => {
    // Click insert image button
    await page.click('button[aria-label="Insert Image"]')

    // Verify image upload dialog opened
    await expect(page.locator('.image-upload-dialog')).toBeVisible()

    // Upload image (using test file)
    await page.setInputFiles('input[type="file"]', {
      name: 'test-image.png',
      mimeType: 'image/png',
      buffer: Buffer.from('fake-image-data')
    })

    // Wait for upload
    await expect(page.locator('img')).toBeVisible({ timeout: 10000 })

    // Verify image inserted in editor
    await expect(page.locator('.editor-container img')).toBeVisible()
  })

  test('should track word count and reading time', async ({ page }) => {
    const editor = page.locator('.editor-container')

    // Type content
    await editor.fill('This is a test sentence with exactly ten words here.')

    // Verify word count updated
    await expect(page.locator('.word-count')).toContainText('10 words')

    // Verify reading time calculated
    await expect(page.locator('.reading-time')).toContainText('min')
  })
})
