# WatchVerse Quick Reference

## 🚀 Project Setup Checklist

### Phase 1: Initial Setup (Do This First)
- [ ] `npm install` - Install all dependencies
- [ ] Copy `.env.example` to `.env.local`
- [ ] Get TMDB API key from https://www.themoviedb.org/settings/api
- [ ] Setup PostgreSQL database
- [ ] Update `.env.local` with:
  - DATABASE_URL
  - TMDB_API_KEY
  - AUTH_SECRET (generate with: `openssl rand -base64 32`)
  - NEXTAUTH_URL

### Phase 2: Prisma Setup
- [ ] Create `prisma/` directory: `mkdir -p prisma`
- [ ] Copy schema: `cp prisma_schema_template.txt prisma/schema.prisma`
- [ ] Generate Prisma client: `npx prisma generate`
- [ ] Create database: `npx prisma migrate dev --name init`

### Phase 3: Copy Library Files
```bash
mkdir -p lib
cp lib_db_template.ts lib/db.ts
cp lib_tmdb_template.ts lib/tmdb.ts
cp lib_auth_template.ts lib/auth.ts
cp lib_schemas_template.ts lib/schemas.ts
```

### Phase 4: Setup UI Components
- [ ] `npx shadcn-ui@latest add button`
- [ ] `npx shadcn-ui@latest add card`
- [ ] `npx shadcn-ui@latest add input`
- [ ] `npx shadcn-ui@latest add dialog`
- [ ] `npx shadcn-ui@latest add dropdown-menu`
- [ ] `npx shadcn-ui@latest add tabs`
- [ ] `npx shadcn-ui@latest add badge`
- [ ] `npx shadcn-ui@latest add select`
- [ ] `npx shadcn-ui@latest add toast`

### Phase 5: Verify & Test
- [ ] `npm run build` - Ensure build succeeds
- [ ] `npm run dev` - Start development server
- [ ] Visit http://localhost:3000

---

## 📂 File Locations

| File | Location | Purpose |
|------|----------|---------|
| Database URL | `.env.local` | PostgreSQL connection |
| TMDB API Key | `.env.local` | Movie/TV data access |
| User Model | `prisma/schema.prisma` | Database User schema |
| Library Model | `prisma/schema.prisma` | Database LibraryEntry schema |
| Prisma Client | `lib/db.ts` | Database connection singleton |
| TMDB API | `lib/tmdb.ts` | TMDB API wrapper |
| Auth Config | `lib/auth.ts` | NextAuth configuration |
| Validation | `lib/schemas.ts` | Zod validation schemas |
| Utilities | `lib/utils.ts` | Helper functions |
| Root Layout | `app/layout.tsx` | Next.js root layout |
| Home Page | `app/page.tsx` | Landing page |
| Components | `components/` | Reusable React components |
| API Routes | `app/api/` | Backend endpoints |

---

## 🔌 Environment Variables

### Development (.env.local)
```
DATABASE_URL=postgresql://user:password@localhost:5432/watchverse
TMDB_API_KEY=your_api_key_here
AUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000
```

### Production (set on hosting platform)
```
DATABASE_URL=postgresql://...
TMDB_API_KEY=...
AUTH_SECRET=...
NEXTAUTH_URL=https://yourdomain.com
```

---

## 📊 Database Schema Quick Reference

### Users Table
- `id` (String, PK) - Unique user identifier
- `email` (String, UNIQUE) - User email
- `name` (String?) - User name
- `password` (String?) - Hashed password
- `image` (String?) - Profile picture URL
- `createdAt` (DateTime) - Account creation date
- `updatedAt` (DateTime) - Last update date

