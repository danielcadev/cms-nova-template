---
description: Repository Information Overview
alwaysApply: true
---

# CMS Nova Information

## Summary
CMS Nova is a modern headless CMS with Notion-style design, featuring a visual content builder, user management, and a complete admin interface. It's built with Next.js, React, TypeScript, and Prisma ORM, providing a flexible and powerful content management system.

## Structure
- **src/app/**: Next.js App Router with admin dashboard, API routes, and public pages
- **src/components/**: Reusable components for admin UI, CMS core, and base UI
- **src/lib/**: Utilities and configurations
- **src/types/**: TypeScript definitions
- **prisma/**: Database schema and migrations
- **src/hooks/**: Custom React hooks
- **src/contexts/**: React context providers
- **src/config/**: Application configuration

## Language & Runtime
**Language**: TypeScript/JavaScript
**Version**: TypeScript 5+
**Framework**: Next.js 15+, React 19+
**Build System**: Next.js build system
**Package Manager**: npm
**Node Version**: >=18.0.0

## Dependencies
**Main Dependencies**:
- Next.js 15.3.5 (App Router)
- React 19.1.0
- Prisma ORM 6.11.0
- Better Auth 1.2.12
- Radix UI components
- Tailwind CSS
- AWS S3 integration
- Zod 3.22.4 (validation)
- React Hook Form 7.50.1

**Development Dependencies**:
- TypeScript 5.3.3
- ESLint 8.56.0
- Prisma CLI 6.11.0
- Tailwind CSS 3.4.1
- TSX 4.7.0

## Database
**ORM**: Prisma
**Default Provider**: PostgreSQL
**Models**: User, Account, Session, Verification, Plan, Destination, ContentType, ContentEntry, Field, ActivityLog, NovaConfig

## Build & Installation
```bash
# Install dependencies
npm install --legacy-peer-deps

# Configure environment
cp .env.example .env
# Edit DATABASE_URL in .env

# Setup database
npx prisma db push
npx prisma generate

# Development
npm run dev

# Production build
npm run build
npm run start
```

## Environment Configuration
**Required Variables**:
- DATABASE_URL: PostgreSQL connection string
- BETTER_AUTH_SECRET: Authentication secret key
- BETTER_AUTH_URL: Authentication URL
- NEXT_PUBLIC_APP_URL: Application URL

**Optional Variables**:
- AWS_ACCESS_KEY_ID: AWS S3 access key
- AWS_SECRET_ACCESS_KEY: AWS S3 secret key
- AWS_REGION: AWS region
- AWS_S3_BUCKET: S3 bucket name

## Testing
No specific testing framework configuration found in the repository.

## Deployment
**Output Mode**: standalone (optimized for various deployment platforms)
**Supported Platforms**: Vercel, Railway, Docker
**External Packages**: @prisma/client, bcrypt (for server)