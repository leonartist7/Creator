import { test, expect } from '@playwright/test'

test.describe('Export Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: Navigate to app and create a test project with content
    await page.goto('/')
    await page.click('button:has-text("New Project")')
    await page.click('button[data-type="ebook"]')
    await page.fill('input[name="projectName"]', 'Export Test Project')
    await page.click('button[type="submit"]:has-text("Create Project")')
    await page.waitForURL(/\/projects\/[a-zA-Z0-9-]+/)

    // Add some content
    await page.locator('.editor-container').fill('Chapter 1: Test Content\n\nThis is test content for export.')
    await expect(page.locator('.autosave-indicator')).toContainText('Saved', { timeout: 5000 })
  })

  test('should export project as PDF', async ({ page }) => {
    // Open export menu
    await page.click('button:has-text("Export")')

    // Verify export dialog opened
    await expect(page.locator('.export-dialog')).toBeVisible()

    // Select PDF format
    await page.click('button[data-format="pdf"]')

    // Configure PDF options
    await page.selectOption('select[name="pageSize"]', 'A4')
    await page.selectOption('select[name="orientation"]', 'portrait')
    await page.check('input[name="includeTableOfContents"]')

    // Start export
    const downloadPromise = page.waitForEvent('download')
    await page.click('button:has-text("Export PDF")')

    // Wait for download
    const download = await downloadPromise

    // Verify file downloaded
    expect(download.suggestedFilename()).toMatch(/\.pdf$/)
    expect(download.suggestedFilename()).toContain('Export Test Project')
  })

  test('should export project as EPUB', async ({ page }) => {
    // Open export menu
    await page.click('button:has-text("Export")')

    // Select EPUB format
    await page.click('button[data-format="epub"]')

    // Configure EPUB metadata
    await page.fill('input[name="author"]', 'Test Author')
    await page.fill('input[name="publisher"]', 'Test Publisher')
    await page.fill('input[name="isbn"]', '978-1234567890')

    // Start export
    const downloadPromise = page.waitForEvent('download')
    await page.click('button:has-text("Export EPUB")')

    // Wait for download
    const download = await downloadPromise

    // Verify EPUB file downloaded
    expect(download.suggestedFilename()).toMatch(/\.epub$/)
  })

  test('should export project as DOCX', async ({ page }) => {
    // Open export menu
    await page.click('button:has-text("Export")')

    // Select DOCX format
    await page.click('button[data-format="docx"]')

    // Configure Word options
    await page.check('input[name="includeComments"]')
    await page.selectOption('select[name="styleSet"]', 'professional')

    // Start export
    const downloadPromise = page.waitForEvent('download')
    await page.click('button:has-text("Export DOCX")')

    // Wait for download
    const download = await downloadPromise

    // Verify DOCX file downloaded
    expect(download.suggestedFilename()).toMatch(/\.docx$/)
  })

  test('should export project as Markdown', async ({ page }) => {
    // Open export menu
    await page.click('button:has-text("Export")')

    // Select Markdown format
    await page.click('button[data-format="markdown"]')

    // Configure Markdown options
    await page.check('input[name="includeFrontmatter"]')
    await page.selectOption('select[name="headingStyle"]', 'atx')

    // Start export
    const downloadPromise = page.waitForEvent('download')
    await page.click('button:has-text("Export Markdown")')

    // Wait for download
    const download = await downloadPromise

    // Verify Markdown file downloaded
    expect(download.suggestedFilename()).toMatch(/\.md$/)
  })

  test('should show export preview before downloading', async ({ page }) => {
    // Open export menu
    await page.click('button:has-text("Export")')

    // Select PDF format
    await page.click('button[data-format="pdf"]')

    // Click preview button
    await page.click('button:has-text("Preview")')

    // Verify preview panel opened
    await expect(page.locator('.export-preview')).toBeVisible()

    // Verify content preview shows
    await expect(page.locator('.export-preview')).toContainText('Chapter 1: Test Content')

    // Close preview
    await page.click('button:has-text("Close Preview")')
  })

  test('should handle export errors gracefully', async ({ page }) => {
    // Open export menu
    await page.click('button:has-text("Export")')

    // Select PDF format
    await page.click('button[data-format="pdf"]')

    // Try to export empty project by clearing content first
    await page.locator('.editor-container').fill('')

    // Attempt export
    await page.click('button:has-text("Export PDF")')

    // Should show error message
    await expect(page.locator('.error-notification')).toBeVisible()
    await expect(page.locator('.error-notification')).toContainText('content')
  })

  test('should save export settings for future exports', async ({ page }) => {
    // Open export menu
    await page.click('button:has-text("Export")')

    // Configure settings
    await page.click('button[data-format="pdf"]')
    await page.selectOption('select[name="pageSize"]', 'Letter')
    await page.check('input[name="includeTableOfContents"]')
    await page.check('input[name="saveSettings"]')

    // Export
    const downloadPromise = page.waitForEvent('download')
    await page.click('button:has-text("Export PDF")')
    await downloadPromise

    // Close and reopen export dialog
    await page.keyboard.press('Escape')
    await page.click('button:has-text("Export")')
    await page.click('button[data-format="pdf"]')

    // Verify settings persisted
    expect(await page.locator('select[name="pageSize"]').inputValue()).toBe('Letter')
    expect(await page.locator('input[name="includeTableOfContents"]').isChecked()).toBe(true)
  })
})
