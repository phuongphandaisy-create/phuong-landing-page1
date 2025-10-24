# 🎯 E2E Testing Guide - AI Assisted Landing Page

Hướng dẫn chi tiết về việc chạy End-to-End tests cho dự án AI Assisted Landing Page.

## 📋 Tổng quan

Bộ test E2E này được thiết kế để test các tính năng chính:
- 🔐 **Authentication Components**: Đăng nhập, đăng xuất, validation
- 📝 **Blog CRUD Functionality**: Tạo, đọc, cập nhật, xóa blog posts
- 📧 **Contact Form Submission**: Gửi form liên hệ và validation
- 🔄 **Complete Authentication Flow**: Luồng xác thực hoàn chỉnh
- 🎯 **Blog Management Workflow**: Quy trình quản lý blog từ A-Z

## 🚀 Cài đặt

### 1. Cài đặt dependencies
```bash
npm install
npm run e2e:install
```

### 2. Chuẩn bị database (cho dev environment)
```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

## 🎮 Cách sử dụng

### Quick Start Commands

```bash
# Chạy tất cả tests trên dev (có hiển thị browser)
npm run e2e:dev

# Chạy từng loại test trên dev
npm run e2e:dev:auth      # Authentication tests
npm run e2e:dev:blog      # Blog CRUD tests  
npm run e2e:dev:contact   # Contact form tests
npm run e2e:dev:workflows # Workflow tests

# Xem report
npm run e2e:report
```

### Advanced Usage

#### 1. Test trên Development Environment

```powershell
# Chạy tất cả tests
.\scripts\test-dev.ps1 -TestSuite all -Headed

# Chỉ chạy authentication tests
.\scripts\test-dev.ps1 -TestSuite auth -Headed

# Chạy với debug mode
.\scripts\test-dev.ps1 -TestSuite blog -Debug -Headed
```

#### 2. Test trên Production Environment

```powershell
# Chạy read-only tests (an toàn)
.\scripts\test-prod.ps1 -ProductionUrl "https://your-site.com" -TestSuite readonly -Headed

# Chạy authentication tests
.\scripts\test-prod.ps1 -ProductionUrl "https://your-site.com" -TestSuite auth -Headed

# ⚠️ CẢNH BÁO: Tests có thể tạo dữ liệu thật
.\scripts\test-prod.ps1 -ProductionUrl "https://your-site.com" -TestSuite blog -Headed
```

#### 3. Test Runner (Recommended)

```powershell
# Test chỉ trên dev
.\scripts\test-runner.ps1 -Environment dev -TestSuite all -Headed

# Test chỉ trên production
.\scripts\test-runner.ps1 -Environment prod -ProductionUrl "https://your-site.com" -TestSuite readonly -Headed

# Test trên cả dev và production
.\scripts\test-runner.ps1 -Environment both -ProductionUrl "https://your-site.com" -TestSuite auth -Headed
```

## 📊 Test Suites

| Suite | Mô tả | Dev Safe | Prod Safe |
|-------|-------|----------|-----------|
| `all` | Tất cả tests | ✅ | ⚠️ |
| `auth` | Authentication tests | ✅ | ✅ |
| `blog` | Blog CRUD operations | ✅ | ⚠️ |
| `contact` | Contact form tests | ✅ | ⚠️ |
| `workflows` | Complete workflows | ✅ | ⚠️ |
| `readonly` | Chỉ read-only tests | ✅ | ✅ |

## 🎯 Chi tiết Test Cases

### Authentication Tests
- ✅ Đăng nhập thành công với thông tin hợp lệ
- ❌ Đăng nhập thất bại với thông tin sai
- 🔄 Đăng xuất thành công
- 📝 Validation form đăng nhập
- 🔒 Session persistence
- 🔐 Route protection

### Blog CRUD Tests
- ➕ Tạo blog mới
- ✏️ Chỉnh sửa blog
- 🗑️ Xóa blog
- 👁️ Xem chi tiết blog
- 🔍 Tìm kiếm blog
- 📄 Phân trang
- ✅ Form validation

### Contact Form Tests
- 📧 Gửi form thành công
- ❌ Validation các trường bắt buộc
- 📧 Validation email format
- 📝 Validation độ dài tin nhắn
- ⏳ Loading states
- 🔢 Character counter
- ♿ Accessibility
- 📱 Responsive design

### Workflow Tests
- 🔄 Complete authentication flow
- 📝 Blog management workflow
- 🎯 Draft và publish
- ⏰ Schedule posts
- 🏷️ Categories và tags
- 🔍 SEO metadata

## 📁 Cấu trúc Files

```
e2e/
├── auth/
│   └── authentication.spec.ts
├── blog/
│   └── blog-crud.spec.ts
├── contact/
│   └── contact-form.spec.ts
├── workflows/
│   ├── complete-auth-flow.spec.ts
│   └── blog-management.spec.ts
└── utils/
    └── test-helpers.ts

