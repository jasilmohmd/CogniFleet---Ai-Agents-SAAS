# Home Module

## Purpose
Landing page for unauthenticated users.

## Key Files
| File | Purpose |
|------|---------|
| `ui/views/home-view.tsx` | Landing page component |

## Content
- Hero section with product name/description
- Call-to-action buttons (Sign In, Get Started)
- Feature highlights
- Footer

## Patterns
- Server component (no client directive needed)
- Static content, no data fetching
- Links to auth pages (`/sign-in`, `/sign-up`)
- Responsive design with Tailwind

## Route
- `/` (root) - renders in `app/page.tsx`