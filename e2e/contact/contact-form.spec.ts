import { test, expect } from '@playwright/test';
import { TestLogger, ContactHelper, getEnvironmentConfig, waitForPageLoad } from '../utils/test-helpers';

test.describe('Contact Form Submission Tests', () => {
  let logger: TestLogger;
  let contactHelper: ContactHelper;

  test.beforeEach(async ({ page }) => {
    const config = getEnvironmentConfig();
    logger = new TestLogger(page, 'Contact Form Tests');
    contactHelper = new ContactHelper(page, logger);

    await logger.logStep(`Khởi tạo test trên môi trường: ${config.env}`, async () => {
      await page.goto('/');
      await waitForPageLoad(page);
    });
  });

  test('Gửi form liên hệ thành công', async ({ page }) => {
    const contactData = {
      name: 'Nguyễn Văn Test',
      email: 'test@example.com',
      message: 'Đây là tin nhắn test từ automation testing. Xin chào!'
    };

    await contactHelper.submitContactForm(
      contactData.name,
      contactData.email,
      contactData.message
    );

    await logger.logStep('Xác nhận thông báo thành công', async () => {
      await expect(page.locator('[data-testid="contact-success-message"]')).toContainText('Thank you for your message');
    });

    await logger.logStep('Kiểm tra form được reset', async () => {
      await expect(page.locator('[data-testid="contact-name-input"]')).toHaveValue('');
      await expect(page.locator('[data-testid="contact-email-input"]')).toHaveValue('');
      await expect(page.locator('[data-testid="contact-message-input"]')).toHaveValue('');
    });

    await logger.logSuccess(`Form liên hệ được gửi thành công với tên: ${contactData.name}`);
  });

  test('Validation form liên hệ - các trường bắt buộc', async ({ page }) => {
    await logger.logStep('Điều hướng đến trang liên hệ', async () => {
      await page.goto('/contact');
    });

    await logger.logStep('Thử gửi form trống', async () => {
      await page.click('[data-testid="submit-contact-form"]');
    });

    await logger.logStep('Kiểm tra validation errors', async () => {
      await expect(page.locator('[data-testid="name-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="message-error"]')).toBeVisible();
    });

    await logger.logSuccess('Validation các trường bắt buộc hoạt động đúng');
  });

  test('Validation email không hợp lệ', async ({ page }) => {
    await logger.logStep('Điều hướng đến trang liên hệ', async () => {
      await page.goto('/contact');
    });

    await logger.logStep('Nhập email không hợp lệ', async () => {
      await page.fill('[data-testid="contact-name-input"]', 'Test User');
      await page.fill('[data-testid="contact-email-input"]', 'invalid-email');
      await page.fill('[data-testid="contact-message-input"]', 'Test message');
      await page.click('[data-testid="submit-contact-form"]');
    });

    await logger.logStep('Kiểm tra validation email', async () => {
      await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="email-error"]')).toContainText('Invalid email format');
    });

    await logger.logSuccess('Validation email hoạt động đúng');
  });

  test('Validation độ dài tin nhắn', async ({ page }) => {
    await logger.logStep('Điều hướng đến trang liên hệ', async () => {
      await page.goto('/contact');
    });

    await logger.logStep('Nhập tin nhắn quá ngắn', async () => {
      await page.fill('[data-testid="contact-name-input"]', 'Test User');
      await page.fill('[data-testid="contact-email-input"]', 'test@example.com');
      await page.fill('[data-testid="contact-message-input"]', 'Hi');
      await page.click('[data-testid="submit-contact-form"]');
    });

    await logger.logStep('Kiểm tra validation tin nhắn', async () => {
      await expect(page.locator('[data-testid="message-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="message-error"]')).toContainText('Message must be at least 10 characters');
    });

    await logger.logSuccess('Validation độ dài tin nhắn hoạt động đúng');
  });

  test('Kiểm tra loading state khi gửi form', async ({ page }) => {
    await logger.logStep('Điều hướng đến trang liên hệ', async () => {
      await page.goto('/contact');
    });

    await logger.logStep('Nhập thông tin hợp lệ', async () => {
      await page.fill('[data-testid="contact-name-input"]', 'Test User');
      await page.fill('[data-testid="contact-email-input"]', 'test@example.com');
      await page.fill('[data-testid="contact-message-input"]', 'This is a test message for loading state.');
    });

    await logger.logStep('Click gửi và kiểm tra loading state', async () => {
      await page.click('[data-testid="submit-contact-form"]');
      
      // Kiểm tra loading state xuất hiện
      await expect(page.locator('[data-testid="submit-loading"]')).toBeVisible();
      await expect(page.locator('[data-testid="submit-contact-form"]')).toBeDisabled();
    });

    await logger.logStep('Chờ hoàn thành và kiểm tra kết quả', async () => {
      await expect(page.locator('[data-testid="contact-success-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="submit-contact-form"]')).toBeEnabled();
    });

    await logger.logSuccess('Loading state hoạt động đúng');
  });

  test('Kiểm tra character counter cho tin nhắn', async ({ page }) => {
    await logger.logStep('Điều hướng đến trang liên hệ', async () => {
      await page.goto('/contact');
    });

    await logger.logStep('Nhập tin nhắn và kiểm tra counter', async () => {
      const testMessage = 'This is a test message to check character counter functionality.';
      await page.fill('[data-testid="contact-message-input"]', testMessage);
      
      await expect(page.locator('[data-testid="message-counter"]')).toContainText(`${testMessage.length}`);
    });

    await logger.logStep('Kiểm tra giới hạn ký tự', async () => {
      const longMessage = 'a'.repeat(1001); // Giả sử giới hạn là 1000 ký tự
      await page.fill('[data-testid="contact-message-input"]', longMessage);
      
      const actualValue = await page.locator('[data-testid="contact-message-input"]').inputValue();
      expect(actualValue.length).toBeLessThanOrEqual(1000);
    });

    await logger.logSuccess('Character counter hoạt động đúng');
  });

  test('Kiểm tra accessibility của form', async ({ page }) => {
    await logger.logStep('Điều hướng đến trang liên hệ', async () => {
      await page.goto('/contact');
    });

    await logger.logStep('Kiểm tra labels và aria attributes', async () => {
      // Kiểm tra labels
      await expect(page.locator('label[for="contact-name"]')).toBeVisible();
      await expect(page.locator('label[for="contact-email"]')).toBeVisible();
      await expect(page.locator('label[for="contact-message"]')).toBeVisible();

      // Kiểm tra aria-required
      await expect(page.locator('[data-testid="contact-name-input"]')).toHaveAttribute('aria-required', 'true');
      await expect(page.locator('[data-testid="contact-email-input"]')).toHaveAttribute('aria-required', 'true');
      await expect(page.locator('[data-testid="contact-message-input"]')).toHaveAttribute('aria-required', 'true');
    });

    await logger.logStep('Kiểm tra keyboard navigation', async () => {
      await page.keyboard.press('Tab');
      await expect(page.locator('[data-testid="contact-name-input"]')).toBeFocused();
      
      await page.keyboard.press('Tab');
      await expect(page.locator('[data-testid="contact-email-input"]')).toBeFocused();
      
      await page.keyboard.press('Tab');
      await expect(page.locator('[data-testid="contact-message-input"]')).toBeFocused();
    });

    await logger.logSuccess('Accessibility của form đạt yêu cầu');
  });

  test('Kiểm tra responsive design của form', async ({ page }) => {
    await logger.logStep('Điều hướng đến trang liên hệ', async () => {
      await page.goto('/contact');
    });

    // Test mobile view
    await logger.logStep('Kiểm tra mobile view', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      await expect(page.locator('[data-testid="contact-form"]')).toBeVisible();
      
      // Kiểm tra form vẫn có thể sử dụng được trên mobile
      await page.fill('[data-testid="contact-name-input"]', 'Mobile Test');
      await expect(page.locator('[data-testid="contact-name-input"]')).toHaveValue('Mobile Test');
    });

    // Test tablet view
    await logger.logStep('Kiểm tra tablet view', async () => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await expect(page.locator('[data-testid="contact-form"]')).toBeVisible();
    });

    // Test desktop view
    await logger.logStep('Kiểm tra desktop view', async () => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await expect(page.locator('[data-testid="contact-form"]')).toBeVisible();
    });

    await logger.logSuccess('Responsive design hoạt động đúng trên tất cả devices');
  });
});