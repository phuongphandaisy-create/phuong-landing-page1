# AI-Assisted Landing Page - Phuong Daisy

A modern landing page with blog management system built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 🔐 Authentication system with Next-Auth
- 📝 Blog management with live preview editor
- 🎨 Modern UI/UX with gradient design system
- 📱 Fully responsive design
- 🌙 Dark mode support
- 📧 Contact form functionality
- 🗄️ SQLite database with Prisma ORM

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes + TypeScript  
- **Database**: SQLite + Prisma ORM
- **Authentication**: Next-Auth.js (Credentials Provider)
- **Deployment**: Vercel

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── admin/             # Protected admin routes
│   ├── blog/              # Public blog routes
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   └── api/               # API routes
├── components/            # Reusable components
├── lib/                  # Utility libraries
├── types/                # TypeScript type definitions
└── prisma/               # Database schema and migrations
```

## Environment Variables

Copy `.env.example` to `.env.local` and update the values:

```bash
cp .env.example .env.local
```

## Default Admin Credentials

- Username: `admin`
- Password: `password`

**Note**: Change these credentials in production!

## License

This project is for educational purposes.