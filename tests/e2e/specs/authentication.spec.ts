import { test, expect } from '@playwright/test'

test.describe('Authentication Workflow', () => {
  test('should register new user account', async ({ page }) => {
    await page.goto('/')

    // Click "Sign Up" button
    await page.click('a:has-text("Sign Up")')

    // Fill in registration form
    await page.fill('input[name="email"]', 'newuser@test.com')
    await page.fill('input[name="password"]', 'SecurePassword123!')
    await page.fill('input[name="confirmPassword"]', 'SecurePassword123!')
    await page.fill('input[name="name"]', 'Test User')

    // Submit registration
    await page.click('button[type="submit"]:has-text("Create Account")')

    // Should redirect to dashboard after successful registration
    await expect(page).toHaveURL(/\/dashboard/)

    // Verify welcome message
    await expect(page.locator('.welcome-message')).toContainText('Welcome, Test User')
  })

  test('should login with existing credentials', async ({ page }) => {
    await page.goto('/')

    // Click "Login" button
    await page.click('a:has-text("Login")')

    // Fill in login form
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')

    // Submit login
    await page.click('button[type="submit"]:has-text("Login")')

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/)

    // Verify user is logged in
    await expect(page.locator('.user-menu')).toBeVisible()
  })

  test('should show validation errors for invalid login', async ({ page }) => {
    await page.goto('/')
    await page.click('a:has-text("Login")')

    // Try to login with invalid credentials
    await page.fill('input[name="email"]', 'wrong@example.com')
    await page.fill('input[name="password"]', 'wrongpassword')
    await page.click('button[type="submit"]:has-text("Login")')

    // Should show error message
    await expect(page.locator('.error-message')).toBeVisible()
    await expect(page.locator('.error-message')).toContainText('Invalid credentials')
  })

  test('should logout user', async ({ page }) => {
    // First login
    await page.goto('/')
    await page.click('a:has-text("Login")')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]:has-text("Login")')
    await expect(page).toHaveURL(/\/dashboard/)

    // Then logout
    await page.click('button[aria-label="User Menu"]')
    await page.click('button:has-text("Logout")')

    // Should redirect to home page
    await expect(page).toHaveURL('/')

    // Login button should be visible again
    await expect(page.locator('a:has-text("Login")')).toBeVisible()
  })

  test('should handle password reset flow', async ({ page }) => {
    await page.goto('/')
    await page.click('a:has-text("Login")')

    // Click "Forgot Password" link
    await page.click('a:has-text("Forgot Password")')

    // Enter email for password reset
    await page.fill('input[name="email"]', 'test@example.com')
    await page.click('button:has-text("Send Reset Link")')

    // Should show confirmation message
    await expect(page.locator('.success-message')).toBeVisible()
    await expect(page.locator('.success-message')).toContainText('reset link has been sent')
  })

  test('should persist session after page reload', async ({ page }) => {
    // Login
    await page.goto('/')
    await page.click('a:has-text("Login")')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]:has-text("Login")')
    await expect(page).toHaveURL(/\/dashboard/)

    // Reload page
    await page.reload()

    // Should still be logged in
    await expect(page).toHaveURL(/\/dashboard/)
    await expect(page.locator('.user-menu')).toBeVisible()
  })

  test('should protect authenticated routes', async ({ page }) => {
    // Try to access dashboard without logging in
    await page.goto('/dashboard')

    // Should redirect to login page
    await expect(page).toHaveURL(/\/login/)

    // Should show message about authentication requirement
    await expect(page.locator('.info-message')).toContainText('must be logged in')
  })
})
