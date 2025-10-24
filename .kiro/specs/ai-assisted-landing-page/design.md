# Design Document

## Overview

AI-Assisted Landing Page là một ứng dụng web full-stack được xây dựng với Next.js 14, TypeScript và Tailwind CSS. Hệ thống cung cấp một landing page hiện đại với blog management system và authentication, được thiết kế đặc biệt cho QA Engineers chuyển sang full-stack development.

Ứng dụng sử dụng kiến trúc monolithic với Next.js App Router, tích hợp database SQLite thông qua Prisma ORM, và authentication với Next-Auth.js. UI/UX được thiết kế với design system hiện đại sử dụng gradients, animations và responsive design.

## Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes + TypeScript  
- **Database**: SQLite + Prisma ORM
- **Authentication**: Next-Auth.js (Credentials Provider)
- **Deployment**: Vercel (Hobby Plan)
- **Styling**: Tailwind CSS với custom configuration

### Application Structure
```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   │   └── login/         # Login page
│   ├── admin/             # Protected admin routes
│   │   └── blog/          # Blog management
│   ├── blog/              # Public blog routes
│   │   └── [slug]/        # Dynamic blog post pages
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── blog/          # Blog CRUD endpoints
│   │   └── contact/       # Contact form endpoint
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   ├── blog/             # Blog-specific components
│   └── forms/            # Form components
├── lib/                  # Utility libraries
│   ├── prisma.ts         # Database client
│   ├── auth.ts           # Auth configuration
│   └── utils.ts          # Helper functions
├── types/                # TypeScript type definitions
└── prisma/               # Database schema and migrations
    └── schema.prisma     # Prisma schema
```

## Components and Interfaces

### Core Components

#### 1. Layout Components
- **Header**: Fixed navigation với backdrop blur, logo gradient, và dark mode toggle
- **Footer**: Simple footer với links và copyright
- **Layout**: Root layout với providers và global styles

#### 2. Authentication Components
- **LoginModal**: Centered modal với form validation
- **ProtectedRoute**: HOC để bảo vệ admin routes
- **AuthProvider**: Context provider cho authentication state

#### 3. Blog Components
- **BlogCard**: Card component cho blog list với hover effects
- **BlogEditor**: Side-by-side editor với live preview
- **BlogList**: Grid layout cho danh sách blog posts
- **BlogPost**: Component hiển thị chi tiết blog post

#### 4. Form Components
- **ContactForm**: Form liên hệ với validation
- **Input**: Reusable input component với Tailwind styling
- **Button**: Gradient button component với variants

#### 5. UI Components
- **Modal**: Base modal component với backdrop
- **LoadingSpinner**: Loading indicator
- **ErrorBoundary**: Error handling component

### TypeScript Interfaces

```typescript
// User Types
interface User {
  id: string;
  username: string;
  password: string;
  createdAt: Date;
}

// Blog Types
interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  authorId: string;
  author: User;
  createdAt: Date;
  updatedAt: Date;
}

interface BlogFormData {
  title: string;
  content: string;
  excerpt: string;
}

// Contact Types
interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

// Auth Types
interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthSession {
  user: {
    id: string;
    username: string;
  };
}
```

## Data Models

### Database Schema (Prisma)

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model User {
  id        String   @id @default(cuid())
  username  String   @unique
  password  String   // Plain text for demo purposes
  createdAt DateTime @default(now())
  
  // Relations
  blogPosts BlogPost[]
}

model BlogPost {
  id        String   @id @default(cuid())
  title     String
  content   String
  excerpt   String
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  author    User     @relation(fields: [authorId], references: [id])
}

model ContactSubmission {
  id        String   @id @default(cuid())
  name      String
  email     String
  message   String
  createdAt DateTime @default(now())
}
```

### API Endpoints

#### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `GET /api/auth/session` - Get current session

#### Blog Management
- `GET /api/blog` - Get all blog posts
- `POST /api/blog` - Create new blog post (protected)
- `GET /api/blog/[id]` - Get specific blog post
- `PUT /api/blog/[id]` - Update blog post (protected)
- `DELETE /api/blog/[id]` - Delete blog post (protected)

#### Contact
- `POST /api/contact` - Submit contact form

## Error Handling

### Client-Side Error Handling
- **Form Validation**: Real-time validation với error messages
- **API Error Handling**: Try-catch blocks với user-friendly messages
- **Error Boundaries**: React Error Boundaries cho component errors
- **Loading States**: Loading spinners và skeleton screens

### Server-Side Error Handling
- **API Route Errors**: Structured error responses với HTTP status codes
- **Database Errors**: Prisma error handling với fallbacks
- **Authentication Errors**: Proper error messages cho login failures
- **Validation Errors**: Input validation với detailed error messages

### Error Response Format
```typescript
interface ApiError {
  success: false;
  error: {
    message: string;
    code: string;
    details?: any;
  };
}

interface ApiSuccess<T> {
  success: true;
  data: T;
}
```

## Testing Strategy

### Unit Testing
- **Components**: React Testing Library cho UI components
- **Utilities**: Jest cho helper functions
- **API Routes**: Supertest cho endpoint testing
- **Database**: In-memory SQLite cho database operations

### Integration Testing
- **Authentication Flow**: End-to-end login/logout testing
- **Blog CRUD**: Complete blog management workflow
- **Form Submissions**: Contact form submission testing
- **Protected Routes**: Access control testing

### E2E Testing (Optional)
- **Playwright**: Browser automation testing
- **User Journeys**: Complete user workflows
- **Cross-browser**: Testing trên multiple browsers
- **Mobile Testing**: Responsive design validation

### Testing Tools
- **Jest**: Unit testing framework
- **React Testing Library**: Component testing
- **MSW**: API mocking cho tests
- **Playwright**: E2E testing (optional)

## Performance Considerations

### Frontend Optimization
- **Next.js Optimizations**: Automatic code splitting và image optimization
- **Lazy Loading**: Dynamic imports cho heavy components
- **Caching**: Browser caching cho static assets
- **Bundle Analysis**: Webpack bundle analyzer

### Backend Optimization
- **Database Indexing**: Proper indexes cho frequent queries
- **API Caching**: Response caching cho static data
- **Connection Pooling**: Prisma connection management
- **Query Optimization**: Efficient database queries

### Deployment Optimization
- **Vercel Edge Functions**: Fast global deployment
- **Static Generation**: Pre-built pages khi có thể
- **CDN**: Global content delivery
- **Compression**: Gzip compression cho assets

## Security Considerations

### Authentication Security
- **Session Management**: Secure session handling với Next-Auth
- **CSRF Protection**: Built-in CSRF protection
- **Password Storage**: Plain text (demo only - not for production)
- **Route Protection**: Server-side route protection

### Data Security
- **Input Validation**: Server-side validation cho all inputs
- **SQL Injection**: Prisma ORM protection
- **XSS Prevention**: React built-in XSS protection
- **HTTPS**: Enforced HTTPS trên production

### Deployment Security
- **Environment Variables**: Secure config management
- **API Rate Limiting**: Protection against abuse
- **Error Handling**: No sensitive data trong error messages
- **Security Headers**: Proper HTTP security headers