### LibraryEntry Table
- `id` (String, PK) - Unique entry ID
- `userId` (String, FK) - User who added it
- `tmdbId` (Int) - TMDB media ID
- `mediaType` (String) - "movie" or "tv"
- `status` (String) - watched/watching/plan_to_watch/on_hold/dropped
- `domain` (String?) - movie/series/anime/kdrama/sitcom
- `rating` (Int?) - 0-10
- `notes` (String?) - User notes
- `isFavorite` (Boolean) - Is favorited
- `dateAdded` (DateTime) - When added
- `dateStarted` (DateTime?) - When started watching
- `dateCompleted` (DateTime?) - When finished
- `personalTags` (String?) - Custom tags

### WatchProgress Table
- `id` (String, PK) - Unique record ID
- `libraryEntryId` (String, FK) - Associated library entry
- `currentSeason` (Int) - Current season number
- `currentEpisode` (Int) - Current episode number
- `totalEpisodes` (Int?) - Total episodes
- `totalSeasons` (Int?) - Total seasons

---

## 🔑 Key API Endpoints (To Build)

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/reset-password` - Password reset

### Search
- `GET /api/search?query=...` - Search movies/TV shows
- `GET /api/search/movie?id=...` - Get movie details
- `GET /api/search/tv?id=...` - Get TV show details

### Library
- `GET /api/library` - Get user's library
- `POST /api/library` - Add to library
- `PUT /api/library/:id` - Update library entry
- `DELETE /api/library/:id` - Remove from library
- `GET /api/library/stats` - Get statistics

### Watch Progress
- `PUT /api/library/:id/progress` - Update watch progress
- `GET /api/library/:id/progress` - Get watch progress

---

## 🎨 Key Pages to Build

### Public Pages
- `/` - Landing page with featured content
- `/auth/login` - User login
- `/auth/register` - User registration

### Protected Pages (Require Authentication)
- `/dashboard` - Main dashboard
- `/library` - User's library view
- `/library/[id]` - Title details page
- `/search` - Search results
- `/settings` - User settings

---

## 🧪 Testing Commands

```bash
# Check dependencies installed
npm list

# Check for TypeScript errors
npx tsc --noEmit

# Run linter
npm run lint

# View database UI
npx prisma studio

# Check database schema
npx prisma db push --dry-run

# Test TMDB API connectivity
curl "https://api.themoviedb.org/3/search/movie?api_key=YOUR_KEY&query=test"
```

---

## 🚨 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| `MODULE_NOT_FOUND` | Run `npm install` |
| `DATABASE_URL not set` | Check `.env.local` exists and is correct |
| `TMDB API error` | Verify API key is valid and not rate limited |
| `Prisma error` | Run `npx prisma generate` |
| `Port 3000 in use` | Use different port: `npm run dev -- -p 3001` |
| `Migration failed` | Check database is running: `psql $DATABASE_URL` |
| `Build fails` | Run `npm run lint` to check for TypeScript errors |

---

## 📚 Documentation Files

1. **README.md** - Project overview
2. **SETUP.md** - Comprehensive setup guide
3. **MANUAL_SETUP.md** - Step-by-step instructions
4. **PROJECT_STATUS.md** - Current status and roadmap
5. **QUICK_REFERENCE.md** - This file

---

## 🎯 Next Steps After Setup

1. ✅ Complete initial setup
2. Build authentication pages (login, register, logout)
3. Implement TMDB search and display
4. Create dashboard UI
5. Build library management (add, edit, delete)
6. Add episode tracking
7. Implement statistics
8. Add user settings and preferences
9. Deploy to production

---

## 💡 Development Tips

- Use `npx prisma studio` to visually manage database
- Check `npm run dev` console for detailed error messages
- Use browser DevTools to inspect network requests to TMDB API
- Test authentication flow at `/auth/login` first
- Use TypeScript strict mode to catch type errors early

---

## 🔗 Useful Links

- **TMDB API Docs**: https://developer.themoviedb.org/docs/
- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **NextAuth Docs**: https://next-auth.js.org
- **Tailwind Docs**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com
- **Framer Motion**: https://www.framer.com/motion

---

**Last Updated**: 2024
**Status**: Ready for Setup
