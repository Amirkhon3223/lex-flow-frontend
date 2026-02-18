import { test, expect } from '@playwright/test';

test.describe('Auth Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login form by default', async ({ page }) => {
    await expect(page.locator('#login-email')).toBeVisible();
    await expect(page.locator('#login-password')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show validation errors on empty submit', async ({ page }) => {
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text=email')).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.locator('#login-email').fill('invalid-email');
    await page.locator('#login-password').fill('Password123!');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('#login-email')).toBeVisible();
  });

  test('should validate minimum password length', async ({ page }) => {
    await page.locator('#login-email').fill('test@example.com');
    await page.locator('#login-password').fill('short');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('#login-password')).toBeVisible();
  });

  test('should switch to register tab', async ({ page }) => {
    await page.locator('button[role="tab"][value="register"]').click();
    await expect(page.locator('input[type="email"][placeholder="you@lawfirm.com"]')).toBeVisible();
  });

  test('should have forgot password link', async ({ page }) => {
    const forgotButton = page.locator('button').filter({ hasText: /forgot|забыл|пароль/i });
    await expect(forgotButton).toBeVisible();
  });

  test('should have remember me checkbox', async ({ page }) => {
    await expect(page.locator('#remember')).toBeVisible();
  });
});

test.describe('Register Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.locator('button[role="tab"][value="register"]').click();
  });

  test('should display register form fields', async ({ page }) => {
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('#terms')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should require terms checkbox', async ({ page }) => {
    await expect(page.locator('#terms')).not.toBeChecked();
  });
});

test.describe('Auth Redirect', () => {
  test('should redirect unauthenticated user to login', async ({ page }) => {
    await page.goto('/');
    await page.waitForURL(/\/login/);
    await expect(page).toHaveURL(/\/login/);
  });

  test('should redirect from /clients to login', async ({ page }) => {
    await page.goto('/clients');
    await page.waitForURL(/\/login/);
    await expect(page).toHaveURL(/\/login/);
  });

  test('should redirect from /cases to login', async ({ page }) => {
    await page.goto('/cases');
    await page.waitForURL(/\/login/);
    await expect(page).toHaveURL(/\/login/);
  });
});
