import { test, expect } from '@playwright/test';
import { TestLogger, AuthHelper, getEnvironmentConfig, waitForPageLoad } from '../utils/test-helpers';

test.describe('Authentication Components Tests', () => {
  let logger: TestLogger;
  let authHelper: AuthHelper;

  test.beforeEach(async ({ page }) => {
    const config = getEnvironmentConfig();
    logger = new TestLogger(page, 'Authentication Tests');
    authHelper = new AuthHelper(page, logger);

    await logger.logStep(`Khởi tạo test trên môi trường: ${config.env}`, async () => {
      await page.goto('/');
      await waitForPageLoad(page);
    });
  });

  test('Đăng nhập thành công với thông tin hợp lệ', async ({ page }) => {
    await logger.logStep('Kiểm tra trang chủ đã load', async () => {
      await expect(page).toHaveTitle(/AI Assisted Landing Page/);
    });

    await authHelper.login('test@example.com', 'password123');

    await logger.logStep('Xác nhận đăng nhập thành công', async () => {
      await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
      await expect(page.locator('[data-testid="user-email"]')).toContainText('test@example.com');
    });

    await logger.logSuccess('Đăng nhập thành công');
  });

  test('Đăng nhập thất bại với thông tin không hợp lệ', async ({ page }) => {
    await logger.logStep('Thử đăng nhập với thông tin sai', async () => {
      await page.click('[data-testid="login-button"]');
      await page.fill('[data-testid="username-input"]', 'wronguser');
      await page.fill('[data-testid="password-input"]', 'wrongpassword');
      await page.click('[data-testid="submit-login"]');
    });

    await logger.logStep('Xác nhận hiển thị lỗi', async () => {
      await expect(page.locator('[data-testid="login-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="login-error"]')).toContainText('Invalid credentials');
    });

    await logger.logSuccess('Xử lý lỗi đăng nhập đúng cách');
  });

  test('Đăng xuất thành công', async ({ page }) => {
    // Đăng nhập trước
    await authHelper.login();

    await logger.logStep('Xác nhận đã đăng nhập', async () => {
      await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
    });

    await authHelper.logout();

    await logger.logStep('Xác nhận đăng xuất thành công', async () => {
      await expect(page.locator('[data-testid="login-button"]')).toBeVisible();
      await expect(page.locator('[data-testid="user-menu"]')).not.toBeVisible();
    });

    await logger.logSuccess('Đăng xuất thành công');
  });

  test('Kiểm tra validation form đăng nhập', async ({ page }) => {
    await logger.logStep('Mở modal đăng nhập', async () => {
      await page.click('[data-testid="login-button"]');
    });

    await logger.logStep('Thử submit form trống', async () => {
      await page.click('[data-testid="submit-login"]');
    });

    await logger.logStep('Kiểm tra validation errors', async () => {
      await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="password-error"]')).toBeVisible();
    });

    await logger.logStep('Nhập email không hợp lệ', async () => {
      await page.fill('[data-testid="username-input"]', 'a');
      await page.click('[data-testid="submit-login"]');
    });

    await logger.logStep('Kiểm tra validation email', async () => {
      await expect(page.locator('[data-testid="email-error"]')).toContainText('Invalid email format');
    });

    await logger.logSuccess('Form validation hoạt động đúng');
  });

  test('Kiểm tra session persistence', async ({ page, context }) => {
    await authHelper.login();

    await logger.logStep('Mở tab mới', async () => {
      const newPage = await context.newPage();
      await newPage.goto('/');
      await waitForPageLoad(newPage);
    });

    await logger.logStep('Kiểm tra session được duy trì', async () => {
      const newPage = context.pages()[1];
      await expect(newPage.locator('[data-testid="user-menu"]')).toBeVisible();
    });

    await logger.logSuccess('Session persistence hoạt động đúng');
  });
});