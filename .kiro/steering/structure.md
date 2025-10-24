# Project Structure

## Root Directory Organization

```
├── src/                    # Main application source code
├── prisma/                 # Database schema and migrations
├── e2e/                    # End-to-end tests (Playwright)
├── scripts/                # Build and test automation scripts
├── .kiro/                  # Kiro AI assistant configuration
├── .next/                  # Next.js build output (auto-generated)
├── node_modules/           # Dependencies (auto-generated)
└── test-results/           # Test execution results
```

## Source Code Structure (`src/`)

```
src/
├── app/                    # Next.js App Router (main application)
│   ├── (auth)/            # Authentication route group
│   ├── admin/             # Protected admin routes
│   ├── blog/              # Public blog routes
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── api/               # API routes (backend endpoints)
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Homepage
├── components/            # Reusable React components
├── lib/                   # Utility libraries and configurations
├── types/                 # TypeScript type definitions
└── __tests__/             # Unit tests (Jest + React Testing Library)
```

## Key Architectural Patterns

### Next.js App Router Structure
- **Route Groups**: `(auth)` for authentication-related pages
- **Protected Routes**: `admin/` requires authentication
- **API Routes**: `api/` contains backend endpoints
- **Layout Hierarchy**: Nested layouts for different sections

### Component Organization
- **Reusable Components**: Stored in `src/components/`
- **Page Components**: Co-located with routes in `src/app/`
- **Shared Utilities**: Centralized in `src/lib/`

### Database Structure
- **Schema**: Defined in `prisma/schema.prisma`
- **Models**: User, BlogPost, ContactSubmission
- **Migrations**: Auto-generated in `prisma/migrations/`
- **Seed Data**: `prisma/seed.ts` for initial data

### Testing Structure
- **Unit Tests**: `src/__tests__/` mirrors `src/` structure
- **E2E Tests**: Organized by feature in `e2e/` directory
  - `e2e/auth/` - Authentication tests
  - `e2e/blog/` - Blog functionality tests
  - `e2e/contact/` - Contact form tests
  - `e2e/workflows/` - End-to-end user workflows

## File Naming Conventions

- **Pages**: `page.tsx` (Next.js App Router convention)
- **Layouts**: `layout.tsx` (Next.js App Router convention)
- **Components**: PascalCase (e.g., `BlogEditor.tsx`)
- **Utilities**: camelCase (e.g., `authConfig.ts`)
- **Types**: camelCase with `.types.ts` suffix
- **Tests**: `.test.tsx` or `.spec.ts` suffix

## Import Path Aliases

- `@/*` maps to `./src/*` for clean imports
- Example: `import { Button } from '@/components/Button'`

## Configuration Files Location

- **Root Level**: Framework and tool configurations
- **Hidden Directories**: `.kiro/`, `.next/`, `.vscode/`
- **Environment**: `.env.local` for local development