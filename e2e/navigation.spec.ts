import { test, expect } from '@playwright/test';

test.describe('Public Pages', () => {
  test('should load privacy policy page', async ({ page }) => {
    await page.goto('/privacy-policy');
    await expect(page).toHaveURL(/privacy-policy/);
  });

  test('should load terms of service page', async ({ page }) => {
    await page.goto('/terms-of-service');
    await expect(page).toHaveURL(/terms-of-service/);
  });

  test('should load login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL(/login/);
    await expect(page.locator('#login-email')).toBeVisible();
  });
});

test.describe('Page Elements', () => {
  test('should have language selector', async ({ page }) => {
    await page.goto('/login');
    const langSelector = page.locator('button').filter({ hasText: /ru|en|tj/i }).first();
    await expect(langSelector).toBeVisible();
  });

  test('should have LexFlow branding', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('text=LexFlow')).toBeVisible();
  });
});
