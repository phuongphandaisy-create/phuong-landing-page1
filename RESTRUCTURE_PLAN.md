# Project Restructure Plan

## Current Issues
- Frontend and backend code mixed in src/app directory
- Test files scattered across different locations
- No clear separation between client-side and server-side code
- Shared types and utilities not properly organized

## New Structure

```
├── src/
│   ├── frontend/                    # Client-side code only
│   │   ├── components/              # React components
│   │   │   ├── blog/               # Blog-related components
│   │   │   ├── forms/              # Form components
│   │   │   ├── layout/             # Layout components
│   │   │   ├── sections/           # Page sections
│   │   │   └── ui/                 # Reusable UI components
│   │   ├── pages/                  # Page components (extracted from app/)
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── providers/              # React context providers
│   │   └── utils/                  # Frontend-specific utilities
│   │
│   ├── backend/                     # Server-side code only
│   │   ├── api/                    # API route handlers
│   │   │   ├── auth/               # Authentication endpoints
│   │   │   ├── blog/               # Blog API endpoints
│   │   │   └── contact/            # Contact API endpoints
│   │   ├── lib/                    # Server-side libraries
│   │   ├── middleware/             # Server middleware
│   │   └── services/               # Business logic services
│   │
│   ├── shared/                      # Code shared between FE/BE
│   │   ├── types/                  # TypeScript type definitions
│   │   ├── constants/              # Shared constants
│   │   └── utils/                  # Shared utility functions
│   │
│   └── app/                        # Next.js App Router (routing only)
│       ├── (auth)/                 # Auth route group
│       ├── admin/                  # Admin routes
│       ├── blog/                   # Blog routes
│       ├── about/                  # About page
│       ├── contact/                # Contact page
│       ├── api/                    # API route definitions (imports from backend/)
│       ├── layout.tsx              # Root layout
│       ├── page.tsx                # Homepage
│       └── globals.css             # Global styles
│
├── tests/                          # All test files organized by type
│   ├── unit/                       # Unit tests
│   │   ├── frontend/               # Frontend unit tests
│   │   │   ├── components/         # Component tests
│   │   │   └── utils/              # Frontend utility tests
│   │   ├── backend/                # Backend unit tests
│   │   │   ├── api/                # API endpoint tests
│   │   │   └── services/           # Service layer tests
│   │   └── shared/                 # Shared code tests
│   │
│   ├── integration/                # Integration tests
│   │   ├── auth-flow.test.ts       # Authentication integration
│   │   ├── blog-management.test.ts # Blog CRUD integration
│   │   └── contact-form.test.ts    # Contact form integration
│   │
│   └── e2e/                        # End-to-end tests (moved from root e2e/)
│       ├── auth/                   # Authentication E2E tests
│       ├── blog/                   # Blog functionality E2E tests
│       ├── contact/                # Contact form E2E tests
│       ├── workflows/              # Complete user workflows
│       └── utils/                  # E2E test utilities
│
└── prisma/                         # Database schema (unchanged)
    ├── schema.prisma
    ├── migrations/
    └── seed.ts
```

## Migration Steps

1. Create new directory structure
2. Move frontend components to src/frontend/components/
3. Extract page components from app/ to src/frontend/pages/
4. Move API handlers to src/backend/api/
5. Move shared types to src/shared/types/
6. Reorganize test files into tests/ directory
7. Update import paths throughout the codebase
8. Update tsconfig.json path aliases
9. Update build and test configurations

## Benefits

- Clear separation of concerns
- Better code organization and maintainability
- Easier to understand for new developers
- Simplified testing structure
- Better scalability for larger teams
- Clearer boundaries between client and server code