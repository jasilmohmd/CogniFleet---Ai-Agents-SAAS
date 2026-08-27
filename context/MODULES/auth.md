# Auth Module

## Purpose
Authentication via Better Auth: email/password + OAuth (GitHub, Google).

## Key Files
| File | Purpose |
|------|---------|
| `src/lib/auth.ts` | Better Auth configuration |
| `ui/views/sign-in-view.tsx` | Sign in page |
| `ui/views/sign-up-view.tsx` | Sign up page |

## Better Auth Config (`src/lib/auth.ts`)
```typescript
export const auth = betterAuth({
  emailAndPassword: { enabled: true },
  database: drizzleAdapter(db, { provider: "pg", schema }),
  socialProviders: {
    github: { clientId, clientSecret },
    google: { clientId, clientSecret },
  },
})
```

## Database Tables (from Better Auth + Drizzle)
| Table | Purpose |
|-------|---------|
| `user` | Core user profile |
| `session` | Active sessions |
| `account` | OAuth account links |
| `verification` | Email verification tokens |

## tRPC Integration
- `src/trpc/init.ts` - `protectedProcedure` uses `auth.api.getSession(headers())`
- Session attached to context as `ctx.auth.user`
- All module procedures use `protectedProcedure`

## UI Patterns
- Client components (`"use client"`)
- React Hook Form + Zod for validation
- Form actions call Better Auth client methods
- Redirect on success via `useRouter`/`redirect`

## Environment Variables Required
```
DATABASE_URL
BETTER_AUTH_SECRET
GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET
GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET
NEXT_PUBLIC_STREAM_VIDEO_API_KEY
STREAM_VIDEO_SECRET_KEY
NEXT_PUBLIC_STREAM_CHAT_API_KEY
STREAM_CHAT_SECRET_KEY
```

## Session Handling
- Cookie-based sessions (HttpOnly, Secure)
- `auth.api.getSession({ headers })` validates on each tRPC call
- User ID available as `ctx.auth.user.id` in protected procedures