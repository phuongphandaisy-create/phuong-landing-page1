# Database Setup

This directory contains the Prisma schema, migrations, and seed data for the AI-Assisted Landing Page project.

## Schema Overview

The database includes three main models:

### User
- `id`: Unique identifier (cuid)
- `username`: Unique username for authentication
- `password`: Plain text password (demo purposes only)
- `createdAt`: Timestamp of user creation
- **Relations**: One-to-many with BlogPost

### BlogPost
- `id`: Unique identifier (cuid)
- `title`: Blog post title
- `content`: Full blog post content (markdown supported)
- `excerpt`: Short description/preview
- `authorId`: Foreign key to User
- `createdAt`: Timestamp of creation
- `updatedAt`: Timestamp of last update
- **Relations**: Many-to-one with User

### ContactSubmission
- `id`: Unique identifier (cuid)
- `name`: Contact person's name
- `email`: Contact person's email
- `message`: Contact message content
- `createdAt`: Timestamp of submission

## Setup Instructions

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Generate Prisma client**:
   ```bash
   npm run db:generate
   ```

3. **Push schema to database**:
   ```bash
   npx prisma db push
   ```

4. **Seed the database**:
   ```bash
   npm run db:seed
   ```

   Or run all setup steps at once:
   ```bash
   npm run db:setup
   ```

## Default Admin Credentials

After seeding, you can log in with:
- **Username**: `admin`
- **Password**: `admin123`

## Sample Data

The seed script creates:
- 1 admin user
- 2 sample blog posts
- 1 sample contact submission

## Database File

The SQLite database file will be created at `prisma/dev.db` after running the setup.

## Migration

The initial migration is located at:
- `prisma/migrations/20241007000000_init/migration.sql`

This creates all the necessary tables and indexes for the application.