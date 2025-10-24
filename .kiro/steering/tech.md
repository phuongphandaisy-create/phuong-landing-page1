# Technology Stack

## Core Technologies

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS with custom configuration
- **Database**: SQLite with Prisma ORM
- **Authentication**: Next-Auth.js with credentials provider
- **Runtime**: Node.js

## Key Dependencies

- **UI/Styling**: `tailwind-merge`, `clsx` for conditional classes
- **Database**: `@prisma/client`, `@next-auth/prisma-adapter`
- **Development**: `tsx` for TypeScript execution, `autoprefixer`, `postcss`

## Testing Stack

- **Unit Testing**: Jest with React Testing Library
- **E2E Testing**: Playwright with custom PowerShell scripts
- **Test Environment**: jsdom for React component testing

## Build System & Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database Operations
```bash
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with initial data
npm run db:setup     # Complete database setup
```

### Testing
```bash
npm test             # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run e2e          # Run Playwright E2E tests
npm run e2e:headed   # Run E2E tests with browser UI
npm run e2e:debug    # Debug E2E tests
npm run e2e:report   # View test reports
```

### Specialized E2E Commands (Windows PowerShell)
```bash
npm run e2e:dev           # Run E2E tests against dev server
npm run e2e:dev:auth      # Test auth functionality
npm run e2e:dev:blog      # Test blog functionality  
npm run e2e:dev:contact   # Test contact functionality
npm run e2e:dev:workflows # Test complete workflows
```

## Configuration Files

- **TypeScript**: `tsconfig.json` with path aliases (`@/*` → `./src/*`)
- **Tailwind**: Custom theme with gradient colors and animations
- **Prisma**: SQLite database with User, BlogPost, and ContactSubmission models
- **Playwright**: Configured for Chromium with video/screenshot on failure
- **ESLint**: Next.js core web vitals configuration

## Environment Setup

- Copy `.env.example` to `.env.local`
- Default admin credentials: `admin` / `password` (change in production)
- Database file: `prisma/dev.db` (SQLite)