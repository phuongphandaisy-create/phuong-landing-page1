# Testing Guide

## 📁 Test Structure

```
tests/
├── unit/                    # Unit tests
│   ├── frontend/           # Frontend component tests
│   ├── backend/            # Backend API tests
│   └── shared/             # Shared utility tests
├── integration/            # Integration tests
└── e2e/                    # End-to-end tests
```

## 🚀 Quick Start

### 1. Chạy tất cả tests
```bash
npm test
```

### 2. Chạy tests với watch mode
```bash
npm run test:watch
```

### 3. Chạy tests với coverage
```bash
npm run test:coverage
```

### 4. Chạy E2E tests
```bash
npm run e2e
```

## 🛠️ Sử dụng PowerShell Script

Chúng tôi đã tạo một PowerShell script để dễ dàng chạy các loại tests khác nhau:

```powershell
# Chạy tất cả tests
./scripts/run-tests.ps1 all

# Chỉ chạy unit tests
./scripts/run-tests.ps1 unit

# Chạy unit tests với watch mode
./scripts/run-tests.ps1 unit -Watch

# Chạy với coverage
./scripts/run-tests.ps1 unit -Coverage

# Chạy integration tests
./scripts/run-tests.ps1 integration

# Chạy E2E tests
./scripts/run-tests.ps1 e2e

# Xem cấu trúc test
./scripts/run-tests.ps1 structure
```

## 📝 Các loại Tests

### Unit Tests
- **Frontend**: Test các React components
- **Backend**: Test API handlers và business logic
- **Shared**: Test utility functions và shared code

### Integration Tests
- Test tương tác giữa các components
- Test complete workflows
- Test API integration

### E2E Tests
- Test toàn bộ user workflows
- Test trên browser thật
- Test authentication flows

## 🔧 Configuration

### Jest Configuration
- File: `jest.config.js`
- Setup: `jest.setup.js`
- Path aliases được cấu hình cho cấu trúc mới

### Playwright Configuration
- File: `playwright.config.ts`
- Test directory: `./tests/e2e`
- Browser: Chromium (có thể thêm Firefox, Safari)

## 🛠️ Test Helpers

### Test Helper Files
- `tests/helpers/test-helpers.ts` - Main test utilities (TestLogger, AuthHelper, FormHelper, etc.)
- `tests/helpers/mock-data.ts` - Mock data và test scenarios
- `tests/helpers/setup-helpers.ts` - Setup utilities cho tests
- `tests/helpers/custom-matchers.ts` - Custom matchers cho assertions
- `tests/helpers/index.ts` - Main export file

### Sử dụng Test Helpers

```typescript
import { 
  TestLogger, 
  AuthHelper, 
  FormHelper,
  mockFormData,
  testScenarios,
  TEST_CONSTANTS 
} from '../helpers'

test('Example test with helpers', async ({ page }) => {
  const logger = new TestLogger(page, 'Example Test')
  const authHelper = new AuthHelper(page, logger)
  const formHelper = new FormHelper(page, logger)
  
  // Login
  await authHelper.login()
  
  // Fill form
  await formHelper.fillContactForm(mockFormData.validContact)
  
  // Submit and verify
  await formHelper.submitContactForm()
  await formHelper.expectContactFormSuccess()
})
```

### Custom Matchers

```typescript
// Playwright custom matchers
await expect(page).toBeAccessible()
await expect(page).toHaveValidSEO()
await expect(page).toHaveResponsiveDesign()

// Jest custom matchers
expect('test@example.com').toHaveValidEmail()
expect('Hello world').toHaveMinLength(5)
expect(blogPost).toBeValidBlogPost()
expect(contactData).toBeValidContactSubmission()
```

## 📊 Coverage

Chạy tests với coverage để xem code coverage:

```bash
npm run test:coverage
```

Coverage report sẽ được tạo trong thư mục `coverage/`.

## 🐛 Debugging Tests

### Debug Unit Tests
```bash
# Chạy specific test file
npx jest tests/unit/frontend/components/Button.test.tsx

# Chạy với verbose output
npx jest --verbose

# Chạy tests matching pattern
npx jest --testNamePattern="Button"
```

### Debug E2E Tests
```bash
# Chạy với browser visible
npm run e2e:headed

# Debug mode
npm run e2e:debug

# Chạy specific test file
npx playwright test tests/e2e/auth/authentication.spec.ts
```

## 📋 Test Commands Cheat Sheet

| Command | Description |
|---------|-------------|
| `npm test` | Chạy tất cả unit tests |
| `npm run test:watch` | Chạy tests trong watch mode |
| `npm run test:coverage` | Chạy tests với coverage |
| `npm run e2e` | Chạy E2E tests |
| `npm run e2e:headed` | Chạy E2E tests với browser visible |
| `npm run e2e:debug` | Debug E2E tests |
| `npm run e2e:report` | Xem E2E test report |

## 🎯 Best Practices

1. **Tên test rõ ràng**: Sử dụng tên mô tả rõ ràng những gì test đang kiểm tra
2. **Arrange-Act-Assert**: Tổ chức test theo pattern AAA
3. **Mock dependencies**: Mock các external dependencies
4. **Test edge cases**: Test cả happy path và error cases
5. **Keep tests isolated**: Mỗi test phải độc lập

## 🔍 Troubleshooting

### Common Issues

1. **Import errors**: Kiểm tra path aliases trong `jest.config.js`
2. **Mock issues**: Đảm bảo mocks được setup đúng trong `jest.setup.js`
3. **E2E test failures**: Đảm bảo dev server đang chạy
4. **Timeout errors**: Tăng timeout trong config nếu cần

### Getting Help

- Kiểm tra Jest documentation: https://jestjs.io/docs/getting-started
- Kiểm tra Playwright documentation: https://playwright.dev/docs/intro
- Kiểm tra Testing Library documentation: https://testing-library.com/docs/