scripts/
├── test-dev.ps1          # Dev environment runner
├── test-prod.ps1         # Production environment runner
└── test-runner.ps1       # Main test runner

logs/                     # Test execution logs
reports/                  # Test summary reports
playwright-report/        # HTML test reports
```

## 🔧 Configuration

### Environment Variables

```bash
# Development
NODE_ENV=development
BASE_URL=http://localhost:3000

# Production  
NODE_ENV=production
BASE_URL=https://your-production-site.com
```

### Playwright Config

File `playwright.config.ts` chứa cấu hình:
- Browser settings (Chrome, Firefox, Safari)
- Timeouts và retries
- Screenshots và videos
- Test reporters

## 📝 Logging & Reports

### Log Files
- `logs/test-dev-{timestamp}.log` - Dev test logs
- `logs/test-prod-{timestamp}.log` - Production test logs  
- `logs/test-runner-{timestamp}.log` - Main runner logs

### Reports
- `playwright-report/index.html` - HTML test report
- `reports/test-summary-{timestamp}.json` - JSON summary
- `test-results.json` - Detailed test results

## 🎥 Visual Testing

Tests được cấu hình để:
- 🖥️ Hiển thị browser khi chạy (headed mode)
- 📸 Chụp screenshot khi test fail
- 🎬 Record video khi test fail
- 🐌 Slow motion để dễ quan sát (500ms delay)
- 📍 Hiển thị step indicator trên trang

## ⚠️ Lưu ý quan trọng

### Development Environment
- ✅ An toàn để chạy tất cả tests
- 🔄 Tự động khởi động dev server nếu cần
- 🗄️ Tự động setup database

### Production Environment  
- ⚠️ **CẢNH BÁO**: Tests có thể tạo dữ liệu thật
- 🔒 Yêu cầu xác nhận trước khi chạy
- 💡 Khuyến nghị chỉ chạy `readonly` tests
- 🔄 Sử dụng retry mechanism
- ⏱️ Timeout cao hơn

## 🐛 Troubleshooting

### Common Issues

1. **Dev server không khởi động**
   ```bash
   npm run dev
   # Đợi server khởi động rồi chạy lại tests
   ```

2. **Database errors**
   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

3. **Playwright browser không tìm thấy**
   ```bash
   npm run e2e:install
   ```

4. **Permission errors trên Windows**
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

### Debug Mode

```powershell
# Chạy với debug để step-through tests
.\scripts\test-dev.ps1 -TestSuite auth -Debug
```

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra logs trong thư mục `logs/`
2. Xem HTML report trong `playwright-report/`
3. Chạy với `-Debug` flag để investigate
4. Kiểm tra database và dev server status

## 🎉 Best Practices

1. **Luôn chạy tests trên dev trước**
2. **Sử dụng headed mode để quan sát**
3. **Kiểm tra logs khi có lỗi**
4. **Chỉ chạy readonly tests trên production**
5. **Backup data trước khi test production**
6. **Sử dụng test-runner.ps1 cho workflow hoàn chỉnh**

---

Happy Testing! 🚀