# Vercel Deployment Guide

## Quick Fix for Current Issue

### Step 1: Set Environment Variables in Vercel
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add these variables:

```
DATABASE_URL=file:./prod.db
NEXTAUTH_URL=https://phuong-landing-page1.vercel.app
NEXTAUTH_SECRET=your-super-secure-secret-key-at-least-32-characters-long-change-this
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123^^
NODE_ENV=production
```

### Step 2: Redeploy
After setting the environment variables, trigger a new deployment.

## Recommended Production Setup

### Option 1: Use Vercel Postgres (Recommended)

1. **Add Vercel Postgres to your project:**
   - In Vercel dashboard, go to **Storage** tab
   - Click **Create Database** → **Postgres**
   - This will automatically set `DATABASE_URL` environment variable

2. **Update Prisma schema for PostgreSQL:**
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

3. **Update dependencies:**
   ```bash
   npm install pg @types/pg
   ```

### Option 2: Keep SQLite (Current Setup)

The current build script has been updated to handle missing DATABASE_URL gracefully. Your app will work with the environment variables set above.

## Build Process Explanation

The new build script (`scripts/vercel-build.js`) will:
1. Always generate Prisma client
2. Only run database operations if DATABASE_URL is available
3. Build the Next.js application
4. Handle errors gracefully

## Post-Deployment Steps

After successful deployment:
1. Visit your app to ensure it loads
2. Test admin login functionality
3. Create a few blog posts to verify database operations
4. Test contact form submissions

## Security Notes

- Change `NEXTAUTH_SECRET` to a secure random string (at least 32 characters)
- Update admin credentials from default values
- Consider using environment-specific secrets for production