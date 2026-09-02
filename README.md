# WatchVerse

Your life in stories.

A full-stack entertainment tracking application for movies, TV shows, anime, K-dramas, and sitcoms. Track what you watch, rate your favorite titles, and explore your entertainment history.

## ✨ Features

- **User Authentication** - Secure account creation with email/password or Google OAuth
- **Smart Search** - Search TMDB's extensive library of movies and TV shows
- **Personal Library** - Add titles to your library and organize them
- **Status Tracking** - Mark titles as watched, watching, plan to watch, on hold, or dropped
- **Rating System** - Rate watched titles from 1 to 10
- **Episode Tracking** - Track your progress through TV series with season/episode information
- **Smart Categorization** - Organize content by domain (movies, series, anime, K-dramas, sitcoms)
- **Personal Notes** - Add custom notes and tags to your library entries
- **Statistics & Insights** - View your watch history and statistics
- **Dark/Light Theme** - Choose your preferred theme
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Cinematic UI** - Beautiful animations and modern design inspired by movie posters

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or cloud)
- TMDB API key (get it for free at https://www.themoviedb.org/settings/api)

### Installation

1. **Clone and Install**
   ```bash
   cd watchverse
   npm install
   ```

2. **Setup Environment**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in `.env.local` with:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `TMDB_API_KEY` - Your TMDB API key
   - `AUTH_SECRET` - Run: `openssl rand -base64 32`
   - `NEXTAUTH_URL` - http://localhost:3000 (development)

3. **Database Setup**
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

   Open http://localhost:3000 in your browser.

## 📖 Documentation

- [SETUP.md](./SETUP.md) - Comprehensive setup guide
- [MANUAL_SETUP.md](./MANUAL_SETUP.md) - Detailed step-by-step instructions
- [PROJECT_STATUS.md](./PROJECT_STATUS.md) - Project status and roadmap

## 🏗️ Architecture

### Frontend
- **Framework**: Next.js 16 with App Router
- **UI Library**: React 19 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms & Validation**: Zod schemas

### Backend
- **Runtime**: Node.js via Next.js
- **API**: Next.js API Routes and Server Actions
- **Authentication**: NextAuth.js with Credentials & Google OAuth
- **Database**: PostgreSQL with Prisma ORM
- **External API**: TMDB API for media data

### Database Schema

**Users**
- Email and password (hashed)
- Profile information

**LibraryEntry**
- TMDB ID and media type
- User status and domain
- Rating and personal notes
- Favorite flag and dates

**WatchProgress**
- Current season and episode
- Episode tracking for TV shows

**OAuth & Sessions**
- Secure session management
- OAuth account linking

## 🛠️ Development

### Project Structure
```
app/                 - Next.js app directory
├── api/             - API routes
├── auth/            - Authentication pages
└── dashboard/       - Main application

components/         - Reusable React components
lib/                - Utilities and configuration
  ├── db.ts         - Prisma client
  ├── tmdb.ts       - TMDB API client
  ├── auth.ts       - NextAuth configuration
  ├── schemas.ts    - Zod validation schemas
  └── utils.ts      - Helper functions
prisma/             - Database schema
public/             - Static assets
```

### Available Commands

```bash
# Development
npm run dev          # Start dev server at http://localhost:3000

# Building
npm run build        # Create optimized production build
npm start            # Run production server

# Code Quality
npm run lint         # Run ESLint

# Database
npx prisma studio   # Open Prisma database UI
npx prisma migrate dev --name <name>  # Create migration
npx prisma migrate reset              # Reset database (⚠️ deletes all data)
```

### Environment Variables

**Required for Development:**
- `DATABASE_URL` - PostgreSQL connection string
- `TMDB_API_KEY` - TMDB API key
- `AUTH_SECRET` - Secret key for session encryption
- `NEXTAUTH_URL` - Application URL

**Optional:**
- `GOOGLE_ID` - Google OAuth client ID
- `GOOGLE_SECRET` - Google OAuth client secret
- `NEXTAUTH_CALLBACK_URL` - OAuth callback URL (defaults to NEXTAUTH_URL)

## 📚 Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | Next.js 16, React 19, TypeScript 5 |
| **Styling** | Tailwind CSS 4, shadcn/ui |
| **Animations** | Framer Motion |
| **Backend** | Next.js API Routes, Server Actions |
| **Auth** | NextAuth.js 5 |
| **Database** | PostgreSQL, Prisma ORM |
| **Validation** | Zod |
| **External Data** | TMDB API v3 |

## 🔐 Security

- ✅ Environment variables for sensitive data
- ✅ Password hashing with bcryptjs
- ✅ Secure session handling with NextAuth
- ✅ Server-side API key handling (never exposed to browser)
- ✅ TypeScript strict mode
- ✅ Input validation with Zod
- ✅ Protected API routes

## 🎨 Design System

- **Color Scheme**: Cinematic and vibrant
- **Typography**: Modern and readable
- **Components**: Built with shadcn/ui
- **Animations**: Smooth transitions with Framer Motion
- **Responsiveness**: Mobile-first design
- **Accessibility**: WCAG compliant

## 📱 Supported Platforms

- ✅ Desktop (Chrome, Firefox, Safari, Edge)
- ✅ Tablet (iPad, Android tablets)
- ✅ Mobile (iOS, Android)
- ✅ Dark/Light theme support

## 🚢 Deployment

The application is ready to deploy to:
- Vercel (recommended for Next.js)
- Railway
- Render
- AWS
- Google Cloud
- Any Node.js hosting provider

Environment variables must be set on the hosting platform.

## 🤝 Contributing

Contributions are welcome! Feel free to open issues and pull requests.

## 📄 License

MIT License - Feel free to use this project for personal or commercial purposes.

## 🆘 Support

For issues or questions:

1. Check the documentation files (SETUP.md, MANUAL_SETUP.md)
2. Review error messages in the console
3. Verify environment variables are set correctly
4. Ensure PostgreSQL is running
5. Test TMDB API key at https://www.themoviedb.org/settings/api

## 🗺️ Roadmap

### Phase 1: Core Features ✅
- [x] Project setup
- [ ] User authentication
- [ ] TMDB search integration
- [ ] Library management
- [ ] Basic dashboard

### Phase 2: Enhanced Features
- [ ] Episode tracking
- [ ] Statistics and insights
- [ ] Advanced filtering
- [ ] User preferences
- [ ] Social features (sharing, lists)

### Phase 3: Premium Features
- [ ] Recommendations engine
- [ ] Integration with streaming services
- [ ] Export watch history
- [ ] Mobile app

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for providing the movie/TV data API
- [Next.js](https://nextjs.org/) for the amazing framework
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Prisma](https://www.prisma.io/) for excellent database ORM

---

**Made with ❤️ for entertainment lovers worldwide**
