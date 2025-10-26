# Production Deployment Guide

## Issues Fixed

1. **NEXTAUTH_URL Configuration**: Fixed incorrect URL pointing to `/blog` instead of root domain
2. **Database Initialization**: Added automatic database setup for production
3. **Error Handling**: Improved error messages and debugging capabilities
4. **Health Check**: Added system health monitoring endpoint

## Changes Made

### Environment Configuration
- Fixed `NEXTAUTH_URL` in `.env.production`
- Added production database initialization script

### API Improvements
- Enhanced error handling in `/api/blog` endpoint
- Added `/api/health` endpoint for system monitoring
- Added `/api/init-db` endpoint for automatic database setup

### Frontend Improvements
- Added automatic database initialization retry logic
- Enhanced error display with debugging tools
- Added health check functionality

## Deployment Steps

1. **Update Environment Variables on Vercel**:
   ```bash
   NEXTAUTH_URL=https://phuong-landing-page1.vercel.app
   NEXTAUTH_SECRET=your-super-secure-secret-key-at-least-32-characters-long
   DATABASE_URL=file:./prod.db
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123^^
   NODE_ENV=production
   ```

2. **Deploy to Vercel**:
   - Push changes to your repository
   - Vercel will automatically build and deploy
   - The build process now includes database initialization

3. **Verify Deployment**:
   - Visit: `https://phuong-landing-page1.vercel.app/api/health`
   - Check blog page: `https://phuong-landing-page1.vercel.app/blog`
   - If issues persist, use the "Kiểm tra hệ thống" button on the blog page

## Troubleshooting

### Authentication Issues (Invalid username or password):
1. **Password Mismatch**: The most common issue is password mismatch between:
   - Environment variable `ADMIN_PASSWORD` 
   - Database seed script default password
   - What you're typing in login form

2. **Quick Fix**: Visit `/debug` page on your production site to:
   - Check system health
   - Reset admin password to match environment variable
   - Initialize database if needed

3. **Manual Fix**: Use the reset admin endpoint:
   ```bash
   curl -X POST https://phuong-landing-page1.vercel.app/api/reset-admin
   ```

### If Blog Still Shows Error:
1. Check browser console for detailed error messages
2. Visit `/api/health` endpoint to check system status
3. Use the "Kiểm tra hệ thống" button on the blog page
4. Check Vercel function logs in the dashboard

### Database Issues:
- The app will automatically try to initialize the database if it's missing
- SQLite database is created during the build process
- Sample blog posts are automatically created
- Use `/debug` page for manual database operations

### Environment Variable Issues:
- Verify NEXTAUTH_URL matches your actual domain exactly
- Ensure NEXTAUTH_SECRET is at least 32 characters
- Make sure ADMIN_PASSWORD matches what you're using to login
- Check Vercel environment variables are set correctly

## Monitoring

- Health endpoint: `/api/health`
- Returns database status, connection info, and environment details
- Use for monitoring and debugging production issues