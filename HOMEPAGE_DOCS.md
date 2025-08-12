# Madina Islamic Art - Home Page Documentation

## Overview

Modern, SSR home page built with Next.js App Router, Tailwind CSS, shadcn/ui, and Motion animations. Features authentic Islamic art branding with accessibility-first design.

## Brand Colors

- **Sunrise Amber** (`#ff9a1a`) - Primary CTA, highlights
- **Midnight Slate** (`#141a24`) - Headers, footer, main text
- **Ironstone Gray** (`#263445`) - Dividers, backgrounds
- **Ocean Crest** (`#157fc0`) - Links, icons
- **Cloud Mist** (`#f5f5f5`) - Subtle backgrounds
- **Porcelain White** (`#ffffff`) - Clean text and backgrounds

## Typography

- **Inter** - Body text, descriptions, UI elements
- **Poppins** - Headings, navigation, important text
- **Playfair Display** - Brand name "Madina Islamic Art"

## Components

### 1. HeroBanner (`/components/HeroBanner.tsx`)

**Features:**

- Auto-rotating banners with 5s intervals
- Pause on hover + swipe support on mobile
- Smooth fade/slide transitions
- Play/pause controls
- Navigation dots and arrows
- Responsive overlay content
- Sanity CMS integration ready

**Props:**

```typescript
interface HeroBannerProps {
  banners: Banner[];
  autoplayInterval?: number;
  className?: string;
}
```

### 2. CategoriesGrid (`/components/CategoriesGrid.tsx`)

**Features:**

- Circular category tiles
- Hover effects with lift and shadow
- Motion animations on scroll
- Links to `/collection/[slug]`
- Responsive grid layout
- Product count display

**Props:**

```typescript
interface CategoriesGridProps {
  categories: Category[];
  className?: string;
  maxItems?: number;
}
```

### 3. SectionHeader (`/components/SectionHeader.tsx`)

**Features:**

- Consistent section styling
- Left/center alignment options
- Subtitle support
- Responsive typography

**Props:**

```typescript
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  alignment?: "left" | "center";
}
```

### 4. ReviewsStrip (`/components/ReviewsStrip.tsx`)

**Features:**

- Customer review cards
- Star ratings
- Avatar support with initials fallback
- Verified badge system
- Location and date display
- Motion animations

**Props:**

```typescript
interface ReviewsStripProps {
  reviews: Review[];
  className?: string;
  maxItems?: number;
}
```

## Home Page Structure

### Sections:

1. **Hero Banner** - Auto-rotating image carousel with CTAs
2. **Categories** - Circular category tiles with hover effects
3. **Most Popular** - Product carousel with auto-play
4. **Trending Now** - Secondary product carousel
5. **Customer Reviews** - Social proof testimonials
6. **Call to Action** - Final conversion section

### SSR Implementation:

- Server-side rendering for SEO
- Suspense boundaries for loading states
- Optimized image loading
- Progressive enhancement

## Sanity CMS Integration

### Schema Requirements:

```javascript
// Banner schema
{
  name: 'banner',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'subtitle', type: 'string' },
    { name: 'image', type: 'image' },
    { name: 'cta', type: 'object' },
    { name: 'isActive', type: 'boolean' },
    { name: 'order', type: 'number' }
  ]
}

// Category schema
{
  name: 'category',
  fields: [
    { name: 'name', type: 'string' },
    { name: 'slug', type: 'slug' },
    { name: 'image', type: 'image' },
    { name: 'description', type: 'text' }
  ]
}
```

### Queries Available:

- `BANNERS_QUERY` - Active banners ordered by priority
- `CATEGORIES_QUERY` - All categories with product counts
- `PRODUCTS_QUERY` - All products with category info
- `FEATURED_PRODUCTS_QUERY` - Featured/trending products
- `REVIEWS_QUERY` - Approved customer reviews

## Accessibility Features

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly
- Focus management
- High contrast ratios
- Responsive design

## Performance Optimizations

- Image optimization with Next.js
- Lazy loading with Suspense
- Efficient re-renders with React keys
- Optimized bundle splitting
- CSS-in-JS with Tailwind

## Usage

### Basic Implementation:

```tsx
import { HeroBanner, demoBanners } from "@/components/HeroBanner";
import { CategoriesGrid, demoCategories } from "@/components/CategoriesGrid";

export default function Home() {
  return (
    <div>
      <HeroBanner banners={demoBanners} />
      <CategoriesGrid categories={demoCategories} />
    </div>
  );
}
```

### With Sanity Data:

```tsx
import { getBanners, getCategories } from "@/lib/sanity/fetch";

export default async function Home() {
  const [banners, categories] = await Promise.all([
    getBanners(),
    getCategories(),
  ]);

  return (
    <div>
      <HeroBanner banners={banners} />
      <CategoriesGrid categories={categories} />
    </div>
  );
}
```

## Development Notes

- All components are fully typed with TypeScript
- Demo data provided for development/testing
- Responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Motion animations use the `motion` package (v12.23.12)
- Compatible with Next.js 15.4.6 and React 19.1.0
