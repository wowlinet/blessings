# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BlessYou.Today is a Next.js 15 application that displays and shares blessings, prayers, and inspirational messages organized by categories and subcategories. The app uses Supabase as its backend database and authentication provider.

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (alpha)
- **Database**: Supabase (PostgreSQL)
- **State Management**: Zustand
- **UI Components**: lucide-react (icons), sonner (toasts)
- **Fonts**: Inter (sans-serif), Crimson Text (serif)

## Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Project Architecture

### Database Schema

The app uses 5 main tables in Supabase:

1. **categories** - Top-level blessing categories (e.g., Birthday, Wedding)
2. **subcategories** - Nested categories under main categories
3. **blessings** - The actual blessing content with metadata
4. **share_analytics** - Tracks social media shares
5. **user_favorites** - User's favorited blessings (requires auth)

Key relationships:
- Categories → Subcategories (one-to-many)
- Categories → Blessings (one-to-many)
- Subcategories → Blessings (one-to-many)

### Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with Header/Footer
│   ├── page.tsx            # Homepage
│   ├── blessings/[id]/     # Individual blessing detail page
│   ├── categories/[slug]/  # Category listing page
│   └── search/             # Search results page
├── components/             # React components
│   ├── BlessingCard.tsx    # Card displaying blessing preview
│   ├── BlessingDetail.tsx  # Full blessing detail view
│   ├── ShareButtons.tsx    # Social sharing modal
│   └── ...                 # Other UI components
├── lib/
│   └── supabase.ts         # Supabase client and DB helper functions
└── types/
    └── index.ts            # TypeScript type definitions
```

### Data Fetching Pattern

All database queries use helper functions from [src/lib/supabase.ts](src/lib/supabase.ts):

- `getCategories()` - Fetch all categories with subcategories
- `getCategoryBySlug(slug)` - Get category by slug
- `getBlessings(filters)` - Query blessings with optional filters
- `getBlessingById(id)` - Get single blessing
- `searchBlessings(query, filters)` - Full-text search
- `trackShare(blessingId, platform)` - Record share analytics

Pages use these functions in Server Components for automatic server-side rendering.

### Component Patterns

**Server Components** (default):
- All pages in `app/` directory
- Fetch data directly using Supabase helpers
- No client-side state

**Client Components** (`'use client'`):
- Interactive UI like BlessingCard, ShareButtons
- Use hooks (useState, useEffect)
- Handle user interactions (copy, share, favorite)

### Styling Conventions

- Custom color palette defined in [tailwind.config.js](tailwind.config.js):
  - `primary`: Golden yellow theme color (#f7b801)
  - `secondary`: Blue accent colors
  - `cream`: Light background (#fef7ed)
- Typography:
  - `font-inter`: UI text (body, buttons, navigation)
  - `font-crimson`: Blessing content (serif for readability)
- Custom animations: `fade-in`, `slide-up`

### SEO & Metadata

Each page implements Next.js Metadata API:
- Dynamic meta titles/descriptions
- OpenGraph images for social sharing
- Twitter Card support
- Structured data via metadata

Check [src/app/layout.tsx](src/app/layout.tsx) for global metadata template.

### Supabase Configuration

The Supabase client is configured with:
- URL: `https://pohyvwtrdxcutzljipuu.supabase.co`
- Anon key is public (stored in [src/lib/supabase.ts](src/lib/supabase.ts))
- RLS policies enforce read-only access for public users
- Database migrations in `supabase/migrations/`

### Path Aliases

TypeScript is configured with `@/*` alias pointing to `src/*`:
```typescript
import { Blessing } from '@/types'
import { supabase } from '@/lib/supabase'
```

## Important Notes

- **Content Types**: Blessings have 3 types: `short`, `long`, `image`
- **Social Sharing**: ShareButtons component handles Facebook, Twitter, WhatsApp, LinkedIn, Pinterest
- **Analytics**: Track shares via `trackShare()` function which increments counters and logs to analytics table
- **Image Domains**: Next.js configured to allow images from `trae-api-sg.mchost.guru`
- **Routing**: Uses Next.js 15 App Router with nested dynamic routes
