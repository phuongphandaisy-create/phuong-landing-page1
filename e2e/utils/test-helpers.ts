import { Page, expect } from '@playwright/test';

export class TestLogger {
  private page: Page;
  private testName: string;
  private stepCounter: number = 0;

  constructor(page: Page, testName: string) {
    this.page = page;
    this.testName = testName;
  }

  async logStep(step: string, action?: () => Promise<void>) {
    this.stepCounter++;
    const stepMessage = `[${this.testName}] Bước ${this.stepCounter}: ${step}`;
    
    console.log(`\n🔄 ${stepMessage}`);
    
    // Add visual indicator on page
    await this.page.evaluate((message) => {
      const indicator = document.createElement('div');
      indicator.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: #4CAF50;
        color: white;
        padding: 10px 15px;
        border-radius: 5px;
        z-index: 10000;
        font-family: Arial, sans-serif;
        font-size: 14px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      `;
      indicator.textContent = message;
      indicator.id = 'test-step-indicator';
      
      // Remove previous indicator
      const existing = document.getElementById('test-step-indicator');
      if (existing) existing.remove();
      
      document.body.appendChild(indicator);
      
      // Auto remove after 3 seconds
      setTimeout(() => {
        if (document.getElementById('test-step-indicator')) {
          indicator.remove();
        }
      }, 3000);
    }, stepMessage);

    if (action) {
      await action();
      console.log(`✅ ${stepMessage} - Hoàn thành`);
    }
    
    // Small delay for better visibility
    await this.page.waitForTimeout(1000);
  }

  async logSuccess(message: string) {
    console.log(`\n✅ [${this.testName}] THÀNH CÔNG: ${message}`);
  }

  async logError(message: string, error?: any) {
    console.log(`\n❌ [${this.testName}] LỖI: ${message}`);
    if (error) {
      console.log(`Chi tiết lỗi:`, error);
    }
  }
}

export class AuthHelper {
  private page: Page;
  private logger: TestLogger;

  constructor(page: Page, logger: TestLogger) {
    this.page = page;
    this.logger = logger;
  }

  async login(email: string = 'test@example.com', password: string = 'password123') {
    await this.logger.logStep('Mở modal đăng nhập', async () => {
      await this.page.click('[data-testid="login-button"]');
      await expect(this.page.locator('[data-testid="login-modal"]')).toBeVisible();
    });

    await this.logger.logStep('Nhập thông tin đăng nhập', async () => {
      await this.page.fill('[data-testid="username-input"]', email);
      await this.page.fill('[data-testid="password-input"]', password);
    });

    await this.logger.logStep('Thực hiện đăng nhập', async () => {
      await this.page.click('[data-testid="submit-login"]');
      await expect(this.page.locator('[data-testid="user-menu"]')).toBeVisible();
    });
  }

  async logout() {
    await this.logger.logStep('Đăng xuất', async () => {
      await this.page.click('[data-testid="user-menu"]');
      await this.page.click('[data-testid="logout-button"]');
      await expect(this.page.locator('[data-testid="login-button"]')).toBeVisible();
    });
  }
}

export class BlogHelper {
  private page: Page;
  private logger: TestLogger;

  constructor(page: Page, logger: TestLogger) {
    this.page = page;
    this.logger = logger;
  }

  async createBlog(title: string, content: string, excerpt?: string) {
    await this.logger.logStep('Điều hướng đến trang tạo blog', async () => {
      await this.page.goto('/admin/blog');
      await this.page.click('[data-testid="create-blog-button"]');
    });

    await this.logger.logStep('Nhập thông tin blog', async () => {
      await this.page.fill('[data-testid="blog-title-input"]', title);
      await this.page.fill('[data-testid="blog-content-input"]', content);
      if (excerpt) {
        await this.page.fill('[data-testid="blog-excerpt-input"]', excerpt);
      }
    });

    await this.logger.logStep('Lưu blog', async () => {
      await this.page.click('[data-testid="save-blog-button"]');
      await expect(this.page.locator('[data-testid="success-message"]')).toBeVisible();
    });
  }

  async editBlog(blogTitle: string, newTitle: string, newContent: string) {
    await this.logger.logStep('Tìm và chỉnh sửa blog', async () => {
      await this.page.goto('/admin/blog');
      await this.page.click(`[data-testid="edit-blog-${blogTitle}"]`);
    });

    await this.logger.logStep('Cập nhật thông tin blog', async () => {
      await this.page.fill('[data-testid="blog-title-input"]', newTitle);
      await this.page.fill('[data-testid="blog-content-input"]', newContent);
    });

    await this.logger.logStep('Lưu thay đổi', async () => {
      await this.page.click('[data-testid="save-blog-button"]');
      await expect(this.page.locator('[data-testid="success-message"]')).toBeVisible();
    });
  }

  async deleteBlog(blogTitle: string) {
    await this.logger.logStep('Xóa blog', async () => {
      await this.page.goto('/admin/blog');
      await this.page.click(`[data-testid="delete-blog-${blogTitle}"]`);
      await this.page.click('[data-testid="confirm-delete"]');
      await expect(this.page.locator('[data-testid="success-message"]')).toBeVisible();
    });
  }
}

export class ContactHelper {
  private page: Page;
  private logger: TestLogger;

  constructor(page: Page, logger: TestLogger) {
    this.page = page;
    this.logger = logger;
  }

  async submitContactForm(name: string, email: string, message: string) {
    await this.logger.logStep('Điều hướng đến trang liên hệ', async () => {
      await this.page.goto('/contact');
    });

    await this.logger.logStep('Nhập thông tin liên hệ', async () => {
      await this.page.fill('[data-testid="contact-name-input"]', name);
      await this.page.fill('[data-testid="contact-email-input"]', email);
      await this.page.fill('[data-testid="contact-message-input"]', message);
    });

    await this.logger.logStep('Gửi form liên hệ', async () => {
      await this.page.click('[data-testid="submit-contact-form"]');
      await expect(this.page.locator('[data-testid="contact-success-message"]')).toBeVisible();
    });
  }
}

export const getEnvironmentConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  
  return {
    env,
    baseUrl,
    isProduction: env === 'production',
    isDevelopment: env === 'development'
  };
};

export const waitForPageLoad = async (page: Page) => {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
};