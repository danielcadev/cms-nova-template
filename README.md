<div align="center">

# 🚀 CMS Nova

**Modern Headless CMS with Notion-style Design**

[![Next.js](https://img.shields.io/badge/Next.js-15+-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19+-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-Latest-green.svg)](https://www.prisma.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

*A complete headless CMS with visual content builder, user management, and modern admin interface*

</div>

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm
- Database (PostgreSQL, MySQL, or SQLite)

### Installation

```bash
# Install dependencies
npm install --legacy-peer-deps

# Configure environment
cp .env.example .env
# Edit DATABASE_URL in .env

# Setup database
npx prisma db push
npx prisma generate

# Start development server
npm run dev
```

### First Steps

1. 🌐 Visit **http://localhost:3000** → Redirects to admin setup
2. 👤 Go to **/admin/signup** → Create your first admin account  
3. 🎛️ Access **/admin** → Full-featured dashboard
4. 🎉 **Start building your content!**

---

## ✨ Features

### 🎯 **Core CMS Features**
- ✅ **Headless Architecture** with REST APIs
- ✅ **Visual Content Builder** with drag & drop
- ✅ **Dynamic Content Types** - create any structure
- ✅ **Rich Media Management** - images, files, galleries
- ✅ **SEO Optimization** - built-in meta management
- ✅ **Multi-language Support** - i18n ready

### 🔐 **Authentication & Security**
- ✅ **Better Auth Integration** - secure authentication
- ✅ **Role-based Permissions** - granular access control
- ✅ **User Management** - complete admin interface
- ✅ **Secure APIs** - authentication & authorization
- ✅ **Audit Logging** - track all changes

### 🎨 **Admin Interface**
- ✅ **Notion-style Design** - clean & intuitive
- ✅ **Dark/Light Mode** - automatic theme switching
- ✅ **Fully Responsive** - mobile-first design
- ✅ **Custom Components** - no external dependencies
- ✅ **Accessibility** - WCAG compliant

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 15 with App Router |
| **Frontend** | React 19, TypeScript |
| **Database** | Prisma ORM (PostgreSQL/MySQL/SQLite) |
| **Authentication** | Better Auth |
| **Styling** | Tailwind CSS |
| **UI Components** | Custom Radix UI components |
| **File Upload** | AWS S3 integration |
| **Deployment** | Vercel, Railway, Docker |

---

## 📁 Project Structure

```
cms-nova/
├── 📱 src/app/                 # Next.js App Router
│   ├── 🔐 admin/              # Admin dashboard
│   ├── 🌐 api/                # REST API routes
│   └── 📄 (pages)/            # Public pages
├── 🧩 src/components/          # Reusable components
│   ├── 🎛️ admin/              # Admin UI components
│   ├── 📝 cms/                # CMS core components
│   └── 🎨 ui/                 # Base UI components
├── 🗄️ prisma/                 # Database schema & migrations
├── 🔧 src/lib/                # Utilities & configurations
└── 📊 src/types/              # TypeScript definitions
```

---

## 🚀 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database with sample data

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

---

## 🌐 Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/cms_nova"

# Authentication
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# AWS S3 (Optional)
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="your-bucket-name"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 🧠 Headless CMS & Public Type Paths

CMS Nova works headless by default. There are no special Blog routes: use type paths based on your Content Types’ `apiIdentifier`.

- Headless type paths (controlled by plugin):
  - Requires enabling the `public-typepaths` plugin in Admin → Plugins.
  - Index: `/{[typePath]}` — lists published entries for the Content Type (`apiIdentifier`).
  - Detail: `/{[typePath]}/{[slug]}` — renders a single published entry.
  - Invalid types or no published entries return 404.

- Dynamic navigation for type paths (separate plugin):
  - Enable the `dynamic-nav` plugin in Admin → Plugins to add items to the navbar.
  - Modes:
    - `auto`: discovers Content Types from `/api/content-types` and creates links per `apiIdentifier`.
    - `include`: manually list which `typePaths` to show.
  - Options: `exclude` to omit, and `titleCase` to format labels.

- Starter pages for Plans/Circuits (optional and independent from type paths):
  - When disabled, `/planes` or `/circuitos` show a “disabled” notice with a link to the Dashboard.
  - When enabled, they render category indexes based on published entries.

Note: For a blog, create a Content Type (e.g. `blog`) and use the headless type paths `/{[typePath]}` and `/{[typePath]}/{[slug]}` instead of special routes like `/blog`.

## 📚 Documentation

- 📖 **[API Documentation](./docs/api.md)**
- 🎨 **[Theming Guide](./docs/theming.md)**
- 🔧 **[Configuration](./docs/configuration.md)**
- 🚀 **[Deployment Guide](./docs/deployment.md)**

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ by [Daniel CA](https://github.com/danielcadev)**

*If you find this project helpful, please consider giving it a ⭐*

</div>
