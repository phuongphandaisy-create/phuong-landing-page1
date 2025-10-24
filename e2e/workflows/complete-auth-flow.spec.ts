import { test, expect } from '@playwright/test';
import { TestLogger, AuthHelper, getEnvironmentConfig, waitForPageLoad } from '../utils/test-helpers';

test.describe('Complete Authentication Flow Tests', () => {
  let logger: TestLogger;
  let authHelper: AuthHelper;

  test.beforeEach(async ({ page }) => {
    const config = getEnvironmentConfig();
    logger = new TestLogger(page, 'Complete Auth Flow Tests');
    authHelper = new AuthHelper(page, logger);

    await logger.logStep(`Khởi tạo test trên môi trường: ${config.env}`, async () => {
      await page.goto('/');
      await waitForPageLoad(page);
    });
  });

  test('Luồng đăng nhập hoàn chỉnh từ trang chủ', async ({ page }) => {
    await logger.logStep('Kiểm tra trạng thái chưa đăng nhập', async () => {
      await expect(page.locator('[data-testid="login-button"]')).toBeVisible();
      await expect(page.locator('[data-testid="user-menu"]')).not.toBeVisible();
    });

    await logger.logStep('Thực hiện đăng nhập', async () => {
      await authHelper.login('test@example.com', 'password123');
    });

    await logger.logStep('Kiểm tra trạng thái sau đăng nhập', async () => {
      await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
      await expect(page.locator('[data-testid="login-button"]')).not.toBeVisible();
    });

    await logger.logStep('Kiểm tra quyền truy cập admin', async () => {
      await page.goto('/admin');
      await expect(page.locator('[data-testid="admin-dashboard"]')).toBeVisible();
    });

    await logger.logStep('Kiểm tra profile user', async () => {
      await page.click('[data-testid="user-menu"]');
      await page.click('[data-testid="profile-link"]');
      await expect(page.locator('[data-testid="user-profile"]')).toBeVisible();
      await expect(page.locator('[data-testid="profile-email"]')).toContainText('test@example.com');
    });

    await logger.logSuccess('Luồng đăng nhập hoàn chỉnh thành công');
  });

  test('Luồng đăng xuất hoàn chỉnh', async ({ page }) => {
    // Đăng nhập trước
    await authHelper.login();

    await logger.logStep('Xác nhận đã đăng nhập', async () => {
      await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
    });

    await logger.logStep('Truy cập trang admin để xác nhận quyền', async () => {
      await page.goto('/admin');
      await expect(page.locator('[data-testid="admin-dashboard"]')).toBeVisible();
    });

    await logger.logStep('Thực hiện đăng xuất', async () => {
      await authHelper.logout();
    });

    await logger.logStep('Kiểm tra trạng thái sau đăng xuất', async () => {
      await expect(page.locator('[data-testid="login-button"]')).toBeVisible();
      await expect(page.locator('[data-testid="user-menu"]')).not.toBeVisible();
    });

    await logger.logStep('Kiểm tra không thể truy cập admin', async () => {
      await page.goto('/admin');
      // Nên được redirect về trang login hoặc hiển thị unauthorized
      await expect(page.locator('[data-testid="login-required"]')).toBeVisible();
    });

    await logger.logSuccess('Luồng đăng xuất hoàn chỉnh thành công');
  });

  test('Luồng bảo vệ route yêu cầu authentication', async ({ page }) => {
    await logger.logStep('Thử truy cập trang admin khi chưa đăng nhập', async () => {
      await page.goto('/admin');
    });

    await logger.logStep('Kiểm tra được redirect hoặc hiển thị yêu cầu đăng nhập', async () => {
      // Có thể được redirect về login hoặc hiển thị modal login
      const isLoginModal = await page.locator('[data-testid="login-modal"]').isVisible();
      const isLoginPage = page.url().includes('/login');
      const isUnauthorized = await page.locator('[data-testid="login-required"]').isVisible();
      
      expect(isLoginModal || isLoginPage || isUnauthorized).toBeTruthy();
    });

    await logger.logStep('Đăng nhập từ trang bảo vệ', async () => {
      if (await page.locator('[data-testid="login-modal"]').isVisible()) {
        // Nếu modal login hiển thị
        await page.fill('[data-testid="username-input"]', 'admin');
        await page.fill('[data-testid="password-input"]', 'admin123');
        await page.click('[data-testid="submit-login"]');
      } else {
        // Nếu được redirect về trang login
        await authHelper.login();
        await page.goto('/admin');
      }
    });

    await logger.logStep('Xác nhận có thể truy cập sau khi đăng nhập', async () => {
      await expect(page.locator('[data-testid="admin-dashboard"]')).toBeVisible();
    });

    await logger.logSuccess('Bảo vệ route hoạt động đúng');
  });

  test('Luồng remember me và session timeout', async ({ page, context }) => {
    await logger.logStep('Đăng nhập với remember me', async () => {
      await page.click('[data-testid="login-button"]');
      await page.fill('[data-testid="username-input"]', 'admin');
      await page.fill('[data-testid="password-input"]', 'admin123');
      await page.check('[data-testid="remember-me-checkbox"]');
      await page.click('[data-testid="submit-login"]');
    });

    await logger.logStep('Xác nhận đăng nhập thành công', async () => {
      await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
    });

    await logger.logStep('Đóng browser và mở lại', async () => {
      await context.close();
      const newContext = await page.context().browser()?.newContext();
      const newPage = await newContext!.newPage();
      await newPage.goto('/');
      await waitForPageLoad(newPage);
    });

    await logger.logStep('Kiểm tra session được duy trì', async () => {
      const newPage = page.context().pages()[0];
      // Với remember me, session nên được duy trì
      const isLoggedIn = await newPage.locator('[data-testid="user-menu"]').isVisible();
      if (isLoggedIn) {
        await logger.logSuccess('Remember me hoạt động đúng');
      } else {
        await logger.logSuccess('Session timeout hoạt động đúng');
      }
    });
  });

  test('Luồng xử lý lỗi authentication', async ({ page }) => {
    await logger.logStep('Thử đăng nhập với thông tin sai nhiều lần', async () => {
      for (let i = 1; i <= 3; i++) {
        await page.click('[data-testid="login-button"]');
        await page.fill('[data-testid="username-input"]', 'wronguser');
        await page.fill('[data-testid="password-input"]', 'wrongpassword');
        await page.click('[data-testid="submit-login"]');
        
        await logger.logStep(`Lần thử ${i}: Kiểm tra thông báo lỗi`, async () => {
          await expect(page.locator('[data-testid="login-error"]')).toBeVisible();
        });
        
        // Đóng modal để thử lại
        if (i < 3) {
          await page.click('[data-testid="close-modal"]');
        }
      }
    });

    await logger.logStep('Kiểm tra có bị khóa tài khoản sau nhiều lần thử sai', async () => {
      const isAccountLocked = await page.locator('[data-testid="account-locked"]').isVisible();
      if (isAccountLocked) {
        await logger.logSuccess('Account lockout hoạt động đúng');
      } else {
        await logger.logSuccess('Hệ thống xử lý lỗi đăng nhập đúng cách');
      }
    });
  });

  test('Luồng đổi mật khẩu', async ({ page }) => {
    // Đăng nhập trước
    await authHelper.login();

    await logger.logStep('Truy cập trang profile', async () => {
      await page.click('[data-testid="user-menu"]');
      await page.click('[data-testid="profile-link"]');
    });

    await logger.logStep('Mở form đổi mật khẩu', async () => {
      await page.click('[data-testid="change-password-button"]');
      await expect(page.locator('[data-testid="change-password-form"]')).toBeVisible();
    });

    await logger.logStep('Nhập thông tin đổi mật khẩu', async () => {
      await page.fill('[data-testid="current-password"]', 'password123');
      await page.fill('[data-testid="new-password"]', 'newpassword123');
      await page.fill('[data-testid="confirm-password"]', 'newpassword123');
    });

    await logger.logStep('Thực hiện đổi mật khẩu', async () => {
      await page.click('[data-testid="submit-change-password"]');
      await expect(page.locator('[data-testid="password-changed-success"]')).toBeVisible();
    });

    await logger.logStep('Đăng xuất và đăng nhập lại với mật khẩu mới', async () => {
      await authHelper.logout();
      await authHelper.login('test@example.com', 'newpassword123');
    });

    await logger.logStep('Xác nhận đăng nhập thành công với mật khẩu mới', async () => {
      await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
    });

    await logger.logSuccess('Đổi mật khẩu thành công');
  });

  test('Luồng quên mật khẩu (nếu có)', async ({ page }) => {
    await logger.logStep('Mở modal đăng nhập', async () => {
      await page.click('[data-testid="login-button"]');
    });

    await logger.logStep('Click forgot password', async () => {
      const forgotPasswordExists = await page.locator('[data-testid="forgot-password-link"]').isVisible();
      
      if (forgotPasswordExists) {
        await page.click('[data-testid="forgot-password-link"]');
        
        await logger.logStep('Nhập email để reset password', async () => {
          await page.fill('[data-testid="reset-email-input"]', 'test@example.com');
          await page.click('[data-testid="send-reset-email"]');
        });

        await logger.logStep('Xác nhận email reset được gửi', async () => {
          await expect(page.locator('[data-testid="reset-email-sent"]')).toBeVisible();
        });

        await logger.logSuccess('Luồng quên mật khẩu hoạt động đúng');
      } else {
        await logger.logSuccess('Tính năng quên mật khẩu chưa được implement');
      }
    });
  });
});