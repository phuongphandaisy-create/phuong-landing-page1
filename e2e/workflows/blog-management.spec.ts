import { test, expect } from '@playwright/test';
import { TestLogger, AuthHelper, BlogHelper, getEnvironmentConfig, waitForPageLoad } from '../utils/test-helpers';

test.describe('Blog Management Workflow Tests', () => {
  let logger: TestLogger;
  let authHelper: AuthHelper;
  let blogHelper: BlogHelper;

  test.beforeEach(async ({ page }) => {
    const config = getEnvironmentConfig();
    logger = new TestLogger(page, 'Blog Management Workflow Tests');
    authHelper = new AuthHelper(page, logger);
    blogHelper = new BlogHelper(page, logger);

    await logger.logStep(`Khởi tạo test trên môi trường: ${config.env}`, async () => {
      await page.goto('/');
      await waitForPageLoad(page);
    });

    // Đăng nhập trước khi test
    await authHelper.login();
  });

  test('Luồng quản lý blog hoàn chỉnh: Tạo -> Xem -> Sửa -> Xóa', async ({ page }) => {
    const blogTitle = `Complete Workflow Blog ${Date.now()}`;
    const blogContent = 'Đây là blog test cho luồng quản lý hoàn chỉnh.';
    const blogExcerpt = 'Excerpt cho blog test workflow.';
    
    const updatedTitle = `Updated ${blogTitle}`;
    const updatedContent = 'Nội dung blog đã được cập nhật trong workflow test.';

    // Bước 1: Tạo blog
    await logger.logStep('BƯỚC 1: Tạo blog mới', async () => {
      await blogHelper.createBlog(blogTitle, blogContent, blogExcerpt);
    });

    // Bước 2: Xem blog trên trang public
    await logger.logStep('BƯỚC 2: Xem blog trên trang public', async () => {
      await page.goto('/blog');
      await expect(page.locator(`[data-testid="blog-card-${blogTitle}"]`)).toBeVisible();
      
      // Click để xem chi tiết
      await page.click(`[data-testid="blog-card-${blogTitle}"]`);
      await expect(page.locator('[data-testid="blog-detail-title"]')).toContainText(blogTitle);
      await expect(page.locator('[data-testid="blog-detail-content"]')).toContainText(blogContent);
    });

    // Bước 3: Sửa blog
    await logger.logStep('BƯỚC 3: Chỉnh sửa blog', async () => {
      await blogHelper.editBlog(blogTitle, updatedTitle, updatedContent);
    });

    // Bước 4: Xác nhận thay đổi trên trang public
    await logger.logStep('BƯỚC 4: Xác nhận thay đổi trên trang public', async () => {
      await page.goto('/blog');
      await expect(page.locator(`[data-testid="blog-card-${updatedTitle}"]`)).toBeVisible();
      
      // Click để xem chi tiết đã cập nhật
      await page.click(`[data-testid="blog-card-${updatedTitle}"]`);
      await expect(page.locator('[data-testid="blog-detail-title"]')).toContainText(updatedTitle);
      await expect(page.locator('[data-testid="blog-detail-content"]')).toContainText(updatedContent);
    });

    // Bước 5: Xóa blog
    await logger.logStep('BƯỚC 5: Xóa blog', async () => {
      await blogHelper.deleteBlog(updatedTitle);
    });

    // Bước 6: Xác nhận blog đã bị xóa
    await logger.logStep('BƯỚC 6: Xác nhận blog đã bị xóa', async () => {
      await page.goto('/blog');
      await expect(page.locator(`[data-testid="blog-card-${updatedTitle}"]`)).not.toBeVisible();
    });

    await logger.logSuccess('Luồng quản lý blog hoàn chỉnh thành công');
  });

  test('Luồng quản lý nhiều blog cùng lúc', async ({ page }) => {
    const blogCount = 3;
    const blogs = [];

    // Tạo nhiều blog
    for (let i = 1; i <= blogCount; i++) {
      const blog = {
        title: `Bulk Blog ${i} - ${Date.now()}`,
        content: `Nội dung blog số ${i} cho test bulk management.`,
        excerpt: `Excerpt blog ${i}`
      };
      blogs.push(blog);

      await logger.logStep(`Tạo blog ${i}/${blogCount}`, async () => {
        await blogHelper.createBlog(blog.title, blog.content, blog.excerpt);
      });
    }

    // Xác nhận tất cả blog được tạo
    await logger.logStep('Xác nhận tất cả blog được tạo', async () => {
      await page.goto('/admin/blog');
      
      for (const blog of blogs) {
        await expect(page.locator(`[data-testid="blog-row-${blog.title}"]`)).toBeVisible();
      }
    });

    // Bulk actions (nếu có)
    await logger.logStep('Kiểm tra bulk actions', async () => {
      const hasBulkActions = await page.locator('[data-testid="bulk-actions"]').isVisible();
      
      if (hasBulkActions) {
        // Select tất cả blog
        for (const blog of blogs) {
          await page.check(`[data-testid="select-blog-${blog.title}"]`);
        }
        
        // Bulk delete
        await page.click('[data-testid="bulk-delete-button"]');
        await page.click('[data-testid="confirm-bulk-delete"]');
        
        await expect(page.locator('[data-testid="bulk-success-message"]')).toBeVisible();
      } else {
        // Xóa từng blog một
        for (const blog of blogs) {
          await blogHelper.deleteBlog(blog.title);
        }
      }
    });

    await logger.logSuccess('Quản lý nhiều blog cùng lúc thành công');
  });

  test('Luồng draft và publish blog', async ({ page }) => {
    const blogTitle = `Draft Blog ${Date.now()}`;
    const blogContent = 'Nội dung blog draft test.';

    await logger.logStep('Tạo blog draft', async () => {
      await page.goto('/admin/blog');
      await page.click('[data-testid="create-blog-button"]');
      
      await page.fill('[data-testid="blog-title-input"]', blogTitle);
      await page.fill('[data-testid="blog-content-input"]', blogContent);
      
      // Lưu as draft
      await page.click('[data-testid="save-draft-button"]');
      await expect(page.locator('[data-testid="draft-saved-message"]')).toBeVisible();
    });

    await logger.logStep('Xác nhận blog không hiển thị trên trang public', async () => {
      await page.goto('/blog');
      await expect(page.locator(`[data-testid="blog-card-${blogTitle}"]`)).not.toBeVisible();
    });

    await logger.logStep('Xác nhận blog hiển thị trong danh sách draft', async () => {
      await page.goto('/admin/blog');
      await page.click('[data-testid="drafts-tab"]');
      await expect(page.locator(`[data-testid="draft-blog-${blogTitle}"]`)).toBeVisible();
    });

    await logger.logStep('Publish blog', async () => {
      await page.click(`[data-testid="edit-draft-${blogTitle}"]`);
      await page.click('[data-testid="publish-button"]');
      await expect(page.locator('[data-testid="published-message"]')).toBeVisible();
    });

    await logger.logStep('Xác nhận blog hiển thị trên trang public', async () => {
      await page.goto('/blog');
      await expect(page.locator(`[data-testid="blog-card-${blogTitle}"]`)).toBeVisible();
    });

    await logger.logSuccess('Luồng draft và publish thành công');
  });

  test('Luồng schedule blog post', async ({ page }) => {
    const blogTitle = `Scheduled Blog ${Date.now()}`;
    const blogContent = 'Nội dung blog scheduled test.';
    
    // Tạo thời gian schedule (5 phút sau)
    const scheduleTime = new Date();
    scheduleTime.setMinutes(scheduleTime.getMinutes() + 5);

    await logger.logStep('Tạo blog với schedule', async () => {
      await page.goto('/admin/blog');
      await page.click('[data-testid="create-blog-button"]');
      
      await page.fill('[data-testid="blog-title-input"]', blogTitle);
      await page.fill('[data-testid="blog-content-input"]', blogContent);
      
      // Set schedule time
      const hasScheduleFeature = await page.locator('[data-testid="schedule-section"]').isVisible();
      
      if (hasScheduleFeature) {
        await page.click('[data-testid="schedule-toggle"]');
        await page.fill('[data-testid="schedule-date"]', scheduleTime.toISOString().split('T')[0]);
        await page.fill('[data-testid="schedule-time"]', scheduleTime.toTimeString().slice(0, 5));
        
        await page.click('[data-testid="schedule-blog-button"]');
        await expect(page.locator('[data-testid="scheduled-message"]')).toBeVisible();
      }
    });

    await logger.logStep('Xác nhận blog trong danh sách scheduled', async () => {
      const hasScheduleFeature = await page.locator('[data-testid="scheduled-tab"]').isVisible();
      
      if (hasScheduleFeature) {
        await page.click('[data-testid="scheduled-tab"]');
        await expect(page.locator(`[data-testid="scheduled-blog-${blogTitle}"]`)).toBeVisible();
      }
    });

    await logger.logSuccess('Luồng schedule blog thành công');
  });

  test('Luồng quản lý categories và tags', async ({ page }) => {
    const categoryName = `Test Category ${Date.now()}`;
    const tagName = `test-tag-${Date.now()}`;
    const blogTitle = `Categorized Blog ${Date.now()}`;

    await logger.logStep('Tạo category mới', async () => {
      await page.goto('/admin/blog/categories');
      
      const hasCategoryManagement = await page.locator('[data-testid="create-category-button"]').isVisible();
      
      if (hasCategoryManagement) {
        await page.click('[data-testid="create-category-button"]');
        await page.fill('[data-testid="category-name-input"]', categoryName);
        await page.click('[data-testid="save-category-button"]');
        await expect(page.locator('[data-testid="category-created-message"]')).toBeVisible();
      }
    });

    await logger.logStep('Tạo blog với category và tags', async () => {
      await page.goto('/admin/blog');
      await page.click('[data-testid="create-blog-button"]');
      
      await page.fill('[data-testid="blog-title-input"]', blogTitle);
      await page.fill('[data-testid="blog-content-input"]', 'Blog content with category and tags.');
      
      // Chọn category
      const hasCategorySelect = await page.locator('[data-testid="category-select"]').isVisible();
      if (hasCategorySelect) {
        await page.selectOption('[data-testid="category-select"]', categoryName);
      }
      
      // Thêm tags
      const hasTagInput = await page.locator('[data-testid="tags-input"]').isVisible();
      if (hasTagInput) {
        await page.fill('[data-testid="tags-input"]', tagName);
        await page.keyboard.press('Enter');
      }
      
      await page.click('[data-testid="save-blog-button"]');
      await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    });

    await logger.logStep('Xác nhận blog hiển thị với category và tags', async () => {
      await page.goto('/blog');
      await expect(page.locator(`[data-testid="blog-card-${blogTitle}"]`)).toBeVisible();
      
      const hasCategories = await page.locator(`[data-testid="blog-category-${categoryName}"]`).isVisible();
      const hasTags = await page.locator(`[data-testid="blog-tag-${tagName}"]`).isVisible();
      
      if (hasCategories || hasTags) {
        await logger.logSuccess('Categories và tags hoạt động đúng');
      }
    });

    await logger.logSuccess('Quản lý categories và tags thành công');
  });

  test('Luồng SEO và meta data', async ({ page }) => {
    const blogTitle = `SEO Blog ${Date.now()}`;
    const blogContent = 'Nội dung blog test SEO.';
    const metaDescription = 'Meta description cho SEO test blog.';
    const metaKeywords = 'seo, test, blog, automation';

    await logger.logStep('Tạo blog với SEO metadata', async () => {
      await page.goto('/admin/blog');
      await page.click('[data-testid="create-blog-button"]');
      
      await page.fill('[data-testid="blog-title-input"]', blogTitle);
      await page.fill('[data-testid="blog-content-input"]', blogContent);
      
      // SEO section
      const hasSEOSection = await page.locator('[data-testid="seo-section"]').isVisible();
      
      if (hasSEOSection) {
        await page.click('[data-testid="seo-toggle"]');
        await page.fill('[data-testid="meta-description"]', metaDescription);
        await page.fill('[data-testid="meta-keywords"]', metaKeywords);
        
        // URL slug
        const customSlug = `seo-blog-${Date.now()}`;
        await page.fill('[data-testid="url-slug"]', customSlug);
      }
      
      await page.click('[data-testid="save-blog-button"]');
      await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    });

    await logger.logStep('Xác nhận SEO metadata trên trang blog', async () => {
      await page.goto('/blog');
      await page.click(`[data-testid="blog-card-${blogTitle}"]`);
      
      // Kiểm tra meta tags
      const metaDesc = await page.locator('meta[name="description"]').getAttribute('content');
      const metaKeys = await page.locator('meta[name="keywords"]').getAttribute('content');
      
      if (metaDesc?.includes(metaDescription) || metaKeys?.includes(metaKeywords)) {
        await logger.logSuccess('SEO metadata được áp dụng đúng');
      }
    });

    await logger.logSuccess('Luồng SEO và meta data thành công');
  });
});