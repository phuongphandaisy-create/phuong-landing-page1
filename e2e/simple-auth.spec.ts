import { test, expect } from '@playwright/test';

test.describe('Simple Authentication Test', () => {
  test('Kiểm tra nút đăng nhập có hiển thị', async ({ page }) => {
    // Đi đến trang chủ
    await page.goto('/');
    
    // Đợi trang load
    await page.waitForLoadState('networkidle');
    
    // Kiểm tra nút đăng nhập có hiển thị
    const loginButton = page.locator('[data-testid="login-button"]');
    await expect(loginButton).toBeVisible();
    
    console.log('✅ Nút đăng nhập đã hiển thị');
  });

  test('Kiểm tra modal đăng nhập mở được', async ({ page }) => {
    // Đi đến trang chủ
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Click nút đăng nhập
    await page.click('[data-testid="login-button"]');
    
    // Kiểm tra modal đăng nhập hiển thị
    const loginModal = page.locator('[data-testid="login-modal"]');
    await expect(loginModal).toBeVisible();
    
    console.log('✅ Modal đăng nhập đã mở');
  });

  test('Kiểm tra form contact có hiển thị', async ({ page }) => {
    // Đi đến trang contact
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    
    // Kiểm tra form contact hiển thị
    const contactForm = page.locator('[data-testid="contact-form"]');
    await expect(contactForm).toBeVisible();
    
    console.log('✅ Form contact đã hiển thị');
  });
});