# Testing Documentation

This document describes the testing strategy and implementation for the AI-Assisted Landing Page project.

## Testing Stack

- **Jest**: Testing framework
- **React Testing Library**: Component testing utilities
- **@testing-library/user-event**: User interaction simulation
- **@testing-library/jest-dom**: Custom Jest matchers for DOM elements

## Test Structure

### Unit Tests

#### UI Components (`src/components/ui/__tests__/`)
- **Button.test.tsx**: Tests button variants, sizes, click handlers, and accessibility
- **Input.test.tsx**: Tests input validation, error states, and user interactions
- **Modal.test.tsx**: Tests modal behavior, keyboard navigation, and backdrop clicks

#### Form Components (`src/components/forms/__tests__/`)
- **LoginModal.test.tsx**: Tests authentication form validation, submission, and error handling
- **ContactForm.test.tsx**: Tests contact form validation, submission workflow, and state management

#### Blog Components (`src/components/blog/__tests__/`)
- **BlogCard.test.tsx**: Tests blog post display, date formatting, and navigation links

### Integration Tests (`src/__tests__/integration/`)

#### Authentication Flow (`auth-flow.test.tsx`)
- Complete login workflow testing
- Session state management
- Authentication error handling
- Loading states during authentication

#### Blog Management (`blog-management.test.tsx`)
- Blog CRUD operations (Create, Read, Update, Delete)
- API error handling
- Validation workflows
- Authentication requirements for protected operations

#### Contact Form (`contact-form.test.tsx`)
- End-to-end contact form submission
- Form validation workflow
- API error handling
- Loading states and user feedback

### API Route Tests (`src/app/api/*/__tests__/`)

#### Blog API (`src/app/api/blog/__tests__/`)
- **route.test.ts**: Tests GET and POST endpoints for blog posts
- **[id]/route.test.ts**: Tests GET, PUT, and DELETE endpoints for individual blog posts

#### Contact API (`src/app/api/contact/__tests__/`)
- **route.test.ts**: Tests POST endpoint for contact form submissions

## Test Configuration

### Jest Configuration (`jest.config.js`)
- Next.js integration with `next/jest`
- TypeScript support
- Module path mapping for `@/` imports
- Coverage collection configuration

### Test Setup (`jest.setup.js`)
- Global test utilities and mocks
- Next.js router mocking
- Next-Auth mocking
- Prisma client mocking
- Fetch API mocking

### Test Utilities (`src/lib/test-utils.tsx`)
- Custom render function with providers
- Mock data for testing
- Authenticated render helper
- Session provider setup

## Running Tests

### Available Scripts

```bash
# Run all tests once
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Commands

```bash
# Run specific test file
npm run test Button.test.tsx

# Run tests matching pattern
npm run test -- --testNamePattern="authentication"

# Run tests with verbose output
npm run test -- --verbose

# Update snapshots
npm run test -- --updateSnapshot
```

## Test Coverage

The test suite covers:

### Core Functionality
- ✅ Authentication system (login, session management)
- ✅ Blog CRUD operations (create, read, update, delete)
- ✅ Contact form submission
- ✅ Form validation and error handling
- ✅ UI component behavior and interactions

### API Endpoints
- ✅ `/api/blog` - Blog post listing and creation
- ✅ `/api/blog/[id]` - Individual blog post operations
- ✅ `/api/contact` - Contact form submission

### User Workflows
- ✅ Complete authentication flow
- ✅ Blog management workflow
- ✅ Contact form submission workflow
- ✅ Error handling and recovery

### Edge Cases
- ✅ Network errors
- ✅ Validation errors
- ✅ Authentication failures
- ✅ Loading states
- ✅ Empty states

## Mock Strategy

### External Dependencies
- **Next-Auth**: Mocked for authentication testing
- **Next.js Router**: Mocked for navigation testing
- **Prisma Client**: Mocked for database operations
- **Fetch API**: Mocked for API testing

### Mock Data
- User sessions and authentication states
- Blog post data with proper relationships
- Contact form submissions
- API responses (success and error cases)

## Best Practices

### Test Organization
- Group related tests using `describe` blocks
- Use descriptive test names that explain the expected behavior
- Follow the Arrange-Act-Assert pattern
- Clean up mocks between tests

### Component Testing
- Test user interactions, not implementation details
- Use semantic queries (getByRole, getByLabelText)
- Test accessibility features
- Verify error states and loading states

### Integration Testing
- Test complete user workflows
- Verify API integrations
- Test error handling and recovery
- Ensure proper state management

### API Testing
- Test all HTTP methods and status codes
- Verify request/response formats
- Test authentication and authorization
- Test validation and error cases

## Continuous Integration

The test suite is designed to run in CI/CD environments:

- All tests use `--run` flag to prevent watch mode
- Mocks are properly isolated and cleaned up
- No external dependencies required
- Fast execution for quick feedback

## Troubleshooting

### Common Issues

1. **Mock not working**: Ensure mocks are defined before imports
2. **Async test failures**: Use `waitFor` for async operations
3. **Component not rendering**: Check provider setup in test utils
4. **API test failures**: Verify mock implementations match actual API

### Debug Tips

- Use `screen.debug()` to see rendered output
- Add `console.log` in test utilities for debugging
- Use `--verbose` flag for detailed test output
- Check mock call history with `expect().toHaveBeenCalledWith()`

## Future Enhancements

### Potential Additions
- E2E testing with Playwright
- Visual regression testing
- Performance testing
- Accessibility testing automation
- Database integration testing with test containers

### Test Metrics
- Maintain >80% code coverage
- All critical user paths covered
- All API endpoints tested
- All error scenarios handled