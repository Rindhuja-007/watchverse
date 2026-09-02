# WatchVerse Manual Setup Instructions

Due to environment limitations, please follow these steps manually to complete the project setup.

## Step 1: Install Dependencies

```bash
cd /home/rindhuja-007/Documents/watchverse
npm install
```

**Expected output**: All 60+ packages installed successfully

## Step 2: Create Prisma Directory and Schema

Create the `prisma` directory:
```bash
mkdir -p prisma
```

Copy the schema from `prisma_schema_template.txt` to `prisma/schema.prisma`:
```bash
cp prisma_schema_template.txt prisma/schema.prisma
```

Verify:
```bash
cat prisma/schema.prisma
```

## Step 3: Create Environment File

Create `.env.local` in the project root (copy from `.env.example`):

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in:
- `DATABASE_URL` - Your PostgreSQL connection string
- `TMDB_API_KEY` - Your TMDB API key (get from https://www.themoviedb.org/settings/api)
- `AUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `NEXTAUTH_URL` - http://localhost:3000 (for development)

## Step 4: Create Library Files

Create the `lib` directory:
```bash
mkdir -p lib
```

Copy template files to lib directory:
```bash
cp lib_db_template.ts lib/db.ts
cp lib_tmdb_template.ts lib/tmdb.ts
cp lib_auth_template.ts lib/auth.ts
cp lib_schemas_template.ts lib/schemas.ts
```

Create utility file `lib/utils.ts`:
```bash
cat > lib/utils.ts << 'EOF'
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | null): string {
  if (!date) return "Never";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getMediaTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    movie: "Movie",
    tv: "TV Series",
    anime: "Anime",
    kdrama: "K-Drama",
    sitcom: "Sitcom",
  };
  return labels[type] || type;
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    watched: "Watched",
    watching: "Watching",
    plan_to_watch: "Plan to Watch",
    on_hold: "On Hold",
    dropped: "Dropped",
  };
  return labels[status] || status;
}
EOF
```

## Step 5: Create App Directories

```bash
mkdir -p app/auth/{login,register}
mkdir -p app/api/auth
mkdir -p app/api/search
mkdir -p app/api/library
mkdir -p components/{auth,library,search,common}
mkdir -p public/images
```

## Step 6: Generate Prisma Client

```bash
npx prisma generate
```

**Expected**: "✓ Generated Prisma Client"

## Step 7: Setup Database

First, ensure PostgreSQL is running and accessible.

For local PostgreSQL:
```bash
createdb watchverse
```

For cloud providers (Neon, Supabase, etc.), update your DATABASE_URL with the connection string.

Create database tables:
```bash
npx prisma migrate dev --name init
```

This will:
1. Create migration files
2. Apply migrations to database
3. Generate Prisma types

## Step 8: Initialize shadcn/ui

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
npx shadcn-ui@latest add scroll-area
```

## Step 9: Update Tailwind Configuration

Update `tailwind.config.ts`:
```bash
cat > tailwind.config.ts << 'EOF'
import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: animate,
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
EOF
```

## Step 10: Build and Verify

```bash
npm run build
```

**Expected**: Build succeeds with no errors

## Step 11: Start Development Server

```bash
npm run dev
```

**Expected output**:
```
> ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

Visit http://localhost:3000 in your browser.

## Next: Building the UI and Features

After the above setup is complete, we'll build:

1. **Landing Page** (`app/page.tsx`)
2. **Authentication Pages** (`app/auth/login/page.tsx`, `app/auth/register/page.tsx`)
3. **Dashboard** (`app/dashboard/page.tsx`)
4. **Search Interface** (TMDB search integration)
5. **Library Management** (Add, edit, delete entries)
6. **Watch Progress Tracking** (For TV shows)
7. **Statistics and Visualizations**
8. **User Settings**

## Troubleshooting

### "DATABASE_URL is not set"
- Check `.env.local` exists and has correct value
- Restart development server after changing env vars

### "TMDB_API_KEY is invalid"
- Verify API key from https://www.themoviedb.org/settings/api
- Ensure it's for API v3 (not v4)
- Check API key hasn't expired

### Prisma migration errors
```bash
# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Create new migration
npx prisma migrate dev --name <name>
```

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

## File Structure After Setup

```
watchverse/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── search/
│   │   └── library/
│   ├── auth/
│   │   ├── login/
│   │   └── register/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── auth/
│   ├── library/
│   ├── search/
│   └── common/
├── lib/
│   ├── db.ts
│   ├── tmdb.ts
│   ├── auth.ts
│   ├── schemas.ts
│   └── utils.ts
├── prisma/
│   └── schema.prisma
├── public/
├── .env.local
├── .env.example
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

Once you complete these steps, let me know and I'll help you build the UI components and features!
