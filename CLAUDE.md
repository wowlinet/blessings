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
   - Has `is_active`, `sort_order`, and SEO fields (`seo_title`, `seo_description`, `seo_keywords`)
2. **subcategories** - Nested categories under main categories
   - Also includes SEO fields and `sort_order`
3. **blessings** - The actual blessing content with metadata
   - Includes `slug` for URL-friendly routing
   - Has `content_type` ('short' | 'long' | 'image'), `language_style` ('formal' | 'casual')
   - Tracks engagement: `view_count`, `share_count`, `is_featured`
   - SEO metadata: `meta_title`, `meta_description`, `meta_keywords`, `og_image_url`, `pinterest_image_url`
4. **share_analytics** - Tracks social media shares with platform, timestamps, and referrer data
5. **user_favorites** - User's favorited blessings (requires auth)
6. **user_profiles** - Extended user profile data (created via trigger on auth.users)

Key relationships:
- Categories → Subcategories (one-to-many)
- Categories → Blessings (one-to-many)
- Subcategories → Blessings (one-to-many)

### Directory Structure

```
src/
├── app/                         # Next.js App Router pages
│   ├── @modal/                  # Parallel route slot for modal overlays
│   │   ├── (.)blessings/[id]/   # Intercepted route for blessing modals
│   │   └── default.tsx          # Default parallel route fallback
│   ├── layout.tsx               # Root layout with Header/Footer + modal slot
│   ├── page.tsx                 # Homepage
│   ├── blessings/[slug]/        # Individual blessing detail page (by slug)
│   ├── categories/[slug]/       # Category listing page
│   │   └── [subcategory]/       # Subcategory listing page
│   ├── search/                  # Search results page
│   ├── profile/                 # User profile page (auth required)
│   └── favorites/               # User favorites page
├── components/                  # React components
│   ├── BlessingCard.tsx         # Card with copy/share/favorite actions
│   ├── BlessingDetail.tsx       # Full blessing detail view
│   ├── BlessingModal.tsx        # Modal wrapper for blessing detail
│   ├── ShareButtons.tsx         # Social sharing modal
│   ├── AuthModal.tsx            # Authentication modal
│   └── ...                      # Other UI components
├── lib/
│   └── supabase.ts              # Supabase client and DB helper functions
└── types/
    ├── index.ts                 # Main type definitions
    └── analytics.ts             # Analytics types
```

### Advanced Routing Patterns

**Parallel Routes + Route Interception**:
- The app uses Next.js 15's parallel routes feature with a `@modal` slot in the root layout
- When clicking a blessing card, the route is intercepted via `(.)blessings/[id]/page.tsx`
- This shows the blessing in a modal overlay while maintaining the URL
- Hard navigation to `/blessings/[slug]` shows the full page
- Modal closes with `router.back()` on ESC key, backdrop click, or close button

**Dynamic Routes**:
- `/blessings/[slug]` - Uses blessing slug (not ID) for SEO-friendly URLs
- `/categories/[slug]` - Category pages with subcategory tabs
- `/categories/[slug]/[subcategory]` - Filtered by subcategory
- All dynamic params are `Promise<{}>` objects in Next.js 15 (must `await params`)

### Data Fetching Pattern

All database queries use helper functions from `src/lib/supabase.ts`:

- `getCategories()` - Fetch all active categories with subcategories
- `getCategoryBySlug(slug)` - Get category by slug with subcategories
- `getSubcategoryBySlug(categorySlug, subcategorySlug)` - Get specific subcategory
- `getBlessings(filters)` - Query blessings with optional filters (category_id, subcategory_id, content_type, is_featured, limit, offset)
- `getBlessingById(id)` - Get single blessing by ID
- `getBlessingBySlug(slug)` - Get single blessing by slug
- `searchBlessings(filters)` - Full-text search with pagination
  - Sanitizes query to prevent PostgreSQL tsquery syntax errors
  - Returns `{ blessings, total, totalPages }` with graceful error handling
  - Falls back to empty results if search fails
- `trackShare(blessingId, platform, categorySlug?, subcategorySlug?)` - Record share analytics and increment share_count
- `incrementShareCount(blessingId)` - RPC call to increment share counter

**Error Handling**: Search and getBlessings functions catch errors and return empty results instead of throwing, ensuring graceful degradation.

Pages use these functions in Server Components for automatic server-side rendering.

### Authentication & Favorites Pattern

**Dual-Mode Favorites System**:
- **Authenticated users**: Favorites stored in `user_favorites` table (Supabase auth)
- **Guest users**: Favorites stored in `localStorage` as JSON array of blessing IDs
- Components check `supabase.auth.getUser()` to determine which storage to use
- `BlessingCard.tsx` handles both modes transparently in `handleFavorite()`

**User Profile**:
- Created automatically via database trigger when user signs up
- Stored in `user_profiles` table with reference to `auth.users`

### Component Patterns

**Server Components** (default):
- All pages in `app/` directory
- Fetch data directly using Supabase helpers
- No client-side state
- Use `async function` to fetch data before rendering

**Client Components** (`'use client'`):
- Interactive UI like BlessingCard, ShareButtons, BlessingModal, AuthModal
- Use hooks (useState, useEffect, useRouter)
- Handle user interactions (copy, share, favorite, authentication)

### Styling Conventions

- Custom color palette defined in `tailwind.config.js`:
  - `primary`: Golden yellow theme color (#f7b801)
  - `secondary`: Blue accent colors
  - `cream`: Light background (#fef7ed)
- Typography:
  - `font-inter`: UI text (body, buttons, navigation)
  - `font-crimson`: Blessing content (serif for readability)
- Custom animations: `fade-in`, `slide-up`
- Responsive design with mobile-first approach

### SEO & Metadata

Each page implements Next.js Metadata API:
- Dynamic meta titles/descriptions from database SEO fields
- OpenGraph images for social sharing (`og_image_url`)
- Twitter Card support
- Pinterest-specific images (`pinterest_image_url`)
- Structured data via metadata
- Google Analytics integration via `@next/third-parties/google` (production only)

Check `src/app/layout.tsx` for global metadata template.

### Supabase Configuration

The Supabase client is configured with:
- URL: `https://pohyvwtrdxcutzljipuu.supabase.co`
- Anon key is public (stored in `src/lib/supabase.ts`)
- RLS (Row Level Security) policies enforce read-only access for public users
- Write access for authenticated users on `user_favorites` and `user_profiles`
- Database migrations in `supabase/migrations/`
- Full-text search on `blessings.content` using PostgreSQL `tsvector`

### Path Aliases

TypeScript is configured with `@/*` alias pointing to `src/*`:
```typescript
import { Blessing } from '@/types'
import { supabase } from '@/lib/supabase'
```

## Important Notes

- **Content Types**: Blessings have 3 types: `short`, `long`, `image`
- **Social Sharing**: ShareButtons component handles Facebook, Twitter, WhatsApp, LinkedIn, Pinterest
  - Each share action calls `trackShare()` to log analytics
  - Pinterest shares use `pinterest_image_url` if available, falls back to `og_image_url`
- **Analytics**: Track shares via `trackShare()` function which increments counters and logs to `share_analytics` table
- **Image Domains**: Next.js configured to allow images from `trae-api-sg.mchost.guru`
- **Routing**: Uses Next.js 15 App Router with nested dynamic routes and parallel routes
- **Search Query Sanitization**: `sanitizeSearchQuery()` removes special characters and joins words with `&` operator for PostgreSQL full-text search
- **ESLint**: Disabled during builds (`ignoreDuringBuilds: true`)
