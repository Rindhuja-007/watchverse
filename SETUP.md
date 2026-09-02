# WatchVerse Project Setup Guide

## Initial Setup Steps

The Next.js project has been initialized with TypeScript, Tailwind CSS, and ESLint.

### Step 1: Install Dependencies

```bash
cd /home/rindhuja-007/Documents/watchverse
npm install
```

Dependencies added:
- **@auth/nextjs** - NextAuth.js for authentication
- **@prisma/client** - ORM for database  
- **prisma** - Prisma CLI
- **bcryptjs** - Password hashing
- **axios** - HTTP client
- **zod** - TypeScript-first schema validation
- **next-safe-action** - Server actions safety
- **framer-motion** - Animation library
- **lucide-react** - Icon library
- **shadcn/ui** - UI component library

### Step 2: Setup Environment Variables

Create `.env.local` in the project root with:

```
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/watchverse"

# TMDB API
TMDB_API_KEY="your_tmdb_api_key_here"

# NextAuth
AUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="http://localhost:3000"

# Optional: For production
# NEXTAUTH_URL="https://yourdomain.com"
```

Get your TMDB API key from: https://www.themoviedb.org/settings/api

### Step 3: Setup Database (PostgreSQL)

The project uses PostgreSQL with Prisma ORM.

**Option A: Local PostgreSQL**
```bash
# Create database
createdb watchverse
```

**Option B: Cloud PostgreSQL (Recommended)**
- Neon: https://neon.tech
- Supabase: https://supabase.com
- Railway: https://railway.app

Update `DATABASE_URL` in `.env.local` with your connection string.

### Step 4: Initialize Prisma

```bash
# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init

# (Optional) Seed database
npx prisma db seed
```

### Step 5: Setup shadcn/ui Components

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add select
npx shadcn-ui@latest add toast
```

### Step 6: Verify Build

```bash
npm run build
```

## Project Structure

```
watchverse/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/    # NextAuth endpoints
│   │   ├── search/                # TMDB search endpoints
│   │   └── library/               # Library management endpoints
│   ├── auth/
│   │   ├── login/                 # Login page
│   │   ├── register/              # Registration page
│   │   └── callback/              # OAuth callback
│   ├── dashboard/                 # Main dashboard
│   ├── library/                   # User's library view
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Landing page
├── components/
│   ├── auth/                      # Auth components
│   ├── library/                   # Library components
│   ├── search/                    # Search components
│   └── common/                    # Shared components
├── lib/
│   ├── auth.ts                    # Auth.js configuration
│   ├── db.ts                      # Prisma client
│   ├── tmdb.ts                    # TMDB API client
│   ├── schemas.ts                 # Zod schemas
│   └── utils.ts                   # Utility functions
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── migrations/                # Migration history
├── public/
│   ├── images/                    # Static images
│   └── icons/                     # Icon assets
├── .env.local                     # Environment variables (not in git)
├── next.config.ts                 # Next.js configuration
├── tailwind.config.ts             # Tailwind CSS configuration
└── tsconfig.json                  # TypeScript configuration
```

## Development

### Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000

### Database Management

```bash
# View database UI
npx prisma studio

# Create new migration
npx prisma migrate dev --name <migration_name>

# Reset database (⚠️ deletes all data)
npx prisma migrate reset
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Format code
npx prettier --write .
```

## Architecture Overview

### Authentication Flow
1. User navigates to /auth/login or /auth/register
2. Credentials validated against database or OAuth provider
3. NextAuth creates encrypted session token
4. Protected routes check session with middleware

### Search Flow
1. User searches for media on Dashboard
2. Frontend calls `/api/search` with query
3. Backend queries TMDB API
4. Results returned with poster, title, rating, etc.
5. User selects title to add to library

### Library Management Flow
1. User selects title and adds to library
2. Saves to `LibraryEntry` table with:
   - TMDB ID and media type
   - User's status (watched, watching, etc.)
   - Domain (movie, series, anime, kdrama, sitcom)
   - Rating and notes
3. For TV shows, `WatchProgress` tracks current episode
4. Dashboard displays library with filters and statistics

## Database Schema

### Users
- id, email, name, password (hashed), image
- Relations: libraryEntries, sessions, accounts

### LibraryEntry
- id, userId, tmdbId, mediaType, status, domain
- rating, notes, isFavorite
- dateAdded, dateStarted, dateCompleted
- personalTags

### WatchProgress
- id, libraryEntryId
- currentSeason, currentEpisode
- totalEpisodes, totalSeasons

### Account (OAuth)
- id, userId, provider, providerAccountId
- accessToken, refreshToken, expiresAt

### Session
- id, userId, sessionToken, expires

## Next Steps

1. ✅ Next.js project initialized
2. ⏳ Install dependencies (`npm install`)
3. ⏳ Setup PostgreSQL database
4. ⏳ Create `.env.local` with credentials
5. ⏳ Run Prisma migrations
6. ⏳ Setup shadcn/ui components
7. ⏳ Implement authentication
8. ⏳ Build TMDB API integration
9. ⏳ Create dashboard UI
10. ⏳ Add library management features

## Troubleshooting

### "MODULE_NOT_FOUND" error
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database connection failed
- Check `DATABASE_URL` in `.env.local`
- Verify PostgreSQL is running
- Test connection: `psql $DATABASE_URL`

### TMDB API errors
- Verify `TMDB_API_KEY` is valid
- Check API rate limits
- Ensure API key has required permissions

### Prisma issues
```bash
# Regenerate Prisma client
npx prisma generate

# View current database state
npx prisma db push
```

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs/)
- [NextAuth.js Docs](https://next-auth.js.org/)
- [TMDB API Docs](https://developer.themoviedb.org/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
