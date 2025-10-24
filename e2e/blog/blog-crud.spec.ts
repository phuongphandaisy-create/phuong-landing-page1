import { test, expect } from '@playwright/test';
import { TestLogger, AuthHelper, BlogHelper, getEnvironmentConfig, waitForPageLoad } from '../utils/test-helpers';

test.describe('Blog CRUD Functionality Tests', () => {
  let logger: TestLogger;
  let authHelper: AuthHelper;
  let blogHelper: BlogHelper;

  test.beforeEach(async ({ page }) => {
    const config = getEnvironmentConfig();
    logger = new TestLogger(page, 'Blog CRUD Tests');
    authHelper = new AuthHelper(page, logger);
    blogHelper = new BlogHelper(page, logger);

    await logger.logStep(`Khởi tạo test trên môi trường: ${config.env}`, async () => {
      await page.goto('/');
      await waitForPageLoad(page);
    });

    // Đăng nhập trước khi test
    await authHelper.login();
  });

  test('Tạo blog mới thành công', async ({ page }) => {
    const blogTitle = `Test Blog ${Date.now()}`;
    const blogContent = 'Đây là nội dung test blog được tạo bởi automation test.';
    const blogExcerpt = 'Đây là excerpt của blog test.';

    await blogHelper.createBlog(blogTitle, blogContent, blogExcerpt);

    await logger.logStep('Xác nhận blog được tạo thành công', async () => {
      await page.goto('/blog');
      await expect(page.locator(`[data-testid="blog-card-${blogTitle}"]`)).toBeVisible();
      await expect(page.locator(`[data-testid="blog-title-${blogTitle}"]`)).toContainText(blogTitle);
    });

    await logger.logSuccess(`Blog "${blogTitle}" được tạo thành công`);
  });

  test('Chỉnh sửa blog thành công', async ({ page }) => {
    const originalTitle = `Original Blog ${Date.now()}`;
    const originalContent = 'Nội dung blog gốc.';
    const newTitle = `Updated Blog ${Date.now()}`;
    const newContent = 'Nội dung blog đã được cập nhật.';

    // Tạo blog trước
    await blogHelper.createBlog(originalTitle, originalContent);

    // Chỉnh sửa blog
    await blogHelper.editBlog(originalTitle, newTitle, newContent);

    await logger.logStep('Xác nhận blog được cập nhật', async () => {
      await page.goto('/blog');
      await expect(page.locator(`[data-testid="blog-card-${newTitle}"]`)).toBeVisible();
      await expect(page.locator(`[data-testid="blog-title-${newTitle}"]`)).toContainText(newTitle);
    });

    await logger.logSuccess(`Blog được cập nhật từ "${originalTitle}" thành "${newTitle}"`);
  });

  test('Xóa blog thành công', async ({ page }) => {
    const blogTitle = `Blog To Delete ${Date.now()}`;
    const blogContent = 'Blog này sẽ bị xóa trong test.';

    // Tạo blog trước
    await blogHelper.createBlog(blogTitle, blogContent);

    // Xác nhận blog tồn tại
    await logger.logStep('Xác nhận blog tồn tại trước khi xóa', async () => {
      await page.goto('/blog');
      await expect(page.locator(`[data-testid="blog-card-${blogTitle}"]`)).toBeVisible();
    });

    // Xóa blog
    await blogHelper.deleteBlog(blogTitle);

    await logger.logStep('Xác nhận blog đã bị xóa', async () => {
      await page.goto('/blog');
      await expect(page.locator(`[data-testid="blog-card-${blogTitle}"]`)).not.toBeVisible();
    });

    await logger.logSuccess(`Blog "${blogTitle}" đã được xóa thành công`);
  });

  test('Xem chi tiết blog', async ({ page }) => {
    const blogTitle = `Detail Blog ${Date.now()}`;
    const blogContent = 'Đây là nội dung chi tiết của blog test.';

    // Tạo blog trước
    await blogHelper.createBlog(blogTitle, blogContent);

    await logger.logStep('Điều hướng đến trang blog', async () => {
      await page.goto('/blog');
    });

    await logger.logStep('Click vào blog để xem chi tiết', async () => {
      await page.click(`[data-testid="blog-card-${blogTitle}"]`);
      await waitForPageLoad(page);
    });

    await logger.logStep('Xác nhận trang chi tiết blog', async () => {
      await expect(page.locator('[data-testid="blog-detail-title"]')).toContainText(blogTitle);
      await expect(page.locator('[data-testid="blog-detail-content"]')).toContainText(blogContent);
    });

    await logger.logSuccess(`Xem chi tiết blog "${blogTitle}" thành công`);
  });

  test('Tìm kiếm blog', async ({ page }) => {
    const searchTerm = `Searchable Blog ${Date.now()}`;
    const blogContent = 'Nội dung blog có thể tìm kiếm được.';

    // Tạo blog trước
    await blogHelper.createBlog(searchTerm, blogContent);

    await logger.logStep('Điều hướng đến trang blog', async () => {
      await page.goto('/blog');
    });

    await logger.logStep('Thực hiện tìm kiếm', async () => {
      await page.fill('[data-testid="blog-search-input"]', searchTerm);
      await page.click('[data-testid="blog-search-button"]');
      await waitForPageLoad(page);
    });

    await logger.logStep('Xác nhận kết quả tìm kiếm', async () => {
      await expect(page.locator(`[data-testid="blog-card-${searchTerm}"]`)).toBeVisible();
      await expect(page.locator('[data-testid="search-results-count"]')).toContainText('1');
    });

    await logger.logSuccess(`Tìm kiếm blog với từ khóa "${searchTerm}" thành công`);
  });

  test('Phân trang blog', async ({ page }) => {
    await logger.logStep('Điều hướng đến trang blog', async () => {
      await page.goto('/blog');
    });

    await logger.logStep('Kiểm tra phân trang', async () => {
      const paginationExists = await page.locator('[data-testid="blog-pagination"]').isVisible();
      
      if (paginationExists) {
        await logger.logStep('Click trang tiếp theo', async () => {
          await page.click('[data-testid="pagination-next"]');
          await waitForPageLoad(page);
        });

        await logger.logStep('Xác nhận chuyển trang thành công', async () => {
          await expect(page.locator('[data-testid="current-page"]')).toContainText('2');
        });
      }
    });

    await logger.logSuccess('Kiểm tra phân trang blog hoàn thành');
  });

  test('Validation khi tạo blog', async ({ page }) => {
    await logger.logStep('Điều hướng đến trang tạo blog', async () => {
      await page.goto('/admin/blog');
      await page.click('[data-testid="create-blog-button"]');
    });

    await logger.logStep('Thử tạo blog với thông tin trống', async () => {
      await page.click('[data-testid="save-blog-button"]');
    });

    await logger.logStep('Kiểm tra validation errors', async () => {
      await expect(page.locator('[data-testid="title-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="content-error"]')).toBeVisible();
    });

    await logger.logStep('Nhập title quá ngắn', async () => {
      await page.fill('[data-testid="blog-title-input"]', 'ab');
      await page.click('[data-testid="save-blog-button"]');
    });

    await logger.logStep('Kiểm tra validation title', async () => {
      await expect(page.locator('[data-testid="title-error"]')).toContainText('Title must be at least 3 characters');
    });

    await logger.logSuccess('Validation form tạo blog hoạt động đúng');
  });
});